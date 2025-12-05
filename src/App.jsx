import { useRef, useCallback, useState, useEffect } from 'react';
import { Chicken, Chick, Juvenile, DeadChicken, Egg, Feed, Flower, FlowerBush, Pond, Windmill, Field, GameInfo, StatusBar, Coop, ItemPanel } from './components';
import { useGameLoop } from './hooks/useGameLoop';
import { useFieldSize } from './hooks/useFieldSize';
import { GROWTH_STAGE, GAME_CONFIG, GAME_STATE, FARM_GRADE } from './constants/gameConfig';

// 게임 오버/클리어 오버레이
const GameOverlay = ({ type, farmGrade, deathCount, onRestart, onContinue }) => {
  const isGameOver = type === GAME_STATE.GAME_OVER;
  
  return (
    <div 
      className="absolute inset-0 flex items-center justify-center z-50"
      style={{
        backgroundColor: isGameOver ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 215, 0, 0.2)',
      }}
    >
      <div 
        className="text-center p-4 rounded-lg"
        style={{
          backgroundColor: isGameOver ? '#1f2937' : '#fef3c7',
          border: `4px solid ${isGameOver ? '#ef4444' : '#ffd700'}`,
          boxShadow: '4px 4px 0px rgba(0,0,0,0.3)',
          minWidth: '220px',
        }}
      >
        {/* 타이틀 */}
        <div 
          className="font-bold mb-2"
          style={{ color: isGameOver ? '#ef4444' : '#b8860b', fontSize: '16px' }}
        >
          {isGameOver ? '💀 게임 오버' : '✨ 축하합니다!'}
        </div>
        
        {/* 메시지 */}
        <div 
          className="mb-3"
          style={{ color: isGameOver ? '#9ca3af' : '#92400e', fontSize: '12px' }}
        >
          {isGameOver ? (
            <>
              <p>모든 닭이 사망했습니다...</p>
              <p className="mt-1">총 사망: {deathCount}마리</p>
            </>
          ) : (
            <>
              <p>🏆 황금 닭 농장을 달성했어요!</p>
              <p className="mt-1">10마리 이상의 닭을 키워냈어요.</p>
              <p className="mt-2" style={{ fontSize: '14px' }}>🐔🐔🐔🐔🐔🐔🐔🐔🐔🐔</p>
            </>
          )}
        </div>
        
        {/* 버튼들 */}
        <div className="flex gap-2 justify-center">
          {!isGameOver && (
            <button
              onClick={onContinue}
              className="px-3 py-1.5 rounded font-bold transition-transform hover:scale-105"
              style={{
                backgroundColor: '#22c55e',
                color: 'white',
                border: '2px solid #16a34a',
                fontSize: '11px',
              }}
            >
              ▶️ 계속
            </button>
          )}
          <button
            onClick={onRestart}
            className="px-3 py-1.5 rounded font-bold transition-transform hover:scale-105"
            style={{
              backgroundColor: isGameOver ? '#ef4444' : '#ffd700',
              color: isGameOver ? 'white' : '#92400e',
              border: `2px solid ${isGameOver ? '#b91c1c' : '#b8860b'}`,
              fontSize: '11px',
            }}
          >
            🔄 재시작
          </button>
        </div>
      </div>
    </div>
  );
};

// 농장 등급 뱃지
const FarmGradeBadge = ({ grade, totalChickens }) => {
  const getNextTarget = () => {
    if (grade.level === 1) return FARM_GRADE.CHICKEN_FARM.minChickens;
    if (grade.level === 2) return FARM_GRADE.GOLDEN_FARM.minChickens;
    return '∞';
  };
  
  return (
    <div 
      className="flex items-center gap-2 px-3 py-1 rounded-lg"
      style={{
        backgroundColor: grade.color,
        border: '3px solid rgba(0,0,0,0.2)',
        boxShadow: '2px 2px 0px rgba(0,0,0,0.2)',
      }}
    >
      <span className="font-bold" style={{ fontSize: '12px', color: '#5d4037' }}>{grade.name}</span>
      <span 
        className="text-sm px-2 py-0.5 rounded font-bold"
        style={{ backgroundColor: 'rgba(255,255,255,0.5)', color: '#5d4037', fontSize: '10px' }}
      >
        {totalChickens}/{getNextTarget()}
      </span>
    </div>
  );
};

