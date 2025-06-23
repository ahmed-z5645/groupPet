// MiniGames.jsx
import React, { useState, useEffect, useRef } from 'react';
import './MiniGames.css';

const Celebration = () => (
  <div className="celebration">🎉🎉🎉</div>
);

// ------------------ WALK GAME ------------------
export const WalkGame = ({ onComplete }) => {
  const [position, setPosition] = useState(2);
  const [row, setRow] = useState(0);
  const [cars, setCars] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const laneCount = 5;

  const move = (dir) => {
    if (dir === 'left' && position > 0) setPosition(position - 1);
    if (dir === 'right' && position < laneCount - 1) setPosition(position + 1);
    if (dir === 'up') setRow(prev => prev + 1);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCars(prev => prev.map(car => ({ ...car, x: (car.x + 1) % laneCount })));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const newCar = { row: Math.floor(Math.random() * 5), x: 0, id: Date.now() };
      setCars(prev => [...prev, newCar].filter(car => Date.now() - car.id < 5000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (cars.some(car => car.row === row && car.x === position)) {
      setRow(0);
    }
  }, [cars, row, position]);

  useEffect(() => {
    if (row >= 5) {
      setShowConfetti(true);
      setTimeout(() => onComplete(), 1000);
    }
  }, [row]);

  return (
    <div className="walk-game">
      <p>Tap to move Pavement safely to the bottom.</p>
      {[...Array(5)].map((_, i) => (
        <div className="walk-row" key={i}>
          {[...Array(laneCount)].map((_, j) => {
            const isCar = cars.some(car => car.row === i && car.x === j);
            const isFrog = row === i && position === j;
            return <span key={j}>{isFrog ? '🐱' : isCar ? '🚗' : '🛣️'}</span>;
          })}
        </div>
      ))}
      <div className="controls">
        <button onClick={() => move('left')}>⬅️</button>
        <button onClick={() => move('up')}>⬇️</button>
        <button onClick={() => move('right')}>➡️</button>
      </div>
      {showConfetti && <Celebration />}
    </div>
  );
};

// ------------------ FEED GAME ------------------
export const FeedGame = ({ onComplete }) => {
  const [fish, setFish] = useState([]);
  const [caught, setCaught] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const target = 10;

  useEffect(() => {
    const interval = setInterval(() => {
      const newFish = {
        x: Math.floor(Math.random() * 5),
        y: Math.floor(Math.random() * 5),
        id: Date.now() + Math.random()
      };
      setFish(f => [...f, newFish]);
    }, 700);
    return () => clearInterval(interval);
  }, []);

  const handleClick = (id) => {
    setFish(f => f.filter(fish => fish.id !== id));
    setCaught(c => {
      const newCount = c + 1;
      if (newCount >= target) {
        setShowConfetti(true);
        setTimeout(() => onComplete(), 1000);
      }
      return newCount;
    });
  };

  return (
    <div className="feed-game">
      <p>Tap the fish as they swim by!</p>
      <p>{caught} / {target} fish caught</p>
      {[...Array(5)].map((_, row) => (
        <div className="feed-row" key={row}>
          {[...Array(5)].map((_, col) => {
            const item = fish.find(f => f.x === col && f.y === row);
            return <span key={col} onClick={() => item && handleClick(item.id)}>{item ? '🐟' : '🌊'}</span>;
          })}
        </div>
      ))}
      {showConfetti && <Celebration />}
    </div>
  );
};

// ------------------ WATER GAME ------------------
export const WaterGame = ({ onComplete }) => {
  const [drops, setDrops] = useState([]);
  const [score, setScore] = useState(0);
  const [bucketPos, setBucketPos] = useState(2);
  const [showConfetti, setShowConfetti] = useState(false);
  const target = 7;

  useEffect(() => {
    const interval = setInterval(() => {
      setDrops(d => [...d, { x: Math.floor(Math.random() * 5), y: 0, id: Date.now() }]);
    }, 700);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDrops(d => d.map(drop => ({ ...drop, y: drop.y + 1 })).filter(d => d.y < 5));
    }, 300);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    drops.forEach(drop => {
      if (drop.y === 4 && drop.x === bucketPos) {
        setScore(s => {
          const newScore = s + 1;
          if (newScore >= target) {
            setShowConfetti(true);
            setTimeout(() => onComplete(), 1000);
          }
          return newScore;
        });
        setDrops(d => d.filter(drp => drp.id !== drop.id));
      }
    });
  }, [drops, bucketPos]);

  return (
    <div className="water-game">
      <p>Swipe the bucket to catch falling drops!</p>
      <p>{score} / {target} drops caught</p>
      {[...Array(5)].map((_, row) => (
        <div className="water-row" key={row}>
          {[...Array(5)].map((_, col) => {
            const drop = drops.find(d => d.x === col && d.y === row);
            const isBucket = row === 4 && col === bucketPos;
            return <span key={col}>{drop ? '💧' : isBucket ? '🪣' : '⬜'}</span>;
          })}
        </div>
      ))}
      <div className="controls">
        <button onClick={() => setBucketPos(p => Math.max(0, p - 1))}>⬅️</button>
        <button onClick={() => setBucketPos(p => Math.min(4, p + 1))}>➡️</button>
      </div>
      {showConfetti && <Celebration />}
    </div>
  );
};
