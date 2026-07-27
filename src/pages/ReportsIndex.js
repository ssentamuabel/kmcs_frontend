// src/pages/ReportsIndex.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaChartLine, FaArrowRight, FaFileAlt } from 'react-icons/fa';
import '../styles/reports.css';

const ReportsIndex = () => {
    return (
        <div className="reports-container">
            <header className="reports-header">
                <div className="header-content">
                    <div className="header-title">
                        <div className="title-icon"><FaChartLine /></div>
                        <div>
                            <h1>Financial Reports</h1>
                            <p>Detailed transaction reports by program, fund source, and department</p>
                        </div>
                    </div>
                    <Link to="/finance" className="btn btn-outline btn-with-icon">
                        <FaArrowRight /> Back to Dashboard
                    </Link>
                </div>
            </header>

            <div className="report-content">
                <div className="reports-index-grid">
                    <Link to="/reports/program-transactions" className="report-index-card">
                        <FaFileAlt className="card-bg-icon" />
                        <h3><FaChartLine /> Program Transactions</h3>
                        <p>View all journal lines associated with specific programs. Filter by date range to see detailed activity.</p>
                        <div className="report-meta">
                            <span>Drill down by program</span>
                            <span>→</span>
                        </div>
                    </Link>

                    <Link to="/reports/fund-source-transactions" className="report-index-card">
                        <FaFileAlt className="card-bg-icon" />
                        <h3><FaChartLine /> Fund Source Transactions</h3>
                        <p>Analyze all transactions linked to fund sources. Includes credits (inflows) and debits (outflows).</p>
                        <div className="report-meta">
                            <span>Detailed by fund</span>
                            <span>→</span>
                        </div>
                    </Link>

                    <Link to="/reports/department-transactions" className="report-index-card">
                        <FaFileAlt className="card-bg-icon" />
                        <h3><FaChartLine /> Department Transactions</h3>
                        <p>Review all journal entries allocated to departments. Essential for departmental budgeting.</p>
                        <div className="report-meta">
                            <span>Department-wise details</span>
                            <span>→</span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ReportsIndex;