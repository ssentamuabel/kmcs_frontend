import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CONFIG } from '../config';
import '../styles/finance.css';
import {
  FaCashRegister,
  FaUniversity,
  FaPlus,
  FaArrowRight,
  FaCalendar,
  FaHashtag,
  FaFileAlt,
  FaChartLine,
  FaExclamationTriangle,
  FaWallet,
  FaCreditCard,
  FaArrowUp,
  FaArrowDown,
  FaBook,
  FaBalanceScale,
  FaLock,
  FaClock
} from 'react-icons/fa';

const VOUCHER_LABELS = { INCOME: 'Income', EXPENSE: 'Expense', TRANSFER: 'Transfer', GENERAL: 'General' };

const FinanceDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalFunds: 0,
    totalBank: 0,
    cashOnHand: 0,
    cashAccounts: [],
    bankAccounts: [],
    recentEntries: [],
  });
  const [monthSummary, setMonthSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const today = now.toISOString().split('T')[0];

        const [dashRes, monthRes] = await Promise.all([
          fetch(`${CONFIG.backend_url}/api/finance/dashboard/`, { credentials: 'include' }),
          fetch(`${CONFIG.backend_url}/finance/reports/income-expenditure/?start_date=${startOfMonth}&end_date=${today}`, { credentials: 'include' }),
        ]);

        if (!dashRes.ok) throw new Error(`HTTP error! status: ${dashRes.status}`);
        const dashData = await dashRes.json();
        setDashboardData(dashData);

        if (monthRes.ok) {
          const monthData = await monthRes.json();
          setMonthSummary(monthData);
        }
      } catch (err) {
        console.error('Error fetching finance data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getBalanceClass = (amount) => {
    if (amount > 0) return 'positive';
    if (amount < 0) return 'negative';
    return 'zero';
  };

  if (loading) {
    return (
      <div className="finance-loading">
        <div className="loading-spinner"></div>
        <p>Loading Financial Data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="finance-error">
        <FaExclamationTriangle size={48} color="#e74c3c" />
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="finance-container">
      {/* Header */}
      <header className="finance-header">
        <div className="header-content">
          <div className="header-title">
            <div className="title-icon">
              <FaCashRegister />
            </div>
            <div>
              <h1>Finance Dashboard</h1>
              <p className="header-subtitle">Real-time financial position — posted transactions only</p>
            </div>
          </div>

          <Link to="/finance/journal/new" className="btn btn-primary btn-with-icon">
            <FaPlus />
            <span>New Journal Entry</span>
          </Link>
        </div>
      </header>

      {/* KPI Row */}
      <section className="kpi-grid">
        <div className="kpi-card kpi-primary">
          <div className="kpi-icon"><FaUniversity /></div>
          <div className="kpi-body">
            <span className="kpi-label">Total Available Funds</span>
            <span className="kpi-value">{formatCurrency(dashboardData.totalFunds)}</span>
            <span className="kpi-caption">Bank + Cash, all accounts</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon"><FaCreditCard /></div>
          <div className="kpi-body">
            <span className="kpi-label">Bank Balance</span>
            <span className="kpi-value">{formatCurrency(dashboardData.totalBank)}</span>
            <span className="kpi-caption">{dashboardData.bankAccounts?.length || 0} account(s)</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon"><FaWallet /></div>
          <div className="kpi-body">
            <span className="kpi-label">Cash on Hand</span>
            <span className="kpi-value">{formatCurrency(dashboardData.cashOnHand)}</span>
            <span className="kpi-caption">{dashboardData.cashAccounts?.length || 0} account(s)</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon"><FaBalanceScale /></div>
          <div className="kpi-body">
            <span className="kpi-label">This Month — Net</span>
            <span className={`kpi-value ${monthSummary && monthSummary.net < 0 ? 'kpi-negative' : ''}`}>
              {monthSummary ? formatCurrency(monthSummary.net) : '—'}
            </span>
            <span className="kpi-caption">
              {monthSummary
                ? `In: ${formatCurrency(monthSummary.total_income)} · Out: ${formatCurrency(monthSummary.total_expenditure)}`
                : 'Income & expenditure, this month'}
            </span>
          </div>
        </div>
      </section>

      {/* Account Details Section */}
      <div className="account-details-section">
        <div className="accounts-panel cash-accounts">
          <div className="panel-header">
            <h3><FaWallet /> Cash Accounts</h3>
            <Link to="/finance/accounts" className="panel-link">Manage <FaArrowRight /></Link>
          </div>
          <div className="accounts-list">
            {dashboardData.cashAccounts && dashboardData.cashAccounts.length > 0 ? (
              dashboardData.cashAccounts.map(account => (
                <Link key={account.id} to={`/finance/accounts/${account.id}/transactions`} className="account-item">
                  <div className="account-info">
                    <div className="account-code">{account.code}</div>
                    <div className="account-name">{account.name}</div>
                  </div>
                  <div className={`account-balance ${getBalanceClass(account.balance)}`}>
                    {formatCurrency(account.balance)}
                  </div>
                </Link>
              ))
            ) : (
              <div className="no-accounts"><p>No cash accounts found</p></div>
            )}
          </div>
        </div>

        <div className="accounts-panel bank-accounts">
          <div className="panel-header">
            <h3><FaCreditCard /> Bank Accounts</h3>
            <Link to="/finance/accounts" className="panel-link">Manage <FaArrowRight /></Link>
          </div>
          <div className="accounts-list">
            {dashboardData.bankAccounts && dashboardData.bankAccounts.length > 0 ? (
              dashboardData.bankAccounts.map(account => (
                <Link key={account.id} to={`/finance/accounts/${account.id}/transactions`} className="account-item">
                  <div className="account-info">
                    <div className="account-code">{account.code}</div>
                    <div className="account-name">{account.name}</div>
                  </div>
                  <div className={`account-balance ${getBalanceClass(account.balance)}`}>
                    {formatCurrency(account.balance)}
                  </div>
                </Link>
              ))
            ) : (
              <div className="no-accounts"><p>No bank accounts found</p></div>
            )}
          </div>
        </div>
      </div>

      {/* Reports Section — the actual reporting engine, surfaced */}
      <section className="reports-section">
        <div className="section-header">
          <h3>Reports</h3>
        </div>
        <div className="reports-grid">
          <Link to="/finance/reports/cash-book" className="report-card">
            <div className="report-icon"><FaBook /></div>
            <div className="report-content">
              <h4>Cash Book</h4>
              <p>Every posted voucher, in date order, with running balance</p>
            </div>
            <FaArrowRight className="report-arrow" />
          </Link>
          <Link to="/finance/reports/income-expenditure" className="report-card">
            <div className="report-icon"><FaChartLine /></div>
            <div className="report-content">
              <h4>Income &amp; Expenditure</h4>
              <p>Totals by program, fund source, or department</p>
            </div>
            <FaArrowRight className="report-arrow" />
          </Link>
          <Link to="/finance/journal_entries?filter=draft" className="report-card">
            <div className="report-icon"><FaClock /></div>
            <div className="report-content">
              <h4>Drafts Awaiting Posting</h4>
              <p>Vouchers entered but not yet posted</p>
            </div>
            <FaArrowRight className="report-arrow" />
          </Link>
        </div>
      </section>

      {/* Recent Posted Entries */}
      <section className="recent-entries-section">
        <div className="section-header">
          <h3>Recent Posted Entries</h3>
          <Link to="/finance/journal_entries" className="view-all-link">
            <span>View All</span>
            <FaArrowRight />
          </Link>
        </div>

        <div className="table-container">
          <table className="entries-table">
            <thead>
              <tr>
                <th className="date-header"><FaCalendar /> Date</th>
                <th className="reference-header"><FaHashtag /> Reference</th>
                <th>Type</th>
                <th className="description-header"><FaFileAlt /> Description</th>
                <th className="amount-header">Amount</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentEntries.length > 0 ? (
                dashboardData.recentEntries.map((entry, index) => (
                  <tr
                    key={entry.id}
                    className={index % 2 === 0 ? 'even-row' : 'odd-row'}
                    onClick={() => window.location.assign(`/finance/journal/${entry.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td className="date-cell">{entry.date}</td>
                    <td className="reference-cell">{entry.reference || '-'}</td>
                    <td>
                      <span className="voucher-type-badge">
                        {VOUCHER_LABELS[entry.voucher_type] || 'General'}
                      </span>
                    </td>
                    <td className="description-cell">{entry.description}</td>
                    <td className="amount-cell">{formatCurrency(entry.total_amount)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-entries">
                    <div className="no-data-message">
                      <FaFileAlt />
                      <p>No posted entries yet</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default FinanceDashboard;
