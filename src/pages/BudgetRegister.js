import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CONFIG } from '../config';
import '../styles/budget.css';
import { FaSave, FaTimes, FaArrowLeft, FaWallet } from 'react-icons/fa';

const BudgetRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', description: '', program: '' });
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${CONFIG.backend_url}/programs/`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : [])
      .then(data => setPrograms(Array.isArray(data) ? data : data.results || []))
      .catch(() => {});
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${CONFIG.backend_url}/budgets/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          program: formData.program || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.title?.[0] || data.detail || 'Failed to create budget');
      }
      const created = await res.json();
      navigate(`/budgets/${created.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="budget-register-container">
      <div className="view-header">
        <Link to="/budgets" className="btn btn-outline btn-with-icon"><FaArrowLeft /> Back to Budgets</Link>
        <div className="header-title">
          <div className="title-icon"><FaWallet /></div>
          <div>
            <h1>New Budget</h1>
            <p>Set up a budget, then add line items once created</p>
          </div>
        </div>
      </div>

      {error && <div className="budget-error-banner">{error}</div>}

      <form className="budget-form-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Budget Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} className="form-input" placeholder="e.g. Freshers' Week 2026" required />
        </div>

        <div className="form-group">
          <label className="form-label">Program (optional)</label>
          <select name="program" value={formData.program} onChange={handleChange} className="form-input">
            <option value="">No specific program</option>
            {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="form-input" rows={4} placeholder="What is this budget for?" />
        </div>

        <div className="form-actions">
          <Link to="/budgets" className="btn btn-outline btn-with-icon"><FaTimes /> Cancel</Link>
          <button type="submit" className="btn btn-primary btn-with-icon" disabled={loading}>
            <FaSave /> {loading ? 'Saving…' : 'Create Budget'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BudgetRegister;
