import { CHICKEN_COLORS, SPRITE_SIZE } from '../constants/sprites';

// 사망한 닭 스프라이트 (천사 링 + 누워있는 상태)
const DeadChickenSprite = () => {
  const colors = CHICKEN_COLORS;

  return (
    <svg 
      width={SPRITE_SIZE.WIDTH} 
      height={SPRITE_SIZE.HEIGHT} 
      viewBox={SPRITE_SIZE.VIEWBOX}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Angel Ring (천사 링) */}
      <rect x="7" y="1" width="2" height="1" fill="#FFD700" />
      <rect x="6" y="2" width="4" height="1" fill="#FFD700" />
      
      {/* Tail (누운 상태) */}
      <rect x="3" y="7" width="1" height="2" fill={colors.TAIL} />
      
      {/* Body (누운 상태) */}
      <rect x="4" y="6" width="7" height="5" fill={colors.BODY} />
      <rect x="5" y="7" width="5" height="3" fill={colors.BODY} />
      
      {/* Wing (shaded) */}
      <rect x="5" y="8" width="2" height="2" fill={colors.BODY_SHADE} />
      <rect x="8" y="8" width="2" height="2" fill={colors.BODY_SHADE} />
      
      {/* Eyes (X 모양 - 감은 상태) */}
      <rect x="6" y="6" width="1" height="1" fill={colors.EYE} />
      <rect x="9" y="6" width="1" height="1" fill={colors.EYE} />
      
      {/* Beak (옆으로 누운 상태) */}
      <rect x="10" y="7" width="2" height="1" fill={colors.BEAK} />
      
      {/* Comb (crest) */}
      <rect x="9" y="5" width="1" height="1" fill={colors.COMB} />
      <rect x="10" y="4" width="1" height="1" fill={colors.COMB} />
      <rect x="11" y="5" width="1" height="1" fill={colors.COMB} />
      
      {/* Feet (아래로 떨어진 상태) */}
      <rect x="5" y="11" width="1" height="1" fill={colors.FEET} />
      <rect x="8" y="11" width="1" height="1" fill={colors.FEET} />
    </svg>
  );
};

export default DeadChickenSprite;

