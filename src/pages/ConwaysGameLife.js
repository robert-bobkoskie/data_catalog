/* ConwaysGameLife.js */

import React, { useState, useEffect, useRef } from 'react';
import './ConwaysGameLife.css';

const createEmptyGrid = (rows, cols) => {
  return Array.from({ length: rows }, () => Array(cols).fill(false));
};

const ConwaysGameLife = () => {
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);
  const [grid, setGrid] = useState(() => createEmptyGrid(10, 10));
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');
  const runningRef = useRef(running);
  runningRef.current = running;

  const handleCellClick = (row, col) => {
    const newGrid = grid.map((rowArr, rowIndex) =>
      rowArr.map((cell, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          return !cell;
        }
        return cell;
      })
    );
    setGrid(newGrid);
  };

  const handleMouseDown = (row, col) => {
    document.oncontextmenu = () => false;
    handleCellClick(row, col);
  };

  const handleMouseEnter = (row, col) => {
    if (document.oncontextmenu) {
      handleCellClick(row, col);
    }
  };

  const handleMouseUp = () => {
    document.oncontextmenu = null;
  };

  useEffect(() => {
    if (!running) {
      return;
    }
    const interval = setInterval(() => {
      setGrid((g) => {
        return g.map((rowArr, rowIndex) =>
          rowArr.map((cell, colIndex) => {
            const neighbors = [
              [-1, -1], [-1, 0], [-1, 1],
              [0, -1], [0, 1],
              [1, -1], [1, 0], [1, 1]
            ];
            let liveNeighbors = 0;
            neighbors.forEach(([x, y]) => {
              const newRow = rowIndex + x;
              const newCol = colIndex + y;
              if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                liveNeighbors += g[newRow][newCol] ? 1 : 0;
              }
            });

            if (cell && (liveNeighbors < 2 || liveNeighbors > 3)) {
              return false;
            }
            if (!cell && liveNeighbors === 3) {
              return true;
            }
            return cell;
          })
        );
      });
    }, 100);
    return () => clearInterval(interval);
  }, [running, rows, cols]);

  const handleSizeChange = (e) => {
    const size = parseInt(e.target.value, 10);
    if (size > 199) {
      setError('Please enter a number between 1 and 199.');
    } else if (size > 0) {
      setError('');
      setRows(size);
      setCols(size);
      setGrid(createEmptyGrid(size, size));
    }
  };

  const handleClearGrid = () => {
    setGrid(createEmptyGrid(rows, cols));
  };

  const cellSize = Math.min(
    (window.innerWidth * 0.8) / cols, // Dynamically calculate cell size based on viewport width
    (window.innerHeight * 0.8) / rows // Dynamically calculate cell size based on viewport height
  );

  return (
    <div className="container">
      <header className="header">
      </header>
      {error && <div className="errorMessage">{error}</div>}
      <div className="buttonContainer">
        <input
          type="number"
          value={rows}
          onChange={handleSizeChange}
          min="1"
          max="199"
          className="input"
          placeholder="Enter a number (1-199)"
        />
        <button onClick={() => setRunning(true)} className="button">
          Start
        </button>
        <button onClick={handleClearGrid} className="button">
          Clear Grid
        </button>
        <div
          className="stopButton"
          onClick={() => setRunning(false)}
        >
          STOP
        </div>
      </div>
      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${cols}, ${cellSize}px)` }}
        onMouseUp={handleMouseUp}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`cell ${cell ? 'alive' : ''}`}
              style={{ width: cellSize, height: cellSize }}
              onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
              onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ConwaysGameLife;
