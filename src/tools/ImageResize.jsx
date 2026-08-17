import React, { useState, useRef, useEffect } from 'react';

export default function ImageResize({ tool }) {
  const [file, setFile] = useState(null);
  const [state, setState] = useState('empty');
  const [originalDimensions, setOriginalDimensions] = useState({ w: 0, h: 0 });
  const [targetDimensions, setTargetDimensions] = useState({ w: 0, h: 0 });
  const [maintainRatio, setMaintainRatio] = useState(true);
  const [resultUrl, setResultUrl] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(null);
  
  const canvasRef = useRef(null);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f && f.type.startsWith('image/')) {
      setFile(f);
      const url = URL.createObjectURL(f);
      setPreviewSrc(url);
      
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ w: img.width, h: img.height });
        setTargetDimensions({ w: img.width, h: img.height });
        setState('settings');
      };
      img.src = url;
    }
  };

  const handleWidthChange = (e) => {
    const newW = parseInt(e.target.value) || 0;
    if (maintainRatio && originalDimensions.w > 0) {
      const ratio = originalDimensions.h / originalDimensions.w;
      setTargetDimensions({ w: newW, h: Math.round(newW * ratio) });
    } else {
      setTargetDimensions(prev => ({ ...prev, w: newW }));
    }
  };

  const handleHeightChange = (e) => {
    const newH = parseInt(e.target.value) || 0;
    if (maintainRatio && originalDimensions.h > 0) {
      const ratio = originalDimensions.w / originalDimensions.h;
      setTargetDimensions({ w: Math.round(newH * ratio), h: newH });
    } else {
      setTargetDimensions(prev => ({ ...prev, h: newH }));
    }
  };

  const processResize = async () => {
    if (!file || targetDimensions.w <= 0 || targetDimensions.h <= 0) return;
    setState('processing');

    try {
      const canvas = canvasRef.current;
      canvas.width = targetDimensions.w;
      canvas.height = targetDimensions.h;
      const ctx = canvas.getContext('2d');

      const img = new Image();
      img.src = previewSrc;
      await new Promise((resolve) => { img.onload = resolve; });

      ctx.drawImage(img, 0, 0, targetDimensions.w, targetDimensions.h);

      const ext = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      const resultDataUrl = canvas.toDataURL(ext, 0.9);
      
      setResultUrl(resultDataUrl);
      setState('success');
    } catch (err) {
      console.error(err);
      alert('Error resizing image.');
      setState('settings');
    }
  };

  const reset = () => {
    if (previewSrc) URL.revokeObjectURL(previewSrc);
    setFile(null);
    setResultUrl(null);
    setState('empty');
  };

  return (
    <div className="tool-content">
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

      {state === 'empty' && (
        <label className="upload-area">
          <div className="upload-icon">📐</div>
          <h3>Drag & Drop or Click to Add Image</h3>
          <p style={{ color: '#607082', marginTop: '10px' }}>
            Supports JPG, PNG, WEBP (Max {tool.maxSizeMB}MB)
          </p>
          <input type="file" accept={tool.acceptAttr} onChange={handleFile} />
        </label>
      )}

      {state === 'settings' && (
        <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px', textAlign: 'center' }}>
            <h4>Original Preview</h4>
            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid var(--line)', marginTop: '15px' }}>
              <img src={previewSrc} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }} />
              <p style={{ marginTop: '10px', color: 'var(--muted)', fontSize: '0.9rem' }}>
                {originalDimensions.w} x {originalDimensions.h} px
              </p>
            </div>
          </div>
          
          <div style={{ flex: '1 1 300px', background: '#f8fafc', padding: '25px', borderRadius: '12px', border: '1px solid var(--line)' }}>
            <h4 style={{ marginBottom: '20px' }}>Resize Settings</h4>
            
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '5px' }}>Width (px)</label>
                <input type="number" value={targetDimensions.w} onChange={handleWidthChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--line)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--muted)', marginBottom: '5px' }}>Height (px)</label>
                <input type="number" value={targetDimensions.h} onChange={handleHeightChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--line)' }} />
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '25px' }}>
              <input type="checkbox" checked={maintainRatio} onChange={(e) => setMaintainRatio(e.target.checked)} />
              <span>Lock Aspect Ratio</span>
            </label>

            <button className="button" style={{ width: '100%', padding: '12px' }} onClick={processResize}>
              Resize Image
            </button>
            <button className="button button-secondary" style={{ width: '100%', padding: '12px', marginTop: '10px' }} onClick={reset}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {state === 'processing' && (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <div className="upload-icon">⏳</div>
          <h3>Resizing Image...</h3>
        </div>
      )}

      {state === 'success' && (
        <div style={{ textAlign: 'center', padding: '30px 0' }}>
          <div className="upload-icon">✅</div>
          <h3 style={{ color: 'var(--green)', marginBottom: '20px' }}>Image Resized Successfully!</h3>
          
          <p style={{ marginBottom: '20px' }}>
            New Dimensions: <strong>{targetDimensions.w} x {targetDimensions.h} px</strong>
          </p>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <a href={resultUrl} download={`Resized_${file.name}`} className="button">
              Download Resized Image
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
