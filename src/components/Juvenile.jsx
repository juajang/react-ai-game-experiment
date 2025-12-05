import JuvenileSprite from './JuvenileSprite';

const Juvenile = ({ x, y, frame, direction, state, growthProgress }) => (
  <div 
    className="absolute transition-all duration-100"
    style={{ left: x - 26, top: y - 40 }}
  >
    <JuvenileSprite frame={frame} direction={direction} />
    
    {state === 'eating' && (
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-xs">😋</div>
    )}
    
    {/* 성장 진행도 바 */}
    {growthProgress !== undefined && (
      <div 
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1"
        style={{ backgroundColor: '#3d3d3d', border: '1px solid #5d4037' }}
      >
        <div 
          className="h-full"
          style={{ width: `${growthProgress}%`, backgroundColor: '#ff9800' }}
        />
      </div>
    )}
  </div>
);

export default Juvenile;

