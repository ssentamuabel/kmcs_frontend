import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CONFIG } from '../config';
import '../styles/budget.css';
import { FaArrowLeft, FaPlus, FaTrash, FaSortNumericDown, FaExclamationTriangle } from 'react-icons/fa';

const ApprovalLevelSetup = () => {
  const [levels, setLevels] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newLevel, setNewLevel] = useState({ name: '', order: '', role: '' });
  const [adding, setAdding] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [levelsRes, rolesRes] = await Promise.all([
        fetch(`${CONFIG.backend_url}/approval-levels/`, { credentials: 'include' }),
        fetch(`${CONFIG.backend_url}/permission/`, { credentials: 'include' }),
      ]);
      const levelsData = levelsRes.ok ? await levelsRes.json() : [];
      const rolesData = rolesRes.ok ? await rolesRes.json() : [];
      setLevels((Array.isArray(levelsData) ? levelsData : levelsData.results || []).sort((a, b) => a.order - b.order));
      setRoles(Array.isArray(rolesData) ? rolesData : rolesData.results || []);
    } catch (err) {
      setError('Failed to load approval levels.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    setError('');
    try {
      const res = await fetch(`${CONFIG.backend_url}/approval-levels/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: newLevel.name,
          order: parseInt(newLevel.order, 10),
          role: newLevel.role,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.order?.[0] || data.detail || 'Failed to add level — check the order number is unique');
      }
      setNewLevel({ name: '', order: '', role: '' });
      await fetchAll();
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${CONFIG.backend_url}/approval-levels/${id}/`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Failed to delete level');
      await fetchAll();
    } catch (err) { setError(err.message); }
  };

  return (
    <div className="budget-register-container">
      <div className="view-header">
        <Link to="/budgets" className="btn btn-outline btn-with-icon"><FaArrowLeft /> Back to Budgets</Link>
        <div className="header-title">
          <div className="title-icon"><FaSortNumericDown /></div>
          <div>
            <h1>Approval Chain Setup</h1>
            <p>Define who approves budgets, and in what order (e.g. Organising → Finance → Chairman)</p>
          </div>
        </div>
      </div>

      {error && <div className="budget-error-banner"><FaExclamationTriangle /> {error}</div>}

      <div className="budget-section">
        <h3>Current Chain</h3>
        {loading ? (
          <p>Loading…</p>
        ) : levels.length === 0 ? (
          <p className="budget-section-hint">
            No approval levels configured yet — budgets submitted for approval will be approved immediately until at least one level is added here.
          </p>
        ) : (
          <div className="approval-timeline">
            {levels.map(level => (
              <div key={level.id} className="approval-step approval-pending">
                <div className="approval-step-badge">{level.order}</div>
                <div className="approval-step-body" style={{ flex: 1 }}>
                  <div className="approval-step-name">{level.name} <span className="approval-step-role">({level.role_name})</span></div>
                </div>
                <button className="icon-btn icon-btn-danger" onClick={() => handleDelete(level.id)}><FaTrash /></button>
              </div>
            ))}
          </div>
        )}

        <form className="inline-add-form" onSubmit={handleAdd} style={{ marginTop: 16 }}>
          <input
            type="number" placeholder="Order (1, 2, 3…)" value={newLevel.order}
            onChange={e => setNewLevel({ ...newLevel, order: e.target.value })} required style={{ maxWidth: 130 }}
          />
          <input
            type="text" placeholder="Step name (e.g. Finance)" value={newLevel.name}
            onChange={e => setNewLevel({ ...newLevel, name: e.target.value })} required
          />
          <select value={newLevel.role} onChange={e => setNewLevel({ ...newLevel, role: e.target.value })} required>
            <option value="">Select role…</option>
            {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <button type="submit" className="btn btn-primary btn-with-icon" disabled={adding}>
            <FaPlus /> Add Step
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApprovalLevelSetup;
