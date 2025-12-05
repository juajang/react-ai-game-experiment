import { GAME_CONFIG } from '../constants/gameConfig';

// 닭집 SVG 컴포넌트 (더 크고 귀여운 버전)
const CoopSprite = () => (
  <svg 
    width="80" 
    height="80" 
    viewBox="0 0 20 20" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* 지붕 그림자 */}
    <rect x="2" y="5" width="16" height="1" fill="#5c2c0f"/>
    
    {/* 지붕 */}
    <rect x="3" y="0" width="14" height="1" fill="#8b4513"/>
    <rect x="2" y="1" width="16" height="1" fill="#a0522d"/>
    <rect x="1" y="2" width="18" height="1" fill="#cd853f"/>
    <rect x="1" y="3" width="18" height="1" fill="#a0522d"/>
    <rect x="2" y="4" width="16" height="1" fill="#8b4513"/>
    
    {/* 지붕 줄무늬 디테일 */}
    <rect x="5" y="2" width="1" height="2" fill="#8b4513"/>
    <rect x="9" y="1" width="2" height="3" fill="#8b4513"/>
    <rect x="14" y="2" width="1" height="2" fill="#8b4513"/>
    
    {/* 지붕 꼭대기 장식 */}
    <rect x="9" y="0" width="2" height="1" fill="#5c2c0f"/>
    
    {/* 벽 */}
    <rect x="2" y="5" width="16" height="12" fill="#deb887"/>
    
    {/* 벽 나무 패널 */}
    <rect x="2" y="5" width="1" height="12" fill="#d2b48c"/>
    <rect x="5" y="5" width="1" height="12" fill="#d2b48c"/>
    <rect x="8" y="5" width="1" height="12" fill="#d2b48c"/>
    <rect x="11" y="5" width="1" height="12" fill="#d2b48c"/>
    <rect x="14" y="5" width="1" height="12" fill="#d2b48c"/>
    <rect x="17" y="5" width="1" height="12" fill="#d2b48c"/>
    
    {/* 문틀 */}
    <rect x="7" y="10" width="6" height="7" fill="#5c2c0f"/>
    
    {/* 문 (열린 상태) */}
    <rect x="8" y="11" width="4" height="6" fill="#8b4513"/>
    <rect x="8" y="11" width="1" height="6" fill="#7a3b0a"/>
    <rect x="11" y="11" width="1" height="6" fill="#a0522d"/>
    
    {/* 문 손잡이 */}
    <rect x="11" y="14" width="1" height="1" fill="#ffd700"/>
    
    {/* 창문 왼쪽 */}
    <rect x="3" y="6" width="3" height="3" fill="#87ceeb"/>
    <rect x="3" y="6" width="3" height="1" fill="#add8e6"/>
    <rect x="4" y="6" width="1" height="3" fill="#d2b48c"/>
    <rect x="3" y="7" width="1" height="1" fill="#ffffff" opacity="0.5"/>
    
    {/* 창문 오른쪽 */}
    <rect x="14" y="6" width="3" height="3" fill="#87ceeb"/>
    <rect x="14" y="6" width="3" height="1" fill="#add8e6"/>
    <rect x="15" y="6" width="1" height="3" fill="#d2b48c"/>
    <rect x="14" y="7" width="1" height="1" fill="#ffffff" opacity="0.5"/>
    
    {/* 울타리 왼쪽 */}
    <rect x="0" y="12" width="2" height="5" fill="#8b4513"/>
    <rect x="0" y="13" width="2" height="1" fill="#a0522d"/>
    <rect x="0" y="15" width="2" height="1" fill="#a0522d"/>
    
    {/* 울타리 오른쪽 */}
    <rect x="18" y="12" width="2" height="5" fill="#8b4513"/>
    <rect x="18" y="13" width="2" height="1" fill="#a0522d"/>
    <rect x="18" y="15" width="2" height="1" fill="#a0522d"/>
    
    {/* 지붕 위 하트 장식 */}
    <rect x="9" y="0" width="1" height="1" fill="#ef4444"/>
    
    {/* 작은 풀 장식 */}
    <rect x="0" y="16" width="1" height="1" fill="#22c55e"/>
    <rect x="19" y="16" width="1" height="1" fill="#22c55e"/>
  </svg>
);

// 작은 미리보기용
export const CoopPreview = ({ size = 32 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 20 20" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="3" y="0" width="14" height="1" fill="#8b4513"/>
    <rect x="2" y="1" width="16" height="1" fill="#a0522d"/>
    <rect x="1" y="2" width="18" height="2" fill="#cd853f"/>
    <rect x="2" y="4" width="16" height="1" fill="#8b4513"/>
    <rect x="2" y="5" width="16" height="12" fill="#deb887"/>
    <rect x="7" y="10" width="6" height="7" fill="#8b4513"/>
    <rect x="3" y="6" width="3" height="3" fill="#87ceeb"/>
    <rect x="14" y="6" width="3" height="3" fill="#87ceeb"/>
    <rect x="0" y="12" width="2" height="5" fill="#8b4513"/>
    <rect x="18" y="12" width="2" height="5" fill="#8b4513"/>
  </svg>
);

// ZZZ 애니메이션 컴포넌트
const SleepingZzz = ({ delay = 0 }) => (
  <div 
    className="absolute"
    style={{
      animation: `floatUp 2s ease-out infinite`,
      animationDelay: `${delay}s`,
      opacity: 0,
    }}
  >
    <span style={{ 
      fontSize: '14px', 
      fontWeight: 'bold',
      color: '#6366f1',
      textShadow: '1px 1px 0px white',
    }}>
      z
    </span>
  </div>
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
        left: x - 40, 
        top: y - 70,
        cursor: isSelected ? 'grabbing' : 'grab',
        zIndex: isSelected ? 100 : 10,
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* CSS 애니메이션 정의 */}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) translateX(0) scale(0.5);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translateY(-35px) translateX(12px) scale(1.3);
            opacity: 0;
          }
        }
      `}</style>
      
      {/* 선택/이동 표시 */}
      {isSelected && (
        <div 
          className="absolute -top-4 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-xs animate-pulse"
          style={{ 
            backgroundColor: '#ffd700',
            border: '2px solid #b8860b',
            color: '#654321',
            whiteSpace: 'nowrap',
            zIndex: 10,
          }}
        >
          🏠 이동 중
        </div>
      )}
      
      <CoopSprite />
      
      {/* 수용 인원 표시 */}
      <div 
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-xs"
        style={{ 
          backgroundColor: isFull ? '#ef4444' : '#22c55e',
          color: 'white',
          fontSize: '11px',
          fontWeight: 'bold',
        }}
      >
        🐔 {occupants}/{maxCapacity}
      </div>
      
      {/* 잠자는 ZZZ 애니메이션 */}
      {occupants > 0 && (
        <div 
          className="absolute"
          style={{ 
            top: -5,
            right: -5,
            zIndex: 20,
          }}
        >
          <SleepingZzz delay={0} />
          <SleepingZzz delay={0.5} />
          <SleepingZzz delay={1} />
          {occupants >= 2 && (
            <div style={{ position: 'absolute', left: -25 }}>
              <SleepingZzz delay={0.3} />
              <SleepingZzz delay={0.8} />
            </div>
          )}
          {occupants >= 3 && (
            <div style={{ position: 'absolute', left: -50 }}>
              <SleepingZzz delay={0.6} />
              <SleepingZzz delay={1.1} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Coop;
