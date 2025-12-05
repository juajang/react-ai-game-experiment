import ChickenSprite from './ChickenSprite';

const Chicken = ({ x, y, frame, direction, state }) => (
  <div 
    className="absolute transition-all duration-100"
    style={{ left: x - 32, top: y - 48 }}
  >
    <ChickenSprite frame={frame} direction={direction} />
    {state === 'eating' && (
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-sm">😋</div>
    )}
  </div>
);

export default Chicken;
