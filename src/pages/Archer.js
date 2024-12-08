import React, { useState, useEffect, useCallback } from 'react';
import './Archer.css';

const matrixSize = 100;
const grid = 8;
const projectileSize = 2;

const Game = () => {
  const [blackY, setBlackY] = useState(0);
  const [projectiles, setProjectiles] = useState([]);
  const [redSubMatrices, setRedSubMatrices] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [redSpeed, setRedSpeed] = useState(1000);
  const [redFrequency, setRedFrequency] = useState(2000);
  const [gameStarted, setGameStarted] = useState(false);
  const [moveDirection, setMoveDirection] = useState(null);

  const moveBlack = useCallback((direction) => {
    if (direction === 'up') {
      setBlackY(prevY => Math.max(0, prevY - 1));
    } else if (direction === 'down') {
      setBlackY(prevY => Math.min(matrixSize - grid, prevY + 1));
    }
  }, []);

  const fireProjectile = useCallback(() => {
    setProjectiles(prevProjectiles => [...prevProjectiles, { x: grid, y: blackY }]);
  }, [blackY]);

  const moveProjectiles = () => {
    setProjectiles(prevProjectiles =>
      prevProjectiles.map(p => ({ ...p, x: p.x + 1 })).filter(p => p.x < matrixSize)
    );
  };

  const generateRedSubMatrix = () => {
    const y = Math.floor(Math.random() * (matrixSize - projectileSize + 1));
    setRedSubMatrices(prevRedSubMatrices => [...prevRedSubMatrices, { x: matrixSize - projectileSize, y }]);
  };

  const moveRedSubMatrices = () => {
    setRedSubMatrices(prevRedSubMatrices =>
      prevRedSubMatrices.map(r => ({ ...r, x: r.x - 1 })).filter(r => r.x >= -projectileSize)
    );
  };

  const checkCollisions = () => {
    setProjectiles(prevProjectiles =>
      prevProjectiles.filter(p => {
        const hit = redSubMatrices.some((r, i) => {
          if (p.x + projectileSize > r.x && p.y < r.y + projectileSize && p.y + projectileSize > r.y) {
            setRedSubMatrices(prevRedSubMatrices => prevRedSubMatrices.filter((_, index) => index !== i));
            setScore(prevScore => prevScore + 1);
            return true;
          }
          return false;
        });
        return !hit;
      })
    );
  };

  const checkGameOver = () => {
    redSubMatrices.forEach(r => {
      if (r.x <= grid && r.y < blackY + grid && r.y + projectileSize > blackY) {
        setGameOver(true);
      }
    });
  };

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const interval = setInterval(() => {
        moveProjectiles();
        moveRedSubMatrices();
        checkCollisions();
        checkGameOver();
        if (moveDirection) {
          moveBlack(moveDirection);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [projectiles, redSubMatrices, gameOver, gameStarted, moveDirection, moveBlack]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const interval = setInterval(() => {
        generateRedSubMatrix();
      }, redFrequency);

      return () => clearInterval(interval);
    }
  }, [redFrequency, gameOver, gameStarted]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowUp') {
        setMoveDirection('up');
      } else if (event.key === 'ArrowDown') {
        setMoveDirection('down');
      } else if (event.key === ' ') {
        fireProjectile();
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        setMoveDirection(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [fireProjectile]);

  const startGame = () => {
    setGameStarted(true);
  };

  return (
    <div className="game-container">
      <div className="controls">
        <div className="score">Score: {score}</div>
        {!gameStarted && <button className="start-button" onClick={startGame}>Start</button>}
        <button className="arrow-button" onMouseDown={() => setMoveDirection('up')} onMouseUp={() => setMoveDirection(null)}>▲</button>
        <button className="fire-button" onClick={fireProjectile}>●</button>
        <button className="arrow-button" onMouseDown={() => setMoveDirection('down')} onMouseUp={() => setMoveDirection(null)}>▼</button>
        <div>
          <label>Red Speed: {redSpeed} ms</label>
          <input type="range" min="100" max="2000" value={redSpeed} onChange={e => setRedSpeed(e.target.value)} />
        </div>
        <div>
          <label>Red Frequency: {redFrequency} ms</label>
          <input type="range" min="100" max="5000" value={redFrequency} onChange={e => setRedFrequency(e.target.value)} />
        </div>
      </div>
      <div className="matrix">
        {Array(matrixSize).fill(null).map((_, y) => (
          <div key={y} className="row">
            {Array(matrixSize).fill(null).map((_, x) => {
              let className = 'cell';
              if (x < grid && y >= blackY && y < blackY + grid) className += ' black';
              projectiles.forEach(p => {
                if (x >= p.x && x < p.x + projectileSize && y >= p.y && y < p.y + projectileSize) className += ' green';
              });
              redSubMatrices.forEach(r => {
                if (x >= r.x && x < r.x + projectileSize && y >= r.y && y < r.y + projectileSize) className += ' red';
              });
              return <div key={x} className={className}></div>;
            })}
          </div>
        ))}
      </div>
      {gameOver && <div className="game-over">Game Over</div>}
    </div>
  );
};

export default Game;
