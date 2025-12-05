import { useRef, useCallback, useState, useEffect } from 'react';
import { Chicken, Chick, Juvenile, DeadChicken, Egg, Feed, Flower, Pond, Field, GameInfo, StatusBar, Coop, ItemPanel } from './components';
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
    flowers,
    ponds,
    coops,
    coins,
    deathCount,
    deadChickens,
    addFeed,
    addFlower,
    addPond,
    movePond,
    addCoop,
    moveCoop,
    chickenCount,
    juvenileCount,
    chickCount,
  } = useGameLoop(fieldSize);

  const [selectedChickenId, setSelectedChickenId] = useState(null);
  const [selectedItem, setSelectedItem] = useState('feed');
  
  // 이동 중인 건물 (coop 또는 pond)
  const [movingBuilding, setMovingBuilding] = useState(null); // { type: 'coop' | 'pond', id, x, y }
  
  const selectedChicken = chickens.find(c => c.id === selectedChickenId);
  const displayChicken = selectedChicken || chickens[0];

  // 마우스 이동 추적 (건물 이동 중)
  useEffect(() => {
    if (!movingBuilding || !fieldRef.current) return;

    const handleMouseMove = (e) => {
      const rect = fieldRef.current.getBoundingClientRect();
      const x = Math.max(40, Math.min(rect.width - 40, e.clientX - rect.left));
      const y = Math.max(60, Math.min(rect.height - 20, e.clientY - rect.top));
      setMovingBuilding(prev => ({ ...prev, x, y }));
    };

    const handleMouseUp = () => {
      if (movingBuilding) {
        if (movingBuilding.type === 'coop') {
          moveCoop(movingBuilding.id, movingBuilding.x, movingBuilding.y);
        } else if (movingBuilding.type === 'pond') {
          movePond(movingBuilding.id, movingBuilding.x, movingBuilding.y);
        }
        setMovingBuilding(null);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [movingBuilding, moveCoop, movePond]);

  const handleFieldClick = useCallback((e) => {
    if (movingBuilding) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (selectedItem === 'coop') {
      if (addCoop(x, y)) {
        setSelectedItem('feed');
      }
    } else if (selectedItem === 'pond') {
      if (addPond(x, y)) {
        setSelectedItem('feed');
      }
    } else if (selectedItem === 'flower') {
      addFlower(x, y);
    } else {
      addFeed(x, y);
    }
  }, [addFeed, addFlower, addPond, addCoop, selectedItem, movingBuilding]);

  const handleChickenClick = useCallback((id) => {
    if (movingBuilding) return;
    setSelectedChickenId(id);
  }, [movingBuilding]);

  const handleCoopMouseDown = useCallback((coopId) => {
    const coop = coops.find(c => c.id === coopId);
    if (coop) {
      setMovingBuilding({ type: 'coop', id: coopId, x: coop.x, y: coop.y });
    }
  }, [coops]);

  const handlePondMouseDown = useCallback((pondId) => {
    const pond = ponds.find(p => p.id === pondId);
    if (pond) {
      setMovingBuilding({ type: 'pond', id: pondId, x: pond.x, y: pond.y });
    }
  }, [ponds]);

  const handleSelectItem = useCallback((itemId) => {
    if (movingBuilding) return;
    setSelectedItem(itemId || 'feed');
  }, [movingBuilding]);

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
    if (movingBuilding) return 'grabbing';
    if (selectedItem === 'coop' || selectedItem === 'pond') return 'crosshair';
    if (selectedItem === 'flower') return 'crosshair';
    return 'pointer';
  };

  const getGuideMessage = () => {
    if (movingBuilding) {
      const name = movingBuilding.type === 'coop' ? '닭집' : '연못';
      return `📍 마우스를 놓아서 ${name} 위치를 고정하세요!`;
    }
    if (selectedItem === 'coop') {
      return `🏠 필드를 클릭해서 닭집을 배치하세요! (💰${GAME_CONFIG.COOP.COST})`;
    }
    if (selectedItem === 'pond') {
      return `💧 필드를 클릭해서 연못을 배치하세요! (💰${GAME_CONFIG.POND.COST})`;
    }
    if (selectedItem === 'flower') {
      return `🌸 필드를 클릭해서 꽃을 심으세요! (💰${GAME_CONFIG.FLOWER.COST})`;
    }
    return `🌾 필드를 클릭해서 벼를 놓으세요! (💰${GAME_CONFIG.FEED.COST})`;
  };

  const getGuideColor = () => {
    if (movingBuilding) return { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' };
    if (selectedItem === 'coop') return { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' };
    if (selectedItem === 'pond') return { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' };
    if (selectedItem === 'flower') return { bg: '#fce7f3', border: '#ec4899', text: '#9d174d' };
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
            pondCount={ponds.length}
            flowerCount={flowers.length}
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
              deathCount={deathCount}
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
                {/* 연못들 (이동 중이 아닌 것) */}
                {ponds.filter(pond => !(movingBuilding?.type === 'pond' && movingBuilding?.id === pond.id)).map(pond => (
                  <Pond 
                    key={pond.id}
                    x={pond.x}
                    y={pond.y}
                    onMouseDown={() => handlePondMouseDown(pond.id)}
                  />
                ))}
                
                {/* 이동 중인 연못 */}
                {movingBuilding?.type === 'pond' && (
                  <Pond 
                    x={movingBuilding.x}
                    y={movingBuilding.y}
                    isSelected={true}
                  />
                )}
                
                {/* 닭집들 (이동 중이 아닌 것) */}
                {coops.filter(coop => !(movingBuilding?.type === 'coop' && movingBuilding?.id === coop.id)).map(coop => (
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
                {movingBuilding?.type === 'coop' && (
                  <Coop 
                    x={movingBuilding.x}
                    y={movingBuilding.y}
                    occupants={chickens.filter(c => c.inCoopId === movingBuilding.id).length}
                    capacity={coops.find(c => c.id === movingBuilding.id)?.capacity}
                    isSelected={true}
                  />
                )}
                
                {/* 꽃들 */}
                {flowers.map(flower => (
                  <Flower key={flower.id} x={flower.x} y={flower.y} />
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
                
                {/* 사망한 닭들 (페이드아웃) */}
                {deadChickens.map(c => (
                  <DeadChicken
                    key={`dead-${c.id}`}
                    x={c.x}
                    y={c.y}
                    deathTime={c.deathTime}
                  />
                ))}
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
