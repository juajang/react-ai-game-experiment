import { GAME_CONFIG } from '../constants/gameConfig';

// 등급별 사이즈 및 디테일
const GRADE_STYLES = {
  1: { size: 64, viewBox: '0 0 16 16' },  // 작은 닭집
  2: { size: 80, viewBox: '0 0 20 20' },  // 중간 닭집
  3: { size: 96, viewBox: '0 0 24 24' },  // 큰 황금 닭집
};

// 닭집 SVG 컴포넌트 (등급별 디자인)
const CoopSprite = ({ gradeLevel = 1 }) => {
  const style = GRADE_STYLES[gradeLevel] || GRADE_STYLES[1];
  
  if (gradeLevel === 1) {
    // 레벨 1: 작고 단순한 닭집
    return (
      <svg width={style.size} height={style.size} viewBox={style.viewBox} xmlns="http://www.w3.org/2000/svg">
        {/* 지붕 */}
        <rect x="2" y="0" width="12" height="1" fill="#8b4513"/>
        <rect x="1" y="1" width="14" height="2" fill="#a0522d"/>
        <rect x="2" y="3" width="12" height="1" fill="#8b4513"/>
        
        {/* 벽 */}
        <rect x="2" y="4" width="12" height="10" fill="#deb887"/>
        <rect x="3" y="4" width="1" height="10" fill="#d2b48c"/>
        <rect x="6" y="4" width="1" height="10" fill="#d2b48c"/>
        <rect x="9" y="4" width="1" height="10" fill="#d2b48c"/>
        <rect x="12" y="4" width="1" height="10" fill="#d2b48c"/>
        
        {/* 문 */}
        <rect x="6" y="8" width="4" height="6" fill="#8b4513"/>
        <rect x="9" y="11" width="1" height="1" fill="#5c2c0f"/>
        
        {/* 창문 */}
        <rect x="3" y="5" width="2" height="2" fill="#87ceeb"/>
        <rect x="11" y="5" width="2" height="2" fill="#87ceeb"/>
      </svg>
    );
  }
  
  if (gradeLevel === 2) {
    // 레벨 2: 중간 크기 닭집 + 울타리
    return (
      <svg width={style.size} height={style.size} viewBox={style.viewBox} xmlns="http://www.w3.org/2000/svg">
        {/* 지붕 */}
        <rect x="3" y="0" width="14" height="1" fill="#8b4513"/>
        <rect x="2" y="1" width="16" height="1" fill="#a0522d"/>
        <rect x="1" y="2" width="18" height="2" fill="#cd853f"/>
        <rect x="2" y="4" width="16" height="1" fill="#8b4513"/>
        
        {/* 벽 */}
        <rect x="2" y="5" width="16" height="12" fill="#deb887"/>
        <rect x="3" y="5" width="1" height="12" fill="#d2b48c"/>
        <rect x="6" y="5" width="1" height="12" fill="#d2b48c"/>
        <rect x="9" y="5" width="1" height="12" fill="#d2b48c"/>
        <rect x="12" y="5" width="1" height="12" fill="#d2b48c"/>
        <rect x="15" y="5" width="1" height="12" fill="#d2b48c"/>
        
        {/* 문 */}
        <rect x="7" y="10" width="6" height="7" fill="#5c2c0f"/>
        <rect x="8" y="11" width="4" height="6" fill="#8b4513"/>
        <rect x="11" y="14" width="1" height="1" fill="#ffd700"/>
        
        {/* 창문 */}
        <rect x="3" y="6" width="3" height="3" fill="#87ceeb"/>
        <rect x="4" y="6" width="1" height="3" fill="#d2b48c"/>
        <rect x="14" y="6" width="3" height="3" fill="#87ceeb"/>
        <rect x="15" y="6" width="1" height="3" fill="#d2b48c"/>
        
        {/* 울타리 */}
        <rect x="0" y="12" width="2" height="5" fill="#8b4513"/>
        <rect x="0" y="13" width="2" height="1" fill="#a0522d"/>
        <rect x="18" y="12" width="2" height="5" fill="#8b4513"/>
        <rect x="18" y="13" width="2" height="1" fill="#a0522d"/>
        
        {/* 풀 장식 */}
        <rect x="0" y="16" width="1" height="1" fill="#22c55e"/>
        <rect x="19" y="16" width="1" height="1" fill="#22c55e"/>
      </svg>
    );
  }
  
  // 레벨 3: 큰 황금 닭집 + 장식
  return (
    <svg width={style.size} height={style.size} viewBox={style.viewBox} xmlns="http://www.w3.org/2000/svg">
      {/* 지붕 꼭대기 장식 */}
      <rect x="10" y="0" width="4" height="2" fill="#ffd700"/>
      <rect x="11" y="0" width="2" height="1" fill="#ffec8b"/>
      
      {/* 지붕 */}
      <rect x="4" y="2" width="16" height="1" fill="#8b4513"/>
      <rect x="3" y="3" width="18" height="1" fill="#a0522d"/>
      <rect x="2" y="4" width="20" height="2" fill="#cd853f"/>
      <rect x="3" y="6" width="18" height="1" fill="#8b4513"/>
      
      {/* 벽 */}
      <rect x="3" y="7" width="18" height="14" fill="#deb887"/>
      <rect x="4" y="7" width="1" height="14" fill="#d2b48c"/>
      <rect x="7" y="7" width="1" height="14" fill="#d2b48c"/>
      <rect x="10" y="7" width="1" height="14" fill="#d2b48c"/>
      <rect x="13" y="7" width="1" height="14" fill="#d2b48c"/>
      <rect x="16" y="7" width="1" height="14" fill="#d2b48c"/>
      <rect x="19" y="7" width="1" height="14" fill="#d2b48c"/>
      
      {/* 문 */}
      <rect x="8" y="13" width="8" height="8" fill="#5c2c0f"/>
      <rect x="9" y="14" width="6" height="7" fill="#8b4513"/>
      <rect x="14" y="17" width="1" height="1" fill="#ffd700"/>
      
      {/* 창문 (더 큼) */}
      <rect x="4" y="8" width="3" height="4" fill="#87ceeb"/>
      <rect x="5" y="8" width="1" height="4" fill="#d2b48c"/>
      <rect x="4" y="9" width="3" height="1" fill="#d2b48c"/>
      <rect x="17" y="8" width="3" height="4" fill="#87ceeb"/>
      <rect x="18" y="8" width="1" height="4" fill="#d2b48c"/>
      <rect x="17" y="9" width="3" height="1" fill="#d2b48c"/>
      
      {/* 울타리 (더 큼) */}
      <rect x="0" y="14" width="3" height="7" fill="#8b4513"/>
      <rect x="0" y="15" width="3" height="1" fill="#a0522d"/>
      <rect x="0" y="18" width="3" height="1" fill="#a0522d"/>
      <rect x="21" y="14" width="3" height="7" fill="#8b4513"/>
      <rect x="21" y="15" width="3" height="1" fill="#a0522d"/>
      <rect x="21" y="18" width="3" height="1" fill="#a0522d"/>
      
      {/* 황금 장식 */}
      <rect x="3" y="6" width="2" height="1" fill="#ffd700"/>
      <rect x="19" y="6" width="2" height="1" fill="#ffd700"/>
      
      {/* 꽃 장식 */}
      <rect x="0" y="20" width="1" height="1" fill="#f472b6"/>
      <rect x="2" y="20" width="1" height="1" fill="#fbbf24"/>
      <rect x="21" y="20" width="1" height="1" fill="#f472b6"/>
      <rect x="23" y="20" width="1" height="1" fill="#fbbf24"/>
      
      {/* 풀 */}
      <rect x="1" y="20" width="1" height="1" fill="#22c55e"/>
      <rect x="22" y="20" width="1" height="1" fill="#22c55e"/>
    </svg>
  );
};

