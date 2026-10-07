import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CONFIG } from '../config';
import '../styles/journalEntry.css';
import { 
    FaArrowLeft, FaCalendar, FaAlignLeft, FaIdBadge,
    FaArrowDown, FaArrowUp, FaCheckCircle, FaTimesCircle,
    FaLock, FaLockOpen, FaEdit, FaTag
} from 'react-icons/fa';

const VOUCHER_TYPE_LABELS = {
    INCOME: 'Income',
    EXPENSE: 'Expense',
    TRANSFER: 'Transfer',
    GENERAL: 'General / Mixed',
};

const JournalEntryView = () => {
    const { id } = useParams();
    const [entry, setEntry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionError, setActionError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchEntry();
    }, [id]);

    const fetchEntry = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${CONFIG.backend_url}/finance/journal_entries/${id}/`, {
                credentials: 'include'
            });
            if (!res.ok) throw new Error(`Failed to fetch journal entry: ${res.status}`);
            const data = await res.json();
            setEntry(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePost = async () => {
        setActionError('');
        setActionLoading(true);
        try {
            const res = await fetch(`${CONFIG.backend_url}/finance/journal/${id}/post/`, {
                method: 'POST',
                credentials: 'include',
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.detail || 'Failed to post entry');
            await fetchEntry(); // pick up the real is_posted/posted_by/posted_at and updated account balances
        } catch (err) {
            setActionError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleUnpost = async () => {
        setActionError('');
        setActionLoading(true);
        try {
            const res = await fetch(`${CONFIG.backend_url}/finance/journal/${id}/unpost/`, {
                method: 'POST',
                credentials: 'include',
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.detail || 'Failed to unpost entry');
            await fetchEntry();
        } catch (err) {
            setActionError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-UG', {
            style: 'currency',
            currency: 'UGX'
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="journal-loading">
                <div className="loading-spinner"></div>
                <p>Loading Journal Entry...</p>
            </div>
        );
    }

    if (error || !entry) {
        return (
            <div className="journal-error">
                <div className="error-card">
                    <FaTimesCircle className="error-icon" />
                    <h3>{error ? 'Error' : 'Entry Not Found'}</h3>
                    <p>{error || 'The requested journal entry could not be found.'}</p>
                    <Link to="/finance/journal" className="btn btn-primary">
                        <FaArrowLeft /> Back to List
                    </Link>
                </div>
            </div>
        );
    }

    // Calculate totals
    const totalDebit = entry.lines
        .filter(line => line.entry_type === 'debit')
        .reduce((sum, line) => sum + parseFloat(line.amount), 0);
    const totalCredit = entry.lines
        .filter(line => line.entry_type === 'credit')
        .reduce((sum, line) => sum + parseFloat(line.amount), 0);

    return (
        <div className="journal-view-container">
            {/* Header */}
            <div className="view-header">
                <Link to="/finance/journal" className="btn btn-outline btn-with-icon">
                    <FaArrowLeft /> Back to List
                </Link>
                <div className="header-title">
                    <h1>Journal Entry Details</h1>
                    <p>View transaction details</p>
                </div>
                <div className="header-actions">
                    {!entry.is_posted && (
                        <Link to={`/finance/journal/edit/${entry.id}`} className="btn btn-outline btn-with-icon">
                            <FaEdit /> Edit
                        </Link>
                    )}
                    {entry.is_posted ? (
                        <button
                            className="btn btn-outline btn-with-icon"
                            onClick={handleUnpost}
                            disabled={actionLoading}
                        >
                            <FaLockOpen /> {actionLoading ? 'Unposting…' : 'Unpost'}
                        </button>
                    ) : (
                        <button
                            className="btn btn-primary btn-with-icon"
                            onClick={handlePost}
                            disabled={actionLoading}
                        >
                            <FaLock /> {actionLoading ? 'Posting…' : 'Post Entry'}
                        </button>
                    )}
                </div>
            </div>

            {actionError && (
                <div className="action-error-banner">
                    <FaTimesCircle /> {actionError}
                </div>
            )}

            {/* Entry Header Card */}
            <div className="entry-header-card">
                <div className="header-row">
                    <div className="header-item">
                        <div className="header-label"><FaCalendar /> Date</div>
                        <div className="header-value">{formatDate(entry.date)}</div>
                    </div>
                    <div className="header-item">
                        <div className="header-label"><FaIdBadge /> Reference</div>
                        <div className="header-value reference">{entry.reference || 'N/A'}</div>
                    </div>
                    <div className="header-item">
                        <div className="header-label"><FaTag /> Voucher Type</div>
                        <div className="header-value">{VOUCHER_TYPE_LABELS[entry.voucher_type] || 'General / Mixed'}</div>
                    </div>
                    <div className="header-item">
                        <div className="header-label"><FaCheckCircle /> Status</div>
                        <div className={`header-value status ${entry.is_posted ? 'posted' : 'draft'}`}>
                            {entry.is_posted ? 'Posted' : 'Draft'}
                        </div>
                    </div>
                </div>
                <div className="header-description">
                    <div className="header-label"><FaAlignLeft /> Description</div>
                    <div className="description-text">{entry.description || 'No description'}</div>
                </div>
            </div>

            {/* Transaction Lines */}
            <div className="transaction-section">
                <h3>Transaction Lines</h3>
                <div className="lines-table-container">
                    <table className="lines-table">
                        <thead>
                            <tr>
                                <th>Account</th>
                                <th>Account Code</th>
                                <th>Type</th>
                                <th>Description</th>
                                <th>Program</th>
                                <th>Fund Source</th>
                                <th>Department</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entry.lines && entry.lines.length > 0 ? (
                                entry.lines.map(line => (
                                    <tr key={line.id} className={`line-row ${line.entry_type}`}>
                                        <td className="line-account">
                                            <div className="account-info">
                                                <div className="account-name">{line.account_name}</div>
                                                {line.account_details && (
                                                    <div className="account-type">
                                                        {line.account_details.account_type}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="line-code">{line.account_code}</td>
                                        <td className="line-type">
                                            <div className={`type-badge ${line.entry_type}`}>
                                                {line.entry_type === 'debit' ? <><FaArrowDown /> Debit</> : <><FaArrowUp /> Credit</>}
                                            </div>
                                        </td>
                                        <td className="line-description">{line.description || '-'}</td>
                                        <td className="line-program">{line.program_name || '-'}</td>
                                        <td className="line-fund-source">{line.fund_source_name || '-'}</td>
                                        <td className="line-department">{line.department_name || '-'}</td>
                                        <td className="line-amount">
                                            <div className={`amount ${line.entry_type}`}>
                                                {formatCurrency(line.amount)}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="no-lines">
                                    <td colSpan="8" className="no-data">No transaction lines found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Summary Card */}
            <div className="summary-card">
                <div className="summary-row">
                    <div className="summary-item">
                        <div className="summary-label">Total Debit</div>
                        <div className="summary-value debit"><FaArrowDown /> {formatCurrency(totalDebit)}</div>
                    </div>
                    <div className="summary-item">
                        <div className="summary-label">Total Credit</div>
                        <div className="summary-value credit"><FaArrowUp /> {formatCurrency(totalCredit)}</div>
                    </div>
                    <div className="summary-item">
                        <div className="summary-label">Number of Lines</div>
                        <div className="summary-value count">{entry.lines_count || entry.lines?.length || 0}</div>
                    </div>
                </div>
                {entry.voucher_type === 'TRANSFER' ? (
                    <div className={`balance-status ${totalDebit === totalCredit ? 'balanced' : 'unbalanced'}`}>
                        {totalDebit === totalCredit ? <><FaCheckCircle /> Transfer is balanced</> : <><FaTimesCircle /> Transfer amounts don't match</>}
                    </div>
                ) : (
                    <div className="balance-status balanced">
                        <FaCheckCircle /> {VOUCHER_TYPE_LABELS[entry.voucher_type] || 'General'} voucher — no balancing required
                    </div>
                )}
            </div>

            {/* Additional Information */}
            <div className="info-card">
                <h4>Additional Information</h4>
                <div className="info-grid">
                    <div className="info-item">
                        <div className="info-label">Entry ID</div>
                        <div className="info-value">{entry.id}</div>
                    </div>
                    <div className="info-item">
                        <div className="info-label">Created</div>
                        <div className="info-value">{new Date(entry.created_at).toLocaleDateString()}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JournalEntryView;