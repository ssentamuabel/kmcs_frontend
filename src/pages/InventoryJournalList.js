import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CONFIG } from '../config';
import '../styles/inventory.css';
import { FaHistory, FaPlus, FaExclamationTriangle } from 'react-icons/fa';

const InventoryJournalList = () => {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${CONFIG.backend_url}/inventory-journals/`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to load stock movements');
        const data = await res.json();
        setJournals(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJournals();
  }, []);

  const filtered = useMemo(() =>
    journals.filter(j => typeFilter === 'all' || j.journal_type === typeFilter),
    [journals, typeFilter]
  );

  if (loading) return <div className="inventory-loading"><div className="loading-spinner"></div><p>Loading Stock Movements...</p></div>;

  return (
    <div className="inventory-container">
      <header className="inventory-header-bar">
        <div className="header-content">
          <div className="header-title">
            <div className="title-icon"><FaHistory /></div>
            <div>
              <h1>Stock Movements</h1>
              <p className="header-subtitle">Every stock in, stock out, and adjustment across all items</p>
            </div>
          </div>
          <Link to="/inventory/journal/new" className="btn btn-primary btn-with-icon">
            <FaPlus /> Record Movement
          </Link>
        </div>
      </header>

      {error && <div className="inventory-error-banner"><FaExclamationTriangle /> {error}</div>}

      <div className="budget-summary-row">
        {['all', 'in', 'out', 'adjust'].map(t => (
          <button key={t} className={`summary-chip ${typeFilter === t ? 'active' : ''}`} onClick={() => setTypeFilter(t)}>
            {t === 'all' ? 'All' : t === 'in' ? 'Stock In' : t === 'out' ? 'Stock Out' : 'Adjustments'}
          </button>
        ))}
      </div>

      <div className="inventory-table-container">
        <table className="inventory-table">
          <thead>
            <tr><th>Date</th><th>Item</th><th>Type</th><th className="align-right">Quantity</th><th>Reference</th><th>Notes</th></tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="6" className="inventory-empty-row">No stock movements found</td></tr>
            ) : (
              filtered.map(j => (
                <tr key={j.id}>
                  <td>{new Date(j.created_at).toLocaleDateString()}</td>
                  <td><Link to={`/inventory/items/${j.item}`} className="item-link">{j.item_name || `Item #${j.item}`}</Link></td>
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
    </div>
  );
};

export default InventoryJournalList;
