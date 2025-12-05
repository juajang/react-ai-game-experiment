import { GAME_CONFIG } from '../constants/gameConfig';

// 풍차 날개 (회전 애니메이션용)
const WindmillBlades = ({ size = 40 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
    style={{
      animation: 'spin 4s linear infinite',
    }}
  >
    {/* 날개 1 - 상단 */}
    <path d="M11 2 L13 2 L13 10 L11 10 Z" fill="#F5DEB3"/>
    <path d="M10 3 L11 3 L11 9 L10 9 Z" fill="#DEB887"/>
    <rect x="11" y="2" width="2" height="2" fill="#FFE4B5"/>
    <rect x="12" y="4" width="1" height="1" fill="#ffd700"/>
    
    {/* 날개 2 - 우측 */}
    <path d="M14 11 L22 11 L22 13 L14 13 Z" fill="#F5DEB3"/>
    <path d="M15 10 L21 10 L21 11 L15 11 Z" fill="#DEB887"/>
    <rect x="20" y="11" width="2" height="2" fill="#FFE4B5"/>
    <rect x="18" y="12" width="1" height="1" fill="#ffd700"/>
    
    {/* 날개 3 - 하단 */}
    <path d="M11 14 L13 14 L13 22 L11 22 Z" fill="#F5DEB3"/>
    <path d="M13 15 L14 15 L14 21 L13 21 Z" fill="#DEB887"/>
    <rect x="11" y="20" width="2" height="2" fill="#FFE4B5"/>
    <rect x="11" y="18" width="1" height="1" fill="#ffd700"/>
    
    {/* 날개 4 - 좌측 */}
    <path d="M2 11 L10 11 L10 13 L2 13 Z" fill="#F5DEB3"/>
    <path d="M3 13 L9 13 L9 14 L3 14 Z" fill="#DEB887"/>
    <rect x="2" y="11" width="2" height="2" fill="#FFE4B5"/>
    <rect x="5" y="11" width="1" height="1" fill="#ffd700"/>
    
    {/* 중앙 축 */}
    <circle cx="12" cy="12" r="3" fill="#CD853F"/>
    <circle cx="12" cy="12" r="2" fill="#DEB887"/>
    <circle cx="12" cy="12" r="1" fill="#ffd700"/>
  </svg>
);

// 풍차 몸통
const WindmillBody = () => (
  <svg 
    width="50" 
    height="50" 
    viewBox="0 0 16 16" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* 몸통 베이스 */}
    <rect x="5" y="4" width="6" height="10" fill="#D2691E"/>
    <rect x="6" y="4" width="4" height="10" fill="#CD853F"/>
    <rect x="7" y="4" width="2" height="10" fill="#DEB887"/>
    
    {/* 지붕 */}
    <rect x="4" y="2" width="8" height="2" fill="#8B4513"/>
    <rect x="5" y="1" width="6" height="1" fill="#A0522D"/>
    <rect x="6" y="0" width="4" height="1" fill="#CD853F"/>
    
    {/* 지붕 장식 */}
    <rect x="7" y="0" width="2" height="1" fill="#ffd700"/>
    
    {/* 창문들 */}
    <rect x="6" y="5" width="2" height="2" fill="#87CEEB"/>
    <rect x="6" y="5" width="1" height="1" fill="#ADD8E6"/>
    <rect x="8" y="5" width="2" height="2" fill="#87CEEB"/>
    <rect x="8" y="5" width="1" height="1" fill="#ADD8E6"/>
    
    {/* 문 */}
    <rect x="6" y="10" width="4" height="4" fill="#5c2c0f"/>
    <rect x="7" y="11" width="2" height="3" fill="#8B4513"/>
    
    {/* 문 손잡이 */}
    <rect x="8" y="12" width="1" height="1" fill="#ffd700"/>
    
    {/* 꽃 장식 */}
    <rect x="4" y="12" width="1" height="1" fill="#FF69B4"/>
    <rect x="4" y="13" width="1" height="1" fill="#32CD32"/>
    <rect x="11" y="12" width="1" height="1" fill="#FF69B4"/>
    <rect x="11" y="13" width="1" height="1" fill="#32CD32"/>
  </svg>
);

// 풍차 SVG 컴포넌트 (황금 농장 전용)
const WindmillSprite = () => (
  <div style={{ position: 'relative', width: '80px', height: '90px' }}>
    {/* 날개 (회전) */}
    <div style={{ 
      position: 'absolute', 
      top: '-5px', 
      left: '20px',
      zIndex: 2,
    }}>
      <WindmillBlades size={40} />
    </div>
    
    {/* 몸통 */}
    <div style={{ 
      position: 'absolute', 
      top: '25px', 
      left: '15px',
      zIndex: 1,
    }}>
      <WindmillBody />
    </div>
  </div>
);

// 작은 미리보기용 (애니메이션 포함)
export const WindmillPreview = ({ size = 32 }) => (
  <div style={{ position: 'relative', width: size, height: size }}>
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 16 16" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 몸통 */}
      <rect x="6" y="8" width="4" height="6" fill="#CD853F"/>
      <rect x="7" y="8" width="2" height="6" fill="#DEB887"/>
      
      {/* 지붕 */}
      <rect x="5" y="6" width="6" height="2" fill="#8B4513"/>
      <rect x="6" y="5" width="4" height="1" fill="#A0522D"/>
      <rect x="7" y="5" width="2" height="1" fill="#ffd700"/>
      
      {/* 문 */}
      <rect x="7" y="12" width="2" height="2" fill="#5c2c0f"/>
    </svg>
    
    {/* 회전하는 날개 */}
    <svg 
      width={size * 0.7} 
      height={size * 0.7} 
      viewBox="0 0 16 16" 
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: 'absolute',
        top: '-2px',
        left: '5px',
        animation: 'spin 3s linear infinite',
      }}
    >
      <rect x="7" y="1" width="2" height="6" fill="#F5DEB3"/>
      <rect x="7" y="9" width="2" height="6" fill="#F5DEB3"/>
      <rect x="1" y="7" width="6" height="2" fill="#F5DEB3"/>
      <rect x="9" y="7" width="6" height="2" fill="#F5DEB3"/>
      <circle cx="8" cy="8" r="2" fill="#DEB887"/>
      <circle cx="8" cy="8" r="1" fill="#ffd700"/>
    </svg>
  </div>
);

const Windmill = ({ x, y, isSelected, onMouseDown }) => {
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
        top: y - 70,
        cursor: isSelected ? 'grabbing' : 'grab',
        zIndex: isSelected ? 100 : 12,
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* 선택/이동 표시 */}
      {isSelected && (
        <div 
          className="absolute -top-4 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-xs animate-pulse"
          style={{ 
            backgroundColor: '#fef08a',
            border: '2px solid #eab308',
            color: '#854d0e',
            whiteSpace: 'nowrap',
            zIndex: 10,
          }}
        >
          🌀 이동 중
        </div>
      )}
      
      <WindmillSprite />
      
      {/* 효과 아이콘 */}
      <div 
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded"
        style={{ 
          backgroundColor: '#fbbf24',
          color: '#78350f',
          fontSize: '9px',
        }}
      >
        ✨
      </div>
      
      {/* CSS 애니메이션 */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Windmill;
