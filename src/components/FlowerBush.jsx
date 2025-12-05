import { GAME_CONFIG } from '../constants/gameConfig';

// 꽃 덤불 SVG 컴포넌트
const FlowerBushSprite = () => (
  <svg 
    width="48" 
    height="48" 
    viewBox="0 0 16 16" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* 덤불 잎 */}
    <rect x="2" y="10" width="12" height="4" fill="#228B22"/>
    <rect x="3" y="9" width="10" height="1" fill="#2E8B2E"/>
    <rect x="4" y="8" width="8" height="1" fill="#32CD32"/>
    <rect x="5" y="7" width="6" height="1" fill="#3CB371"/>
    
    {/* 빨간 꽃 1 */}
    <rect x="3" y="7" width="1" height="1" fill="#FF69B4"/>
    <rect x="2" y="8" width="1" height="1" fill="#FF69B4"/>
    <rect x="4" y="8" width="1" height="1" fill="#FF69B4"/>
    <rect x="3" y="9" width="1" height="1" fill="#FF69B4"/>
    <rect x="3" y="8" width="1" height="1" fill="#FFD700"/>
    
    {/* 노란 꽃 2 */}
    <rect x="8" y="6" width="1" height="1" fill="#FFD700"/>
    <rect x="7" y="7" width="1" height="1" fill="#FFD700"/>
    <rect x="9" y="7" width="1" height="1" fill="#FFD700"/>
    <rect x="8" y="8" width="1" height="1" fill="#FFD700"/>
    <rect x="8" y="7" width="1" height="1" fill="#FF6347"/>
    
    {/* 분홍 꽃 3 */}
    <rect x="12" y="8" width="1" height="1" fill="#FF1493"/>
    <rect x="11" y="9" width="1" height="1" fill="#FF1493"/>
    <rect x="13" y="9" width="1" height="1" fill="#FF1493"/>
    <rect x="12" y="10" width="1" height="1" fill="#FF1493"/>
    <rect x="12" y="9" width="1" height="1" fill="#FFFF00"/>
    
    {/* 흰 꽃 4 */}
    <rect x="5" y="9" width="1" height="1" fill="#FFFFFF"/>
    <rect x="4" y="10" width="1" height="1" fill="#FFFFFF"/>
    <rect x="6" y="10" width="1" height="1" fill="#FFFFFF"/>
    <rect x="5" y="10" width="1" height="1" fill="#FFC0CB"/>
    
    {/* 작은 꽃봉오리들 */}
    <rect x="10" y="8" width="1" height="1" fill="#DA70D6"/>
    <rect x="6" y="7" width="1" height="1" fill="#F0E68C"/>
  </svg>
);

// 작은 미리보기용
export const FlowerBushPreview = ({ size = 32 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 16 16" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="10" width="12" height="4" fill="#228B22"/>
    <rect x="3" y="9" width="10" height="1" fill="#2E8B2E"/>
    <rect x="4" y="8" width="8" height="1" fill="#32CD32"/>
    
    <rect x="3" y="8" width="1" height="1" fill="#FF69B4"/>
    <rect x="8" y="7" width="1" height="1" fill="#FFD700"/>
    <rect x="12" y="9" width="1" height="1" fill="#FF1493"/>
    <rect x="5" y="10" width="1" height="1" fill="#FFFFFF"/>
  </svg>
);

const FlowerBush = ({ x, y, isSelected, onMouseDown }) => {
  const handleMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onMouseDown?.(e);
  };

  return (
    <div 
      className="absolute"
      style={{ 
        left: x - 24, 
        top: y - 30,
        cursor: isSelected ? 'grabbing' : 'grab',
        zIndex: isSelected ? 100 : 15,
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* 선택/이동 표시 */}
      {isSelected && (
        <div 
          className="absolute -top-4 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-xs animate-pulse"
          style={{ 
            backgroundColor: '#bbf7d0',
            border: '2px solid #22c55e',
            color: '#166534',
            whiteSpace: 'nowrap',
            zIndex: 10,
          }}
        >
          🌸 이동 중
        </div>
      )}
      
      <FlowerBushSprite />
      
      {/* 효과 표시 */}
      <div 
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded"
        style={{ 
          backgroundColor: '#f0abfc',
          color: '#701a75',
          fontSize: '8px',
        }}
      >
        💕
      </div>
    </div>
  );
};

export default FlowerBush;

