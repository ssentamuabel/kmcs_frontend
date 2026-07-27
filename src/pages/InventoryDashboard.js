import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CONFIG } from '../config';
import '../styles/inventory.css';
import '../styles/finance.css';
import { FaBoxes, FaExclamationTriangle, FaWarehouse, FaArrowRight, FaHistory } from 'react-icons/fa';

const InventoryDashboard = () => {
  const [items, setItems] = useState([]);
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [itemsRes, journalsRes] = await Promise.all([
          fetch(`${CONFIG.backend_url}/items/`, { credentials: 'include' }),
          fetch(`${CONFIG.backend_url}/inventory-journals/`, { credentials: 'include' }),
        ]);
        if (!itemsRes.ok) throw new Error('Failed to load items');
        const itemsData = await itemsRes.json();
        const journalsData = journalsRes.ok ? await journalsRes.json() : [];
        setItems(Array.isArray(itemsData) ? itemsData : itemsData.results || []);
        setJournals((Array.isArray(journalsData) ? journalsData : journalsData.results || []).slice(0, 6));
      } catch (err) {
        setError('Failed to load inventory data.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX', maximumFractionDigits: 0 }).format(amount || 0);

  const totalValue = items.reduce((sum, i) => sum + (i.total_value || 0), 0);
  const lowStockItems = items.filter(i => i.is_below_min_stock);

  if (loading) {
    return <div className="inventory-loading"><div className="loading-spinner"></div><p>Loading Inventory...</p></div>;
  }

  return (
    <div className="inventory-container">
      <header className="inventory-header-bar">
        <div className="header-content">
          <div className="header-title">
            <div className="title-icon"><FaWarehouse /></div>
            <div>
              <h1>Inventory</h1>
              <p className="header-subtitle">What's currently in the stores</p>
            </div>
          </div>
        </div>
      </header>

      {error && <div className="inventory-error-banner"><FaExclamationTriangle /> {error}</div>}

      <div className="kpi-grid">
        <div className="kpi-card kpi-primary">
          <div className="kpi-icon"><FaWarehouse /></div>
          <div className="kpi-body">
            <span className="kpi-label">Total Stock Value</span>
            <span className="kpi-value">{formatCurrency(totalValue)}</span>
            <span className="kpi-caption">{items.length} item type(s)</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon"><FaExclamationTriangle /></div>
          <div className="kpi-body">
            <span className="kpi-label">Low Stock Items</span>
            <span className={`kpi-value ${lowStockItems.length > 0 ? 'kpi-negative' : ''}`}>{lowStockItems.length}</span>
            <span className="kpi-caption">Below minimum level</span>
          </div>
        </div>
      </div>

      <div className="account-details-section">
        <div className="accounts-panel">
          <div className="panel-header">
            <h3><FaBoxes /> Items in Store</h3>
            <Link to="/inventory/items" className="panel-link">View All <FaArrowRight /></Link>
          </div>
          <div className="accounts-list">
            {items.slice(0, 6).map(item => (
              <Link key={item.id} to={`/inventory/items/${item.id}`} className="account-item">
                <div className="account-info">
                  <div className="account-code">{item.quantity} {item.unit}</div>
                  <div className="account-name">{item.name}</div>
                </div>
                <div className={`account-balance ${item.is_below_min_stock ? 'negative' : 'positive'}`}>
                  {formatCurrency(item.total_value)}
                </div>
              </Link>
            ))}
            {items.length === 0 && <div className="no-accounts"><p>No items yet</p></div>}
          </div>
        </div>

        <div className="accounts-panel">
          <div className="panel-header">
            <h3><FaHistory /> Recent Stock Movements</h3>
            <Link to="/inventory/journal" className="panel-link">View All <FaArrowRight /></Link>
          </div>
          <div className="accounts-list">
            {journals.map(j => (
              <div key={j.id} className="account-item" style={{ cursor: 'default' }}>
                <div className="account-info">
                  <div className="account-code">{j.journal_type === 'in' ? 'Stock In' : j.journal_type === 'out' ? 'Stock Out' : 'Adjustment'}</div>
                  <div className="account-name">{j.item_name || `Item #${j.item}`}</div>
                </div>
                <div className="account-balance">{j.quantity}</div>
              </div>
            ))}
            {journals.length === 0 && <div className="no-accounts"><p>No stock movements yet</p></div>}
          </div>
        </div>
      </div>

      {lowStockItems.length > 0 && (
        <section className="reports-section">
          <div className="section-header"><h3>Needs Restocking</h3></div>
          <div className="reports-grid">
            {lowStockItems.map(item => (
              <Link key={item.id} to={`/inventory/items/${item.id}`} className="report-card">
                <div className="report-icon"><FaExclamationTriangle /></div>
                <div className="report-content">
                  <h4>{item.name}</h4>
                  <p>{item.quantity} {item.unit} left — minimum is {item.min_stock_level}</p>
                </div>
                <FaArrowRight className="report-arrow" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default InventoryDashboard;
