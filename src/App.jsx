import { useState, useEffect, useCallback, useRef } from 'react';

// 닭 스프라이트 컴포넌트 (도트 아트)
const ChickenSprite = ({ frame, direction }) => {
  const sprites = [
    // Frame 0 - 기본
    `
      ⬜⬜🟡🟡⬜⬜
      ⬜🟡🟡🟡🟡⬜
      ⬜🟡⬛🟡⬛⬜
      ⬜⬜🟠🟠⬜⬜
      ⬜🟤🟤🟤🟤⬜
      🟤🟤🟤🟤🟤🟤
      🟤🟤🟤🟤🟤🟤
      ⬜🟠⬜⬜🟠⬜
    `,
    // Frame 1 - 걷기
    `
      ⬜⬜🟡🟡⬜⬜
      ⬜🟡🟡🟡🟡⬜
      ⬜🟡⬛🟡⬛⬜
      ⬜⬜🟠🟠⬜⬜
      ⬜🟤🟤🟤🟤⬜
      🟤🟤🟤🟤🟤🟤
      🟤🟤🟤🟤🟤🟤
      🟠⬜⬜⬜⬜🟠
    `,
    // Frame 2 - 먹기
    `
      ⬜⬜🟡🟡⬜⬜
      ⬜🟡🟡🟡🟡⬜
      ⬜🟡⬛🟡⬛⬜
      ⬜⬜🟠⬜⬜⬜
      ⬜🟤🟤🟠🟤⬜
      🟤🟤🟤🟤🟤🟤
      🟤🟤🟤🟤🟤🟤
      ⬜🟠⬜⬜🟠⬜
    `
  ];
  
  return (
    <div 
      className="text-xs leading-none whitespace-pre font-mono"
      style={{ 
        transform: direction < 0 ? 'scaleX(-1)' : 'scaleX(1)',
        fontSize: '8px',
        lineHeight: '8px'
      }}
    >
      {sprites[frame]}
    </div>
  );
};

// 사료 컴포넌트
const Feed = ({ x, y }) => (
  <div 
    className="absolute w-4 h-4 flex items-center justify-center"
    style={{ left: x - 8, top: y - 8 }}
  >
    <span className="text-lg">🌾</span>
  </div>
);

// 닭 컴포넌트
const Chicken = ({ x, y, frame, direction, state }) => (
  <div 
    className="absolute transition-all duration-100"
    style={{ left: x - 24, top: y - 32 }}
  >
    <ChickenSprite frame={frame} direction={direction} />
    {state === 'eating' && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs">😋</div>
    )}
  </div>
);

