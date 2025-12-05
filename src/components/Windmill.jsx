import { GAME_CONFIG } from '../constants/gameConfig';

// 풍차 SVG 컴포넌트 (황금 농장 전용)
const WindmillSprite = () => (
  <svg 
    width="80" 
    height="80" 
    viewBox="0 0 16 16" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* 풍차 몸통 */}
    <rect x="7" y="6" width="2" height="6" fill="#8B4513"/>
    <rect x="6" y="6" width="1" height="6" fill="#A0522D"/>
    <rect x="9" y="6" width="1" height="6" fill="#A0522D"/>
    
    {/* 지붕 */}
    <rect x="6" y="5" width="4" height="1" fill="#CD853F"/>
    <rect x="7" y="4" width="2" height="1" fill="#8B4513"/>
    
    {/* 풍차 날개 (십자 형태) */}
    {/* 중앙 축 */}
    <rect x="8" y="6" width="1" height="1" fill="#DEB887"/>
    
    {/* 상 */}
    <rect x="8" y="2" width="1" height="4" fill="#F5DEB3"/>
    {/* 하 */}
    <rect x="8" y="7" width="1" height="4" fill="#F5DEB3"/>
    {/* 좌 */}
    <rect x="4" y="6" width="4" height="1" fill="#F5DEB3"/>
    {/* 우 */}
    <rect x="9" y="6" width="4" height="1" fill="#F5DEB3"/>
    
    {/* 황금 장식 */}
    <rect x="7" y="4" width="1" height="1" fill="#ffd700"/>
    <rect x="8" y="4" width="1" height="1" fill="#ffd700"/>
    
    {/* 문 */}
    <rect x="7" y="10" width="2" height="2" fill="#5c2c0f"/>
    <rect x="8" y="11" width="1" height="1" fill="#ffd700"/>
  </svg>
);

// 작은 미리보기용
export const WindmillPreview = ({ size = 32 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 16 16" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="7" y="6" width="2" height="6" fill="#8B4513"/>
    <rect x="6" y="5" width="4" height="1" fill="#CD853F"/>
    <rect x="7" y="4" width="2" height="1" fill="#8B4513"/>
    <rect x="8" y="2" width="1" height="4" fill="#F5DEB3"/>
    <rect x="8" y="7" width="1" height="4" fill="#F5DEB3"/>
    <rect x="4" y="6" width="4" height="1" fill="#F5DEB3"/>
    <rect x="9" y="6" width="4" height="1" fill="#F5DEB3"/>
    <rect x="7" y="4" width="2" height="1" fill="#ffd700"/>
  </svg>
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
        top: y - 60,
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
    </div>
  );
};

export default Windmill;

