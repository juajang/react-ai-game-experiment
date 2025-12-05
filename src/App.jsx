import { useRef, useCallback, useState } from 'react';
import { Chicken, Chick, Juvenile, Egg, Feed, Field, GameInfo, StatusBar, Coop } from './components';
import { useGameLoop } from './hooks/useGameLoop';
import { useFieldSize } from './hooks/useFieldSize';
import { GROWTH_STAGE, GAME_CONFIG } from './constants/gameConfig';

export default function ChickenGame() {
  const fieldRef = useRef(null);
  const fieldSize = useFieldSize(fieldRef);
  const { 
    chickens, 
    eggs, 
    feeds, 
    coops,
    coins,
    placingCoop,
    addFeed,
    addCoop,
    togglePlacingCoop,
    chickenCount,
    juvenileCount,
    chickCount,
    sleepingCount,
  } = useGameLoop(fieldSize);

  // 선택된 닭 ID
  const [selectedId, setSelectedId] = useState(null);
  
  // 선택된 닭 찾기
  const selectedChicken = chickens.find(c => c.id === selectedId);
  
  // 선택된 닭이 없어졌으면 첫 번째 닭 선택
  const displayChicken = selectedChicken || chickens[0];

  const handleFieldClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (placingCoop) {
      addCoop(x, y);
    } else {
      addFeed(x, y);
    }
  }, [addFeed, addCoop, placingCoop]);

  const handleChickenClick = useCallback((id) => {
    setSelectedId(id);
  }, []);

  // 성장 단계에 따른 컴포넌트 렌더링
  const renderChicken = (c) => {
    // 잠자는 중이면 렌더링하지 않음 (닭집 안에 있음)
    if (c.state === 'sleeping') return null;
    
    const isSelected = c.id === selectedId || (!selectedId && c === chickens[0]);
    
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
            isSelected={isSelected}
            onClick={() => handleChickenClick(c.id)}
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
            isSelected={isSelected}
            onClick={() => handleChickenClick(c.id)}
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
            isSelected={isSelected}
            onClick={() => handleChickenClick(c.id)}
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
          selectedChicken={displayChicken} 
          chickenCount={chickenCount}
          juvenileCount={juvenileCount}
          chickCount={chickCount}
          eggCount={eggs.length}
          coopCount={coops.length}
          sleepingCount={sleepingCount}
          coins={coins}
          onBuyCoop={togglePlacingCoop}
          canBuyCoop={coins >= GAME_CONFIG.COOP.COST}
        />
        
        {/* 닭집 배치 모드 안내 */}
        {placingCoop && (
          <div 
            className="mt-2 p-2 rounded text-center"
            style={{
              backgroundColor: '#fef3c7',
              border: '3px solid #f59e0b',
              color: '#92400e',
              fontSize: '12px',
            }}
          >
            🏠 필드를 클릭해서 닭집을 배치하세요!
          </div>
        )}
        
        {/* 플레이 필드 */}
        <div className="mt-4" ref={fieldRef}>
          <Field onClick={handleFieldClick} placingCoop={placingCoop}>
            {/* 닭집들 */}
            {coops.map(coop => (
              <Coop 
                key={coop.id}
                x={coop.x}
                y={coop.y}
                occupants={chickens.filter(c => c.inCoopId === coop.id).length}
                capacity={coop.capacity}
              />
            ))}
            
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
