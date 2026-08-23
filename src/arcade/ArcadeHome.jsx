import React, { useEffect, useState } from 'react';
import { getStats, getDailyChallenge } from './utils/gameLogic';

const ArcadeHome = ({ onPlay }) => {
  const [stats, setStats] = useState(null);
  const challenge = getDailyChallenge();

  useEffect(() => {
    setStats(getStats());
  }, []);

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="arcade-title">⌨️ TYPING ARCADE</h1>
        <p style={{ fontSize: '1.25rem', fontWeight: 600, margin: '1rem 0' }}>TYPE FAST. THINK FAST. BEAT YOUR SCORE.</p>
        <p className="arcade-subtitle">Choose a game, challenge yourself, and discover how fast your fingers really are.</p>
      </div>

      {stats && (
        <div className="arcade-glass arcade-stats-bar" style={{ padding: '2rem', marginBottom: '4rem' }}>
          <div className="stat-card">
            <span className="stat-label">⚡ Best WPM</span>
            <span className="stat-value">{stats.bestWPM}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">🎯 Best Accuracy</span>
            <span className="stat-value">{stats.bestAccuracy}%</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">🏆 Best Score</span>
            <span className="stat-value">{stats.bestScore}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">🔥 Best Combo</span>
            <span className="stat-value">x{stats.bestCombo}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">📅 Streak</span>
            <span className="stat-value">{stats.streak} <span style={{fontSize: '1rem'}}>Days</span></span>
          </div>
        </div>
      )}

      {stats && stats.gamesPlayed === 0 && (
        <p style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--arcade-secondary)' }}>
          Start your first game to build your stats!
        </p>
      )}

      <div className="arcade-games-grid">
        <div className="arcade-glass game-card" onClick={() => onPlay('racer')}>
          <div className="game-icon">🏎️</div>
          <h3>Typing Racer</h3>
          <p>Race against the clock. Type faster to move your car forward.</p>
          <div className="difficulty-badges">
            <span className="badge easy">🟢 Easy</span>
            <span className="badge medium">🟡 Med</span>
            <span className="badge hard">🔴 Hard</span>
          </div>
          <button className="arcade-btn">Play Now →</button>
        </div>

        <div className="arcade-glass game-card" onClick={() => onPlay('bomb')}>
          <div className="game-icon">💣</div>
          <h3>Word Bomb</h3>
          <p>Type the word before the countdown reaches zero. Survival mode!</p>
          <div className="difficulty-badges">
            <span className="badge medium">⏱️ Survival</span>
          </div>
          <button className="arcade-btn">Play Now →</button>
        </div>

        <div className="arcade-glass game-card" onClick={() => onPlay('battle')}>
          <div className="game-icon">⚡</div>
          <h3>Typing Battle</h3>
          <p>You have 60 seconds. How many words can you type?</p>
          <div className="difficulty-badges">
            <span className="badge medium">⏱️ 60s Challenge</span>
          </div>
          <button className="arcade-btn">Play Now →</button>
        </div>
      </div>
      
      <div className="arcade-glass" style={{ padding: '2rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🔥 Daily Typing Challenge</h3>
        <p style={{ color: 'var(--arcade-muted)', marginBottom: '1.5rem' }}>{challenge.text}</p>
        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '99px', height: '20px', overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${stats ? Math.min((stats.bestWPM / challenge.goal) * 100, 100) : 0}%`, background: 'var(--arcade-primary)', transition: 'width 1s' }}></div>
        </div>
        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>Reward: +100 XP</p>
      </div>

    </div>
  );
};

export default ArcadeHome;
