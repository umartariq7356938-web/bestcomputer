import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminJobs from './AdminJobs';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>Best Computer</h2>
        <p>Admin Portal</p>
        <hr style={{ borderColor: '#1a4270', margin: '20px 0' }} />
        <Link to="#" onClick={() => setActiveTab('dashboard')}>Dashboard</Link>
        <Link to="#" onClick={() => setActiveTab('jobs')}>Jobs Management</Link>
        <Link to="#" onClick={() => setActiveTab('bills')}>Utility Bills</Link>
        <Link to="#">Users</Link>
        <Link to="#">Services</Link>
        <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
          <button className="logout-btn" onClick={handleLogout} style={{ width: '100%' }}>Logout</button>
        </div>
      </div>
      <div className="main-content">
        {activeTab === 'dashboard' && (
          <>
            <div className="topbar">
              <h2>Dashboard Overview</h2>
            </div>
            <div className="dashboard-cards">
              <div className="card">
                <h3>Total Jobs</h3>
                <p>Manage jobs from the sidebar</p>
              </div>
              <div className="card">
                <h3>Total Users</h3>
                <p>0</p>
              </div>
              <div className="card">
                <h3>Utility Providers</h3>
                <p>0</p>
              </div>
            </div>
          </>
        )}
        {activeTab === 'jobs' && <AdminJobs />}
        {activeTab === 'bills' && (
          <div>
            <div className="topbar"><h2>Utility Bills</h2></div>
            <div className="card" style={{ maxWidth: 600 }}>
              <h3>💡 Utility Bills Portal</h3>
              <p>The public Utility Bills portal is already live! Your customers can use it to check their electricity, gas, water, and telecom bills by visiting:</p>
              <a href="http://localhost:5173/bills.html" target="_blank" rel="noreferrer" style={{ display: 'inline-block', padding: '10px 20px', background: '#0d2b4c', color: 'white', borderRadius: '6px', textDecoration: 'none', marginTop: '10px' }}>
                View Live Bills Portal →
              </a>
              <hr style={{ margin: '20px 0' }} />
              <p><strong>Supported Utilities:</strong> LESCO, MEPCO, IESCO, SNGPL, SSGC, PTCL, WASA, K-Electric</p>
              <p style={{ fontSize: '0.875rem', color: '#64748b' }}>All bill inquiries are redirected to official company websites. No user data is stored.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
