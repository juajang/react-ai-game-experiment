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
    <div className="min-h-screen bg-amber-50 p-4">
      <div className="max-w-lg mx-auto">
        {/* 타이틀 */}
        <h1 className="text-2xl font-bold text-center text-amber-800 mb-4">
          🐔 닭 시뮬레이션 🌾
        </h1>
        
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
