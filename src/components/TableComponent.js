import React, { useContext, useEffect, useMemo, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import '../styles/components.css';
import '../styles/common.css';
import Alert from './Alert';
import { RightsContext } from '../contexts/RightsProvider';
import AutoComplete from './AutoCompleteInputComponent';
import Input from './InputComponet';
import SendSms from './SendSmsComponent';
import BulkEmails from './BulkEmailsComponent';
import PrintableTable from './PrintableTable';
import PrintSelectionDialogue from './PrintSelectionComponent';
import { courses } from '../courses';
import '../styles/TableComponent.css';

const PRINT_FIELD_LABELS = {
  no: 'No',
  name: 'Name',
  gender: 'Gender',
  contact: 'Phone Number',
  course: 'Course',
  reg_no: 'Reg_no',
  occupation: 'Occupation',
  profession: 'Profession',
  email: 'Email',
  hall: 'Hall of Attachment',
  residence: 'Residence',
};

/**
 * Builds a full, self-contained HTML document (including its own <style>
 * block) for the print job, reusing the exact same PrintableTable markup
 * the app already has via renderToStaticMarkup — so the printed page and
 * the on-screen component can never drift apart, and we don't duplicate
 * the row-rendering logic in two places.
 */
const buildPrintDocument = (rightsValue, fields, printColumns, dataToPrint) => {
  const bodyMarkup = renderToStaticMarkup(
    <RightsContext.Provider value={{ rights: rightsValue }}>
      <PrintableTable fields={fields} table_data={dataToPrint} columns={printColumns} />
    </RightsContext.Provider>
  );

  // Previously this table was printed via document.write() with NO styling
  // at all — just a bare, unstyled HTML table. This gives the print output
  // real borders/spacing/colors matching the rest of the app.
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>KMCS Members</title>
    <style>
      * { box-sizing: border-box; }
      body { font-family: Arial, Helvetica, sans-serif; color: #1f2937; padding: 24px; }
      h2 { color: #065F46; margin: 4px 0; }
      p { margin: 2px 0; }
      table { width: 100%; border-collapse: collapse; margin-top: 14px; }
      th, td { border: 1px solid #065F46; padding: 6px 10px; text-align: left; font-size: 13px; }
      thead th { background: #065F46; color: #fff; }
      .print-footer { margin-top: 40px; }
      @page { margin: 1.5cm; }
    </style>
  </head>
  <body>${bodyMarkup}</body>
</html>`;
};

/**
 * Prints via a hidden iframe rather than window.open()+document.write().
 * Two concrete problems with the old approach:
 *  1. window.open() was called from inside a useEffect, several renders
 *     removed from the user's actual click (open dialog -> pick fields ->
 *     click Confirm -> setState -> re-render -> effect runs -> THEN
 *     window.open()). Modern browsers' popup blockers specifically target
 *     window.open() calls that aren't a direct, synchronous result of a
 *     user gesture, so Print could silently do nothing with no error at
 *     all. A hidden iframe is never treated as a popup, so this can't
 *     happen regardless of timing.
 *  2. document.write() on a blank window is a deprecated pattern with
 *     inconsistent behaviour across browsers.
 */
const printViaIframe = (html) => {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const cleanup = () => {
    if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
  };

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();

  iframe.contentWindow.onafterprint = cleanup;
  // Fallback in case a browser doesn't fire onafterprint (e.g. the user
  // cancels the print dialog in a way that skips it) — never leaves the
  // hidden iframe sitting in the page indefinitely.
  setTimeout(cleanup, 5000);

  // doc.write()/doc.close() are synchronous, but a couple of browsers
  // (Firefox especially) need a tick before the iframe's layout is ready
  // for print() to reliably capture it.
  setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  }, 50);
};

const TableComponent = ({ columns, student_columns, alumnus_columns, table_data, memberClick }) => {
  const { rights } = useContext(RightsContext);
  const [smsDialogue, setSmsDialogue] = useState(false);
  const [emailDialogue, setEmailDialogue] = useState(false);
  const [courseCode, setCourseCode] = useState('');
  const [info, setInfo] = useState(false);
  const [printSelection, setPrintSelection] = useState(false);
  const [smsRes, setSmsRes] = useState('');
  const [entry, setEntry] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [residenceFilter, setResidenceFilter] = useState('');
  const [occupationFilter, setOccupationFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  // Bumping this remounts <AutoComplete>, which owns its own internal text
  // box with no prop the parent can use to clear it directly — a full
  // remount is the standard, low-risk way to reset a component's internal
  // state from outside without changing that component itself.
  const [resetKey, setResetKey] = useState(0);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const isAlumniView = !!rights.perm.type;
  const effectiveColumns = (student_columns && alumnus_columns)
    ? (isAlumniView ? alumnus_columns : student_columns)
    : columns;

  // Once we've ever received a page of data, never show "Loading" again —
  // a filter/search producing zero matches is a real, valid result, not a
  // stuck loading state. Previously "isLoading" was derived from whether
  // the *filtered* array had any rows, so a legitimate "no matches" filter
  // was indistinguishable from "still loading" and showed the same message
  // forever.
  useEffect(() => {
    if (table_data.length > 0) setHasLoadedOnce(true);
  }, [table_data]);

  // Student rows need a `course` name looked up from their reg_no; alumni
  // rows need nothing extra. This is a plain derived value (useMemo), not
  // a copy held in state — it can never go stale relative to table_data,
  // and background polling that adds more rows to table_data is reflected
  // automatically without needing any kind of manual "resync" step.
  const enrichedData = useMemo(() => {
    if (isAlumniView) return table_data;
    return table_data.map((item) => {
      const regCode = item.reg_no ? item.reg_no.split('_')[2] : undefined;
      const course = courses.find((c) => c.day === regCode || c.eve === regCode);
      return { ...item, course: course ? course.name : '' };
    });
  }, [table_data, isAlumniView]);

  const matchesDropdownFilters = (item) => {
    if (genderFilter !== 'all') {
      const itemGender = item.gender ? 'F' : 'M';
      if (itemGender !== genderFilter) return false;
    }
    if (residenceFilter.trim()) {
      const residence = (isAlumniView
        ? item.residence_address
        : (item.residence_address || item.hall_of_attachment)) || '';
      if (!residence.toLowerCase().includes(residenceFilter.trim().toLowerCase())) return false;
    }
    if (isAlumniView && occupationFilter.trim()) {
      const occ = `${item.occupation || ''} ${item.proffession || ''}`.toLowerCase();
      if (!occ.includes(occupationFilter.trim().toLowerCase())) return false;
    }
    if (courseCode || entry) {
      const course = courses.find((c) => c.day === courseCode || c.eve === courseCode);
      const regParts = item.reg_no ? item.reg_no.split('_') : [];
      if (courseCode && course && regParts[2] !== course.day && regParts[2] !== course.eve) {
        return false;
      }
      if (entry && regParts[0] !== entry) return false;
    }
    return true;
  };

  const matchesSearch = (item) => {
    if (!searchTerm.trim()) return true;
    const lowerKeyword = searchTerm.trim().toLowerCase();
    const combinedString = [
      item.sur_name, item.first_name, item.other_name, item.reg_no,
      item.occupation, item.proffession, item.hall_of_attachment,
      item.residence_address, item.user?.contact, item.user?.email,
    ].filter(Boolean).join(' ').toLowerCase();
    return combinedString.includes(lowerKeyword);
  };

  // Single source of truth: every filter/search criterion is independent
  // state, and the visible rows are always recomputed fresh from the full
  // enriched dataset (never from a previously-filtered array). This is
  // the actual fix for "Reset doesn't work well" — the old version stored
  // the *result* of filtering/searching in state and mutated it in place,
  // so:
  //   - typing then deleting characters in Search could never bring back
  //     rows it had already filtered out, since each keystroke searched
  //     within the previous (already-narrowed) result, not the full list;
  //   - a background poll that added more rows silently reset whatever
  //     filter/search was active, because the effect that merged new data
  //     in always recomputed from scratch;
  //   - Reset had to work around this with a "setLoad(!load)" trick that
  //     only reset the dropdown filters, not the Search box's own text or
  //     the Course autocomplete's own text.
  // With filtering as a pure computation over live state, Reset is just
  // "clear every criterion" — nothing to work around.
  const visibleData = useMemo(
    () => enrichedData.filter((item) => matchesDropdownFilters(item) && matchesSearch(item)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [enrichedData, genderFilter, residenceFilter, occupationFilter, courseCode, entry, searchTerm]
  );

  const resetFilters = () => {
    setGenderFilter('all');
    setResidenceFilter('');
    setOccupationFilter('');
    setEntry('');
    setCourseCode('');
    setSearchTerm('');
    setResetKey((k) => k + 1);
  };

  const onFieldSelection = (fields) => {
    const printColumns = [];
    Object.entries(fields).forEach(([key, value]) => {
      if (value) printColumns.push({ name: PRINT_FIELD_LABELS[key] });
    });
    setPrintSelection(false);
    // Printing happens synchronously, right here in the same click handler
    // as Confirm — see printViaIframe()'s comment for why that matters.
    // "What's currently on screen" (visibleData) is what gets printed,
    // same as Send SMS / Send Emails below.
    const html = buildPrintDocument(rights, fields, printColumns, visibleData);
    printViaIframe(html);
  };

  const openMessage = () => setSmsDialogue(true);
  const onSmsCancel = () => setSmsDialogue(false);
  const onSmsSend = (message) => {
    setSmsRes(message);
    setSmsDialogue(false);
    setInfo(true);
  };
  const onEmailSend = (message) => {
    setSmsRes(message);
    setEmailDialogue(false);
    setInfo(true);
  };

  return (
    <div className="members-table-page">
      {smsDialogue && (
        <SendSms
          onSend={onSmsSend}
          onCancel={onSmsCancel}
          recipients={visibleData}
        />
      )}
      {emailDialogue && (
        <BulkEmails
          onSend={onEmailSend}
          onCancel={() => setEmailDialogue(false)}
          recipients={visibleData}
        />
      )}
      {info && (
        <Alert
          message={smsRes}
          onCancel={() => {
            setSmsRes('');
            setInfo(false);
          }}
        />
      )}
      {printSelection && (
        <PrintSelectionDialogue
          onCancel={() => setPrintSelection(false)}
          onConfirm={onFieldSelection}
        />
      )}

      <div className="members-table-wrapper">
        <div className="members-filter-bar">
          <div className="button-group">
            {rights.perm.messages >= 4 && (
              <>
                <button className="action-btn" onClick={() => setPrintSelection(true)}>🖨 Print</button>
                <button className="action-btn" onClick={() => setEmailDialogue(true)}>📧 Send Emails</button>
                <button className="action-btn" onClick={openMessage}>💬 Send SMS</button>
              </>
            )}
          </div>

          <div className="filter-table">
            <Input
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="Entry i.e. 11, 12, 13..."
            />
            <AutoComplete key={resetKey} setValue={(code) => setCourseCode(code)} />
            <select
              className="members-filter-select"
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
            >
              <option value="all">All Genders</option>
              <option value="F">Female</option>
              <option value="M">Male</option>
            </select>
            <Input
              value={residenceFilter}
              onChange={(e) => setResidenceFilter(e.target.value)}
              placeholder={isAlumniView ? 'Residence' : 'Residence / Hall'}
            />
            {isAlumniView && (
              <Input
                value={occupationFilter}
                onChange={(e) => setOccupationFilter(e.target.value)}
                placeholder="Occupation / Profession"
              />
            )}
            <button className="filter-btn filter-btn-reset" onClick={resetFilters}>Reset</button>
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by keyword"
            />
          </div>
        </div>

        <div className="members-table-container">
          <table>
            <thead>
              <tr>
                {effectiveColumns && effectiveColumns.map((item, index) => (
                  <th key={index}>{item.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!hasLoadedOnce ? (
                <tr><td colSpan={effectiveColumns?.length || 7}><b>Loading data...</b></td></tr>
              ) : visibleData.length === 0 ? (
                <tr>
                  <td colSpan={effectiveColumns?.length || 7} className="members-empty-state">
                    No members match your search or filters.
                  </td>
                </tr>
              ) : isAlumniView ? (
                visibleData.map((member, key) => (
                  <tr key={member.id}>
                    <td>{key + 1}</td>
                    <td className="member-click" onClick={() => memberClick(member.id)}>
                      {member.sur_name + ' ' + member.first_name}
                    </td>
                    <td>{member.gender ? 'F' : 'M'}</td>
                    <td>{member.residence_address || 'Unknown'}</td>
                    <td>{member.occupation || 'Unknown'}</td>
                    <td>{member.proffession || 'Unknown'}</td>
                    <td>{member.user?.email ?? ''}</td>
                  </tr>
                ))
              ) : (
                visibleData.map((member, key) => (
                  <tr key={member.id}>
                    <td>{key + 1}</td>
                    <td className="member-click" onClick={() => memberClick(member.id)}>
                      {member.sur_name + ' ' + member.first_name}
                    </td>
                    <td>{member.gender ? 'F' : 'M'}</td>
                    <td>{member.course || 'Unknown'}</td>
                    <td>{member.residence_address || member.hall_of_attachment || 'Unknown'}</td>
                    <td>{member.hall_of_attachment || 'Unknown'}</td>
                    <td>{member.user?.email ?? ''}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableComponent;
