// src/pages/JournalEntryRegister.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/journalEntry.css';
import {
    FaCheckCircle,
    FaTimesCircle,
    FaPlus,
    FaCalendar,
    FaHashtag,
    FaAlignLeft,
    FaBalanceScale,
    FaTrash,
    FaChevronDown
} from 'react-icons/fa';
import { CONFIG } from '../config';

const JournalEntryRegister = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        voucher_type: 'GENERAL',
        reference: '',
        description: '',
        lines: [{
            account: '',
            entry_type: 'debit',
            amount: '',
            description: '',
            program: '',
            fund_source: '',
            department: ''
        }]
    });

    const [accounts, setAccounts] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [fundSources, setFundSources] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(Boolean(id));

    useEffect(() => {
        fetchAccounts();
        fetchPrograms();
        fetchFundSources();
        fetchDepartments();
        if (id) fetchEntry(id);
    }, [id]);

    const fetchAccounts = async () => {
        try {
            const res = await fetch(`${CONFIG.backend_url}/finance/accounts/`, {
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                const list = Array.isArray(data) ? data : data.results || data.data || [];
                setAccounts(list);
            }
        } catch (err) {
            console.error('Error fetching accounts', err);
        }
    };

    const fetchPrograms = async () => {
        try {
            const res = await fetch(`${CONFIG.backend_url}/programs/`, {
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                const list = Array.isArray(data) ? data : data.results || data.data || [];
                setPrograms(list);
            }
        } catch (err) {
            console.error('Error fetching programs', err);
        }
    };

    const fetchFundSources = async () => {
        try {
            const res = await fetch(`${CONFIG.backend_url}/fundsources/`, {
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                const list = Array.isArray(data) ? data : data.results || data.data || [];
                setFundSources(list);
            }
        } catch (err) {
            console.error('Error fetching fund sources', err);
        }
    };

    const fetchDepartments = async () => {
        try {
            const res = await fetch(`${CONFIG.backend_url}/departments/`, {
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                const list = Array.isArray(data) ? data : data.results || data.data || [];
                setDepartments(list);
            }
        } catch (err) {
            console.error('Error fetching departments', err);
        }
    };

    const fetchEntry = async (entryId) => {
        setFetching(true);
        try {
            const res = await fetch(`${CONFIG.backend_url}/finance/journal/view/${entryId}/`, {
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                const mapped = {
                    date: data.date || new Date().toISOString().split('T')[0],
                    voucher_type: data.voucher_type || 'GENERAL',
                    reference: data.reference || '',
                    description: data.description || '',
                    lines: (data.lines || []).map(l => ({
                        account: l.account,
                        entry_type: l.entry_type,
                        amount: String(l.amount),
                        description: l.description || '',
                        program: l.program || '',
                        fund_source: l.fund_source || '',
                        department: l.department || ''
                    }))
                };
                if (!mapped.lines.length) mapped.lines = [{
                    account: '', entry_type: 'debit', amount: '', description: '',
                    program: '', fund_source: '', department: ''
                }];
                setFormData(mapped);
            }
        } catch (err) {
            console.error('Error fetching entry', err);
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e, index = null, field = null) => {
        if (index !== null && field) {
            const newLines = [...formData.lines];
            newLines[index][field] = e.target.value;
            setFormData({ ...formData, lines: newLines });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const addLine = () => {
        setFormData({
            ...formData,
            lines: [...formData.lines, {
                account: '', entry_type: 'debit', amount: '', description: '',
                program: '', fund_source: '', department: ''
            }]
        });
    };

    const removeLine = (index) => {
        if (formData.lines.length <= 1) return;
        const newLines = formData.lines.filter((_, i) => i !== index);
        setFormData({ ...formData, lines: newLines });
    };

    const validateForm = () => {
        if (!formData.date) {
            alert('Please select a date.');
            return false;
        }
        if (!formData.lines || !formData.lines.length) {
            alert('Add at least one line.');
            return false;
        }
        for (const [i, line] of formData.lines.entries()) {
            if (!line.account) {
                alert(`Line ${i + 1}: select an account.`);
                return false;
            }
            const amt = parseFloat(line.amount || 0);
            if (!amt || amt <= 0) {
                alert(`Line ${i + 1}: amount must be greater than 0.`);
                return false;
            }
            if (!['debit', 'credit'].includes(line.entry_type)) {
                alert(`Line ${i + 1}: invalid entry type.`);
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const url = id
                ? `${CONFIG.backend_url}/finance/journal/edit/${id}/`
                : `${CONFIG.backend_url}/finance/journal/new/`;
            const method = id ? 'PUT' : 'POST';

            const payload = {
                date: formData.date,
                voucher_type: formData.voucher_type || 'GENERAL',
                reference: formData.reference,
                description: formData.description,
                lines: formData.lines.map(l => ({
                    account: l.account,
                    entry_type: l.entry_type,
                    amount: parseFloat(l.amount),
                    description: l.description || '',
                    program: l.program || null,
                    fund_source: l.fund_source || null,
                    department: l.department || null
                }))
            };

            const res = await fetch(url, {
                method,
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                navigate('/finance');
            } else {
                const err = await res.json().catch(() => null);
                console.error('Failed to save entry', res.status, err);
                alert('Failed to save entry. Check console for details.');
            }
        } catch (err) {
            console.error('Error submitting', err);
            alert('Network error while saving entry.');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="finance-loading"><p>Loading...</p></div>;

    return (
        <div className="journal-container">
            <div className="journal-header">
                <div className="header-content">
                    <div className="header-title">
                        <div className="title-icon"><FaBalanceScale /></div>
                        <div>
                            <h1>{id ? 'Edit Journal Entry' : 'Create Journal Entry'}</h1>
                            <p>{id ? 'Update journal entry details' : 'Record new financial transactions'}</p>
                        </div>
                    </div>
                    <button type="button" className="btn btn-secondary btn-with-icon" onClick={() => navigate('/finance')}>
                        <FaTimesCircle /> Cancel
                    </button>
                </div>
            </div>

            <form className="journal-content-full" onSubmit={handleSubmit}>
                <div className="form-section">
                    <div className="form-card-full">
                        <div className="form-header"><h3>Entry Details</h3></div>
                        <div className="form-grid-full">
                            <div className="form-group">
                                <label className="form-label"><FaCalendar className="label-icon" /> Date</label>
                                <input type="date" name="date" value={formData.date} onChange={handleChange} className="form-input" required />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Voucher Type</label>
                                <select name="voucher_type" value={formData.voucher_type} onChange={handleChange} className="form-input">
                                    <option value="INCOME">Income (money in)</option>
                                    <option value="EXPENSE">Expense (money out)</option>
                                    <option value="TRANSFER">Transfer (between our accounts)</option>
                                    <option value="GENERAL">General / Mixed (e.g. a collection that also pays a few expenses)</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label"><FaHashtag className="label-icon" /> Reference</label>
                                <input type="text" name="reference" value={formData.reference} onChange={handleChange} className="form-input" placeholder="e.g., INV-001" />
                            </div>

                            <div className="form-group full-width">
                                <label className="form-label"><FaAlignLeft className="label-icon" /> Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} className="form-input textarea" placeholder="Describe this entry..." rows="3" />
                            </div>
                        </div>
                    </div>

                    <div className="form-card-full">
                        <div className="form-header">
                            <h3>Journal Lines</h3>
                            <button type="button" className="btn btn-primary btn-with-icon btn-sm" onClick={addLine}>
                                <FaPlus /> Add Line
                            </button>
                        </div>

                        <div className="table-container-full">
                            <table className="journal-lines-table">
                                <thead>
                <tr>
                    <th style={{width:'18%'}}>Account</th>
                    <th style={{width:'8%'}}>Type</th>
                    <th style={{width:'10%'}}>Amount</th>
                    <th style={{width:'22%'}}>Description</th>
                    <th style={{width:'14%'}}>Program</th>
                    <th style={{width:'14%'}}>Fund Source</th>
                    <th style={{width:'12%'}}>Department</th>
                    <th style={{width:'2%'}}></th>
                </tr>
                        </thead>
                                <tbody>
                                    {formData.lines.map((line, index) => (
                                        <tr key={index} className="journal-line">
                                            <td>
                                                <div className="select-wrapper">
                                                    <select
                                                        value={line.account}
                                                        onChange={(e) => handleChange(e, index, 'account')}
                                                        className="form-input table-input account-select"
                                                        required
                                                    >
                                                        <option value="">Select Account...</option>
                                                        {accounts.map(acc => (
                                                            <option key={acc.id} value={acc.id}>
                                                                {acc.code ? `${acc.code} - ${acc.name}` : acc.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <FaChevronDown className="select-arrow" />
                                                </div>
                                            </td>
                                            <td>
                                                <select
                                                    value={line.entry_type}
                                                    onChange={(e) => handleChange(e, index, 'entry_type')}
                                                    className="form-input table-input entry-type-select"
                                                >
                                                    <option value="debit">Debit</option>
                                                    <option value="credit">Credit</option>
                                                </select>
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    value={line.amount}
                                                    onChange={(e) => handleChange(e, index, 'amount')}
                                                    className="form-input table-input amount-input"
                                                    placeholder="0.00"
                                                    min="0"
                                                    step="0.01"
                                                    required
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={line.description}
                                                    onChange={(e) => handleChange(e, index, 'description')}
                                                    className="form-input table-input"
                                                    placeholder="Line description..."
                                                />
                                            </td>
                                            <td>
                                                <div className="select-wrapper">
                                                    <select
                                                        value={line.program}
                                                        onChange={(e) => handleChange(e, index, 'program')}
                                                        className="form-input table-input"
                                                    >
                                                        <option value="">None</option>
                                                        {programs.map(prog => (
                                                            <option key={prog.id} value={prog.id}>
                                                                {prog.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <FaChevronDown className="select-arrow" />
                                                </div>
                                            </td>
                                            <td>
                                                <div className="select-wrapper">
                                                    <select
                                                        value={line.fund_source}
                                                        onChange={(e) => handleChange(e, index, 'fund_source')}
                                                        className="form-input table-input"
                                                    >
                                                        <option value="">None</option>
                                                        {fundSources.map(fs => (
                                                            <option key={fs.id} value={fs.id}>
                                                                {fs.code ? `${fs.code} - ${fs.name}` : fs.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <FaChevronDown className="select-arrow" />
                                                </div>
                                            </td>
                                            <td>
                                                <div className="select-wrapper">
                                                    <select
                                                        value={line.department}
                                                        onChange={(e) => handleChange(e, index, 'department')}
                                                        className="form-input table-input"
                                                    >
                                                        <option value="">None</option>
                                                        {departments.map(dept => (
                                                            <option key={dept.id} value={dept.id}>
                                                                {dept.code ? `${dept.code} - ${dept.name}` : dept.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <FaChevronDown className="select-arrow" />
                                                </div>
                                            </td>
                                            <td>
                                                {formData.lines.length > 1 && (
                                                    <button type="button" className="btn-remove" onClick={() => removeLine(index)}>
                                                        <FaTrash />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="form-actions-full">
                        <button type="button" className="btn btn-outline" onClick={() => navigate('/finance')}>
                            <FaTimesCircle /> Cancel
                        </button>

                        <button type="submit" className="btn btn-primary btn-with-loading" disabled={loading}>
                            {loading ? (
                                <>
                                    <div className="loading-spinner-small"></div> Processing...
                                </>
                            ) : (
                                <>
                                    <FaCheckCircle /> {id ? 'Update Entry' : 'Post Entry'}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default JournalEntryRegister;