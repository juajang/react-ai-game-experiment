import { GAME_CONFIG } from '../constants/gameConfig';

const Field = ({ children, onClick }) => {
  const grassCount = GAME_CONFIG.FIELD.GRASS_COUNT;

  return (
    <div 
      className="relative w-full h-80 bg-gradient-to-b from-green-300 to-green-400 rounded-lg overflow-hidden cursor-pointer border-4 border-amber-600 shadow-inner"
      onClick={onClick}
      style={{
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(34,197,94,0.3) 0%, transparent 20%),
          radial-gradient(circle at 80% 70%, rgba(34,197,94,0.3) 0%, transparent 20%),
          radial-gradient(circle at 50% 50%, rgba(34,197,94,0.2) 0%, transparent 30%)
        `
      }}
    >
      {/* 잔디 패턴 */}
      {[...Array(grassCount)].map((_, i) => (
        <div 
          key={i}
          className="absolute text-green-600 opacity-30"
          style={{ 
            left: `${(i * 37) % 100}%`, 
            top: `${(i * 23) % 100}%`,
            fontSize: '10px'
          }}
        >
          ⌇
        </div>
      ))}
      {children}
    </div>
  );
};

export default Field;

