import { useState } from 'react';

// 미리보기용 작은 나무 성
export const MansionPreview = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
    {/* 왼쪽 기둥 */}
    <rect x="0.5" y="5" width="1.5" height="7" fill="#a0522d"/>
    <rect x="0.7" y="5.2" width="1.1" height="6.6" fill="#cd853f"/>
    <rect x="0.5" y="6.5" width="1.5" height="0.5" fill="#8b4513" opacity="0.3"/>
    <rect x="0.5" y="8.5" width="1.5" height="0.5" fill="#8b4513" opacity="0.3"/>
    <rect x="0.5" y="10.5" width="1.5" height="0.5" fill="#8b4513" opacity="0.3"/>
    
    {/* 왼쪽 망루 */}
    <rect x="0.2" y="2.5" width="2" height="2.5" fill="#a0522d"/>
    <rect x="0.5" y="2.7" width="1.4" height="2.1" fill="#cd853f"/>
    <polygon points="1.2,1.5 0.2,2.5 2.2,2.5" fill="#8b4513"/>
    <rect x="0.8" y="3.5" width="0.8" height="0.8" fill="#ffe082"/>
    
    {/* 오른쪽 기둥 */}
    <rect x="14" y="5" width="1.5" height="7" fill="#a0522d"/>
    <rect x="14.2" y="5.2" width="1.1" height="6.6" fill="#cd853f"/>
    <rect x="14" y="6.5" width="1.5" height="0.5" fill="#8b4513" opacity="0.3"/>
    <rect x="14" y="8.5" width="1.5" height="0.5" fill="#8b4513" opacity="0.3"/>
    <rect x="14" y="10.5" width="1.5" height="0.5" fill="#8b4513" opacity="0.3"/>
    
    {/* 오른쪽 망루 */}
    <rect x="13.8" y="2.5" width="2" height="2.5" fill="#a0522d"/>
    <rect x="14.1" y="2.7" width="1.4" height="2.1" fill="#cd853f"/>
    <polygon points="14.8,1.5 13.8,2.5 15.8,2.5" fill="#8b4513"/>
    <rect x="14.4" y="3.5" width="0.8" height="0.8" fill="#ffe082"/>
    
    {/* 삼각형 지붕 */}
    <polygon points="8,1 2.5,3 13.5,3" fill="#8b4513"/>
    <polygon points="8,1.5 3.5,3 12.5,3" fill="#a0522d"/>
    
    {/* 성벽 (통나무) */}
    <rect x="3" y="3" width="10" height="9" fill="#cd853f"/>
    <rect x="3.5" y="3.5" width="9" height="8.3" fill="#deb887"/>
    
    {/* 통나무 무늬 */}
    <rect x="3" y="4" width="10" height="0.4" fill="#a0522d" opacity="0.2"/>
    <rect x="3" y="5.5" width="10" height="0.4" fill="#a0522d" opacity="0.2"/>
    <rect x="3" y="7" width="10" height="0.4" fill="#a0522d" opacity="0.2"/>
    <rect x="3" y="8.5" width="10" height="0.4" fill="#a0522d" opacity="0.2"/>
    <rect x="3" y="10" width="10" height="0.4" fill="#a0522d" opacity="0.2"/>
    <rect x="3" y="11.5" width="10" height="0.4" fill="#a0522d" opacity="0.2"/>
    
    {/* 세로로 긴 창문 */}
    <rect x="4" y="4.5" width="1.5" height="3" fill="#ffe082"/>
    <rect x="4.5" y="4.5" width="0.4" height="3" fill="#cd853f" opacity="0.3"/>
    <rect x="4" y="5.8" width="1.5" height="0.4" fill="#cd853f" opacity="0.3"/>
    
    <rect x="10.5" y="4.5" width="1.5" height="3" fill="#ffe082"/>
    <rect x="11" y="4.5" width="0.4" height="3" fill="#cd853f" opacity="0.3"/>
    <rect x="10.5" y="5.8" width="1.5" height="0.4" fill="#cd853f" opacity="0.3"/>
    
    {/* 창문 아래 꽃 화분 */}
    <rect x="4.1" y="7.5" width="1.3" height="0.8" fill="#d2691e"/>
    <circle cx="4.4" cy="7.3" r="0.25" fill="#f472b6"/>
    <circle cx="4.8" cy="7.2" r="0.2" fill="#fbbf24"/>
    <circle cx="5.2" cy="7.3" r="0.25" fill="#f87171"/>
    
    <rect x="10.6" y="7.5" width="1.3" height="0.8" fill="#d2691e"/>
    <circle cx="10.9" cy="7.3" r="0.25" fill="#fbbf24"/>
    <circle cx="11.3" cy="7.2" r="0.2" fill="#f472b6"/>
    <circle cx="11.7" cy="7.3" r="0.25" fill="#fbbf24"/>
    
    {/* 중앙 문 */}
    <rect x="6" y="8" width="4" height="4" fill="#6b4423"/>
    <polygon points="8,8 6,9 10,9" fill="#6b4423"/>
    <circle cx="9" cy="10" r="0.3" fill="#8b8b8b"/>
    
    {/* 성벽 꼭대기 */}
    <rect x="3" y="2.5" width="1" height="0.8" fill="#cd853f"/>
    <rect x="5" y="2.5" width="1" height="0.8" fill="#cd853f"/>
    <rect x="7" y="2.5" width="2" height="0.8" fill="#cd853f"/>
    <rect x="10" y="2.5" width="1" height="0.8" fill="#cd853f"/>
    <rect x="12" y="2.5" width="1" height="0.8" fill="#cd853f"/>
    
    {/* 하단 왼쪽 큰 꽃덤불 */}
    <ellipse cx="2" cy="12.2" rx="2.5" ry="1.5" fill="#22c55e" opacity="0.9"/>
    <circle cx="1" cy="11.5" r="0.4" fill="#f472b6"/>
    <circle cx="2" cy="11.5" r="0.35" fill="#fbbf24"/>
    <circle cx="3" cy="11.5" r="0.4" fill="#f87171"/>
    <circle cx="2" cy="12" r="0.35" fill="#fbbf24"/>
    
    {/* 하단 오른쪽 큰 꽃덤불 */}
    <ellipse cx="14" cy="12.2" rx="2.5" ry="1.5" fill="#22c55e" opacity="0.9"/>
    <circle cx="13" cy="11.5" r="0.4" fill="#fbbf24"/>
    <circle cx="14" cy="11.5" r="0.35" fill="#f472b6"/>
    <circle cx="15" cy="11.5" r="0.4" fill="#fbbf24"/>
    <circle cx="14" cy="12" r="0.35" fill="#f87171"/>
  </svg>
);

