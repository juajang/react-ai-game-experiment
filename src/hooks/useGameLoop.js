import { useState, useEffect, useRef } from 'react';
import { GAME_CONFIG, EGG_STATE, GROWTH_STAGE, FARM_GRADE, GAME_STATE } from '../constants/gameConfig';
import {
  findClosestFeed,
  getRandomPosition,
  clampPosition,
  moveTowardsTarget,
  calculateDistance,
  getAnimationFrame,
} from '../utils/gameUtils';

// 닭 이름 생성용 카운터
let chickenNameCounter = 1;

// 귀여운 닭 이름 목록
const CHICKEN_NAMES = ['꼬꼬', '삐약이', '뽀삐', '초코', '모카', '밀크', '치즈', '보리', '찰스', "달구", "달순이", "병숙이", "칠성이", "막순이", "복댁이", "알복이", "덕배", "종달이"];
const getRandomChickenName = () => {
  const baseName = CHICKEN_NAMES[Math.floor(Math.random() * CHICKEN_NAMES.length)];
  return `${baseName}${chickenNameCounter++}`;
};

/**
 * 레벨업에 필요한 경험치 계산
 */
const getExpForNextLevel = (level) => Math.floor(100 * Math.pow(1.5, level - 1));

/**
 * 닭 생성
 */
const createChicken = (x, y, stage = GROWTH_STAGE.ADULT) => ({
  id: Date.now() + Math.random(),
  name: getRandomChickenName(),
  x,
  y,
  hunger: stage === GROWTH_STAGE.ADULT 
    ? GAME_CONFIG.CHICKEN.INITIAL_HUNGER 
    : GAME_CONFIG.CHICK.INITIAL_HUNGER,
  happiness: stage === GROWTH_STAGE.ADULT 
    ? GAME_CONFIG.CHICKEN.INITIAL_HAPPINESS 
    : GAME_CONFIG.CHICK.INITIAL_HAPPINESS,
  health: stage === GROWTH_STAGE.ADULT 
    ? GAME_CONFIG.CHICKEN.INITIAL_HEALTH 
    : GAME_CONFIG.CHICK.INITIAL_HEALTH,
  tiredness: 0,
  state: 'idle',
  direction: 1,
  frame: 0,
  targetX: null,
  targetY: null,
  stage,
  growthProgress: stage === GROWTH_STAGE.ADULT ? 100 : 0,
  eggCooldown: 0,
  sleepTime: 0,
  inCoopId: null,
  // 레벨 시스템
  level: 1,
  experience: 0,
  expForNextLevel: getExpForNextLevel(1),
});

/**
 * 알 생성
 */
const createEgg = (x, y) => ({
  id: Date.now() + Math.random(),
  x,
  y,
  age: 0,
  warmth: 0,
  state: EGG_STATE.FRESH,
});

/**
 * 닭집 생성
 */
const createCoop = (x, y) => ({
  id: Date.now() + Math.random(),
  x,
  y,
  capacity: GAME_CONFIG.COOP.CAPACITY,
  occupants: [],
});

/**
 * 게임 루프를 관리하는 커스텀 훅
 */
