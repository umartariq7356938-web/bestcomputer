import React, { useState, useEffect, useRef } from 'react';
import { getRandomWord, calculateWPM, calculateAccuracy, updateStatsFromGame } from './utils/gameLogic';

const TypingRacer = ({ onFinish, onBack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [word, setWord] = useState('');
  const [input, setInput] = useState('');
  const [playerProgress, setPlayerProgress] = useState(0); // 0 to 100
  const [rivalProgress, setRivalProgress] = useState(0); // 0 to 100
  const [score, setScore] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalTypedChars, setTotalTypedChars] = useState(0);
  const [isError, setIsError] = useState(false);

  const timerRef = useRef(null);
  const rivalTimerRef = useRef(null);
  const inputRef = useRef(null);

  const startGame = (mode = 60) => {
    setTimeLeft(mode);
    setWord(getRandomWord('easy'));
    setInput('');
    setPlayerProgress(0);
    setRivalProgress(0);
    setScore(0);
    setCorrectChars(0);
    setTotalTypedChars(0);
    setIsPlaying(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Rival logic: moves forward continuously
      rivalTimerRef.current = setInterval(() => {
        setRivalProgress((prev) => Math.min(prev + 1.2, 100)); // Roughly finishes in 80 seconds
      }, 1000);
    }
    return () => {
      clearInterval(timerRef.current);
      clearInterval(rivalTimerRef.current);
    };
  }, [isPlaying]);

  const endGame = () => {
    setIsPlaying(false);
    clearInterval(timerRef.current);
    clearInterval(rivalTimerRef.current);

    const wpm = calculateWPM(correctChars, 60 - timeLeft || 60);
    const accuracy = calculateAccuracy(correctChars, totalTypedChars);
    
    const { isNewBest } = updateStatsFromGame(wpm, accuracy, score, 0, Math.floor(correctChars / 5));

    onFinish({
      gameId: 'racer',
      title: playerProgress >= rivalProgress ? 'RACE WON!' : 'RACE LOST!',
      wpm,
      accuracy,
      score,
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
        // Word completed
        setCorrectChars((prev) => prev + word.length);
        setScore((prev) => prev + word.length * 10);
        setPlayerProgress((prev) => Math.min(prev + 5, 100));
        
        if (playerProgress + 5 >= 100) {
          endGame(); // Finished the track
        } else {
          setWord(getRandomWord('easy'));
          setInput('');
        }
      }
    } else {
      setIsError(true);
    }
  };

  if (!isPlaying) {
    return (
      <div className="game-container">
        <h2 className="arcade-title">Typing Racer 🏎️</h2>
        <p style={{ marginBottom: '2rem' }}>Race against the clock and your rival. Type faster to move your car forward.</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="arcade-btn" onClick={() => startGame(60)}>Start 60s Race</button>
          <button className="arcade-btn secondary" onClick={onBack}>Back</button>
        </div>
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
          <div className="stat-label">WPM</div>
          <div className="hud-value">{calculateWPM(correctChars, 60 - timeLeft)}</div>
        </div>
      </div>

      <div className="arcade-glass track-container">
        <div className="track-lane">
          <span style={{ position: 'absolute', left: '-50px', color: 'var(--arcade-success)' }}>YOU</span>
          <div className="racer-car" style={{ left: `calc(${playerProgress}% - 40px)` }}>🏎️</div>
          <div className="finish-line"></div>
        </div>
        <div className="track-lane" style={{ marginBottom: 0 }}>
          <span style={{ position: 'absolute', left: '-50px', color: 'var(--arcade-danger)' }}>CPU</span>
          <div className="racer-car" style={{ left: `calc(${rivalProgress}% - 40px)` }}>🤖</div>
          <div className="finish-line"></div>
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

export default TypingRacer;
