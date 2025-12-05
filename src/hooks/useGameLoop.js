import { useState, useEffect, useCallback } from 'react';
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

  // 사료 추가
  const addFeed = useCallback((x, y) => {
    setFeeds(prev => [...prev, { id: Date.now(), x, y }]);
  }, []);

  // 사료 제거
  const removeFeed = useCallback((feedId) => {
    setFeeds(prev => prev.filter(f => f.id !== feedId));
  }, []);

  // 알 추가
  const addEgg = useCallback((x, y) => {
    setEggs(prev => [...prev, createEgg(x, y)]);
  }, []);

  // 알 제거 및 병아리 추가
  const hatchEgg = useCallback((eggId, x, y) => {
    setEggs(prev => prev.filter(e => e.id !== eggId));
    setChickens(prev => [...prev, createChicken(x, y, false)]);
  }, []);

  // 닭/병아리 업데이트 함수
  const updateChicken = useCallback((chicken, feeds, eggs, fieldSize) => {
    let { x, y, hunger, happiness, health, state, direction, frame, targetX, targetY, isAdult, growthProgress, eggCooldown } = chicken;
    
    const config = GAME_CONFIG;
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

    // 사료가 있으면 가장 가까운 사료로 이동
    if (feeds.length > 0) {
      const closest = findClosestFeed(feeds, x, y);
      
      if (closest) {
        targetX = closest.feed.x;
        targetY = closest.feed.y;
        state = 'seeking';

        // 사료에 도달했는지 확인
        if (closest.distance < config.FEED.REACH_DISTANCE) {
          // 먹기
          hunger = Math.min(config.HUNGER.MAX, hunger + config.HUNGER.FEED_RESTORE);
          happiness = Math.min(config.HAPPINESS.MAX, happiness + config.HAPPINESS.FEED_RESTORE);
          health = Math.min(config.HEALTH.MAX, health + config.HEALTH.FEED_RESTORE);
          state = 'eating';
          frame = 2;
          
          return { 
            chicken: { ...chicken, x, y, hunger, happiness, health, state, direction, frame, targetX: null, targetY: null, isAdult, growthProgress, eggCooldown },
            eatFeedId: closest.feed.id,
            layEgg: false,
          };
        }
      }
    } else if (hunger < config.HUNGER.HUNGRY_THRESHOLD) {
      state = 'hungry';
      if (!targetX || calculateDistance(x, y, targetX, targetY) < config.FEED.TARGET_REACH_DISTANCE) {
        const newPos = getRandomPosition(fieldSize.width, fieldSize.height);
        targetX = newPos.x;
        targetY = newPos.y;
      }
    } else {
      // 알 품기 체크 (성체만)
      if (isAdult && eggs.length > 0) {
        const nearEgg = eggs.find(egg => 
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
        const newPos = getRandomPosition(fieldSize.width, fieldSize.height);
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
      
      // 이동 시 행복도 소폭 증가
      happiness = Math.min(config.HAPPINESS.MAX, happiness + config.HAPPINESS.WALK_RESTORE);
    }

    // 경계 체크
    const clamped = clampPosition(x, y, fieldSize.width, fieldSize.height);
    x = clamped.x;
    y = clamped.y;

    // 애니메이션 프레임
    frame = getAnimationFrame(state, frame);

    // 알 낳기 체크 (성체만, 쿨다운 끝났을 때)
    let shouldLayEgg = false;
    if (isAdult && eggCooldown <= 0 && 
        hunger >= config.EGG.MIN_HUNGER && 
        happiness >= config.EGG.MIN_HAPPINESS && 
        health >= config.EGG.MIN_HEALTH &&
        Math.random() < config.EGG.LAY_CHANCE / 100) { // 낮은 확률로 체크
      shouldLayEgg = true;
      eggCooldown = config.EGG.LAY_COOLDOWN;
      state = 'laying';
    }

    return { 
      chicken: { ...chicken, x, y, hunger, happiness, health, state, direction, frame, targetX, targetY, isAdult, growthProgress, eggCooldown },
      eatFeedId: null,
      layEgg: shouldLayEgg,
    };
  }, []);

  // 게임 루프
  useEffect(() => {
    const gameLoop = setInterval(() => {
      const feedsToRemove = new Set();
      const eggsToHatch = [];
      const newEggPositions = [];

      // 닭들 업데이트
      setChickens(prevChickens => {
        return prevChickens.map(chicken => {
          const result = updateChicken(chicken, feeds, eggs, fieldSize);
          
          if (result.eatFeedId) {
            feedsToRemove.add(result.eatFeedId);
          }
          
          if (result.layEgg) {
            newEggPositions.push({ x: result.chicken.x, y: result.chicken.y + 20 });
          }
          
          return result.chicken;
        });
      });

      // 먹은 사료 제거
      if (feedsToRemove.size > 0) {
        setFeeds(prev => prev.filter(f => !feedsToRemove.has(f.id)));
      }

      // 새 알 추가
      newEggPositions.forEach(pos => addEgg(pos.x, pos.y));

      // 알 업데이트
      setEggs(prevEggs => {
        return prevEggs.map(egg => {
          let { age, warmth, state } = egg;
          const config = GAME_CONFIG.EGG;
          
          age++;
          
          // 닭이 근처에 있으면 따뜻해짐
          setChickens(chickens => {
            const nearChicken = chickens.find(c => 
              c.isAdult && calculateDistance(c.x, c.y, egg.x, egg.y) < config.WARM_DISTANCE
            );
            
            if (nearChicken) {
              warmth = Math.min(config.HATCH_WARMTH, warmth + config.WARM_RATE);
            } else {
              warmth = Math.max(0, warmth - config.COOL_RATE);
            }
            
            return chickens;
          });
          
          // 상태 업데이트
          if (warmth >= config.HATCH_WARMTH && age >= config.HATCH_TIME) {
            state = EGG_STATE.HATCHING;
            // 부화!
            eggsToHatch.push({ id: egg.id, x: egg.x, y: egg.y });
          } else if (warmth > 50) {
            state = EGG_STATE.WARM;
          } else {
            state = EGG_STATE.FRESH;
          }
          
          return { ...egg, age, warmth, state };
        });
      });

      // 부화 처리
      eggsToHatch.forEach(({ id, x, y }) => {
        hatchEgg(id, x, y);
      });

    }, GAME_CONFIG.GAME_LOOP_INTERVAL);

    return () => clearInterval(gameLoop);
  }, [feeds, eggs, fieldSize, updateChicken, addEgg, hatchEgg]);

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
