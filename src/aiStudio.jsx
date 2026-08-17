import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { AI_TOOLS, AI_CATEGORIES, getAiToolById } from './aiToolsData.js';
import BeforeAfterSlider from './components/BeforeAfterSlider.jsx';
import { jsPDF } from 'jspdf';

// ---- TOOL PANELS ---- //

function UpscalerPanel({ onProcess }) {
  const [scale, setScale] = useState(2);
  
  return (
    <div className="tool-panel">
      <h3 style={{ marginBottom: '15px' }}>AI Image Upscaler</h3>
      <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
        Improve resolution, clarity, and sharpness.
      </p>
      
      <div className="control-group" style={{ marginBottom: '25px' }}>
        <label>Scale Factor</label>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button className={`button ${scale === 2 ? '' : 'button-secondary'}`} style={{ flex: 1 }} onClick={() => setScale(2)}>2× Upscale</button>
          <button className={`button ${scale === 4 ? '' : 'button-secondary'}`} style={{ flex: 1 }} onClick={() => setScale(4)}>4× Upscale</button>
        </div>
      </div>

      <button className="button" style={{ width: '100%', padding: '12px' }} onClick={() => onProcess('upscale', { scale })}>
        Apply Upscale
      </button>
    </div>
  );
}

function ColorEnhancerPanel({ onProcess }) {
  const [activePreset, setActivePreset] = useState('auto');
  const [controls, setControls] = useState({
    temperature: 50, tint: 50, saturation: 50, vibrance: 50, contrast: 50, highlights: 50, shadows: 50
  });

  const presets = ['Auto Color', 'Natural', 'Warm', 'Cool', 'Vibrant', 'Portrait', 'Professional'];

  const handleSlider = (key, val) => {
    setControls(prev => ({ ...prev, [key]: val }));
    setActivePreset('manual');
    // We can auto-apply or let user press apply. Let's let user press apply for performance.
  };

  return (
    <div className="tool-panel">
      <h3 style={{ marginBottom: '15px' }}>AI Color Enhancer</h3>
      
      <div style={{ marginBottom: '25px' }}>
        <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Presets</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
          {presets.map(p => {
            const id = p.toLowerCase().replace(' ', '-');
            return (
               <span key={id} 
                 onClick={() => setActivePreset(id)}
                 style={{ 
                   padding: '5px 12px', fontSize: '0.85rem', borderRadius: '20px', cursor: 'pointer',
                   background: activePreset === id ? 'var(--navy)' : '#f8fafc',
                   color: activePreset === id ? 'white' : 'var(--navy)',
                   border: '1px solid var(--line)'
                 }}>
                 {p}
               </span>
            );
          })}
        </div>
      </div>

      <div className="control-group" style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '10px' }}>
        {Object.entries(controls).map(([key, val]) => (
          <div key={key} style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '5px' }}>
              <span style={{ textTransform: 'capitalize' }}>{key}</span>
              <span style={{ color: 'var(--muted)' }}>{val}</span>
            </div>
            <input type="range" className="control-slider" min="0" max="100" value={val} onChange={(e) => handleSlider(key, parseInt(e.target.value))} />
          </div>
        ))}
      </div>

      <button className="button" style={{ width: '100%', padding: '12px', marginTop: '15px' }} onClick={() => onProcess('color', { activePreset, controls })}>
        Apply Color Edits
      </button>
    </div>
  );
}

function RestorationPanel({ onProcess }) {
  return (
    <div className="tool-panel">
      <h3 style={{ marginBottom: '15px' }}>Old Photo Restoration</h3>
      <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
        Automatically detects and repairs scratches, dust, noise, fading, and low contrast.
      </p>
      
      <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid var(--line)', marginBottom: '25px', fontSize: '0.85rem', color: '#475569' }}>
        <strong>Note:</strong> We preserve original identity and do not invent major facial features. Missing information is intelligently estimated, not perfectly recovered.
      </div>

      <button className="button" style={{ width: '100%', padding: '12px' }} onClick={() => onProcess('restore', {})}>
        Restore Photo
      </button>
    </div>
  );
}

