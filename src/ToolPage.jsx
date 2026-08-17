import React from 'react';

// Basic SVG Icon component for tools
const Icon = ({ name, size = 24, className = "" }) => {
  const paths = {
    lock: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></>,
    arrowLeft: <><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></>,
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {paths[name] || <circle cx="12" cy="12" r="10"/>}
    </svg>
  );
};

export default function ToolPage({ tool, onBack, children }) {
  if (!tool) return null;

  return (
    <div className="tool-page-wrapper">
      <div className="tool-page-header">
        <a href="#/" onClick={(e) => { e.preventDefault(); onBack(); }} style={{ color: 'white', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px', opacity: 0.8 }}>
          <Icon name="arrowLeft" size={16} /> Back to Tools
        </a>
        <h1>{tool.name}</h1>
        <p style={{ opacity: 0.8, maxWidth: '600px', margin: '0 auto' }}>{tool.description}</p>
      </div>
      
      <div className="tool-workspace">
        {children}
        
        <div className="privacy-notice">
          <Icon name="lock" size={16} />
          <span>Your uploaded files are processed temporarily and are not intended for permanent storage.</span>
        </div>
      </div>
    </div>
  );
}
