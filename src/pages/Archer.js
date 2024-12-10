import React, { useState, useEffect, useCallback } from 'react';
import './Archer.css';

const matrixSize = 100;
const projectileSize = 2;
const initialBlackY = 0;

const Archer = () => {
  const [blackY, setBlackY] = useState(initialBlackY);
  const [projectiles, setProjectiles] = useState([]);
  const [redSubMatrices, setRedSubMatrices] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [redSpeed, setRedSpeed] = useState(1000);
  const [redFrequency, setRedFrequency] = useState(7000);
  const [gameStarted, setGameStarted] = useState(false);
  const [moveDirection, setMoveDirection] = useState(null);

  const moveBlack = useCallback((direction) => {
    setBlackY((prevY) => {
      if (direction === 'up') {
        return Math.max(0, prevY - 1);
      } else if (direction === 'down') {
        return Math.min(matrixSize - 10, prevY + 1);
      }
      return prevY;
    });
  }, []);

  const fireProjectile = useCallback(() => {
    setProjectiles((prevProjectiles) => [
      ...prevProjectiles,
      { x: 8, y: blackY + 25 / 6 },
    ]);
  }, [blackY]);

  const moveProjectiles = useCallback(() => {
    setProjectiles((prevProjectiles) =>
      prevProjectiles
        .map((p) => ({ ...p, x: p.x + 1 }))
        .filter((p) => p.x < matrixSize)
    );
  }, []);

  const generateRedSubMatrix = useCallback(() => {
    const y = Math.floor(Math.random() * (matrixSize - projectileSize + 1));
    setRedSubMatrices((prevRedSubMatrices) => [
      ...prevRedSubMatrices,
      { x: matrixSize - projectileSize, y },
    ]);
  }, []);

  const moveRedSubMatrices = useCallback(() => {
    setRedSubMatrices((prevRedSubMatrices) =>
      prevRedSubMatrices
        .map((r) => ({ ...r, x: r.x - 1 }))
        .filter((r) => r.x >= 0)
    );
  }, []);

  const checkCollisions = useCallback(() => {
    setProjectiles((prevProjectiles) => {
      return prevProjectiles.filter((p) => {
        let hit = false;
        setRedSubMatrices((prevRedSubMatrices) => {
          return prevRedSubMatrices.filter((r) => {
            const collided =
              p.x < r.x + projectileSize &&
              p.x + projectileSize > r.x &&
              p.y < r.y + projectileSize &&
              p.y + projectileSize > r.y;
            if (collided) {
              hit = true;
              setScore((prevScore) => prevScore + 1./2);
            }
            return !collided;
          });
        });
        return !hit;
      });
    });
  }, []);

  const checkGameOver = useCallback(() => {
    redSubMatrices.forEach((r) => {
      if (r.x <= 10 && r.y < blackY + 10 && r.y + projectileSize > blackY) {
        setGameOver(true);
      }
    });
  }, [blackY, redSubMatrices]);

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
  }, [
    gameStarted,
    gameOver,
    moveDirection,
    moveBlack,
    moveProjectiles,
    moveRedSubMatrices,
    checkCollisions,
    checkGameOver,
  ]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const interval = setInterval(() => {
        generateRedSubMatrix();
      }, redFrequency);

      return () => clearInterval(interval);
    }
  }, [redFrequency, gameOver, gameStarted, generateRedSubMatrix]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowUp') {
        setMoveDirection('up');
      } else if (event.key === 'ArrowDown') {
        setMoveDirection('down');
      } else if (event.key === ' ') {
        fireProjectile();
        event.preventDefault(); // Prevent default action to avoid any unintended behavior
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
    setGameOver(false);
    setScore(0);
    setProjectiles([]);
    setRedSubMatrices([]);
    setBlackY(initialBlackY);
  };

  return (
    <div className="game-container">
      <div className="controls">
        <div className="score">Score: {score}</div>
        <button
          className="arrow-button"
          onMouseDown={() => setMoveDirection('up')}
          onMouseUp={() => setMoveDirection(null)}
        >
          ▲
        </button>
        <button className="fire-button" onClick={fireProjectile}>
          ●
        </button>
        <button
          className="arrow-button"
          onMouseDown={() => setMoveDirection('down')}
          onMouseUp={() => setMoveDirection(null)}
        >
          ▼
        </button>
        <div>
          <label>Red Speed: {redSpeed} ms</label>
          <input
            type="range"
            min="100"
            max="2000"
            value={redSpeed}
            onChange={(e) => setRedSpeed(parseInt(e.target.value))}
          />
        </div>
        <div>
          <label>Red Frequency: {redFrequency} ms</label>
          <input
            type="range"
            min="2000"
            max="7000"
            value={redFrequency}
            onChange={(e) => setRedFrequency(parseInt(e.target.value))}
          />
        </div>
        <button className="start-button" onClick={startGame}>
          Start
        </button>
      </div>
      <div className="matrix">
        <div className="triangle" style={{ top: blackY * 5, left: 0 }}></div>
        {projectiles.map((p, index) => (
          <div
            key={index}
            className="green"
            style={{
              top: p.y * 5,
              left: p.x * 5,
              width: projectileSize * 5,
              height: projectileSize * 5,
            }}
          ></div>
        ))}
        {redSubMatrices.map((r, index) => (
          <div
            key={index}
            className="red"
            style={{
              top: r.y * 5,
              left: r.x * 5,
              width: projectileSize * 5,
              height: projectileSize * 5,
            }}
          ></div>
        ))}
        {gameOver && <div className="game-over">Game Over</div>}
      </div>
    </div>
  );
};

export default Archer;
