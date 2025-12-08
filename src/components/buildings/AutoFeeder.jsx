import { memo, useState, useEffect } from 'react';

// 자동사료 배분기 - 금속과 나무로 만들어진 기계
const AutoFeeder = memo(({ x, y, onMouseDown, isActive = true }) => {
  const [isDispensing, setIsDispensing] = useState(false);
  
  // 사료 배분 애니메이션 효과
  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      setIsDispensing(true);
      setTimeout(() => setIsDispensing(false), 500);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isActive]);
  
  return (
    <div
      onMouseDown={onMouseDown}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        cursor: 'grab',
        zIndex: 12,
      }}
    >
      <svg width="70" height="70" viewBox="0 0 48 48">
        {/* 그림자 */}
        <ellipse cx="24" cy="44" rx="14" ry="3" fill="rgba(0,0,0,0.2)" />
        
        {/* 다리 (나무) */}
        <rect x="12" y="34" width="4" height="10" fill="#6d4c41" />
        <rect x="32" y="34" width="4" height="10" fill="#6d4c41" />
        
        {/* 사료통 본체 (금속) */}
        <path d="M10,18 L14,34 L34,34 L38,18 Z" fill="#78909c" />
        <path d="M10,18 L14,34 L34,34 L38,18 Z" fill="url(#metalGradient)" />
        
        {/* 금속 그라데이션 */}
        <defs>
          <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#90a4ae" />
            <stop offset="50%" stopColor="#b0bec5" />
            <stop offset="100%" stopColor="#78909c" />
          </linearGradient>
        </defs>
        
        {/* 사료통 테두리 */}
        <path d="M10,18 L38,18" stroke="#546e7a" strokeWidth="2" />
        <path d="M14,34 L34,34" stroke="#546e7a" strokeWidth="1" />
        
        {/* 뚜껑 (나무) */}
        <rect x="8" y="14" width="32" height="5" rx="2" fill="#8d6e63" />
        <rect x="8" y="14" width="32" height="2" fill="#a1887f" />
        
        {/* 손잡이 */}
        <rect x="22" y="10" width="4" height="5" rx="1" fill="#6d4c41" />
        
        {/* 사료 배출구 */}
        <rect x="20" y="32" width="8" height="4" fill="#455a64" />
        <rect x="21" y="33" width="6" height="2" fill="#37474f" />
        
        {/* 사료 (배분 중일 때) */}
        {isDispensing && (
          <>
            <circle cx="22" cy="38" r="1.5" fill="#ffd54f">
              <animate attributeName="cy" from="38" to="44" dur="0.5s" fill="freeze" />
              <animate attributeName="opacity" from="1" to="0" dur="0.5s" fill="freeze" />
            </circle>
            <circle cx="26" cy="38" r="1.5" fill="#ffca28">
              <animate attributeName="cy" from="38" to="46" dur="0.6s" fill="freeze" />
              <animate attributeName="opacity" from="1" to="0" dur="0.6s" fill="freeze" />
            </circle>
            <circle cx="24" cy="38" r="1.5" fill="#ffc107">
              <animate attributeName="cy" from="38" to="45" dur="0.55s" fill="freeze" />
              <animate attributeName="opacity" from="1" to="0" dur="0.55s" fill="freeze" />
            </circle>
          </>
        )}
        
        {/* 사료 내부 (보이는 부분) */}
        <ellipse cx="24" cy="20" rx="10" ry="3" fill="#ffca28" />
        <ellipse cx="24" cy="19" rx="8" ry="2" fill="#ffd54f" />
        
        {/* 기어 장식 */}
        <circle cx="10" cy="26" r="3" fill="#546e7a" />
        <circle cx="10" cy="26" r="1.5" fill="#37474f" />
        <circle cx="38" cy="26" r="3" fill="#546e7a" />
        <circle cx="38" cy="26" r="1.5" fill="#37474f" />
        
        {/* 작동 표시등 */}
        <circle cx="24" cy="26" r="2" fill={isActive ? '#4caf50' : '#9e9e9e'}>
          {isActive && (
            <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
          )}
        </circle>
      </svg>
      
      {/* 라벨 */}
      <div
        style={{
          position: 'absolute',
          bottom: '-5px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: isActive ? '#4caf50' : '#9e9e9e',
          color: 'white',
          border: '1px solid #2e7d32',
          borderRadius: '3px',
          padding: '1px 4px',
          fontSize: '7px',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
        }}
      >
        {isActive ? '🌾 작동중' : '⏸️ 정지'}
      </div>
    </div>
  );
});

// 미리보기용 컴포넌트
const AutoFeederPreview = memo(({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    {/* 다리 */}
    <rect x="12" y="34" width="4" height="10" fill="#6d4c41" />
    <rect x="32" y="34" width="4" height="10" fill="#6d4c41" />
    
    {/* 사료통 본체 */}
    <path d="M10,18 L14,34 L34,34 L38,18 Z" fill="#90a4ae" />
    
    {/* 뚜껑 */}
    <rect x="8" y="14" width="32" height="5" rx="2" fill="#8d6e63" />
    
    {/* 손잡이 */}
    <rect x="22" y="10" width="4" height="5" rx="1" fill="#6d4c41" />
    
    {/* 사료 내부 */}
    <ellipse cx="24" cy="19" rx="8" ry="2" fill="#ffd54f" />
    
    {/* 배출구 */}
    <rect x="20" y="32" width="8" height="4" fill="#455a64" />
    
    {/* 기어 */}
    <circle cx="10" cy="26" r="3" fill="#546e7a" />
    <circle cx="38" cy="26" r="3" fill="#546e7a" />
  </svg>
));

export { AutoFeeder, AutoFeederPreview };
export default AutoFeeder;

