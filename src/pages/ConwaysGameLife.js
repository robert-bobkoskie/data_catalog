/* ConwaysGameLife.js */

import React, { useState, useEffect, useRef } from 'react';
import styles from './ConwaysGameLife.css';

const createEmptyGrid = (rows, cols) => {
    return Array.from({ length: rows }, () => Array(cols).fill(false));
};

const ConwaysGameLife = () => {
    const [rows, setRows] = useState(10);
    const [cols, setCols] = useState(10);
    const [grid, setGrid] = useState(() => createEmptyGrid(10, 10));
    const [running, setRunning] = useState(false);
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
        if (size > 0) {
            setRows(size);
            setCols(size);
            setGrid(createEmptyGrid(size, size));
        }
    };

    return (
        <div className={styles.container}><header><h1>Conway's Game of Life</h1></header><div className={styles.buttonContainer}><input
                    type="number"
                    value={rows}
                    onChange={handleSizeChange}
                    min="1"
                    className={styles.input}
                /><button onClick={() => setRunning(!running)} className={styles.button}>
                    {running ? 'Stop' : 'Start'}
                </button><div
                    id="stop-button"
                    className={styles.stopButton}
                    style={{ display: running ? 'block' : 'none' }}
                    onClick={() => setRunning(false)}
                >
                    STOP
                </div></div><div
                className={styles.grid}
                style={{ gridTemplateColumns: `repeat(${cols}, 20px)` }}
                onMouseUp={handleMouseUp}
            >
                {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`${styles.cell} ${cell ? styles.alive : ''}`}
                            onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                            onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                        />
                    ))
                )}
            </div></div>
    );
};

export default ConwaysGameLife;