// 작은 미리보기용
export const CoopPreview = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="0" width="12" height="1" fill="#8b4513"/>
    <rect x="1" y="1" width="14" height="2" fill="#a0522d"/>
    <rect x="2" y="3" width="12" height="1" fill="#8b4513"/>
    <rect x="2" y="4" width="12" height="10" fill="#deb887"/>
    <rect x="6" y="8" width="4" height="6" fill="#8b4513"/>
    <rect x="3" y="5" width="2" height="2" fill="#87ceeb"/>
    <rect x="11" y="5" width="2" height="2" fill="#87ceeb"/>
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

const Coop = ({ x, y, occupants = 0, capacity, isSelected, onMouseDown, gradeLevel = 1 }) => {
  const maxCapacity = capacity || GAME_CONFIG.COOP.CAPACITY;
  const isFull = occupants >= maxCapacity;
  const style = GRADE_STYLES[gradeLevel] || GRADE_STYLES[1];
  const halfSize = style.size / 2;

  const handleMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onMouseDown?.(e);
  };

  return (
    <div 
      className="absolute"
      style={{ 
        left: x - halfSize, 
        top: y - style.size + 10,
        cursor: isSelected ? 'grabbing' : 'grab',
        zIndex: isSelected ? 100 : 17,
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
            backgroundColor: '#fef3c7',
            border: '2px solid #f59e0b',
            color: '#92400e',
            whiteSpace: 'nowrap',
            zIndex: 10,
          }}
        >
          🏠 이동 중
        </div>
      )}
      
      <CoopSprite gradeLevel={gradeLevel} />
      
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
