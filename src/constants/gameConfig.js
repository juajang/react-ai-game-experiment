// 게임 설정 상수
export const GAME_CONFIG = {
  // 닭 기본 설정
  CHICKEN: {
    INITIAL_X: 200,
    INITIAL_Y: 160,
    INITIAL_HUNGER: 80,
    SPEED: 2,
    HUNGRY_SPEED_MULTIPLIER: 1.5,
    BOUNDARY_PADDING: 30,
  },
  
  // 배고픔 관련
  HUNGER: {
    DECREASE_RATE: 0.05,
    FEED_RESTORE: 25,
    HUNGRY_THRESHOLD: 30,
    MAX: 100,
    MIN: 0,
  },
  
  // 사료 관련
  FEED: {
    REACH_DISTANCE: 15,
    TARGET_REACH_DISTANCE: 10,
  },
  
  // 필드 관련
  FIELD: {
    DEFAULT_WIDTH: 400,
    DEFAULT_HEIGHT: 320,
    GRASS_COUNT: 20,
  },
  
  // 게임 루프
  GAME_LOOP_INTERVAL: 100,
  
  // 랜덤 이동 확률
  RANDOM_MOVE_CHANCE: 0.01,
};

// 상태 텍스트
export const STATE_TEXT = {
  idle: '🚶 산책 중',
  seeking: '🔍 사료 찾는 중',
  eating: '🍽️ 냠냠',
  hungry: '😢 배고파요!',
  default: '🐔',
};

