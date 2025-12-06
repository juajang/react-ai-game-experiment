import { useRef, useCallback, useState, useEffect } from 'react';
import { Chicken, Chick, Juvenile, DeadChicken, Egg, Feed, Flower, FlowerBush, Pond, Windmill, StrawSpaceship, Poop, Field, GameInfo, Coop, ItemPanel, AdventurePanel, StatusBar } from './components';
import { useGameLoop } from './hooks/useGameLoop';
import { useFieldSize } from './hooks/useFieldSize';
import { GROWTH_STAGE, GAME_CONFIG, GAME_STATE, FARM_GRADE } from './constants/gameConfig';

// 삽 커서 (정확한 마우스 위치에 표시)
const ShovelCursor = ({ isActive, position }) => {
  if (!isActive || !position) return null;
  
  return (
    <div
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: position.x - 14,
        top: position.y - 14,
        transform: 'rotate(-30deg)',
      }}
    >
      <span style={{ fontSize: '28px', filter: 'drop-shadow(2px 2px 2px rgba(0,0,0,0.5))' }}>🪏</span>
    </div>
  );
};

// 모험 종료 오버레이
const AdventureEndOverlay = ({ result, onClose }) => {
  if (!result) return null;
  
  const { chickenName, moveCount, earnedExp, reason, leveledUp, newLevel } = result;
  
  let reasonText = '';
  let reasonEmoji = '🏠';
  switch (reason) {
    case 'tiredness':
      reasonText = '피로도가 100%에 도달했습니다!';
      reasonEmoji = '😫';
      break;
    case 'water':
      reasonText = '물이 다 떨어졌습니다!';
      reasonEmoji = '💧';
      break;
    case 'rice':
      reasonText = '벼가 다 떨어졌습니다!';
      reasonEmoji = '🌾';
      break;
    default:
      reasonText = '무사히 귀환했습니다!';
      reasonEmoji = '🏠';
  }
  
  return (
    <div 
      className="absolute inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
    >
      <div 
        className="text-center p-4 rounded-lg"
        style={{
          backgroundColor: '#1e3a5f',
          border: '4px solid #60a5fa',
          boxShadow: '4px 4px 0px rgba(0,0,0,0.3)',
          minWidth: '240px',
        }}
      >
        {/* 타이틀 */}
        <div 
          className="font-bold mb-2"
          style={{ color: '#60a5fa', fontSize: '16px' }}
        >
          🗺️ 모험 종료!
        </div>
        
        {/* 닭 이름 */}
        <div 
          className="mb-2 px-3 py-1 rounded inline-block"
          style={{ backgroundColor: '#374151', color: '#fbbf24', fontSize: '14px', fontWeight: 'bold' }}
        >
          🐔 {chickenName}
        </div>
        
        {/* 결과 */}
        <div 
          className="mb-3"
          style={{ color: '#e5e7eb', fontSize: '12px' }}
        >
          <p className="mb-2" style={{ color: '#9ca3af' }}>{reasonEmoji} {reasonText}</p>
          <div 
            className="flex justify-around py-2 px-3 rounded"
            style={{ backgroundColor: '#374151' }}
          >
            <div>
              <div style={{ color: '#60a5fa', fontSize: '10px' }}>이동</div>
              <div style={{ fontWeight: 'bold' }}>📍 {moveCount}칸</div>
            </div>
            <div>
              <div style={{ color: '#fbbf24', fontSize: '10px' }}>경험치</div>
              <div style={{ fontWeight: 'bold' }}>⭐ +{earnedExp}</div>
            </div>
          </div>
          
          {/* 레벨업 표시 */}
          {leveledUp && (
            <div 
              className="mt-2 py-1 px-2 rounded"
              style={{ backgroundColor: '#7c3aed', color: '#fff', fontSize: '12px' }}
            >
              🎉 레벨 업! Lv.{newLevel}
            </div>
          )}
        </div>
        
        {/* 확인 버튼 */}
        <button
          onClick={onClose}
          className="px-4 py-1.5 rounded font-bold transition-transform hover:scale-105"
          style={{
            backgroundColor: '#60a5fa',
            color: 'white',
            border: '2px solid #3b82f6',
            fontSize: '11px',
          }}
        >
          확인
        </button>
      </div>
    </div>
  );
};

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

