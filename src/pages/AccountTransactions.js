import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CONFIG } from '../config';
import { FaArrowLeft, FaCalendar, FaChartLine, FaFilePdf, FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Pagination from '../components/Pagination';
import '../styles/reports.css';

const AccountTransactions = () => {
    const { accountId } = useParams();
    const [account, setAccount] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        pageSize: 20
    });

    useEffect(() => {
        fetchAccountDetails();
    }, [accountId]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setPagination(prev => ({ ...prev, currentPage: 1 }));
            fetchTransactions();
        }, 500);
        return () => clearTimeout(handler);
    }, [startDate, endDate]);

    useEffect(() => {
        if (pagination.currentPage > 0) {
            fetchTransactions();
        }
    }, [pagination.currentPage]);

    const fetchAccountDetails = async () => {
        try {
            const res = await fetch(`${CONFIG.backend_url}/finance/accounts/${accountId}/`, {
                credentials: 'include'
            });
            const data = await res.json();
            setAccount(data);
        } catch (err) {
            console.error('Failed to fetch account', err);
        }
    };

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (startDate) params.append('start_date', startDate);
            if (endDate) params.append('end_date', endDate);
            params.append('page', pagination.currentPage);
            params.append('page_size', pagination.pageSize);

            const res = await fetch(
                `${CONFIG.backend_url}/finance/accounts/${accountId}/transactions/?${params}`,
                { credentials: 'include' }
            );
            const data = await res.json();
            setTransactions(data.results || []);
            setPagination(prev => ({
                ...prev,
                totalCount: data.count || 0,
                totalPages: Math.ceil((data.count || 0) / prev.pageSize)
            }));
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

    const exportToExcel = () => {
        const wsData = [
            [`Account: ${account?.name} (${account?.code})`],
            [`Period: ${startDate || 'All'} to ${endDate || 'All'}`],
            [],
            ['Date', 'Reference', 'Journal Description', 'Entry Type', 'Amount', 'Program', 'Fund Source', 'Department'],
            ...transactions.map(t => [
                formatDate(t.date),
                t.reference || '',
                t.entry_description,
                t.entry_type,
                t.amount,
                t.program_name || '-',
                t.fund_source_name || '-',
                t.department_name || '-'
            ])
        ];
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
        XLSX.writeFile(wb, `account_${accountId}_transactions.xlsx`);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text(`Account Transactions: ${account?.name}`, 14, 22);
        doc.setFontSize(11);
        doc.text(`Account Code: ${account?.code}`, 14, 32);
        doc.text(`Period: ${startDate || 'All'} to ${endDate || 'All'}`, 14, 38);
        const tableColumn = ['Date', 'Reference', 'Journal Desc', 'Type', 'Amount', 'Program', 'Fund', 'Dept'];
        const tableRows = transactions.map(t => [
            formatDate(t.date),
            t.reference || '-',
            t.entry_description,
            t.entry_type,
            formatCurrency(t.amount),
            t.program_name || '-',
            t.fund_source_name || '-',
            t.department_name || '-'
        ]);
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 45,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [22, 160, 133] }
        });
        doc.save(`account_${accountId}_transactions.pdf`);
    };

    if (loading && !transactions.length) {
        return <div className="reports-container"><p>Loading...</p></div>;
    }

    return (
        <div className="reports-container">
            <header className="reports-header">
                <div className="header-content">
                    <div className="header-title">
                        <div className="title-icon"><FaChartLine /></div>
                        <div>
                            <h1>{account?.name} Transactions</h1>
                            <p>Account Code: {account?.code}</p>
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
                        <Link to="/finance/accounts" className="btn btn-outline btn-with-icon">
                            <FaArrowLeft /> Back to Accounts
                        </Link>
                    </div>
                </div>
            </header>

            <div className="report-content">
                <div className="filter-bar">
                    <div className="filter-group">
                        <label><FaCalendar /> Start Date</label>
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div className="filter-group">
                        <label><FaCalendar /> End Date</label>
                        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                </div>

                <div className="table-container">
                    <table className="report-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Reference</th>
                                <th>Journal Description</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Running Balance</th>
                                <th>Program</th>
                                <th>Fund Source</th>
                                <th>Department</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="8">Loading...</td></tr>
                            ) : transactions.length === 0 ? (
                                <tr><td colSpan="8" className="no-data">No transactions found</td></tr>
                            ) : (
                                transactions.map(t => (
                                    <tr key={t.id}>
                                        <td>{formatDate(t.date)}</td>
                                        <td>{t.reference || '-'}</td>
                                        <td>{t.entry_description}</td>
                                        <td className={t.entry_type}>{t.entry_type}</td>
                                        <td className={t.entry_type}>{formatCurrency(t.amount)}</td>
                                        <td>{formatCurrency(t.running_balance)}</td>
                                        <td>{t.program_name || '-'}</td>
                                        <td>{t.fund_source_name || '-'}</td>
                                        <td>{t.department_name || '-'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {pagination.totalPages > 1 && (
                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={(page) => setPagination(prev => ({ ...prev, currentPage: page }))}
                    />
                )}
            </div>
        </div>
    );
};

export default AccountTransactions;