import React, { useState } from 'react';

export default function ServerTool({ tool, apiEndpoint }) {
  const [file, setFile] = useState(null);
  const [state, setState] = useState('empty');
  const [downloadUrl, setDownloadUrl] = useState(null);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setState('empty');
    }
  };

  const processFile = async () => {
    if (!file) return;
    setState('processing');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`http://localhost:5000/api/tools${apiEndpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to convert file.');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setState('success');
    } catch (err) {
      console.error(err);
      alert('Error processing document. Ensure server is running and LibreOffice is installed on the host.');
      setState('empty');
    }
  };

  const reset = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFile(null);
    setDownloadUrl(null);
    setState('empty');
  };

  return (
    <div className="tool-content">
      {state === 'empty' && (
        <>
          <label className="upload-area">
            <div className="upload-icon">{tool.emoji}</div>
            <h3>Drag & Drop or Click to Add File</h3>
            <p style={{ color: '#607082', marginTop: '10px' }}>
              Supports {tool.acceptAttr} (Max {tool.maxSizeMB}MB)
            </p>
            <input type="file" accept={tool.acceptAttr} onChange={handleFile} />
          </label>

          {file && (
            <div className="file-list-preview" style={{ marginTop: '20px', textAlign: 'center' }}>
              <h4>Selected File: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</h4>
              <button className="button" style={{ width: '100%', padding: '15px', fontSize: '1.1rem', marginTop: '15px' }} onClick={processFile}>
                Convert Now
              </button>
            </div>
          )}
        </>
      )}

      {state === 'processing' && (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <div className="upload-icon">⏳</div>
          <h3>Converting Document...</h3>
          <p>Please wait, uploading and processing securely on the server.</p>
        </div>
      )}

      {state === 'success' && (
        <div style={{ textAlign: 'center', padding: '30px 0' }}>
          <div className="upload-icon">✅</div>
          <h3 style={{ color: 'var(--green)' }}>Document Converted Successfully!</h3>
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <a href={downloadUrl} download={`Converted_${file.name}${tool.outputFormat}`} className="button">
              Download File
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
