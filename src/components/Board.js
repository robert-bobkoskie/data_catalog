import Cell from './Cell';

function Board({ currentBoard }) {
  return (
    <div className="board">
      {currentBoard.map((row, rowIndex) => (
        row.map((cell, colIndex) => (
          <Cell key={`${rowIndex}-${colIndex}`} type={cell} className="cell" />
        ))
      ))}
    </div>
  );
}

export default Board;
