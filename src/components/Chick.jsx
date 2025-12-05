import ChickSprite from './ChickSprite';
import Plumbob from './Plumbob';

const Chick = ({ x, y, frame, direction, state, growthProgress, isSelected, onClick }) => (
  <div 
    className="absolute transition-all duration-100 cursor-pointer"
    style={{ left: x - 21, top: y - 32 }}
    onClick={(e) => {
      e.stopPropagation();
      onClick?.();
    }}
  >
    {/* 심즈 스타일 플럼밥 (작은 크기) */}
    {isSelected && <Plumbob size={10} />}
    
    <ChickSprite frame={frame} direction={direction} />
    
    {state === 'eating' && (
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-xs">😋</div>
    )}
    
    {/* 성장 진행도 바 */}
    {growthProgress !== undefined && (
      <div 
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-1"
        style={{ backgroundColor: '#3d3d3d', border: '1px solid #5d4037' }}
      >
        <div 
          className="h-full"
          style={{ width: `${growthProgress}%`, backgroundColor: '#4caf50' }}
        />
      </div>
    )}
  </div>
);

export default Chick;
