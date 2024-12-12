/* ConwaysGameLife.js */

import React, { useState, useEffect, useRef } from 'react';
import './ConwaysGameLife.css';

// Utility functions to create the grid and patterns
const createEmptyGrid = (rows, cols) => {
  return Array.from({ length: rows }, () => Array(cols).fill(false));
};

const createAnts = () => {
  const newGrid = createEmptyGrid(42, 42);
  const antsPattern = [
    [2, 4], [2, 5], [2, 9], [2, 10], [2, 14], [2, 15], [2, 19], [2, 20], [2, 24], [2, 25], [2, 29], [2, 30], [2, 34], [2, 35], [2, 39], [2, 40],
    [3, 2], [3, 3], [3, 7], [3, 8], [3, 12], [3, 13], [3, 17], [3, 18], [3, 22], [3, 23], [3, 27], [3, 28], [3, 32], [3, 33], [3, 37], [3, 38],
    [4, 2], [4, 3], [4, 7], [4, 8], [4, 12], [4, 13], [4, 17], [4, 18], [4, 22], [4, 23], [4, 27], [4, 28], [4, 32], [4, 33], [4, 37], [4, 38],
    [5, 4], [5, 5], [5, 9], [5, 10], [5, 14], [5, 15], [5, 19], [5, 20], [5, 24], [5, 25], [5, 29], [5, 30], [5, 34], [5, 35], [5, 39], [5, 40],

    [8, 2], [8, 3], [8, 7], [8, 8], [8, 12], [8, 13], [8, 17], [8, 18], [8, 22], [8, 23], [8, 27], [8, 28], [8, 32], [8, 33], [8, 37], [8, 38],
    [9, 4], [9, 5], [9, 9], [9, 10], [9, 14], [9, 15], [9, 19], [9, 20], [9, 24], [9, 25], [9, 29], [9, 30], [9, 34], [9, 35], [9, 39], [9, 40],
    [10, 4], [10, 5], [10, 9], [10, 10], [10, 14], [10, 15], [10, 19], [10, 20], [10, 24], [10, 25], [10, 29], [10, 30], [10, 34], [10, 35], [10, 39], [10, 40],
    [11, 2], [11, 3], [11, 7], [11, 8], [11, 12], [11, 13], [11, 17], [11, 18], [11, 22], [11, 23], [11, 27], [11, 28], [11, 32], [11, 33], [11, 37], [11, 38],

    [14, 4], [14, 5], [14, 9], [14, 10], [14, 14], [14, 15], [14, 19], [14, 20], [14, 24], [14, 25], [14, 29], [14, 30], [14, 34], [14, 35], [14, 39], [14, 40],
    [15, 2], [15, 3], [15, 7], [15, 8], [15, 12], [15, 13], [15, 17], [15, 18], [15, 22], [15, 23], [15, 27], [15, 28], [15, 32], [15, 33], [15, 37], [15, 38],
    [16, 2], [16, 3], [16, 7], [16, 8], [16, 12], [16, 13], [16, 17], [16, 18], [16, 22], [16, 23], [16, 27], [16, 28], [16, 32], [16, 33], [16, 37], [16, 38],
    [17, 4], [17, 5], [17, 9], [17, 10], [17, 14], [17, 15], [17, 19], [17, 20], [17, 24], [17, 25], [17, 29], [17, 30], [17, 34], [17, 35], [17, 39], [17, 40],

    [20, 2], [20, 3], [20, 7], [20, 8], [20, 12], [20, 13], [20, 17], [20, 18], [20, 22], [20, 23], [20, 27], [20, 28], [20, 32], [20, 33], [20, 37], [20, 38],
    [21, 4], [21, 5], [21, 9], [21, 10], [21, 14], [21, 15], [21, 19], [21, 20], [21, 24], [21, 25], [21, 29], [21, 30], [21, 34], [21, 35], [21, 39], [21, 40],
    [22, 4], [22, 5], [22, 9], [22, 10], [22, 14], [22, 15], [22, 19], [22, 20], [22, 24], [22, 25], [22, 29], [22, 30], [22, 34], [22, 35], [22, 39], [22, 40],
    [23, 2], [23, 3], [23, 7], [23, 8], [23, 12], [23, 13], [23, 17], [23, 18], [23, 22], [23, 23], [23, 27], [23, 28], [23, 32], [23, 33], [23, 37], [23, 38],
  ];
  antsPattern.forEach(([row, col]) => {
    newGrid[row][col] = true;
  });
  return newGrid;
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

const createNova = () => {
  const newGrid = createEmptyGrid(40, 40);
  const pattern = [
    [13, 8], [13, 9],
    [14, 9],
    [15, 9], [15, 10], [15, 11],
    [16, 10]
  ];
  pattern.forEach(([row, col]) => {
    newGrid[row][col] = true;
  });
  return newGrid;
};

const createStar = () => {
  const newGrid = createEmptyGrid(20, 20);
  const pattern = [
    [3, 7], [3, 12],
    [4, 7], [4, 8], [4, 9], [4, 10], [4, 11], [4, 12],
    [5, 7], [5, 12],
    [9, 7], [9, 8], [9, 9], [9, 10], [9, 11], [9, 12],
    [10, 6], [10, 13],
    [11, 5], [11, 14],
    [12, 6], [12, 13],
    [13, 7], [13, 8], [13, 9], [13, 10], [13, 11], [13, 12]
  ];
  pattern.forEach(([row, col]) => {
    newGrid[row][col] = true;
  });
  return newGrid;
};

const createPatternE = () => {
  const newGrid = createEmptyGrid(15, 15);
  const pattern = [
    [2, 4], [2, 5],
    [3, 5], [3, 6], [3, 7],
    [4, 3], [4, 8],
    [5, 2], [5, 4], [5, 5], [5, 6], [5, 7], [5, 9],
    [6, 2], [6, 4], [6, 9], [6, 12],
    [7, 1], [7, 2], [7, 4], [7, 5], [7, 6], [7, 9], [7, 11], [7, 13],
    [8, 2], [8, 4], [8, 9], [8, 12],
    [9, 2], [9, 4], [9, 5], [9, 6], [9, 7], [9, 9],
    [10, 3], [10, 8],
    [11, 5], [11, 6], [11, 7],
    [12, 4], [12, 5]
  ];
  pattern.forEach(([row, col]) => {
    newGrid[row][col] = true;
  });
  return newGrid;
};

const ConwaysGameLife = () => {
  const [rows, setRows] = useState(15);
  const [cols, setCols] = useState(15);
  const [grid, setGrid] = useState(createPatternE);
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
    
    // Add class to select element based on selected option
    if (pattern === 'pattern-e') {
      e.target.classList.add('conway-large-epsilon');
    } else {
      e.target.classList.remove('conway-large-epsilon');
    }

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
      case 'nova':
        setRows(40);
        setCols(40);
        newGrid = createNova();
        break;
      case 'face':
        setRows(20);
        setCols(20);
        newGrid = createStar();
        break;
      case 'pattern-e':
        setRows(15);
        setCols(15);
        newGrid = createPatternE();
        break;
      case 'ants':
        setRows(42);
        setCols(42);
        newGrid = createAnts();
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
    <div className="conway-container">
      {error && <div className="conway-errorMessage">{error}</div>}
      <div className="conway-buttonContainer">
        <input
          type="number"
          value={rows}
          onChange={handleSizeChange}
          min="1"
          max="199"
          className="conway-input"
          placeholder="Enter a number (1-199)"
        />
        <button
          onClick={() => setRunning(true)}
          className={`conway-button ${running ? 'conway-depressed' : ''}`}
        >
          Start
        </button>
        <div
          className={`conway-stopButton ${!running ? 'conway-depressed' : ''}`}
          onClick={() => setRunning(false)}
        >
          STOP
        </div>
        <button
          onClick={handleClearGrid}
          className="conway-button"
        >
          Clear Grid
        </button>
        <select
          onChange={handlePatternChange}
          className="conway-input conway-pattern-select"
          defaultValue="pattern-e"
        >
          <option value="pattern-e" style={{ fontSize: '24px' }}>&#x03B5;</option>
          <option value="beacon">Beacon</option>
          <option value="pulsar">Pulsar</option>
          <option value="face">Face</option>
          <option value="penta-decathlon">Penta-decathlon</option>
          <option value="nova">Nova</option>
          <option value="gosper">Gosper Glider Gun</option>
          <option value="ants">Ants</option>
        </select>
      </div>
      <div
        className="conway-grid"
        style={{ gridTemplateColumns: `repeat(${cols}, ${cellSize}px)` }}
        onMouseUp={handleMouseUp}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`conway-cell ${cell ? 'conway-alive' : ''}`}
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
