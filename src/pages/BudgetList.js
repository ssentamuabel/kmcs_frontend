import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CONFIG } from '../config';
import '../styles/budget.css';
import { FaPlus, FaSearch, FaWallet, FaExclamationTriangle } from 'react-icons/fa';

const STATUS_LABELS = { draft: 'Draft', approved: 'Approved', rejected: 'Rejected' };

const BudgetList = () => {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${CONFIG.backend_url}/budgets/`, { credentials: 'include' });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setBudgets(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError('Failed to load budgets.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX', maximumFractionDigits: 0 }).format(amount || 0);

  const filtered = useMemo(() => {
    return budgets.filter(b => {
      const matchesSearch = !search || b.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [budgets, search, statusFilter]);

  const counts = useMemo(() => {
    const c = { draft: 0, approved: 0, rejected: 0 };
    budgets.forEach(b => { if (c[b.status] !== undefined) c[b.status] += 1; });
    return c;
  }, [budgets]);

  if (loading) {
    return (
      <div className="budget-loading">
        <div className="loading-spinner"></div>
        <p>Loading Budgets...</p>
      </div>
    );
  }

  return (
    <div className="budget-container">
      <header className="budget-header">
        <div className="header-content">
          <div className="header-title">
            <div className="title-icon"><FaWallet /></div>
            <div>
              <h1>Budgets</h1>
              <p className="header-subtitle">Plan spending per program and track it against actuals</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/budgets/new" className="btn btn-primary btn-with-icon">
              <FaPlus /><span>New Budget</span>
            </Link>
            <Link to="/budgets/approval-setup" className="btn btn-outline btn-with-icon">
              <span>Approval Chain Setup</span>
            </Link>
          </div>
        </div>
      </header>

      {error && <div className="budget-error-banner"><FaExclamationTriangle /> {error}</div>}

      <div className="budget-summary-row">
        <button className={`summary-chip ${statusFilter === 'all' ? 'active' : ''}`} onClick={() => setStatusFilter('all')}>
          All <span>{budgets.length}</span>
        </button>
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <button key={key} className={`summary-chip ${statusFilter === key ? 'active' : ''}`} onClick={() => setStatusFilter(key)}>
            {label} <span>{counts[key] || 0}</span>
          </button>
        ))}
      </div>

      <div className="budget-toolbar">
        <div className="search-box">
          <FaSearch />
          <input type="text" placeholder="Search budgets..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="budget-empty">
          <FaWallet size={40} />
          <h3>No budgets found</h3>
          <p>{budgets.length === 0 ? 'Create your first budget to get started.' : 'Try a different search or filter.'}</p>
        </div>
      ) : (
        <div className="budget-list">
          {filtered.map(budget => (
            <div key={budget.id} className="budget-row" onClick={() => navigate(`/budgets/${budget.id}`)}>
              <div className={`status-badge status-${budget.status}`}>{STATUS_LABELS[budget.status]}</div>
              <div className="budget-row-info">
                <div className="budget-row-title">{budget.title}</div>
                {budget.description && <div className="budget-row-description">{budget.description}</div>}
              </div>
              <div className="budget-row-total">{formatCurrency(budget.total_budget)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BudgetList;
