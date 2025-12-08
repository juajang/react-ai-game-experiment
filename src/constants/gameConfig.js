// 게임 설정 상수
export const GAME_CONFIG = {
  // 닭 기본 설정
  CHICKEN: {
    INITIAL_X: 200,
    INITIAL_Y: 160,
    INITIAL_HUNGER: 80,              // 시작 포만감 (70 → 80)
    INITIAL_HAPPINESS: 60,           // 시작 행복도 (50 → 60)
    INITIAL_HEALTH: 100,
    SPEED: 2,
    HUNGRY_SPEED_MULTIPLIER: 1.5,
    BOUNDARY_PADDING: 30,
  },
  
  // 배고픔 관련
  HUNGER: {
    DECREASE_RATE: 0.12,             // 천천히 배고파짐 (0.25 → 0.12)
    FEED_RESTORE: 30,                // 먹이 회복량 증가 (25 → 30)
    HUNGRY_THRESHOLD: 30,            // 배고픔 임계값 (35 → 30)
    MAX: 100,
    MIN: 0,
  },
  
  // 행복도 관련
  HAPPINESS: {
    DECREASE_RATE: 0.06,             // 천천히 떨어짐 (0.15 → 0.06)
    FEED_RESTORE: 15,                // 먹이로 회복량 (12 → 15)
    WALK_RESTORE: 0.05,              // 산책 회복량 (0.03 → 0.05)
    FLOWER_BOOST: 0.15,              // 꽃 효과 증가 (0.12 → 0.15)
    MAX: 100,
    MIN: 0,
    LOW_THRESHOLD: 30,               // 낮은 행복 임계값 (40 → 30)
  },
  
  // 건강 관련
  HEALTH: {
    DECREASE_RATE: 0,                // 기본 감소 없음
    HUNGRY_DECREASE_RATE: 0.12,      // 배고프면 건강 감소 (0.3 → 0.12)
    TIRED_DECREASE_RATE: 0.08,       // 피곤하면 건강 감소 (0.2 → 0.08)
    UNHAPPY_DECREASE_RATE: 0.05,     // 불행하면 건강 감소 (0.1 → 0.05)
    FEED_RESTORE: 5,                 // 먹이로 건강 회복 (3 → 5)
    MAX: 100,
    MIN: 0,
    LOW_THRESHOLD: 40,               // 낮은 건강 임계값 (50 → 40)
    HAPPINESS_THRESHOLD: 40,         // 행복도 상승 임계값 (50 → 40)
  },
  
  // 알 관련
  EGG: {
    LAY_CHANCE: 4,                   // 알 낳을 확률 증가 (2 → 4)
    LAY_COOLDOWN: 80,                // 쿨다운 감소 (150 → 80)
    HATCH_TIME: 120,                 // 부화 시간 감소 (150 → 120)
    WARM_DISTANCE: 50,               // 따뜻해지는 거리 증가 (40 → 50)
    WARM_RATE: 1.5,                  // 따뜻해지는 속도 (1 → 1.5)
    COOL_RATE: 0.3,                  // 천천히 식음 (0.8 → 0.3)
    HATCH_WARMTH: 100,
    // 알 낳기 조건 (완화)
    MIN_HUNGER: 40,                  // (60 → 40)
    MIN_HAPPINESS: 35,               // (50 → 35)
    MIN_HEALTH: 50,                  // (70 → 50)
  },
  
  // 병아리 관련
  CHICK: {
    SPEED: 1.2,
    GROWTH_TIME: 120,                // 성장 시간 감소 (200 → 120)
    INITIAL_HUNGER: 70,              // 시작 포만감 (50 → 70)
    INITIAL_HAPPINESS: 70,           // 시작 행복도 (50 → 70)
    INITIAL_HEALTH: 100,             // 시작 건강 (80 → 100)
    HUNGER_DECREASE_RATE: 0.1,       // 천천히 배고파짐 (0.2 → 0.1)
  },
  
  // 청소년 관련
  JUVENILE: {
    SPEED: 1.8,
    GROWTH_TIME: 150,                // 성장 시간 감소 (250 → 150)
    HUNGER_DECREASE_RATE: 0.08,      // 천천히 배고파짐 (0.18 → 0.08)
  },
  
  // 사료 관련
  FEED: {
    REACH_DISTANCE: 15,
    TARGET_REACH_DISTANCE: 10,
    COST: 3,                         // 가격 인하 (8 → 3)
  },
  
  // 꽃 관련
  FLOWER: {
    COST: 10,                        // 가격 인하 (20 → 10)
    EFFECT_RADIUS: 70,               // 효과 범위 증가 (50 → 70)
    HAPPINESS_BOOST: 0.15,           // 효과 증가
  },
  
  // 연못 관련
  POND: {
    COST: 25,                        // 가격 인하 (40 → 25)
    EFFECT_RADIUS: 80,               // 효과 범위 증가 (60 → 80)
    HEALTH_BOOST: 0.2,               // 효과 증가 (0.15 → 0.2)
  },
  
  // 풍차 관련 (황금 농장 전용)
  WINDMILL: {
    COST: 100,                       // 높은 가격 (황금 농장 전용)
    EFFECT_RADIUS: 100,              // 넓은 효과 범위
    ALL_BOOST: 0.1,                  // 모든 스탯 소폭 증가
  },
  
  // 꽃덤불 관련
  FLOWER_BUSH: {
    COST: 20,                        // 중간 가격
    EFFECT_RADIUS: 55,               // 효과 범위
    HAPPINESS_BOOST: 0.2,            // 꽃보다 강한 행복도 효과
  },
  
  // 똥 관련
  POOP: {
    DROP_CHANCE: 2,                  // 똥 싸는 확률 (2%)
    EFFECT_RADIUS: 50,               // 영향 범위
    HAPPINESS_PENALTY: 0.15,         // 주변 닭 행복도 감소
    STINK_THRESHOLD: 50,             // 냄새나기 시작하는 나이
    MAX_AGE: 200,                    // 최대 방치 시간 (사라지지 않음, 효과만 강해짐)
  },
  
  // 짚단 우주선 관련
  SPACESHIP: {
    COST: 500,                       // 높은 가격 (엔드게임 컨텐츠)
    REQUIRED_ITEMS: {                // 필요 재료
      metal_scrap: 3,                // 신기한 금속 조각 3개
      blueprint: 1,                  // 우주선 설계도 조각 1개
      fuel_cell: 1,                  // 연료 전지 1개
    },
  },
  
  // 닭의 성 관련
  MANSION: {
    COST: 200,                       // 200코인
    REQUIRED_ITEMS: {                // 필요 재료
      twisted_vine: 1,               // 비틀어진 덩굴줄기 1개
      branch_pile: 3,                // 나뭇가지 더미 3개
    },
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
  
  // 화폐 관련
  COIN: {
    HAPPINESS_THRESHOLD: 30,         // 낮은 행복도에서도 획득 (40 → 30)
    EARN_CHANCE: 20,                 // 돈 획득 확률 증가 (10 → 20)
    EARN_AMOUNT: 2,                  // 획득 금액 증가 (1 → 2)
    ADULT_MULTIPLIER: 1,
    JUVENILE_MULTIPLIER: 0.5,
    CHICK_MULTIPLIER: 0,
  },
  
  // 피로 관련
  TIREDNESS: {
    INCREASE_RATE: 0.1,              // 천천히 피곤해짐 (0.25 → 0.1)
    TIRED_THRESHOLD: 75,             // 늦게 피곤 상태 (60 → 75)
    EXHAUSTED_THRESHOLD: 90,         // 늦게 탈진 (80 → 90)
    MAX: 100,
    MIN: 0,
  },
  
  // 닭집 관련
  COOP: {
    CAPACITY: 4,                     // 수용 인원 증가 (3 → 4)
    SLEEP_RECOVERY_RATE: 3,          // 피로 회복 속도 증가 (1.5 → 3)
    HEALTH_RECOVERY_RATE: 1,         // 건강 회복 속도 증가 (0.3 → 1)
    MIN_SLEEP_TIME: 30,              // 최소 수면 시간 감소 (60 → 30)
    ENTER_DISTANCE: 40,              // 닭집 입장 거리 (30 → 40)
    COST: 35,                        // 가격 인하 (60 → 35)
  },
};

// 상태 텍스트
export const STATE_TEXT = {
  idle: '🚶 산책 중',
  seeking: '🔍 먹이 찾는 중',
  eating: '🍽️ 냠냠',
  hungry: '😢 배고파요!',
  laying: '🥚 알 낳는 중',
  warming: '🐣 알 품는 중',
  tired: '😪 피곤해요',
  goingToCoop: '🏠 닭집 가는 중',
  sleeping: '😴 잠자는 중',
  dying: '💀 위험!',
  default: '🐔',
};

// 병아리 상태 텍스트
export const CHICK_STATE_TEXT = {
  idle: '🐥 삐약삐약',
  seeking: '🔍 먹이 찾는 중',
  eating: '🍽️ 쪼아쪼아',
  hungry: '😢 배고파요!',
  dying: '💀 위험!',
  default: '🐥',
};

// 청소년 상태 텍스트
export const JUVENILE_STATE_TEXT = {
  idle: '🐤 산책 중',
  seeking: '🔍 먹이 찾는 중',
  eating: '🍽️ 냠냠',
  hungry: '😢 배고파요!',
  dying: '💀 위험!',
  default: '🐤',
};

// 성장 단계
export const GROWTH_STAGE = {
  CHICK: 'chick',
  JUVENILE: 'juvenile',
  ADULT: 'adult',
};

// 알 상태
export const EGG_STATE = {
  FRESH: 'fresh',
  WARM: 'warm',
  HATCHING: 'hatching',
};

// 농장 등급
export const FARM_GRADE = {
  CHICK_FARM: {
    level: 1,
    name: '🐥 병아리 농장',
    minChickens: 0,
    maxChickens: 4,
    color: '#fef3c7',
  },
  CHICKEN_FARM: {
    level: 2,
    name: '🐔 닭 농장',
    minChickens: 5,
    maxChickens: 9,
    color: '#fed7aa',
  },
  GOLDEN_FARM: {
    level: 3,
    name: '✨ 황금 닭 농장',
    minChickens: 10,
    maxChickens: Infinity,
    color: '#fef08a',
  },
};

// 게임 상태
export const GAME_STATE = {
  PLAYING: 'playing',
  GAME_OVER: 'gameOver',
  GAME_CLEAR: 'gameClear',
};
