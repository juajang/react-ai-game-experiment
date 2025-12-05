// 게임 설정 상수
export const GAME_CONFIG = {
  // 닭 기본 설정
  CHICKEN: {
    INITIAL_X: 200,
    INITIAL_Y: 160,
    INITIAL_HUNGER: 80,
    INITIAL_HAPPINESS: 70,
    INITIAL_HEALTH: 100,
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
  
  // 행복도 관련
  HAPPINESS: {
    DECREASE_RATE: 0.02,
    FEED_RESTORE: 10,
    WALK_RESTORE: 0.01,
    MAX: 100,
    MIN: 0,
    LOW_THRESHOLD: 40,
  },
  
  // 건강 관련
  HEALTH: {
    DECREASE_RATE: 0.01,
    FEED_RESTORE: 5,
    MAX: 100,
    MIN: 0,
    LOW_THRESHOLD: 60,
  },
  
  // 알 관련
  EGG: {
    LAY_CHANCE: 3,                 // 알 낳을 확률 3% (매 틱마다 체크)
    LAY_COOLDOWN: 100,             // 쿨다운 (100 틱 = 10초)
    HATCH_TIME: 150,               // 부화까지 필요한 시간 (150 틱 = 15초)
    WARM_DISTANCE: 40,             // 닭이 이 거리 안에 있으면 알이 따뜻해짐
    WARM_RATE: 1,                  // 따뜻해지는 속도
    COOL_RATE: 0.5,                // 식는 속도
    HATCH_WARMTH: 100,             // 부화에 필요한 따뜻함
    // 알 낳기 조건
    MIN_HUNGER: 50,
    MIN_HAPPINESS: 40,
    MIN_HEALTH: 60,
  },
  
  // 병아리 관련
  CHICK: {
    SPEED: 1.5,
    GROWTH_TIME: 500,              // 성체가 되기까지 시간 (500 틱 = 50초)
    INITIAL_HUNGER: 60,
    INITIAL_HAPPINESS: 80,
    INITIAL_HEALTH: 100,
    HUNGER_DECREASE_RATE: 0.08,    // 병아리는 더 빨리 배고파짐
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
  seeking: '🔍 먹이 찾는 중',
  eating: '🍽️ 냠냠',
  hungry: '😢 배고파요!',
  laying: '🥚 알 낳는 중',
  warming: '🐣 알 품는 중',
  default: '🐔',
};

// 병아리 상태 텍스트
export const CHICK_STATE_TEXT = {
  idle: '🐥 삐약삐약',
  seeking: '🔍 먹이 찾는 중',
  eating: '🍽️ 쪼아쪼아',
  hungry: '😢 배고파요!',
  default: '🐥',
};

// 알 상태
export const EGG_STATE = {
  FRESH: 'fresh',
  WARM: 'warm',
  HATCHING: 'hatching',
};
