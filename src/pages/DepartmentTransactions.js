// src/pages/DepartmentTransactions.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CONFIG } from '../config';
import { 
    FaArrowLeft, FaFilePdf, FaFileExcel, FaChartLine,
    FaCalendar, FaBuilding 
} from 'react-icons/fa';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../styles/reports.css';

const DepartmentTransactions = () => {
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState({ totalDebit: 0, totalCredit: 0 });

    // Load departments for dropdown
    useEffect(() => {
        fetchDepartments();
    }, []);

    // Auto‑fetch when any filter changes (debounced)
    useEffect(() => {
        const handler = setTimeout(() => {
            fetchTransactions();
        }, 500);
        return () => clearTimeout(handler);
    }, [selectedDepartment, startDate, endDate]);

    const fetchDepartments = async () => {
        try {
            const res = await fetch(`${CONFIG.backend_url}/departments/`, { credentials: 'include' });
            const data = await res.json();
            setDepartments(Array.isArray(data) ? data : data.results || []);
        } catch (err) {
            console.error('Failed to fetch departments', err);
        }
    };

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (selectedDepartment) {
                params.append('department_id', selectedDepartment);
            }
            if (startDate) params.append('start_date', startDate);
            if (endDate) params.append('end_date', endDate);
            const res = await fetch(
                `${CONFIG.backend_url}/reports/department-transactions/?${params}`,
                { credentials: 'include' }
            );
            const data = await res.json();
            setTransactions(data);

            // Calculate totals
            const debit = data.reduce((sum, line) => 
                line.entry_type === 'debit' ? sum + parseFloat(line.amount) : sum, 0);
            const credit = data.reduce((sum, line) => 
                line.entry_type === 'credit' ? sum + parseFloat(line.amount) : sum, 0);
            setSummary({ totalDebit: debit, totalCredit: credit });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-UG', { style: 'currency', currency: 'UGX' }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getDepartmentName = () => {
        if (!selectedDepartment) return 'All Departments';
        const dept = departments.find(d => d.id === parseInt(selectedDepartment));
        return dept ? `${dept.code} - ${dept.name}` : 'Unknown';
    };

    // Export to Excel
    const exportToExcel = () => {
        const departmentName = getDepartmentName();
        const wsData = [
            ['Department Transactions Report'],
            [`Department: ${departmentName}`],
            [`Period: ${startDate || 'All'} to ${endDate || 'All'}`],
            [],
            ['Date', 'Reference', 'Journal Description', 'Account', 'Line Description', 'Type', 'Amount'],
            ...transactions.map(t => [
                formatDate(t.date),
                t.reference || '',
                t.entry_description,
                `${t.account_code} - ${t.account_name}`,
                t.description || '',
                t.entry_type === 'debit' ? 'Debit' : 'Credit',
                t.amount
            ]),
            [],
            ['Summary'],
            ['Total Debit (Expense)', summary.totalDebit],
            ['Total Credit (Income)', summary.totalCredit],
            ['Net', summary.totalCredit - summary.totalDebit]
        ];
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
        XLSX.writeFile(wb, `department_transactions_${selectedDepartment || 'all'}.xlsx`);
    };

    // Export to PDF
    const exportToPDF = () => {
        const doc = new jsPDF();
        const departmentName = getDepartmentName();
        
        doc.setFontSize(18);
        doc.text('Department Transactions Report', 14, 22);
        doc.setFontSize(11);
        doc.text(`Department: ${departmentName}`, 14, 32);
        doc.text(`Period: ${startDate || 'All'} to ${endDate || 'All'}`, 14, 38);
        
        const tableColumn = ['Date', 'Reference', 'Journal Desc', 'Account', 'Line Desc', 'Type', 'Amount'];
        const tableRows = transactions.map(t => [
            formatDate(t.date),
            t.reference || '-',
            t.entry_description,
            `${t.account_code} - ${t.account_name}`,
            t.description || '-',
            t.entry_type === 'debit' ? 'Debit' : 'Credit',
            formatCurrency(t.amount)
        ]);
        
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 45,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [22, 160, 133] }
        });
        
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.text('Summary', 14, finalY);
        doc.text(`Total Debit (Expense): ${formatCurrency(summary.totalDebit)}`, 14, finalY + 6);
        doc.text(`Total Credit (Income): ${formatCurrency(summary.totalCredit)}`, 14, finalY + 12);
        doc.text(`Net: ${formatCurrency(summary.totalCredit - summary.totalDebit)}`, 14, finalY + 18);
        
        doc.save(`department_transactions_${selectedDepartment || 'all'}.pdf`);
    };

    return (
        <div className="reports-container">
            <header className="reports-header">
                <div className="header-content">
                    <div className="header-title">
                        <div className="title-icon"><FaChartLine /></div>
                        <div>
                            <h1>Department Transactions</h1>
                            <p>Detailed transaction report by department</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {transactions.length > 0 && (
                            <>
                                <button className="btn btn-outline btn-with-icon" onClick={exportToExcel}>
                                    <FaFileExcel /> Excel
                                </button>
                                <button className="btn btn-outline btn-with-icon" onClick={exportToPDF}>
                                    <FaFilePdf /> PDF
                                </button>
                            </>
                        )}
                        <Link to="/reports" className="btn btn-outline btn-with-icon">
                            <FaArrowLeft /> Back
                        </Link>
                    </div>
                </div>
            </header>

            <div className="report-content">
                <div className="filter-bar">
                    <div className="filter-group">
                        <label><FaBuilding /> Department</label>
                        <select 
                            value={selectedDepartment} 
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                        >
                            <option value="">All Departments</option>
                            {departments.map(dept => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.code} - {dept.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label><FaCalendar /> Start Date</label>
                        <input 
                            type="date" 
                            value={startDate} 
                            onChange={(e) => setStartDate(e.target.value)} 
                        />
                    </div>
                    <div className="filter-group">
                        <label><FaCalendar /> End Date</label>
                        <input 
                            type="date" 
                            value={endDate} 
                            onChange={(e) => setEndDate(e.target.value)} 
                        />
                    </div>
                </div>

                {transactions.length > 0 && (
                    <div className="summary-cards">
                        <div className="summary-card debit-card">
                            <div className="card-label">Total Debit (Expense)</div>
                            <div className="card-value">{formatCurrency(summary.totalDebit)}</div>
                        </div>
                        <div className="summary-card credit-card">
                            <div className="card-label">Total Credit (Income)</div>
                            <div className="card-value">{formatCurrency(summary.totalCredit)}</div>
                        </div>
                        <div className="summary-card net-card">
                            <div className="card-label">Net</div>
                            <div className="card-value">{formatCurrency(summary.totalCredit - summary.totalDebit)}</div>
                        </div>
                    </div>
                )}

                <div className="table-container">
                    <table className="report-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Reference</th>
                                <th>Journal Description</th>
                                <th>Account</th>
                                <th>Line Description</th>
                                <th>Type</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" style={{textAlign: 'center', padding: '40px'}}>
                                        <div className="loading-spinner-small"></div>
                                        <p>Loading transactions...</p>
                                    </td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr className="no-data-row">
                                    <td colSpan="7">
                                        <div className="no-data-message">
                                            <FaChartLine />
                                            <p>No transactions found for the selected filters</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                transactions.map(line => (
                                    <tr key={line.id}>
                                        <td>{formatDate(line.date)}</td>
                                        <td>
                                            {line.reference ? 
                                                <span className="reference-badge">{line.reference}</span> : 
                                                '-'
                                            }
                                        </td>
                                        <td>{line.entry_description}</td>
                                        <td>
                                            <div className="account-info">
                                                <span className="account-code">{line.account_code}</span>
                                                <span className="account-name">{line.account_name}</span>
                                            </div>
                                        </td>
                                        <td>{line.description || '-'}</td>
                                        <td className={line.entry_type}>
                                            {line.entry_type === 'debit' ? 'Debit' : 'Credit'}
                                        </td>
                                        <td className={line.entry_type}>
                                            {formatCurrency(line.amount)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DepartmentTransactions;