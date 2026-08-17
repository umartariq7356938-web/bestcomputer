import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

export default function PdfMerge({ tool }) {
  const [files, setFiles] = useState([]);
  const [state, setState] = useState('empty'); // empty, processing, success
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleFiles = (e) => {
    const newFiles = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles]);
      setState('empty');
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const newFiles = [...files];
    const temp = newFiles[index];
    newFiles[index] = newFiles[index - 1];
    newFiles[index - 1] = temp;
    setFiles(newFiles);
  };

  const moveDown = (index) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    const temp = newFiles[index];
    newFiles[index] = newFiles[index + 1];
    newFiles[index + 1] = temp;
    setFiles(newFiles);
  };

  const processPdfs = async () => {
    if (files.length < 2) {
      alert("Please select at least 2 PDF files to merge.");
      return;
    }
    setState('processing');

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(pdfBlob);
      
      setPdfUrl(url);
      setState('success');
    } catch (err) {
      console.error(err);
      alert('Error merging PDF files. Some files might be corrupted or protected.');
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
            <div className="upload-icon">📎</div>
            <h3>Drag & Drop or Click to Add PDFs</h3>
            <p style={{ color: '#607082', marginTop: '10px' }}>
              Supports PDF only (Max {tool.maxSizeMB}MB)
            </p>
            <input type="file" multiple accept={tool.acceptAttr} onChange={handleFiles} />
          </label>

          {files.length > 0 && (
            <div className="file-list-preview" style={{ marginTop: '20px' }}>
              <h4>Files to Merge ({files.length}):</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: '15px 0' }}>
                {files.map((f, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#f8fafc', marginBottom: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <button onClick={() => moveUp(i)} disabled={i===0} style={{ padding: '2px 8px', cursor: i===0?'not-allowed':'pointer' }}>▲</button>
                        <button onClick={() => moveDown(i)} disabled={i===files.length-1} style={{ padding: '2px 8px', cursor: i===files.length-1?'not-allowed':'pointer' }}>▼</button>
                      </div>
                      <span><strong>{i+1}.</strong> {f.name} ({(f.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                    <button onClick={() => removeFile(i)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', padding: '5px 10px' }}>Remove</button>
                  </li>
                ))}
              </ul>
              
              <button 
                className="button" 
                style={{ width: '100%', padding: '15px', fontSize: '1.1rem', opacity: files.length < 2 ? 0.5 : 1 }} 
                onClick={processPdfs}
                disabled={files.length < 2}
              >
                {files.length < 2 ? "Add at least 2 PDFs to merge" : "Merge PDFs Now"}
              </button>
            </div>
          )}
        </>
      )}

      {state === 'processing' && (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <div className="upload-icon">⏳</div>
          <h3>Merging PDFs...</h3>
          <p>Please wait, this happens entirely in your browser.</p>
        </div>
      )}

      {state === 'success' && (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <div className="upload-icon">✅</div>
          <h3 style={{ color: 'var(--green)' }}>PDF Merged Successfully!</h3>
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <a href={pdfUrl} download={`Merged_BestComputer_${Date.now()}.pdf`} className="button">
              Download Merged PDF
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