const Mansion = ({ x, y, isSelected, onMouseDown }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onMouseDown?.(e);
  };

  return (
    <>
      <div 
        className="absolute"
        style={{ 
          left: x - 48, 
          top: y - 90,
          cursor: isSelected ? 'grabbing' : 'grab',
          zIndex: isSelected ? 100 : 18,
          userSelect: 'none',
        }}
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 선택/이동 표시 */}
        {isSelected && (
          <div 
            className="absolute -top-6 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg text-xs animate-pulse"
            style={{ 
              backgroundColor: '#fef3c7',
              border: '2px solid #8b4513',
              color: '#5d4037',
              whiteSpace: 'nowrap',
              zIndex: 10,
              fontWeight: 'bold',
            }}
          >
            🏰 이동 중
          </div>
        )}
        
        {/* 나무 성 본체 */}
        <svg 
          width="96" 
          height="96" 
          viewBox="0 0 32 32" 
          xmlns="http://www.w3.org/2000/svg"
          style={{ imageRendering: 'pixelated' }}
        >
          {/* 왼쪽 기둥 */}
          <rect x="1" y="10" width="3" height="14" fill="#a0522d"/>
          <rect x="1.5" y="10.5" width="2" height="13" fill="#cd853f"/>
          <rect x="1" y="12" width="3" height="1" fill="#8b4513" opacity="0.3"/>
          <rect x="1" y="16" width="3" height="1" fill="#8b4513" opacity="0.3"/>
          <rect x="1" y="20" width="3" height="1" fill="#8b4513" opacity="0.3"/>
          
          {/* 왼쪽 망루 */}
          <rect x="0.5" y="5" width="4" height="5" fill="#a0522d"/>
          <rect x="1" y="5.5" width="3" height="4" fill="#cd853f"/>
          <polygon points="2.5,3 0.5,5 4.5,5" fill="#8b4513"/>
          <rect x="1.5" y="7" width="2" height="1.5" fill="#ffe082"/>
          
          {/* 오른쪽 기둥 */}
          <rect x="28" y="10" width="3" height="14" fill="#a0522d"/>
          <rect x="28.5" y="10.5" width="2" height="13" fill="#cd853f"/>
          <rect x="28" y="12" width="3" height="1" fill="#8b4513" opacity="0.3"/>
          <rect x="28" y="16" width="3" height="1" fill="#8b4513" opacity="0.3"/>
          <rect x="28" y="20" width="3" height="1" fill="#8b4513" opacity="0.3"/>
          
          {/* 오른쪽 망루 */}
          <rect x="27.5" y="5" width="4" height="5" fill="#a0522d"/>
          <rect x="28" y="5.5" width="3" height="4" fill="#cd853f"/>
          <polygon points="29.5,3 27.5,5 31.5,5" fill="#8b4513"/>
          <rect x="28.5" y="7" width="2" height="1.5" fill="#ffe082"/>
          
          {/* 삼각형 지붕 */}
          <polygon points="16,2 5,6 27,6" fill="#8b4513"/>
          <polygon points="16,3 7,6 25,6" fill="#a0522d"/>
          
          {/* 성벽 (나무 통나무) */}
          <rect x="6" y="6" width="20" height="18" fill="#cd853f"/>
          <rect x="7" y="7" width="18" height="16" fill="#deb887"/>
          
          {/* 통나무 무늬 (가로선) */}
          <rect x="6" y="8" width="20" height="1" fill="#a0522d" opacity="0.25"/>
          <rect x="6" y="10" width="20" height="1" fill="#a0522d" opacity="0.25"/>
          <rect x="6" y="12" width="20" height="1" fill="#a0522d" opacity="0.25"/>
          <rect x="6" y="14" width="20" height="1" fill="#a0522d" opacity="0.25"/>
          <rect x="6" y="16" width="20" height="1" fill="#a0522d" opacity="0.25"/>
          <rect x="6" y="18" width="20" height="1" fill="#a0522d" opacity="0.25"/>
          <rect x="6" y="20" width="20" height="1" fill="#a0522d" opacity="0.25"/>
          <rect x="6" y="22" width="20" height="1" fill="#a0522d" opacity="0.25"/>
          
          {/* 통나무 세로 무늬 */}
          <rect x="9" y="7" width="1" height="16" fill="#a0522d" opacity="0.15"/>
          <rect x="13" y="7" width="1" height="16" fill="#a0522d" opacity="0.15"/>
          <rect x="16" y="7" width="1" height="16" fill="#a0522d" opacity="0.15"/>
          <rect x="19" y="7" width="1" height="16" fill="#a0522d" opacity="0.15"/>
          <rect x="23" y="7" width="1" height="16" fill="#a0522d" opacity="0.15"/>
          
          {/* 중앙 큰 문 (아치형) */}
          <rect x="11" y="15" width="10" height="9" fill="#6b4423"/>
          <rect x="12" y="16" width="8" height="8" fill="#8b6f47"/>
          <polygon points="16,15 12,17 20,17" fill="#6b4423"/>
          
          {/* 문 철판 장식 */}
          <rect x="13" y="17" width="6" height="1" fill="#4a4a4a" opacity="0.4"/>
          <rect x="13" y="19" width="6" height="1" fill="#4a4a4a" opacity="0.4"/>
          <rect x="13" y="21" width="6" height="1" fill="#4a4a4a" opacity="0.4"/>
          <circle cx="18" cy="20" r="0.6" fill="#8b8b8b"/>
          <circle cx="18" cy="20" r="0.3" fill="#a8a8a8"/>
          
          {/* 좌우 세로로 긴 창문 (십자가 모양) */}
          <rect x="8" y="9" width="2.5" height="6" fill="#ffe082"/>
          <rect x="9" y="9" width="0.6" height="6" fill="#cd853f" opacity="0.3"/>
          <rect x="8" y="11.5" width="2.5" height="0.6" fill="#cd853f" opacity="0.3"/>
          
          {/* 왼쪽 창문 아래 꽃 화분 */}
          <rect x="8.2" y="15" width="2" height="1.2" fill="#d2691e"/>
          <rect x="8.3" y="15.1" width="1.8" height="1" fill="#cd853f"/>
          <circle cx="8.5" cy="14.8" r="0.35" fill="#f472b6"/>
          <circle cx="9.2" cy="14.7" r="0.3" fill="#fbbf24"/>
          <circle cx="10" cy="14.8" r="0.35" fill="#f87171"/>
          
          <rect x="21.5" y="9" width="2.5" height="6" fill="#ffe082"/>
          <rect x="22.4" y="9" width="0.6" height="6" fill="#cd853f" opacity="0.3"/>
          <rect x="21.5" y="11.5" width="2.5" height="0.6" fill="#cd853f" opacity="0.3"/>
          
          {/* 오른쪽 창문 아래 꽃 화분 */}
          <rect x="21.8" y="15" width="2" height="1.2" fill="#d2691e"/>
          <rect x="21.9" y="15.1" width="1.8" height="1" fill="#cd853f"/>
          <circle cx="22" cy="14.8" r="0.35" fill="#fbbf24"/>
          <circle cx="22.8" cy="14.7" r="0.3" fill="#f472b6"/>
          <circle cx="23.5" cy="14.8" r="0.35" fill="#fbbf24"/>
          
          {/* 성벽 꼭대기 (battlements) */}
          <rect x="6" y="5" width="2" height="2" fill="#cd853f"/>
          <rect x="10" y="5" width="2" height="2" fill="#cd853f"/>
          <rect x="14" y="5" width="4" height="2" fill="#cd853f"/>
          <rect x="20" y="5" width="2" height="2" fill="#cd853f"/>
          <rect x="24" y="5" width="2" height="2" fill="#cd853f"/>
          
          {/* 바닥 (나무 판자) */}
          <rect x="1" y="23" width="30" height="1" fill="#a0522d"/>
          
          {/* 하단 왼쪽 큰 꽃덤불 (기둥까지 확장) */}
          <ellipse cx="4" cy="24" rx="4.5" ry="2.5" fill="#22c55e" opacity="0.9"/>
          <circle cx="2" cy="23" r="0.8" fill="#f472b6"/>
          <circle cx="3.5" cy="23" r="0.7" fill="#fbbf24"/>
          <circle cx="5" cy="23" r="0.8" fill="#f87171"/>
          <circle cx="6" cy="23.5" r="0.7" fill="#fbbf24"/>
          <circle cx="7" cy="23.5" r="0.6" fill="#f472b6"/>
          <circle cx="4" cy="24" r="0.8" fill="#fbbf24"/>
          
          {/* 하단 오른쪽 큰 꽃덤불 (기둥까지 확장) */}
          <ellipse cx="28" cy="24" rx="4.5" ry="2.5" fill="#22c55e" opacity="0.9"/>
          <circle cx="30" cy="23" r="0.8" fill="#fbbf24"/>
          <circle cx="28.5" cy="23" r="0.7" fill="#f472b6"/>
          <circle cx="27" cy="23" r="0.8" fill="#fbbf24"/>
          <circle cx="25" cy="23.5" r="0.7" fill="#f87171"/>
          <circle cx="26" cy="23.5" r="0.6" fill="#fbbf24"/>
          <circle cx="28" cy="24" r="0.8" fill="#f472b6"/>
        </svg>
        
      </div>
    </>
  );
};

export default Mansion;

