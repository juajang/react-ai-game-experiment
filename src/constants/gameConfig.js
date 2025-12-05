// 게임 설정 상수
export const GAME_CONFIG = {
  // 닭 기본 설정
  CHICKEN: {
    INITIAL_X: 200,
    INITIAL_Y: 160,
    INITIAL_HUNGER: 70,              // 시작 포만감 감소 (80 → 70)
    INITIAL_HAPPINESS: 50,
    INITIAL_HEALTH: 100,
    SPEED: 2,
    HUNGRY_SPEED_MULTIPLIER: 1.5,
    BOUNDARY_PADDING: 30,
  },
  
  // 배고픔 관련
  HUNGER: {
    DECREASE_RATE: 0.25,             // 더 빨리 배고파짐 (0.15 → 0.25)
    FEED_RESTORE: 25,
    HUNGRY_THRESHOLD: 35,            // 배고픔 임계값 상승 (30 → 35)
    MAX: 100,
    MIN: 0,
  },
  
  // 행복도 관련
  HAPPINESS: {
    DECREASE_RATE: 0.15,             // 더 빨리 떨어짐 (0.08 → 0.15)
    FEED_RESTORE: 12,                // 먹이로 회복량 감소 (15 → 12)
    WALK_RESTORE: 0.03,              // 산책 회복량 감소 (0.05 → 0.03)
    FLOWER_BOOST: 0.12,              // 꽃 효과 약간 증가 (0.1 → 0.12)
    MAX: 100,
    MIN: 0,
    LOW_THRESHOLD: 40,
  },
  
  // 건강 관련
  HEALTH: {
    DECREASE_RATE: 0,                // 기본 감소 없음 (조건에 따라 감소)
    HUNGRY_DECREASE_RATE: 0.3,       // 배고프면 건강 더 빨리 감소 (0.15 → 0.3)
    TIRED_DECREASE_RATE: 0.2,        // 피곤하면 건강 더 빨리 감소 (0.1 → 0.2)
    UNHAPPY_DECREASE_RATE: 0.1,      // 불행하면 건강 감소 (NEW)
    FEED_RESTORE: 3,                 // 먹이로 건강 회복 감소 (5 → 3)
    MAX: 100,
    MIN: 0,
    LOW_THRESHOLD: 50,               // 낮은 건강 임계값 낮춤 (60 → 50)
    HAPPINESS_THRESHOLD: 50,         // 건강이 이 이상이어야 행복도 상승
  },
  
  // 알 관련
  EGG: {
    LAY_CHANCE: 2,                   // 알 낳을 확률 감소 (3 → 2)
    LAY_COOLDOWN: 150,               // 쿨다운 증가 (100 → 150)
    HATCH_TIME: 150,                 // 부화까지 필요한 시간 (150 틱 = 15초)
    WARM_DISTANCE: 40,               // 닭이 이 거리 안에 있으면 알이 따뜻해짐
    WARM_RATE: 1,                    // 따뜻해지는 속도
    COOL_RATE: 0.8,                  // 더 빨리 식음 (0.5 → 0.8)
    HATCH_WARMTH: 100,               // 부화에 필요한 따뜻함
    // 알 낳기 조건 (더 어려움)
    MIN_HUNGER: 60,                  // (50 → 60)
    MIN_HAPPINESS: 50,               // (40 → 50)
    MIN_HEALTH: 70,                  // (60 → 70)
  },
  
  // 병아리 관련
  CHICK: {
    SPEED: 1.2,
    GROWTH_TIME: 200,                // 성장 시간 증가 (150 → 200)
    INITIAL_HUNGER: 50,              // 시작 포만감 감소 (60 → 50)
    INITIAL_HAPPINESS: 50,           // 시작 행복도 감소 (60 → 50)
    INITIAL_HEALTH: 80,              // 시작 건강 감소 (100 → 80)
    HUNGER_DECREASE_RATE: 0.2,       // 더 빨리 배고파짐 (0.12 → 0.2)
  },
  
  // 청소년 관련
  JUVENILE: {
    SPEED: 1.8,
    GROWTH_TIME: 250,                // 성장 시간 증가 (200 → 250)
    HUNGER_DECREASE_RATE: 0.18,      // 더 빨리 배고파짐 (0.10 → 0.18)
  },
  
  // 사료 관련
  FEED: {
    REACH_DISTANCE: 15,
    TARGET_REACH_DISTANCE: 10,
    COST: 8,                         // 가격 인상 (5 → 8)
  },
  
  // 꽃 관련
  FLOWER: {
    COST: 20,                        // 가격 인상 (15 → 20)
    EFFECT_RADIUS: 50,               // 효과 범위 감소 (60 → 50)
    HAPPINESS_BOOST: 0.12,           // 범위 내 행복도 증가
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
    HAPPINESS_THRESHOLD: 40,         // 더 높은 행복도 필요 (30 → 40)
    EARN_CHANCE: 10,                 // 돈 획득 확률 감소 (15 → 10)
    EARN_AMOUNT: 1,                  // 획득 금액
    ADULT_MULTIPLIER: 1,             // 성체 배율
    JUVENILE_MULTIPLIER: 0.5,        // 청소년 배율
    CHICK_MULTIPLIER: 0,             // 병아리는 돈 못 벌어요
  },
  
  // 피로 관련
  TIREDNESS: {
    INCREASE_RATE: 0.25,             // 더 빨리 피곤해짐 (0.15 → 0.25)
    TIRED_THRESHOLD: 60,             // 더 빨리 피곤 상태 (70 → 60)
    EXHAUSTED_THRESHOLD: 80,         // 더 빨리 탈진 (90 → 80)
    MAX: 100,
    MIN: 0,
  },
  
  // 닭집 관련
  COOP: {
    CAPACITY: 3,                     // 닭집당 수용 가능 닭 수
    SLEEP_RECOVERY_RATE: 1.5,        // 피로 회복 속도 감소 (2 → 1.5)
    HEALTH_RECOVERY_RATE: 0.3,       // 건강 회복 속도 감소 (0.5 → 0.3)
    MIN_SLEEP_TIME: 60,              // 최소 수면 시간 증가 (50 → 60)
    ENTER_DISTANCE: 30,              // 닭집 입장 거리
    COST: 60,                        // 가격 인상 (50 → 60)
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
