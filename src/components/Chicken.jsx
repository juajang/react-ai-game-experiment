import ChickenSprite from './ChickenSprite';
import Plumbob from './Plumbob';

const Chicken = ({ x, y, frame, direction, state, isSelected, onClick, showCoinEffect }) => (
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
  </div>
);

export default Chicken;
