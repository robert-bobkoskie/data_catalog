/* Dejarik.js */

import React, { useState, useEffect, useCallback } from 'react';
import './Dejarik.css';
import coffeePot from '../assets/sounds/Explosion_Blast.wav';

const matrixSize = 100;
const projectileSize = 2;
const initialBlackY = matrixSize / 2; // Starting in the middle of the matrix
const initialBlackX = 0;
const initialRotation = 0;
const triangleBase = 6; // Base width of the triangle in grid units
const triangleHeight = 8; // Height of the triangle in grid units

const Dejarik = () => {
  const [blackX, setBlackX] = useState(initialBlackX);
  const [blackY, setBlackY] = useState(initialBlackY);
  const [rotation, setRotation] = useState(initialRotation);
  const [projectiles, setProjectiles] = useState([]);
  const [redSubMatrices, setRedSubMatrices] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [redSpeed, setRedSpeed] = useState(1000);
  const [redFrequency, setRedFrequency] = useState(6000);
  const [gameStarted, setGameStarted] = useState(false);
  const [moveDirection, setMoveDirection] = useState(null);
  const [glows, setGlows] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  // New state variables for handling intervals
  const [leftInterval, setLeftInterval] = useState(null);
  const [rightInterval, setRightInterval] = useState(null);

  // New state variable for collision square side length
  const [collisionSquareSide, setCollisionSquareSide] = useState(triangleBase);

  // New state variable for the circle diameter
  const [circleDiameter, setCircleDiameter] = useState(triangleBase); // Initial circle diameter

  const moveBlack = useCallback((direction) => {
    const radians = (Math.PI / 180) * rotation;
    const xSpeed = Math.cos(radians) * 2;
    const ySpeed = Math.sin(radians) * 2;

    setBlackX((prevX) => {
      const newX = prevX + (direction === 'up' ? xSpeed : 0);
      return Math.min(Math.max(newX, 0), matrixSize - 8); // Prevent exiting right side
    });

    setBlackY((prevY) => {
      const newY = prevY + (direction === 'up' ? ySpeed : 0);
      const topBoundary = -3; // Allow exiting top by 5px
      const bottomBoundary = matrixSize - 6; // Allow exiting bottom by 5px
      return Math.min(Math.max(newY, topBoundary), bottomBoundary);
    });
  }, [rotation]);

  const fireProjectile = useCallback(() => {
    const radians = (Math.PI / 180) * rotation; // Convert rotation angle from degrees to radians
    const xSpeed = Math.cos(radians) * 2; // Calculate horizontal speed component
    const ySpeed = Math.sin(radians) * 2; // Calculate vertical speed component

    // Calculate the center of the circle
    const circleCenterX = blackX + triangleBase / 2;
    const circleCenterY = blackY + triangleHeight / 2;

    setProjectiles((prevProjectiles) => [
      ...prevProjectiles,
      {
        x: circleCenterX,
        y: circleCenterY,
        xSpeed,
        ySpeed,
      },
    ]);
  }, [blackX, blackY, rotation, triangleBase, triangleHeight]);

  const moveProjectiles = useCallback(() => {
    setProjectiles((prevProjectiles) =>
      prevProjectiles
        .map((p) => ({ ...p, x: p.x + p.xSpeed, y: p.y + p.ySpeed }))
        .filter((p) => p.x >= 0 && p.x < matrixSize && p.y >= 0 && p.y < matrixSize)
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

  const detectCollisionsAndMove = useCallback(() => {
    const newProjectiles = [];
    const newRedSubMatrices = [];
    const collidedRedIndices = new Set();

    projectiles.forEach((p) => {
      let hit = false;
      redSubMatrices.forEach((r, index) => {
        const collided =
          p.x < r.x + projectileSize &&
          p.x + projectileSize > r.x &&
          p.y < r.y + projectileSize &&
          p.y + projectileSize > r.y;
        if (collided && !collidedRedIndices.has(index)) {
          hit = true;
          collidedRedIndices.add(index);
          setScore((prevScore) => prevScore + 1);

          if (!isMuted) {
            const collisionSound = new Audio(coffeePot);
            collisionSound.play();
          }

          setGlows((prevGlows) => [
            ...prevGlows,
            { x: p.x, y: p.y, id: Date.now() },
          ]);
        }
      });
      if (!hit) {
        newProjectiles.push(p);
      }
    });

    redSubMatrices.forEach((r, index) => {
      if (!collidedRedIndices.has(index)) {
        const newX = r.x - 1;
        if (newX >= 0) {
          newRedSubMatrices.push({ ...r, x: newX });
        }
      }
    });

    setProjectiles(newProjectiles);
    setRedSubMatrices(newRedSubMatrices);
  }, [projectiles, redSubMatrices, isMuted]);

  const checkGameOver = useCallback(() => {
    const halfSide = collisionSquareSide / 2;

    // Adjust the collision area to be slightly below the center of the triangle
    const adjustedBlackX = blackX;
    const adjustedBlackY = blackY + triangleHeight / 2; // Shift the collision area downwards

    redSubMatrices.forEach((r) => {
      const circleCenterX = r.x + projectileSize / 2;
      const circleCenterY = r.y + projectileSize / 2;

      const collided =
        circleCenterX >= adjustedBlackX - halfSide &&
        circleCenterX <= adjustedBlackX + halfSide &&
        circleCenterY >= adjustedBlackY - halfSide &&
        circleCenterY <= adjustedBlackY + halfSide;

      if (collided) {
        setGameOver(true);
      }
    });
  }, [blackX, blackY, redSubMatrices, collisionSquareSide]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const interval = setInterval(() => {
        detectCollisionsAndMove();
        checkGameOver();
        moveProjectiles();
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
    detectCollisionsAndMove,
    moveProjectiles,
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
      if (
        event.key === 'ArrowUp' ||
        event.key === 'ArrowLeft' ||
        event.key === 'ArrowRight' ||
        event.key === ' '
      ) {
        event.preventDefault();
        if (event.key === 'ArrowUp') {
          setMoveDirection('up');
        } else if (event.key === 'ArrowLeft') {
          setRotation((prevRotation) => prevRotation - 15);
        } else if (event.key === 'ArrowRight') {
          setRotation((prevRotation) => prevRotation + 15);
        } else if (event.key === ' ') {
          fireProjectile();
        }
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === 'ArrowUp') {
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
    setBlackX(initialBlackX);
    setRotation(initialRotation);
  };

  const toggleMute = () => {
    setIsMuted((prevMuted) => !prevMuted);
  };

  // New functions for handling mouse down/up events on arrow buttons
  const handleMouseDown = (direction) => {
    if (direction === 'left') {
      const interval = setInterval(() => {
        setRotation((prevRotation) => prevRotation - 15);
      }, 100);
      setLeftInterval(interval);
    } else if (direction === 'right') {
      const interval = setInterval(() => {
        setRotation((prevRotation) => prevRotation + 15);
      }, 100);
      setRightInterval(interval);
    }
  };

  const handleMouseUp = (direction) => {
    if (direction === 'left' && leftInterval) {
      clearInterval(leftInterval);
      setLeftInterval(null);
    } else if (direction === 'right' && rightInterval) {
      clearInterval(rightInterval);
      setRightInterval(null);
    }
  };

  return (
    <div className="dejarik-game-container">
      <div className="dejarik-controls">
        <div className="dejarik-top-controls">
          <button className="dejarik-start-button" onClick={startGame}>
            Start
          </button>
          <div className="dejarik-score">Score: {score}</div>
        </div>
        <div className="dejarik-core-controls">
          <button className="dejarik-fire-button" onClick={fireProjectile}>
            <span className="dejarik-text">●</span>
          </button>
          <div className="dejarik-arrows">
            <button
              className="dejarik-arrow-button"
              onMouseDown={() => setMoveDirection('up')}
              onMouseUp={() => setMoveDirection(null)}
            >
              ▲
            </button>
            <div className="dejarik-horizontal-arrows">
              <button
                className="dejarik-arrow-button"
                onMouseDown={() => handleMouseDown('left')}
                onMouseUp={() => handleMouseUp('left')}
                onMouseLeave={() => handleMouseUp('left')}
              >
                ◀
              </button>
              <button
                className="dejarik-arrow-button"
                onMouseDown={() => handleMouseDown('right')}
                onMouseUp={() => handleMouseUp('right')}
                onMouseLeave={() => handleMouseUp('right')}
              >
                ▶
              </button>
            </div>
          </div>
        </div>
        <div className="dejarik-sliders">
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
              min="500"
              max="6000"
              value={6000 - (redFrequency - 500)}
              onChange={(e) =>
                setRedFrequency(6000 - parseInt(e.target.value) + 500)
              }
            />
          </div>
          <div>
            <label>Collision Square Side Length: {collisionSquareSide}</label>
            <input
              type="range"
              min="1"
              max="20"
              value={collisionSquareSide}
              onChange={(e) => setCollisionSquareSide(parseInt(e.target.value))}
            />
          </div>
          <div>
            <label>Circle Diameter: {circleDiameter}</label>
            <input
              type="range"
              min="1"
              max="20"
              value={circleDiameter}
              onChange={(e) => setCircleDiameter(parseInt(e.target.value))}
            />
          </div>
          <button className="dejarik-mute-button" onClick={toggleMute}>
            {isMuted ? 'Unmute' : 'Mute'}
          </button>
        </div>
      </div>
      <div className="dejarik-matrix">
        <div
          className="dejarik-triangle"
          style={{ top: blackY * 5, left: blackX * 5, transform: `rotate(${rotation}deg)` }}
        >
          <div className="dejarik-front-circle"></div>
        </div>
        {projectiles.map((p, index) => (
          <div
            key={index}
            className="dejarik-green"
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
            className="dejarik-red"
            style={{
              top: r.y * 5,
              left: r.x * 5,
              width: projectileSize * 5,
              height: projectileSize * 5,
            }}
          ></div>
        ))}
        {glows.map((glow) => (
          <div
            key={glow.id}
            className="dejarik-glow"
            style={{
              top: glow.y * 5,
              left: glow.x * 5,
              width: projectileSize * 5,
              height: projectileSize * 5,
            }}
          ></div>
        ))}
        {gameOver && <div className="dejarik-game-over">Game Over</div>}
      </div>
    </div>
  );
};

export default Dejarik;
