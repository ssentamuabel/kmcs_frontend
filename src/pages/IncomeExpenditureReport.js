import React, { useEffect, useState, useCallback } from 'react';
import { CONFIG } from '../config';
import '../styles/reports.css';
import { FaChartLine, FaCalendar, FaLayerGroup, FaArrowUp, FaArrowDown, FaBalanceScale } from 'react-icons/fa';

const GROUP_LABELS = { program: 'Program', fund_source: 'Fund Source', department: 'Department' };

const IncomeExpenditureReport = () => {
  const [groupBy, setGroupBy] = useState('program');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [groups, setGroups] = useState([]);
  const [totals, setTotals] = useState({ total_income: 0, total_expenditure: 0, net: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX', maximumFractionDigits: 0 }).format(amount || 0);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ group_by: groupBy });
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      const res = await fetch(`${CONFIG.backend_url}/finance/reports/income-expenditure/?${params.toString()}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load report');
      const data = await res.json();
      setGroups(data.groups || []);
      setTotals({ total_income: data.total_income, total_expenditure: data.total_expenditure, net: data.net });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [groupBy, startDate, endDate]);

  useEffect(() => { fetchReport(); }, [fetchReport]);

  return (
    <div className="report-container">
      <header className="report-header">
        <div className="title-icon"><FaChartLine /></div>
        <div>
          <h1>Income &amp; Expenditure</h1>
          <p>Totals for a period, grouped by program, fund source, or department</p>
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
          <FaLayerGroup />
          <select value={groupBy} onChange={e => setGroupBy(e.target.value)}>
            <option value="program">By Program</option>
            <option value="fund_source">By Fund Source</option>
            <option value="department">By Department</option>
          </select>
        </div>
      </div>

      <div className="report-summary-row">
        <div className="summary-card">
          <span className="summary-icon summary-icon-income"><FaArrowUp /></span>
          <span className="summary-label">Total Income</span>
          <span className="summary-value">{formatCurrency(totals.total_income)}</span>
        </div>
        <div className="summary-card">
          <span className="summary-icon summary-icon-expense"><FaArrowDown /></span>
          <span className="summary-label">Total Expenditure</span>
          <span className="summary-value">{formatCurrency(totals.total_expenditure)}</span>
        </div>
        <div className="summary-card summary-card-primary">
          <span className="summary-icon"><FaBalanceScale /></span>
          <span className="summary-label">Net Position</span>
          <span className={`summary-value ${totals.net < 0 ? 'negative' : ''}`}>{formatCurrency(totals.net)}</span>
        </div>
      </div>

      {error && <div className="report-error">{error}</div>}

      <div className="report-table-container">
        <table className="report-table">
          <thead>
            <tr>
              <th>{GROUP_LABELS[groupBy]}</th>
              <th className="align-right">Income</th>
              <th className="align-right">Expenditure</th>
              <th className="align-right">Net</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="report-empty">Loading…</td></tr>
            ) : groups.length === 0 ? (
              <tr><td colSpan="4" className="report-empty">No posted transactions in this range</td></tr>
            ) : (
              groups.map(g => (
                <tr key={g.id ?? g.name}>
                  <td>{g.name || 'Unassigned'}</td>
                  <td className="align-right credit">{formatCurrency(g.income)}</td>
                  <td className="align-right debit">{formatCurrency(g.expenditure)}</td>
                  <td className={`align-right ${g.net < 0 ? 'negative' : ''}`}>{formatCurrency(g.net)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncomeExpenditureReport;
