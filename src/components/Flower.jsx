// 꽃 SVG 컴포넌트
const FlowerSprite = () => (
  <svg 
    width="32" 
    height="32" 
    viewBox="0 0 16 16" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* 줄기 */}
    <rect x="7" y="9" width="1" height="4" fill="#228B22"/>
    {/* 꽃잎 (핑크) */}
    <rect x="6" y="7" width="1" height="1" fill="#FF69B4"/>
    <rect x="7" y="6" width="1" height="1" fill="#FF1493"/>
    <rect x="8" y="7" width="1" height="1" fill="#FF69B4"/>
    <rect x="7" y="7" width="1" height="1" fill="#FFB6C1"/>
    {/* 꽃 중심 */}
    <rect x="7" y="7" width="1" height="1" fill="#FFD700"/>
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
    <rect x="7" y="9" width="1" height="4" fill="#228B22"/>
    <rect x="6" y="7" width="1" height="1" fill="#FF69B4"/>
    <rect x="7" y="6" width="1" height="1" fill="#FF1493"/>
    <rect x="8" y="7" width="1" height="1" fill="#FF69B4"/>
    <rect x="7" y="7" width="1" height="1" fill="#FFB6C1"/>
    <rect x="7" y="7" width="1" height="1" fill="#FFD700"/>
  </svg>
);

const Flower = ({ x, y }) => {
  return (
    <div 
      className="absolute pointer-events-none"
      style={{ 
        left: x - 16, 
        top: y - 24,
        zIndex: 5,
      }}
    >
      <FlowerSprite />
    </div>
  );
};

export default Flower;

