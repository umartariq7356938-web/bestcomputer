import React from 'react';

const ResultScreen = ({ data, onBack, onReplay }) => {
  if (!data) return null;

  return (
    <div className="game-container" style={{ justifyContent: 'center', minHeight: '60vh' }}>
      <div className="arcade-glass results-card">
        {data.isNewBest && <div className="new-best">🎉 NEW PERSONAL BEST! 🎉</div>}
        <h2 className="results-title">🏆 {data.title || 'GREAT RUN!'}</h2>
        
        <div className="results-grid">
          {data.wpm !== undefined && (
            <div className="result-item">
              <div className="stat-label">WPM</div>
              <div className="result-val">{data.wpm}</div>
            </div>
          )}
          {data.accuracy !== undefined && (
            <div className="result-item">
              <div className="stat-label">Accuracy</div>
              <div className="result-val">{data.accuracy}%</div>
            </div>
          )}
          {data.score !== undefined && (
            <div className="result-item">
              <div className="stat-label">Score</div>
              <div className="result-val">{data.score}</div>
            </div>
          )}
          {data.combo !== undefined && (
            <div className="result-item">
              <div className="stat-label">Max Combo</div>
              <div className="result-val">x{data.combo}</div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
          <button className="arcade-btn" onClick={onReplay}>⚡ Try Again</button>
          <button className="arcade-btn secondary" onClick={onBack}>🎮 Back to Arcade</button>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
