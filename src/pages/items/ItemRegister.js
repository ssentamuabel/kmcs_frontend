import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { CONFIG } from '../../config';
import '../../styles/inventory.css';
import { FaSave, FaTimes, FaArrowLeft, FaBoxes } from 'react-icons/fa';

const UNIT_CHOICES = ['kg', 'g', 'l', 'ml', 'unit', 'box', 'pack', 'set'];

const ItemRegister = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '', description: '', unit: 'unit', unit_price: '',
    quantity: '0', min_stock_level: '0', category: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) fetchItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchItem = async () => {
    try {
      const res = await fetch(`${CONFIG.backend_url}/items/${id}/`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setFormData({
          name: data.name || '', description: data.description || '', unit: data.unit || 'unit',
          unit_price: String(data.unit_price ?? ''), quantity: String(data.quantity ?? '0'),
          min_stock_level: String(data.min_stock_level ?? '0'), category: data.category || '',
        });
      }
    } catch (err) { setError('Could not load this item.'); }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const url = id ? `${CONFIG.backend_url}/items/${id}/` : `${CONFIG.backend_url}/items/`;
      const method = id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          unit_price: parseFloat(formData.unit_price),
          quantity: parseFloat(formData.quantity),
          min_stock_level: parseFloat(formData.min_stock_level),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.name?.[0] || data.detail || 'Failed to save item');
      }
      navigate('/inventory/items');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inventory-form-container">
      <div className="view-header">
        <Link to="/inventory/items" className="btn btn-outline btn-with-icon"><FaArrowLeft /> Back to Items</Link>
        <div className="header-title">
          <div className="title-icon"><FaBoxes /></div>
          <div>
            <h1>{id ? 'Edit Item' : 'New Item'}</h1>
            <p>{id ? 'Update item details' : 'Add a new item to the catalog'}</p>
          </div>
        </div>
      </div>

      {error && <div className="inventory-error-banner">{error}</div>}

      <form className="inventory-form-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Item Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" placeholder="e.g. Rice" required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Unit</label>
            <select name="unit" value={formData.unit} onChange={handleChange} className="form-input" required>
              {UNIT_CHOICES.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Unit Price (UGX)</label>
            <input type="number" step="0.01" name="unit_price" value={formData.unit_price} onChange={handleChange} className="form-input" required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">{id ? 'Current Quantity in Stock' : 'Opening Quantity'}</label>
            <input type="number" step="0.01" name="quantity" value={formData.quantity} onChange={handleChange} className="form-input" />
            <div className="input-helper">Adjust stock levels afterwards via Stock Movements, not by editing this directly.</div>
          </div>
          <div className="form-group">
            <label className="form-label">Minimum Stock Level</label>
            <input type="number" step="0.01" name="min_stock_level" value={formData.min_stock_level} onChange={handleChange} className="form-input" />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Category (optional)</label>
          <input type="text" name="category" value={formData.category} onChange={handleChange} className="form-input" placeholder="e.g. Foodstuffs" />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} className="form-input" rows={3} />
        </div>

        <div className="form-actions">
          <Link to="/inventory/items" className="btn btn-outline btn-with-icon"><FaTimes /> Cancel</Link>
          <button type="submit" className="btn btn-primary btn-with-icon" disabled={loading}>
            <FaSave /> {loading ? 'Saving…' : 'Save Item'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItemRegister;
