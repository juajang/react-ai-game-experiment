// 닭 스프라이트 프레임 상수
export const CHICKEN_FRAMES = {
  IDLE: 0,      // 기본 자세
  WALKING: 1,   // 걷기
  EATING: 2,    // 먹기
};

// 닭 스프라이트 색상 상수
export const CHICKEN_COLORS = {
  BODY: '#ffffff',        // 몸통 - 흰색
  BODY_SHADE: '#e5e5e5',  // 날개 음영
  TAIL: '#e0e0e0',        // 꼬리
  EYE: '#000000',         // 눈
  BEAK: '#ffb347',        // 부리 - 주황색
  COMB: '#ff6666',        // 볏 - 빨간색
  FEET: '#ff9933',        // 발 - 주황색
};

// 스프라이트 크기
export const SPRITE_SIZE = {
  WIDTH: 64,
  HEIGHT: 64,
  VIEWBOX: '0 0 16 16',
};