// 간단한 상단 요약 바
const TopSummaryBar = ({ chickenCount, juvenileCount, chickCount, eggCount, deathCount }) => (
  <div 
    className="flex justify-around items-center px-3 py-1.5 rounded-lg"
    style={{
      backgroundColor: '#f5e6c8',
      border: '3px solid #8b7355',
      boxShadow: '2px 2px 0px #5d4037',
    }}
  >
    <div className="text-center">
      <div style={{ fontSize: '14px' }}>🥚</div>
      <div style={{ color: '#5d4037', fontSize: '10px', fontWeight: 'bold' }}>{eggCount || 0}</div>
    </div>
    <div className="text-center">
      <div style={{ fontSize: '14px' }}>🐥</div>
      <div style={{ color: '#5d4037', fontSize: '10px', fontWeight: 'bold' }}>{chickCount || 0}</div>
    </div>
    <div className="text-center">
      <div style={{ fontSize: '14px' }}>🐤</div>
      <div style={{ color: '#5d4037', fontSize: '10px', fontWeight: 'bold' }}>{juvenileCount || 0}</div>
    </div>
    <div className="text-center">
      <div style={{ fontSize: '14px' }}>🐔</div>
      <div style={{ color: '#5d4037', fontSize: '10px', fontWeight: 'bold' }}>{chickenCount || 0}</div>
    </div>
    <div className="text-center">
      <div style={{ fontSize: '14px' }}>💀</div>
      <div style={{ color: '#ef4444', fontSize: '10px', fontWeight: 'bold' }}>{deathCount || 0}</div>
    </div>
  </div>
);

