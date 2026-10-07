import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CONFIG } from '../config';
import '../styles/accounts.css';
import { FaSave, FaTimes, FaBook, FaHashtag, FaSignature, FaAlignLeft, FaCheckCircle, FaMoneyBillWave } from 'react-icons/fa';

const AccountRegister = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        account_type: '',
        code: '',
        name: '',
        description: '',
        opening_balance: '0',
        is_active: true,
    });
    const [loading, setLoading] = useState(false);

    // Fetch account data if editing
    useEffect(() => {
        if (id) {
            fetchAccountData();
        }
    }, [id]);

    const fetchAccountData = async () => {
        try {
            const response = await fetch(`${CONFIG.backend_url}/finance/accounts/${id}/`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setFormData({
                    account_type: data.account_type || '',
                    code: data.code || '',
                    name: data.name || '',
                    description: data.description || '',
                    opening_balance: String(data.opening_balance ?? '0'),
                    is_active: data.is_active,
                });
            }
        } catch (error) {
            console.error('Error fetching account data:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Backend only ever creates/lists at finance/accounts/ (POST for
            // create) and updates at finance/accounts/<id>/ (PUT) — there
            // is no separate /new/ route.
            const url = id
                ? `${CONFIG.backend_url}/finance/accounts/${id}/`
                : `${CONFIG.backend_url}/finance/accounts/`;
            const method = id ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    ...formData,
                    // Opening balance only applies at creation — once an
                    // account has activity, changing it here wouldn't
                    // retroactively fix the live balance, so we leave the
                    // live balance alone and only send opening_balance on
                    // creation.
                    opening_balance: parseFloat(formData.opening_balance || 0),
                })
            });

            if (response.ok) {
                navigate('/finance/accounts');
            } else {
                console.error('Failed to save account');
            }
        } catch (error) {
            console.error('Error submitting account form', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="accounts-container">
            {/* Header Section */}
            <div className="accounts-header">
                <div className="header-content">
                    <div className="header-title">
                        <div className="title-icon">
                            <FaBook />
                        </div>
                        <div>
                            <h1>{id ? 'Edit Account' : 'Create New Account'}</h1>
                            <p>{id ? 'Update account information' : 'Add a new account to your chart of accounts'}</p>
                        </div>
                    </div>
                    <button 
                        type="button" 
                        className="btn btn-secondary btn-with-icon"
                        onClick={() => navigate('/finance/accounts')}
                    >
                        <FaTimes />
                        Cancel
                    </button>
                </div>
            </div>

            {/* Form Section */}
            <div className="form-container">
                <div className="form-card">
                    <div className="form-header">
                        <h3>Account Details</h3>
                        <div className="form-steps">
                            <div className="step active">1</div>
                            <div className="step-connector"></div>
                            <div className="step">2</div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="account-form">
                        <div className="form-grid">
                            {/* Account Type */}
                            <div className="form-group">
                                <label className="form-label">
                                    <FaBook className="label-icon" />
                                    Account Type
                                </label>
                                <select
                                    name="account_type"
                                    value={formData.account_type}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                    disabled={!!id}
                                >
                                    <option value="">Select Account Type</option>
                                    <option value="Bank">Bank</option>
                                    <option value="Cash">Cash</option>
                                </select>
                                <div className="input-helper">
                                    {id
                                        ? "Account type can't be changed after creation"
                                        : "Is this money sitting in a bank, or held as physical cash?"}
                                </div>
                            </div>

                            {/* Account Code */}
                            <div className="form-group">
                                <label className="form-label">
                                    <FaHashtag className="label-icon" />
                                    Account Code
                                </label>
                                <input
                                    type="text"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="e.g., 1001"
                                    required
                                />
                                <div className="input-helper">
                                    Unique identifier for the account
                                </div>
                            </div>

                            {/* Account Name */}
                            <div className="form-group">
                                <label className="form-label">
                                    <FaSignature className="label-icon" />
                                    Account Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="e.g., Cash on Hand"
                                    required
                                />
                                <div className="input-helper">
                                    Descriptive name for the account
                                </div>
                            </div>

                            {/* Opening Balance */}
                            <div className="form-group">
                                <label className="form-label">
                                    <FaMoneyBillWave className="label-icon" />
                                    Opening Balance
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="opening_balance"
                                    value={formData.opening_balance}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="0.00"
                                    disabled={!!id}
                                />
                                <div className="input-helper">
                                    {id
                                        ? "Opening balance is fixed at creation and can't be edited afterwards"
                                        : "How much this account already holds — its balance will start here"}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="form-group full-width">
                                <label className="form-label">
                                    <FaAlignLeft className="label-icon" />
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="form-input textarea"
                                    placeholder="Provide a detailed description of this account..."
                                    rows="4"
                                />
                                <div className="input-helper">
                                    Optional description for additional context
                                </div>
                            </div>

                            {/* Active Status */}
                            <div className="form-group full-width">
                                <div className="checkbox-group">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="is_active"
                                            checked={formData.is_active}
                                            onChange={handleChange}
                                            className="checkbox-input"
                                        />
                                        <span className="checkbox-custom">
                                            <FaCheckCircle className="check-icon" />
                                        </span>
                                        <span className="checkbox-text">
                                            Active Account
                                        </span>
                                    </label>
                                    <div className="input-helper">
                                        Inactive accounts won't be available for new transactions
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="form-actions">
                            <button 
                                type="button" 
                                className="btn btn-outline"
                                onClick={() => navigate('/finance/accounts')}
                            >
                                <FaTimes />
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="btn btn-primary btn-with-loading"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className="loading-spinner-small"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <FaSave />
                                        {id ? 'Update Account' : 'Create Account'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Form Help Card */}
                <div className="help-card">
                    <h4>Account Types Guide</h4>
                    <div className="help-items">
                        <div className="help-item">
                            <div className="help-color asset"></div>
                            <div className="help-content">
                                <strong>Bank</strong>
                                <span>Money held in a bank account (e.g. Stanbic, Centenary)</span>
                            </div>
                        </div>
                        <div className="help-item">
                            <div className="help-color revenue"></div>
                            <div className="help-content">
                                <strong>Cash</strong>
                                <span>Physical cash on hand (e.g. petty cash, treasurer's box)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountRegister;