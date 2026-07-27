import React, { useEffect, useState, useCallback } from 'react';
import { CONFIG } from '../config';
import '../styles/reports.css';
import { FaBook, FaCalendar, FaFilter } from 'react-icons/fa';

const VOUCHER_LABELS = { INCOME: 'Income', EXPENSE: 'Expense', TRANSFER: 'Transfer', GENERAL: 'General' };

const CashBookReport = () => {
  const [rows, setRows] = useState([]);
  const [opening, setOpening] = useState(0);
  const [closing, setClosing] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX', maximumFractionDigits: 0 }).format(amount || 0);

  useEffect(() => {
    fetch(`${CONFIG.backend_url}/finance/accounts/`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : { results: [] })
      .then(data => setAccounts(data.results || data || []))
      .catch(() => {});
  }, []);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      if (accountId) params.append('account_id', accountId);
      const res = await fetch(`${CONFIG.backend_url}/finance/reports/cash-book/?${params.toString()}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load cash book');
      const data = await res.json();
      setRows(data.rows || []);
      setOpening(data.opening_balance || 0);
      setClosing(data.closing_balance || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, accountId]);

  useEffect(() => { fetchReport(); }, [fetchReport]);

  return (
    <div className="report-container">
      <header className="report-header">
        <div className="title-icon"><FaBook /></div>
        <div>
          <h1>Cash Book</h1>
          <p>Every posted voucher, in date order, with running balance</p>
        </div>
      </header>

      <div className="report-filters">
        <div className="filter-item">
          <FaCalendar />
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>
        <div className="filter-item">
          <FaCalendar />
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
        <div className="filter-item">
          <FaFilter />
          <select value={accountId} onChange={e => setAccountId(e.target.value)}>
            <option value="">All Accounts</option>
            {accounts.map(a => <option key={a.id} value={a.id}>{a.code} — {a.name}</option>)}
          </select>
        </div>
      </div>

      <div className="report-summary-row">
        <div className="summary-card">
          <span className="summary-label">Opening Balance</span>
          <span className="summary-value">{formatCurrency(opening)}</span>
        </div>
        <div className="summary-card summary-card-primary">
          <span className="summary-label">Closing Balance</span>
          <span className="summary-value">{formatCurrency(closing)}</span>
        </div>
      </div>

      {error && <div className="report-error">{error}</div>}

      <div className="report-table-container">
        <table className="report-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Reference</th>
              <th>Type</th>
              <th>Account</th>
              <th>Description</th>
              <th className="align-right">Amount</th>
              <th className="align-right">Running Balance</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="report-empty">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan="7" className="report-empty">No posted transactions in this range</td></tr>
            ) : (
              rows.slice().reverse().map(row => (
                <tr key={row.id}>
                  <td>{row.date}</td>
                  <td>{row.reference}</td>
                  <td><span className="voucher-type-badge">{VOUCHER_LABELS[row.voucher_type] || 'General'}</span></td>
                  <td>{row.account_name}</td>
                  <td>{row.entry_description}</td>
                  <td className={`align-right ${row.entry_type}`}>
                    {row.entry_type === 'debit' ? '-' : '+'}{formatCurrency(row.amount)}
                  </td>
                  <td className="align-right">{formatCurrency(row.running_balance)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CashBookReport;