export const useGameLoop = (fieldSize, adventuringChickenId = null) => {
  const [chickens, setChickens] = useState([
    createChicken(GAME_CONFIG.CHICKEN.INITIAL_X, GAME_CONFIG.CHICKEN.INITIAL_Y, GROWTH_STAGE.ADULT)
  ]);
  const [eggs, setEggs] = useState([]);
  const [feeds, setFeeds] = useState([]);
  const [flowers, setFlowers] = useState([]);
  const [flowerBushes, setFlowerBushes] = useState([]);
  const [ponds, setPonds] = useState([]);
  const [windmills, setWindmills] = useState([]);
  const [coops, setCoops] = useState([]);
  const [poops, setPoops] = useState([]);
  const [coins, setCoins] = useState(100); // 시작 코인
  const [placingCoop, setPlacingCoop] = useState(false);
  const [deathCount, setDeathCount] = useState(0); // 사망한 닭 수
  const [deadChickens, setDeadChickens] = useState([]); // 사망한 닭들 (잠시 표시용)
  const [gameState, setGameState] = useState(GAME_STATE.PLAYING); // 게임 상태
  const [maxChickenCount, setMaxChickenCount] = useState(1); // 최대 닭 수 (게임 클리어 체크용)
  const [hasCleared, setHasCleared] = useState(false); // 클리어한 적 있는지
  
  // gameState ref (게임 루프에서 최신 상태 참조용)
  const gameStateRef = useRef(gameState);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
  const hasClearedRef = useRef(hasCleared);
  useEffect(() => { hasClearedRef.current = hasCleared; }, [hasCleared]);

  // useRef로 현재 상태 참조
  const chickensRef = useRef(chickens);
  const eggsRef = useRef(eggs);
  const feedsRef = useRef(feeds);
  const flowersRef = useRef(flowers);
  const flowerBushesRef = useRef(flowerBushes);
  const pondsRef = useRef(ponds);
  const windmillsRef = useRef(windmills);
  const coopsRef = useRef(coops);
  const poopsRef = useRef(poops);
  const fieldSizeRef = useRef(fieldSize);

  useEffect(() => { chickensRef.current = chickens; }, [chickens]);
  useEffect(() => { eggsRef.current = eggs; }, [eggs]);
  useEffect(() => { feedsRef.current = feeds; }, [feeds]);
  useEffect(() => { flowersRef.current = flowers; }, [flowers]);
  useEffect(() => { flowerBushesRef.current = flowerBushes; }, [flowerBushes]);
  useEffect(() => { pondsRef.current = ponds; }, [ponds]);
  useEffect(() => { windmillsRef.current = windmills; }, [windmills]);
  useEffect(() => { coopsRef.current = coops; }, [coops]);
  useEffect(() => { poopsRef.current = poops; }, [poops]);
  useEffect(() => { fieldSizeRef.current = fieldSize; }, [fieldSize]);
  
  // 모험 중인 닭 ID (상태 업데이트 건너뛰기용)
  const adventuringChickenIdRef = useRef(adventuringChickenId);
  useEffect(() => { adventuringChickenIdRef.current = adventuringChickenId; }, [adventuringChickenId]);

  // 사료 추가 (돈 필요)
  const addFeed = (x, y) => {
    if (coins >= GAME_CONFIG.FEED.COST) {
      setFeeds(prev => [...prev, { id: Date.now(), x, y }]);
      setCoins(prev => prev - GAME_CONFIG.FEED.COST);
      return true;
    }
    return false;
  };

  // 꽃 추가
  const addFlower = (x, y) => {
    if (coins >= GAME_CONFIG.FLOWER.COST) {
      setFlowers(prev => [...prev, { id: Date.now(), x, y }]);
      setCoins(prev => prev - GAME_CONFIG.FLOWER.COST);
      return true;
    }
    return false;
  };

  // 꽃덤불 추가 (황금 농장 전용)
  const addFlowerBush = (x, y) => {
    const totalChickens = chickensRef.current.length;
    const isGoldenFarm = totalChickens >= FARM_GRADE.GOLDEN_FARM.minChickens;
    if (coins >= GAME_CONFIG.FLOWER_BUSH.COST && isGoldenFarm) {
      setFlowerBushes(prev => [...prev, { id: Date.now(), x, y }]);
      setCoins(prev => prev - GAME_CONFIG.FLOWER_BUSH.COST);
      return true;
    }
    return false;
  };

  // 꽃덤불 이동
  const moveFlowerBush = (bushId, newX, newY) => {
    setFlowerBushes(prev => prev.map(bush => 
      bush.id === bushId ? { ...bush, x: newX, y: newY } : bush
    ));
  };

  // 연못 추가
  const addPond = (x, y) => {
    if (coins >= GAME_CONFIG.POND.COST) {
      setPonds(prev => [...prev, { id: Date.now(), x, y }]);
      setCoins(prev => prev - GAME_CONFIG.POND.COST);
      return true;
    }
    return false;
  };

  // 연못 이동
  const movePond = (pondId, newX, newY) => {
    setPonds(prev => prev.map(pond => 
      pond.id === pondId ? { ...pond, x: newX, y: newY } : pond
    ));
  };

  // 풍차 추가 (황금 농장 전용)
  const addWindmill = (x, y) => {
    const totalChickens = chickensRef.current.length;
    const isGoldenFarm = totalChickens >= FARM_GRADE.GOLDEN_FARM.minChickens;
    if (coins >= GAME_CONFIG.WINDMILL.COST && isGoldenFarm) {
      setWindmills(prev => [...prev, { id: Date.now(), x, y }]);
      setCoins(prev => prev - GAME_CONFIG.WINDMILL.COST);
      return true;
    }
    return false;
  };

  // 풍차 이동
  const moveWindmill = (windmillId, newX, newY) => {
    setWindmills(prev => prev.map(wm => 
      wm.id === windmillId ? { ...wm, x: newX, y: newY } : wm
    ));
  };

  // 닭집 추가
  const addCoop = (x, y) => {
    if (coins >= GAME_CONFIG.COOP.COST) {
      setCoops(prev => [...prev, createCoop(x, y)]);
      setCoins(prev => prev - GAME_CONFIG.COOP.COST);
      setPlacingCoop(false);
      return true;
    }
    return false;
  };

  // 닭집 배치 모드 토글
  const togglePlacingCoop = () => {
    if (coins >= GAME_CONFIG.COOP.COST) {
      setPlacingCoop(prev => !prev);
    }
  };

  // 닭집 이동
  const moveCoop = (coopId, newX, newY) => {
    setCoops(prev => prev.map(coop => 
      coop.id === coopId ? { ...coop, x: newX, y: newY } : coop
    ));
  };

  // 똥 치우기
  const removePoop = (poopId) => {
    setPoops(prev => prev.filter(p => p.id !== poopId));
  };

  // 닭 이름 변경
  const updateChickenName = (chickenId, newName) => {
    setChickens(prev => prev.map(c => 
      c.id === chickenId ? { ...c, name: newName } : c
    ));
  };

  // 닭 위치 이동
  const moveChicken = (chickenId, newX, newY) => {
    setChickens(prev => prev.map(c => 
      c.id === chickenId ? { ...c, x: newX, y: newY, targetX: null, targetY: null } : c
    ));
  };

  // 가장 가까운 빈 닭집 찾기
  const findNearestAvailableCoop = (x, y, coops, chickens) => {
    let nearest = null;
    let minDist = Infinity;
    
    coops.forEach(coop => {
      const occupantCount = chickens.filter(c => c.inCoopId === coop.id).length;
      if (occupantCount < coop.capacity) {
        const dist = calculateDistance(x, y, coop.x, coop.y);
        if (dist < minDist) {
          minDist = dist;
          nearest = coop;
        }
      }
    });
    
    return nearest ? { coop: nearest, distance: minDist } : null;
  };

  // 게임 루프
  useEffect(() => {
    const gameLoop = setInterval(() => {
      const currentFeeds = feedsRef.current;
      const currentChickens = chickensRef.current;
      const currentEggs = eggsRef.current;
      const currentCoops = coopsRef.current;
      const currentFieldSize = fieldSizeRef.current;
      const config = GAME_CONFIG;

      const eatenFeedIds = new Set();
      const newEggPositions = [];
      const hatchingEggIds = new Set();
      const newChicks = [];
      const newPoopPositions = [];
      let totalEarnedCoins = 0;
      const currentPoops = poopsRef.current;

      // 1. 닭들 업데이트
      const updatedChickens = currentChickens.map(chicken => {
        // 모험 중인 닭은 상태 업데이트 건너뛰기 (피로도는 App.jsx에서 별도 관리)
        if (adventuringChickenIdRef.current && chicken.id === adventuringChickenIdRef.current) {
          return chicken; // 변경 없이 그대로 반환
        }
        
        let { x, y, hunger, happiness, health, tiredness, state, direction, frame, targetX, targetY, stage, growthProgress, eggCooldown, sleepTime, inCoopId, level = 1, experience = 0, expForNextLevel = 100 } = chicken;
        
        // 잠자는 중이면 회복 처리
        if (state === 'sleeping' && inCoopId) {
          sleepTime++;
          tiredness = Math.max(config.TIREDNESS.MIN, tiredness - config.COOP.SLEEP_RECOVERY_RATE);
          health = Math.min(config.HEALTH.MAX, health + config.COOP.HEALTH_RECOVERY_RATE);
          
          // 수면 완료 체크
          if (tiredness <= 10 && sleepTime >= config.COOP.MIN_SLEEP_TIME) {
            state = 'idle';
            inCoopId = null;
            sleepTime = 0;
            // 닭집에서 나올 때 근처로 이동
            const coop = currentCoops.find(c => c.id === inCoopId);
            if (coop) {
              x = coop.x + (Math.random() - 0.5) * 40;
              y = coop.y + 30;
            }
          }
          
          return { ...chicken, x, y, hunger, happiness, health, tiredness, state, direction, frame, targetX, targetY, stage, growthProgress, eggCooldown, sleepTime, inCoopId, level, experience, expForNextLevel };
        }
        
        // 단계별 속도 및 배고픔 감소율
        let speed, hungerDecreaseRate, coinMultiplier;
        switch (stage) {
          case GROWTH_STAGE.CHICK:
            speed = config.CHICK.SPEED;
            hungerDecreaseRate = config.CHICK.HUNGER_DECREASE_RATE;
            coinMultiplier = config.COIN.CHICK_MULTIPLIER;
            break;
          case GROWTH_STAGE.JUVENILE:
            speed = config.JUVENILE.SPEED;
            hungerDecreaseRate = config.JUVENILE.HUNGER_DECREASE_RATE;
            coinMultiplier = config.COIN.JUVENILE_MULTIPLIER;
            break;
          default:
            speed = config.CHICKEN.SPEED;
            hungerDecreaseRate = config.HUNGER.DECREASE_RATE;
            coinMultiplier = config.COIN.ADULT_MULTIPLIER;
        }

        // 스탯 변화
        hunger = Math.max(config.HUNGER.MIN, hunger - hungerDecreaseRate);
        tiredness = Math.min(config.TIREDNESS.MAX, tiredness + config.TIREDNESS.INCREASE_RATE);
        
        // 건강 감소 (배고프거나 피곤하거나 불행할 때)
        let healthDecrease = 0;
        if (hunger < config.HUNGER.HUNGRY_THRESHOLD) {
          healthDecrease += config.HEALTH.HUNGRY_DECREASE_RATE;
        }
        if (tiredness >= config.TIREDNESS.TIRED_THRESHOLD) {
          healthDecrease += config.HEALTH.TIRED_DECREASE_RATE;
        }
        if (happiness < config.HAPPINESS.LOW_THRESHOLD) {
          healthDecrease += config.HEALTH.UNHAPPY_DECREASE_RATE;
        }
        health = Math.max(config.HEALTH.MIN, health - healthDecrease);
        
        // 건강이 낮으면 dying 상태 표시
        if (health < 20 && state !== 'sleeping') {
          state = 'dying';
        }
        
        // 꽃 주변에 있으면 행복도 보너스
        const currentFlowers = flowersRef.current;
        const currentFlowerBushes = flowerBushesRef.current;
        const nearFlower = currentFlowers.some(f => 
          calculateDistance(x, y, f.x, f.y) < config.FLOWER.EFFECT_RADIUS
        );
        const nearFlowerBush = currentFlowerBushes.some(fb => 
          calculateDistance(x, y, fb.x, fb.y) < config.FLOWER_BUSH.EFFECT_RADIUS
        );
        
        // 연못 주변에 있으면 건강 회복
        const currentPonds = pondsRef.current;
        const nearPond = currentPonds.some(p => 
          calculateDistance(x, y, p.x, p.y) < config.POND.EFFECT_RADIUS
        );
        if (nearPond) {
          health = Math.min(config.HEALTH.MAX, health + config.POND.HEALTH_BOOST);
        }
        
        // 풍차 주변에 있으면 모든 스탯 보너스 (황금 농장 전용)
        const currentWindmills = windmillsRef.current;
        const nearWindmill = currentWindmills.some(wm => 
          calculateDistance(x, y, wm.x, wm.y) < config.WINDMILL.EFFECT_RADIUS
        );
        if (nearWindmill) {
          health = Math.min(config.HEALTH.MAX, health + config.WINDMILL.ALL_BOOST);
          // 풍차는 아래에서 행복도도 추가
        }
        
        // 똥 주변에 있으면 행복도 감소
        const nearPoop = currentPoops.some(p => 
          calculateDistance(x, y, p.x, p.y) < config.POOP.EFFECT_RADIUS
        );
        const nearOldPoop = currentPoops.some(p => 
          calculateDistance(x, y, p.x, p.y) < config.POOP.EFFECT_RADIUS && p.age >= config.POOP.STINK_THRESHOLD
        );
        
        // 행복도는 건강해야만 상승, 아니면 감소
        if (health >= config.HEALTH.HAPPINESS_THRESHOLD) {
          // 건강하면 자연 감소
          let happinessChange = -config.HAPPINESS.DECREASE_RATE;
          // 꽃 주변이면 행복도 증가
          if (nearFlower) {
            happinessChange += config.FLOWER.HAPPINESS_BOOST;
          }
          // 꽃덤불 주변이면 더 많은 행복도 증가
          if (nearFlowerBush) {
            happinessChange += config.FLOWER_BUSH.HAPPINESS_BOOST;
          }
          // 풍차 주변이면 모든 스탯 증가
          if (nearWindmill) {
            happinessChange += config.WINDMILL.ALL_BOOST;
          }
          // 똥 주변이면 행복도 감소
          if (nearPoop) {
            happinessChange -= config.POOP.HAPPINESS_PENALTY;
          }
          // 오래된 똥 주변이면 더 많이 감소
          if (nearOldPoop) {
            happinessChange -= config.POOP.HAPPINESS_PENALTY;
          }
          happiness = Math.min(config.HAPPINESS.MAX, Math.max(config.HAPPINESS.MIN, happiness + happinessChange));
        } else {
          // 건강하지 않으면 더 빨리 감소
          happiness = Math.max(config.HAPPINESS.MIN, happiness - config.HAPPINESS.DECREASE_RATE * 3);
        }
        
        // 레벨 & 경험치 시스템 - 행복하면 경험치 획득
        if (happiness >= 50 && state !== 'sleeping') {
          // 행복도에 비례한 경험치 획득 (행복도 50~100 → 경험치 1~3)
          const expGain = Math.floor((happiness - 40) / 20);
          experience += expGain;
          
          // 레벨업 체크
          if (experience >= expForNextLevel) {
            level += 1;
            experience = experience - expForNextLevel;
            expForNextLevel = getExpForNextLevel(level);
            // 레벨업 보너스: 체력 회복 + 코인
            health = Math.min(config.HEALTH.MAX, health + 20);
            totalEarnedCoins += level * 5;
          }
        }
        
        // 쿨다운 감소
        if (eggCooldown > 0) eggCooldown--;

        // 화폐 획득 체크
        if (happiness >= config.COIN.HAPPINESS_THRESHOLD && 
            coinMultiplier > 0 &&
            Math.random() * 100 < config.COIN.EARN_CHANCE) {
          totalEarnedCoins += config.COIN.EARN_AMOUNT * coinMultiplier;
        }

        // 성장 처리
        if (stage === GROWTH_STAGE.CHICK) {
          growthProgress += (100 / config.CHICK.GROWTH_TIME);
          if (growthProgress >= 100) {
            stage = GROWTH_STAGE.JUVENILE;
            growthProgress = 0;
          }
        } else if (stage === GROWTH_STAGE.JUVENILE) {
          growthProgress += (100 / config.JUVENILE.GROWTH_TIME);
          if (growthProgress >= 100) {
            stage = GROWTH_STAGE.ADULT;
            growthProgress = 100;
          }
        }

        // 피곤하면 닭집으로 이동
        if (tiredness >= config.TIREDNESS.TIRED_THRESHOLD && currentCoops.length > 0 && state !== 'goingToCoop') {
          const nearestCoop = findNearestAvailableCoop(x, y, currentCoops, currentChickens);
          if (nearestCoop) {
            targetX = nearestCoop.coop.x;
            targetY = nearestCoop.coop.y;
            state = 'goingToCoop';
          } else {
            state = 'tired';
          }
        }

        // 닭집으로 이동 중
        if (state === 'goingToCoop') {
          const nearestCoop = findNearestAvailableCoop(x, y, currentCoops, currentChickens);
          if (nearestCoop && nearestCoop.distance < config.COOP.ENTER_DISTANCE) {
            // 닭집 입장
            state = 'sleeping';
            inCoopId = nearestCoop.coop.id;
            x = nearestCoop.coop.x;
            y = nearestCoop.coop.y;
            targetX = null;
            targetY = null;
            return { ...chicken, x, y, hunger, happiness, health, tiredness, state, direction, frame, targetX, targetY, stage, growthProgress, eggCooldown, sleepTime: 0, inCoopId, level, experience, expForNextLevel };
          }
        }

        // 아직 먹지 않은 사료만 고려
        const availableFeeds = currentFeeds.filter(f => !eatenFeedIds.has(f.id));

        // 피곤하지 않을 때만 일반 행동
        if (state !== 'goingToCoop' && state !== 'tired') {
          // 사료가 있으면 가장 가까운 사료로 이동
          if (availableFeeds.length > 0) {
            const closest = findClosestFeed(availableFeeds, x, y);
            
            if (closest) {
              targetX = closest.feed.x;
              targetY = closest.feed.y;
              state = 'seeking';

              if (closest.distance < config.FEED.REACH_DISTANCE) {
                eatenFeedIds.add(closest.feed.id);
                hunger = Math.min(config.HUNGER.MAX, hunger + config.HUNGER.FEED_RESTORE);
                health = Math.min(config.HEALTH.MAX, health + config.HEALTH.FEED_RESTORE);
                // 행복도는 건강해야만 회복
                if (health >= config.HEALTH.HAPPINESS_THRESHOLD) {
                  happiness = Math.min(config.HAPPINESS.MAX, happiness + config.HAPPINESS.FEED_RESTORE);
                }
                state = 'eating';
                frame = 2;
                
                return { ...chicken, x, y, hunger, happiness, health, tiredness, state, direction, frame, targetX: null, targetY: null, stage, growthProgress, eggCooldown, sleepTime, inCoopId, level, experience, expForNextLevel };
              }
            }
          } else if (hunger < config.HUNGER.HUNGRY_THRESHOLD) {
            state = 'hungry';
            if (!targetX || calculateDistance(x, y, targetX, targetY) < config.FEED.TARGET_REACH_DISTANCE) {
              const newPos = getRandomPosition(currentFieldSize.width, currentFieldSize.height);
              targetX = newPos.x;
              targetY = newPos.y;
            }
          } else {
            // 알 품기 체크 (성체만)
            if (stage === GROWTH_STAGE.ADULT && currentEggs.length > 0) {
              const nearEgg = currentEggs.find(egg => 
                calculateDistance(x, y, egg.x, egg.y) < config.EGG.WARM_DISTANCE
              );
              if (nearEgg && nearEgg.state !== EGG_STATE.HATCHING) {
                state = 'warming';
              } else {
                state = 'idle';
              }
            } else {
              state = 'idle';
            }
            
            if (!targetX || calculateDistance(x, y, targetX, targetY) < config.FEED.TARGET_REACH_DISTANCE || Math.random() < config.RANDOM_MOVE_CHANCE) {
              const newPos = getRandomPosition(currentFieldSize.width, currentFieldSize.height);
              targetX = newPos.x;
              targetY = newPos.y;
            }
          }
        }

        // 목표를 향해 이동 (탈진 상태면 느리게)
        if (targetX !== null && targetY !== null) {
          let moveSpeed = state === 'hungry' ? speed * config.CHICKEN.HUNGRY_SPEED_MULTIPLIER : speed;
          if (tiredness >= config.TIREDNESS.EXHAUSTED_THRESHOLD) {
            moveSpeed *= 0.5; // 탈진 상태면 50% 속도
          }
          const movement = moveTowardsTarget(x, y, targetX, targetY, moveSpeed);
          x = movement.x;
          y = movement.y;
          direction = movement.direction;
          // 행복도는 건강해야만 회복
          if (health >= config.HEALTH.HAPPINESS_THRESHOLD) {
            happiness = Math.min(config.HAPPINESS.MAX, happiness + config.HAPPINESS.WALK_RESTORE);
          }
        }

        // 다른 닭들과의 충돌 회피 (밀어내기)
        const PUSH_DISTANCE = 25; // 이 거리 이내면 밀어냄
        const PUSH_FORCE = 3;     // 밀어내는 힘
        
        for (const other of currentChickens) {
          if (other.id === chicken.id) continue;
          if (other.state === 'sleeping') continue;
          
          const dist = calculateDistance(x, y, other.x, other.y);
          if (dist < PUSH_DISTANCE && dist > 0) {
            // 반대 방향으로 밀어내기
            const pushX = (x - other.x) / dist * PUSH_FORCE;
            const pushY = (y - other.y) / dist * PUSH_FORCE;
            x += pushX;
            y += pushY;
          } else if (dist === 0) {
            // 완전히 겹쳤으면 랜덤 방향으로 밀어내기
            x += (Math.random() - 0.5) * PUSH_FORCE * 2;
            y += (Math.random() - 0.5) * PUSH_FORCE * 2;
          }
        }

        // 경계 체크
        const clamped = clampPosition(x, y, currentFieldSize.width, currentFieldSize.height);
        x = clamped.x;
        y = clamped.y;

        // 애니메이션 프레임
        frame = getAnimationFrame(state, frame);

        // 알 낳기 체크 (성체만, 피곤하지 않을 때)
        if (stage === GROWTH_STAGE.ADULT && eggCooldown <= 0 && 
            tiredness < config.TIREDNESS.TIRED_THRESHOLD &&
            hunger >= config.EGG.MIN_HUNGER && 
            happiness >= config.EGG.MIN_HAPPINESS && 
            health >= config.EGG.MIN_HEALTH &&
            Math.random() * 100 < config.EGG.LAY_CHANCE) {
          newEggPositions.push({ x, y: y + 20 });
          eggCooldown = config.EGG.LAY_COOLDOWN;
          state = 'laying';
        }
        
        // 똥 싸기 체크 (잠자는 중 제외)
        if (state !== 'sleeping' && Math.random() * 100 < config.POOP.DROP_CHANCE) {
          newPoopPositions.push({ x: x + (Math.random() - 0.5) * 10, y: y + 15 });
        }

        return { ...chicken, x, y, hunger, happiness, health, tiredness, state, direction, frame, targetX, targetY, stage, growthProgress, eggCooldown, sleepTime, inCoopId, level, experience, expForNextLevel };
      });

      // 2. 알 업데이트
      const updatedEggs = currentEggs.map(egg => {
        let { age, warmth, state } = egg;
        const eggConfig = config.EGG;
        
        age++;
        
        const nearChicken = updatedChickens.find(c => 
          c.stage === GROWTH_STAGE.ADULT && 
          c.state !== 'sleeping' &&
          calculateDistance(c.x, c.y, egg.x, egg.y) < eggConfig.WARM_DISTANCE
        );
        
        if (nearChicken) {
          warmth = Math.min(eggConfig.HATCH_WARMTH, warmth + eggConfig.WARM_RATE);
        } else {
          warmth = Math.max(0, warmth - eggConfig.COOL_RATE);
        }
        
        if (warmth >= eggConfig.HATCH_WARMTH && age >= eggConfig.HATCH_TIME) {
          state = EGG_STATE.HATCHING;
          hatchingEggIds.add(egg.id);
          newChicks.push({ x: egg.x, y: egg.y });
        } else if (warmth > 50) {
          state = EGG_STATE.WARM;
        } else {
          state = EGG_STATE.FRESH;
        }
        
        return { ...egg, age, warmth, state };
      }).filter(egg => !hatchingEggIds.has(egg.id));

      // 3. 새 알 추가
      const allEggs = [...updatedEggs, ...newEggPositions.map(pos => createEgg(pos.x, pos.y))];

      // 4. 새 병아리 추가
      const allChickensWithNew = [...updatedChickens, ...newChicks.map(pos => createChicken(pos.x, pos.y, GROWTH_STAGE.CHICK))];
      
      // 5. 사망한 닭 제거 (건강이 0 이하)
      const deadChickens = allChickensWithNew.filter(c => c.health <= 0);
      const aliveChickens = allChickensWithNew.filter(c => c.health > 0);
      
      // 사망 카운트 업데이트 및 사망 닭 표시
      if (deadChickens.length > 0) {
        setDeathCount(prev => prev + deadChickens.length);
        
        // 사망한 닭을 deadChickens 상태에 추가 (3초간 표시)
        const newDeadChickens = deadChickens.map(c => ({
          ...c,
          deathTime: Date.now(),
        }));
        setDeadChickens(prev => [...prev, ...newDeadChickens]);
      }
      
      // 3초가 지난 사망 닭 제거
      setDeadChickens(prev => prev.filter(c => Date.now() - c.deathTime < 3000));

      // 6. 상태 일괄 업데이트
      setChickens(aliveChickens);
      setEggs(allEggs);
      
      if (eatenFeedIds.size > 0) {
        setFeeds(prev => prev.filter(f => !eatenFeedIds.has(f.id)));
      }
      
      // 똥 업데이트 (나이 증가 및 새 똥 추가)
      setPoops(prev => {
        const aged = prev.map(p => ({ ...p, age: p.age + 1 }));
        const newPoops = newPoopPositions.map(pos => ({
          id: Date.now() + Math.random(),
          x: pos.x,
          y: pos.y,
          age: 0,
        }));
        return [...aged, ...newPoops];
      });
      
      // 7. 코인 업데이트
      if (totalEarnedCoins > 0) {
        setCoins(prev => Math.floor((prev + totalEarnedCoins) * 100) / 100);
      }
      
      // 8. 게임 상태 체크
      const totalChickens = aliveChickens.length;
      const currentGameState = gameStateRef.current;
      const currentHasCleared = hasClearedRef.current;
      
      // 최대 닭 수 업데이트
      setMaxChickenCount(prev => Math.max(prev, totalChickens));
      
      // 게임 오버 체크 (닭이 모두 죽고, 알도 없음)
      if (totalChickens === 0 && allEggs.length === 0 && currentGameState !== GAME_STATE.GAME_CLEAR) {
        setGameState(GAME_STATE.GAME_OVER);
      }
      
      // 게임 클리어 체크 (황금 닭 농장 달성: 10마리 이상) - 처음 한번만 표시
      if (totalChickens >= FARM_GRADE.GOLDEN_FARM.minChickens && 
          currentGameState === GAME_STATE.PLAYING && 
          !currentHasCleared) {
        setGameState(GAME_STATE.GAME_CLEAR);
        setHasCleared(true);
      }

    }, GAME_CONFIG.GAME_LOOP_INTERVAL);

    return () => clearInterval(gameLoop);
  }, []);

  const mainChicken = chickens.find(c => c.stage === GROWTH_STAGE.ADULT) || chickens[0];
  
  // 농장 등급 계산
  const totalChickenCount = chickens.length;
  const getFarmGrade = () => {
    if (totalChickenCount >= FARM_GRADE.GOLDEN_FARM.minChickens) return FARM_GRADE.GOLDEN_FARM;
    if (totalChickenCount >= FARM_GRADE.CHICKEN_FARM.minChickens) return FARM_GRADE.CHICKEN_FARM;
    return FARM_GRADE.CHICK_FARM;
  };
  
  const farmGrade = getFarmGrade();
  
  // 게임 재시작
  const restartGame = () => {
    setChickens([createChicken(GAME_CONFIG.CHICKEN.INITIAL_X, GAME_CONFIG.CHICKEN.INITIAL_Y, GROWTH_STAGE.ADULT)]);
    setEggs([]);
    setFeeds([]);
    setFlowers([]);
    setFlowerBushes([]);
    setPonds([]);
    setWindmills([]);
    setCoops([]);
    setPoops([]);
    setCoins(100);
    setDeathCount(0);
    setDeadChickens([]);
    setGameState(GAME_STATE.PLAYING);
    setMaxChickenCount(1);
    setHasCleared(false);
  };
  
  // 게임 계속하기 (클리어 후)
  const continueGame = () => {
    setGameState(GAME_STATE.PLAYING);
  };

  return { 
    chicken: mainChicken,
    chickens,
    setChickens, // 외부에서 닭 상태 업데이트용
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
    placingCoop,
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
    removePoop,
    updateChickenName,
    moveChicken,
    togglePlacingCoop,
    restartGame,
    continueGame,
    chickenCount: chickens.filter(c => c.stage === GROWTH_STAGE.ADULT).length,
    juvenileCount: chickens.filter(c => c.stage === GROWTH_STAGE.JUVENILE).length,
    chickCount: chickens.filter(c => c.stage === GROWTH_STAGE.CHICK).length,
    sleepingCount: chickens.filter(c => c.state === 'sleeping').length,
    totalChickenCount,
    flowerBushCount: flowerBushes.length,
    windmillCount: windmills.length,
    poopCount: poops.length,
  };
};
