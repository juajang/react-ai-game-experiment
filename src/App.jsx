import { useRef, useCallback, useState, useEffect } from 'react';
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
    moveCoop,
    chickenCount,
    juvenileCount,
    chickCount,
  } = useGameLoop(fieldSize);

  const [selectedChickenId, setSelectedChickenId] = useState(null);
  const [selectedItem, setSelectedItem] = useState('feed');
  const [movingCoopId, setMovingCoopId] = useState(null);
  const [movingCoopPos, setMovingCoopPos] = useState(null);
  
  const selectedChicken = chickens.find(c => c.id === selectedChickenId);
  const displayChicken = selectedChicken || chickens[0];

  // 마우스 이동 추적 (닭집 이동 중)
  useEffect(() => {
    if (!movingCoopId || !fieldRef.current) return;

    const handleMouseMove = (e) => {
      const rect = fieldRef.current.getBoundingClientRect();
      const x = Math.max(40, Math.min(rect.width - 40, e.clientX - rect.left));
      const y = Math.max(60, Math.min(rect.height - 20, e.clientY - rect.top));
      setMovingCoopPos({ x, y });
    };

    const handleMouseUp = (e) => {
      if (movingCoopId && movingCoopPos) {
        moveCoop(movingCoopId, movingCoopPos.x, movingCoopPos.y);
        setMovingCoopId(null);
        setMovingCoopPos(null);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [movingCoopId, movingCoopPos, moveCoop]);

  const handleFieldClick = useCallback((e) => {
    // 이동 중이면 무시 (mouseup에서 처리)
    if (movingCoopId) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (selectedItem === 'coop') {
      if (addCoop(x, y)) {
        setSelectedItem('feed');
      }
    } else {
      addFeed(x, y);
    }
  }, [addFeed, addCoop, selectedItem, movingCoopId]);

  const handleChickenClick = useCallback((id) => {
    if (movingCoopId) return;
    setSelectedChickenId(id);
  }, [movingCoopId]);

  const handleCoopMouseDown = useCallback((coopId) => {
    const coop = coops.find(c => c.id === coopId);
    if (coop) {
      setMovingCoopId(coopId);
      setMovingCoopPos({ x: coop.x, y: coop.y });
    }
  }, [coops]);

  const handleSelectItem = useCallback((itemId) => {
    if (movingCoopId) return;
    setSelectedItem(itemId || 'feed');
  }, [movingCoopId]);

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

  const getCursor = () => {
    if (movingCoopId) return 'grabbing';
    if (selectedItem === 'coop') return 'crosshair';
    return 'pointer';
  };

  const getGuideMessage = () => {
    if (movingCoopId) {
      return '🏠 마우스를 놓아서 닭집 위치를 고정하세요!';
    }
    if (selectedItem === 'coop') {
      return '🏠 필드를 클릭해서 닭집을 배치하세요!';
    }
    return '🌾 필드를 클릭해서 벼를 놓으세요!';
  };

  const getGuideColor = () => {
    if (movingCoopId) return { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' };
    if (selectedItem === 'coop') return { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' };
    return { bg: '#dcfce7', border: '#22c55e', text: '#166534' };
  };

  const guideColor = getGuideColor();

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
              coins={coins}
            />
            
            {/* 안내 메시지 */}
            <div 
              className="mt-2 p-2 rounded text-center"
              style={{
                backgroundColor: guideColor.bg,
                border: `3px solid ${guideColor.border}`,
                color: guideColor.text,
                fontSize: '11px',
              }}
            >
              {getGuideMessage()}
            </div>
            
            {/* 플레이 필드 */}
            <div className="mt-2" ref={fieldRef}>
              <Field 
                onClick={handleFieldClick} 
                cursor={getCursor()}
              >
                {/* 닭집들 (이동 중이 아닌 것) */}
                {coops.filter(coop => coop.id !== movingCoopId).map(coop => (
                  <Coop 
                    key={coop.id}
                    x={coop.x}
                    y={coop.y}
                    occupants={chickens.filter(c => c.inCoopId === coop.id).length}
                    capacity={coop.capacity}
                    onMouseDown={() => handleCoopMouseDown(coop.id)}
                  />
                ))}
                
                {/* 이동 중인 닭집 */}
                {movingCoopId && movingCoopPos && (
                  <Coop 
                    x={movingCoopPos.x}
                    y={movingCoopPos.y}
                    occupants={chickens.filter(c => c.inCoopId === movingCoopId).length}
                    capacity={coops.find(c => c.id === movingCoopId)?.capacity}
                    isSelected={true}
                  />
                )}
                
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
