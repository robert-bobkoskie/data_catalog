import { Block, SHAPES } from '../assets/types';

function UpcomingBlocks({ upcomingBlocks }) {
  return (
    <div className="upcoming">
      {upcomingBlocks.map((block, blockIndex) => {
        const shape = SHAPES[block].shape;
        return (
          <div key={blockIndex} className="upcoming-block">
            {shape.map((row, rowIndex) => (
              <div key={rowIndex} className="upcoming-row">
                {row.map((isSet, cellIndex) => {
                  const cellClass = isSet ? `cell ${block}` : 'cell empty';
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
