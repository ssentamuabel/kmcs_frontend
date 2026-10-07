import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/accounts.css';
import { CONFIG } from '../config';
import {
    FaPlus,
    FaEdit,
    FaSearch,
    FaDownload,
    FaBook,
    FaCheckCircle,
    FaTimesCircle,
    FaFilter
} from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AccountList = () => {
    const [accounts, setAccounts] = useState([]);
    const [filteredAccounts, setFilteredAccounts] = useState([]);
    const [error, setError] = useState('');
    const [errorAlert, setErrorAlert] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); // 'all', 'cash', 'bank'
    const navigate = useNavigate();

    useEffect(() => {
        fetchAccounts();
    }, []);

    useEffect(() => {
        filterAccounts();
    }, [accounts, searchTerm, filterType]);

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${CONFIG.backend_url}/finance/accounts/`, {
                credentials: 'include'
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            // Handle paginated responses
            if (Array.isArray(data)) {
                setAccounts(data);
            } else if (Array.isArray(data.results)) {
                setAccounts(data.results);
            } else if (Array.isArray(data.data)) {
                setAccounts(data.data);
            } else {
                console.warn('Unexpected API format:', data);
                setAccounts([]);
            }
        } catch (err) {
            console.error('Error fetching accounts:', err);
            setError('Failed to fetch accounts');
            setErrorAlert(true);
            setAccounts([]);
        } finally {
            setLoading(false);
        }
    };

    const filterAccounts = () => {
        let filtered = accounts;

        if (searchTerm) {
            filtered = filtered.filter(account =>
                account.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                account.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                account.account_type?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterType !== 'all') {
            filtered = filtered.filter(
                account => account.account_type?.toLowerCase() === filterType.toLowerCase()
            );
        }

        setFilteredAccounts(filtered);
    };

    const handleEdit = (id) => {
        navigate(`/finance/account/edit/${id}`);
    };

    const getAccountTypeColor = (type) => {
        const typeColors = {
            cash: '#16A085',
            bank: '#476EAE',
        };
        return typeColors[type?.toLowerCase()] || '#718096';
    };

    const formatBalance = (balance) => {
        return new Intl.NumberFormat('en-UG', {
            style: 'currency',
            currency: 'UGX'
        }).format(balance || 0);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        const title = 'Chart of Accounts';
        const filterLabel = filterType === 'all' ? 'All Types' : filterType === 'cash' ? 'Cash' : 'Bank';
        const date = new Date().toLocaleDateString();

        doc.setFontSize(18);
        doc.text(title, 14, 22);
        doc.setFontSize(11);
        doc.text(`Filter: ${filterLabel}`, 14, 32);
        doc.text(`Search: ${searchTerm || 'None'}`, 14, 38);
        doc.text(`Generated: ${date}`, 14, 44);

        const tableColumn = ['Code', 'Account Name', 'Type', 'Balance', 'Status'];
        const tableRows = filteredAccounts.map(acc => [
            acc.code,
            acc.name,
            acc.account_type,
            formatBalance(acc.balance),
            acc.is_active ? 'Active' : 'Inactive'
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 50,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [22, 160, 133] }
        });

        const finalY = doc.lastAutoTable.finalY + 10;
        const totalBalance = filteredAccounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
        const activeCount = filteredAccounts.filter(acc => acc.is_active).length;
        doc.text('Summary', 14, finalY);
        doc.text(`Total Balance: ${formatBalance(totalBalance)}`, 14, finalY + 6);
        doc.text(`Active Accounts: ${activeCount}`, 14, finalY + 12);
        doc.text(`Account Types: ${new Set(filteredAccounts.map(acc => acc.account_type)).size}`, 14, finalY + 18);

        doc.save(`accounts_${filterType}_${new Date().toISOString().slice(0,10)}.pdf`);
    };

    if (loading) {
        return (
            <div className="accounts-loading">
                <div className="loading-spinner"></div>
                <p>Loading Accounts...</p>
            </div>
        );
    }

    return (
        <div className="accounts-container">
            {/* Header Section */}
            <div className="accounts-header">
                <div className="header-content">
                    <div className="header-title">
                        <div className="title-icon"><FaBook /></div>
                        <div>
                            <h1>Chart of Accounts</h1>
                            <p>Manage your financial accounts and categories</p>
                        </div>
                    </div>
                    <Link to="/finance/account/new" className="btn btn-primary btn-with-icon">
                        <FaPlus /> New Account
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="accounts-stats">
                <div className="stat-card">
                    <div className="stat-icon total"><FaBook /></div>
                    <div className="stat-content">
                        <h3>Total Accounts</h3>
                        <h2>{accounts.length}</h2>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon active"><FaCheckCircle /></div>
                    <div className="stat-content">
                        <h3>Active Accounts</h3>
                        <h2>{accounts.filter(acc => acc.is_active).length}</h2>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon types"><FaFilter /></div>
                    <div className="stat-content">
                        <h3>Account Types</h3>
                        <h2>{new Set(accounts.map(acc => acc.account_type)).size}</h2>
                    </div>
                </div>
            </div>

            {/* Controls Section */}
            <div className="accounts-controls">
                <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search accounts by name, code, or type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filter-controls">
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Types</option>
                        <option value="cash">Cash</option>
                        <option value="bank">Bank</option>
                    </select>

                    <button
                        className="btn btn-outline btn-with-icon"
                        onClick={exportToPDF}
                        disabled={filteredAccounts.length === 0}
                    >
                        <FaDownload /> Export PDF
                    </button>
                </div>
            </div>

            {/* Accounts Table */}
            <div className="accounts-table-section">
                <div className="table-header">
                    <h3>All Accounts ({filteredAccounts.length})</h3>
                    <div className="table-actions">
                        <span className="results-count">
                            Showing {filteredAccounts.length} of {accounts.length} accounts
                        </span>
                    </div>
                </div>

                <div className="table-container">
                    <table className="accounts-table">
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Account Name</th>
                                <th>Type</th>
                                <th>Balance</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAccounts.length > 0 ? (
                                filteredAccounts.map((account) => (
                                    <tr key={account.id} className="account-row">
                                  
                                        <td className="account-code">
    <Link to={`/finance/accounts/${account.id}/transactions`} className="code-link">
        <div className="code-badge">{account.code}</div>
    </Link>
</td>
<td className="account-name">
    <Link to={`/finance/accounts/${account.id}/transactions`} className="name-link">
        <div className="name-wrapper">
            <strong>{account.name}</strong>
            {account.description && (
                <span className="account-description">{account.description}</span>
            )}
        </div>
    </Link>
</td>
                                        <td className="account-type">
                                            <span
                                                className="type-badge"
                                                style={{
                                                    backgroundColor: getAccountTypeColor(account.account_type),
                                                    color: 'white'
                                                }}
                                            >
                                                {account.account_type}
                                            </span>
                                        </td>
                                        <td className="account-balance">
                                            <span
                                                className={`balance ${
                                                    (account.balance || 0) >= 0 ? 'positive' : 'negative'
                                                }`}
                                            >
                                                {formatBalance(account.balance)}
                                            </span>
                                        </td>
                                        <td className="account-status">
                                            <div className={`status-badge ${account.is_active ? 'active' : 'inactive'}`}>
                                                {account.is_active ? (
                                                    <><FaCheckCircle /> Active</>
                                                ) : (
                                                    <><FaTimesCircle /> Inactive</>
                                                )}
                                            </div>
                                        </td>
                                        <td className="account-actions">
                                            <button
                                                onClick={() => handleEdit(account.id)}
                                                className="btn-edit"
                                                title="Edit Account"
                                            >
                                                <FaEdit />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="no-data-row">
                                    <td colSpan="6">
                                        <div className="no-data-message">
                                            <FaBook />
                                            <div>
                                                <h4>No accounts found</h4>
                                                <p>
                                                    {searchTerm || filterType !== 'all'
                                                        ? 'Try adjusting your search or filter criteria'
                                                        : 'Get started by creating your first account'}
                                                </p>
                                            </div>
                                            {!searchTerm && filterType === 'all' && (
                                                <Link to="/finance/account/new" className="btn btn-primary">
                                                    <FaPlus /> Create Account
                                                </Link>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Summary Footer */}
                {filteredAccounts.length > 0 && (
                    <div className="table-footer">
                        <div className="summary-info">
                            <div className="summary-item">
                                <span className="summary-label">Total Balance:</span>
                                <span className="summary-value">
                                    {formatBalance(filteredAccounts.reduce((sum, acc) => sum + (acc.balance || 0), 0))}
                                </span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Active Accounts:</span>
                                <span className="summary-value positive">
                                    {filteredAccounts.filter(acc => acc.is_active).length}
                                </span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Account Types:</span>
                                <span className="summary-value">
                                    {new Set(filteredAccounts.map(acc => acc.account_type)).size}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Error Alert */}
            {errorAlert && (
                <div className="alert-overlay">
                    <div className="alert-card error">
                        <div className="alert-header">
                            <h4>Error</h4>
                            <button className="alert-close" onClick={() => setErrorAlert(false)}>×</button>
                        </div>
                        <div className="alert-body"><p>{error}</p></div>
                        <div className="alert-actions">
                            <button className="btn btn-primary" onClick={() => setErrorAlert(false)}>Dismiss</button>
                            <button className="btn btn-outline" onClick={fetchAccounts}>Retry</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountList;