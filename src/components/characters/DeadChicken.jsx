import DeadChickenSprite from './DeadChickenSprite';

const DeadChicken = ({ x, y, deathTime }) => {
  // 사망 후 경과 시간에 따른 투명도
  const elapsed = Date.now() - deathTime;
  const opacity = Math.max(0, 1 - elapsed / 3000);
  
  // 떠오르는 애니메이션
  const floatY = Math.min(30, elapsed / 50);

  return (
    <div 
      className="absolute pointer-events-none"
      style={{ 
        left: x - 24, 
        top: y - 40 - floatY,
        opacity,
        transition: 'opacity 0.5s ease-out',
        zIndex: 8,
      }}
    >
      <DeadChickenSprite />
      
      {/* 사망 메시지 */}
      <div 
        className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap"
        style={{ 
          fontSize: '10px',
          color: '#ef4444',
          textShadow: '1px 1px 2px white',
          fontWeight: 'bold',
        }}
      >
        R.I.P 💔
      </div>
    </div>
  );
};

export default DeadChicken;


