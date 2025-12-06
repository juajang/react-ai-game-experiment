import { EGG_STATE } from '../../constants/gameConfig';

const Egg = ({ x, y, state, warmth }) => {
  // 상태에 따른 색상 변화
  const getEggColors = () => {
    switch (state) {
      case EGG_STATE.HATCHING:
        return {
          base: '#fffde7',      // 부화 직전 - 노란빛
          shade: '#fff9c4',
          crack: true,
        };
      case EGG_STATE.WARM:
        return {
          base: '#fff8e1',      // 따뜻함 - 살짝 노란빛
          shade: '#ffecb3',
          crack: false,
        };
      default:
        return {
          base: '#ffffff',      // 신선 - 흰색
          shade: '#e6e6e6',
          crack: false,
        };
    }
  };

  const colors = getEggColors();
  const isShaking = state === EGG_STATE.HATCHING;

  return (
    <div 
      className="absolute flex items-center justify-center"
      style={{ 
        left: x - 24, 
        top: y - 24,
        zIndex: 4,
        animation: isShaking ? 'shake 0.3s infinite' : 'none',
      }}
    >
      <svg 
        width="48" 
        height="48" 
        viewBox="0 0 16 16" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Egg white base */}
        <rect x="6" y="4" width="4" height="1" fill={colors.base} />
        <rect x="5" y="5" width="6" height="5" fill={colors.base} />
        <rect x="6" y="10" width="4" height="1" fill={colors.base} />
        
        {/* Slight shading */}
        <rect x="5" y="7" width="1" height="2" fill={colors.shade} />
        <rect x="10" y="7" width="1" height="2" fill={colors.shade} />
        
        {/* 금이 간 효과 (부화 직전) */}
        {colors.crack && (
          <>
            <rect x="7" y="5" width="1" height="1" fill="#4a4a4a" />
            <rect x="8" y="6" width="1" height="1" fill="#4a4a4a" />
            <rect x="7" y="7" width="1" height="1" fill="#4a4a4a" />
          </>
        )}
      </svg>
      
      {/* 따뜻함 표시 */}
      {warmth > 50 && (
        <div 
          className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs"
          style={{ opacity: warmth / 100 }}
        >
          ♨️
        </div>
      )}
      
      {/* CSS 애니메이션 */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(-2px) rotate(-2deg); }
          75% { transform: translateX(2px) rotate(2deg); }
        }
      `}</style>
    </div>
  );
};

export default Egg;

