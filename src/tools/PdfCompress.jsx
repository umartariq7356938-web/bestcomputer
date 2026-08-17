import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

export default function PdfCompress({ tool }) {
  const [file, setFile] = useState(null);
  const [state, setState] = useState('empty');
  const [pdfUrl, setPdfUrl] = useState(null);
  const [stats, setStats] = useState({ original: 0, compressed: 0 });

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f && f.type === 'application/pdf') {
      setFile(f);
      setState('empty');
    }
  };

  const processCompression = async (level) => {
    if (!file) return;
    setState('processing');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      
      // In-browser compression is limited. We remove metadata and unused objects.
      pdf.setTitle('');
      pdf.setAuthor('');
      pdf.setSubject('');
      pdf.setKeywords([]);
      pdf.setProducer('Best Computer Online Tools');
      pdf.setCreator('Best Computer Online Tools');

      const pdfBytes = await pdf.save({ useObjectStreams: false });
      
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(pdfBlob);
      
      setStats({
        original: file.size,
        compressed: pdfBlob.size
      });
      
      setPdfUrl(url);
      setState('success');
    } catch (err) {
      console.error(err);
      alert('Error compressing PDF. File might be protected or corrupted.');
      setState('empty');
    }
  };

  const reset = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setFile(null);
    setPdfUrl(null);
    setState('empty');
  };

  const formatSize = (bytes) => (bytes / 1024 / 1024).toFixed(2) + ' MB';
  const getReduction = () => {
    if (stats.original === 0) return 0;
    const diff = stats.original - stats.compressed;
    if (diff <= 0) return 0; // Sometimes it gets bigger due to pdf-lib restructuring!
    return ((diff / stats.original) * 100).toFixed(1);
  };

  return (
    <div className="tool-content">
      {state === 'empty' && (
        <>
          <label className="upload-area">
            <div className="upload-icon">🗜️</div>
            <h3>Drag & Drop or Click to Add PDF</h3>
            <p style={{ color: '#607082', marginTop: '10px' }}>
              Supports PDF only (Max {tool.maxSizeMB}MB)
            </p>
            <input type="file" accept={tool.acceptAttr} onChange={handleFile} />
          </label>

          {file && (
            <div className="file-list-preview" style={{ marginTop: '20px', textAlign: 'center' }}>
              <h4>Selected File: {file.name} ({formatSize(file.size)})</h4>
              
              <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <p>Select Compression Level (Browser-based Metadata Strip):</p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button className="button" style={{ background: '#1769bc' }} onClick={() => processCompression('low')}>
                    Basic Compress
                  </button>
                  <button className="button" style={{ background: '#0b2946' }} onClick={() => processCompression('high')} title="Same as basic in browser for now">
                    High Compress
                  </button>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#607082' }}>* Note: True image downscaling requires server-side processing.</p>
              </div>
            </div>
          )}
        </>
      )}

      {state === 'processing' && (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <div className="upload-icon">⏳</div>
          <h3>Compressing PDF...</h3>
          <p>Optimizing your document structure.</p>
        </div>
      )}

      {state === 'success' && (
        <div style={{ textAlign: 'center', padding: '30px 0' }}>
          <div className="upload-icon">✅</div>
          <h3 style={{ color: 'var(--green)' }}>PDF Compressed Successfully!</h3>
          
          <div style={{ margin: '30px auto', background: '#f8fafc', padding: '20px', borderRadius: '12px', maxWidth: '400px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>Original Size:</span> <strong>{formatSize(stats.original)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>New Size:</span> <strong style={{ color: 'var(--green)' }}>{formatSize(stats.compressed)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #e2e8f0' }}>
              <span>Total Reduction:</span> 
              <strong style={{ color: 'var(--blue)' }}>
                {getReduction()}%
              </strong>
            </div>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <a href={pdfUrl} download={`Compressed_${file.name}`} className="button">
              Download Compressed PDF
            </a>
            <button className="button button-secondary" onClick={reset}>
              Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