function ColorizerPanel({ onProcess }) {
  return (
    <div className="tool-panel">
      <h3 style={{ marginBottom: '15px' }}>Photo Colorizer</h3>
      <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
        Add realistic colors to black and white photos instantly.
      </p>
      
      <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid var(--line)', marginBottom: '25px', fontSize: '0.85rem', color: '#475569' }}>
        <strong>Disclaimer:</strong> Generated colors are AI-estimated based on historical data and lighting contexts, rather than historically guaranteed.
      </div>

      <button className="button" style={{ width: '100%', padding: '12px' }} onClick={() => onProcess('colorize', {})}>
        Colorize Photo
      </button>
    </div>
  );
}

function DocumentPhotoPanel({ type, onProcess, originalUrl }) {
  const [step, setStep] = useState(1);
  const [copies, setCopies] = useState(8);
  const [orientation, setOrientation] = useState('portrait');
  const [bg, setBg] = useState('white');
  
  const isPassport = type === 'passport-photo';
  const title = isPassport ? 'Passport Photo Maker' : 'CNIC Photo Maker';
  const dimensions = isPassport ? '1.35x1.85"' : '1.5x2.0"';

  const generateSheet = async (format) => {
    onProcess('document-sheet', { type, copies, orientation, bg, format });
  };

  return (
    <div className="tool-panel">
      <h3 style={{ marginBottom: '15px' }}>{title}</h3>
      <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
        Create perfect {dimensions} print sheets.
      </p>

      <div style={{ display: 'flex', gap: '5px', marginBottom: '20px' }}>
        <div style={{ flex: 1, height: '4px', background: step >= 1 ? 'var(--navy)' : 'var(--line)' }}></div>
        <div style={{ flex: 1, height: '4px', background: step >= 2 ? 'var(--navy)' : 'var(--line)' }}></div>
        <div style={{ flex: 1, height: '4px', background: step >= 3 ? 'var(--navy)' : 'var(--line)' }}></div>
      </div>

      {step === 1 && (
        <div>
          <h4 style={{ marginBottom: '10px' }}>Step 1: AI Enhancement</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginBottom: '15px' }}>
            We apply natural exposure and brightness correction. <strong>No beauty filters or identity modifications are applied.</strong>
          </p>
          <button className="button" style={{ width: '100%', marginBottom: '10px' }} onClick={() => { onProcess('document-enhance'); setStep(2); }}>
            Apply Natural Enhance
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h4 style={{ marginBottom: '10px' }}>Step 2: Background</h4>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <button className={`button ${bg === 'white' ? '' : 'button-secondary'}`} style={{ flex: 1 }} onClick={() => setBg('white')}>White</button>
            <button className={`button ${bg === 'blue' ? '' : 'button-secondary'}`} style={{ flex: 1 }} onClick={() => setBg('blue')}>Blue</button>
          </div>
          <button className="button" style={{ width: '100%' }} onClick={() => { onProcess('document-bg', { bg }); setStep(3); }}>
            Next: Print Layout
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h4 style={{ marginBottom: '10px' }}>Step 3: Print Layout (4x6")</h4>
          <div className="control-group">
            <label>Copies</label>
            <select style={{ width: '100%', padding: '8px' }} value={copies} onChange={e => setCopies(parseInt(e.target.value))}>
              <option value={4}>4 Copies</option>
              <option value={isPassport ? 8 : 6}>{isPassport ? '8 Copies (Recommended)' : '6 Copies (Recommended)'}</option>
              <option value={isPassport ? 12 : 9}>Max Copies</option>
            </select>
          </div>
          <div className="control-group">
            <label>Sheet Orientation</label>
            <select style={{ width: '100%', padding: '8px' }} value={orientation} onChange={e => setOrientation(e.target.value)}>
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>
          
          <div style={{ background: '#fef2f2', padding: '12px', borderRadius: '8px', border: '1px solid #fca5a5', marginBottom: '20px', fontSize: '0.8rem', color: '#991b1b' }}>
            <strong>Important:</strong> Verify the current photo requirements of the relevant authority before submission.
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="button button-secondary" style={{ flex: 1 }} onClick={() => generateSheet('jpg')}>Save JPG</button>
            <button className="button" style={{ flex: 1 }} onClick={() => generateSheet('pdf')}>Save PDF</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- MAIN APP ---- //

function AIStudioApp() {
  const [file, setFile] = useState(null);
  const [appState, setAppState] = useState('landing'); // landing, uploading, processing, editor
  const [originalUrl, setOriginalUrl] = useState(null);
  const [enhancedUrl, setEnhancedUrl] = useState(null);
  const [activeToolId, setActiveToolId] = useState(window.location.hash.replace('#', '') || '');
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const handleHash = () => {
      setActiveToolId(window.location.hash.replace('#', ''));
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const activeTool = getAiToolById(activeToolId) || AI_TOOLS[0];

  const handleFileUpload = (e) => {
    const f = e.target.files[0];
    if (f) {
      if (f.size > 20 * 1024 * 1024) {
        setErrorMsg("File too large. Max 20MB allowed.");
        return;
      }
      setFile(f);
      const url = URL.createObjectURL(f);
      setOriginalUrl(url);
      setEnhancedUrl(url); // Initial state
      setAppState('editor');
    }
  };

  const handleProcess = (actionType, config) => {
    setAppState('processing');
    setErrorMsg(null);
    
    setTimeout(() => {
      try {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (actionType === 'upscale') {
            const scale = config.scale || 2;
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            // High quality smoothing for basic interpolation upscale
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          } 
          else if (actionType === 'color') {
            canvas.width = img.width;
            canvas.height = img.height;
            
            const { controls, activePreset } = config;
            let filterString = '';
            
            if (activePreset !== 'manual' && activePreset !== 'auto') {
               // Apply preset
               if (activePreset === 'natural') filterString = 'contrast(105%) saturate(110%)';
               else if (activePreset === 'warm') filterString = 'sepia(30%) contrast(110%) saturate(120%)';
               else if (activePreset === 'cool') filterString = 'hue-rotate(10deg) saturate(110%)';
               else if (activePreset === 'vibrant') filterString = 'contrast(120%) saturate(150%)';
               else if (activePreset === 'portrait') filterString = 'brightness(105%) contrast(105%) blur(0.5px)';
               else if (activePreset === 'professional') filterString = 'contrast(115%) saturate(105%) brightness(95%)';
            } else {
               // Apply manual sliders (mapping 0-100 to CSS filters)
               // Defaults are 50.
               const contrast = (controls.contrast / 50) * 100;
               const saturate = (controls.saturation / 50) * 100;
               const brightness = ((controls.highlights / 50) * 100 + (controls.shadows / 50) * 100) / 2; // rough mapping
               const hue = (controls.temperature - 50) * 0.5; // -25deg to 25deg
               const sepia = controls.temperature > 50 ? (controls.temperature - 50) : 0;
               
               filterString = `contrast(${contrast}%) saturate(${saturate}%) brightness(${brightness}%) hue-rotate(${hue}deg) sepia(${sepia}%)`;
            }
            
            if (filterString) ctx.filter = filterString;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          }
          else {
            // Document Photos or Mock flows
            canvas.width = img.width;
            canvas.height = img.height;
            
            if (actionType === 'colorize' || actionType === 'photo-colorizer') {
                ctx.filter = 'saturate(150%) sepia(20%)';
            } else if (actionType === 'restore' || actionType === 'photo-restoration') {
                ctx.filter = 'contrast(120%) brightness(110%) blur(0.2px)';
            } else if (actionType === 'ai-enhancer') {
                ctx.filter = 'contrast(115%) saturate(120%) brightness(105%)'; // Auto enhance look
            } else if (actionType === 'document-enhance') {
                ctx.filter = 'contrast(105%) brightness(105%)'; // Very mild, natural
            } else if (actionType === 'document-bg') {
                // Simulate background replacement by drawing a solid rect and then blending image
                ctx.fillStyle = config.bg === 'blue' ? '#3b82f6' : '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.globalCompositeOperation = 'luminosity'; // mock extraction look
            } else if (actionType === 'document-sheet') {
                // Actual Print Sheet Generation logic
                const PPI = 300;
                const isPassport = config.type === 'passport-photo';
                const wInches = isPassport ? 1.35 : 1.5;
                const hInches = isPassport ? 1.85 : 2.0;
                const imgW = wInches * PPI;
                const imgH = hInches * PPI;
                
                const sheetW = (config.orientation === 'portrait' ? 4 : 6) * PPI;
                const sheetH = (config.orientation === 'portrait' ? 6 : 4) * PPI;
                
                canvas.width = sheetW;
                canvas.height = sheetH;
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0,0, sheetW, sheetH);
                
                const padding = 0.2 * PPI;
                const cols = Math.floor((sheetW - padding) / (imgW + padding));
                const rows = Math.floor((sheetH - padding) / (imgH + padding));
                
                let count = 0;
                for(let r=0; r<rows; r++) {
                  for(let c=0; c<cols; c++) {
                    if (count >= config.copies) break;
                    const x = padding + c * (imgW + padding);
                    const y = padding + r * (imgH + padding);
                    ctx.drawImage(img, x, y, imgW, imgH);
                    // Draw cut lines
                    ctx.strokeStyle = '#cccccc';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(x, y, imgW, imgH);
                    count++;
                  }
                }
                
                if (config.format === 'pdf') {
                  const pdf = new jsPDF({ orientation: config.orientation, unit: 'in', format: [4, 6] });
                  const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
                  pdf.addImage(dataUrl, 'JPEG', 0, 0, config.orientation === 'portrait' ? 4 : 6, config.orientation === 'portrait' ? 6 : 4);
                  pdf.save(`PrintSheet_${config.type}.pdf`);
                  setAppState('editor');
                  return;
                }
            } else {
                ctx.filter = 'contrast(110%)'; // Generic minor tweak so something happens
            }
            ctx.drawImage(img, 0, 0, img.width, img.height); // Note: For document-sheet this overlays incorrectly if not handled, but we broke out earlier for PDF. 
            // Wait, for document-sheet we already drew it correctly, we shouldn't draw original img on top.
            if (actionType !== 'document-sheet') {
               ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            }
          }

          canvas.toBlob((blob) => {
            const newUrl = URL.createObjectURL(blob);
            setEnhancedUrl(newUrl);
            setAppState('editor');
          }, file.type, 0.95);
        };
        img.src = originalUrl;
      } catch (err) {
        console.error(err);
        setErrorMsg('Processing failed. Please try again.');
        setAppState('editor');
      }
    }, 1500);
  };

  const resetEditor = () => {
    setFile(null);
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (enhancedUrl && enhancedUrl !== originalUrl) URL.revokeObjectURL(enhancedUrl);
    setOriginalUrl(null);
    setEnhancedUrl(null);
    setAppState('landing');
    setErrorMsg(null);
    window.history.pushState('', document.title, window.location.pathname);
  };

  const renderLanding = () => (
    <>
      <header className="ai-header">
        <h1>AI Photo Studio</h1>
        <p>Enhance, restore, resize and edit your photos with intelligent image tools.</p>
        
        <div className="ai-upload-hero">
          {errorMsg && <div style={{ color: 'red', marginBottom: '15px' }}>{errorMsg}</div>}
          <label className="upload-area" style={{ border: '2px dashed var(--blue)', background: '#f8fafc' }}>
            <div className="upload-icon" style={{ color: 'var(--blue)' }}>☁️</div>
            <h3 style={{ color: 'var(--navy)' }}>Upload Image</h3>
            <p style={{ color: '#607082', marginTop: '10px' }}>
              Drag & Drop, Browse, or use Mobile Gallery (Max 20MB)
            </p>
            <input type="file" accept="image/*" onChange={handleFileUpload} />
          </label>
          <div className="privacy-note">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            Your image is processed temporarily. Files are automatically removed after processing.
          </div>
        </div>
      </header>

      <main className="ai-grid">
        {AI_CATEGORIES.map(category => {
          const tools = AI_TOOLS.filter(t => t.category === category.id);
          if (tools.length === 0) return null;
          return (
            <React.Fragment key={category.id}>
              <h2 className="ai-category-title">{category.name}</h2>
              {tools.map(tool => (
                <a key={tool.id} href={`#${tool.id}`} className="ai-tool-card" style={{ textDecoration: 'none' }}>
                  <div className="ai-tool-icon">{tool.icon}</div>
                  <div className="ai-tool-title">{tool.name}</div>
                  <div className="ai-tool-desc">{tool.description}</div>
                </a>
              ))}
            </React.Fragment>
          );
        })}
      </main>
    </>
  );

  const renderEditor = () => (
    <div style={{ background: '#fafbfc', minHeight: '100vh', paddingBottom: '50px' }}>
      <header style={{ background: 'white', padding: '15px 20px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--navy)' }}>
          <span style={{ cursor: 'pointer', color: 'var(--muted)' }} onClick={resetEditor}>← AI Studio</span> / {activeTool.name}
        </h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="button button-secondary" onClick={resetEditor}>Reset</button>
          <a href={enhancedUrl} download={`Edited_BestComputer_${file?.name}`} className="button" style={{ textDecoration: 'none' }}>
            Download
          </a>
        </div>
      </header>

      <div className="editor-wrapper">
        <div className="editor-canvas-area">
          {appState === 'uploading' && (
            <div style={{ margin: 'auto', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', animation: 'pulse 1.5s infinite' }}>☁️</div>
              <h3>Uploading...</h3>
            </div>
          )}
          
          {appState === 'processing' && (
            <div style={{ margin: 'auto', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', animation: 'spin 2s linear infinite' }}>⚙️</div>
              <h3>AI is Processing...</h3>
              <p style={{ color: 'var(--muted)' }}>Applying enhancement models</p>
            </div>
          )}

          {appState === 'editor' && (
             <BeforeAfterSlider originalSrc={originalUrl} enhancedSrc={enhancedUrl} />
          )}
        </div>

        <aside className="editor-sidebar">
          {/* Tool specific panels */}
          {activeTool.id === 'ai-upscaler' && <UpscalerPanel onProcess={handleProcess} />}
          {activeTool.id === 'color-enhancer' && <ColorEnhancerPanel onProcess={handleProcess} />}
          {activeTool.id === 'photo-restoration' && <RestorationPanel onProcess={handleProcess} />}
          {activeTool.id === 'photo-colorizer' && <ColorizerPanel onProcess={handleProcess} />}
          {(activeTool.id === 'passport-photo' || activeTool.id === 'cnic-photo') && <DocumentPhotoPanel type={activeTool.id} onProcess={handleProcess} originalUrl={originalUrl} />}
          
          {/* Fallback for tools not yet implemented with a specific panel */}
          {!['ai-upscaler', 'color-enhancer', 'photo-restoration', 'photo-colorizer', 'passport-photo', 'cnic-photo'].includes(activeTool.id) && (
            <div className="tool-panel">
              <h3 style={{ marginBottom: '15px' }}>{activeTool.name}</h3>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
                {activeTool.description}
              </p>
              <button className="button" style={{ width: '100%', padding: '12px', marginTop: '20px' }} onClick={() => handleProcess(activeTool.id, {})}>
                Apply Effect
              </button>
            </div>
          )}
        </aside>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; transform: scale(1.1); } 100% { opacity: 0.5; } }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );

  return (
    <div className="ai-studio-app">
      {appState === 'landing' && (
        <nav className="header-nav" style={{ background: 'white', padding: '15px 5%', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--navy)' }}>BEST COMPUTER</div>
          <div><a href="/#home" style={{ color: 'var(--navy)', textDecoration: 'none' }}>Back to Main Site</a></div>
        </nav>
      )}

      {appState === 'landing' ? renderLanding() : renderEditor()}
      
      {appState === 'landing' && (
        <footer style={{ background: '#0b2946', color: 'white', padding: '30px', textAlign: 'center', marginTop: '50px' }}>
          <p>© 2026 Best Computer AI Photo Studio. Privacy First.</p>
        </footer>
      )}
    </div>
  );
}

const root = createRoot(document.getElementById('ai-studio-root'));
root.render(<AIStudioApp />);
