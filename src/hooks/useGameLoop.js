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
  state: 'idle',
  direction: 1,
  frame: 0,
  targetX: null,
  targetY: null,
  stage,
  growthProgress: stage === GROWTH_STAGE.ADULT ? 100 : 0,
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
    createChicken(GAME_CONFIG.CHICKEN.INITIAL_X, GAME_CONFIG.CHICKEN.INITIAL_Y, GROWTH_STAGE.ADULT)
  ]);
  const [eggs, setEggs] = useState([]);
  const [feeds, setFeeds] = useState([]);
  const [coins, setCoins] = useState(0);

  // useRef로 현재 상태 참조
  const chickensRef = useRef(chickens);
  const eggsRef = useRef(eggs);
  const feedsRef = useRef(feeds);
  const fieldSizeRef = useRef(fieldSize);
  const coinsRef = useRef(coins);

  useEffect(() => { chickensRef.current = chickens; }, [chickens]);
  useEffect(() => { eggsRef.current = eggs; }, [eggs]);
  useEffect(() => { feedsRef.current = feeds; }, [feeds]);
  useEffect(() => { fieldSizeRef.current = fieldSize; }, [fieldSize]);
  useEffect(() => { coinsRef.current = coins; }, [coins]);

  // 사료 추가
  const addFeed = (x, y) => {
    setFeeds(prev => [...prev, { id: Date.now(), x, y }]);
  };

  // 게임 루프
  useEffect(() => {
    const gameLoop = setInterval(() => {
      const currentFeeds = feedsRef.current;
      const currentChickens = chickensRef.current;
      const currentEggs = eggsRef.current;
      const currentFieldSize = fieldSizeRef.current;
      const config = GAME_CONFIG;

      const eatenFeedIds = new Set();
      const newEggPositions = [];
      const hatchingEggIds = new Set();
      const newChicks = [];
      let totalEarnedCoins = 0;

      // 1. 닭들 업데이트
      const updatedChickens = currentChickens.map(chicken => {
        let { x, y, hunger, happiness, health, state, direction, frame, targetX, targetY, stage, growthProgress, eggCooldown } = chicken;
        
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

        // 스탯 감소
        hunger = Math.max(config.HUNGER.MIN, hunger - hungerDecreaseRate);
        happiness = Math.max(config.HAPPINESS.MIN, happiness - config.HAPPINESS.DECREASE_RATE);
        health = Math.max(config.HEALTH.MIN, health - config.HEALTH.DECREASE_RATE);
        
        // 쿨다운 감소
        if (eggCooldown > 0) eggCooldown--;

        // 화폐 획득 체크 (행복도 기반)
        const happinessCheck = happiness >= config.COIN.HAPPINESS_THRESHOLD;
        const multiplierCheck = coinMultiplier > 0;
        const randomCheck = Math.random() * 100 < config.COIN.EARN_CHANCE;
        
        if (happinessCheck && multiplierCheck && randomCheck) {
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

        // 아직 먹지 않은 사료만 고려
        const availableFeeds = currentFeeds.filter(f => !eatenFeedIds.has(f.id));

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
              happiness = Math.min(config.HAPPINESS.MAX, happiness + config.HAPPINESS.FEED_RESTORE);
              health = Math.min(config.HEALTH.MAX, health + config.HEALTH.FEED_RESTORE);
              state = 'eating';
              frame = 2;
              
              return { ...chicken, x, y, hunger, happiness, health, state, direction, frame, targetX: null, targetY: null, stage, growthProgress, eggCooldown };
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

        // 알 낳기 체크 (성체만)
        if (stage === GROWTH_STAGE.ADULT && eggCooldown <= 0 && 
            hunger >= config.EGG.MIN_HUNGER && 
            happiness >= config.EGG.MIN_HAPPINESS && 
            health >= config.EGG.MIN_HEALTH &&
            Math.random() * 100 < config.EGG.LAY_CHANCE) {
          newEggPositions.push({ x, y: y + 20 });
          eggCooldown = config.EGG.LAY_COOLDOWN;
          state = 'laying';
        }

        return { ...chicken, x, y, hunger, happiness, health, state, direction, frame, targetX, targetY, stage, growthProgress, eggCooldown };
      });

      // 2. 알 업데이트
      const updatedEggs = currentEggs.map(egg => {
        let { age, warmth, state } = egg;
        const eggConfig = config.EGG;
        
        age++;
        
        const nearChicken = updatedChickens.find(c => 
          c.stage === GROWTH_STAGE.ADULT && calculateDistance(c.x, c.y, egg.x, egg.y) < eggConfig.WARM_DISTANCE
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
    coins,
    addFeed,
    chickenCount: chickens.filter(c => c.stage === GROWTH_STAGE.ADULT).length,
    juvenileCount: chickens.filter(c => c.stage === GROWTH_STAGE.JUVENILE).length,
    chickCount: chickens.filter(c => c.stage === GROWTH_STAGE.CHICK).length,
  };
};
