/* Snake.js */

import React, { useState, useEffect, useRef } from 'react';
import './Snake.css';

const CELL_SIZE = 15;
const GRID_SIZE = 40;
const WIDTH = CELL_SIZE * GRID_SIZE;
const HEIGHT = CELL_SIZE * GRID_SIZE;

const getRandomFood = (walls) => {
  let foodPosition;
  let isValidPosition = false;
  while (!isValidPosition) {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    foodPosition = { x, y };
    isValidPosition = !walls.some(wall => wall.x === x && wall.y === y);
  }
  return foodPosition;
};

const Snake = () => {
  const [snake, setSnake] = useState([{ x: 2, y: 2 }]);
  const [food, setFood] = useState(getRandomFood([]));
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [speed, setSpeed] = useState(200);
  const [walls, setWalls] = useState([]);
  const [highlightCell, setHighlightCell] = useState(null);
  const gameRef = useRef(null);

  const handleKeyDown = (e) => {
    e.preventDefault(); // Prevent default behavior for arrow keys

    let newDirection;
    switch (e.key) {
      case 'ArrowUp':
        newDirection = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
        newDirection = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
        newDirection = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
        newDirection = { x: 1, y: 0 };
        break;
      default:
        return;
    }
    updateDirection(newDirection);
  };

  const updateDirection = (newDirection) => {
    if (
      (direction.x !== 0 && direction.x === -newDirection.x) || 
      (direction.y !== 0 && direction.y === -newDirection.y)
    ) {
      return;
    }
    setDirection(newDirection);
  };

  useEffect(() => {
    if (gameStarted && !gameOver) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [direction, gameStarted, gameOver]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const interval = setInterval(() => {
        const newSnake = [...snake];
        const head = { ...newSnake[0] };

        head.x += direction.x;
        head.y += direction.y;

        if (head.x === food.x && head.y === food.y) {
          setFood(getRandomFood(walls));
          setScore(score + 1);
        } else {
          newSnake.pop();
        }

        if (
          head.x < 0 ||
          head.x >= GRID_SIZE ||
          head.y < 0 ||
          head.y >= GRID_SIZE ||
          newSnake.some((segment) => segment.x === head.x && segment.y === head.y) ||
          walls.some((wall) => wall.x === head.x && wall.y === head.y)
        ) {
          setGameOver(true);
          setGameStarted(false);
          clearInterval(interval);
          return;
        }

        newSnake.unshift(head);
        setSnake(newSnake);
      }, 550 - speed);

      return () => clearInterval(interval);
    }
  }, [snake, direction, food, score, speed, gameStarted, gameOver, walls]);

  const startGame = () => {
    setSnake([{ x: 2, y: 2 }]);
    setFood(getRandomFood(walls));
    setDirection({ x: 1, y: 0 });
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  };

  const handleCellClick = (x, y) => {
    if (!gameStarted) {
      if (walls.some(wall => wall.x === x && wall.y === y)) {
        setWalls(walls.filter(wall => wall.x !== x || wall.y !== y));
      } else {
        setWalls([...walls, { x, y }]);
      }
    }
  };

  const handleMouseOver = (x, y) => {
    if (!gameStarted) {
      setHighlightCell({ x, y });
    }
  };

  const handleMouseOut = () => {
    setHighlightCell(null);
  };

  return (
    <div className="snake-game" ref={gameRef}>
      <div className="controls">
        <div className="score-box">
          <div className="score">Score: {score}</div>
        </div>
        <div className="start-game-over">
          <button onClick={startGame}>{gameStarted ? 'Restart' : 'Start'}</button>
          {gameOver && (
            <div className="game-over">
              <div>Game Over</div>
            </div>
          )}
        </div>
        <div className="direction-controls">
          <button onClick={() => updateDirection({ x: 0, y: -1 })}>▲</button>
          <div>
            <button onClick={() => updateDirection({ x: -1, y: 0 })}>◄</button>
            <button onClick={() => updateDirection({ x: 1, y: 0 })}>►</button>
          </div>
          <button onClick={() => updateDirection({ x: 0, y: 1 })}>▼</button>
        </div>
        <div className="speed-container">
          <input
            type="range"
            min="50"
            max="500"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="speed-slider"
          />
          <div className="speed-labels">
            <span>Slower</span>
            <span>Faster</span>
          </div>
        </div>
      </div>
      <div className="grid" style={{ width: WIDTH, height: HEIGHT }}>
        {Array.from({ length: GRID_SIZE }).map((_, x) =>
          Array.from({ length: GRID_SIZE }).map((_, y) => (
            <div
              key={`${x}-${y}`}
              className={`grid-cell ${walls.some(wall => wall.x === x && wall.y === y) ? 'wall-cell' : ''} ${highlightCell && highlightCell.x === x && highlightCell.y === y ? 'highlight-cell' : ''}`}
              style={{
                left: `${x * CELL_SIZE}px`,
                top: `${y * CELL_SIZE}px`,
              }}
              onClick={() => handleCellClick(x, y)}
              onMouseOver={() => handleMouseOver(x, y)}
              onMouseOut={handleMouseOut}
            />
          ))
        )}
        {snake.map((segment, index) => (
          <div
            key={index}
            className="snake-segment"
            style={{
              left: `${segment.x * CELL_SIZE}px`,
              top: `${segment.y * CELL_SIZE}px`,
              borderWidth: `${CELL_SIZE * 0.1}px`, // Dynamically sized border
            }}
          />
        ))}
        <div
          className="food"
          style={{
            left: `${food.x * CELL_SIZE}px`,
            top: `${food.y * CELL_SIZE}px`,
            borderWidth: `${CELL_SIZE * 0.1}px`, // Dynamically sized border
          }}
        />
      </div>
    </div>
  );
};

export default Snake;
