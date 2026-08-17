import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './bills.css';

const UTILITIES = [
  {
    id: 'lesco',
    name: 'LESCO',
    fullName: 'Lahore Electric Supply Company',
    icon: '⚡',
    color: '#f59e0b',
    description: 'Check your electricity bill for Lahore & surroundings.',
    billUrl: 'https://bill.pitc.com.pk',
    placeholder: '14-digit Reference Number',
    label: 'Reference Number',
    note: 'Enter your 14-digit reference number on the LESCO bill website.'
  },
  {
    id: 'mepco',
    name: 'MEPCO',
    fullName: 'Multan Electric Power Company',
    icon: '⚡',
    color: '#f59e0b',
    description: 'Check electricity bill for Multan, Bahawalpur & surroundings.',
    billUrl: 'https://www.mepco.com.pk',
    placeholder: '14-digit Reference Number',
    label: 'Reference Number',
    note: 'Go to "Bill Inquiry" section and enter your reference number.'
  },
  {
    id: 'iesco',
    name: 'IESCO',
    fullName: 'Islamabad Electric Supply Company',
    icon: '⚡',
    color: '#f59e0b',
    description: 'Check electricity bill for Islamabad, Rawalpindi & surroundings.',
    billUrl: 'https://www.iesco.com.pk',
    placeholder: '14-digit Reference Number',
    label: 'Reference Number',
    note: 'Go to "Bill Inquiry" section and enter your 14-digit reference number.'
  },
  {
    id: 'sngpl',
    name: 'SNGPL',
    fullName: 'Sui Northern Gas Pipelines',
    icon: '🔥',
    color: '#ef4444',
    description: 'Check your gas bill for Punjab & KPK regions.',
    billUrl: 'https://www.sngpl.com.pk',
    placeholder: '11-digit Consumer Number',
    label: 'Consumer Number',
    note: 'Find "Duplicate Bill" or "Bill Status" section and enter your consumer number.'
  },
  {
    id: 'ssgc',
    name: 'SSGC',
    fullName: 'Sui Southern Gas Company',
    icon: '🔥',
    color: '#ef4444',
    description: 'Check your gas bill for Sindh & Balochistan regions.',
    billUrl: 'https://www.ssgc.com.pk',
    placeholder: '10-digit Customer Number',
    label: 'Customer Number',
    note: 'Go to "Customer Services > Bill Inquiry" and enter your customer number.'
  },
  {
    id: 'ptcl',
    name: 'PTCL',
    fullName: 'Pakistan Telecom Company',
    icon: '📞',
    color: '#3b82f6',
    description: 'Check your PTCL landline or broadband bill.',
    billUrl: 'https://www.ptcl.com.pk',
    placeholder: 'Account Number / Phone Number',
    label: 'Account Number',
    note: 'Go to "Bill Inquiry" section and enter your phone or account number.'
  },
  {
    id: 'kelectric',
    name: 'K-Electric',
    fullName: 'K-Electric (Karachi)',
    icon: '⚡',
    color: '#8b5cf6',
    description: 'Check electricity bill for Karachi & surroundings.',
    billUrl: 'https://www.ke.com.pk',
    placeholder: '13-digit Account Number',
    label: 'Account Number',
    note: 'Click "Bill Inquiry" and enter your 13-digit account number.'
  },
  {
    id: 'wasa',
    name: 'WASA',
    fullName: 'Water & Sanitation Agency',
    icon: '💧',
    color: '#06b6d4',
    description: 'Check your water bill (Lahore, Rawalpindi).',
    billUrl: 'https://wasa.punjab.gov.pk',
    placeholder: 'Consumer Number',
    label: 'Consumer Number',
    note: 'Visit WASA official portal and find the bill inquiry section.'
  }
];

function UtilityCard({ utility, onSelect }) {
  return (
    <article className="utility-card" onClick={() => onSelect(utility)}>
      <div className="utility-icon" style={{ background: utility.color + '22', color: utility.color }}>
        {utility.icon}
      </div>
      <div className="utility-info">
        <h3>{utility.name}</h3>
        <p className="utility-full">{utility.fullName}</p>
        <p className="utility-desc">{utility.description}</p>
      </div>
      <span className="check-bill-btn">Check Bill →</span>
    </article>
  );
}

function BillModal({ utility, onClose }) {

  const handleCheck = () => {
    window.open(utility.billUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-icon" style={{ background: utility.color + '22', color: utility.color }}>
          {utility.icon}
        </div>
        <h2>{utility.name} Bill Inquiry</h2>
        <p>{utility.fullName}</p>
        <div className="steps-box">
          <p><strong>Steps to check your bill:</strong></p>
          <ol style={{ textAlign: 'left', paddingLeft: '1.25rem', margin: '0', color: '#334155', fontSize: '0.9rem' }}>
            <li>Click the button below to open the official {utility.name} website.</li>
            <li>Enter your <strong>{utility.label}</strong> ({utility.placeholder}) on their site.</li>
            <li>Your bill details will appear on the official {utility.name} portal.</li>
          </ol>
        </div>
        <p className="privacy-note">
          🔒 No data is stored by Best Computer. You will go directly to the official {utility.name} website.
        </p>
        <button onClick={handleCheck} style={{ background: utility.color, width: '100%', padding: '0.875rem', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', marginTop: '0.5rem' }}>
          Go to Official {utility.name} Website →
        </button>
      </div>
    </div>
  );
}

function BillsApp() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = UTILITIES.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <header className="bills-header">
        <div className="nav-wrap">
          <a href="/" className="brand">
            <span>BEST <b>COMPUTER</b><small>Digital service center</small></span>
          </a>
          <nav>
            <a href="/">Home</a>
            <a href="/jobs.html">Govt Jobs</a>
            <a href="/bills.html" className="active">Utility Bills</a>
          </nav>
        </div>
      </header>

      <main className="bills-main">
        <div className="bills-hero">
          <h1>⚡ Utility Bill Inquiry</h1>
          <p>Check your electricity, gas, water, and telecom bills instantly — securely redirected to official sources.</p>
          <div className="search-wrap">
            <input
              type="text"
              placeholder="Search utility (e.g. LESCO, SNGPL...)"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="utilities-grid">
          {filtered.map(utility => (
            <UtilityCard key={utility.id} utility={utility} onSelect={setSelected} />
          ))}
        </div>

        <div className="disclaimer">
          <p>⚠️ <strong>Disclaimer:</strong> Best Computer does not store any personal data. All bill inquiries are performed directly on the respective utility company's official website. This page is provided for convenience only.</p>
        </div>
      </main>

      <footer className="bills-footer">
        <p>© 2026 Best Computer. All Rights Reserved.</p>
      </footer>

      {selected && <BillModal utility={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

createRoot(document.getElementById('bills-root')).render(
  <StrictMode><BillsApp /></StrictMode>
);
