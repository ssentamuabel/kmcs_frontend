import React, { useContext, useEffect, useState } from 'react';
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
import Button from './Button';
import { courses } from '../courses';
import '../styles/TableComponent.css'; // 👈 Add this new CSS file

const TableComponent = ({ columns, student_columns, alumnus_columns, table_data, memberClick }) => {
  const { rights } = useContext(RightsContext);
  const [studentsData, setStudentsData] = useState([]);
  const [smsDialogue, setSmsDialogue] = useState(false);
  const [emailDialogue, setEmailDialogue] = useState(false);
  const [courseCode, setCourseCode] = useState('');
  const [info, setInfo] = useState(false);
  const [printSelection, setPrintSelection] = useState(false);
  const [smsRes, setSmsRes] = useState('');
  const [load, setLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [entry, setEntry] = useState('');
  const [alumniFilter, setAlumniFilter] = useState([]);
  const [printFields, setPrintFields] = useState({});
  const [printColumns, setPrintColumns] = useState({});
  const [print, setPrint] = useState(false);
  // These correspond to the actual columns shown in the table below —
  // previously the only filters were "Entry" (registration year) and
  // "Course", which don't match any visible column for the alumni view,
  // and left Gender/Residence/Hall/Occupation with no way to filter at all.
  const [genderFilter, setGenderFilter] = useState('all');
  const [residenceFilter, setResidenceFilter] = useState('');
  const [occupationFilter, setOccupationFilter] = useState('');
  // The system is strictly two-sided (Student / Alumni), each with its own
  // roles, so which view to show is a direct read of the logged-in role.
  const isAlumniView = !!rights.perm.type;
  const effectiveColumns = (student_columns && alumnus_columns)
    ? (isAlumniView ? alumnus_columns : student_columns)
    : columns;

  useEffect(() => {
    if (!rights.perm.type) {
      const updatedStudentsData = table_data.map((item) => {
        const course = courses.find(
          (course) =>
            course.day === item.reg_no.split('_')[2] ||
            course.eve === item.reg_no.split('_')[2]
        );
        return { ...item, course: course ? course.name : '' };
      });
      setStudentsData(updatedStudentsData);
    } else {
      setAlumniFilter(table_data);
    }
  }, [table_data, rights.perm.type, load]);

  useEffect(() => {
    if (rights.perm.type && alumniFilter.length > 0) {
      setIsLoading(false);
    } else if (!rights.perm.type && studentsData.length > 0) {
      setIsLoading(false);
    }
  }, [alumniFilter, studentsData, rights.perm.type]);

  const matchesNewFilters = (item, isAlumni) => {
    if (genderFilter !== 'all') {
      const itemGender = item.gender ? 'F' : 'M';
      if (itemGender !== genderFilter) return false;
    }
    if (residenceFilter.trim()) {
      const residence = (isAlumni
        ? item.residence_address
        : (item.residence_address || item.hall_of_attachment)) || '';
      if (!residence.toLowerCase().includes(residenceFilter.trim().toLowerCase())) return false;
    }
    if (isAlumni && occupationFilter.trim()) {
      const occ = `${item.occupation || ''} ${item.proffession || ''}`.toLowerCase();
      if (!occ.includes(occupationFilter.trim().toLowerCase())) return false;
    }
    return true;
  };

  const handleFilter = () => {
    const course = courses.find(
      (course) => course.day === courseCode || course.eve === courseCode
    );
    if (rights.perm.type) {
      const filteredData = table_data.filter((item) => {
        if (!matchesNewFilters(item, true)) return false;
        if (courseCode && entry) {
          return (
            (item.reg_no.split('_')[2] === course.day ||
              item.reg_no.split('_')[2] === course.eve) &&
            item.reg_no.split('_')[0] === entry
          );
        } else if (courseCode) {
          return (
            item.reg_no.split('_')[2] === course.day ||
            item.reg_no.split('_')[2] === course.eve
          );
        } else if (entry) {
          return item.reg_no.split('_')[0] === entry;
        }
        return item;
      });
      setAlumniFilter(filteredData);
    } else {
      const filteredData = studentsData.filter((item) => {
        if (!matchesNewFilters(item, false)) return false;
        if (courseCode && entry) {
          return (
            (item.reg_no.split('_')[2] === course.day ||
              item.reg_no.split('_')[2] === course.eve) &&
            item.reg_no.split('_')[0] === entry
          );
        } else if (courseCode) {
          return (
            item.reg_no.split('_')[2] === course.day ||
            item.reg_no.split('_')[2] === course.eve
          );
        } else if (entry) {
          return item.reg_no.split('_')[0] === entry;
        }
        return item;
      });
      setStudentsData(filteredData);
    }
  };

  const resetFilters = () => {
    setGenderFilter('all');
    setResidenceFilter('');
    setOccupationFilter('');
    setEntry('');
    setCourseCode('');
    setLoad(!load); // re-runs the enrichment effect, restoring the full unfiltered set
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    if (rights.perm.type) {
      setAlumniFilter(filterByKeyword(alumniFilter, value));
    } else {
      setStudentsData(filterByKeyword(studentsData, value));
    }
  };

  const filterByKeyword = (data, keyword) => {
    if (!keyword.trim()) return data;
    const lowerKeyword = keyword.toLowerCase();
    return data.filter((item) => {
      const combinedString = `
        ${item.sur_name}
        ${item.first_name}
        ${item.other_name}
        ${item.reg_no}
        ${item.occupation || ''}
        ${item.proffession || ''}
        ${item.hall_of_attachment || ''}
        ${item.residence_address || ''}
        ${item.user.contact}
        ${item.user.email}
      `.toLowerCase();
      return combinedString.includes(lowerKeyword);
    });
  };

  const onFieldSelection = (fields) => {
    setPrintFields(fields);
    const columns = [];
    const labels = {
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
    Object.entries(fields).forEach(([key, value], index) => {
      if (value) {
        columns.push({ id: index + 1, name: labels[key] });
      }
    });
    setPrintColumns(columns);
    setPrintSelection(false);
    setPrint(true);
  };

  useEffect(() => {
    if (print) {
      handlePrint();
      setPrint(false);
    }
  }, [print]);

  const handlePrint = () => {
    const printableElement = document.getElementById('printablediv');
    if (!printableElement) return;
    const printContents = printableElement.innerHTML;
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.open();
      newWindow.document.write(`
        <html>
          <head><title>KMCS</title></head>
          <body onload="window.print(); window.close();">
            ${printContents}
          </body>
        </html>
      `);
      newWindow.document.close();
    }
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
    <div className="page-container">
      {smsDialogue && (
        <SendSms
          onSend={onSmsSend}
          onCancel={onSmsCancel}
          recipients={isAlumniView ? alumniFilter : studentsData}
        />
      )}
      {emailDialogue && (
        <BulkEmails
          onSend={onEmailSend}
          onCancel={() => setEmailDialogue(false)}
          recipients={isAlumniView ? alumniFilter : studentsData}
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

      <div className="tabular-wrapper">
        <div className="filter-section">
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
              onChange={(e) => {
                setEntry(e.target.value);
                setLoad(!load);
              }}
              placeholder="Entry i.e. 11, 12, 13..."
            />
            <AutoComplete setValue={(code) => setCourseCode(code)} />
            <select
              className="filter-select"
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
            <button className="filter-btn" onClick={handleFilter}>Filter</button>
            <button className="filter-btn filter-btn-reset" onClick={resetFilters}>Reset</button>
            <Input placeholder="Search by keyword" onChange={handleSearch} />
          </div>
        </div>

        <div className="table-container beautiful-table">
          <table>
            <thead>
              <tr>
                {effectiveColumns && effectiveColumns.map((item, index) => (
                  <th key={index}>{item.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rights.perm.type
                ? alumniFilter.length > 0 && !isLoading
                  ? alumniFilter.map((member, key) => (
                      <tr key={member.id}>
                        <td>{key + 1}</td>
                        <td id="member-click" onClick={() => memberClick(member.id)}>
                          {member.sur_name + ' ' + member.first_name}
                        </td>
                        <td>{member.gender ? 'F' : 'M'}</td>
                        <td>{member.residence_address || 'Unknown'}</td>
                        <td>{member.occupation || member.proffession || 'Unknown'}</td>
                        <td>{member.proffession || member.occupation || 'Unknown'}</td>
                        <td>{member.user.email}</td>
                      </tr>
                    ))
                  : (
                    <tr><td colSpan={7}><b>{isLoading && 'Loading data...'}</b></td></tr>
                  )
                : studentsData.length > 0 && !isLoading
                ? studentsData.map((member, key) => (
                    <tr key={member.id}>
                      <td>{key + 1}</td>
                      <td id="member-click" onClick={() => memberClick(member.id)}>
                        {member.sur_name + ' ' + member.first_name}
                      </td>
                      <td>{member.gender ? 'F' : 'M'}</td>
                      <td>{member.course || 'Unknown'}</td>
                      <td>{member.residence_address || member.hall_of_attachment || 'Unknown'}</td>
                      <td>{member.hall_of_attachment || 'Unknown'}</td>
                      <td>{member.user.email}</td>
                    </tr>
                  ))
                : (
                  <tr><td colSpan={7}><b>{isLoading && 'Loading data...'}</b></td></tr>
                )}
            </tbody>
          </table>
        </div>

        {print && (
          <div id="printablediv">
            <PrintableTable
              fields={printFields}
              table_data={isAlumniView ? alumniFilter : studentsData}
              columns={printColumns}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TableComponent;
