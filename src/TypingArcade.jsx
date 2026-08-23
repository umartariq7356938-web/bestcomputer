import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import ArcadeHome from './arcade/ArcadeHome';
import TypingRacer from './arcade/TypingRacer';
import WordBomb from './arcade/WordBomb';
import TypingBattle from './arcade/TypingBattle';
import ResultScreen from './arcade/ResultScreen';

// Very basic router since we don't strictly need react-router for a sub-app if we want it lightweight, 
// but we can use simple state-based routing.
const TypingArcade = () => {
  const [currentView, setCurrentView] = useState('home');
  const [resultData, setResultData] = useState(null);

  const navigate = (view) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const showResult = (data) => {
    setResultData(data);
    setCurrentView('result');
  };

  return (
    <div className="arcade-app">
      {currentView === 'home' && <ArcadeHome onPlay={(game) => navigate(game)} />}
      {currentView === 'racer' && <TypingRacer onFinish={showResult} onBack={() => navigate('home')} />}
      {currentView === 'bomb' && <WordBomb onFinish={showResult} onBack={() => navigate('home')} />}
      {currentView === 'battle' && <TypingBattle onFinish={showResult} onBack={() => navigate('home')} />}
      {currentView === 'result' && <ResultScreen data={resultData} onBack={() => navigate('home')} onReplay={() => navigate(resultData.gameId)} />}
    </div>
  );
};

const root = createRoot(document.getElementById('arcade-root'));
root.render(<TypingArcade />);
