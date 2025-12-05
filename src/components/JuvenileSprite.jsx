const JuvenileSprite = ({ frame, direction }) => {
  // 프레임별 발 위치 (걷기 애니메이션)
  const getFootPositions = () => {
    switch (frame) {
      case 0: return { leftX: 6, rightX: 9 };
      case 1: return { leftX: 5, rightX: 10 };
      case 2: return { leftX: 6, rightX: 9 };
      default: return { leftX: 6, rightX: 9 };
    }
  };

  const getHeadOffset = () => frame === 2 ? 1 : 0;

  const feet = getFootPositions();
  const headOffset = getHeadOffset();

  return (
    <svg 
      width="52" 
      height="52" 
      viewBox="0 0 16 16" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: direction < 0 ? 'scaleX(-1)' : 'scaleX(1)' }}
    >
      {/* Tail - 조금 더 발달 */}
      <rect x="3" y={6 + headOffset} width="1" height="3" fill="#f3e17a" />
      
      {/* Body (병아리보다 크고, 닭보다 작음) */}
      <rect x="5" y={5 + headOffset} width="6" height="6" fill="#ffe866" />
      <rect x="4" y={6 + headOffset} width="8" height="4" fill="#ffe866" />
      
      {/* Wings (살짝 길어짐) */}
      <rect x="4" y={7 + headOffset} width="2" height="2" fill="#f7d94d" />
      <rect x="10" y={7 + headOffset} width="2" height="2" fill="#f7d94d" />
      
      {/* Eyes */}
      <rect x="6" y={6 + headOffset} width="1" height="1" fill="#000" />
      <rect x="9" y={6 + headOffset} width="1" height="1" fill="#000" />
      
      {/* Beak - 조금 길어짐 */}
      <rect x="7" y={7 + headOffset} width="2" height="1" fill="#ffb347" />
      {frame === 2 && (
        <rect x="7" y={8 + headOffset} width="2" height="1" fill="#ffb347" />
      )}
      
      {/* Comb (볏) - 약간 발달 */}
      <rect x="7" y={3 + headOffset} width="1" height="1" fill="#ff6666" />
      <rect x="8" y={3 + headOffset} width="1" height="1" fill="#ff6666" />
      
      {/* Feet */}
      <rect x={feet.leftX} y="11" width="1" height="1" fill="#ff9933" />
      <rect x={feet.rightX} y="11" width="1" height="1" fill="#ff9933" />
    </svg>
  );
};

export default JuvenileSprite;