export default function ChickenGame() {
  const fieldRef = useRef(null);
  const fieldSize = useFieldSize(fieldRef);
  
  // 모험 중인 닭 ID (useGameLoop보다 먼저 선언 - 게임 루프에서 상태 업데이트 건너뛰기용)
  const [adventuringChickenId, setAdventuringChickenId] = useState(null);
  
  const { 
    chickens,
    setChickens,
    eggs, 
    feeds, 
    flowers,
    flowerBushes,
    ponds,
    windmills,
    coops,
    poops,
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
    spaceships,
    addSpaceship,
    moveSpaceship,
    addCoop,
    moveCoop,
    removePoop,
    updateChickenName,
    moveChicken,
    restartGame,
    continueGame,
    chickenCount,
    juvenileCount,
    chickCount,
    totalChickenCount,
    flowerBushCount,
    windmillCount,
    poopCount,
  } = useGameLoop(fieldSize, adventuringChickenId);

  const [selectedChickenId, setSelectedChickenId] = useState(null);
  const [selectedItem, setSelectedItem] = useState('feed');
  
  // 이동 중인 건물 (coop, pond, flowerBush, windmill)
  const [movingBuilding, setMovingBuilding] = useState(null);
  
  // 들고 있는 닭
  const [heldChicken, setHeldChicken] = useState(null);
  
  // 플레이어 위치 (월드맵용)
  const [playerPosition, setPlayerPosition] = useState({ x: 15, y: 12 });
  
  // 탐험한 타일들 (fog of war)
  const [exploredTiles, setExploredTiles] = useState(() => {
    // 초기 탐험 영역: 플레이어 시작 위치 주변 (작은 범위)
    const initialTiles = new Set();
    const startX = 15;
    const startY = 12;
    const radius = 2; // 초기 시야 반경 축소
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= radius) {
          initialTiles.add(`${startX + dx},${startY + dy}`);
        }
      }
    }
    return initialTiles;
  });
  
  // 새로운 타일 탐험 핸들러
  const handleExplore = useCallback((newTiles) => {
    setExploredTiles(prev => {
      const updated = new Set(prev);
      newTiles.forEach(tile => updated.add(tile));
      return updated;
    });
  }, []);
  
  // 탐험 자원 상태 (물, 조사한 타일)
  const [adventureWater, setAdventureWater] = useState(30);
  const [investigatedTiles, setInvestigatedTiles] = useState(new Set());
  
  // 인벤토리 상태 (탐험에서 얻은 아이템)
  const [inventory, setInventory] = useState({ shovel: false });
  const [selectedTool, setSelectedTool] = useState(null);
  
  // 모험 중인 닭 상태
  const [adventuringChicken, setAdventuringChicken] = useState(null);
  
  // 모험 종료 결과 (오버레이 표시용)
  const [adventureEndResult, setAdventureEndResult] = useState(null);
  
  // 마우스 위치 추적 (삽 자석 효과용)
  const [mousePos, setMousePos] = useState(null);
  const [fieldRectState, setFieldRectState] = useState(null);
  
  // 마우스 위치 추적
  useEffect(() => {
    if (selectedTool !== 'shovel') {
      setMousePos(null);
      return;
    }
    
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (fieldRef.current) {
        setFieldRectState(fieldRef.current.getBoundingClientRect());
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [selectedTool]);
  
  // 플레이어 이동 핸들러
  const handlePlayerMove = useCallback((newPos) => {
    setPlayerPosition(newPos);
  }, []);
  
  // 물 소모 핸들러
  const handleConsumeWater = useCallback((amount) => {
    setAdventureWater(prev => Math.max(0, prev - amount));
  }, []);
  
  // 벼(사료) 소모 핸들러 - 기존 feeds에서 1개 제거
  const handleConsumeRice = useCallback((amount) => {
    // feeds 배열에서 amount개 제거 (게임 내 사료와 연동)
    // 여기서는 간단히 처리
  }, []);
  
  // 조사 완료 핸들러
  const handleInvestigate = useCallback((tileKey) => {
    setInvestigatedTiles(prev => {
      const updated = new Set(prev);
      updated.add(tileKey);
      return updated;
    });
  }, []);
  
  // 닭을 모험에 보내기 (레벨에 따라 자원 부여)
  const handleSendChickenToAdventure = useCallback((chickenId) => {
    const chicken = chickens.find(c => c.id === chickenId);
    if (!chicken || chicken.stage !== 'adult') return;
    
    // 피로도가 100이면 모험 불가
    if ((chicken.tiredness || 0) >= 100) return;
    
    // 닭의 실제 레벨 사용 (기본값 1)
    const level = chicken.level || 1;
    const water = 10 + level * 5; // 15~35
    const rice = 3 + level * 2;   // 5~13
    const maxDiceRolls = level; // 레벨 1: 1회, 레벨 5: 5회
    const tirednessPerRoll = Math.floor(100 / level); // 레벨 1: 100, 레벨 4: 25
    
    setAdventuringChicken({
      id: chicken.id,
      name: chicken.name || '모험 닭',
      water,
      rice,
      maxWater: water,
      maxRice: rice,
      level,
      tiredness: chicken.tiredness || 0, // 현재 피로도 (시작 피로도)
      tirednessPerRoll, // 주사위당 피로도 증가량
      maxDiceRolls, // 라운드당 최대 주사위 횟수
      remainingDiceRolls: maxDiceRolls, // 남은 주사위 횟수
      startPosition: { x: 15, y: 12 }, // 농장 위치
      earnedExp: 0, // 모험에서 획득한 경험치
      moveCount: 0, // 이동 횟수
    });
    
    // 게임 루프에서 이 닭 상태 업데이트 건너뛰기
    setAdventuringChickenId(chicken.id);
    
    // 플레이어 위치를 농장으로 설정
    setPlayerPosition({ x: 15, y: 12 });
  }, [chickens]);
  
  // 모험 닭 귀환
  const handleRecallChicken = useCallback((reason = 'manual') => {
    if (!adventuringChicken) return;
    
    const earnedExp = adventuringChicken.earnedExp || 0;
    const moveCount = adventuringChicken.moveCount || 0;
    const chickenName = adventuringChicken.name;
    const currentLevel = adventuringChicken.level || 1;
    
    let leveledUp = false;
    let newLevel = currentLevel;
    
    // 귀환 시 피로도와 경험치를 원래 닭에게 적용
    setChickens(prev => prev.map(c => {
      if (c.id === adventuringChicken.id) {
        const newExp = (c.experience || 0) + earnedExp;
        const expForNext = c.expForNextLevel || 100;
        const happiness = c.happiness || 0;
        
        // 레벨업 체크 (행복도 80% 이상일 때만)
        if (newExp >= expForNext && happiness >= 80) {
          leveledUp = true;
          newLevel = (c.level || 1) + 1;
          // 레벨업 필요 경험치 증가 (기본 100, 1.5배씩 증가)
          const newExpForNextLevel = Math.floor(100 * Math.pow(1.5, newLevel - 1));
          return { 
            ...c, 
            tiredness: adventuringChicken.tiredness,
            experience: newExp - expForNext,
            level: newLevel,
            expForNextLevel: newExpForNextLevel,
          };
        }
        
        // 경험치가 충분하지만 행복도가 낮으면 경험치만 누적 (레벨업 안함)
        return { 
          ...c, 
          tiredness: adventuringChicken.tiredness,
          experience: newExp,
        };
      }
      return c;
    }));
    
    // 모험 종료 결과 설정 (오버레이 표시)
    setAdventureEndResult({
      chickenName,
      moveCount,
      earnedExp,
      reason,
      leveledUp,
      newLevel,
    });
    
    setAdventuringChicken(null);
    setAdventuringChickenId(null); // 게임 루프에서 다시 상태 업데이트 시작
    setPlayerPosition({ x: 15, y: 12 }); // 농장으로 돌아가기
  }, [adventuringChicken]);
  
  // 모험 중 피로도 증가 (주사위 굴릴 때)
  const handleAddTiredness = useCallback((amount) => {
    setAdventuringChicken(prev => {
      if (!prev) return null;
      const newTiredness = Math.min(100, prev.tiredness + amount);
      return { ...prev, tiredness: newTiredness };
    });
  }, []);
  
  // 모험 닭 피로도가 변경되면 원래 닭에게 동기화
  useEffect(() => {
    if (adventuringChicken) {
      setChickens(prev => prev.map(c => 
        c.id === adventuringChicken.id 
          ? { ...c, tiredness: adventuringChicken.tiredness }
          : c
      ));
    }
  }, [adventuringChicken?.tiredness, adventuringChicken?.id]);
  
  // 모험 중 주사위 횟수 소모
  const handleUseDiceRoll = useCallback(() => {
    setAdventuringChicken(prev => {
      if (!prev) return null;
      return { ...prev, remainingDiceRolls: Math.max(0, prev.remainingDiceRolls - 1) };
    });
  }, []);
  
  // 주사위 횟수 리셋 (라운드 종료 시)
  const handleResetDiceRolls = useCallback(() => {
    setAdventuringChicken(prev => {
      if (!prev) return null;
      return { ...prev, remainingDiceRolls: prev.maxDiceRolls };
    });
  }, []);
  
  // 모험 중 경험치 획득 (이동할 때마다)
  const handleAddExp = useCallback((amount) => {
    setAdventuringChicken(prev => {
      if (!prev) return null;
      return { 
        ...prev, 
        earnedExp: (prev.earnedExp || 0) + amount,
        moveCount: (prev.moveCount || 0) + 1,
      };
    });
  }, []);
  
  // 모험 중 물 소모
  const handleConsumeAdventureWater = useCallback((amount) => {
    setAdventuringChicken(prev => {
      if (!prev) return null;
      const newWater = Math.max(0, prev.water - amount);
      return { ...prev, water: newWater };
    });
  }, []);
  
  // 모험 중 벼 소모
  const handleConsumeAdventureRice = useCallback((amount) => {
    setAdventuringChicken(prev => {
      if (!prev) return null;
      const newRice = Math.max(0, prev.rice - amount);
      return { ...prev, rice: newRice };
    });
  }, []);
  
  // 인벤토리에 아이템 추가
  const handleAddItem = useCallback((item, amount) => {
    if (item === 'shovel') {
      // 삽은 도구이므로 보유 여부만 체크 (true/false)
      setInventory(prev => ({ ...prev, shovel: true }));
    } else {
      setInventory(prev => ({ ...prev, [item]: (prev[item] || 0) + amount }));
    }
  }, []);
  
  // 인벤토리 아이템 소모 (건설 등에 사용)
  const handleConsumeInventoryItem = useCallback((item, amount) => {
    setInventory(prev => ({ ...prev, [item]: Math.max(0, (prev[item] || 0) - amount) }));
  }, []);
  
  // 도구 선택 핸들러
  const handleSelectTool = useCallback((tool) => {
    setSelectedTool(tool);
  }, []);
  
  // 삽으로 똥 제거 (삽은 소모되지 않음 - 도구)
  const handleShovelPoop = useCallback((poopId) => {
    if (selectedTool === 'shovel' && inventory.shovel) {
      removePoop(poopId);
    }
  }, [selectedTool, inventory.shovel, removePoop]);
  
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
        } else if (movingBuilding.type === 'spaceship') {
          moveSpaceship(movingBuilding.id, movingBuilding.x, movingBuilding.y);
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
  }, [movingBuilding, moveCoop, movePond, moveFlowerBush, moveWindmill, moveSpaceship]);

  // 닭 들기/놓기 처리
  useEffect(() => {
    if (!heldChicken || !fieldRef.current) return;

    const handleMouseMove = (e) => {
      const rect = fieldRef.current.getBoundingClientRect();
      const x = Math.max(30, Math.min(rect.width - 30, e.clientX - rect.left));
      const y = Math.max(30, Math.min(rect.height - 30, e.clientY - rect.top));
      setHeldChicken(prev => ({ ...prev, x, y }));
    };

    const handleMouseUp = () => {
      if (heldChicken) {
        moveChicken(heldChicken.id, heldChicken.x, heldChicken.y);
        setHeldChicken(null);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [heldChicken, moveChicken]);

  const handleFieldClick = useCallback((e) => {
    if (movingBuilding || heldChicken || gameState !== GAME_STATE.PLAYING) return;
    
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
    } else if (selectedItem === 'spaceship') {
      if (addSpaceship(x, y, inventory, handleConsumeInventoryItem)) {
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
  }, [addFeed, addFlower, addFlowerBush, addPond, addWindmill, addSpaceship, addCoop, selectedItem, movingBuilding, heldChicken, gameState, inventory, handleConsumeInventoryItem]);

  const handleChickenClick = useCallback((id) => {
    if (movingBuilding || heldChicken) return;
    setSelectedChickenId(id);
  }, [movingBuilding, heldChicken]);

  const handleChickenMouseDown = useCallback((chickenId, e) => {
    if (gameState !== GAME_STATE.PLAYING || movingBuilding) return;
    const chicken = chickens.find(c => c.id === chickenId);
    if (chicken && chicken.state !== 'sleeping') {
      setHeldChicken({ id: chickenId, x: chicken.x, y: chicken.y });
      setSelectedChickenId(chickenId);
    }
  }, [chickens, gameState, movingBuilding]);

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

  const handleSpaceshipMouseDown = useCallback((spaceshipId) => {
    if (gameState !== GAME_STATE.PLAYING) return;
    const spaceship = spaceships.find(s => s.id === spaceshipId);
    if (spaceship) {
      setMovingBuilding({ type: 'spaceship', id: spaceshipId, x: spaceship.x, y: spaceship.y });
    }
  }, [spaceships, gameState]);

  const handleSpaceshipClick = useCallback((spaceshipId) => {
    // 발사 애니메이션은 컴포넌트 내부에서 처리됨
    console.log('Spaceship launched!', spaceshipId);
  }, []);

  const handleSelectItem = useCallback((itemId) => {
    if (movingBuilding) return;
    setSelectedItem(itemId || 'feed');
  }, [movingBuilding]);
  
  const handleTileClick = useCallback((tile) => {
    // 맵 타일 클릭 시 플레이어 이동 (나중에 확장 가능)
    console.log('Tile clicked:', tile);
  }, []);

  const renderChicken = (c) => {
    if (c.state === 'sleeping') return null;
    
    const isSelected = c.id === selectedChickenId || (!selectedChickenId && c === chickens[0]);
    const isHeld = heldChicken?.id === c.id;
    
    // 들고 있는 닭은 heldChicken의 좌표 사용
    const chickenX = isHeld ? heldChicken.x : c.x;
    const chickenY = isHeld ? heldChicken.y : c.y;
    
    switch (c.stage) {
      case GROWTH_STAGE.CHICK:
        return (
          <Chick
            key={c.id}
            x={chickenX}
            y={chickenY}
            frame={c.frame}
            direction={c.direction}
            state={c.state}
            growthProgress={c.growthProgress}
            isSelected={isSelected}
            onClick={() => handleChickenClick(c.id)}
            onMouseDown={(e) => handleChickenMouseDown(c.id, e)}
            name={c.name}
            isHeld={isHeld}
          />
        );
      case GROWTH_STAGE.JUVENILE:
        return (
          <Juvenile
            key={c.id}
            x={chickenX}
            y={chickenY}
            frame={c.frame}
            direction={c.direction}
            state={c.state}
            growthProgress={c.growthProgress}
            isSelected={isSelected}
            onClick={() => handleChickenClick(c.id)}
            onMouseDown={(e) => handleChickenMouseDown(c.id, e)}
            name={c.name}
            isHeld={isHeld}
          />
        );
      default:
        return (
          <Chicken 
            key={c.id}
            x={chickenX} 
            y={chickenY} 
            frame={c.frame}
            direction={c.direction}
            state={c.state}
            isSelected={isSelected}
            onClick={() => handleChickenClick(c.id)}
            onMouseDown={(e) => handleChickenMouseDown(c.id, e)}
            name={c.name}
            isHeld={isHeld}
          />
        );
    }
  };

  const getCursor = () => {
    if (heldChicken) return 'grabbing';
    if (movingBuilding) return 'grabbing';
    if (selectedItem === 'coop' || selectedItem === 'pond' || selectedItem === 'windmill' || selectedItem === 'spaceship') return 'crosshair';
    if (selectedItem === 'flower' || selectedItem === 'flowerBush') return 'crosshair';
    return 'pointer';
  };

  const getGuideMessage = () => {
    if (heldChicken) {
      const chicken = chickens.find(c => c.id === heldChicken.id);
      return `✋ ${chicken?.name || '닭'}을(를) 들고 있어요!`;
    }
    if (movingBuilding) {
      const nameMap = { coop: '닭집', pond: '연못', flowerBush: '꽃덤불', windmill: '풍차', spaceship: '우주선' };
      return `📍 ${nameMap[movingBuilding.type]} 이동 중`;
    }
    if (selectedItem === 'coop') return `🏠 닭집 배치 (💰${GAME_CONFIG.COOP.COST})`;
    if (selectedItem === 'pond') return `💧 연못 배치 (💰${GAME_CONFIG.POND.COST})`;
    if (selectedItem === 'windmill') return `🌀 풍차 배치 (💰${GAME_CONFIG.WINDMILL.COST})`;
    if (selectedItem === 'spaceship') return `🚀 우주선 배치 (💰${GAME_CONFIG.SPACESHIP.COST})`;
    if (selectedItem === 'flowerBush') return `🌸 꽃덤불 (💰${GAME_CONFIG.FLOWER_BUSH.COST})`;
    if (selectedItem === 'flower') return `🌸 꽃 (💰${GAME_CONFIG.FLOWER.COST})`;
    return `🌾 벼 놓기 (💰${GAME_CONFIG.FEED.COST})`;
  };

  const getGuideColor = () => {
    if (heldChicken) return { bg: '#fee2e2', border: '#ef4444', text: '#991b1b' };
    if (movingBuilding) return { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' };
    if (selectedItem === 'coop') return { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' };
    if (selectedItem === 'pond') return { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' };
    if (selectedItem === 'windmill') return { bg: '#fef9c3', border: '#eab308', text: '#854d0e' };
    if (selectedItem === 'spaceship') return { bg: '#ede9fe', border: '#7c3aed', text: '#5b21b6' };
    if (selectedItem === 'flower' || selectedItem === 'flowerBush') return { bg: '#fce7f3', border: '#ec4899', text: '#9d174d' };
    return { bg: '#dcfce7', border: '#22c55e', text: '#166534' };
  };

  const guideColor = getGuideColor();

  return (
    <div 
      className="min-h-screen p-3 relative"
      style={{
        backgroundColor: '#f5f0e8',
        backgroundImage: `
          radial-gradient(circle, #c4b8a8 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
      }}
    >
      <div className="max-w-5xl mx-auto">
        {/* 타이틀 */}
        <div 
          className="text-center mb-3 py-2 px-4 rounded-lg"
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
              🐔 닭 농장 어드벤처 🗺️
            </h1>
            <FarmGradeBadge grade={farmGrade} totalChickens={totalChickenCount} />
          </div>
        </div>
        
        {/* 메인 레이아웃 - 3열 구조 */}
        <div className="flex gap-3 items-stretch">
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
            spaceshipCount={spaceships.length}
            farmGrade={farmGrade}
            inventory={inventory}
          />
          
          {/* 중앙 게임 영역 */}
          <div className="flex-1 relative">
            {/* 상단 상태바 - 닭 얼굴 + 스탯 */}
            <StatusBar 
              selectedChicken={displayChicken}
              chickenCount={chickenCount}
              juvenileCount={juvenileCount}
              chickCount={chickCount}
              eggCount={eggs.length}
              deathCount={deathCount}
              coins={coins}
              onNameChange={updateChickenName}
              onSendToAdventure={handleSendChickenToAdventure}
              adventuringChicken={adventuringChicken}
            />
            
            {/* 안내 메시지 */}
            <div 
              className="mt-2 p-1.5 rounded text-center"
              style={{
                backgroundColor: guideColor.bg,
                border: `2px solid ${guideColor.border}`,
                color: guideColor.text,
                fontSize: '10px',
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
                
                {/* 우주선들 (이동 불가, 클릭하면 발사) */}
                {spaceships.map(spaceship => (
                  <StrawSpaceship 
                    key={spaceship.id}
                    x={spaceship.x}
                    y={spaceship.y}
                    onClick={() => handleSpaceshipClick(spaceship.id)}
                    onRestart={restartGame}
                  />
                ))}
                
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
                
                {/* 똥들 */}
                {poops.map(poop => (
                  <Poop 
                    key={poop.id} 
                    x={poop.x} 
                    y={poop.y} 
                    age={poop.age}
                    onClick={() => removePoop(poop.id)}
                    isShovelActive={selectedTool === 'shovel' && inventory.shovel}
                    onShovelClean={() => handleShovelPoop(poop.id)}
                    mousePos={mousePos}
                    fieldRect={fieldRectState}
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
              
              {/* 모험 종료 오버레이 */}
              {adventureEndResult && (
                <AdventureEndOverlay 
                  result={adventureEndResult}
                  onClose={() => setAdventureEndResult(null)}
                />
              )}
            </div>
            
            {/* 게임 안내 */}
            <GameInfo />
          </div>
          
          {/* 우측 모험 패널 (맵 + 캐릭터 상세) */}
          <AdventurePanel 
            chickens={chickens}
            playerPosition={playerPosition}
            onPlayerMove={handlePlayerMove}
            onTileClick={handleTileClick}
            exploredTiles={exploredTiles}
            onExplore={handleExplore}
            water={adventuringChicken?.water || 0}
            rice={adventuringChicken?.rice || 0}
            onConsumeWater={handleConsumeAdventureWater}
            onConsumeRice={handleConsumeAdventureRice}
            investigatedTiles={investigatedTiles}
            onInvestigate={handleInvestigate}
            inventory={inventory}
            onAddItem={handleAddItem}
            selectedTool={selectedTool}
            onSelectTool={handleSelectTool}
            adventuringChicken={adventuringChicken}
            onRecallChicken={handleRecallChicken}
            onAddTiredness={handleAddTiredness}
            onUseDiceRoll={handleUseDiceRoll}
            onResetDiceRolls={handleResetDiceRolls}
            onAddExp={handleAddExp}
          />
        </div>
      </div>
      
      {/* 삽 커서 (삽 선택 시 마우스 따라다님) */}
      <ShovelCursor isActive={selectedTool === 'shovel' && inventory.shovel} position={mousePos} />
    </div>
  );
}
