import { useReducer } from 'react';
import { Block, EmptyCell, SHAPES } from '../assets/types';

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export function getEmptyBoard(height = BOARD_HEIGHT) {
  return Array(height)
    .fill(null)
    .map(() => Array(BOARD_WIDTH).fill(EmptyCell.Empty));
}

export function hasCollisions(board, currentShape, row, column) {
  let hasCollision = false;
  currentShape
    .filter((shapeRow) => shapeRow.some((isSet) => isSet))
    .forEach((shapeRow, rowIndex) => {
      shapeRow.forEach((isSet, colIndex) => {
        if (
          isSet &&
          (row + rowIndex >= board.length ||
            column + colIndex >= board[0].length ||
            column + colIndex < 0 ||
            board[row + rowIndex][column + colIndex] !== EmptyCell.Empty)
        ) {
          hasCollision = true;
        }
      });
    });
  return hasCollision;
}

export function getRandomBlock() {
  const blockValues = Object.values(Block);
  return blockValues[Math.floor(Math.random() * blockValues.length)];
}

function rotateBlock(shape) {
  const rows = shape.length;
  const columns = shape[0].length;

  const rotated = Array(rows)
    .fill(null)
    .map(() => Array(columns).fill(false));

  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      rotated[column][rows - 1 - row] = shape[row][column];
    }
  }

  return rotated;
}

function boardReducer(state, action) {
  let newState = { ...state };

  switch (action.type) {
    case 'start':
      const firstBlock = getRandomBlock();
      return {
        board: getEmptyBoard(),
        droppingRow: 0,
        droppingColumn: 3,
        droppingBlock: firstBlock,
        droppingShape: SHAPES[firstBlock].shape,
      };
    case 'drop':
      newState.droppingRow++;
      break;
    case 'commit':
      return {
        board: [
          ...getEmptyBoard(BOARD_HEIGHT - action.newBoard.length),
          ...action.newBoard,
        ],
        droppingRow: 0,
        droppingColumn: 3,
        droppingBlock: action.newBlock,
        droppingShape: SHAPES[action.newBlock].shape,
      };
    case 'move':
      const rotatedShape = action.isRotating
        ? rotateBlock(newState.droppingShape)
        : newState.droppingShape;
      let columnOffset = action.isPressingLeft ? -1 : 0;
      columnOffset = action.isPressingRight ? 1 : columnOffset;
      if (
        !hasCollisions(
          newState.board,
          rotatedShape,
          newState.droppingRow,
          newState.droppingColumn + columnOffset
        )
      ) {
        newState.droppingColumn += columnOffset;
        newState.droppingShape = rotatedShape;
      }
      break;
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }

  return newState;
}

export function useTetrisBoard() {
  const [boardState, dispatchBoardState] = useReducer(
    boardReducer,
    {
      board: [],
      droppingRow: 0,
      droppingColumn: 0,
      droppingBlock: Block.I,
      droppingShape: SHAPES.I.shape,
    },
    (emptyState) => {
      const state = {
        ...emptyState,
        board: getEmptyBoard(),
      };
      return state;
    }
  );

  return [boardState, dispatchBoardState];
}
