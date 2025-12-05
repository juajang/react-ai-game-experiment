import ChickenSprite from './ChickenSprite';

const Chicken = ({ x, y, frame, direction, state }) => (
  <div 
    className="absolute transition-all duration-100"
    style={{ left: x - 24, top: y - 32 }}
  >
    <ChickenSprite frame={frame} direction={direction} />
    {state === 'eating' && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs">😋</div>
    )}
  </div>
);

export default Chicken;

