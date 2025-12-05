import { GAME_CONFIG } from '../constants/gameConfig';

// 연못 SVG 컴포넌트 (더 크고 귀여운 버전)
const PondSprite = () => (
  <svg 
    width="80" 
    height="80" 
    viewBox="0 0 20 20" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* 연못 테두리 (모래/흙) */}
    <ellipse cx="10" cy="12" rx="9" ry="6" fill="#c4a574"/>
    <ellipse cx="10" cy="12" rx="8" ry="5" fill="#a08050"/>
    
    {/* 연못 물 */}
    <ellipse cx="10" cy="12" rx="7" ry="4" fill="#4fc3f7"/>
    <ellipse cx="10" cy="11" rx="6" ry="3" fill="#29b6f6"/>
    
    {/* 물결 반짝임 */}
    <ellipse cx="7" cy="11" rx="2" ry="1" fill="#81d4fa" opacity="0.8"/>
    <ellipse cx="12" cy="12" rx="1.5" ry="0.8" fill="#81d4fa" opacity="0.6"/>
    <ellipse cx="10" cy="10" rx="1" ry="0.5" fill="#e1f5fe" opacity="0.9"/>
    
    {/* 작은 반짝임 */}
    <rect x="6" y="10" width="1" height="1" fill="#ffffff" opacity="0.8"/>
    <rect x="13" y="11" width="1" height="1" fill="#ffffff" opacity="0.6"/>
    
    {/* 왼쪽 풀들 */}
    <rect x="1" y="8" width="1" height="4" fill="#2e7d32"/>
    <rect x="2" y="7" width="1" height="5" fill="#43a047"/>
    <rect x="3" y="9" width="1" height="3" fill="#66bb6a"/>
    
    {/* 오른쪽 풀들 */}
    <rect x="16" y="7" width="1" height="5" fill="#2e7d32"/>
    <rect x="17" y="8" width="1" height="4" fill="#43a047"/>
    <rect x="18" y="9" width="1" height="3" fill="#66bb6a"/>
    
    {/* 위쪽 풀들 */}
    <rect x="5" y="5" width="1" height="3" fill="#43a047"/>
    <rect x="8" y="4" width="1" height="4" fill="#2e7d32"/>
    <rect x="11" y="5" width="1" height="3" fill="#66bb6a"/>
    <rect x="14" y="4" width="1" height="4" fill="#43a047"/>
    
    {/* 작은 꽃 장식 */}
    <rect x="2" y="6" width="1" height="1" fill="#fff176"/>
    <rect x="17" y="6" width="1" height="1" fill="#f48fb1"/>
    <rect x="7" y="3" width="1" height="1" fill="#fff176"/>
    <rect x="12" y="3" width="1" height="1" fill="#f48fb1"/>
    
    {/* 연못 안의 작은 물고기 (귀여움 추가) */}
    <ellipse cx="8" cy="13" rx="1" ry="0.5" fill="#ff8a65"/>
    <rect x="6" y="13" width="1" height="1" fill="#ff8a65"/>
  </svg>
);

// 작은 미리보기용
export const PondPreview = ({ size = 32 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 20 20" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse cx="10" cy="12" rx="8" ry="5" fill="#a08050"/>
    <ellipse cx="10" cy="12" rx="7" ry="4" fill="#4fc3f7"/>
    <ellipse cx="10" cy="11" rx="5" ry="2.5" fill="#29b6f6"/>
    <ellipse cx="8" cy="11" rx="1.5" ry="0.8" fill="#81d4fa"/>
    <rect x="2" y="7" width="1" height="4" fill="#43a047"/>
    <rect x="17" y="7" width="1" height="4" fill="#43a047"/>
    <rect x="8" y="4" width="1" height="3" fill="#2e7d32"/>
    <rect x="12" y="5" width="1" height="2" fill="#66bb6a"/>
  </svg>
);

const Pond = ({ x, y, isSelected, onMouseDown }) => {
  const handleMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onMouseDown?.(e);
  };

  return (
    <div 
      className="absolute"
      style={{ 
        left: x - 40, 
        top: y - 40,
        cursor: isSelected ? 'grabbing' : 'grab',
        zIndex: isSelected ? 100 : 8,
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* 선택/이동 표시 */}
      {isSelected && (
        <div 
          className="absolute -top-4 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-xs animate-pulse"
          style={{ 
            backgroundColor: '#60a5fa',
            border: '2px solid #2563eb',
            color: 'white',
            whiteSpace: 'nowrap',
            zIndex: 10,
          }}
        >
          💧 이동 중
        </div>
      )}
      
      <PondSprite />
      
      {/* 효과 아이콘 */}
      <div 
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded"
        style={{ 
          backgroundColor: '#22c55e',
          color: 'white',
          fontSize: '9px',
        }}
      >
        ❤️+
      </div>
      
      {/* 효과 범위 표시 (선택 시) */}
      {isSelected && (
        <div 
          className="absolute rounded-full border-2 border-dashed border-blue-400 pointer-events-none"
          style={{
            width: GAME_CONFIG.POND.EFFECT_RADIUS * 2,
            height: GAME_CONFIG.POND.EFFECT_RADIUS * 2,
            left: 40 - GAME_CONFIG.POND.EFFECT_RADIUS,
            top: 40 - GAME_CONFIG.POND.EFFECT_RADIUS,
            opacity: 0.5,
          }}
        />
      )}
    </div>
  );
};

export default Pond;
