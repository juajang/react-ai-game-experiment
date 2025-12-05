import { useRef, useCallback } from 'react';
import { Chicken, Chick, Juvenile, Egg, Feed, Field, GameInfo, StatusBar } from './components';
import { useGameLoop } from './hooks/useGameLoop';
import { useFieldSize } from './hooks/useFieldSize';
import { GROWTH_STAGE } from './constants/gameConfig';

export default function ChickenGame() {
  const fieldRef = useRef(null);
  const fieldSize = useFieldSize(fieldRef);
  const { 
    chicken, 
    chickens, 
    eggs, 
    feeds, 
    addFeed,
    chickenCount,
    juvenileCount,
    chickCount,
  } = useGameLoop(fieldSize);

  const handleFieldClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    addFeed(x, y);
  }, [addFeed]);

  // 성장 단계에 따른 컴포넌트 렌더링
  const renderChicken = (c) => {
    switch (c.stage) {
      case GROWTH_STAGE.CHICK:
        return (
          <Chick
            key={c.id}
            x={c.x}
            y={c.y}
            frame={c.frame}
            direction={c.direction}
            state={c.state}
            growthProgress={c.growthProgress}
          />
        );
      case GROWTH_STAGE.JUVENILE:
        return (
          <Juvenile
            key={c.id}
            x={c.x}
            y={c.y}
            frame={c.frame}
            direction={c.direction}
            state={c.state}
            growthProgress={c.growthProgress}
          />
        );
      default:
        return (
          <Chicken 
            key={c.id}
            x={c.x} 
            y={c.y} 
            frame={c.frame}
            direction={c.direction}
            state={c.state}
          />
        );
    }
  };

  return (
    <div 
      className="min-h-screen p-4"
      style={{
        backgroundColor: '#87ceeb',
        backgroundImage: 'linear-gradient(to bottom, #87ceeb 0%, #98d8ef 50%, #b8e4f0 100%)',
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
            className="font-bold"
            style={{ 
              color: '#5d4037',
              fontSize: '18px',
              textShadow: '2px 2px 0px #c4a574',
              letterSpacing: '3px',
            }}
          >
            🐔 닭 농장 시뮬레이션 🌾
          </h1>
        </div>
        
        {/* 상태바 */}
        <StatusBar 
          chicken={chicken} 
          chickenCount={chickenCount}
          juvenileCount={juvenileCount}
          chickCount={chickCount}
          eggCount={eggs.length}
        />
        
        {/* 플레이 필드 */}
        <div className="mt-4" ref={fieldRef}>
          <Field onClick={handleFieldClick}>
            {/* 사료들 */}
            {feeds.map(feed => (
              <Feed key={feed.id} x={feed.x} y={feed.y} />
            ))}
            
            {/* 알들 */}
            {eggs.map(egg => (
              <Egg 
                key={egg.id} 
                x={egg.x} 
                y={egg.y} 
                state={egg.state}
                warmth={egg.warmth}
              />
            ))}
            
            {/* 닭들 (모든 성장 단계) */}
            {chickens.map(c => renderChicken(c))}
          </Field>
        </div>
        
        {/* 게임 안내 */}
        <GameInfo feedCount={feeds.length} />
      </div>
    </div>
  );
}
