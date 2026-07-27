import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CONFIG } from '../../config';
import '../../styles/inventory.css';
import '../../styles/budget.css';
import { FaArrowLeft, FaEdit, FaExchangeAlt, FaBoxes, FaExclamationTriangle } from 'react-icons/fa';

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX', maximumFractionDigits: 0 }).format(amount || 0);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [itemRes, journalsRes] = await Promise.all([
        fetch(`${CONFIG.backend_url}/items/${id}/`, { credentials: 'include' }),
        fetch(`${CONFIG.backend_url}/inventory-journals/`, { credentials: 'include' }),
      ]);
      if (!itemRes.ok) throw new Error('Failed to load item');
      const itemData = await itemRes.json();
      const journalsData = journalsRes.ok ? await journalsRes.json() : [];
      const allJournals = Array.isArray(journalsData) ? journalsData : journalsData.results || [];
      setItem(itemData);
      setJournals(allJournals.filter(j => j.item === itemData.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  if (loading) return <div className="inventory-loading"><div className="loading-spinner"></div><p>Loading Item...</p></div>;
  if (!item) return <div className="inventory-error-banner">Item not found.</div>;

  return (
    <div className="inventory-form-container">
      <div className="view-header">
        <Link to="/inventory/items" className="btn btn-outline btn-with-icon"><FaArrowLeft /> Back to Items</Link>
        <div className="header-actions">
          <Link to={`/inventory/journal/new?item=${item.id}`} className="btn btn-outline btn-with-icon">
            <FaExchangeAlt /> Record Movement
          </Link>
          <Link to={`/inventory/items/${item.id}/edit`} className="btn btn-primary btn-with-icon">
            <FaEdit /> Edit
          </Link>
        </div>
      </div>

      {error && <div className="inventory-error-banner"><FaExclamationTriangle /> {error}</div>}

      <div className="budget-summary-card">
        {item.is_below_min_stock && <div className="status-badge status-rejected">Low Stock</div>}
        <h1>{item.name}</h1>
        {item.description && <p className="budget-description">{item.description}</p>}

        <div className="budget-kpi-row">
          <div className="budget-kpi">
            <span className="kpi-label">In Stock</span>
            <span className="kpi-value">{item.quantity} {item.unit}</span>
          </div>
          <div className="budget-kpi">
            <span className="kpi-label">Unit Price</span>
            <span className="kpi-value">{formatCurrency(item.unit_price)}</span>
          </div>
          <div className="budget-kpi">
            <span className="kpi-label">Total Value</span>
            <span className="kpi-value">{formatCurrency(item.total_value)}</span>
          </div>
          <div className="budget-kpi">
            <span className="kpi-label">Minimum Level</span>
            <span className="kpi-value">{item.min_stock_level} {item.unit}</span>
          </div>
        </div>
      </div>

      <section className="budget-section">
        <h3><FaBoxes /> Stock Movement History</h3>
        <div className="budget-table-container">
          <table className="budget-table">
            <thead>
              <tr><th>Date</th><th>Type</th><th className="align-right">Quantity</th><th>Reference</th><th>Notes</th></tr>
            </thead>
            <tbody>
              {journals.length === 0 ? (
                <tr><td colSpan="5" className="budget-empty-row">No stock movements recorded yet</td></tr>
              ) : (
                journals.map(j => (
                  <tr key={j.id}>
                    <td>{new Date(j.created_at).toLocaleDateString()}</td>
                    <td>
                      <span className={`stock-badge ${j.journal_type === 'in' ? 'stock-ok' : j.journal_type === 'out' ? 'stock-low' : ''}`}>
                        {j.journal_type === 'in' ? 'Stock In' : j.journal_type === 'out' ? 'Stock Out' : 'Adjustment'}
                      </span>
                    </td>
                    <td className="align-right">{j.quantity}</td>
                    <td>{j.reference || '-'}</td>
                    <td>{j.notes || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ItemDetail;
