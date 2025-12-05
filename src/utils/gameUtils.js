import { GAME_CONFIG } from '../constants/gameConfig';

/**
 * 두 점 사이의 거리 계산
 */
export const calculateDistance = (x1, y1, x2, y2) => {
  return Math.hypot(x2 - x1, y2 - y1);
};

/**
 * 가장 가까운 사료 찾기
 */
export const findClosestFeed = (feeds, x, y) => {
  if (feeds.length === 0) return null;
  
  let closest = feeds[0];
  let minDist = calculateDistance(x, y, feeds[0].x, feeds[0].y);
  
  feeds.forEach(feed => {
    const dist = calculateDistance(x, y, feed.x, feed.y);
    if (dist < minDist) {
      minDist = dist;
      closest = feed;
    }
  });
  
  return { feed: closest, distance: minDist };
};

/**
 * 필드 내 랜덤 위치 생성
 */
export const getRandomPosition = (fieldWidth, fieldHeight) => {
  const padding = GAME_CONFIG.CHICKEN.BOUNDARY_PADDING;
  return {
    x: Math.random() * (fieldWidth - padding * 2) + padding,
    y: Math.random() * (fieldHeight - padding * 2) + padding,
  };
};

/**
 * 경계 내로 좌표 제한
 */
export const clampPosition = (x, y, fieldWidth, fieldHeight) => {
  const padding = GAME_CONFIG.CHICKEN.BOUNDARY_PADDING;
  return {
    x: Math.max(padding, Math.min(fieldWidth - padding, x)),
    y: Math.max(padding, Math.min(fieldHeight - padding, y)),
  };
};

/**
 * 목표를 향해 이동할 때의 새 위치 계산
 */
export const moveTowardsTarget = (x, y, targetX, targetY, speed) => {
  const dx = targetX - x;
  const dy = targetY - y;
  const dist = Math.hypot(dx, dy);
  
  if (dist <= 5) {
    return { x, y, direction: dx > 0 ? 1 : -1 };
  }
  
  return {
    x: x + (dx / dist) * speed,
    y: y + (dy / dist) * speed,
    direction: dx > 0 ? 1 : -1,
  };
};

/**
 * 배고픔 색상 결정
 */
export const getHungerColor = (hunger) => {
  if (hunger > 70) return 'bg-green-500';
  if (hunger > 30) return 'bg-yellow-500';
  return 'bg-red-500';
};

/**
 * 애니메이션 프레임 결정
 */
export const getAnimationFrame = (state, currentFrame) => {
  if (state === 'eating') return 2;
  return currentFrame === 0 ? 1 : 0;
};

