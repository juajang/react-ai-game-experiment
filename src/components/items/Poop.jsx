import { useState, useEffect } from 'react';

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

const Poop = ({ x, y, age, onClick, isShovelActive, onShovelClean, mousePos, fieldRect }) => {
  // 오래된 똥일수록 냄새가 심해짐 (시각적 표현)
  const stinkLevel = Math.min(age / 100, 1); // 0~1
  
  // 자석 효과 상태
  const [isBeingSucked, setIsBeingSucked] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  
  // 삽 자석 효과
  useEffect(() => {
    if (!isShovelActive || !mousePos || !fieldRect || isBeingSucked) return;
    
    // 마우스 위치를 필드 좌표로 변환
    const mouseX = mousePos.x - fieldRect.left;
    const mouseY = mousePos.y - fieldRect.top;
    
    // 똥과 마우스 사이의 거리 계산
    const dx = mouseX - x;
    const dy = mouseY - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // 자석 범위 (60px 이내면 빨려감)
    const magnetRange = 60;
    
    if (distance < magnetRange) {
      setIsBeingSucked(true);
      
      // 마우스 방향으로 이동하는 애니메이션
      let progress = 0;
      const animate = () => {
        progress += 0.08;
        if (progress >= 1) {
          onShovelClean?.();
          return;
        }
        
        // 이징 함수로 부드럽게
        const eased = 1 - Math.pow(1 - progress, 3);
        setOffset({
          x: dx * eased,
          y: dy * eased,
        });
        
        requestAnimationFrame(animate);
      };
      
      requestAnimationFrame(animate);
    }
  }, [isShovelActive, mousePos, fieldRect, x, y, isBeingSucked, onShovelClean]);
  
  return (
    <div 
      className="absolute cursor-pointer hover:scale-110 transition-transform"
      style={{ 
        left: x - 7 + offset.x, 
        top: y - 7 + offset.y,
        zIndex: 1,
        cursor: isShovelActive ? 'none' : 'pointer',
        opacity: isBeingSucked ? 1 - (Math.abs(offset.x) + Math.abs(offset.y)) / 100 : 1,
        transform: isBeingSucked ? `scale(${1 - (Math.abs(offset.x) + Math.abs(offset.y)) / 150})` : 'scale(1)',
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      title={isShovelActive ? "삽으로 치우기" : "클릭해서 치우기"}
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

