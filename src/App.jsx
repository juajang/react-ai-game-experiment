import { useRef, useCallback, useState } from 'react';
import { Chicken, Chick, Juvenile, Egg, Feed, Field, GameInfo, StatusBar, Coop, ItemPanel } from './components';
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
    addFeed,
    addCoop,
    chickenCount,
    juvenileCount,
    chickCount,
    sleepingCount,
  } = useGameLoop(fieldSize);

  // 선택된 닭 ID
  const [selectedChickenId, setSelectedChickenId] = useState(null);
  // 선택된 아이템
  const [selectedItem, setSelectedItem] = useState('feed');
  
  // 선택된 닭 찾기
  const selectedChicken = chickens.find(c => c.id === selectedChickenId);
  const displayChicken = selectedChicken || chickens[0];

  const handleFieldClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (selectedItem === 'coop') {
      if (addCoop(x, y)) {
        // 성공하면 사료 모드로 돌아감
        setSelectedItem('feed');
      }
    } else {
      addFeed(x, y);
    }
  }, [addFeed, addCoop, selectedItem]);

  const handleChickenClick = useCallback((id) => {
    setSelectedChickenId(id);
  }, []);

  const handleSelectItem = useCallback((itemId) => {
    setSelectedItem(itemId || 'feed');
  }, []);

  // 성장 단계에 따른 컴포넌트 렌더링
  const renderChicken = (c) => {
    if (c.state === 'sleeping') return null;
    
    const isSelected = c.id === selectedChickenId || (!selectedChickenId && c === chickens[0]);
    
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

  // 커서 스타일
  const getCursor = () => {
    if (selectedItem === 'coop') return 'crosshair';
    return 'pointer';
  };

  return (
    <div 
      className="min-h-screen p-4"
      style={{
        backgroundColor: '#87ceeb',
        backgroundImage: 'linear-gradient(to bottom, #87ceeb 0%, #98d8ef 50%, #b8e4f0 100%)',
      }}
    >
      <div className="max-w-2xl mx-auto">
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
        
        {/* 메인 레이아웃 */}
        <div className="flex gap-4">
          {/* 좌측 아이템 패널 */}
          <ItemPanel 
            selectedItem={selectedItem}
            onSelectItem={handleSelectItem}
            coins={coins}
            coopCount={coops.length}
          />
          
          {/* 중앙 게임 영역 */}
          <div className="flex-1">
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
            />
            
            {/* 선택된 아이템 안내 */}
            <div 
              className="mt-2 p-2 rounded text-center"
              style={{
                backgroundColor: selectedItem === 'coop' ? '#fef3c7' : '#dcfce7',
                border: `3px solid ${selectedItem === 'coop' ? '#f59e0b' : '#22c55e'}`,
                color: selectedItem === 'coop' ? '#92400e' : '#166534',
                fontSize: '11px',
              }}
            >
              {selectedItem === 'coop' 
                ? '🏠 필드를 클릭해서 닭집을 배치하세요!' 
                : '🌾 필드를 클릭해서 벼를 놓으세요!'}
            </div>
            
            {/* 플레이 필드 */}
            <div className="mt-2" ref={fieldRef}>
              <Field 
                onClick={handleFieldClick} 
                placingCoop={selectedItem === 'coop'}
                cursor={getCursor()}
              >
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
                
                {/* 닭들 */}
                {chickens.map(c => renderChicken(c))}
              </Field>
            </div>
            
            {/* 게임 안내 */}
            <GameInfo feedCount={feeds.length} />
          </div>
        </div>
      </div>
    </div>
  );
}
