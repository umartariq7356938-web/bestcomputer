import React from 'react';

export default function BackgroundRemover({ tool }) {
  return (
    <div className="tool-content" style={{ textAlign: 'center', padding: '50px 20px' }}>
      <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✂️</div>
      <h2 style={{ color: 'var(--navy)', marginBottom: '15px' }}>AI Background Remover</h2>
      <p style={{ color: 'var(--muted)', maxWidth: '500px', margin: '0 auto 30px', lineHeight: '1.6' }}>
        This powerful AI tool is currently being fine-tuned to ensure fast processing and 100% privacy without sending your photos to the cloud.
      </p>
      
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '10px 20px', borderRadius: '30px', border: '1px solid var(--line)', color: 'var(--blue)', fontWeight: 'bold' }}>
        <span style={{ display: 'inline-block', width: '10px', height: '10px', background: 'var(--blue)', borderRadius: '50%', animation: 'pulse 2s infinite' }}></span>
        Coming Soon
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(23, 105, 188, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(23, 105, 188, 0); }
          100% { box-shadow: 0 0 0 0 rgba(23, 105, 188, 0); }
        }
      `}} />
    </div>
  );
}
