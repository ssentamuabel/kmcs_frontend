import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { CONFIG } from '../config';
import '../styles/programs.css';
import { FaSave, FaTimes, FaArrowLeft, FaClipboardList } from 'react-icons/fa';

const ProgramRegister = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    period_type: 'monthly',
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) fetchProgram();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProgram = async () => {
    try {
      const res = await fetch(`${CONFIG.backend_url}/programs/${id}/`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setFormData({
          name: data.name || '',
          description: data.description || '',
          period_type: data.period_type || 'monthly',
          location: data.location || '',
        });
      }
    } catch (err) {
      setError('Could not load this program.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const url = id ? `${CONFIG.backend_url}/programs/${id}/` : `${CONFIG.backend_url}/programs/`;
      const method = id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.name?.[0] || data.detail || 'Failed to save program');
      }
      navigate('/programs');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="program-register-container">
      <div className="view-header">
        <Link to="/programs" className="btn btn-outline btn-with-icon">
          <FaArrowLeft /> Back to Programs
        </Link>
        <div className="header-title">
          <div className="title-icon"><FaClipboardList /></div>
          <div>
            <h1>{id ? 'Edit Program' : 'New Program'}</h1>
            <p>{id ? 'Update program details' : 'Set up a new recurring program'}</p>
          </div>
        </div>
      </div>

      {error && <div className="programs-error-banner">{error}</div>}

      <form className="program-form-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Program Name</label>
          <input
            type="text" name="name" value={formData.name} onChange={handleChange}
            className="form-input" placeholder="e.g. Sunday Fellowship" required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Frequency</label>
            <select name="period_type" value={formData.period_type} onChange={handleChange} className="form-input" required>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="semester">Semester</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text" name="location" value={formData.location} onChange={handleChange}
              className="form-input" placeholder="e.g. Main Hall"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            name="description" value={formData.description} onChange={handleChange}
            className="form-input" rows={4} placeholder="What is this program about?"
          />
        </div>

        <div className="form-actions">
          <Link to="/programs" className="btn btn-outline btn-with-icon">
            <FaTimes /> Cancel
          </Link>
          <button type="submit" className="btn btn-primary btn-with-icon" disabled={loading}>
            <FaSave /> {loading ? 'Saving…' : 'Save Program'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProgramRegister;
