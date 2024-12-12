import { Block, SHAPES } from '../assets/types';

function UpcomingBlocks({ upcomingBlocks }) {
  return (
    <div className="upcoming">
      {upcomingBlocks.map((block, blockIndex) => {
        const shape = SHAPES[block].shape.filter((row) =>
          row.some((cell) => cell)
        );
        return (
          <div key={blockIndex}>
            {shape.map((row, rowIndex) => (
              <div key={rowIndex} className="row">
                {row.map((isSet, cellIndex) => {
                  const cellClass = isSet ? 'cell' : 'hidden';
                  return (
                    <div
                      key={`${blockIndex}-${rowIndex}-${cellIndex}`}
                      className={cellClass}
                    ></div>
                  );
                })}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default UpcomingBlocks;
