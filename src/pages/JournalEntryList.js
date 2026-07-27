import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CONFIG } from '../config';
import '../styles/journalEntry.css';
import {
    FaPlus, FaSearch, FaDownload, FaBalanceScale,
    FaCalendar, FaAlignLeft, FaArrowUp, FaArrowDown, FaEye
} from 'react-icons/fa';

const JournalEntryList = () => {
    const [searchParams] = useSearchParams();
    const [entries, setEntries] = useState([]);
    const [filteredEntries, setFilteredEntries] = useState([]);
    const [error, setError] = useState('');
    const [errorAlert, setErrorAlert] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    // Reads ?filter=draft or ?filter=posted from the URL (e.g. linked from
    // the dashboard's "Drafts Awaiting Posting" card) so a direct link can
    // land pre-filtered.
    const [statusFilter, setStatusFilter] = useState(searchParams.get('filter') || 'all');

    useEffect(() => {
        fetchEntries();
    }, []);

    useEffect(() => {
        filterEntries();
    }, [entries, searchTerm, dateFilter, statusFilter]);

    const fetchEntries = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${CONFIG.backend_url}/finance/journal_entries/`, {
                credentials: 'include'
            });
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            // Handle paginated response (e.g., { results: [...] })
            const entriesData = data.results || data;
            setEntries(entriesData);
        } catch (err) {
            setError('Failed to fetch journal entries');
            setErrorAlert(true);
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const filterEntries = () => {
        let filtered = entries;

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(entry =>
                entry.description?.toLowerCase().includes(term) ||
                entry.reference?.toLowerCase().includes(term)
            );
        }

        if (dateFilter) {
            filtered = filtered.filter(entry => entry.date === dateFilter);
        }

        if (statusFilter === 'draft') {
            filtered = filtered.filter(entry => !entry.is_posted);
        } else if (statusFilter === 'posted') {
            filtered = filtered.filter(entry => entry.is_posted);
        }

        setFilteredEntries(filtered);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-UG', {
            style: 'currency',
            currency: 'UGX'
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    const calculateTotals = () => {
        const debitTotal = filteredEntries.reduce((sum, entry) => sum + (entry.total_debit || 0), 0);
        const creditTotal = filteredEntries.reduce((sum, entry) => sum + (entry.total_credit || 0), 0);
        return { debitTotal, creditTotal };
    };

    if (loading) {
        return (
            <div className="journal-loading">
                <div className="loading-spinner"></div>
                <p>Loading Journal Entries...</p>
            </div>
        );
    }

    return (
        <div className="journal-container">
            {/* Header */}
            <div className="journal-header">
                <div className="header-content">
                    <div className="header-title">
                        <div className="title-icon"><FaBalanceScale /></div>
                        <div>
                            <h1>Journal Entries</h1>
                            <p>View all financial transactions</p>
                        </div>
                    </div>
                    <Link to="/finance/journal/new" className="btn btn-primary btn-with-icon">
                        <FaPlus /> New Entry
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="journal-stats">
                <div className="stat-card">
                    <div className="stat-icon total"><FaBalanceScale /></div>
                    <div className="stat-content">
                        <h3>Total Entries</h3>
                        <h2>{entries.length}</h2>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon debit"><FaArrowDown /></div>
                    <div className="stat-content">
                        <h3>Total Debits</h3>
                        <h2>{formatCurrency(calculateTotals().debitTotal)}</h2>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon credit"><FaArrowUp /></div>
                    <div className="stat-content">
                        <h3>Total Credits</h3>
                        <h2>{formatCurrency(calculateTotals().creditTotal)}</h2>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="journal-controls">
                <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by description or reference..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="filter-controls">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="filter-input"
                    >
                        <option value="all">All Statuses</option>
                        <option value="draft">Draft</option>
                        <option value="posted">Posted</option>
                    </select>
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="filter-input"
                    />
                    <button className="btn btn-outline btn-with-icon">
                        <FaDownload /> Export
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="journal-table-section">
                <div className="table-header">
                    <h3>All Journal Entries ({filteredEntries.length})</h3>
                    <div className="table-actions">
                        <span className="results-count">
                            Showing {filteredEntries.length} of {entries.length} entries
                        </span>
                    </div>
                </div>

                <div className="table-container">
                    <table className="journal-entries-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Reference</th>
                                <th>Description</th>
                                <th>Lines</th>
                                <th>Debit Total</th>
                                <th>Credit Total</th>
                                <th>View</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEntries.length > 0 ? (
                                filteredEntries.map(entry => (
                                    <tr key={entry.id} className="journal-entry-row">
                                        <td className="entry-date">
                                            <div className="date-wrapper">
                                                <FaCalendar className="date-icon" />
                                                {formatDate(entry.date)}
                                            </div>
                                        </td>
                                        <td className="entry-reference">
                                            {entry.reference ? (
                                                <Link to={`/finance/journal/${entry.id}`} className="reference-link">
                                                    <span className="reference-badge">{entry.reference}</span>
                                                </Link>
                                            ) : '-'}
                                        </td>
                                        <td className="entry-description">
                                            <div className="description-wrapper">
                                                <FaAlignLeft className="description-icon" />
                                                <div>
                                                    <strong>{entry.description || 'No description'}</strong>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="entry-lines">
                                            <span className="lines-count">{entry.lines_count || 0} lines</span>
                                        </td>
                                        <td className="entry-debit">
                                            {entry.total_debit > 0 ? (
                                                <span className="amount debit">
                                                    <FaArrowDown className="debit-icon" />
                                                    {formatCurrency(entry.total_debit)}
                                                </span>
                                            ) : '-'}
                                        </td>
                                        <td className="entry-credit">
                                            {entry.total_credit > 0 ? (
                                                <span className="amount credit">
                                                    <FaArrowUp className="credit-icon" />
                                                    {formatCurrency(entry.total_credit)}
                                                </span>
                                            ) : '-'}
                                        </td>
                                        <td className="entry-view">
                                            <Link to={`/finance/journal/${entry.id}`} className="btn-view" title="View Details">
                                                <FaEye />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="no-data-row">
                                    <td colSpan="7">
                                        <div className="no-data-message">
                                            <FaBalanceScale />
                                            <div>
                                                <h4>No journal entries found</h4>
                                                <p>
                                                    {searchTerm || dateFilter
                                                        ? 'Try adjusting your search or filter criteria'
                                                        : 'Get started by creating your first journal entry'}
                                                </p>
                                            </div>
                                            {!searchTerm && !dateFilter && (
                                                <Link to="/finance/journal/new" className="btn btn-primary">
                                                    <FaPlus /> Create Entry
                                                </Link>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {filteredEntries.length > 0 && (
                    <div className="table-footer">
                        <div className="summary-info simple">
                            <div className="summary-item">
                                <span className="summary-label">Total Debits:</span>
                                <span className="summary-value debit">{formatCurrency(calculateTotals().debitTotal)}</span>
                            </div>
                            <div className="summary-item">
                                <span className="summary-label">Total Credits:</span>
                                <span className="summary-value credit">{formatCurrency(calculateTotals().creditTotal)}</span>
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
                            <button className="btn btn-outline" onClick={fetchEntries}>Retry</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JournalEntryList;