// Word lists based on Gen-Z computing themes, tech, and gaming
const wordsEasy = [
    'computer', 'mouse', 'screen', 'keyboard', 'internet', 'printer', 'window', 'folder',
    'click', 'type', 'game', 'play', 'save', 'file', 'data', 'cloud', 'pixel', 'code',
    'byte', 'web', 'link', 'app', 'chat', 'tech', 'phone', 'smart', 'wifi', 'host',
    'port', 'disk', 'ram', 'cpu', 'gpu', 'usb', 'home', 'user', 'login', 'load',
    'boot', 'mac', 'pc', 'hack', 'ping', 'lag', 'bot', 'mod', 'fps', 'rpg', 'mmo',
    'skill', 'noob', 'pro', 'stream', 'view', 'post', 'blog', 'vlog', 'feed', 'like'
  ];
  
  const wordsMedium = [
    'motherboard', 'application', 'software', 'hardware', 'network', 'database', 'security',
    'browser', 'processor', 'graphics', 'download', 'upload', 'password', 'firewall',
    'desktop', 'laptop', 'monitor', 'router', 'server', 'wireless', 'bluetooth',
    'algorithm', 'bandwidth', 'broadband', 'cache', 'command', 'compiler', 'compress',
    'dashboard', 'developer', 'document', 'domain', 'ethernet', 'function', 'gateway',
    'gigabyte', 'hacker', 'interface', 'malware', 'memory', 'offline', 'online', 'phishing',
    'platform', 'protocol', 'reboot', 'resolution', 'spam', 'spyware', 'storage', 'terminal',
    'update', 'upgrade', 'virus', 'webcam', 'website', 'widget', 'wireless', 'zip'
  ];
  
  const wordsHard = [
    'virtualization', 'troubleshooting', 'configuration', 'cybersecurity', 'infrastructure',
    'authentication', 'cryptography', 'optimization', 'architecture', 'bandwidth',
    'microprocessor', 'asynchronous', 'framework', 'repository', 'algorithm',
    'artificial', 'intelligence', 'cryptocurrency', 'decentralized', 'encryption',
    'machine learning', 'blockchain', 'development', 'programming', 'vulnerability',
    'motherboard', 'overclocking', 'benchmark', 'bottleneck', 'compatibility',
    'responsive design', 'user interface', 'user experience', 'deployment',
    'version control', 'continuous integration', 'data analytics', 'cloud computing',
    'type fast to win', 'beat your high score', 'gaming dashboard is cool',
    'never give up the fight', 'practice makes perfect'
  ];
  
  export const getRandomWord = (difficulty = 'easy') => {
    let list;
    if (difficulty === 'medium') list = wordsMedium;
    else if (difficulty === 'hard') list = wordsHard;
    else list = wordsEasy;
    
    return list[Math.floor(Math.random() * list.length)];
  };
  
  export const calculateWPM = (correctCharacters, timeSeconds) => {
    // 5 characters = 1 word
    const words = correctCharacters / 5;
    const minutes = timeSeconds / 60;
    return minutes > 0 ? Math.round(words / minutes) : 0;
  };
  
  export const calculateAccuracy = (correctChars, totalTypedChars) => {
    if (totalTypedChars === 0) return 100;
    return Math.round((correctChars / totalTypedChars) * 100);
  };
  
  // LocalStorage Helpers
  const STATS_KEY = 'arcadeStats';
  
  export const getStats = () => {
    const stats = localStorage.getItem(STATS_KEY);
    if (stats) {
      return JSON.parse(stats);
    }
    return {
      bestWPM: 0,
      bestAccuracy: 0,
      bestScore: 0,
      bestCombo: 0,
      gamesPlayed: 0,
      totalWordsTyped: 0,
      streak: 0,
      lastPlayedDate: null
    };
  };
  
  export const saveStats = (newStats) => {
    localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
  };
  
  export const updateStatsFromGame = (wpm, accuracy, score, combo, wordsTyped) => {
    const stats = getStats();
    let isNewBest = false;
  
    if (wpm > stats.bestWPM) { stats.bestWPM = wpm; isNewBest = true; }
    if (accuracy > stats.bestAccuracy) stats.bestAccuracy = accuracy;
    if (score > stats.bestScore) { stats.bestScore = score; isNewBest = true; }
    if (combo > stats.bestCombo) stats.bestCombo = combo;
    
    stats.gamesPlayed += 1;
    stats.totalWordsTyped += wordsTyped;
  
    // Streak logic
    const today = new Date().toDateString();
    if (stats.lastPlayedDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (stats.lastPlayedDate === yesterday.toDateString()) {
        stats.streak += 1;
      } else {
        stats.streak = 1;
      }
      stats.lastPlayedDate = today;
    }
  
    saveStats(stats);
    return { updatedStats: stats, isNewBest };
  };
  
  export const getDailyChallenge = () => {
    // Deterministic challenge based on date
    const date = new Date();
    const day = date.getDate();
    
    const challenges = [
      { goal: 30, text: 'Beat 30 WPM with 90% accuracy' },
      { goal: 40, text: 'Beat 40 WPM with 95% accuracy' },
      { goal: 50, text: 'Beat 50 WPM with 95% accuracy' },
      { goal: 60, text: 'Beat 60 WPM with 98% accuracy' },
      { goal: 35, text: 'Beat 35 WPM with 90% accuracy' },
    ];
    
    return challenges[day % challenges.length];
  };
