import { useState, useEffect, useCallback, useRef } from 'react';
import { GAME_CONFIG, EGG_STATE } from '../constants/gameConfig';
import {
  findClosestFeed,
  getRandomPosition,
  clampPosition,
  moveTowardsTarget,
  calculateDistance,
  getAnimationFrame,
} from '../utils/gameUtils';

/**
 * 닭의 초기 상태
 */
const createChicken = (x, y, isAdult = true) => ({
  id: Date.now() + Math.random(),
  x,
  y,
  hunger: isAdult ? GAME_CONFIG.CHICKEN.INITIAL_HUNGER : GAME_CONFIG.CHICK.INITIAL_HUNGER,
  happiness: isAdult ? GAME_CONFIG.CHICKEN.INITIAL_HAPPINESS : GAME_CONFIG.CHICK.INITIAL_HAPPINESS,
  health: isAdult ? GAME_CONFIG.CHICKEN.INITIAL_HEALTH : GAME_CONFIG.CHICK.INITIAL_HEALTH,
  state: 'idle',
  direction: 1,
  frame: 0,
  targetX: null,
  targetY: null,
  isAdult,
  growthProgress: isAdult ? 100 : 0,
  eggCooldown: 0,
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
 * 게임 루프를 관리하는 커스텀 훅
 */
export const useGameLoop = (fieldSize) => {
  const [chickens, setChickens] = useState([
    createChicken(GAME_CONFIG.CHICKEN.INITIAL_X, GAME_CONFIG.CHICKEN.INITIAL_Y, true)
  ]);
  const [eggs, setEggs] = useState([]);
  const [feeds, setFeeds] = useState([]);

  // useRef로 현재 상태 참조 (게임 루프에서 최신 값 사용)
  const chickensRef = useRef(chickens);
  const eggsRef = useRef(eggs);
  const feedsRef = useRef(feeds);
  const fieldSizeRef = useRef(fieldSize);

  // 상태 변경 시 ref 업데이트
  useEffect(() => { chickensRef.current = chickens; }, [chickens]);
  useEffect(() => { eggsRef.current = eggs; }, [eggs]);
  useEffect(() => { feedsRef.current = feeds; }, [feeds]);
  useEffect(() => { fieldSizeRef.current = fieldSize; }, [fieldSize]);

  // 사료 추가
  const addFeed = useCallback((x, y) => {
    setFeeds(prev => [...prev, { id: Date.now(), x, y }]);
  }, []);

  // 게임 루프 (의존성 없이 ref 사용)
  useEffect(() => {
    const gameLoop = setInterval(() => {
      const currentFeeds = feedsRef.current;
      const currentChickens = chickensRef.current;
      const currentEggs = eggsRef.current;
      const currentFieldSize = fieldSizeRef.current;
      const config = GAME_CONFIG;

      // 먹은 사료 ID 추적
      const eatenFeedIds = new Set();
      // 새로 낳은 알 위치
      const newEggPositions = [];
      // 부화할 알
      const hatchingEggIds = new Set();
      // 새 병아리
      const newChicks = [];

      // 1. 닭들 업데이트
      const updatedChickens = currentChickens.map(chicken => {
        let { x, y, hunger, happiness, health, state, direction, frame, targetX, targetY, isAdult, growthProgress, eggCooldown } = chicken;
        
        const speed = isAdult ? config.CHICKEN.SPEED : config.CHICK.SPEED;
        const hungerDecreaseRate = isAdult ? config.HUNGER.DECREASE_RATE : config.CHICK.HUNGER_DECREASE_RATE;

        // 스탯 감소
        hunger = Math.max(config.HUNGER.MIN, hunger - hungerDecreaseRate);
        happiness = Math.max(config.HAPPINESS.MIN, happiness - config.HAPPINESS.DECREASE_RATE);
        health = Math.max(config.HEALTH.MIN, health - config.HEALTH.DECREASE_RATE);
        
        // 쿨다운 감소
        if (eggCooldown > 0) eggCooldown--;

        // 병아리 성장
        if (!isAdult) {
          growthProgress += (100 / config.CHICK.GROWTH_TIME);
          if (growthProgress >= 100) {
            isAdult = true;
            growthProgress = 100;
          }
        }

        // 아직 먹지 않은 사료만 고려
        const availableFeeds = currentFeeds.filter(f => !eatenFeedIds.has(f.id));

        // 사료가 있으면 가장 가까운 사료로 이동
        if (availableFeeds.length > 0) {
          const closest = findClosestFeed(availableFeeds, x, y);
          
          if (closest) {
            targetX = closest.feed.x;
            targetY = closest.feed.y;
            state = 'seeking';

            // 사료에 도달했는지 확인
            if (closest.distance < config.FEED.REACH_DISTANCE) {
              eatenFeedIds.add(closest.feed.id);
              hunger = Math.min(config.HUNGER.MAX, hunger + config.HUNGER.FEED_RESTORE);
              happiness = Math.min(config.HAPPINESS.MAX, happiness + config.HAPPINESS.FEED_RESTORE);
              health = Math.min(config.HEALTH.MAX, health + config.HEALTH.FEED_RESTORE);
              state = 'eating';
              frame = 2;
              
              return { ...chicken, x, y, hunger, happiness, health, state, direction, frame, targetX: null, targetY: null, isAdult, growthProgress, eggCooldown };
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
          if (isAdult && currentEggs.length > 0) {
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
          
          // 랜덤 목표 설정
          if (!targetX || calculateDistance(x, y, targetX, targetY) < config.FEED.TARGET_REACH_DISTANCE || Math.random() < config.RANDOM_MOVE_CHANCE) {
            const newPos = getRandomPosition(currentFieldSize.width, currentFieldSize.height);
            targetX = newPos.x;
            targetY = newPos.y;
          }
        }

        // 목표를 향해 이동
        if (targetX !== null && targetY !== null) {
          const moveSpeed = state === 'hungry' ? speed * config.CHICKEN.HUNGRY_SPEED_MULTIPLIER : speed;
          const movement = moveTowardsTarget(x, y, targetX, targetY, moveSpeed);
          x = movement.x;
          y = movement.y;
          direction = movement.direction;
          
          happiness = Math.min(config.HAPPINESS.MAX, happiness + config.HAPPINESS.WALK_RESTORE);
        }

        // 경계 체크
        const clamped = clampPosition(x, y, currentFieldSize.width, currentFieldSize.height);
        x = clamped.x;
        y = clamped.y;

        // 애니메이션 프레임
        frame = getAnimationFrame(state, frame);

        // 알 낳기 체크
        if (isAdult && eggCooldown <= 0 && 
            hunger >= config.EGG.MIN_HUNGER && 
            happiness >= config.EGG.MIN_HAPPINESS && 
            health >= config.EGG.MIN_HEALTH &&
            Math.random() < config.EGG.LAY_CHANCE / 100) {
          newEggPositions.push({ x, y: y + 20 });
          eggCooldown = config.EGG.LAY_COOLDOWN;
          state = 'laying';
        }

        return { ...chicken, x, y, hunger, happiness, health, state, direction, frame, targetX, targetY, isAdult, growthProgress, eggCooldown };
      });

      // 2. 알 업데이트
      const updatedEggs = currentEggs.map(egg => {
        let { age, warmth, state } = egg;
        const eggConfig = config.EGG;
        
        age++;
        
        // 닭이 근처에 있으면 따뜻해짐
        const nearChicken = updatedChickens.find(c => 
          c.isAdult && calculateDistance(c.x, c.y, egg.x, egg.y) < eggConfig.WARM_DISTANCE
        );
        
        if (nearChicken) {
          warmth = Math.min(eggConfig.HATCH_WARMTH, warmth + eggConfig.WARM_RATE);
        } else {
          warmth = Math.max(0, warmth - eggConfig.COOL_RATE);
        }
        
        // 상태 업데이트
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
      const allChickens = [...updatedChickens, ...newChicks.map(pos => createChicken(pos.x, pos.y, false))];

      // 5. 상태 일괄 업데이트
      setChickens(allChickens);
      setEggs(allEggs);
      
      if (eatenFeedIds.size > 0) {
        setFeeds(prev => prev.filter(f => !eatenFeedIds.has(f.id)));
      }

    }, GAME_CONFIG.GAME_LOOP_INTERVAL);

    return () => clearInterval(gameLoop);
  }, []); // 의존성 배열 비움 - ref 사용으로 최신 상태 참조

  // 첫 번째 닭의 정보 (메인 닭으로 사용)
  const mainChicken = chickens.find(c => c.isAdult) || chickens[0];

  return { 
    chicken: mainChicken,
    chickens, 
    eggs, 
    feeds, 
    addFeed,
    chickenCount: chickens.filter(c => c.isAdult).length,
    chickCount: chickens.filter(c => !c.isAdult).length,
  };
};