// 상태바 컴포넌트
const StatusBar = ({ hunger, state }) => {
  const getHungerColor = () => {
    if (hunger > 70) return 'bg-green-500';
    if (hunger > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const getStateText = () => {
    switch(state) {
      case 'idle': return '🚶 산책 중';
      case 'seeking': return '🔍 사료 찾는 중';
      case 'eating': return '🍽️ 냠냠';
      case 'hungry': return '😢 배고파요!';
      default: return '🐔';
    }
  };
  
  return (
    <div className="bg-amber-100 p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-amber-800">🐔 닭의 상태</span>
        <span className="text-sm bg-amber-200 px-2 py-1 rounded">{getStateText()}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-amber-700">포만감:</span>
        <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${getHungerColor()}`}
            style={{ width: `${hunger}%` }}
          />
        </div>
        <span className="text-sm font-bold text-amber-800">{Math.round(hunger)}%</span>
      </div>
    </div>
  );
};

// 플레이 필드 컴포넌트
const Field = ({ children, onClick }) => (
  <div 
    className="relative w-full h-80 bg-gradient-to-b from-green-300 to-green-400 rounded-lg overflow-hidden cursor-pointer border-4 border-amber-600 shadow-inner"
    onClick={onClick}
    style={{
      backgroundImage: `
        radial-gradient(circle at 20% 30%, rgba(34,197,94,0.3) 0%, transparent 20%),
        radial-gradient(circle at 80% 70%, rgba(34,197,94,0.3) 0%, transparent 20%),
        radial-gradient(circle at 50% 50%, rgba(34,197,94,0.2) 0%, transparent 30%)
      `
    }}
  >
    {/* 잔디 패턴 */}
    {[...Array(20)].map((_, i) => (
      <div 
        key={i}
        className="absolute text-green-600 opacity-30"
        style={{ 
          left: `${(i * 37) % 100}%`, 
          top: `${(i * 23) % 100}%`,
          fontSize: '10px'
        }}
      >
        ⌇
      </div>
    ))}
    {children}
  </div>
);

// 메인 게임 컴포넌트
export default function ChickenGame() {
  const fieldRef = useRef(null);
  const [chicken, setChicken] = useState({
    x: 200,
    y: 160,
    hunger: 80,
    state: 'idle',
    direction: 1,
    frame: 0,
    targetX: null,
    targetY: null
  });
  const [feeds, setFeeds] = useState([]);
  const [fieldSize, setFieldSize] = useState({ width: 400, height: 320 });
  
  // 사료 배치
  const handleFieldClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setFeeds(prev => [...prev, { id: Date.now(), x, y }]);
  }, []);
  
  // 게임 루프
  useEffect(() => {
    const gameLoop = setInterval(() => {
      setChicken(prev => {
        let { x, y, hunger, state, direction, frame, targetX, targetY } = prev;
        const speed = 2;
        
        // 배고픔 감소
        hunger = Math.max(0, hunger - 0.05);
        
        // 상태 결정
        if (feeds.length > 0) {
          // 가장 가까운 사료 찾기
          let closest = feeds[0];
          let minDist = Math.hypot(feeds[0].x - x, feeds[0].y - y);
          feeds.forEach(f => {
            const dist = Math.hypot(f.x - x, f.y - y);
            if (dist < minDist) {
              minDist = dist;
              closest = f;
            }
          });
          
          targetX = closest.x;
          targetY = closest.y;
          state = 'seeking';
          
          // 사료에 도달했는지 확인
          if (minDist < 15) {
            setFeeds(prev => prev.filter(f => f.id !== closest.id));
            hunger = Math.min(100, hunger + 25);
            state = 'eating';
            frame = 2;
            return { ...prev, x, y, hunger, state, direction, frame, targetX: null, targetY: null };
          }
        } else if (hunger < 30) {
          state = 'hungry';
          // 배고프면 더 빠르게 랜덤 이동
          if (!targetX || Math.hypot(targetX - x, targetY - y) < 10) {
            targetX = Math.random() * (fieldSize.width - 60) + 30;
            targetY = Math.random() * (fieldSize.height - 60) + 30;
          }
        } else {
          state = 'idle';
          // 랜덤 목표 설정
          if (!targetX || Math.hypot(targetX - x, targetY - y) < 10 || Math.random() < 0.01) {
            targetX = Math.random() * (fieldSize.width - 60) + 30;
            targetY = Math.random() * (fieldSize.height - 60) + 30;
          }
        }
        
        // 목표를 향해 이동
        if (targetX !== null && targetY !== null) {
          const dx = targetX - x;
          const dy = targetY - y;
          const dist = Math.hypot(dx, dy);
          
          if (dist > 5) {
            const moveSpeed = state === 'hungry' ? speed * 1.5 : speed;
            x += (dx / dist) * moveSpeed;
            y += (dy / dist) * moveSpeed;
            direction = dx > 0 ? 1 : -1;
          }
        }
        
        // 경계 체크
        x = Math.max(30, Math.min(fieldSize.width - 30, x));
        y = Math.max(30, Math.min(fieldSize.height - 30, y));
        
        // 애니메이션 프레임
        frame = state === 'eating' ? 2 : (frame === 0 ? 1 : 0);
        
        return { x, y, hunger, state, direction, frame, targetX, targetY };
      });
    }, 100);
    
    return () => clearInterval(gameLoop);
  }, [feeds, fieldSize]);
  
  // 필드 크기 감지
  useEffect(() => {
    const updateSize = () => {
      if (fieldRef.current) {
        const rect = fieldRef.current.getBoundingClientRect();
        setFieldSize({ width: rect.width, height: rect.height });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  return (
    <div className="min-h-screen bg-amber-50 p-4">
      <div className="max-w-lg mx-auto">
        {/* 타이틀 */}
        <h1 className="text-2xl font-bold text-center text-amber-800 mb-4">
          🐔 닭 시뮬레이션 🌾
        </h1>
        
        {/* 상태바 */}
        <StatusBar hunger={chicken.hunger} state={chicken.state} />
        
        {/* 플레이 필드 */}
        <div className="mt-4" ref={fieldRef}>
          <Field onClick={handleFieldClick}>
            {/* 사료들 */}
            {feeds.map(feed => (
              <Feed key={feed.id} x={feed.x} y={feed.y} />
            ))}
            
            {/* 닭 */}
            <Chicken 
              x={chicken.x} 
              y={chicken.y} 
              frame={chicken.frame}
              direction={chicken.direction}
              state={chicken.state}
            />
          </Field>
        </div>
        
        {/* 안내 UI */}
        <div className="mt-4 bg-amber-100 p-3 rounded-lg text-center">
          <p className="text-amber-700">
            👆 <span className="font-bold">필드를 클릭</span>해서 사료를 놓아주세요!
          </p>
          <p className="text-xs text-amber-600 mt-1">
            닭이 배고프면 사료를 찾아 먹어요
          </p>
        </div>
        
        {/* 사료 개수 표시 */}
        <div className="mt-2 flex justify-center gap-4 text-sm text-amber-700">
          <span>🌾 사료: {feeds.length}개</span>
        </div>
      </div>
    </div>
  );
}

