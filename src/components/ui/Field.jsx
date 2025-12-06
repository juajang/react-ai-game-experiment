import { GAME_CONFIG } from '../../constants/gameConfig';

// 도트 스타일 잔디 SVG 컴포넌트
const GrassTile = ({ x, y, variant = 0 }) => {
  const variants = [
    // 잔디 변형 1 - 기본
    <>
      <rect x="2" y="12" width="2" height="2" fill="#4ade80" />
      <rect x="4" y="10" width="2" height="4" fill="#22c55e" />
      <rect x="6" y="11" width="2" height="3" fill="#4ade80" />
    </>,
    // 잔디 변형 2 - 짧은
    <>
      <rect x="3" y="12" width="2" height="2" fill="#22c55e" />
      <rect x="5" y="11" width="2" height="3" fill="#4ade80" />
    </>,
    // 잔디 변형 3 - 덤불
    <>
      <rect x="2" y="11" width="2" height="3" fill="#22c55e" />
      <rect x="4" y="10" width="2" height="4" fill="#16a34a" />
      <rect x="6" y="11" width="2" height="3" fill="#22c55e" />
      <rect x="8" y="12" width="2" height="2" fill="#4ade80" />
    </>,
  ];

  return (
    <svg 
      width="32" 
      height="32" 
      viewBox="0 0 16 16" 
      xmlns="http://www.w3.org/2000/svg"
      className="absolute opacity-60"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {variants[variant % variants.length]}
    </svg>
  );
};

// 작은 돌 SVG
const SmallRock = ({ x, y }) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 16 16" 
    xmlns="http://www.w3.org/2000/svg"
    className="absolute opacity-40"
    style={{ left: `${x}%`, top: `${y}%` }}
  >
    <rect x="5" y="10" width="4" height="3" fill="#9ca3af" />
    <rect x="6" y="9" width="2" height="1" fill="#d1d5db" />
  </svg>
);

const Field = ({ children, onClick, placingCoop, cursor }) => {
  const grassCount = GAME_CONFIG.FIELD.GRASS_COUNT;

  // 잔디와 돌 위치 생성 (고정된 시드로 일관된 배치)
  const decorations = [...Array(grassCount)].map((_, i) => ({
    x: (i * 37 + 5) % 95,
    y: (i * 23 + 10) % 85,
    variant: i % 3,
    type: i % 5 === 0 ? 'rock' : 'grass',
  }));

  return (
    <div 
      id="game-field"
      className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg"
      onClick={onClick}
      style={{
        cursor: cursor || (placingCoop ? 'crosshair' : 'pointer'),
        backgroundColor: '#7cba5f',
        backgroundImage: `
          linear-gradient(to bottom, #8bc970 0%, #6aaa4f 50%, #5a9a3f 100%)
        `,
        border: '4px solid #5d4037',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)',
        imageRendering: 'pixelated',
      }}
    >
      {/* 땅 패턴 - 도트 스타일 */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 8px,
              rgba(0,0,0,0.1) 8px,
              rgba(0,0,0,0.1) 16px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 8px,
              rgba(0,0,0,0.1) 8px,
              rgba(0,0,0,0.1) 16px
            )
          `,
        }}
      />
      
      {/* 잔디와 돌 장식 */}
      {decorations.map((deco, i) => 
        deco.type === 'rock' ? (
          <SmallRock key={i} x={deco.x} y={deco.y} />
        ) : (
          <GrassTile key={i} x={deco.x} y={deco.y} variant={deco.variant} />
        )
      )}
      
      {children}
    </div>
  );
};

export default Field;

