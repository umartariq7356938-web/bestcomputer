import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './jobs.css';

function JobsApp() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/jobs')
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <header className="jobs-header">
        <div className="nav-wrap">
          <a href="/" className="brand">
            <span>BEST <b>COMPUTER</b><small>Digital service center</small></span>
          </a>
          <nav className="desktop-nav">
            <a href="/">Home</a>
            <a href="/jobs.html" style={{ color: '#ef4444', fontWeight: 'bold' }}>Govt Jobs</a>
            <a href="/bills.html" style={{ color: '#0ea5e9', fontWeight: 'bold' }}>Utility Bills</a>
            <a href="/#services">Services</a>
            <a href="/tools.html" style={{ color: '#10b981', fontWeight: 'bold' }}>Online Tools</a>
            <a href="/ai-studio.html" style={{ color: '#a855f7', fontWeight: 'bold' }}>AI Photo Studio</a>
            <a href="/#contact">Contact</a>
          </nav>
        </div>
      </header>

      <main className="jobs-main">
        <div className="jobs-hero">
          <h1>Latest Government Jobs</h1>
          <p>Find and apply for the latest verified government jobs in Pakistan.</p>
        </div>

        <div className="jobs-grid">
          {jobs.length === 0 ? (
            <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>No jobs available at the moment.</p>
          ) : (
            jobs.map(job => (
              <article key={job._id} className="job-card">
                <div className="job-header">
                  <span className="job-org">{job.organization}</span>
                  <span className="job-date">Last Date: {new Date(job.lastDate).toLocaleDateString()}</span>
                </div>
                <h3>{job.title}</h3>
                <p><strong>Department:</strong> {job.department}</p>
                <div className="job-details">
                  <span>📍 {job.city}, {job.province}</span>
                  <span>🎓 {job.education}</span>
                  <span>💼 {job.experience}</span>
                  <span>👥 {job.vacancies} Vacancies</span>
                </div>
                <div className="job-actions">
                  <a href={job.sourceUrl} target="_blank" rel="noreferrer" className="apply-btn">Apply at Official Source</a>
                </div>
              </article>
            ))
          )}
        </div>
      </main>

      <footer>
        <div className="footer-main" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', display: 'flex', justifyContent: 'space-between' }}>
          <div className="footer-brand">
            <a href="/" className="brand">
              <span>BEST <b>COMPUTER</b></span>
            </a>
            <p>Computer, Digital & Photostudio Services Under One Roof.</p>
          </div>
          <div>
            <h3>Quick Links</h3>
            <a href="/" style={{ display: 'block', margin: '5px 0', textDecoration: 'none', color: 'white' }}>Home</a>
            <a href="/tools.html" style={{ display: 'block', margin: '5px 0', textDecoration: 'none', color: 'white' }}>Online Tools</a>
            <a href="/ai-studio.html" style={{ display: 'block', margin: '5px 0', textDecoration: 'none', color: 'white' }}>AI Photo Studio</a>
          </div>
        </div>
        <div className="footer-bottom" style={{ textAlign: 'center', padding: '20px', background: '#0b2946', color: 'rgba(255,255,255,0.7)' }}>
          © 2026 Best Computer. All Rights Reserved.
        </div>
      </footer>
    </>
  );
}

createRoot(document.getElementById('jobs-root')).render(
  <StrictMode>
    <JobsApp />
  </StrictMode>
);
