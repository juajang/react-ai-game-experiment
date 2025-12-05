import ChickSprite from './ChickSprite';

const Chick = ({ x, y, frame, direction, state, growthProgress }) => (
  <div 
    className="absolute transition-all duration-100"
    style={{ left: x - 20, top: y - 32 }}
  >
    <ChickSprite frame={frame} direction={direction} />
    
    {/* 상태 이모지 */}
    {state === 'eating' && (
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-xs">😋</div>
    )}
    
    {/* 성장 진행도 바 */}
    {growthProgress !== undefined && (
      <div 
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-1"
        style={{ backgroundColor: '#3d3d3d', border: '1px solid #5d4037' }}
      >
        <div 
          className="h-full"
          style={{ 
            width: `${growthProgress}%`,
            backgroundColor: '#4caf50',
          }}
        />
      </div>
    )}
  </div>
);

export default Chick;

