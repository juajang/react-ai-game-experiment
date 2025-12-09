import { GAME_CONFIG } from '../../constants/gameConfig';

// 등급별 사이즈
const GRADE_STYLES = {
  1: { size: 64, viewBox: '0 0 16 16' },  // 작은 연못
  2: { size: 80, viewBox: '0 0 20 20' },  // 중간 연못
  3: { size: 100, viewBox: '0 0 25 25' }, // 큰 황금 연못
};

// 연못 SVG 컴포넌트 (등급별 디자인)
const PondSprite = ({ gradeLevel = 1 }) => {
  const style = GRADE_STYLES[gradeLevel] || GRADE_STYLES[1];
  
  if (gradeLevel === 1) {
    // 레벨 1: 작고 단순한 연못 (풀 없음)
    return (
      <svg width={style.size} height={style.size} viewBox={style.viewBox} xmlns="http://www.w3.org/2000/svg">
        {/* 테두리 */}
        <ellipse cx="8" cy="9" rx="7" ry="5" fill="#a08050"/>
        <ellipse cx="8" cy="9" rx="6" ry="4" fill="#4fc3f7"/>
        <ellipse cx="8" cy="8" rx="5" ry="3" fill="#29b6f6"/>
        
        {/* 물결 */}
        <ellipse cx="6" cy="8" rx="1.5" ry="0.8" fill="#81d4fa" opacity="0.7"/>
        <rect x="5" y="8" width="1" height="1" fill="#ffffff" opacity="0.6"/>
        <rect x="10" y="9" width="1" height="1" fill="#ffffff" opacity="0.5"/>
      </svg>
    );
  }
  
  if (gradeLevel === 2) {
    // 레벨 2: 중간 크기 + 물고기
    return (
      <svg width={style.size} height={style.size} viewBox={style.viewBox} xmlns="http://www.w3.org/2000/svg">
        {/* 테두리 */}
        <ellipse cx="10" cy="12" rx="9" ry="6" fill="#a08050"/>
        <ellipse cx="10" cy="12" rx="8" ry="5" fill="#4fc3f7"/>
        <ellipse cx="10" cy="11" rx="7" ry="4" fill="#29b6f6"/>
        
        {/* 물결 */}
        <ellipse cx="7" cy="11" rx="2" ry="1" fill="#81d4fa" opacity="0.8"/>
        <ellipse cx="13" cy="12" rx="1.5" ry="0.8" fill="#81d4fa" opacity="0.6"/>
        <rect x="6" y="10" width="1" height="1" fill="#ffffff" opacity="0.7"/>
        <rect x="12" y="11" width="1" height="1" fill="#ffffff" opacity="0.5"/>
        
        {/* 풀 */}
        <rect x="1" y="8" width="1" height="4" fill="#2e7d32"/>
        <rect x="2" y="7" width="1" height="5" fill="#43a047"/>
        <rect x="17" y="7" width="1" height="5" fill="#2e7d32"/>
        <rect x="18" y="8" width="1" height="4" fill="#43a047"/>
        <rect x="5" y="4" width="1" height="3" fill="#43a047"/>
        <rect x="8" y="3" width="1" height="4" fill="#2e7d32"/>
        <rect x="11" y="4" width="1" height="3" fill="#66bb6a"/>
        <rect x="14" y="3" width="1" height="4" fill="#43a047"/>
        
        {/* 꽃 */}
        <rect x="2" y="6" width="1" height="1" fill="#fff176"/>
        <rect x="17" y="6" width="1" height="1" fill="#f48fb1"/>
        
        {/* 물고기 */}
        <ellipse cx="8" cy="13" rx="1" ry="0.5" fill="#ff8a65"/>
        <rect x="6" y="13" width="1" height="1" fill="#ff8a65"/>
      </svg>
    );
  }
  
  // 레벨 3: 큰 황금 연못 + 연꽃 + 물고기들
  return (
    <svg width={style.size} height={style.size} viewBox={style.viewBox} xmlns="http://www.w3.org/2000/svg">
      {/* 황금 테두리 장식 */}
      <ellipse cx="12.5" cy="14" rx="12" ry="8" fill="#daa520"/>
      
      {/* 테두리 */}
      <ellipse cx="12.5" cy="14" rx="11" ry="7" fill="#a08050"/>
      <ellipse cx="12.5" cy="14" rx="10" ry="6" fill="#4fc3f7"/>
      <ellipse cx="12.5" cy="13" rx="9" ry="5" fill="#29b6f6"/>
      
      {/* 물결 */}
      <ellipse cx="8" cy="13" rx="2.5" ry="1.2" fill="#81d4fa" opacity="0.8"/>
      <ellipse cx="16" cy="14" rx="2" ry="1" fill="#81d4fa" opacity="0.6"/>
      <ellipse cx="12" cy="12" rx="1.5" ry="0.8" fill="#e1f5fe" opacity="0.7"/>
      <rect x="7" y="12" width="1" height="1" fill="#ffffff" opacity="0.8"/>
      <rect x="15" y="13" width="1" height="1" fill="#ffffff" opacity="0.6"/>
      <rect x="11" y="11" width="1" height="1" fill="#ffffff" opacity="0.7"/>
      
      {/* 풀 */}
      <rect x="1" y="9" width="1" height="5" fill="#2e7d32"/>
      <rect x="2" y="8" width="1" height="6" fill="#43a047"/>
      <rect x="3" y="10" width="1" height="4" fill="#66bb6a"/>
      <rect x="21" y="8" width="1" height="6" fill="#2e7d32"/>
      <rect x="22" y="9" width="1" height="5" fill="#43a047"/>
      <rect x="23" y="10" width="1" height="4" fill="#66bb6a"/>
      <rect x="5" y="4" width="1" height="4" fill="#43a047"/>
      <rect x="8" y="3" width="1" height="5" fill="#2e7d32"/>
      <rect x="11" y="4" width="1" height="4" fill="#66bb6a"/>
      <rect x="14" y="3" width="1" height="5" fill="#43a047"/>
      <rect x="17" y="4" width="1" height="4" fill="#2e7d32"/>
      <rect x="20" y="5" width="1" height="3" fill="#66bb6a"/>
      
      {/* 꽃들 */}
      <rect x="2" y="7" width="1" height="1" fill="#fff176"/>
      <rect x="22" y="7" width="1" height="1" fill="#f48fb1"/>
      <rect x="7" y="2" width="1" height="1" fill="#f48fb1"/>
      <rect x="13" y="2" width="1" height="1" fill="#fff176"/>
      <rect x="19" y="3" width="1" height="1" fill="#f48fb1"/>
      
      {/* 연꽃 */}
      <ellipse cx="12.5" cy="14" rx="2.5" ry="1.5" fill="#f8bbd9"/>
      <ellipse cx="12.5" cy="13.5" rx="1.5" ry="0.9" fill="#f48fb1"/>
      <rect x="12" y="13" width="1" height="1" fill="#ffeb3b"/>
      
      {/* 물고기들 */}
      <ellipse cx="7" cy="15" rx="1.2" ry="0.6" fill="#ff8a65"/>
      <rect x="5" y="15" width="1" height="1" fill="#ff8a65"/>
      <ellipse cx="17" cy="15" rx="1" ry="0.5" fill="#ffab91"/>
      <rect x="18" y="15" width="1" height="1" fill="#ffab91"/>
      <ellipse cx="10" cy="16" rx="0.8" ry="0.4" fill="#ff7043"/>
      <rect x="9" y="16" width="1" height="1" fill="#ff7043"/>
      
      {/* 황금 돌 장식 */}
      <ellipse cx="4" cy="17" rx="1.5" ry="1" fill="#daa520"/>
      <ellipse cx="21" cy="17" rx="1.5" ry="1" fill="#daa520"/>
    </svg>
  );
};

