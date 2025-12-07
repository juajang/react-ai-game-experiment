import ChickenSprite from './ChickenSprite';
import Plumbob from './Plumbob';

const Chicken = ({ x, y, frame, direction, state, isSelected, onClick, name, isHeld, onMouseDown }) => (
  <div 
    className="absolute"
    style={{ 
      left: x - 32, 
      top: y - 48,
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
      <div className="absolute" style={{ left: '50%', top: -20, transform: 'translateX(-50%)' }}>
        <Plumbob size={14} />
      </div>
    )}
    
    {/* 들렸을 때 표시 */}
    {isHeld && (
      <div 
        className="absolute left-1/2 -translate-x-1/2 animate-bounce"
        style={{ top: -24, fontSize: '12px' }}
      >
        ✋
      </div>
    )}
    
    <ChickenSprite frame={frame} direction={direction} isHeld={isHeld} />
    
    {state === 'eating' && !isHeld && (
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-sm">😋</div>
    )}
    {state === 'laying' && !isHeld && (
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-sm">🥚</div>
    )}
    
    {/* 선택 시 이름 표시 */}
    {(isSelected || isHeld) && name && (
      <div 
        className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap"
        style={{ 
          bottom: 2,
          color: isHeld ? '#ef4444' : '#5d4037',
          fontSize: '7px',
          fontWeight: 'bold',
          textShadow: '0 0 2px #fff, 0 0 2px #fff',
        }}
      >
        {name}
      </div>
    )}
  </div>
);

export default Chicken;


