const ChickSprite = ({ frame, direction }) => {
  // 프레임별 발 위치 (걷기 애니메이션)
  const getFootPositions = () => {
    switch (frame) {
      case 0: // 기본
        return { leftX: 6, rightX: 9 };
      case 1: // 걷기
        return { leftX: 5, rightX: 10 };
      case 2: // 먹기
        return { leftX: 6, rightX: 9 };
      default:
        return { leftX: 6, rightX: 9 };
    }
  };

  // 먹기 애니메이션 - 머리 숙임
  const getHeadOffset = () => {
    return frame === 2 ? 1 : 0;
  };

  const feet = getFootPositions();
  const headOffset = getHeadOffset();

  return (
    <svg 
      width="40" 
      height="40" 
      viewBox="0 0 16 16" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ 
        transform: direction < 0 ? 'scaleX(-1)' : 'scaleX(1)',
      }}
    >
      {/* 병아리 몸통 - 노란색 */}
      <rect x="6" y={6 + headOffset} width="4" height="4" fill="#ffeb3b" />
      <rect x="5" y={7 + headOffset} width="6" height="2" fill="#ffeb3b" />
      
      {/* 날개 음영 */}
      <rect x="5" y={8 + headOffset} width="1" height="1" fill="#fdd835" />
      <rect x="10" y={8 + headOffset} width="1" height="1" fill="#fdd835" />
      
      {/* 눈 */}
      <rect x="6" y={7 + headOffset} width="1" height="1" fill="#000" />
      <rect x="9" y={7 + headOffset} width="1" height="1" fill="#000" />
      
      {/* 부리 */}
      <rect x="7" y={8 + headOffset} width="2" height="1" fill="#ff9800" />
      {frame === 2 && (
        <rect x="7" y={9 + headOffset} width="2" height="1" fill="#ff9800" />
      )}
      
      {/* 볏 (작은 볏) */}
      <rect x="7" y={5 + headOffset} width="2" height="1" fill="#ff7043" />
      
      {/* 발 */}
      <rect x={feet.leftX} y="11" width="1" height="1" fill="#ff9800" />
      <rect x={feet.rightX} y="11" width="1" height="1" fill="#ff9800" />
    </svg>
  );
};

export default ChickSprite;

