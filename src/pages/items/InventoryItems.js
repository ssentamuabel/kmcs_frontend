import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CONFIG } from '../../config';
import '../../styles/inventory.css';
import { FaBoxes, FaPlus, FaSearch, FaExclamationTriangle } from 'react-icons/fa';

const InventoryItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${CONFIG.backend_url}/items/`, { credentials: 'include' });
        if (!response.ok) throw new Error('Failed to fetch items');
        const data = await response.json();
        setItems(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        setError(err.message || 'Connection problem');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX', maximumFractionDigits: 0 }).format(amount || 0);

  const filtered = useMemo(() =>
    items.filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase())),
    [items, search]
  );

  const totalValue = items.reduce((acc, item) => acc + (item.total_value || 0), 0);

  if (loading) {
    return <div className="inventory-loading"><div className="loading-spinner"></div><p>Loading Items...</p></div>;
  }

  return (
    <div className="inventory-container">
      <header className="inventory-header-bar">
        <div className="header-content">
          <div className="header-title">
            <div className="title-icon"><FaBoxes /></div>
            <div>
              <h1>Items</h1>
              <p className="header-subtitle">Total stock value: {formatCurrency(totalValue)}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/inventory/journal" className="btn btn-outline btn-with-icon">
              Stock Movements
            </Link>
            <Link to="/inventory/items/new" className="btn btn-primary btn-with-icon">
              <FaPlus /> New Item
            </Link>
          </div>
        </div>
      </header>

      {error && <div className="inventory-error-banner"><FaExclamationTriangle /> {error}</div>}

      <div className="inventory-toolbar">
        <div className="search-box">
          <FaSearch />
          <input type="text" placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="inventory-table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Name</th><th>Unit</th><th className="align-right">Quantity</th>
              <th className="align-right">Unit Price</th><th className="align-right">Total Value</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map(item => (
                <tr key={item.id}>
                  <td><Link to={`/inventory/items/${item.id}`} className="item-link">{item.name}</Link></td>
                  <td>{item.unit}</td>
                  <td className="align-right">{item.quantity}</td>
                  <td className="align-right">{formatCurrency(item.unit_price)}</td>
                  <td className="align-right">{formatCurrency(item.total_value)}</td>
                  <td>
                    {item.is_below_min_stock ? (
                      <span className="stock-badge stock-low">Low Stock</span>
                    ) : (
                      <span className="stock-badge stock-ok">In Stock</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="inventory-empty-row">No items found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryItems;