export default function ChickenGame() {
  const fieldRef = useRef(null);
  const fieldSize = useFieldSize(fieldRef);
  const { 
    chickens, 
    eggs, 
    feeds, 
    flowers,
    flowerBushes,
    ponds,
    windmills,
    coops,
    coins,
    deathCount,
    deadChickens,
    farmGrade,
    gameState,
    addFeed,
    addFlower,
    addFlowerBush,
    moveFlowerBush,
    addPond,
    movePond,
    addWindmill,
    moveWindmill,
    addCoop,
    moveCoop,
    restartGame,
    continueGame,
    chickenCount,
    juvenileCount,
    chickCount,
    totalChickenCount,
    flowerBushCount,
    windmillCount,
  } = useGameLoop(fieldSize);

  const [selectedChickenId, setSelectedChickenId] = useState(null);
  const [selectedItem, setSelectedItem] = useState('feed');
  
  // 이동 중인 건물 (coop, pond, flowerBush, windmill)
  const [movingBuilding, setMovingBuilding] = useState(null);
  
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
        } else if (movingBuilding.type === 'flowerBush') {
          moveFlowerBush(movingBuilding.id, movingBuilding.x, movingBuilding.y);
        } else if (movingBuilding.type === 'windmill') {
          moveWindmill(movingBuilding.id, movingBuilding.x, movingBuilding.y);
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
  }, [movingBuilding, moveCoop, movePond, moveFlowerBush, moveWindmill]);

  const handleFieldClick = useCallback((e) => {
    if (movingBuilding || gameState !== GAME_STATE.PLAYING) return;
    
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
    } else if (selectedItem === 'windmill') {
      if (addWindmill(x, y)) {
        setSelectedItem('feed');
      }
    } else if (selectedItem === 'flowerBush') {
      if (addFlowerBush(x, y)) {
        // 꽃덤불은 계속 배치 가능
      }
    } else if (selectedItem === 'flower') {
      addFlower(x, y);
    } else {
      addFeed(x, y);
    }
  }, [addFeed, addFlower, addFlowerBush, addPond, addWindmill, addCoop, selectedItem, movingBuilding, gameState]);

  const handleChickenClick = useCallback((id) => {
    if (movingBuilding) return;
    setSelectedChickenId(id);
  }, [movingBuilding]);

  const handleCoopMouseDown = useCallback((coopId) => {
    if (gameState !== GAME_STATE.PLAYING) return;
    const coop = coops.find(c => c.id === coopId);
    if (coop) {
      setMovingBuilding({ type: 'coop', id: coopId, x: coop.x, y: coop.y });
    }
  }, [coops, gameState]);

  const handlePondMouseDown = useCallback((pondId) => {
    if (gameState !== GAME_STATE.PLAYING) return;
    const pond = ponds.find(p => p.id === pondId);
    if (pond) {
      setMovingBuilding({ type: 'pond', id: pondId, x: pond.x, y: pond.y });
    }
  }, [ponds, gameState]);

  const handleFlowerBushMouseDown = useCallback((bushId) => {
    if (gameState !== GAME_STATE.PLAYING) return;
    const bush = flowerBushes.find(b => b.id === bushId);
    if (bush) {
      setMovingBuilding({ type: 'flowerBush', id: bushId, x: bush.x, y: bush.y });
    }
  }, [flowerBushes, gameState]);

  const handleWindmillMouseDown = useCallback((windmillId) => {
    if (gameState !== GAME_STATE.PLAYING) return;
    const windmill = windmills.find(w => w.id === windmillId);
    if (windmill) {
      setMovingBuilding({ type: 'windmill', id: windmillId, x: windmill.x, y: windmill.y });
    }
  }, [windmills, gameState]);

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
    if (selectedItem === 'coop' || selectedItem === 'pond' || selectedItem === 'windmill') return 'crosshair';
    if (selectedItem === 'flower' || selectedItem === 'flowerBush') return 'crosshair';
    return 'pointer';
  };

  const getGuideMessage = () => {
    if (movingBuilding) {
      const nameMap = { coop: '닭집', pond: '연못', flowerBush: '꽃덤불', windmill: '풍차' };
      return `📍 마우스를 놓아서 ${nameMap[movingBuilding.type]} 위치를 고정하세요!`;
    }
    if (selectedItem === 'coop') {
      return `🏠 필드를 클릭해서 닭집을 배치하세요! (💰${GAME_CONFIG.COOP.COST})`;
    }
    if (selectedItem === 'pond') {
      return `💧 필드를 클릭해서 연못을 배치하세요! (💰${GAME_CONFIG.POND.COST})`;
    }
    if (selectedItem === 'windmill') {
      return `🌀 필드를 클릭해서 풍차를 배치하세요! (💰${GAME_CONFIG.WINDMILL.COST}) ✨황금농장 전용`;
    }
    if (selectedItem === 'flowerBush') {
      return `🌸 필드를 클릭해서 꽃덤불을 심으세요! (💰${GAME_CONFIG.FLOWER_BUSH.COST})`;
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
    if (selectedItem === 'windmill') return { bg: '#fef9c3', border: '#eab308', text: '#854d0e' };
    if (selectedItem === 'flower' || selectedItem === 'flowerBush') return { bg: '#fce7f3', border: '#ec4899', text: '#9d174d' };
    return { bg: '#dcfce7', border: '#22c55e', text: '#166534' };
  };

  const guideColor = getGuideColor();

  return (
    <div 
      className="min-h-screen p-4 relative"
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
          <div className="flex items-center justify-center gap-4">
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
            <FarmGradeBadge grade={farmGrade} totalChickens={totalChickenCount} />
          </div>
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
            flowerBushCount={flowerBushCount}
            windmillCount={windmillCount}
            farmGrade={farmGrade}
          />
          
          {/* 중앙 게임 영역 */}
          <div className="flex-1 relative">
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
            <div className="mt-2 relative" ref={fieldRef}>
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
                    gradeLevel={farmGrade.level}
                    onMouseDown={() => handlePondMouseDown(pond.id)}
                  />
                ))}
                
                {/* 이동 중인 연못 */}
                {movingBuilding?.type === 'pond' && (
                  <Pond 
                    x={movingBuilding.x}
                    y={movingBuilding.y}
                    gradeLevel={farmGrade.level}
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
                    gradeLevel={farmGrade.level}
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
                    gradeLevel={farmGrade.level}
                    isSelected={true}
                  />
                )}
                
                {/* 풍차들 (이동 중이 아닌 것) */}
                {windmills.filter(wm => !(movingBuilding?.type === 'windmill' && movingBuilding?.id === wm.id)).map(windmill => (
                  <Windmill 
                    key={windmill.id}
                    x={windmill.x}
                    y={windmill.y}
                    onMouseDown={() => handleWindmillMouseDown(windmill.id)}
                  />
                ))}
                
                {/* 이동 중인 풍차 */}
                {movingBuilding?.type === 'windmill' && (
                  <Windmill 
                    x={movingBuilding.x}
                    y={movingBuilding.y}
                    isSelected={true}
                  />
                )}
                
                {/* 꽃덤불들 (이동 중이 아닌 것) */}
                {flowerBushes.filter(fb => !(movingBuilding?.type === 'flowerBush' && movingBuilding?.id === fb.id)).map(bush => (
                  <FlowerBush 
                    key={bush.id}
                    x={bush.x}
                    y={bush.y}
                    onMouseDown={() => handleFlowerBushMouseDown(bush.id)}
                  />
                ))}
                
                {/* 이동 중인 꽃덤불 */}
                {movingBuilding?.type === 'flowerBush' && (
                  <FlowerBush 
                    x={movingBuilding.x}
                    y={movingBuilding.y}
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
              
              {/* 게임 오버/클리어 오버레이 */}
              {gameState !== GAME_STATE.PLAYING && (
                <GameOverlay 
                  type={gameState}
                  farmGrade={farmGrade}
                  deathCount={deathCount}
                  onRestart={restartGame}
                  onContinue={continueGame}
                />
              )}
            </div>
            
            {/* 게임 안내 */}
            <GameInfo />
          </div>
        </div>
      </div>
    </div>
  );
}
