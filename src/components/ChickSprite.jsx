const ChickSprite = ({ frame, direction, isHeld }) => {
  // 프레임별 발 위치 (걷기 애니메이션)
  const getFootPositions = () => {
    if (isHeld) {
      const wiggle = Math.floor(Date.now() / 100) % 2;
      return wiggle === 0 
        ? { leftX: 5, rightX: 10, leftY: 10, rightY: 11, wingUp: true }
        : { leftX: 6, rightX: 9, leftY: 11, rightY: 10, wingUp: false };
    }
    switch (frame) {
      case 0: return { leftX: 6, rightX: 9, leftY: 11, rightY: 11 };
      case 1: return { leftX: 5, rightX: 10, leftY: 11, rightY: 11 };
      case 2: return { leftX: 6, rightX: 9, leftY: 11, rightY: 11 };
      default: return { leftX: 6, rightX: 9, leftY: 11, rightY: 11 };
    }
  };

  const getHeadOffset = () => frame === 2 ? 1 : 0;

  const feet = getFootPositions();
  const headOffset = getHeadOffset();

  return (
    <svg 
      width="42" 
      height="42" 
      viewBox="0 0 16 16" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: direction < 0 ? 'scaleX(-1)' : 'scaleX(1)', pointerEvents: 'none' }}
    >
      {/* Tail */}
      <rect x="3" y={7 + headOffset} width="1" height="2" fill="#f3e17a" />
      
      {/* Body */}
      <rect x="5" y={5 + headOffset} width="6" height="6" fill="#ffe866" />
      <rect x="4" y={6 + headOffset} width="8" height="4" fill="#ffe866" />
      
      {/* Wings - 들렸을 때 날개 퍼덕임 */}
      {isHeld && feet.wingUp ? (
        <>
          <rect x="3" y={6 + headOffset} width="2" height="2" fill="#f7d94d" />
          <rect x="11" y={6 + headOffset} width="2" height="2" fill="#f7d94d" />
        </>
      ) : (
        <>
          <rect x="4" y={7 + headOffset} width="2" height="2" fill="#f7d94d" />
          <rect x="10" y={7 + headOffset} width="2" height="2" fill="#f7d94d" />
        </>
      )}
      
      {/* Eyes - 들렸을 때 놀란 눈 */}
      {isHeld ? (
        <>
          <rect x="6" y={5 + headOffset} width="1" height="1" fill="#000" />
          <rect x="9" y={5 + headOffset} width="1" height="1" fill="#000" />
          <rect x="6" y={6 + headOffset} width="1" height="1" fill="#fff" fillOpacity="0.4" />
          <rect x="9" y={6 + headOffset} width="1" height="1" fill="#fff" fillOpacity="0.4" />
        </>
      ) : (
        <>
          <rect x="6" y={6 + headOffset} width="1" height="1" fill="#000" />
          <rect x="9" y={6 + headOffset} width="1" height="1" fill="#000" />
        </>
      )}
      
      {/* Beak */}
      <rect x="7" y={7 + headOffset} width="2" height="1" fill="#ffb347" />
      {(frame === 2 || isHeld) && (
        <rect x="7" y={8 + headOffset} width="2" height="1" fill="#ffb347" />
      )}
      
      {/* Feet */}
      <rect x={feet.leftX} y={feet.leftY || 11} width="1" height="1" fill="#ff9933" />
      <rect x={feet.rightX} y={feet.rightY || 11} width="1" height="1" fill="#ff9933" />
    </svg>
  );
};

export default ChickSprite;
