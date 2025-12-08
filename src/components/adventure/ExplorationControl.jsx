import { useState, useCallback, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

// 장소별 설명 텍스트
const TILE_DESCRIPTIONS = {
  GRASS: [
    "평화로운 초원이다. 바람이 풀을 쓸어간다.",
    "드넓은 초원에서 야생화가 피어있다.",
    "초원 위로 나비가 날아다닌다.",
    "바람이 지나갈 때마다 먼지가 춤을 춰요. 닭들은 조심스럽게 발을 내딛었어요.",
    "여기엔 아무도 없지만, 딱… 우리 발걸음만 울려 퍼져요.",
    "조용해요. 너무 조용해서 닭 심장소리가 들릴 정도예요.",
  ],
  FOREST: [
    "울창한 숲이다. 나무 사이로 빛이 스며든다.",
    "숲에서 새소리가 들린다. 열매가 있을지도?",
    "고요한 숲... 무언가 숨어있는 느낌이다.",
    "바람이 지나갈 때마다 먼지가 춤을 춰요. 닭들은 조심스럽게 발을 내딛었어요.",
    "여기엔 아무도 없지만, 딱… 우리 발걸음만 울려 퍼져요.",
    "조용해요. 너무 조용해서 닭 심장소리가 들릴 정도예요.",
  ],
  BEACH: [
    "파도 소리가 들리는 해변이다.",
    "모래사장에서 조개껍데기를 발견했다.",
    "해변가에 표류물이 떠밀려 왔다.",
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
    "자원을 발견했다!",
    "반짝이는 무언가가 있다...",
  ],
  MOUNTAIN: [
    "험준한 산이다. 지나갈 수 없다.",
  ],
  WATER: [
    "깊은 바다다. 배 없이는 건널 수 없다.",
  ],
  // 🏚️ 버려진 민가 - 인간의 흔적
  HOUSE: [
    "여긴… 오래전 인간의 집 같아요. 하지만 냄새는 다 사라졌어요.",
    "이 벽엔 긁힌 자국이 남아 있어요. 아마… 우리보다 먼저 탐험한 닭인가 봐요.",
    "낡은 노트에 누군가 남긴 문장이 있어요. '내일은 꼭 돌아온다.' …돌아오지 못한 것 같아요.",
    "'치킨 먹고 싶다…'라는 글씨를 찾았어요. 읽지 말 걸 그랬어요.",
    "달력은 수십 년째 같은 날을 가리키고 있어요. 시간도 멈춘 것 같아요.",
    "먼지 쌓인 가족사진이 있어요. 웃고 있는 얼굴들… 지금은 어디에 있을까요?",
  ],
  // 🚀 발사장 - 우주 떡밥
  LAUNCH_SITE: [
    "하늘을 향해 길게 뻗은 구조물을 발견했어요. 인간들은 이미 하늘을 떠났던 걸까요?",
    "지도를 보면, 도시 끝에 '발사장'이라고 적혀 있어요. 닭도 언젠가는…",
    "거대한 금속 구조물이 하늘을 찌르고 있어요. 녹슬었지만… 여전히 위엄이 있어요.",
    "발사대 옆에 카운트다운 표지판이 있어요. '3... 2... 1...' 그 다음은 뭐였을까요?",
    "여기서 무언가가 하늘로 날아갔어요. 그 끝에는 뭐가 있을까요?",
  ],
  // 📡 통신탑 - 금속 조각 아이템 획득 가능
  TOWER: [
    "벼락 맞은 통신탑 아래서 신기한 금속 조각을 찾았어요… 우주선에 쓸 수 있을지도?",
    "부서진 안테나가 하늘을 가리키고 있어요. 누군가와 연락하려 했던 걸까요?",
    "탑 꼭대기에서 깜빡이던 불빛은 이제 꺼져 있어요. 마지막 신호는 언제였을까요?",
    "통신탑 주변에 케이블이 얽혀있어요. 이게 연결되던 곳은… 지금은 어디에?",
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
  HOUSE: '버려진 민가',
  LAUNCH_SITE: '발사장',
  TOWER: '통신탑',
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
    { item: null, chance: 0.85 },
    { item: 'shovel', chance: 0.15, name: '삽' },
  ],
  FOREST: [
    { item: null, chance: 0.4 },
    { item: 'twisted_vine', chance: 0.2, name: '비틀어진 덩굴줄기' },
    { item: 'branch_pile', chance: 0.3, name: '나뭇가지 더미' },
    { item: 'shovel', chance: 0.1, name: '삽' },
  ],
  BEACH: [
    { item: null, chance: 0.75 },
    { item: 'shovel', chance: 0.25, name: '삽' },
  ],
  VILLAGE: [
    { item: null, chance: 0.5 },
    { item: 'shovel', chance: 0.5, name: '삽' },
  ],
  OUTPOST: [
    { item: null, chance: 0.5 },
    { item: 'shovel', chance: 0.5, name: '삽' },
  ],
  RESOURCE: [
    { item: null, chance: 0.3 },
    { item: 'shovel', chance: 0.7, name: '삽' },
  ],
  // 🏚️ 버려진 민가 - 인간의 유품
  HOUSE: [
    { item: null, chance: 0.5 },
    { item: 'diary', chance: 0.3, name: '낡은 일기장' },
    { item: 'shovel', chance: 0.2, name: '삽' },
  ],
  // 🚀 발사장 - 우주 관련 아이템
  LAUNCH_SITE: [
    { item: null, chance: 0.4 },
    { item: 'blueprint', chance: 0.4, name: '우주선 설계도 조각' },
    { item: 'fuel_cell', chance: 0.2, name: '연료 전지' },
  ],
  // 📡 통신탑 - 금속 조각 획득 가능
  TOWER: [
    { item: null, chance: 0.3 },
    { item: 'metal_scrap', chance: 0.5, name: '신기한 금속 조각' },
    { item: 'antenna', chance: 0.2, name: '부서진 안테나' },
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
  adventuringChicken = null,
  onRecallChicken,
  onAddTiredness,
  onUseDiceRoll,
  onResetDiceRolls,
  onAddExp,
}) => {
  const [diceResult, setDiceResult] = useState(1);
  const [remainingMoves, setRemainingMoves] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [message, setMessage] = useState(adventuringChicken ? "🎲 주사위를 클릭하여 탐험을 시작하세요!" : "🐔 먼저 닭을 모험에 보내세요!");
  const [hoveredInventoryItem, setHoveredInventoryItem] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState(null);
  
  // 현재 위치가 조사되었는지 체크
  const posKey = `${playerPosition.x},${playerPosition.y}`;
  const canInvestigate = !investigatedTiles.has(posKey);
  
  // 주사위 굴리기
  const rollDice = useCallback(() => {
    if (isRolling) return;
    if (!adventuringChicken) {
      setMessage("🐔 먼저 닭을 모험에 보내세요!");
      return;
    }
    if (remainingMoves > 0) {
      setMessage("⚠️ 이동을 먼저 완료하세요!");
      return;
    }
    // 피로도 체크
    if (adventuringChicken.tiredness >= 100) {
      setMessage("😫 닭이 너무 피곤합니다! 집으로 돌아갑니다...");
      return;
    }
    // 주사위 횟수 체크
    if (adventuringChicken.remainingDiceRolls <= 0) {
      setMessage("🎲 이번 라운드의 주사위를 모두 사용했습니다!");
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
        // 주사위 결과만큼 이동 가능 (한 번에 한 칸씩)
        setRemainingMoves(finalResult);
        setIsRolling(false);
        
        // 피로도 증가 (레벨에 따라 다름) 및 주사위 횟수 감소
        const tirednessIncrease = adventuringChicken.tirednessPerRoll || Math.floor(100 / (adventuringChicken.level || 1));
        onAddTiredness?.(tirednessIncrease);
        onUseDiceRoll?.();
        
        const newRemainingDice = (adventuringChicken.remainingDiceRolls || 1) - 1;
        const newTiredness = Math.min(100, (adventuringChicken.tiredness || 0) + tirednessIncrease);
        setMessage(`🎲 ${finalResult}칸 이동! (피로도 +${tirednessIncrease}%, 남은 주사위: ${newRemainingDice}회)`);
      }
    }, 60);
  }, [remainingMoves, isRolling, adventuringChicken, onAddTiredness, onUseDiceRoll]);
  
  // 이동 처리
  const move = useCallback((direction) => {
    if (!adventuringChicken) {
      setMessage("🐔 먼저 닭을 모험에 보내세요!");
      return;
    }
    if (remainingMoves <= 0) {
      setMessage("⚠️ 먼저 주사위를 굴리세요!");
      return;
    }
    
    // 테스트용: 물 제한 비활성화
    // if (water <= 0) {
    //   setMessage("💧 물이 부족합니다! 이동할 수 없습니다.");
    //   return;
    // }
    
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
    
    // 이동할 때마다 경험치 획득 (3 EXP)
    const expGain = 3;
    onAddExp?.(expGain);
    
    const newRemaining = remainingMoves - 1;
    setRemainingMoves(newRemaining);
    
    const totalEarnedExp = (adventuringChicken?.earnedExp || 0) + expGain;
    
    if (newRemaining > 0) {
      setMessage(`📍 이동 완료! +${expGain}EXP (총 ${totalEarnedExp}EXP) 남은 이동: ${newRemaining}칸`);
    } else {
      const newPosKey = `${newX},${newY}`;
      const isInvestigated = investigatedTiles.has(newPosKey);
      if (!isInvestigated) {
        setMessage("✅ 이동 완료! '조사'로 이 지역을 탐색하세요.");
      } else {
        setMessage("✅ 이동 완료! 주사위를 다시 굴리세요.");
      }
    }
  }, [remainingMoves, playerPosition, water, onPlayerMove, onConsumeWater, investigatedTiles, canPass, adventuringChicken]);
  
  // 조사하기
  const investigate = useCallback(() => {
    if (!adventuringChicken) {
      setMessage("🐔 먼저 닭을 모험에 보내세요!");
      return;
    }
    if (investigatedTiles.has(posKey)) {
      setMessage("ℹ️ 이미 조사한 지역입니다.");
      return;
    }
    
    // 테스트용: 벼 제한 비활성화
    // if (rice <= 0) {
    //   setMessage("🌾 벼가 부족합니다! 조사할 수 없습니다.");
    //   return;
    // }
    
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
      // 아이템별 처리
      const itemEmojis = {
        shovel: '🪏',
        diary: '📔',
        blueprint: '📜',
        fuel_cell: '🔋',
        metal_scrap: '⚙️',
        antenna: '📡',
        twisted_vine: '🌿',
        branch_pile: '🪵',
      };
      
      const emoji = itemEmojis[loot.item] || '🎁';
      
      if (loot.item === 'shovel') {
        // 삽은 도구이므로 이미 있으면 획득하지 않음
        if (!inventory.shovel) {
          onAddItem?.('shovel', 1);
          lootMessage = ` ${emoji} 삽이에요! 농장의 똥을 치울 수 있어요! 💩`;
        }
      } else {
        // 다른 아이템들은 중복 획득 가능
        onAddItem?.(loot.item, 1);
        lootMessage = ` ${emoji} ${loot.name}을(를) 발견했다!`;
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
  }, [posKey, rice, investigatedTiles, onConsumeRice, onInvestigate, currentPoi, currentTileType, playerPosition, onAddLog, onAddItem, inventory.shovel, adventuringChicken]);

  const canRoll = !isRolling && remainingMoves <= 0 && adventuringChicken && 
    (adventuringChicken.remainingDiceRolls > 0) && (adventuringChicken.tiredness < 100);

  // Ref로 최신 값 유지 (useEffect 의존성 문제 해결)
  const playerPositionRef = useRef(playerPosition);
  const remainingMovesRef = useRef(remainingMoves);
  const adventuringChickenRef = useRef(adventuringChicken);
  const canPassRef = useRef(canPass);
  const onPlayerMoveRef = useRef(onPlayerMove);
  const pressedKeysRef = useRef(new Set());
  
  useEffect(() => {
    playerPositionRef.current = playerPosition;
  }, [playerPosition]);
  
  useEffect(() => {
    remainingMovesRef.current = remainingMoves;
  }, [remainingMoves]);
  
  useEffect(() => {
    adventuringChickenRef.current = adventuringChicken;
  }, [adventuringChicken]);
  
  useEffect(() => {
    canPassRef.current = canPass;
  }, [canPass]);
  
  useEffect(() => {
    onPlayerMoveRef.current = onPlayerMove;
  }, [onPlayerMove]);

  // 키보드 화살표 키로 이동 (키를 한번 누르면 한칸만 이동)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 이미 눌린 키는 무시 (연속 이동 방지)
      if (pressedKeysRef.current.has(e.key)) return;
      pressedKeysRef.current.add(e.key);
      
      // 이동 가능한 상태가 아니면 무시
      if (remainingMovesRef.current <= 0 || !adventuringChickenRef.current) return;
      
      const pos = playerPositionRef.current;
      let newX = pos.x;
      let newY = pos.y;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          newY = pos.y - 1;
          e.preventDefault();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          newY = pos.y + 1;
          e.preventDefault();
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          newX = pos.x - 1;
          e.preventDefault();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          newX = pos.x + 1;
          e.preventDefault();
          break;
        default:
          return;
      }
      
      // 맵 범위 체크 (35x25)
      if (newX < 0 || newX >= 35 || newY < 0 || newY >= 25) {
        return;
      }
      
      // 통과 가능 여부 체크 (산, 물 등)
      const passCheck = canPassRef.current?.(newX, newY);
      if (!passCheck?.canPass) {
        setMessage(`🚫 ${passCheck?.reason || '이동할 수 없습니다!'}`);
        return;
      }
      
      // 이동 처리
      onPlayerMoveRef.current?.({ x: newX, y: newY });
      setRemainingMoves(prev => prev - 1);
    };
    
    const handleKeyUp = (e) => {
      pressedKeysRef.current.delete(e.key);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []); // 의존성 없음 - ref로 최신 값 참조

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
          {adventuringChicken && (
            <>
              <span style={{ color: adventuringChicken.tiredness >= 70 ? '#ef5350' : '#ffb74d' }}>
                😪{Math.round(adventuringChicken.tiredness)}%
              </span>
              <span style={{ color: '#ce93d8' }}>
                🎲{adventuringChicken.remainingDiceRolls}/{adventuringChicken.maxDiceRolls}
              </span>
              <span style={{ color: '#ffd54f' }}>
                ⭐{adventuringChicken.earnedExp || 0}
              </span>
            </>
          )}
        </div>
      </div>
      
      {/* 모험 중인 닭 정보 (헤더 아래) */}
      <div 
        className="px-2 py-1"
        style={{ 
          backgroundColor: '#252538',
          borderBottom: '2px solid #5d4037',
        }}
      >
        {adventuringChicken ? (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span style={{ fontSize: '12px' }}>🐔</span>
              <span style={{ color: '#ffd54f', fontSize: '10px', fontWeight: 'bold' }}>{adventuringChicken.name}</span>
              <span style={{ color: '#ce93d8', fontSize: '9px' }}>Lv.{adventuringChicken.level}</span>
            </div>
            <div className="flex gap-2">
              <span style={{ fontSize: '9px', color: '#4fc3f7' }}>💧{adventuringChicken.water}</span>
              <span style={{ fontSize: '9px', color: '#a5d6a7' }}>🌾{adventuringChicken.rice}</span>
            </div>
          </div>
        ) : (
          <div 
            className="text-center py-1"
            style={{ fontSize: '9px', color: '#607d8b' }}
          >
            🐔 농장에서 닭을 선택 후 '모험' 클릭
          </div>
        )}
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
                backgroundColor: remainingMoves > 0 ? '#ffd54f' : 
                  (adventuringChicken?.tiredness >= 100 ? '#ef5350' : 
                   adventuringChicken?.remainingDiceRolls <= 0 ? '#9e9e9e' : '#37474f'),
                color: remainingMoves > 0 ? '#5d4037' : '#fff',
                fontSize: '9px',
                fontWeight: 'bold',
              }}
            >
              {!adventuringChicken ? '🐔?' : 
               adventuringChicken.tiredness >= 100 ? '😫' :
               adventuringChicken.remainingDiceRolls <= 0 ? '⏳' :
               remainingMoves > 0 ? `${remainingMoves}칸` : '클릭!'}
            </div>
          </div>
          
          {/* 방향 버튼 */}
          <div className="flex flex-col items-center gap-0.5">
            <button
              onClick={() => move('up')}
              disabled={!adventuringChicken || remainingMoves <= 0}
              className="w-7 h-7 rounded font-bold"
              style={{
                backgroundColor: adventuringChicken && remainingMoves > 0 ? '#4caf50' : '#455a64',
                color: 'white',
                border: '2px solid #5d4037',
                fontSize: '12px',
                cursor: adventuringChicken && remainingMoves > 0 ? 'pointer' : 'not-allowed',
                opacity: adventuringChicken && remainingMoves > 0 ? 1 : 0.5,
              }}
            >
              ↑
            </button>
            <div className="flex gap-0.5">
              <button
                onClick={() => move('left')}
                disabled={!adventuringChicken || remainingMoves <= 0}
                className="w-7 h-7 rounded font-bold"
                style={{
                  backgroundColor: adventuringChicken && remainingMoves > 0 ? '#4caf50' : '#455a64',
                  color: 'white',
                  border: '2px solid #5d4037',
                  fontSize: '12px',
                  cursor: adventuringChicken && remainingMoves > 0 ? 'pointer' : 'not-allowed',
                  opacity: adventuringChicken && remainingMoves > 0 ? 1 : 0.5,
                }}
              >
                ←
              </button>
              <button
                onClick={() => move('down')}
                disabled={!adventuringChicken || remainingMoves <= 0}
                className="w-7 h-7 rounded font-bold"
                style={{
                  backgroundColor: adventuringChicken && remainingMoves > 0 ? '#4caf50' : '#455a64',
                  color: 'white',
                  border: '2px solid #5d4037',
                  fontSize: '12px',
                  cursor: adventuringChicken && remainingMoves > 0 ? 'pointer' : 'not-allowed',
                  opacity: adventuringChicken && remainingMoves > 0 ? 1 : 0.5,
                }}
              >
                ↓
              </button>
              <button
                onClick={() => move('right')}
                disabled={!adventuringChicken || remainingMoves <= 0}
                className="w-7 h-7 rounded font-bold"
                style={{
                  backgroundColor: adventuringChicken && remainingMoves > 0 ? '#4caf50' : '#455a64',
                  color: 'white',
                  border: '2px solid #5d4037',
                  fontSize: '12px',
                  cursor: adventuringChicken && remainingMoves > 0 ? 'pointer' : 'not-allowed',
                  opacity: adventuringChicken && remainingMoves > 0 ? 1 : 0.5,
                }}
              >
                →
              </button>
            </div>
          </div>
          
          {/* 조사 버튼 */}
          <button
            onClick={investigate}
            disabled={!adventuringChicken || !canInvestigate || rice <= 0}
            className="rounded font-bold flex flex-col items-center justify-center"
            style={{
              backgroundColor: adventuringChicken && canInvestigate && rice > 0 ? '#2196f3' : '#455a64',
              color: 'white',
              border: '2px solid #5d4037',
              cursor: adventuringChicken && canInvestigate && rice > 0 ? 'pointer' : 'not-allowed',
              opacity: adventuringChicken && canInvestigate && rice > 0 ? 1 : 0.5,
              width: '50px',
              height: '50px',
            }}
          >
            <span style={{ fontSize: '14px' }}>🔍</span>
            <span style={{ fontSize: '8px', fontWeight: 'bold' }}>조사</span>
            <span style={{ fontSize: '7px', color: '#90caf9' }}>-1🌾</span>
          </button>
          
          {/* 귀환 버튼 */}
          {adventuringChicken && (
            <button
              onClick={() => onRecallChicken?.('manual')}
              className="rounded font-bold flex flex-col items-center justify-center"
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                border: '2px solid #b91c1c',
                cursor: 'pointer',
                width: '50px',
                height: '50px',
              }}
            >
              <span style={{ fontSize: '14px' }}>🏠</span>
              <span style={{ fontSize: '8px', fontWeight: 'bold' }}>귀환</span>
            </button>
          )}
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
      
      {/* 조사한 장소 목록 - 남은 공간 채움, 내부 스크롤 */}
      <div 
        className="px-2 py-1 flex flex-col flex-1 min-h-0"
        style={{ 
          backgroundColor: '#1e1e30',
          borderTop: '2px solid #5d4037',
        }}
      >
        <div 
          className="mb-1 font-bold flex-shrink-0"
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
          <div 
            className="flex flex-col gap-1 flex-1 overflow-y-auto pr-1"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#5d4037 #1e1e30' }}
          >
            {explorationLog.slice(-10).reverse().map((log, idx) => (
              <div 
                key={idx}
                className="p-1 rounded flex-shrink-0"
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
      
      {/* 인벤토리 - 고정 높이 (2줄) */}
      <div 
        className="px-2 py-1.5 flex-shrink-0"
        style={{ 
          backgroundColor: '#252538',
          borderTop: '2px solid #5d4037',
        }}
      >
        <div 
          className="font-bold flex justify-between items-center mb-1"
          style={{ fontSize: '9px', color: '#90a4ae' }}
        >
          <span>🎒 인벤토리</span>
          {selectedTool === 'shovel' && inventory.shovel && (
            <span style={{ color: '#4caf50', fontSize: '8px' }}>🪏 사용 중</span>
          )}
        </div>
        
        {/* 인벤토리 슬롯 - 2줄 (4개씩) */}
        <div className="grid grid-cols-4 gap-1">
          {/* 삽 슬롯 (도구) */}
          <div
            onClick={() => inventory.shovel && onSelectTool?.(selectedTool === 'shovel' ? null : 'shovel')}
            onMouseEnter={(e) => {
              if (inventory.shovel) {
                setHoveredInventoryItem('shovel');
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltipPosition({ left: rect.left + rect.width / 2, top: rect.top });
              }
            }}
            onMouseLeave={() => {
              setHoveredInventoryItem(null);
              setTooltipPosition(null);
            }}
            className="flex items-center justify-center gap-1 px-1 py-1.5 rounded cursor-pointer transition-all"
            style={{
              backgroundColor: selectedTool === 'shovel' ? '#4caf50' : (inventory.shovel ? '#37474f' : '#2a2a3e'),
              border: '1px dashed #5d4037',
              opacity: inventory.shovel ? 1 : 0.4,
            }}
          >
            <span style={{ fontSize: '12px' }}>🪏</span>
            <span style={{ fontSize: '7px', color: selectedTool === 'shovel' ? '#fff' : (inventory.shovel ? '#a5d6a7' : '#455a64') }}>
              {inventory.shovel ? (selectedTool === 'shovel' ? '사용' : '삽') : '-'}
            </span>
          </div>
          
          {/* 금속 조각 슬롯 */}
          <div
            onMouseEnter={(e) => {
              if ((inventory.metal_scrap || 0) > 0) {
                setHoveredInventoryItem('metal_scrap');
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltipPosition({ left: rect.left + rect.width / 2, top: rect.top });
              }
            }}
            onMouseLeave={() => {
              setHoveredInventoryItem(null);
              setTooltipPosition(null);
            }}
            className="flex items-center justify-center gap-1 px-1 py-1.5 rounded transition-all"
            style={{
              backgroundColor: (inventory.metal_scrap || 0) > 0 ? '#37474f' : '#2a2a3e',
              border: '1px dashed #5d4037',
              opacity: (inventory.metal_scrap || 0) > 0 ? 1 : 0.4,
              cursor: (inventory.metal_scrap || 0) > 0 ? 'pointer' : 'default',
            }}
          >
            <span style={{ fontSize: '12px' }}>⚙️</span>
            <span style={{ fontSize: '7px', color: (inventory.metal_scrap || 0) > 0 ? '#4fc3f7' : '#455a64' }}>
              {(inventory.metal_scrap || 0) > 0 ? inventory.metal_scrap : '-'}
            </span>
          </div>
          
          {/* 우주선 설계도 조각 슬롯 */}
          <div
            onMouseEnter={(e) => {
              if ((inventory.blueprint || 0) > 0) {
                setHoveredInventoryItem('blueprint');
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltipPosition({ left: rect.left + rect.width / 2, top: rect.top });
              }
            }}
            onMouseLeave={() => {
              setHoveredInventoryItem(null);
              setTooltipPosition(null);
            }}
            className="flex items-center justify-center gap-1 px-1 py-1.5 rounded transition-all"
            style={{
              backgroundColor: (inventory.blueprint || 0) > 0 ? '#37474f' : '#2a2a3e',
              border: '1px dashed #5d4037',
              opacity: (inventory.blueprint || 0) > 0 ? 1 : 0.4,
              cursor: (inventory.blueprint || 0) > 0 ? 'pointer' : 'default',
            }}
          >
            <span style={{ fontSize: '12px' }}>📜</span>
            <span style={{ fontSize: '7px', color: (inventory.blueprint || 0) > 0 ? '#ce93d8' : '#455a64' }}>
              {(inventory.blueprint || 0) > 0 ? inventory.blueprint : '-'}
            </span>
          </div>
          
          {/* 연료 전지 슬롯 */}
          <div
            onMouseEnter={(e) => {
              if ((inventory.fuel_cell || 0) > 0) {
                setHoveredInventoryItem('fuel_cell');
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltipPosition({ left: rect.left + rect.width / 2, top: rect.top });
              }
            }}
            onMouseLeave={() => {
              setHoveredInventoryItem(null);
              setTooltipPosition(null);
            }}
            className="flex items-center justify-center gap-1 px-1 py-1.5 rounded transition-all"
            style={{
              backgroundColor: (inventory.fuel_cell || 0) > 0 ? '#37474f' : '#2a2a3e',
              border: '1px dashed #5d4037',
              opacity: (inventory.fuel_cell || 0) > 0 ? 1 : 0.4,
              cursor: (inventory.fuel_cell || 0) > 0 ? 'pointer' : 'default',
            }}
          >
            <span style={{ fontSize: '12px' }}>🔋</span>
            <span style={{ fontSize: '7px', color: (inventory.fuel_cell || 0) > 0 ? '#a5d6a7' : '#455a64' }}>
              {(inventory.fuel_cell || 0) > 0 ? inventory.fuel_cell : '-'}
            </span>
          </div>
          
          {/* 낡은 일기장 슬롯 */}
          <div
            onMouseEnter={(e) => {
              if ((inventory.diary || 0) > 0) {
                setHoveredInventoryItem('diary');
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltipPosition({ left: rect.left + rect.width / 2, top: rect.top });
              }
            }}
            onMouseLeave={() => {
              setHoveredInventoryItem(null);
              setTooltipPosition(null);
            }}
            className="flex items-center justify-center gap-1 px-1 py-1.5 rounded transition-all"
            style={{
              backgroundColor: (inventory.diary || 0) > 0 ? '#37474f' : '#2a2a3e',
              border: '1px dashed #5d4037',
              opacity: (inventory.diary || 0) > 0 ? 1 : 0.4,
              cursor: (inventory.diary || 0) > 0 ? 'pointer' : 'default',
            }}
          >
            <span style={{ fontSize: '12px' }}>📔</span>
            <span style={{ fontSize: '7px', color: (inventory.diary || 0) > 0 ? '#ffcc80' : '#455a64' }}>
              {(inventory.diary || 0) > 0 ? inventory.diary : '-'}
            </span>
          </div>
          
          {/* 부서진 안테나 슬롯 */}
          <div
            onMouseEnter={(e) => {
              if ((inventory.antenna || 0) > 0) {
                setHoveredInventoryItem('antenna');
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltipPosition({ left: rect.left + rect.width / 2, top: rect.top });
              }
            }}
            onMouseLeave={() => {
              setHoveredInventoryItem(null);
              setTooltipPosition(null);
            }}
            className="flex items-center justify-center gap-1 px-1 py-1.5 rounded transition-all"
            style={{
              backgroundColor: (inventory.antenna || 0) > 0 ? '#37474f' : '#2a2a3e',
              border: '1px dashed #5d4037',
              opacity: (inventory.antenna || 0) > 0 ? 1 : 0.4,
              cursor: (inventory.antenna || 0) > 0 ? 'pointer' : 'default',
            }}
          >
            <span style={{ fontSize: '12px' }}>📡</span>
            <span style={{ fontSize: '7px', color: (inventory.antenna || 0) > 0 ? '#90caf9' : '#455a64' }}>
              {(inventory.antenna || 0) > 0 ? inventory.antenna : '-'}
            </span>
          </div>
          
          {/* 비틀어진 덩굴줄기 슬롯 */}
          <div
            onMouseEnter={(e) => {
              if ((inventory.twisted_vine || 0) > 0) {
                setHoveredInventoryItem('twisted_vine');
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltipPosition({ left: rect.left + rect.width / 2, top: rect.top });
              }
            }}
            onMouseLeave={() => {
              setHoveredInventoryItem(null);
              setTooltipPosition(null);
            }}
            className="flex items-center justify-center gap-1 px-1 py-1.5 rounded transition-all"
            style={{
              backgroundColor: (inventory.twisted_vine || 0) > 0 ? '#37474f' : '#2a2a3e',
              border: '1px dashed #5d4037',
              opacity: (inventory.twisted_vine || 0) > 0 ? 1 : 0.4,
              cursor: (inventory.twisted_vine || 0) > 0 ? 'pointer' : 'default',
            }}
          >
            <span style={{ fontSize: '12px' }}>🌿</span>
            <span style={{ fontSize: '7px', color: (inventory.twisted_vine || 0) > 0 ? '#81c784' : '#455a64' }}>
              {(inventory.twisted_vine || 0) > 0 ? inventory.twisted_vine : '-'}
            </span>
          </div>
          
          {/* 나뭇가지 더미 슬롯 */}
          <div
            onMouseEnter={(e) => {
              if ((inventory.branch_pile || 0) > 0) {
                setHoveredInventoryItem('branch_pile');
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltipPosition({ left: rect.left + rect.width / 2, top: rect.top });
              }
            }}
            onMouseLeave={() => {
              setHoveredInventoryItem(null);
              setTooltipPosition(null);
            }}
            className="flex items-center justify-center gap-1 px-1 py-1.5 rounded transition-all"
            style={{
              backgroundColor: (inventory.branch_pile || 0) > 0 ? '#37474f' : '#2a2a3e',
              border: '1px dashed #5d4037',
              opacity: (inventory.branch_pile || 0) > 0 ? 1 : 0.4,
              cursor: (inventory.branch_pile || 0) > 0 ? 'pointer' : 'default',
            }}
          >
            <span style={{ fontSize: '12px' }}>🪵</span>
            <span style={{ fontSize: '7px', color: (inventory.branch_pile || 0) > 0 ? '#bcaaa4' : '#455a64' }}>
              {(inventory.branch_pile || 0) > 0 ? inventory.branch_pile : '-'}
            </span>
          </div>
        </div>
      </div>
      
      {/* 아이템 설명 툴팁 (Portal) */}
      {hoveredInventoryItem && tooltipPosition && ReactDOM.createPortal(
        <div
          style={{
            position: 'fixed',
            left: `${tooltipPosition.left}px`,
            top: `${tooltipPosition.top}px`,
            transform: 'translate(-50%, -100%) translateY(-8px)',
            backgroundColor: '#0f172a',
            border: '3px solid #7c3aed',
            borderRadius: '8px',
            padding: '12px',
            color: '#ffffff',
            zIndex: 999999,
            pointerEvents: 'none',
            fontSize: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.9)',
            maxWidth: '280px',
            lineHeight: '1.5',
          }}
        >
          {hoveredInventoryItem === 'shovel' && (
            <>
              <div style={{ fontWeight: 'bold', marginBottom: '6px', color: '#86efac', fontSize: '11px' }}>
                🪏 신비한 삽
              </div>
              <div style={{ fontStyle: 'italic', color: '#e0e7ff', marginBottom: '6px' }}>
                "꼬꼬댁! 이 막대기는 우리 부리보다 훨씬 강해요!"<br/><br/>
                "똥을 파낼 수 있대요. 부리로는 절대 안 할 일이지만... 이 도구는 마법처럼 똥을 사라지게 만들어요!"<br/><br/>
                <span style={{ color: '#4ade80' }}>"농장이 깨끗해지면 모두가 행복해질 거예요. 꼬꼬!"</span>
              </div>
              <div style={{ fontSize: '8px', color: '#94a3b8', borderTop: '1px solid #475569', paddingTop: '4px' }}>
                똥을 제거할 수 있는 특수 도구입니다.
              </div>
            </>
          )}
          
          {hoveredInventoryItem === 'metal_scrap' && (
            <>
              <div style={{ fontWeight: 'bold', marginBottom: '6px', color: '#4fc3f7', fontSize: '11px' }}>
                🔩 신기한 금속 조각
              </div>
              <div style={{ fontStyle: 'italic', color: '#e0e7ff', marginBottom: '6px' }}>
                "이건... 딱딱해요. 너무 딱딱해서 부리가 부러질 것 같아요!"<br/><br/>
                "반짝반짝 빛나는 게 예쁘긴 한데, 먹을 수는 없나 봐요."<br/><br/>
                <span style={{ color: '#4ade80' }}>"하지만 이걸로 뭔가 대단한 걸 만들 수 있다는 느낌이 들어요! 꼬꼬댁!"</span>
              </div>
              <div style={{ fontSize: '8px', color: '#94a3b8', borderTop: '1px solid #475569', paddingTop: '4px' }}>
                우주선의 외벽 재료로 사용됩니다.
              </div>
            </>
          )}
          
          {hoveredInventoryItem === 'blueprint' && (
            <>
              <div style={{ fontWeight: 'bold', marginBottom: '6px', color: '#ce93d8', fontSize: '11px' }}>
                📜 우주선 설계도 조각
              </div>
              <div style={{ fontStyle: 'italic', color: '#e0e7ff', marginBottom: '6px' }}>
                "꼬꼬댁... 이게 뭘까요? 종이에 이상한 그림이 가득해요."<br/><br/>
                "화살표랑 숫자들... 아, 이건 어쩌면 우리를 하늘로 데려다줄 마법 상자의 비밀일지도 몰라요!"<br/><br/>
                <span style={{ color: '#fde047' }}>"다른 조각들도 찾으면... 우리도 날 수 있을까요? 꼬꼬댁! ✨"</span>
              </div>
              <div style={{ fontSize: '8px', color: '#94a3b8', borderTop: '1px solid #475569', paddingTop: '4px' }}>
                우주선 건설에 필요한 신비한 설계도입니다.
              </div>
            </>
          )}
          
          {hoveredInventoryItem === 'fuel_cell' && (
            <>
              <div style={{ fontWeight: 'bold', marginBottom: '6px', color: '#a5d6a7', fontSize: '11px' }}>
                ⚡ 연료 전지
              </div>
              <div style={{ fontStyle: 'italic', color: '#e0e7ff', marginBottom: '6px' }}>
                <span style={{ color: '#4ade80', fontWeight: 'bold' }}>"이 장치는 우주선의 추진 엔진으로, 모터가 회전하며 거대한 힘을 만들어 앞으로 나아가게 합니다."</span><br/><br/>
                <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>"음… 닭 기준으로 설명하자면, 아주 거대한 부채질 같은 거라고 생각하면 됩니다."</span><br/><br/>
                "다만 날개로 부채질하는 게 아니니, 여기서 진짜 날갯짓은 금지예요—불이 납니다."<br/><br/>
                "만약 이걸 먹어도 되냐고 묻는다면, 대답은 단호하게 '아니요!'입니다."
              </div>
              <div style={{ fontSize: '8px', color: '#94a3b8', borderTop: '1px solid #475569', paddingTop: '4px' }}>
                우주선의 추진 동력원입니다.
              </div>
            </>
          )}
          
          {hoveredInventoryItem === 'diary' && (
            <>
              <div style={{ fontWeight: 'bold', marginBottom: '6px', color: '#ffcc80', fontSize: '11px' }}>
                📔 낡은 일기장
              </div>
              <div style={{ fontStyle: 'italic', color: '#e0e7ff', marginBottom: '6px' }}>
                "누군가의 일기장이에요. 페이지마다 손때가 가득하고, 글씨가 흐려져 있어요."<br/><br/>
                "읽어봤는데... 대부분 '오늘도 외로웠다', '누가 없나' 같은 말뿐이에요."<br/><br/>
                <span style={{ color: '#93c5fd' }}>"마지막 페이지에는 '하늘로 가고 싶다'고 적혀있어요. 꼬꼬... 슬퍼요."</span>
              </div>
              <div style={{ fontSize: '8px', color: '#94a3b8', borderTop: '1px solid #475569', paddingTop: '4px' }}>
                옛날 누군가의 기록입니다. 힌트가 있을지도?
              </div>
            </>
          )}
          
          {hoveredInventoryItem === 'antenna' && (
            <>
              <div style={{ fontWeight: 'bold', marginBottom: '6px', color: '#90caf9', fontSize: '11px' }}>
                📡 부서진 안테나
              </div>
              <div style={{ fontStyle: 'italic', color: '#e0e7ff', marginBottom: '6px' }}>
                "이 뾰족한 막대기... 위로 쭉 뻗어있어요. 꼭 커다란 벼 줄기 같아요!"<br/><br/>
                "하지만 먹을 수는 없어요. 딱딱하고 차가워요."<br/><br/>
                <span style={{ color: '#fbbf24' }}>"이걸로 뭔가 신호를 보낼 수 있다고 들었어요. 우주로요! 꼬꼬댁!"</span>
              </div>
              <div style={{ fontSize: '8px', color: '#94a3b8', borderTop: '1px solid #475569', paddingTop: '4px' }}>
                통신 장비의 일부입니다. 수리하면 쓸모가 있을지도?
              </div>
            </>
          )}
          
          {hoveredInventoryItem === 'twisted_vine' && (
            <>
              <div style={{ fontWeight: 'bold', marginBottom: '6px', color: '#81c784', fontSize: '11px' }}>
                🌿 비틀어진 덩굴줄기
              </div>
              <div style={{ fontStyle: 'italic', color: '#e0e7ff', marginBottom: '6px' }}>
                "숲 깊은 곳에서 찾은 튼튼한 덩굴이에요! 꼬불꼬불하지만 정말 질겨요."<br/><br/>
                "이걸로 뭔가를 묶거나... 엮을 수 있을 것 같아요!"<br/><br/>
                <span style={{ color: '#4ade80', fontWeight: 'bold' }}>"우리 성을 지을 때 기둥을 단단히 고정하는 데 딱 좋겠어요! 꼬꼬댁!"</span>
              </div>
              <div style={{ fontSize: '8px', color: '#94a3b8', borderTop: '1px solid #475569', paddingTop: '4px' }}>
                닭의 성 건설에 필요한 튼튼한 덩굴입니다.
              </div>
            </>
          )}
          
          {hoveredInventoryItem === 'branch_pile' && (
            <>
              <div style={{ fontWeight: 'bold', marginBottom: '6px', color: '#bcaaa4', fontSize: '11px' }}>
                🪵 나뭇가지 더미
              </div>
              <div style={{ fontStyle: 'italic', color: '#e0e7ff', marginBottom: '6px' }}>
                "숲에서 모은 나뭇가지들이에요. 크기도 다양하고 튼튼해요!"<br/><br/>
                "이걸로 둥지를 틀면... 아니, 우리만의 집을 지을 수 있어요!"<br/><br/>
                <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>"나뭇가지를 쌓고 쌓으면... 멋진 성벽이 될 거예요! 꼬꼬댁!"</span>
              </div>
              <div style={{ fontSize: '8px', color: '#94a3b8', borderTop: '1px solid #475569', paddingTop: '4px' }}>
                닭의 성 건설에 필요한 건축 재료입니다.
              </div>
            </>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};

export default ExplorationControl;
