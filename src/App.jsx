import { useRef, useCallback } from 'react';
import { Chicken, Feed, Field, GameInfo, StatusBar } from './components';
import { useGameLoop } from './hooks/useGameLoop';
import { useFieldSize } from './hooks/useFieldSize';

export default function ChickenGame() {
  const fieldRef = useRef(null);
  const fieldSize = useFieldSize(fieldRef);
  const { chicken, feeds, addFeed } = useGameLoop(fieldSize);

  // 사료 배치 핸들러
  const handleFieldClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    addFeed(x, y);
  }, [addFeed]);

  return (
    <div 
      className="min-h-screen p-4"
      style={{
        backgroundColor: '#87ceeb',
        backgroundImage: `
          linear-gradient(to bottom, #87ceeb 0%, #98d8ef 50%, #b8e4f0 100%)
        `,
      }}
    >
      <div className="max-w-lg mx-auto">
        {/* 타이틀 */}
        <div 
          className="text-center mb-4 py-3 px-4 rounded-lg"
          style={{
            backgroundColor: '#f5e6c8',
            border: '4px solid #8b7355',
            boxShadow: '4px 4px 0px #5d4037',
          }}
        >
          <h1 
            className="text-xl font-bold"
            style={{ 
              color: '#5d4037',
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '16px',
              textShadow: '2px 2px 0px #8b7355',
              letterSpacing: '2px',
            }}
          >
            🐔 닭 시뮬레이션 🌾
          </h1>
        </div>
        
        {/* 상태바 */}
        <StatusBar hunger={chicken.hunger} state={chicken.state} />
        
        {/* 플레이 필드 */}
        <div className="mt-4" ref={fieldRef}>
          <Field onClick={handleFieldClick}>
            {/* 사료들 */}
            {feeds.map(feed => (
              <Feed key={feed.id} x={feed.x} y={feed.y} />
            ))}
            
            {/* 닭 */}
            <Chicken 
              x={chicken.x} 
              y={chicken.y} 
              frame={chicken.frame}
              direction={chicken.direction}
              state={chicken.state}
            />
          </Field>
        </div>
        
        {/* 게임 안내 */}
        <GameInfo feedCount={feeds.length} />
      </div>
    </div>
  );
}
