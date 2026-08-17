import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { TOOLS, CATEGORIES, getToolById } from './toolsData.js';
import ToolPage from './ToolPage.jsx';

import JpgToPdf from './tools/JpgToPdf.jsx';
import PdfMerge from './tools/PdfMerge.jsx';
import PdfCompress from './tools/PdfCompress.jsx';
import ServerTool from './tools/ServerTool.jsx';
import ImageResize from './tools/ImageResize.jsx';
import PassportPhoto from './tools/PassportPhoto.jsx';
import CnicPhoto from './tools/CnicPhoto.jsx';
import BackgroundRemover from './tools/BackgroundRemover.jsx';

// Basic Icons
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon">
    <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

// Map Tool ID to its component implementation
const ToolRenderer = ({ tool }) => {
  switch (tool.id) {
    case 'jpg-to-pdf': return <JpgToPdf tool={tool} />;
    case 'pdf-merge': return <PdfMerge tool={tool} />;
    case 'pdf-compress': return <PdfCompress tool={tool} />;
    case 'word-to-pdf': return <ServerTool tool={tool} apiEndpoint="/word-to-pdf" />;
    case 'pdf-to-word': return <ServerTool tool={tool} apiEndpoint="/pdf-to-word" />;
    case 'image-resize': return <ImageResize tool={tool} />;
    case 'passport-photo': return <PassportPhoto tool={tool} />;
    case 'cnic-photo': return <CnicPhoto tool={tool} />;
    case 'background-remover': return <BackgroundRemover tool={tool} />;
    default:
      // Fallback for tools not yet implemented
      return (
        <div style={{ textAlign: 'center', padding: '50px 20px', color: '#607082' }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🚧</div>
          <h3>Coming Soon</h3>
          <p>This tool is currently under development.</p>
        </div>
      );
  }
};

// Tools Carousel Component
function ToolsCarousel() {
  const availableTools = TOOLS.filter(t => t.status !== 'coming-soon');
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive(prev => (prev + 1) % availableTools.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [availableTools.length]);

  if (availableTools.length === 0) return null;
  const tool = availableTools[active];

  return (
    <section style={{ padding: '0 20px', maxWidth: '1000px', margin: '0 auto 40px' }}>
      <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', position: 'relative', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div key={tool.id} style={{ textAlign: 'center', padding: '20px', animation: 'fadeIn 0.5s ease' }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>{tool.emoji}</div>
          <h2 style={{ color: 'var(--navy)', margin: '0 0 10px 0' }}>{tool.name}</h2>
          <p style={{ color: 'var(--muted)', margin: 0 }}>{tool.description}</p>
          <a href={`#/${tool.id}`} className="button" style={{ marginTop: '15px', display: 'inline-block' }}>Try Now</a>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}} />
    </section>
  );
}

// Main App Component
function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeToolId, setActiveToolId] = useState(null);

  // Simple Hash Router
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#/', '');
      if (hash) {
        const tool = getToolById(hash);
        if (tool) setActiveToolId(hash);
        else setActiveToolId(null);
      } else {
        setActiveToolId(null);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const filteredTools = TOOLS.filter(tool => {
    const matchesCat = activeCategory === 'all' || tool.category === activeCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const goHome = () => {
    window.location.hash = '/';
  };

  // Common Header & Footer from existing design
  const renderHeader = () => (
    <header className="header scrolled">
      <div className="nav-wrap">
        <a href="/" className="brand">
          <span className="brand-mark">
            <svg className="icon" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="12" rx="2"></rect><path d="M8 20h8M12 16v4"></path></svg>
          </span>
          <span>BEST <b>COMPUTER</b><small>Digital service center</small></span>
        </a>
        <nav className="desktop-nav">
          <a href="/">Home</a>
          <a href="/#services">Services</a>
          <a href="/tools.html" style={{ color: 'var(--green)', fontWeight: 'bold' }}>Online Tools</a>
        </nav>
      </div>
    </header>
  );

  const renderFooter = () => (
    <footer>
      <div className="footer-main">
        <div className="footer-brand">
          <a href="/" className="brand">
            <span>BEST <b>COMPUTER</b></span>
          </a>
          <p>Computer, Digital & Photostudio Services Under One Roof.</p>
        </div>
      </div>
      <div className="footer-bottom">
        © 2026 Best Computer. All Rights Reserved.
      </div>
    </footer>
  );

  if (activeToolId) {
    const tool = getToolById(activeToolId);
    return (
      <>
        {renderHeader()}
        <main style={{ minHeight: '100vh', paddingTop: '70px', background: '#f8fafc' }}>
          <ToolPage tool={tool} onBack={goHome}>
            <ToolRenderer tool={tool} />
          </ToolPage>
        </main>
        {renderFooter()}
      </>
    );
  }

  return (
    <>
      {renderHeader()}
      <main id="tools-root" style={{ paddingTop: '70px' }}>
        <section className="tools-hero">
          <h1>Free Online Tools</h1>
          <p>Convert, compress, resize and prepare your documents and photos easily.</p>
          <div className="tools-search">
            <input 
              type="text" 
              placeholder="Search a tool..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchIcon />
          </div>
        </section>

        {!searchQuery && <ToolsCarousel />}

        <section className="tools-categories">
          {CATEGORIES.map(cat => (
            <button 
              key={cat.id} 
              className={`cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span>{cat.emoji}</span> {cat.label}
            </button>
          ))}
        </section>

        <section className="tools-container">
          {filteredTools.length > 0 ? (
            <div className="tools-grid">
              {filteredTools.map(tool => (
                <a 
                  key={tool.id} 
                  href={`#/${tool.id}`} 
                  className={`tool-card ${tool.status === 'coming-soon' ? 'tool-coming-soon' : ''}`}
                >
                  <div className="tool-icon">{tool.emoji}</div>
                  <h3>
                    {tool.name} 
                    {tool.status === 'coming-soon' && <span className="tool-badge">Soon</span>}
                  </h3>
                  <p>{tool.description}</p>
                  <span className="tool-btn">Open Tool</span>
                </a>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '50px', color: 'var(--muted)' }}>
              <h3>No tools found matching "{searchQuery}"</h3>
            </div>
          )}
        </section>
      </main>
      {renderFooter()}
    </>
  );
}

const root = createRoot(document.getElementById('tools-root'));
root.render(<App />);
