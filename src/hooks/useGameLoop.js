import { useState, useEffect, useRef } from 'react';
import { GAME_CONFIG, EGG_STATE, GROWTH_STAGE } from '../constants/gameConfig';
import {
  findClosestFeed,
  getRandomPosition,
  clampPosition,
  moveTowardsTarget,
  calculateDistance,
  getAnimationFrame,
} from '../utils/gameUtils';

/**
 * 닭 생성
 */
const createChicken = (x, y, stage = GROWTH_STAGE.ADULT) => ({
  id: Date.now() + Math.random(),
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
export const useGameLoop = (fieldSize) => {
  const [chickens, setChickens] = useState([
    createChicken(GAME_CONFIG.CHICKEN.INITIAL_X, GAME_CONFIG.CHICKEN.INITIAL_Y, GROWTH_STAGE.ADULT)
  ]);
  const [eggs, setEggs] = useState([]);
  const [feeds, setFeeds] = useState([]);
  const [coops, setCoops] = useState([]);
  const [coins, setCoins] = useState(100); // 시작 코인
  const [placingCoop, setPlacingCoop] = useState(false);

  // useRef로 현재 상태 참조
  const chickensRef = useRef(chickens);
  const eggsRef = useRef(eggs);
  const feedsRef = useRef(feeds);
  const coopsRef = useRef(coops);
  const fieldSizeRef = useRef(fieldSize);

  useEffect(() => { chickensRef.current = chickens; }, [chickens]);
  useEffect(() => { eggsRef.current = eggs; }, [eggs]);
  useEffect(() => { feedsRef.current = feeds; }, [feeds]);
  useEffect(() => { coopsRef.current = coops; }, [coops]);
  useEffect(() => { fieldSizeRef.current = fieldSize; }, [fieldSize]);

  // 사료 추가
  const addFeed = (x, y) => {
    setFeeds(prev => [...prev, { id: Date.now(), x, y }]);
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
      let totalEarnedCoins = 0;

      // 1. 닭들 업데이트
      const updatedChickens = currentChickens.map(chicken => {
        let { x, y, hunger, happiness, health, tiredness, state, direction, frame, targetX, targetY, stage, growthProgress, eggCooldown, sleepTime, inCoopId } = chicken;
        
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
          
          return { ...chicken, x, y, hunger, happiness, health, tiredness, state, direction, frame, targetX, targetY, stage, growthProgress, eggCooldown, sleepTime, inCoopId };
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
        
        // 건강 감소 (배고프거나 피곤할 때)
        let healthDecrease = 0;
        if (hunger < config.HUNGER.HUNGRY_THRESHOLD) {
          healthDecrease += config.HEALTH.HUNGRY_DECREASE_RATE;
        }
        if (tiredness >= config.TIREDNESS.TIRED_THRESHOLD) {
          healthDecrease += config.HEALTH.TIRED_DECREASE_RATE;
        }
        health = Math.max(config.HEALTH.MIN, health - healthDecrease);
        
        // 행복도는 건강해야만 상승, 아니면 감소
        if (health >= config.HEALTH.HAPPINESS_THRESHOLD) {
          // 건강하면 자연 감소만
          happiness = Math.max(config.HAPPINESS.MIN, happiness - config.HAPPINESS.DECREASE_RATE);
        } else {
          // 건강하지 않으면 더 빨리 감소
          happiness = Math.max(config.HAPPINESS.MIN, happiness - config.HAPPINESS.DECREASE_RATE * 3);
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
            return { ...chicken, x, y, hunger, happiness, health, tiredness, state, direction, frame, targetX, targetY, stage, growthProgress, eggCooldown, sleepTime: 0, inCoopId };
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
                
                return { ...chicken, x, y, hunger, happiness, health, tiredness, state, direction, frame, targetX: null, targetY: null, stage, growthProgress, eggCooldown, sleepTime, inCoopId };
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

        return { ...chicken, x, y, hunger, happiness, health, tiredness, state, direction, frame, targetX, targetY, stage, growthProgress, eggCooldown, sleepTime, inCoopId };
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
      const allChickens = [...updatedChickens, ...newChicks.map(pos => createChicken(pos.x, pos.y, GROWTH_STAGE.CHICK))];

      // 5. 상태 일괄 업데이트
      setChickens(allChickens);
      setEggs(allEggs);
      
      if (eatenFeedIds.size > 0) {
        setFeeds(prev => prev.filter(f => !eatenFeedIds.has(f.id)));
      }
      
      // 6. 코인 업데이트
      if (totalEarnedCoins > 0) {
        setCoins(prev => Math.floor((prev + totalEarnedCoins) * 100) / 100);
      }

    }, GAME_CONFIG.GAME_LOOP_INTERVAL);

    return () => clearInterval(gameLoop);
  }, []);

  const mainChicken = chickens.find(c => c.stage === GROWTH_STAGE.ADULT) || chickens[0];

  return { 
    chicken: mainChicken,
    chickens, 
    eggs, 
    feeds, 
    coops,
    coins,
    placingCoop,
    addFeed,
    addCoop,
    togglePlacingCoop,
    chickenCount: chickens.filter(c => c.stage === GROWTH_STAGE.ADULT).length,
    juvenileCount: chickens.filter(c => c.stage === GROWTH_STAGE.JUVENILE).length,
    chickCount: chickens.filter(c => c.stage === GROWTH_STAGE.CHICK).length,
    sleepingCount: chickens.filter(c => c.state === 'sleeping').length,
  };
};
