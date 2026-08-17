import React, { useState, useRef, useEffect } from 'react';

export default function BeforeAfterSlider({ originalSrc, enhancedSrc }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef(null);

  const handleDrag = (e) => {
    if (!containerRef.current) return;
    
    let clientX;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
    } else if (e.clientX !== undefined) {
      clientX = e.clientX;
    } else {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  const startDrag = (e) => {
    handleDrag(e);
    
    const stopDrag = () => {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', stopDrag);
      document.removeEventListener('touchmove', handleDrag);
      document.removeEventListener('touchend', stopDrag);
    };

    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', handleDrag);
    document.addEventListener('touchend', stopDrag);
  };

  return (
    <div 
      ref={containerRef}
      className="ba-slider-container"
      onMouseDown={startDrag}
      onTouchStart={startDrag}
    >
      {/* Enhanced Image (Background) */}
      <img src={enhancedSrc} alt="Enhanced" className="ba-image ba-enhanced" draggable="false" />
      
      {/* Original Image (Foreground, clipped) */}
      <div 
        className="ba-original-wrapper"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img src={originalSrc} alt="Original" className="ba-image ba-original" draggable="false" />
      </div>

      {/* Slider Handle */}
      <div className="ba-handle" style={{ left: `${sliderPosition}%` }}>
        <div className="ba-handle-line"></div>
        <div className="ba-handle-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </div>
      </div>
      
      {/* Labels */}
      <div className="ba-label ba-label-original" style={{ opacity: sliderPosition > 20 ? 1 : 0 }}>ORIGINAL</div>
      <div className="ba-label ba-label-enhanced" style={{ opacity: sliderPosition < 80 ? 1 : 0 }}>ENHANCED</div>
    </div>
  );
}
