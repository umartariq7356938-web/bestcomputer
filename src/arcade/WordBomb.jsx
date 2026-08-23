import React, { useState, useEffect, useRef } from 'react';
import { getRandomWord, updateStatsFromGame } from './utils/gameLogic';

const WordBomb = ({ onFinish, onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [lives, setLives] = useState(3);
  const [word, setWord] = useState('');
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [bombTimer, setBombTimer] = useState(5.0);
  const [isError, setIsError] = useState(false);
  const [wordsTyped, setWordsTyped] = useState(0);

  const timerRef = useRef(null);
  const inputRef = useRef(null);
  const [isExploding, setIsExploding] = useState(false);

  const startGame = () => {
    setLives(3);
    setScore(0);
    setWordsTyped(0);
    spawnWord();
    setIsPlaying(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const spawnWord = () => {
    setWord(getRandomWord('medium'));
    setInput('');
    setBombTimer(5.0); // Reset bomb timer
    setIsExploding(false);
  };

  useEffect(() => {
    if (isPlaying && lives > 0) {
      timerRef.current = setInterval(() => {
        setBombTimer((prev) => {
          if (prev <= 0.1) {
            handleLifeLost();
            return 0;
          }
          return prev - 0.1;
        });
      }, 100);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, lives]);

  const handleLifeLost = () => {
    clearInterval(timerRef.current);
    setIsExploding(true);
    
    setTimeout(() => {
      if (lives <= 1) {
        endGame();
      } else {
        setLives((l) => l - 1);
        spawnWord();
        // Restart timer via useEffect dependency on lives
      }
    }, 500);
  };

  const endGame = () => {
    setIsPlaying(false);
    clearInterval(timerRef.current);
    const { isNewBest } = updateStatsFromGame(0, 100, score, 0, wordsTyped);
    onFinish({
      gameId: 'bomb',
      title: 'BOOM! GAME OVER',
      score,
      isNewBest
    });
  };

  const handleInput = (e) => {
    const val = e.target.value;
    setInput(val);

    if (word.startsWith(val)) {
      setIsError(false);
      if (val === word) {
        setScore((prev) => prev + 100);
        setWordsTyped((prev) => prev + 1);
        spawnWord(); // Immediately spawn next word
      }
    } else {
      setIsError(true);
    }
  };

  if (!isPlaying) {
    return (
      <div className="game-container">
        <h2 className="arcade-title">Word Bomb 💣</h2>
        <p style={{ marginBottom: '2rem' }}>Type the word before the countdown reaches zero. Survival mode!</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="arcade-btn" onClick={startGame}>Start Survival</button>
          <button className="arcade-btn secondary" onClick={onBack}>Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="hud arcade-glass">
        <div className="hud-item">
          <div className="stat-label">LIVES</div>
          <div className="lives-container">
            <span className={`life ${lives < 1 ? 'lost' : ''}`}>❤️</span>
            <span className={`life ${lives < 2 ? 'lost' : ''}`}>❤️</span>
            <span className={`life ${lives < 3 ? 'lost' : ''}`}>❤️</span>
          </div>
        </div>
        <div className="hud-item">
          <div className="stat-label">SCORE</div>
          <div className="hud-value">{score}</div>
        </div>
      </div>

      <div className="bomb-container">
        <div className={`bomb-icon ${bombTimer < 2 ? 'tick' : ''}`}>
          {isExploding ? '💥' : '💣'}
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 800, color: bombTimer < 2 ? 'var(--arcade-danger)' : '#fff' }}>
          {bombTimer.toFixed(1)}s
        </div>
      </div>

      <div className="typing-area-container">
        <div className="target-word-display" style={{ opacity: isExploding ? 0 : 1 }}>
          {word.split('').map((char, i) => {
            let stateClass = 'pending';
            if (i < input.length) {
              stateClass = input[i] === char ? 'correct' : 'incorrect';
            }
            return <span key={i} className={`char ${stateClass}`}>{char}</span>;
          })}
        </div>
        <input 
          ref={inputRef}
          type="text" 
          value={input} 
          onChange={handleInput}
          className={`arcade-input ${isError ? 'error' : ''}`}
          placeholder="Type to defuse..."
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          disabled={isExploding}
        />
      </div>
    </div>
  );
};

export default WordBomb;
