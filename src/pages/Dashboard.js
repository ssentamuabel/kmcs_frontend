import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { RightsContext } from '../contexts/RightsProvider';
import '../styles/finance.css';
import { FaCashRegister, FaUniversity, FaMoneyBillWave, FaArrowRight, FaFileAlt, FaCalendar, FaHashtag } from 'react-icons/fa';

const Dashboard = () => {
  const { rights } = useContext(RightsContext);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalFunds: 0,
    totalBank: 0,
    cashOnHand: 0,
    recentEntries: [],
  });

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch('/api/finance/dashboard/', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        } else {
          console.error('Failed to fetch dashboard data');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="finance-loading">
        <div className="loading-spinner"></div>
        <p>Loading Financial Data...</p>
      </div>
    );
  }

  return (
    <div className="finance-container">
      {/* Header */}
      <div className="finance-header">
        <h1>Finance Dashboard</h1>
        <p>Overview of your financial position</p>
      </div>

      {/* Summary Cards */}
      <div className="finance-cards-grid">
        <div className="finance-card total-funds">
          <div className="card-icon"><FaUniversity /></div>
          <div className="card-content">
            <h3>Total Available Funds</h3>
            <h2>UGX {dashboardData.totalFunds.toLocaleString()}</h2>
            <p>All accounts combined</p>
          </div>
        </div>

        <div className="finance-card bank-balance">
          <div className="card-icon"><FaMoneyBillWave /></div>
          <div className="card-content">
            <h3>Bank Balance</h3>
            <h2>UGX {dashboardData.totalBank.toLocaleString()}</h2>
            <p>Institutional accounts</p>
          </div>
        </div>

        <div className="finance-card cash-on-hand">
          <div className="card-icon"><FaCashRegister /></div>
          <div className="card-content">
            <h3>Cash on Hand</h3>
            <h2>UGX {dashboardData.cashOnHand.toLocaleString()}</h2>
            <p>Physical cash available</p>
          </div>
        </div>
      </div>

      {/* Recent Journal Entries */}
      <div className="recent-entries-section">
        <div className="section-header">
          <h3>Recent Journal Entries</h3>
          <Link to="/finance/journal" className="view-all-link">
            View All <FaArrowRight />
          </Link>
        </div>

        <div className="table-container">
          <table className="entries-table">
            <thead>
              <tr>
                <th><FaCalendar /> Date</th>
                <th><FaHashtag /> Reference</th>
                <th><FaFileAlt /> Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentEntries.length > 0 ? (
                dashboardData.recentEntries.map((entry, index) => (
                  <tr key={entry.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                    <td>{entry.date}</td>
                    <td>{entry.reference || '-'}</td>
                    <td>{entry.description}</td>
                    <td>UGX {entry.total_amount.toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-entries">
                    <div className="no-data-message">
                      <FaFileAlt />
                      <p>No journal entries found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
