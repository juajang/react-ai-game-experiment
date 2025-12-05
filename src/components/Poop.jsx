// 똥 SVG 컴포넌트 (작은 버전)
const PoopSprite = () => (
  <svg 
    width="14" 
    height="14" 
    viewBox="0 0 16 16" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* 바닥층 */}
    <ellipse cx="8" cy="13" rx="4" ry="2" fill="#8B4513"/>
    <ellipse cx="8" cy="13" rx="3" ry="1.5" fill="#A0522D"/>
    
    {/* 중간층 */}
    <ellipse cx="8" cy="10" rx="3" ry="2" fill="#8B4513"/>
    <ellipse cx="8" cy="10" rx="2" ry="1" fill="#A0522D"/>
    
    {/* 상단층 */}
    <ellipse cx="8" cy="7" rx="2" ry="1.5" fill="#8B4513"/>
    <ellipse cx="8" cy="7" rx="1" ry="0.8" fill="#A0522D"/>
    
    {/* 꼭대기 */}
    <ellipse cx="8" cy="5" rx="1" ry="0.8" fill="#8B4513"/>
  </svg>
);

// 작은 미리보기용
export const PoopPreview = ({ size = 16 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 16 16" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse cx="8" cy="13" rx="4" ry="2" fill="#8B4513"/>
    <ellipse cx="8" cy="10" rx="3" ry="2" fill="#8B4513"/>
    <ellipse cx="8" cy="7" rx="2" ry="1.5" fill="#8B4513"/>
    <ellipse cx="8" cy="5" rx="1" ry="0.8" fill="#8B4513"/>
  </svg>
);

const Poop = ({ x, y, age, onClick }) => {
  // 오래된 똥일수록 냄새가 심해짐 (시각적 표현)
  const stinkLevel = Math.min(age / 100, 1); // 0~1
  
  return (
    <div 
      className="absolute cursor-pointer hover:scale-110 transition-transform"
      style={{ 
        left: x - 7, 
        top: y - 7,
        zIndex: 4,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      title="클릭해서 치우기"
    >
      <PoopSprite />
      
      {/* 귀여운 냄새 파티클 (오래될수록 더 많이) */}
      {stinkLevel > 0.3 && (
        <div 
          className="absolute -top-3 left-1/2 -translate-x-1/2 animate-bounce"
          style={{ 
            fontSize: '8px',
            opacity: stinkLevel * 0.8,
            animationDuration: '1.5s',
          }}
        >
          〰️
        </div>
      )}
      
      {stinkLevel > 0.6 && (
        <div 
          className="absolute -top-2 -right-1 animate-pulse"
          style={{ 
            fontSize: '6px',
            opacity: stinkLevel * 0.7,
          }}
        >
          💭
        </div>
      )}
      
      {stinkLevel > 0.8 && (
        <div 
          className="absolute -top-2 -left-1 animate-pulse"
          style={{ 
            fontSize: '6px',
            opacity: stinkLevel * 0.7,
            animationDelay: '0.5s',
          }}
        >
          💭
        </div>
      )}
    </div>
  );
};

export default Poop;

