import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CONFIG } from '../config';
import '../styles/programs.css';
import {
  FaPlus, FaSearch, FaEdit, FaTrash, FaMapMarkerAlt,
  FaCalendarAlt, FaExclamationTriangle, FaClipboardList
} from 'react-icons/fa';

const PERIOD_LABELS = {
  weekly: 'Weekly',
  monthly: 'Monthly',
  semester: 'Semester',
  yearly: 'Yearly',
};

const ProgramList = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${CONFIG.backend_url}/programs/`, { credentials: 'include' });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setPrograms(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError('Failed to load programs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`${CONFIG.backend_url}/programs/${deleteTarget.id}/`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete');
      setPrograms(prev => prev.filter(p => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setError('Could not delete this program. It may still be referenced by activities or budgets.');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = useMemo(() => {
    return programs.filter(p => {
      const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.location || '').toLowerCase().includes(search.toLowerCase());
      const matchesPeriod = periodFilter === 'all' || p.period_type === periodFilter;
      return matchesSearch && matchesPeriod;
    });
  }, [programs, search, periodFilter]);

  const counts = useMemo(() => {
    const c = { weekly: 0, monthly: 0, semester: 0, yearly: 0 };
    programs.forEach(p => { if (c[p.period_type] !== undefined) c[p.period_type] += 1; });
    return c;
  }, [programs]);

  if (loading) {
    return (
      <div className="programs-loading">
        <div className="loading-spinner"></div>
        <p>Loading Programs...</p>
      </div>
    );
  }

  return (
    <div className="programs-container">
      <header className="programs-header">
        <div className="header-content">
          <div className="header-title">
            <div className="title-icon"><FaClipboardList /></div>
            <div>
              <h1>Programs</h1>
              <p className="header-subtitle">All recurring programs and their schedule</p>
            </div>
          </div>
          <Link to="/programs/new" className="btn btn-primary btn-with-icon">
            <FaPlus /><span>New Program</span>
          </Link>
        </div>
      </header>

      {error && (
        <div className="programs-error-banner">
          <FaExclamationTriangle /> {error}
        </div>
      )}

      <div className="programs-summary-row">
        <button className={`summary-chip ${periodFilter === 'all' ? 'active' : ''}`} onClick={() => setPeriodFilter('all')}>
          All <span>{programs.length}</span>
        </button>
        {Object.entries(PERIOD_LABELS).map(([key, label]) => (
          <button
            key={key}
            className={`summary-chip ${periodFilter === key ? 'active' : ''}`}
            onClick={() => setPeriodFilter(key)}
          >
            {label} <span>{counts[key] || 0}</span>
          </button>
        ))}
      </div>

      <div className="programs-toolbar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search by name or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="programs-empty">
          <FaClipboardList size={40} />
          <h3>No programs found</h3>
          <p>{programs.length === 0 ? 'Get started by creating your first program.' : 'Try a different search or filter.'}</p>
          {programs.length === 0 && (
            <Link to="/programs/new" className="btn btn-primary btn-with-icon">
              <FaPlus /> New Program
            </Link>
          )}
        </div>
      ) : (
        <div className="programs-list">
          {filtered.map(program => (
            <div key={program.id} className="program-row">
              <div className="program-row-main" onClick={() => navigate(`/programs/${program.id}/edit`)}>
                <div className={`period-badge period-${program.period_type}`}>
                  {PERIOD_LABELS[program.period_type] || program.period_type}
                </div>
                <div className="program-row-info">
                  <div className="program-row-name">{program.name}</div>
                  {program.description && (
                    <div className="program-row-description">{program.description}</div>
                  )}
                </div>
                {program.location && (
                  <div className="program-row-location">
                    <FaMapMarkerAlt /> {program.location}
                  </div>
                )}
                {program.created_at && (
                  <div className="program-row-date">
                    <FaCalendarAlt /> {new Date(program.created_at).toLocaleDateString()}
                  </div>
                )}
              </div>
              <div className="program-row-actions">
                <button className="icon-btn" title="Edit" onClick={() => navigate(`/programs/${program.id}/edit`)}>
                  <FaEdit />
                </button>
                <button className="icon-btn icon-btn-danger" title="Delete" onClick={() => setDeleteTarget(program)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleteTarget && (
        <div className="modal-overlay" onClick={() => !deleting && setDeleteTarget(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h3>Delete "{deleteTarget.name}"?</h3>
            <p>This can't be undone. Activities or budgets linked to this program may be affected.</p>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Delete Program'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramList;