// 작은 미리보기용
export const PondPreview = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="8" cy="9" rx="7" ry="5" fill="#a08050"/>
    <ellipse cx="8" cy="9" rx="6" ry="4" fill="#4fc3f7"/>
    <ellipse cx="8" cy="8" rx="5" ry="3" fill="#29b6f6"/>
    <ellipse cx="6" cy="8" rx="1.5" ry="0.8" fill="#81d4fa"/>
    <rect x="1" y="6" width="1" height="3" fill="#43a047"/>
    <rect x="14" y="6" width="1" height="3" fill="#43a047"/>
  </svg>
);

const Pond = ({ x, y, isSelected, onMouseDown, gradeLevel = 1 }) => {
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
        top: y - halfSize,
        cursor: isSelected ? 'grabbing' : 'grab',
        zIndex: isSelected ? 100 : 16,
        userSelect: 'none',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* 선택/이동 표시 */}
      {isSelected && (
        <div 
          className="absolute -top-4 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-xs animate-pulse"
          style={{ 
            backgroundColor: '#dbeafe',
            border: '2px solid #3b82f6',
            color: '#1e40af',
            whiteSpace: 'nowrap',
            zIndex: 10,
          }}
        >
          💧 이동 중
        </div>
      )}
      
      <PondSprite gradeLevel={gradeLevel} />
      
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
            left: halfSize - GAME_CONFIG.POND.EFFECT_RADIUS,
            top: halfSize - GAME_CONFIG.POND.EFFECT_RADIUS,
            opacity: 0.5,
          }}
        />
      )}
    </div>
  );
};

export default Pond;




