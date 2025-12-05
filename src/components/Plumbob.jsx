// 심즈 스타일 플럼밥 (초록 다이아몬드)
const Plumbob = ({ size = 16 }) => (
  <div 
    style={{ 
      width: size,
      height: size * 1.5,
      animation: 'plumbobFloat 1.5s ease-in-out infinite',
    }}
  >
    <svg 
      width={size} 
      height={size * 1.5} 
      viewBox="0 0 16 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 다이아몬드 상단 */}
      <polygon 
        points="8,0 16,12 8,16 0,12" 
        fill="#4ade80"
        style={{ filter: 'brightness(1.1)' }}
      />
      {/* 다이아몬드 하단 */}
      <polygon 
        points="8,16 16,12 8,24 0,12" 
        fill="#22c55e"
      />
      {/* 하이라이트 */}
      <polygon 
        points="8,0 12,8 8,10 4,8" 
        fill="#86efac"
        opacity="0.6"
      />
    </svg>
    
    <style>{`
      @keyframes plumbobFloat {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-4px) rotate(5deg); }
      }
    `}</style>
  </div>
);

export default Plumbob;
