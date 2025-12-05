import { GAME_CONFIG } from '../constants/gameConfig';

// 닭집 SVG 컴포넌트
const CoopSprite = () => (
  <svg 
    width="80" 
    height="70" 
    viewBox="0 0 20 18" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* 지붕 */}
    <polygon points="10,0 20,6 0,6" fill="#8B4513" />
    <polygon points="10,0 15,3 10,6 5,3" fill="#A0522D" />
    
    {/* 지붕 테두리 */}
    <rect x="0" y="5" width="20" height="2" fill="#654321" />
    
    {/* 벽 */}
    <rect x="2" y="7" width="16" height="10" fill="#DEB887" />
    
    {/* 벽 테두리 */}
    <rect x="1" y="7" width="1" height="10" fill="#8B4513" />
    <rect x="18" y="7" width="1" height="10" fill="#8B4513" />
    <rect x="2" y="16" width="16" height="1" fill="#8B4513" />
    
    {/* 문 */}
    <rect x="7" y="10" width="6" height="7" fill="#654321" />
    <rect x="8" y="11" width="4" height="5" fill="#3d2817" />
    
    {/* 문 손잡이 */}
    <rect x="11" y="13" width="1" height="1" fill="#ffd700" />
    
    {/* 창문 왼쪽 */}
    <rect x="3" y="9" width="3" height="3" fill="#87CEEB" />
    <rect x="4" y="10" width="1" height="1" fill="#ADD8E6" />
    
    {/* 창문 오른쪽 */}
    <rect x="14" y="9" width="3" height="3" fill="#87CEEB" />
    <rect x="15" y="10" width="1" height="1" fill="#ADD8E6" />
    
    {/* 짚 장식 */}
    <rect x="0" y="4" width="2" height="1" fill="#F4A460" />
    <rect x="18" y="4" width="2" height="1" fill="#F4A460" />
  </svg>
);

const Coop = ({ x, y, occupants = 0, capacity, isSelected, onClick, onRemove }) => {
  const maxCapacity = capacity || GAME_CONFIG.COOP.CAPACITY;
  const isFull = occupants >= maxCapacity;

  return (
    <div 
      className="absolute cursor-pointer"
      style={{ left: x - 40, top: y - 60 }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      {/* 선택 표시 */}
      {isSelected && (
        <div 
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-xs"
          style={{ 
            backgroundColor: '#ffd700',
            border: '2px solid #b8860b',
            color: '#654321',
            whiteSpace: 'nowrap',
          }}
        >
          🏠 닭집
        </div>
      )}
      
      <CoopSprite />
      
      {/* 수용 인원 표시 */}
      <div 
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-xs"
        style={{ 
          backgroundColor: isFull ? '#ef4444' : '#22c55e',
          color: 'white',
          fontSize: '10px',
          fontWeight: 'bold',
        }}
      >
        {occupants}/{maxCapacity}
      </div>
      
      {/* 잠자는 닭 표시 */}
      {occupants > 0 && (
        <div 
          className="absolute top-8 left-1/2 -translate-x-1/2"
          style={{ fontSize: '12px' }}
        >
          {'💤'.repeat(Math.min(occupants, 3))}
        </div>
      )}
    </div>
  );
};

export default Coop;

