import { CHICKEN_COLORS, SPRITE_SIZE } from '../constants/sprites';

const ChickenSprite = ({ frame, direction, isHeld }) => {
  const colors = CHICKEN_COLORS;

  // 프레임별 발 위치 (걷기 애니메이션)
  const getFootPositions = () => {
    if (isHeld) {
      // 들려있을 때 - 발이 버둥거림
      const wiggle = Math.floor(Date.now() / 100) % 2;
      return wiggle === 0 
        ? { leftY: 10, rightY: 11, leftX: 5, rightX: 10, wingUp: true }
        : { leftY: 11, rightY: 10, leftX: 6, rightX: 9, wingUp: false };
    }
    switch (frame) {
      case 0: // 기본
        return { leftY: 11, rightY: 11, leftX: 6, rightX: 9 };
      case 1: // 걷기 - 왼발 앞으로
        return { leftY: 11, rightY: 11, leftX: 5, rightX: 10 };
      case 2: // 먹기 - 발은 그대로
        return { leftY: 11, rightY: 11, leftX: 6, rightX: 9 };
      default:
        return { leftY: 11, rightY: 11, leftX: 6, rightX: 9 };
    }
  };

  // 프레임별 머리/부리 위치 (먹기 애니메이션)
  const getHeadOffset = () => {
    return frame === 2 ? 1 : 0;
  };

  const feet = getFootPositions();
  const headOffset = getHeadOffset();

  return (
    <svg 
      width={SPRITE_SIZE.WIDTH} 
      height={SPRITE_SIZE.HEIGHT} 
      viewBox={SPRITE_SIZE.VIEWBOX}
      xmlns="http://www.w3.org/2000/svg"
      style={{ 
        transform: direction < 0 ? 'scaleX(-1)' : 'scaleX(1)',
        pointerEvents: 'none',
      }}
    >
      {/* Tail */}
      <rect x="3" y="6" width="1" height="2" fill={colors.TAIL} />
      
      {/* Body */}
      <rect x="5" y="4" width="6" height="7" fill={colors.BODY} />
      <rect x="4" y="6" width="8" height="4" fill={colors.BODY} />
      
      {/* Wing (shaded) - 들렸을 때 날개 퍼덕임 */}
      {isHeld && feet.wingUp ? (
        <>
          <rect x="3" y="6" width="2" height="2" fill={colors.BODY_SHADE} />
          <rect x="11" y="6" width="2" height="2" fill={colors.BODY_SHADE} />
        </>
      ) : (
        <>
          <rect x="4" y="7" width="2" height="2" fill={colors.BODY_SHADE} />
          <rect x="10" y="7" width="2" height="2" fill={colors.BODY_SHADE} />
        </>
      )}
      
      {/* Eyes - 들렸을 때 놀란 눈 (살짝 커진 눈) */}
      {isHeld ? (
        <>
          <rect x="6" y="4" width="1" height="1" fill={colors.EYE} />
          <rect x="9" y="4" width="1" height="1" fill={colors.EYE} />
          <rect x="6" y="5" width="1" height="1" fill="#fff" fillOpacity="0.5" />
          <rect x="9" y="5" width="1" height="1" fill="#fff" fillOpacity="0.5" />
        </>
      ) : (
        <>
          <rect x="6" y={5 + headOffset} width="1" height="1" fill={colors.EYE} />
          <rect x="9" y={5 + headOffset} width="1" height="1" fill={colors.EYE} />
        </>
      )}
      
      {/* Beak - 들렸을 때 입 벌림 */}
      <rect x="7" y={6 + headOffset} width="2" height="1" fill={colors.BEAK} />
      {(frame === 2 || isHeld) && (
        <rect x="7" y={7 + headOffset} width="2" height="1" fill={colors.BEAK} />
      )}
      
      {/* Comb (crest) */}
      <rect x="7" y={3 + headOffset} width="1" height="1" fill={colors.COMB} />
      <rect x="8" y={2 + headOffset} width="1" height="1" fill={colors.COMB} />
      <rect x="9" y={3 + headOffset} width="1" height="1" fill={colors.COMB} />
      
      {/* Feet - 걷기/버둥거림 애니메이션 */}
      <rect x={feet.leftX} y={feet.leftY} width="1" height="1" fill={colors.FEET} />
      <rect x={feet.rightX} y={feet.rightY} width="1" height="1" fill={colors.FEET} />
    </svg>
  );
};

export default ChickenSprite;
