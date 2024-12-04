/* ConwaysGameLife.js */

import React, { useState, useEffect, useRef } from 'react';
import './ConwaysGameLife.css';

// Utility functions to create the grid and patterns
const createEmptyGrid = (rows, cols) => {
  return Array.from({ length: rows }, () => Array(cols).fill(false));
};

const createBeacon = () => {
  const newGrid = createEmptyGrid(10, 10);
  newGrid[1][1] = true;
  newGrid[1][2] = true;
  newGrid[2][1] = true;
  newGrid[2][2] = true;
  newGrid[3][3] = true;
  newGrid[3][4] = true;
  newGrid[4][3] = true;
  newGrid[4][4] = true;
  return newGrid;
};

const createPulsar = () => {
  const newGrid = createEmptyGrid(20, 20);
  const pulsarPattern = [
    [2, 4], [2, 5], [2, 6], [2, 10], [2, 11], [2, 12],
    [7, 4], [7, 5], [7, 6], [7, 10], [7, 11], [7, 12],
    [9, 4], [9, 5], [9, 6], [9, 10], [9, 11], [9, 12],
    [14, 4], [14, 5], [14, 6], [14, 10], [14, 11], [14, 12],
    [4, 2], [5, 2], [6, 2], [10, 2], [11, 2], [12, 2],
    [4, 7], [5, 7], [6, 7], [10, 7], [11, 7], [12, 7],
    [4, 9], [5, 9], [6, 9], [10, 9], [11, 9], [12, 9],
    [4, 14], [5, 14], [6, 14], [10, 14], [11, 14], [12, 14]
  ];
  pulsarPattern.forEach(([row, col]) => {
    newGrid[row][col] = true;
  });
  return newGrid;
};

const createGosper = () => {
  const newGrid = createEmptyGrid(40, 40);
  const gosperPattern = [
    [1, 25], [2, 23], [2, 25], [3, 13], [3, 14], [3, 21], [3, 22], [3, 35], [3, 36],
    [4, 12], [4, 16], [4, 21], [4, 22], [4, 35], [4, 36], [5, 1], [5, 2], [5, 11],
    [5, 17], [5, 21], [5, 22], [6, 1], [6, 2], [6, 11], [6, 15], [6, 17], [6, 18],
    [6, 23], [6, 25], [7, 11], [7, 17], [7, 25], [8, 12], [8, 16], [9, 13], [9, 14]
  ];
  gosperPattern.forEach(([row, col]) => {
    newGrid[row][col] = true;
  });
  return newGrid;
};

const createPentaDecathlon = () => {
  const newGrid = createEmptyGrid(20, 20);
  const pentaDecathlonPattern = [
    [3, 10], [4, 10], [5, 9], [5, 11], [6, 10], [7, 10], 
    [8, 10], [9, 10], [10, 9], [10, 11], [11, 10], [12, 10]
  ];
  pentaDecathlonPattern.forEach(([row, col]) => {
    newGrid[row][col] = true;
  });
  return newGrid;
};

const ConwaysGameLife = () => {
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(10);
  const [grid, setGrid] = useState(createBeacon);
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

  const handlePatternChange = (e) => {
    const pattern = e.target.value;
    let newGrid;

    switch (pattern) {
      case 'beacon':
        setRows(10);
        setCols(10);
        newGrid = createBeacon();
        break;
      case 'pulsar':
        setRows(20);
        setCols(20);
        newGrid = createPulsar();
        break;
      case 'gosper':
        setRows(40);
        setCols(40);
        newGrid = createGosper();
        break;
      case 'penta-decathlon':
        setRows(20);
        setCols(20);
        newGrid = createPentaDecathlon();
        break;
      default:
        newGrid = createEmptyGrid(rows, cols);
    }

    setGrid(newGrid);
  };

  const cellSize = Math.min(
    (window.innerWidth * 0.8) / cols,
    (window.innerHeight * 0.8) / rows
  );

  const borderSize = Math.max(cellSize * 0.1, 1);

  return (
    <div className="container">
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
        <button
          onClick={() => setRunning(true)}
          className={`button ${running ? 'depressed' : ''}`}
        >
          Start
        </button>
        <div
          className={`stopButton ${!running ? 'depressed' : ''}`}
          onClick={() => setRunning(false)}
        >
          STOP
        </div>
        <button
          onClick={handleClearGrid}
          className="button"
        >
          Clear Grid
        </button>
        <select
          onChange={handlePatternChange}
          className="input"
          defaultValue="beacon"
        >
          <option value="beacon">Beacon</option>
          <option value="pulsar">Pulsar</option>
          <option value="penta-decathlon">Penta-decathlon</option>
          <option value="gosper">Gosper Glider Gun</option>
        </select>
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
              style={{ width: cellSize, height: cellSize, border: cell ? `${borderSize}px solid black` : '1px solid #ccc' }}
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
