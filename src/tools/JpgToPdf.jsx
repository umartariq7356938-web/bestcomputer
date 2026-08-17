import React, { useState } from 'react';
import jsPDF from 'jspdf';

export default function JpgToPdf({ tool }) {
  const [files, setFiles] = useState([]);
  const [state, setState] = useState('empty'); // empty, processing, success
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleFiles = (e) => {
    const newFiles = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles]);
      setState('empty');
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const processImages = async () => {
    if (files.length === 0) return;
    setState('processing');

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Read file as Data URL
        const dataUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        });

        // Get image dimensions to maintain aspect ratio
        const img = new Image();
        img.src = dataUrl;
        await new Promise((resolve) => { img.onload = resolve; });

        const imgWidth = img.width;
        const imgHeight = img.height;
        const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
        
        const scaledWidth = imgWidth * ratio;
        const scaledHeight = imgHeight * ratio;

        // Center on page
        const x = (pageWidth - scaledWidth) / 2;
        const y = (pageHeight - scaledHeight) / 2;

        if (i > 0) pdf.addPage();
        
        const ext = file.type.split('/')[1].toUpperCase();
        pdf.addImage(dataUrl, ext === 'JPEG' ? 'JPEG' : 'PNG', x, y, scaledWidth, scaledHeight);
      }

      const pdfBlob = pdf.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      setState('success');
    } catch (err) {
      console.error(err);
      alert('Error converting images to PDF.');
      setState('empty');
    }
  };

  const reset = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setFiles([]);
    setPdfUrl(null);
    setState('empty');
  };

  return (
    <div className="tool-content">
      {state === 'empty' && (
        <>
          <label className="upload-area">
            <div className="upload-icon">🖼️</div>
            <h3>Drag & Drop or Click to Add Images</h3>
            <p style={{ color: '#607082', marginTop: '10px' }}>
              Supports JPG, PNG, WEBP (Max {tool.maxSizeMB}MB)
            </p>
            <input type="file" multiple accept={tool.acceptAttr} onChange={handleFiles} />
          </label>

          {files.length > 0 && (
            <div className="file-list-preview" style={{ marginTop: '20px' }}>
              <h4>Selected Images ({files.length}):</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: '15px 0' }}>
                {files.map((f, i) => (
                  <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f8fafc', marginBottom: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <span>{f.name} ({(f.size / 1024 / 1024).toFixed(2)} MB)</span>
                    <button onClick={() => removeFile(i)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>✖</button>
                  </li>
                ))}
              </ul>
              <button className="button" style={{ width: '100%', padding: '15px', fontSize: '1.1rem' }} onClick={processImages}>
                Convert to PDF
              </button>
            </div>
          )}
        </>
      )}

      {state === 'processing' && (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <div className="upload-icon">⏳</div>
          <h3>Converting Images...</h3>
          <p>Please wait, this happens entirely in your browser.</p>
        </div>
      )}

      {state === 'success' && (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <div className="upload-icon">✅</div>
          <h3 style={{ color: 'var(--green)' }}>PDF Generated Successfully!</h3>
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <a href={pdfUrl} download={`BestComputer_${Date.now()}.pdf`} className="button">
              Download PDF
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
