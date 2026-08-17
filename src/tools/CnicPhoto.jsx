import React, { useState, useRef } from 'react';

export default function CnicPhoto({ tool }) {
  const [file, setFile] = useState(null);
  const [orientation, setOrientation] = useState('landscape'); // landscape | portrait
  const [state, setState] = useState('empty');
  const [resultUrl, setResultUrl] = useState(null);
  const canvasRef = useRef(null);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f && f.type.startsWith('image/')) {
      setFile(f);
      setState('empty');
    }
  };

  const processPhoto = async () => {
    if (!file) return;
    setState('processing');

    try {
      const dataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });

      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => { img.onload = resolve; });

      // Settings: 300 DPI
      const dpi = 300;
      
      // Target pic dimensions for CNIC (typically 1.5" x 2")
      const picW = Math.round(1.5 * dpi); // 450px
      const picH = Math.round(2.0 * dpi); // 600px

      // Target Sheet dimensions
      const isLandscape = orientation === 'landscape';
      const sheetW = (isLandscape ? 6 : 4) * dpi; 
      const sheetH = (isLandscape ? 4 : 6) * dpi; 

      // Setup Canvas
      const canvas = canvasRef.current;
      canvas.width = sheetW;
      canvas.height = sheetH;
      const ctx = canvas.getContext('2d');

      // Fill white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, sheetW, sheetH);

      // Center crop to 1.5 : 2 ratio
      const targetRatio = picW / picH;
      const imgRatio = img.width / img.height;
      let sWidth, sHeight, sx, sy;
      if (imgRatio > targetRatio) {
        sHeight = img.height;
        sWidth = sHeight * targetRatio;
        sx = (img.width - sWidth) / 2;
        sy = 0;
      } else {
        sWidth = img.width;
        sHeight = sWidth / targetRatio;
        sx = 0;
        sy = (img.height - sHeight) / 2;
      }

      // Grid logic based on orientation
      // Landscape (6x4): 3 cols, 2 rows (6 pics)
      // Portrait (4x6): 2 cols, 3 rows (6 pics)
      const cols = isLandscape ? 3 : 2;
      const rows = isLandscape ? 2 : 3;
      
      const totalPicsW = cols * picW;
      const totalPicsH = rows * picH;
      const gapX = (sheetW - totalPicsW) / (cols + 1);
      const gapY = (sheetH - totalPicsH) / (rows + 1);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = gapX + c * (picW + gapX);
          const y = gapY + r * (picH + gapY);
          
          ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, picW, picH);
          ctx.strokeStyle = '#cccccc';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, picW, picH);
        }
      }

      const resultDataUrl = canvas.toDataURL('image/jpeg', 0.95);
      setResultUrl(resultDataUrl);
      setState('success');
    } catch (err) {
      console.error(err);
      alert('Error processing photo.');
      setState('empty');
    }
  };

  const reset = () => {
    setFile(null);
    setResultUrl(null);
    setState('empty');
  };

  return (
    <div className="tool-content">
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

      {state === 'empty' && (
        <>
          <label className="upload-area">
            <div className="upload-icon">🪪</div>
            <h3>Drag & Drop or Click to Add Photo</h3>
            <p style={{ color: '#607082', marginTop: '10px' }}>
              Upload a clear photo for NADRA CNIC requirements. (Blue/White background recommended)
            </p>
            <input type="file" accept={tool.acceptAttr} onChange={handleFile} />
          </label>

          {file && (
            <div className="file-list-preview" style={{ marginTop: '20px', textAlign: 'center' }}>
              <h4>Selected Photo: {file.name}</h4>
              
              <div style={{ margin: '20px 0', background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid var(--line)' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Select Sheet Orientation:</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="radio" name="orient" checked={orientation === 'landscape'} onChange={() => setOrientation('landscape')} />
                    Landscape 6x4 (6 Photos)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input type="radio" name="orient" checked={orientation === 'portrait'} onChange={() => setOrientation('portrait')} />
                    Portrait 4x6 (6 Photos)
                  </label>
                </div>
              </div>

              <button className="button" style={{ width: '100%', padding: '15px', fontSize: '1.1rem' }} onClick={processPhoto}>
                Generate Print Sheet
              </button>
            </div>
          )}
        </>
      )}

      {state === 'processing' && (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <div className="upload-icon">⏳</div>
          <h3>Generating Print Sheet...</h3>
        </div>
      )}

      {state === 'success' && (
        <div style={{ textAlign: 'center', padding: '30px 0' }}>
          <div className="upload-icon">✅</div>
          <h3 style={{ color: 'var(--green)', marginBottom: '20px' }}>Sheet Generated Successfully!</h3>
          
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', display: 'inline-block', border: '1px solid var(--line)' }}>
             <img src={resultUrl} alt="CNIC Sheet Preview" style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
          </div>

          <div style={{ marginTop: '30px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <a href={resultUrl} download={`CNIC_Sheet_${orientation}_${Date.now()}.jpg`} className="button">
              Download Print-Ready JPG
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
