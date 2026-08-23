import React, { useState, useEffect, useRef } from 'react';
import { getRandomWord, calculateWPM, calculateAccuracy, updateStatsFromGame } from './utils/gameLogic';

const TypingBattle = ({ onFinish, onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [word, setWord] = useState('');
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalTypedChars, setTotalTypedChars] = useState(0);
  const [isError, setIsError] = useState(false);

  const timerRef = useRef(null);
  const inputRef = useRef(null);

  const startPreGame = () => {
    setCountdown(3);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setCorrectChars(0);
    setTotalTypedChars(0);
    setIsPlaying('starting');
    
    let counter = 3;
    const countInterval = setInterval(() => {
      counter -= 1;
      setCountdown(counter);
      if (counter <= 0) {
        clearInterval(countInterval);
        startGame();
      }
    }, 1000);
  };

  const startGame = () => {
    setTimeLeft(60);
    setWord(getRandomWord('medium'));
    setInput('');
    setIsPlaying('playing');
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  useEffect(() => {
    if (isPlaying === 'playing') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying]);

  const endGame = () => {
    setIsPlaying(false);
    clearInterval(timerRef.current);

    const wpm = calculateWPM(correctChars, 60);
    const accuracy = calculateAccuracy(correctChars, totalTypedChars);
    
    const { isNewBest } = updateStatsFromGame(wpm, accuracy, score, maxCombo, Math.floor(correctChars / 5));

    onFinish({
      gameId: 'battle',
      title: 'TIME IS UP!',
      wpm,
      accuracy,
      score,
      combo: maxCombo,
      isNewBest
    });
  };

  const handleInput = (e) => {
    const val = e.target.value;
    setInput(val);
    setTotalTypedChars((prev) => prev + 1);

    if (word.startsWith(val)) {
      setIsError(false);
      if (val === word) {
        const newCombo = combo + 1;
        setCombo(newCombo);
        setMaxCombo(Math.max(maxCombo, newCombo));
        setCorrectChars((prev) => prev + word.length);
        
        // Multiplier logic
        const multiplier = Math.min(1 + Math.floor(newCombo / 5) * 0.5, 3);
        setScore((prev) => Math.floor(prev + (word.length * 10 * multiplier)));
        
        setWord(getRandomWord(newCombo > 10 ? 'hard' : 'medium'));
        setInput('');
      }
    } else {
      setIsError(true);
      setCombo(0); // Mistake resets combo
    }
  };

  if (!isPlaying) {
    return (
      <div className="game-container">
        <h2 className="arcade-title">Typing Battle ⚡</h2>
        <p style={{ marginBottom: '2rem' }}>You have 60 seconds. How many words can you type? Build your combo for more points!</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="arcade-btn" onClick={startPreGame}>Start Battle</button>
          <button className="arcade-btn secondary" onClick={onBack}>Back</button>
        </div>
      </div>
    );
  }

  if (isPlaying === 'starting') {
    return (
      <div className="game-container" style={{ justifyContent: 'center', minHeight: '50vh' }}>
        <h2 style={{ fontSize: '4rem', color: 'var(--arcade-primary)', animation: 'pop 0.5s infinite alternate' }}>
          {countdown > 0 ? countdown : 'GO!'}
        </h2>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="hud arcade-glass">
        <div className="hud-item">
          <div className="stat-label">TIME</div>
          <div className="hud-value">{timeLeft}s</div>
        </div>
        <div className="hud-item">
          <div className="stat-label">SCORE</div>
          <div className="hud-value">{score}</div>
        </div>
        <div className="hud-item">
          <div className="stat-label">COMBO</div>
          <div className="hud-value" style={{ color: combo >= 5 ? 'var(--arcade-primary)' : '#fff' }}>
            x{combo}
          </div>
        </div>
        <div className="hud-item">
          <div className="stat-label">WPM</div>
          <div className="hud-value">{calculateWPM(correctChars, 60 - timeLeft || 1)}</div>
        </div>
      </div>

      <div className="typing-area-container">
        <div className="target-word-display">
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
          className={`arcade-input ${isError ? 'error' : ''} ${input === word ? 'success' : ''}`}
          placeholder="Type here..."
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />
      </div>
    </div>
  );
};

export default TypingBattle;
