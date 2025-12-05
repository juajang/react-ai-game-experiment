// 귀여운 꽃 SVG 컴포넌트
const FlowerSprite = () => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 16 16" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* 줄기 */}
    <rect x="7" y="10" width="2" height="4" fill="#2E8B57"/>
    <rect x="6" y="11" width="1" height="1" fill="#3CB371"/>
    
    {/* 잎사귀 */}
    <rect x="5" y="11" width="2" height="1" fill="#32CD32"/>
    <rect x="4" y="12" width="1" height="1" fill="#32CD32"/>
    <rect x="9" y="12" width="2" height="1" fill="#32CD32"/>
    <rect x="10" y="13" width="1" height="1" fill="#32CD32"/>
    
    {/* 꽃잎 - 상단 */}
    <rect x="6" y="4" width="1" height="2" fill="#FFB6C1"/>
    <rect x="7" y="3" width="2" height="2" fill="#FF69B4"/>
    <rect x="9" y="4" width="1" height="2" fill="#FFB6C1"/>
    
    {/* 꽃잎 - 좌측 */}
    <rect x="4" y="6" width="2" height="1" fill="#FFB6C1"/>
    <rect x="3" y="7" width="2" height="2" fill="#FF69B4"/>
    <rect x="4" y="9" width="2" height="1" fill="#FFB6C1"/>
    
    {/* 꽃잎 - 우측 */}
    <rect x="10" y="6" width="2" height="1" fill="#FFB6C1"/>
    <rect x="11" y="7" width="2" height="2" fill="#FF69B4"/>
    <rect x="10" y="9" width="2" height="1" fill="#FFB6C1"/>
    
    {/* 꽃잎 - 하단 */}
    <rect x="6" y="10" width="1" height="1" fill="#FFB6C1"/>
    <rect x="9" y="10" width="1" height="1" fill="#FFB6C1"/>
    
    {/* 꽃 중심 (큰 원) */}
    <rect x="6" y="6" width="4" height="4" fill="#FFE4B5"/>
    <rect x="7" y="5" width="2" height="1" fill="#FFE4B5"/>
    <rect x="5" y="7" width="1" height="2" fill="#FFE4B5"/>
    <rect x="10" y="7" width="1" height="2" fill="#FFE4B5"/>
    <rect x="7" y="10" width="2" height="1" fill="#FFE4B5"/>
    
    {/* 꽃 중심 하이라이트 */}
    <rect x="7" y="7" width="2" height="2" fill="#FFD700"/>
    <rect x="8" y="8" width="1" height="1" fill="#FFA500"/>
    
    {/* 반짝이 효과 */}
    <rect x="6" y="6" width="1" height="1" fill="#FFFFFF" fillOpacity="0.7"/>
  </svg>
);

// 작은 미리보기용 (export)
export const FlowerPreview = ({ size = 32 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 16 16" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* 줄기 */}
    <rect x="7" y="10" width="2" height="4" fill="#2E8B57"/>
    
    {/* 잎사귀 */}
    <rect x="5" y="11" width="2" height="1" fill="#32CD32"/>
    <rect x="9" y="12" width="2" height="1" fill="#32CD32"/>
    
    {/* 꽃잎 */}
    <rect x="7" y="3" width="2" height="2" fill="#FF69B4"/>
    <rect x="3" y="7" width="2" height="2" fill="#FF69B4"/>
    <rect x="11" y="7" width="2" height="2" fill="#FF69B4"/>
    
    {/* 꽃 중심 */}
    <rect x="6" y="6" width="4" height="4" fill="#FFE4B5"/>
    <rect x="7" y="7" width="2" height="2" fill="#FFD700"/>
    <rect x="8" y="8" width="1" height="1" fill="#FFA500"/>
    
    {/* 반짝이 */}
    <rect x="6" y="6" width="1" height="1" fill="#FFFFFF" fillOpacity="0.7"/>
  </svg>
);

const Flower = ({ x, y }) => {
  return (
    <div 
      className="absolute pointer-events-none"
      style={{ 
        left: x - 12, 
        top: y - 18,
        zIndex: 5,
      }}
    >
      <FlowerSprite />
    </div>
  );
};

export default Flower;

