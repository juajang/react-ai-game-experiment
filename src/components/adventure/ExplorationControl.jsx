import { useState, useCallback } from 'react';

// 장소별 설명 텍스트
const TILE_DESCRIPTIONS = {
  GRASS: [
    "평화로운 초원이다. 바람이 풀을 쓸어간다.",
    "드넓은 초원에서 야생화가 피어있다.",
    "초원 위로 나비가 날아다닌다.",
  ],
  FOREST: [
    "울창한 숲이다. 나무 사이로 빛이 스며든다.",
    "숲에서 새소리가 들린다. 열매가 있을지도?",
    "고요한 숲... 무언가 숨어있는 느낌이다.",
  ],
  BEACH: [
    "파도 소리가 들리는 해변이다.",
    "모래사장에서 조개껍데기를 발견했다.",
    "해변가에 표류물이 떠밀려 왔다.",
  ],
  VILLAGE: [
    "작은 마을이다. 주민들이 분주하게 움직인다.",
    "마을 광장에서 상인이 물건을 팔고 있다.",
    "따뜻한 마을... 여관에서 쉴 수 있을 것 같다.",
  ],
  OUTPOST: [
    "낡은 전초기지다. 오래 전에 버려진 듯하다.",
    "전초기지에 쓸만한 물자가 남아있을지도 모른다.",
    "누군가 여기서 야영을 한 흔적이 있다.",
  ],
  FARM: [
    "우리 농장이다! 닭들이 반갑게 맞아준다.",
    "익숙한 농장... 마음이 편안해진다.",
  ],
  RESOURCE: [
    "자원을 발견했다! 유용한 것을 얻을 수 있다.",
    "반짝이는 무언가가 있다...",
  ],
  MOUNTAIN: [
    "험준한 산이다. 지나갈 수 없다.",
  ],
  WATER: [
    "깊은 바다다. 배 없이는 건널 수 없다.",
  ],
};

const TILE_NAMES = {
  WATER: '바다',
  GRASS: '초원',
  FOREST: '숲',
  MOUNTAIN: '산',
  VILLAGE: '마을',
  OUTPOST: '전초기지',
  FARM: '농장',
  PATH: '길',
  BEACH: '해변',
  RESOURCE: '자원',
};

// 시드 기반 설명 선택
const getDescription = (tileType, x, y) => {
  const descriptions = TILE_DESCRIPTIONS[tileType] || ["알 수 없는 지역이다."];
  const index = Math.abs((x * 13 + y * 7) % descriptions.length);
  return descriptions[index];
};

