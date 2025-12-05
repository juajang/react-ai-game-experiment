import JuvenileSprite from './JuvenileSprite';
import Plumbob from './Plumbob';

const Juvenile = ({ x, y, frame, direction, state, growthProgress, isSelected, onClick, name, isHeld, onMouseDown }) => (
  <div 
    className="absolute"
    style={{ 
      left: x - 26, 
      top: y - 40,
      transition: isHeld ? 'none' : 'all 100ms',
      zIndex: isHeld ? 1000 : 8,
      pointerEvents: 'auto',
      cursor: isHeld ? 'grabbing' : 'grab',
    }}
    onClick={(e) => {
      e.stopPropagation();
      if (!isHeld) onClick?.();
    }}
    onMouseDown={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onMouseDown?.(e);
    }}
  >
    {/* 심즈 스타일 플럼밥 - 중앙 정렬 */}
    {isSelected && !isHeld && (
      <div className="absolute" style={{ left: '50%', top: -16, transform: 'translateX(-50%)' }}>
        <Plumbob size={12} />
      </div>
    )}
    
    {/* 들렸을 때 표시 */}
    {isHeld && (
      <div 
        className="absolute left-1/2 -translate-x-1/2 animate-bounce"
        style={{ top: -20, fontSize: '11px' }}
      >
        ✋
      </div>
    )}
    
    <JuvenileSprite frame={frame} direction={direction} isHeld={isHeld} />
    
    {state === 'eating' && !isHeld && (
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-xs">😋</div>
    )}
    
    {/* 성장 진행도 바 */}
    {growthProgress !== undefined && !isSelected && !isHeld && (
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
    
    {/* 선택 시 이름 표시 */}
    {(isSelected || isHeld) && name && (
      <div 
        className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap"
        style={{ 
          bottom: 2,
          color: isHeld ? '#ef4444' : '#5d4037',
          fontSize: '6px',
          fontWeight: 'bold',
          textShadow: '0 0 2px #fff, 0 0 2px #fff',
        }}
      >
        {name}
      </div>
    )}
  </div>
);

export default Juvenile;
