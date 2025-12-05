import ChickenSprite from './ChickenSprite';
import Plumbob from './Plumbob';

const Chicken = ({ x, y, frame, direction, state, isSelected, onClick, name }) => (
  <div 
    className="absolute transition-all duration-100 cursor-pointer"
    style={{ left: x - 32, top: y - 48 }}
    onClick={(e) => {
      e.stopPropagation();
      onClick?.();
    }}
  >
    {/* 심즈 스타일 플럼밥 - 중앙 정렬 */}
    {isSelected && (
      <div className="absolute" style={{ left: '50%', top: -20, transform: 'translateX(-50%)' }}>
        <Plumbob size={14} />
      </div>
    )}
    
    <ChickenSprite frame={frame} direction={direction} />
    
    {state === 'eating' && (
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-sm">😋</div>
    )}
    {state === 'laying' && (
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-sm">🥚</div>
    )}
    
    {/* 선택 시 이름 표시 */}
    {isSelected && name && (
      <div 
        className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap"
        style={{ 
          bottom: 2,
          color: '#5d4037',
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
