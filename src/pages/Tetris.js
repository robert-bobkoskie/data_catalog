/* Tetris.js */

import React, { useState } from 'react';
import Board from '../components/Board';
import UpcomingBlocks from '../components/UpcomingBlocks';
import { useTetris } from '../hooks/useTetris';
import './Tetris.css'; // Import the CSS file

function Tetris() {
  const { board, startGame, isPlaying, score, upcomingBlocks, dispatchBoardState, setTickSpeed, TickSpeed } = useTetris();
  const [moveInterval, setMoveInterval] = useState(null);

  const handleArrowClick = (direction) => {
    switch (direction) {
      case 'left':
        dispatchBoardState({ type: 'move', isPressingLeft: true, isPressingRight: false });
        break;
      case 'right':
        dispatchBoardState({ type: 'move', isPressingLeft: false, isPressingRight: true });
        break;
      case 'down':
        setTickSpeed(TickSpeed.Fast);
        break;
      case 'rotate':
        dispatchBoardState({ type: 'move', isRotating: true });
        break;
      default:
        break;
    }
  };

  const handleArrowPress = (direction) => {
    handleArrowClick(direction);
    const interval = setInterval(() => handleArrowClick(direction), 300);
    setMoveInterval(interval);
  };

  const handleArrowRelease = (direction) => {
    if (moveInterval) {
      clearInterval(moveInterval);
      setMoveInterval(null);
    }
    if (direction === 'down') {
      setTickSpeed(TickSpeed.Normal);
    }
    if (direction === 'left' || direction === 'right') {
      dispatchBoardState({ type: 'move', isPressingLeft: false, isPressingRight: false });
    }
  };

  return (
    <div className="tetris">
      <h1>Tetris</h1>
      <Board currentBoard={board} />
      <div className="controls">
        <h2>Score: {score}</h2>
        <UpcomingBlocks upcomingBlocks={upcomingBlocks} />
        <div className="arrow-buttons">
          <button
            className="arrow left"
            onMouseDown={() => handleArrowPress('left')}
            onMouseUp={() => handleArrowRelease('left')}
            onMouseLeave={() => handleArrowRelease('left')}
          ></button>
          <button className="arrow up" onClick={() => handleArrowClick('rotate')}></button>
          <button
            className="arrow right"
            onMouseDown={() => handleArrowPress('right')}
            onMouseUp={() => handleArrowRelease('right')}
            onMouseLeave={() => handleArrowRelease('right')}
          ></button>
          <button
            className="arrow down"
            onMouseDown={() => handleArrowPress('down')}
            onMouseUp={() => handleArrowRelease('down')}
            onMouseLeave={() => handleArrowRelease('down')}
          ></button>
        </div>
        {!isPlaying && <button onClick={startGame}>New Game</button>}
      </div>
    </div>
  );
}

export default Tetris;