// 3D 주사위 컴포넌트
const Dice3D = ({ value, isRolling, size = 50 }) => {
  const dotPositions = {
    1: [[3, 3]],
    2: [[1, 1], [5, 5]],
    3: [[1, 1], [3, 3], [5, 5]],
    4: [[1, 1], [1, 5], [5, 1], [5, 5]],
    5: [[1, 1], [1, 5], [3, 3], [5, 1], [5, 5]],
    6: [[1, 1], [1, 3], [1, 5], [5, 1], [5, 3], [5, 5]],
  };
  
  const dots = dotPositions[value] || dotPositions[1];
  
  // 주사위 면 렌더링
  const renderFace = (faceValue, transform, bgColor = '#ffffff') => {
    const faceDots = dotPositions[faceValue] || [];
    return (
      <div
        style={{
          position: 'absolute',
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: bgColor,
          border: '2px solid #bdbdbd',
          borderRadius: '6px',
          transform: transform,
          backfaceVisibility: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'inset 2px 2px 4px rgba(255,255,255,0.5), inset -2px -2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <svg width={size - 8} height={size - 8} viewBox="0 0 7 7">
          {faceDots.map(([x, y], idx) => (
            <circle 
              key={idx} 
              cx={x + 0.5} 
              cy={y + 0.5} 
              r="0.55" 
              fill="#c62828"
            />
          ))}
        </svg>
      </div>
    );
  };

  const halfSize = size / 2;
  
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        perspective: '200px',
        perspectiveOrigin: 'center center',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          animation: isRolling ? 'dice3DRoll 0.15s ease-in-out infinite' : 'none',
          transition: isRolling ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        {/* 앞면 (현재 값) */}
        {renderFace(value, `translateZ(${halfSize}px)`, '#ffffff')}
        
        {/* 뒷면 */}
        {renderFace(7 - value, `rotateY(180deg) translateZ(${halfSize}px)`, '#f5f5f5')}
        
        {/* 오른쪽 */}
        {renderFace(value === 1 ? 3 : value === 6 ? 4 : (value % 6) + 1, `rotateY(90deg) translateZ(${halfSize}px)`, '#eeeeee')}
        
        {/* 왼쪽 */}
        {renderFace(value === 1 ? 4 : value === 6 ? 3 : 7 - ((value % 6) + 1), `rotateY(-90deg) translateZ(${halfSize}px)`, '#e0e0e0')}
        
        {/* 위 */}
        {renderFace(value === 1 ? 2 : value === 6 ? 5 : Math.max(1, (value + 2) % 7), `rotateX(90deg) translateZ(${halfSize}px)`, '#fafafa')}
        
        {/* 아래 */}
        {renderFace(value === 1 ? 5 : value === 6 ? 2 : 7 - Math.max(1, (value + 2) % 7), `rotateX(-90deg) translateZ(${halfSize}px)`, '#e8e8e8')}
      </div>
    </div>
  );
};

// 획득 가능한 아이템 목록
const LOOT_TABLE = {
  GRASS: [
    { item: null, chance: 0.7 },
    { item: 'shovel', chance: 0.15, name: '삽' },
    { item: 'water', chance: 0.15, amount: 5, name: '물' },
  ],
  FOREST: [
    { item: null, chance: 0.5 },
    { item: 'shovel', chance: 0.2, name: '삽' },
    { item: 'water', chance: 0.3, amount: 8, name: '물' },
  ],
  BEACH: [
    { item: null, chance: 0.6 },
    { item: 'shovel', chance: 0.25, name: '삽' },
    { item: 'water', chance: 0.15, amount: 3, name: '물' },
  ],
  VILLAGE: [
    { item: null, chance: 0.3 },
    { item: 'shovel', chance: 0.35, name: '삽' },
    { item: 'water', chance: 0.35, amount: 10, name: '물' },
  ],
  OUTPOST: [
    { item: null, chance: 0.4 },
    { item: 'shovel', chance: 0.4, name: '삽' },
    { item: 'water', chance: 0.2, amount: 5, name: '물' },
  ],
  RESOURCE: [
    { item: null, chance: 0.1 },
    { item: 'shovel', chance: 0.5, name: '삽' },
    { item: 'water', chance: 0.4, amount: 15, name: '물' },
  ],
};

// 아이템 획득 함수
const rollLoot = (tileType, x, y) => {
  const lootTable = LOOT_TABLE[tileType] || LOOT_TABLE.GRASS;
  const seed = Math.sin(x * 17 + y * 31) * 10000;
  const rand = (seed - Math.floor(seed) + Math.random()) / 2;
  
  let cumulative = 0;
  for (const loot of lootTable) {
    cumulative += loot.chance;
    if (rand < cumulative) {
      return loot.item ? loot : null;
    }
  }
  return null;
};

const ExplorationControl = ({
  playerPosition,
  onPlayerMove,
  water = 30,
  rice = 10,
  onConsumeWater,
  onConsumeRice,
  investigatedTiles = new Set(),
  onInvestigate,
  explorationLog = [],
  onAddLog,
  currentTileType = 'GRASS',
  currentPoi = null,
  canPass,
  fillHeight = false,
  inventory = {},
  onAddItem,
  selectedTool,
  onSelectTool,
}) => {
  const [diceResult, setDiceResult] = useState(1);
  const [remainingMoves, setRemainingMoves] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [message, setMessage] = useState("🎲 주사위를 클릭하여 탐험을 시작하세요!");
  
  // 현재 위치가 조사되었는지 체크
  const posKey = `${playerPosition.x},${playerPosition.y}`;
  const canInvestigate = !investigatedTiles.has(posKey);
  
  // 주사위 굴리기
  const rollDice = useCallback(() => {
    if (isRolling) return;
    if (remainingMoves > 0) {
      setMessage("⚠️ 이동을 먼저 완료하세요!");
      return;
    }
    
    setIsRolling(true);
    setMessage("🎲 굴리는 중...");
    
    let count = 0;
    const rollInterval = setInterval(() => {
      setDiceResult(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count >= 15) {
        clearInterval(rollInterval);
        const finalResult = Math.floor(Math.random() * 6) + 1;
        setDiceResult(finalResult);
        setRemainingMoves(finalResult);
        setIsRolling(false);
        setMessage(`🎲 ${finalResult}칸 이동 가능! 방향을 선택하세요.`);
      }
    }, 60);
  }, [remainingMoves, isRolling]);
  
  // 이동 처리
  const move = useCallback((direction) => {
    if (remainingMoves <= 0) {
      setMessage("⚠️ 먼저 주사위를 굴리세요!");
      return;
    }
    
    if (water <= 0) {
      setMessage("💧 물이 부족합니다! 이동할 수 없습니다.");
      return;
    }
    
    const dirMap = {
      up: { dx: 0, dy: -1 },
      down: { dx: 0, dy: 1 },
      left: { dx: -1, dy: 0 },
      right: { dx: 1, dy: 0 },
    };
    
    const { dx, dy } = dirMap[direction];
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;
    
    // 통과 가능 여부 체크
    const passCheck = canPass?.(newX, newY);
    if (!passCheck?.canPass) {
      setMessage(`🚫 ${passCheck?.reason || '이동할 수 없습니다!'}`);
      return;
    }
    
    // 이동 실행
    onPlayerMove?.({ x: newX, y: newY });
    onConsumeWater?.(1);
    
    const newRemaining = remainingMoves - 1;
    setRemainingMoves(newRemaining);
    
    if (newRemaining > 0) {
      setMessage(`📍 이동 완료! 남은 이동: ${newRemaining}칸`);
    } else {
      const newPosKey = `${newX},${newY}`;
      const isInvestigated = investigatedTiles.has(newPosKey);
      if (!isInvestigated) {
        setMessage("✅ 이동 완료! '조사'로 이 지역을 탐색하세요.");
      } else {
        setMessage("✅ 이동 완료! 주사위를 다시 굴리세요.");
      }
    }
  }, [remainingMoves, playerPosition, water, onPlayerMove, onConsumeWater, investigatedTiles, canPass]);
  
  // 조사하기
  const investigate = useCallback(() => {
    if (investigatedTiles.has(posKey)) {
      setMessage("ℹ️ 이미 조사한 지역입니다.");
      return;
    }
    
    if (rice <= 0) {
      setMessage("🌾 벼가 부족합니다! 조사할 수 없습니다.");
      return;
    }
    
    // 벼 소모 및 조사 완료 처리
    onConsumeRice?.(1);
    onInvestigate?.(posKey);
    
    // 현재 위치의 타일 정보
    const tileType = currentPoi?.type || currentTileType;
    const description = getDescription(tileType, playerPosition.x, playerPosition.y);
    const tileName = currentPoi?.name || TILE_NAMES[tileType] || tileType;
    
    // 아이템 획득 체크
    const loot = rollLoot(tileType, playerPosition.x, playerPosition.y);
    let lootMessage = '';
    if (loot) {
      if (loot.item === 'shovel') {
        // 삽은 도구이므로 이미 있으면 획득하지 않음
        if (!inventory.shovel) {
          onAddItem?.('shovel', 1);
          lootMessage = ' 🎁 삽을 발견했다!';
        }
      } else if (loot.item === 'water') {
        onAddItem?.('water', loot.amount);
        lootMessage = ` 💧 물 ${loot.amount}을(를) 발견했다!`;
      }
    }
    
    // 탐험 로그에 추가
    onAddLog?.({
      x: playerPosition.x,
      y: playerPosition.y,
      name: tileName,
      description: description + lootMessage,
      tileType,
    });
    
    setMessage(`🔍 ${description}${lootMessage}`);
  }, [posKey, rice, investigatedTiles, onConsumeRice, onInvestigate, currentPoi, currentTileType, playerPosition, onAddLog, onAddItem, inventory.shovel]);

  const canRoll = !isRolling && remainingMoves <= 0;

  return (
    <div 
      className={`rounded-lg overflow-hidden flex flex-col ${fillHeight ? 'flex-1' : ''}`}
      style={{
        backgroundColor: '#1a1a2e',
        border: '3px solid #5d4037',
        fontFamily: 'monospace',
      }}
    >
      {/* CSS for 3D dice animation */}
      <style>{`
        @keyframes dice3DRoll {
          0% { 
            transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); 
          }
          25% { 
            transform: rotateX(90deg) rotateY(45deg) rotateZ(45deg) translateY(-5px); 
          }
          50% { 
            transform: rotateX(180deg) rotateY(90deg) rotateZ(90deg); 
          }
          75% { 
            transform: rotateX(270deg) rotateY(135deg) rotateZ(135deg) translateY(-5px); 
          }
          100% { 
            transform: rotateX(360deg) rotateY(180deg) rotateZ(180deg); 
          }
        }
        @keyframes diceSettle {
          0% { transform: rotateX(10deg) rotateY(10deg); }
          50% { transform: rotateX(-5deg) rotateY(-5deg); }
          100% { transform: rotateX(0deg) rotateY(0deg); }
        }
        @keyframes diceShadow {
          0%, 100% { box-shadow: 0 10px 20px rgba(0,0,0,0.3); }
          50% { box-shadow: 0 5px 10px rgba(0,0,0,0.2); }
        }
      `}</style>
      
      {/* 헤더 */}
      <div 
        className="px-2 py-1 flex justify-between items-center"
        style={{ 
          backgroundColor: '#2d2d44',
          borderBottom: '2px solid #5d4037',
          fontSize: '10px',
          color: '#e0e0e0',
        }}
      >
        <span>🎮 탐험 컨트롤</span>
        <div className="flex gap-2">
          <span style={{ color: '#4fc3f7' }}>💧{water}</span>
          <span style={{ color: '#a5d6a7' }}>🌾{rice}</span>
        </div>
      </div>
      
      {/* 주사위 & 이동 컨트롤 */}
      <div 
        className="px-2 py-1.5"
        style={{ backgroundColor: '#252538' }}
      >
        <div className="flex items-center gap-2">
          {/* 주사위 (클릭 가능) */}
          <div 
            onClick={rollDice}
            className="flex flex-col items-center"
            style={{ 
              cursor: canRoll ? 'pointer' : 'not-allowed',
              opacity: canRoll ? 1 : 0.6,
              transition: 'transform 0.1s',
            }}
            onMouseEnter={(e) => canRoll && (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div 
              style={{ 
                padding: '5px',
                backgroundColor: canRoll ? '#5d4037' : '#37474f',
                borderRadius: '8px',
                border: '2px solid #3e2723',
                boxShadow: isRolling 
                  ? '0 6px 15px rgba(0,0,0,0.4)' 
                  : '0 3px 8px rgba(0,0,0,0.2)',
              }}
            >
              <Dice3D value={diceResult} isRolling={isRolling} size={42} />
            </div>
            {/* 남은 이동 수 표시 */}
            <div 
              className="mt-1 px-1.5 rounded text-center"
              style={{ 
                backgroundColor: remainingMoves > 0 ? '#ffd54f' : '#37474f',
                color: remainingMoves > 0 ? '#5d4037' : '#90a4ae',
                fontSize: '9px',
                fontWeight: 'bold',
              }}
            >
              {remainingMoves > 0 ? `${remainingMoves}칸` : '클릭!'}
            </div>
          </div>
          
          {/* 방향 버튼 */}
          <div className="flex flex-col items-center gap-0.5">
            <button
              onClick={() => move('up')}
              disabled={remainingMoves <= 0}
              className="w-7 h-7 rounded font-bold"
              style={{
                backgroundColor: remainingMoves > 0 ? '#4caf50' : '#455a64',
                color: 'white',
                border: '2px solid #5d4037',
                fontSize: '12px',
                cursor: remainingMoves > 0 ? 'pointer' : 'not-allowed',
                opacity: remainingMoves > 0 ? 1 : 0.5,
              }}
            >
              ↑
            </button>
            <div className="flex gap-0.5">
              <button
                onClick={() => move('left')}
                disabled={remainingMoves <= 0}
                className="w-7 h-7 rounded font-bold"
                style={{
                  backgroundColor: remainingMoves > 0 ? '#4caf50' : '#455a64',
                  color: 'white',
                  border: '2px solid #5d4037',
                  fontSize: '12px',
                  cursor: remainingMoves > 0 ? 'pointer' : 'not-allowed',
                  opacity: remainingMoves > 0 ? 1 : 0.5,
                }}
              >
                ←
              </button>
              <button
                onClick={() => move('down')}
                disabled={remainingMoves <= 0}
                className="w-7 h-7 rounded font-bold"
                style={{
                  backgroundColor: remainingMoves > 0 ? '#4caf50' : '#455a64',
                  color: 'white',
                  border: '2px solid #5d4037',
                  fontSize: '12px',
                  cursor: remainingMoves > 0 ? 'pointer' : 'not-allowed',
                  opacity: remainingMoves > 0 ? 1 : 0.5,
                }}
              >
                ↓
              </button>
              <button
                onClick={() => move('right')}
                disabled={remainingMoves <= 0}
                className="w-7 h-7 rounded font-bold"
                style={{
                  backgroundColor: remainingMoves > 0 ? '#4caf50' : '#455a64',
                  color: 'white',
                  border: '2px solid #5d4037',
                  fontSize: '12px',
                  cursor: remainingMoves > 0 ? 'pointer' : 'not-allowed',
                  opacity: remainingMoves > 0 ? 1 : 0.5,
                }}
              >
                →
              </button>
            </div>
          </div>
          
          {/* 조사 버튼 */}
          <button
            onClick={investigate}
            disabled={!canInvestigate || rice <= 0}
            className="rounded font-bold flex flex-col items-center justify-center"
            style={{
              backgroundColor: canInvestigate && rice > 0 ? '#2196f3' : '#455a64',
              color: 'white',
              border: '2px solid #5d4037',
              cursor: canInvestigate && rice > 0 ? 'pointer' : 'not-allowed',
              opacity: canInvestigate && rice > 0 ? 1 : 0.5,
              width: '50px',
              height: '50px',
            }}
          >
            <span style={{ fontSize: '14px' }}>🔍</span>
            <span style={{ fontSize: '8px', fontWeight: 'bold' }}>조사</span>
            <span style={{ fontSize: '7px', color: '#90caf9' }}>-1🌾</span>
          </button>
        </div>
      </div>
      
      {/* 메시지 영역 */}
      <div 
        className="px-2 py-1"
        style={{ 
          backgroundColor: '#2d2d44',
          borderTop: '2px solid #5d4037',
          fontSize: '8px',
          color: '#e0e0e0',
          minHeight: '24px',
        }}
      >
        {message}
      </div>
      
      {/* 조사한 장소 목록 - 남은 공간 채움 */}
      <div 
        className="px-2 py-1 flex-1 flex flex-col"
        style={{ 
          backgroundColor: '#1e1e30',
          borderTop: '2px solid #5d4037',
          overflowY: 'auto',
          minHeight: '80px',
        }}
      >
        <div 
          className="mb-1 font-bold"
          style={{ fontSize: '9px', color: '#90a4ae' }}
        >
          📋 탐험 기록 ({explorationLog.length})
        </div>
        {explorationLog.length === 0 ? (
          <div 
            className="flex-1 flex items-center justify-center"
            style={{ fontSize: '8px', color: '#607d8b' }}
          >
            아직 조사한 장소가 없습니다.
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {explorationLog.slice(-10).reverse().map((log, idx) => (
              <div 
                key={idx}
                className="p-1 rounded"
                style={{ 
                  backgroundColor: '#37474f',
                  fontSize: '8px',
                  color: '#e0e0e0',
                }}
              >
                <div style={{ color: '#ffd54f' }}>
                  📍 [{log.x},{log.y}] {log.name}
                </div>
                <div style={{ color: '#b0bec5', lineHeight: '1.2' }}>
                  {log.description}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* 인벤토리 */}
      <div 
        className="px-2 py-1.5"
        style={{ 
          backgroundColor: '#252538',
          borderTop: '2px solid #5d4037',
        }}
      >
        <div 
          className="mb-1 font-bold flex justify-between items-center"
          style={{ fontSize: '9px', color: '#90a4ae' }}
        >
          <span>🎒 인벤토리</span>
          {selectedTool === 'shovel' && inventory.shovel && (
            <span style={{ color: '#4caf50', fontSize: '8px' }}>🪏 사용 중</span>
          )}
        </div>
        
        {/* 인벤토리 슬롯 */}
        <div className="flex flex-wrap gap-1">
          {/* 삽 슬롯 */}
          <div
            onClick={() => inventory.shovel && onSelectTool?.(selectedTool === 'shovel' ? null : 'shovel')}
            className="flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer transition-all"
            style={{
              backgroundColor: selectedTool === 'shovel' ? '#4caf50' : (inventory.shovel ? '#37474f' : '#2a2a3e'),
              border: '1px dashed #5d4037',
              opacity: inventory.shovel ? 1 : 0.4,
              flex: '1 1 auto',
              minWidth: '70px',
            }}
            title={inventory.shovel ? (selectedTool === 'shovel' ? '삽 사용 중!' : '클릭하여 삽 선택') : '삽 없음'}
          >
            <span style={{ fontSize: '14px' }}>🪏</span>
            <span style={{ fontSize: '8px', color: selectedTool === 'shovel' ? '#fff' : (inventory.shovel ? '#a5d6a7' : '#455a64') }}>
              {inventory.shovel ? (selectedTool === 'shovel' ? '사용중' : '삽') : '-'}
            </span>
          </div>
          
          {/* 물 슬롯 */}
          <div
            className="flex items-center gap-1.5 px-2 py-1 rounded"
            style={{
              backgroundColor: (inventory.water || 0) > 0 ? '#37474f' : '#2a2a3e',
              border: '1px dashed #5d4037',
              opacity: (inventory.water || 0) > 0 ? 1 : 0.4,
              flex: '1 1 auto',
              minWidth: '70px',
            }}
          >
            <span style={{ fontSize: '14px' }}>💧</span>
            <span style={{ fontSize: '8px', color: (inventory.water || 0) > 0 ? '#4fc3f7' : '#455a64' }}>
              {(inventory.water || 0) > 0 ? `+${inventory.water}` : '-'}
            </span>
          </div>
          
          {/* 빈 슬롯들 */}
          {[...Array(4)].map((_, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center px-2 py-1 rounded"
              style={{
                backgroundColor: '#2a2a3e',
                border: '1px dashed #5d4037',
                opacity: 0.4,
                flex: '1 1 auto',
                minWidth: '35px',
              }}
            >
              <span style={{ fontSize: '8px', color: '#455a64' }}>-</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExplorationControl;
