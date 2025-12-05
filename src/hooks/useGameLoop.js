import { useState, useEffect, useCallback } from 'react';
import { GAME_CONFIG } from '../constants/gameConfig';
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
const getInitialChickenState = () => ({
  x: GAME_CONFIG.CHICKEN.INITIAL_X,
  y: GAME_CONFIG.CHICKEN.INITIAL_Y,
  hunger: GAME_CONFIG.CHICKEN.INITIAL_HUNGER,
  state: 'idle',
  direction: 1,
  frame: 0,
  targetX: null,
  targetY: null,
});

/**
 * 게임 루프를 관리하는 커스텀 훅
 */
export const useGameLoop = (fieldSize) => {
  const [chicken, setChicken] = useState(getInitialChickenState);
  const [feeds, setFeeds] = useState([]);

  // 사료 추가
  const addFeed = useCallback((x, y) => {
    setFeeds(prev => [...prev, { id: Date.now(), x, y }]);
  }, []);

  // 사료 제거
  const removeFeed = useCallback((feedId) => {
    setFeeds(prev => prev.filter(f => f.id !== feedId));
  }, []);

  // 게임 루프
  useEffect(() => {
    const gameLoop = setInterval(() => {
      setChicken(prev => {
        let { x, y, hunger, state, direction, frame, targetX, targetY } = prev;
        const { CHICKEN, HUNGER, FEED, RANDOM_MOVE_CHANCE } = GAME_CONFIG;

        // 배고픔 감소
        hunger = Math.max(HUNGER.MIN, hunger - HUNGER.DECREASE_RATE);

        // 사료가 있으면 가장 가까운 사료로 이동
        if (feeds.length > 0) {
          const closest = findClosestFeed(feeds, x, y);
          
          if (closest) {
            targetX = closest.feed.x;
            targetY = closest.feed.y;
            state = 'seeking';

            // 사료에 도달했는지 확인
            if (closest.distance < FEED.REACH_DISTANCE) {
              removeFeed(closest.feed.id);
              hunger = Math.min(HUNGER.MAX, hunger + HUNGER.FEED_RESTORE);
              state = 'eating';
              frame = 2;
              return { ...prev, x, y, hunger, state, direction, frame, targetX: null, targetY: null };
            }
          }
        } else if (hunger < HUNGER.HUNGRY_THRESHOLD) {
          // 배고프면 더 빠르게 랜덤 이동
          state = 'hungry';
          if (!targetX || calculateDistance(x, y, targetX, targetY) < FEED.TARGET_REACH_DISTANCE) {
            const newPos = getRandomPosition(fieldSize.width, fieldSize.height);
            targetX = newPos.x;
            targetY = newPos.y;
          }
        } else {
          // 평화롭게 산책
          state = 'idle';
          if (!targetX || calculateDistance(x, y, targetX, targetY) < FEED.TARGET_REACH_DISTANCE || Math.random() < RANDOM_MOVE_CHANCE) {
            const newPos = getRandomPosition(fieldSize.width, fieldSize.height);
            targetX = newPos.x;
            targetY = newPos.y;
          }
        }

        // 목표를 향해 이동
        if (targetX !== null && targetY !== null) {
          const speed = state === 'hungry' 
            ? CHICKEN.SPEED * CHICKEN.HUNGRY_SPEED_MULTIPLIER 
            : CHICKEN.SPEED;
          
          const movement = moveTowardsTarget(x, y, targetX, targetY, speed);
          x = movement.x;
          y = movement.y;
          direction = movement.direction;
        }

        // 경계 체크
        const clamped = clampPosition(x, y, fieldSize.width, fieldSize.height);
        x = clamped.x;
        y = clamped.y;

        // 애니메이션 프레임
        frame = getAnimationFrame(state, frame);

        return { x, y, hunger, state, direction, frame, targetX, targetY };
      });
    }, GAME_CONFIG.GAME_LOOP_INTERVAL);

    return () => clearInterval(gameLoop);
  }, [feeds, fieldSize, removeFeed]);

  return { chicken, feeds, addFeed };
};

