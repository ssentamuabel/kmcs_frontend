import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { CONFIG } from '../config';
import '../styles/inventory.css';
import { FaSave, FaTimes, FaArrowLeft, FaExchangeAlt } from 'react-icons/fa';

const InventoryJournalRegister = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    item: searchParams.get('item') || '',
    journal_type: 'in',
    quantity: '',
    reference: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${CONFIG.backend_url}/items/`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : [])
      .then(data => setItems(Array.isArray(data) ? data : data.results || []))
      .catch(() => {});
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${CONFIG.backend_url}/inventory-journals/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...formData, quantity: parseFloat(formData.quantity) }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || 'Failed to record stock movement');
      }
      navigate('/inventory/journal');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inventory-form-container">
      <div className="view-header">
        <Link to="/inventory/journal" className="btn btn-outline btn-with-icon"><FaArrowLeft /> Back to Stock Movements</Link>
        <div className="header-title">
          <div className="title-icon"><FaExchangeAlt /></div>
          <div>
            <h1>Record Stock Movement</h1>
            <p>Stock In adds quantity, Stock Out subtracts it, Adjustment sets it to an exact figure</p>
          </div>
        </div>
      </div>

      {error && <div className="inventory-error-banner">{error}</div>}

      <form className="inventory-form-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Item</label>
          <select name="item" value={formData.item} onChange={handleChange} className="form-input" required>
            <option value="">Select item…</option>
            {items.map(i => <option key={i.id} value={i.id}>{i.name} ({i.quantity} {i.unit} in stock)</option>)}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Movement Type</label>
            <select name="journal_type" value={formData.journal_type} onChange={handleChange} className="form-input" required>
              <option value="in">Stock In (+)</option>
              <option value="out">Stock Out (-)</option>
              <option value="adjust">Adjustment (set exact quantity)</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Quantity</label>
            <input type="number" step="0.01" name="quantity" value={formData.quantity} onChange={handleChange} className="form-input" required />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Reference (optional)</label>
          <input type="text" name="reference" value={formData.reference} onChange={handleChange} className="form-input" placeholder="e.g. delivery note, invoice number" />
        </div>

        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange} className="form-input" rows={3} />
        </div>

        <div className="form-actions">
          <Link to="/inventory/journal" className="btn btn-outline btn-with-icon"><FaTimes /> Cancel</Link>
          <button type="submit" className="btn btn-primary btn-with-icon" disabled={loading}>
            <FaSave /> {loading ? 'Saving…' : 'Record Movement'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InventoryJournalRegister;
