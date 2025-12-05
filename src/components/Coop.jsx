import { GAME_CONFIG } from '../constants/gameConfig';

// 닭집 SVG 컴포넌트 (울타리 포함)
const CoopSprite = () => (
  <svg 
    width="64" 
    height="64" 
    viewBox="0 0 16 16" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* 지붕 */}
    <rect x="3" y="0" width="10" height="1" fill="#8b4513"/>
    <rect x="2" y="1" width="12" height="1" fill="#a0522d"/>
    <rect x="2" y="2" width="12" height="1" fill="#8b4513"/>
    <rect x="3" y="3" width="10" height="1" fill="#a0522d"/>
    
    {/* 벽 */}
    <rect x="2" y="4" width="12" height="10" fill="#deb887"/>
    <rect x="2" y="4" width="1" height="10" fill="#d2b48c"/>
    <rect x="4" y="4" width="1" height="10" fill="#d2b48c"/>
    <rect x="6" y="4" width="1" height="10" fill="#d2b48c"/>
    <rect x="8" y="4" width="1" height="10" fill="#d2b48c"/>
    <rect x="10" y="4" width="1" height="10" fill="#d2b48c"/>
    <rect x="12" y="4" width="1" height="10" fill="#d2b48c"/>
    
    {/* 문 (열린 상태) */}
    <rect x="6" y="8" width="1" height="6" fill="#5c2c0f"/>
    <rect x="7" y="9" width="3" height="5" fill="#8b4513"/>
    <rect x="7" y="9" width="1" height="5" fill="#7a3b0a"/>
    <rect x="9" y="9" width="1" height="5" fill="#a0522d"/>
    <rect x="9" y="12" width="1" height="1" fill="#000000"/>
    
    {/* 창문 왼쪽 */}
    <rect x="3" y="5" width="2" height="2" fill="#ffffff"/>
    <rect x="3" y="5" width="2" height="1" fill="#e0e0e0"/>
    <rect x="4" y="5" width="1" height="2" fill="#d2b48c"/>
    <rect x="3" y="6" width="2" height="1" fill="#f5f5f5"/>
    
    {/* 창문 오른쪽 */}
    <rect x="11" y="5" width="2" height="2" fill="#ffffff"/>
    <rect x="11" y="5" width="2" height="1" fill="#e0e0e0"/>
    <rect x="12" y="5" width="1" height="2" fill="#d2b48c"/>
    <rect x="11" y="6" width="2" height="1" fill="#f5f5f5"/>
    
    {/* 지붕 마루선 */}
    <rect x="7" y="0" width="1" height="1" fill="#5c2c0f"/>
    
    {/* 울타리 (왼쪽 확장) */}
    <rect x="0" y="11" width="1" height="3" fill="#8b4513"/>
    <rect x="1" y="11" width="1" height="3" fill="#a0522d"/>
    <rect x="0" y="12" width="2" height="1" fill="#d2b48c"/>
    <rect x="0" y="11" width="2" height="1" fill="#8b4513"/>
    
    {/* 울타리 (오른쪽 확장) */}
    <rect x="14" y="11" width="1" height="3" fill="#8b4513"/>
    <rect x="15" y="11" width="1" height="3" fill="#a0522d"/>
    <rect x="14" y="12" width="2" height="1" fill="#d2b48c"/>
    <rect x="14" y="11" width="2" height="1" fill="#8b4513"/>
  </svg>
);

// 작은 미리보기용
export const CoopPreview = ({ size = 32 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 16 16" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="3" y="0" width="10" height="1" fill="#8b4513"/>
    <rect x="2" y="1" width="12" height="1" fill="#a0522d"/>
    <rect x="2" y="2" width="12" height="1" fill="#8b4513"/>
    <rect x="3" y="3" width="10" height="1" fill="#a0522d"/>
    <rect x="2" y="4" width="12" height="10" fill="#deb887"/>
    <rect x="6" y="8" width="4" height="6" fill="#8b4513"/>
    <rect x="3" y="5" width="2" height="2" fill="#87CEEB"/>
    <rect x="11" y="5" width="2" height="2" fill="#87CEEB"/>
    {/* 울타리 */}
    <rect x="0" y="11" width="2" height="3" fill="#8b4513"/>
    <rect x="14" y="11" width="2" height="3" fill="#8b4513"/>
  </svg>
);

const Coop = ({ x, y, occupants = 0, capacity, isSelected, onMouseDown }) => {
  const maxCapacity = capacity || GAME_CONFIG.COOP.CAPACITY;
  const isFull = occupants >= maxCapacity;

  const handleMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onMouseDown?.(e);
  };

  return (
    <div 
      className="absolute"
      style={{ 
        left: x - 32, 
        top: y - 56,
        cursor: isSelected ? 'grabbing' : 'grab',
        zIndex: isSelected ? 100 : 10,
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* 선택/이동 표시 */}
      {isSelected && (
        <div 
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-xs animate-pulse"
          style={{ 
            backgroundColor: '#ffd700',
            border: '2px solid #b8860b',
            color: '#654321',
            whiteSpace: 'nowrap',
            zIndex: 10,
          }}
        >
          📍 이동 중
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
          className="absolute top-6 left-1/2 -translate-x-1/2"
          style={{ fontSize: '10px' }}
        >
          {'💤'.repeat(Math.min(occupants, 3))}
        </div>
      )}
    </div>
  );
};

export default Coop;
