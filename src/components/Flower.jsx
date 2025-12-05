// 간단한 꽃 SVG 컴포넌트
const FlowerSprite = () => (
  <svg 
    width="28" 
    height="28" 
    viewBox="0 0 16 16" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* 줄기 */}
    <rect x="7" y="9" width="2" height="6" fill="#2E8B57"/>
    
    {/* 잎사귀 - 왼쪽 */}
    <rect x="5" y="11" width="2" height="1" fill="#4CAF50"/>
    <rect x="4" y="12" width="2" height="1" fill="#4CAF50"/>
    
    {/* 잎사귀 - 오른쪽 */}
    <rect x="9" y="12" width="2" height="1" fill="#4CAF50"/>
    <rect x="10" y="13" width="2" height="1" fill="#4CAF50"/>
    
    {/* 꽃잎 4개 - 대각선 모양 */}
    {/* 좌상단 */}
    <rect x="4" y="3" width="2" height="2" fill="#F8BBD9"/>
    <rect x="5" y="4" width="2" height="2" fill="#FADDE1"/>
    
    {/* 우상단 */}
    <rect x="10" y="3" width="2" height="2" fill="#F8BBD9"/>
    <rect x="9" y="4" width="2" height="2" fill="#FADDE1"/>
    
    {/* 좌하단 */}
    <rect x="4" y="9" width="2" height="2" fill="#F8BBD9"/>
    <rect x="5" y="8" width="2" height="2" fill="#FADDE1"/>
    
    {/* 우하단 */}
    <rect x="10" y="9" width="2" height="2" fill="#F8BBD9"/>
    <rect x="9" y="8" width="2" height="2" fill="#FADDE1"/>
    
    {/* 꽃 중심 */}
    <rect x="6" y="5" width="4" height="4" fill="#FFD700"/>
    <rect x="7" y="6" width="2" height="2" fill="#FFA500"/>
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
    <rect x="7" y="9" width="2" height="6" fill="#2E8B57"/>
    
    {/* 잎사귀 */}
    <rect x="5" y="11" width="2" height="1" fill="#4CAF50"/>
    <rect x="9" y="12" width="2" height="1" fill="#4CAF50"/>
    
    {/* 꽃잎 - 대각선 모양 */}
    <rect x="4" y="3" width="2" height="2" fill="#F8BBD9"/>
    <rect x="10" y="3" width="2" height="2" fill="#F8BBD9"/>
    <rect x="4" y="9" width="2" height="2" fill="#F8BBD9"/>
    <rect x="10" y="9" width="2" height="2" fill="#F8BBD9"/>
    
    {/* 꽃 중심 */}
    <rect x="6" y="5" width="4" height="4" fill="#FFD700"/>
  </svg>
);

const Flower = ({ x, y }) => {
  return (
    <div 
      className="absolute pointer-events-none"
      style={{ 
        left: x - 14, 
        top: y - 20,
        zIndex: 5,
      }}
    >
      <FlowerSprite />
    </div>
  );
};

export default Flower;

