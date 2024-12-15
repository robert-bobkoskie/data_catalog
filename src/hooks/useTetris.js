import { useCallback, useEffect, useState } from 'react';
import { Block, BlockShape, BoardShape, EmptyCell, SHAPES } from '../assets/types';
import { useInterval } from './useInterval';
import {
  useTetrisBoard,
  hasCollisions,
  BOARD_HEIGHT,
  getEmptyBoard,
  getRandomBlock,
} from './useTetrisBoard';

const TickSpeed = {
  Normal: 800,
  Sliding: 100,
  Fast: 50,
};

export function useTetris() {
  const [score, setScore] = useState(0);
  const [upcomingBlocks, setUpcomingBlocks] = useState([]);
  const [isCommitting, setIsCommitting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tickSpeed, setTickSpeed] = useState(null);

  const [
    { board, droppingRow, droppingColumn, droppingBlock, droppingShape },
    dispatchBoardState,
  ] = useTetrisBoard();

  const startGame = useCallback(() => {
    const startingBlocks = [
      getRandomBlock(),
      getRandomBlock(),
      getRandomBlock(),
    ];
    setScore(0);
    setUpcomingBlocks(startingBlocks);
    setIsCommitting(false);
    setIsPlaying(true);
    setTickSpeed(TickSpeed.Normal);
    dispatchBoardState({ type: 'start' });
  }, [dispatchBoardState]);

  const commitPosition = useCallback(() => {
    if (!hasCollisions(board, droppingShape, droppingRow + 1, droppingColumn)) {
      setIsCommitting(false);
      setTickSpeed(TickSpeed.Normal);
      return;
    }

    const newBoard = structuredClone(board);
    addShapeToBoard(newBoard, droppingBlock, droppingShape, droppingRow, droppingColumn);

    const cellsAdded = droppingShape.flat().filter(cell => cell).length;

    const newUpcomingBlocks = structuredClone(upcomingBlocks);
    // const newBlock = newUpcomingBlocks.pop();    // Remove from the end
    // newUpcomingBlocks.unshift(getRandomBlock()); // Add to the start
	const newBlock = newUpcomingBlocks.shift();     // Remove from the start
    newUpcomingBlocks.push(getRandomBlock());       // Add to the end

    if (hasCollisions(board, SHAPES[newBlock].shape, 0, 3)) {
      setIsPlaying(false);
      setTickSpeed(null);
    } else {
      setTickSpeed(TickSpeed.Normal);
    }
    setUpcomingBlocks(newUpcomingBlocks);
    setScore((prevScore) => prevScore + cellsAdded);
    dispatchBoardState({
      type: 'commit',
      newBoard: [...getEmptyBoard(BOARD_HEIGHT - newBoard.length), ...newBoard],
      newBlock,
    });
    setIsCommitting(false);
  }, [board, dispatchBoardState, droppingBlock, droppingColumn, droppingRow, droppingShape, upcomingBlocks]);

  const gameTick = useCallback(() => {
    if (isCommitting) {
      commitPosition();
    } else if (
      hasCollisions(board, droppingShape, droppingRow + 1, droppingColumn)
    ) {
      setTickSpeed(TickSpeed.Sliding);
      setIsCommitting(true);
    } else {
      dispatchBoardState({ type: 'drop' });
    }
  }, [board, commitPosition, dispatchBoardState, droppingColumn, droppingRow, droppingShape, isCommitting]);

  useInterval(() => {
    if (!isPlaying) {
      return;
    }
    gameTick();
  }, tickSpeed);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    let isPressingLeft = false;
    let isPressingRight = false;
    let moveIntervalID;

    const updateMovementInterval = () => {
      clearInterval(moveIntervalID);
      dispatchBoardState({
        type: 'move',
        isPressingLeft,
        isPressingRight,
      });
      moveIntervalID = setInterval(() => {
        dispatchBoardState({
          type: 'move',
          isPressingLeft,
          isPressingRight,
        });
      }, 300);
    };

    const handleKeyDown = (event) => {
      if (event.repeat) {
        return;
      }

      if (event.key === 'ArrowDown') {
        setTickSpeed(TickSpeed.Fast);
      }

      if (event.key === 'ArrowUp') {
        dispatchBoardState({
          type: 'move',
          isRotating: true,
        });
      }

      if (event.key === 'ArrowLeft') {
        isPressingLeft = true;
        updateMovementInterval();
      }

      if (event.key === 'ArrowRight') {
        isPressingRight = true;
        updateMovementInterval();
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === 'ArrowDown') {
        setTickSpeed(TickSpeed.Normal);
      }

      if (event.key === 'ArrowLeft') {
        isPressingLeft = false;
        updateMovementInterval();
      }

      if (event.key === 'ArrowRight') {
        isPressingRight = false;
        updateMovementInterval();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      clearInterval(moveIntervalID);
      setTickSpeed(TickSpeed.Normal);
    };
  }, [dispatchBoardState, isPlaying]);

  const renderedBoard = structuredClone(board);
  if (isPlaying) {
    addShapeToBoard(
      renderedBoard,
      droppingBlock,
      droppingShape,
      droppingRow,
      droppingColumn
    );
  }

  return {
    board: renderedBoard,
    startGame,
    isPlaying,
    score,
    upcomingBlocks,
    dispatchBoardState,
    setTickSpeed,
    TickSpeed,
  };
}

function getPoints(cellsAdded) {
  return cellsAdded;
}

function addShapeToBoard(
  board,
  droppingBlock,
  droppingShape,
  droppingRow,
  droppingColumn
) {
  droppingShape
    .filter((row) => row.some((isSet) => isSet))
    .forEach((row, rowIndex) => {
      row.forEach((isSet, colIndex) => {
        if (isSet) {
          board[droppingRow + rowIndex][droppingColumn + colIndex] =
            droppingBlock;
        }
      });
    });
}
