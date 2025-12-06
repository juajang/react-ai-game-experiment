import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

// 발사 불꽃 애니메이션
const LaunchFlames = ({ isLaunching }) => (
  <svg 
    width="60" 
    height="40" 
    viewBox="0 0 60 40" 
    xmlns="http://www.w3.org/2000/svg"
    style={{
      position: 'absolute',
      bottom: '-45px',
      left: '10px',
      opacity: isLaunching ? 1 : 0,
      transition: 'opacity 0.3s',
      pointerEvents: 'none',
    }}
  >
    {/* 불꽃 외곽 - 주황색 */}
    <ellipse cx="30" cy="10" rx="20" ry="8" fill="#ff6b35">
      <animate attributeName="ry" values="8;12;8" dur="0.15s" repeatCount="indefinite"/>
    </ellipse>
    <ellipse cx="30" cy="20" rx="15" ry="15" fill="#ff6b35">
      <animate attributeName="ry" values="15;20;15" dur="0.12s" repeatCount="indefinite"/>
    </ellipse>
    
    {/* 불꽃 중앙 - 노란색 */}
    <ellipse cx="30" cy="10" rx="12" ry="5" fill="#ffd700">
      <animate attributeName="ry" values="5;8;5" dur="0.1s" repeatCount="indefinite"/>
    </ellipse>
    <ellipse cx="30" cy="18" rx="8" ry="10" fill="#ffd700">
      <animate attributeName="ry" values="10;14;10" dur="0.08s" repeatCount="indefinite"/>
    </ellipse>
    
    {/* 불꽃 코어 - 흰색 */}
    <ellipse cx="30" cy="12" rx="5" ry="6" fill="#fff">
      <animate attributeName="ry" values="6;9;6" dur="0.1s" repeatCount="indefinite"/>
    </ellipse>
  </svg>
);

// 흰색 깃털 하나 (픽셀아트)
const WhiteFeather = ({ x, y, rotation = 0, scale = 1 }) => {
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`}>
      {/* 깃털 줄기 */}
      <rect x="6" y="10" width="1" height="2" fill="#e8e4dc"/>
      <rect x="6" y="8" width="1" height="2" fill="#f0ece4"/>
      
      {/* 깃털 몸통 - 흰색/크림 */}
      <rect x="4" y="6" width="1" height="3" fill="#fdfcfa"/>
      <rect x="5" y="4" width="1" height="5" fill="#ffffff"/>
      <rect x="6" y="2" width="1" height="6" fill="#fefefe"/>
      <rect x="7" y="3" width="1" height="5" fill="#ffffff"/>
      <rect x="8" y="5" width="1" height="3" fill="#fdfcfa"/>
      
      {/* 깃털 끝 */}
      <rect x="5" y="2" width="1" height="2" fill="#fafafa"/>
      <rect x="6" y="0" width="1" height="2" fill="#f8f8f8"/>
      <rect x="7" y="1" width="1" height="2" fill="#fafafa"/>
      
      {/* 깃털 테두리 (연한 그림자) */}
      <rect x="4" y="9" width="1" height="1" fill="#e0dcd4" opacity="0.5"/>
      <rect x="8" y="8" width="1" height="1" fill="#e0dcd4" opacity="0.5"/>
    </g>
  );
};

// 하단 깃털 다발 (좌우대칭, 원형 배치)
const BottomFeatherCluster = () => (
  <g>
    {/* === 왼쪽 깃털들 (하단에서 왼쪽으로 퍼짐) === */}
    <WhiteFeather x={4} y={18} rotation={-130} scale={0.9} />
    <WhiteFeather x={2} y={20} rotation={-150} scale={0.85} />
    <WhiteFeather x={6} y={21} rotation={-110} scale={0.8} />
    <WhiteFeather x={0} y={22} rotation={-165} scale={0.75} />
    <WhiteFeather x={5} y={23} rotation={-125} scale={0.7} />
    
    {/* === 오른쪽 깃털들 (하단에서 오른쪽으로 퍼짐) - 좌우대칭 === */}
    <WhiteFeather x={24} y={18} rotation={130} scale={0.9} />
    <WhiteFeather x={26} y={20} rotation={150} scale={0.85} />
    <WhiteFeather x={22} y={21} rotation={110} scale={0.8} />
    <WhiteFeather x={28} y={22} rotation={165} scale={0.75} />
    <WhiteFeather x={23} y={23} rotation={125} scale={0.7} />
    
    {/* === 중앙 하단 깃털들 (아래로 향함) === */}
    <WhiteFeather x={12} y={22} rotation={180} scale={0.85} />
    <WhiteFeather x={16} y={22} rotation={180} scale={0.85} />
    <WhiteFeather x={14} y={24} rotation={180} scale={0.75} />
  </g>
);

// 짚단 우주선 본체
const SpaceshipBody = () => (
  <svg 
    width="80" 
    height="85" 
    viewBox="0 0 32 32" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ imageRendering: 'pixelated' }}
  >
    {/* ===== 각진 로켓 몸통 (사각형) ===== */}
    {/* 외곽 - 어두운 짚색 */}
    <rect x="10" y="4" width="12" height="16" fill="#c4a574" rx="0"/>
    {/* 내부 - 밝은 짚색 */}
    <rect x="11" y="5" width="10" height="14" fill="#deb887"/>
    {/* 하이라이트 */}
    <rect x="12" y="6" width="8" height="12" fill="#f5deb3"/>
    
    {/* 짚 세로 텍스처 */}
    <rect x="13" y="5" width="1" height="14" fill="#c4a574" opacity="0.4"/>
    <rect x="16" y="5" width="1" height="14" fill="#c4a574" opacity="0.4"/>
    <rect x="19" y="5" width="1" height="14" fill="#c4a574" opacity="0.4"/>
    
    {/* 짚 묶음 밴드 */}
    <rect x="10" y="7" width="12" height="2" fill="#a0522d"/>
    <rect x="10" y="14" width="12" height="2" fill="#a0522d"/>
    
    {/* ===== 꼭대기 (삼각형 뾰족) ===== */}
    <polygon points="16,0 22,4 10,4" fill="#deb887" stroke="#c4a574" strokeWidth="0.5"/>
    <polygon points="16,1 20,4 12,4" fill="#f5deb3"/>
    
    {/* 꼭대기 깃털 장식 */}
    <rect x="15" y="-3" width="2" height="3" fill="#ffd54f"/>
    <rect x="15" y="-4" width="2" height="1" fill="#ffe082"/>
    <rect x="14" y="-2" width="1" height="2" fill="#ffe082" opacity="0.7"/>
    <rect x="17" y="-2" width="1" height="2" fill="#ffe082" opacity="0.7"/>
    
    {/* ===== 창문 (사각형) ===== */}
    <rect x="12" y="9" width="8" height="4" fill="#87CEEB" stroke="#5d4037" strokeWidth="1"/>
    <rect x="13" y="9.5" width="6" height="3" fill="#b0e0e6"/>
    {/* 창문 반사 */}
    <rect x="13" y="9.5" width="2" height="1" fill="#fff" opacity="0.5"/>
    
    {/* 창문 안 닭 */}
    <rect x="15" y="10.5" width="2" height="2" fill="#ffd54f"/>
    <rect x="15.5" y="10" width="1" height="0.5" fill="#ff6b35"/>
    <rect x="15" y="10.5" width="0.5" height="0.5" fill="#333"/>
    <rect x="16.5" y="10.5" width="0.5" height="0.5" fill="#333"/>
    
    {/* ===== 하단 깃털 다발 ===== */}
    <BottomFeatherCluster />
    
    {/* ===== 바닥 엔진 ===== */}
    <rect x="12" y="19" width="8" height="2" fill="#8b4513"/>
    <rect x="13" y="20" width="2" height="1" fill="#4a4a4a"/>
    <rect x="17" y="20" width="2" height="1" fill="#4a4a4a"/>
    
    {/* 하트 장식 */}
    <rect x="15" y="16" width="1" height="1" fill="#ff69b4"/>
    <rect x="16" y="16" width="1" height="1" fill="#ff69b4"/>
    <rect x="14.5" y="16.5" width="1" height="1" fill="#ff69b4"/>
    <rect x="16.5" y="16.5" width="1" height="1" fill="#ff69b4"/>
    <rect x="15" y="17" width="2" height="1" fill="#ff69b4"/>
  </svg>
);

// 미리보기용 작은 우주선
export const StrawSpaceshipPreview = ({ size = 32 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 16 18" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ imageRendering: 'pixelated' }}
  >
    {/* 각진 몸통 */}
    <rect x="5" y="2" width="6" height="9" fill="#f5deb3" stroke="#c4a574" strokeWidth="0.5"/>
    <rect x="6" y="3" width="4" height="7" fill="#deb887"/>
    
    {/* 꼭대기 */}
    <polygon points="8,0 11,2 5,2" fill="#f5deb3"/>
    <rect x="7" y="-1" width="2" height="2" fill="#ffd54f"/>
    
    {/* 밴드 */}
    <rect x="5" y="4" width="6" height="1" fill="#a0522d"/>
    <rect x="5" y="8" width="6" height="1" fill="#a0522d"/>
    
    {/* 창문 */}
    <rect x="6" y="5" width="4" height="2" fill="#87CEEB" stroke="#5d4037" strokeWidth="0.3"/>
    
    {/* 하단 깃털 다발 (좌우대칭) */}
    <ellipse cx="3" cy="13" rx="2" ry="2" fill="#fff" opacity="0.9"/>
    <ellipse cx="13" cy="13" rx="2" ry="2" fill="#fff" opacity="0.9"/>
    <ellipse cx="5" cy="14" rx="1.5" ry="1.5" fill="#fefefe"/>
    <ellipse cx="11" cy="14" rx="1.5" ry="1.5" fill="#fefefe"/>
    <ellipse cx="8" cy="14" rx="2" ry="1.5" fill="#fff"/>
    
    {/* 엔진 */}
    <rect x="6" y="11" width="4" height="1.5" fill="#8b4513"/>
  </svg>
);

// 엔딩 텍스트 시퀀스
const ENDING_TEXTS = [
  "닭들은 마지막으로 폐허가 된 땅을 돌아보았어요.",
  "짚과 깃털로 만든 우주선은 작지만,\n닭들에게는 충분한 희망이었어요.",
  "우주선이 하늘로 떠오르자 \n조용한 지구만이 아래에 남아 있었어요.",
  "별빛이 가까워질수록 닭들의 눈빛은 더 빛났어요.",
  "이제 닭들은 새로운 둥지를 찾으러 우주로 떠나는 중입니다.",
];

// 타이핑 효과 컴포넌트
const TypewriterText = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50); // 타이핑 속도
      return () => clearTimeout(timer);
    } else {
      onComplete?.();
    }
  }, [currentIndex, text, onComplete]);

  return (
    <span>
      {displayedText}
      {currentIndex < text.length && (
        <span 
          style={{ 
            animation: 'blink 0.5s step-end infinite',
            marginLeft: '2px',
          }}
        >
          |
        </span>
      )}
    </span>
  );
};

// 게임 필드 중앙 텍스트 오버레이 (Portal 사용)
const CenterTextOverlay = ({ text, isVisible }) => {
  const [targetElement, setTargetElement] = useState(null);
  
  useEffect(() => {
    // game-field element 찾기
    const field = document.getElementById('game-field');
    if (field) {
      setTargetElement(field);
    }
  }, []);
  
  if (!isVisible || !text || !targetElement) return null;
  
  return ReactDOM.createPortal(
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        pointerEvents: 'none',
      }}
    >
      <div
        key={text}
        style={{
          color: '#4a4a4a',
          fontSize: '72px',
          fontWeight: 'bold',
          textShadow: '3px 3px 6px rgba(0,0,0,0.3), -1px -1px 3px rgba(255,255,255,0.5)',
          animation: 'countdownPop 0.6s ease-out',
          fontFamily: "'Galmuri11', 'DungGeunMo', monospace",
        }}
      >
        {text}
      </div>
      <style>{`
        @keyframes countdownPop {
          0% { 
            opacity: 0; 
            transform: scale(2);
          }
          30% { 
            opacity: 1; 
            transform: scale(0.9);
          }
          50% {
            transform: scale(1.1);
          }
          100% { 
            opacity: 1; 
            transform: scale(1);
          }
        }
      `}</style>
    </div>,
    targetElement
  );
};

// 엔딩 오버레이 (Portal 사용)
const EndingOverlay = ({ isVisible, currentTextIndex, isTypingComplete, onTypingComplete, onContinue, onRestart }) => {
  if (!isVisible) return null;
  
  const currentText = ENDING_TEXTS[currentTextIndex];
  const isLastText = currentTextIndex === ENDING_TEXTS.length - 1;
  const showButtons = isLastText && isTypingComplete;
  
  return ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 20, 0.95)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100000,
        padding: '40px',
      }}
    >
      {/* 별들 배경 */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              backgroundColor: '#fff',
              borderRadius: '50%',
              opacity: Math.random() * 0.8 + 0.2,
              animation: `twinkle ${Math.random() * 2 + 1}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>
      
      {/* 텍스트 */}
      <div
        style={{
          color: '#e0e0e0',
          fontSize: '24px',
          textAlign: 'center',
          maxWidth: '700px',
          lineHeight: '1.8',
          textShadow: '0 0 10px rgba(255,255,255,0.3)',
          minHeight: '80px',
          whiteSpace: 'pre-line',
        }}
      >
        <TypewriterText 
          key={currentTextIndex} 
          text={currentText}
          onComplete={onTypingComplete}
        />
      </div>
      
      {/* 닭 이모지 */}
      <div
        style={{
          marginTop: '40px',
          fontSize: '32px',
          animation: 'float 2s ease-in-out infinite',
        }}
      >
        🐔🚀✨
      </div>
      
      {/* 버튼들 (마지막 텍스트 타이핑 완료 시) */}
      {showButtons && (
        <div
          style={{
            position: 'absolute',
            bottom: '80px',
            display: 'flex',
            gap: '20px',
            animation: 'fadeIn 0.5s ease-out',
          }}
        >
          <button
            onClick={onContinue}
            style={{
              padding: '14px 36px',
              backgroundColor: '#ffd54f',
              border: 'none',
              borderRadius: '8px',
              color: '#5d4037',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 15px rgba(255,213,79,0.4)',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 6px 20px rgba(255,213,79,0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 4px 15px rgba(255,213,79,0.4)';
            }}
          >
            🌟 계속하기
          </button>
          <button
            onClick={onRestart}
            style={{
              padding: '14px 36px',
              backgroundColor: 'transparent',
              border: '2px solid #ffd54f',
              borderRadius: '8px',
              color: '#ffd54f',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'transform 0.2s, background-color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.backgroundColor = 'rgba(255,213,79,0.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            🔄 처음으로
          </button>
        </div>
      )}
      
      {/* CSS 애니메이션 */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>,
    document.body
  );
};

const StrawSpaceship = ({ x, y, onClick, onRestart }) => {
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchPhase, setLaunchPhase] = useState(0); // 0: 대기, 1: 카운트다운, 2: 발사, 3: 엔딩
  const [countdownText, setCountdownText] = useState('');
  const [showEnding, setShowEnding] = useState(false);
  const [endingTextIndex, setEndingTextIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (isLaunching) return;
    
    // 발사 시퀀스 시작
    setIsLaunching(true);
    setLaunchPhase(1);
    
    // 카운트다운 시퀀스
    setCountdownText('3');
    setTimeout(() => setCountdownText('2'), 1000);
    setTimeout(() => setCountdownText('1'), 2000);
    setTimeout(() => {
      setCountdownText('발사!!');
      setLaunchPhase(2);
    }, 3000);
    
    // 발사 후 엔딩 시작
    setTimeout(() => {
      setCountdownText('');
      setLaunchPhase(3);
      setShowEnding(true);
    }, 5000);
  };

  // 엔딩 텍스트 자동 진행 (타이핑 완료 후)
  useEffect(() => {
    if (!showEnding || !isTypingComplete) return;
    
    if (endingTextIndex < ENDING_TEXTS.length - 1) {
      const timer = setTimeout(() => {
        setEndingTextIndex(prev => prev + 1);
        setIsTypingComplete(false);
      }, 1500); // 타이핑 완료 후 1.5초 대기
      
      return () => clearTimeout(timer);
    }
  }, [showEnding, isTypingComplete, endingTextIndex]);

  const handleContinue = () => {
    setShowEnding(false);
    setIsLaunching(false);
    setLaunchPhase(0);
    setEndingTextIndex(0);
    setIsTypingComplete(false);
    onClick?.();
  };

  const handleRestart = () => {
    setShowEnding(false);
    setIsLaunching(false);
    setLaunchPhase(0);
    setEndingTextIndex(0);
    setIsTypingComplete(false);
    onRestart?.();
  };

  // 우주선은 이동 불가 - mousedown 이벤트 무시
  const handleMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  // 애니메이션 스타일
  const getAnimationStyle = () => {
    switch (launchPhase) {
      case 1: // 카운트다운 (흔들림)
        return {
          animation: 'spaceshipShake 0.1s ease-in-out infinite',
        };
      case 2: // 발사!
        return {
          animation: 'spaceshipLaunch 2s ease-in forwards',
        };
      default:
        return {};
    }
  };

  return (
    <>
      {/* 화면 중앙 카운트다운/발사 텍스트 */}
      <CenterTextOverlay text={countdownText} isVisible={!!countdownText} />
      
      {/* 엔딩 오버레이 */}
      <EndingOverlay 
        isVisible={showEnding} 
        currentTextIndex={endingTextIndex}
        isTypingComplete={isTypingComplete}
        onTypingComplete={() => setIsTypingComplete(true)}
        onContinue={handleContinue}
        onRestart={handleRestart}
      />
      
      <div 
        className="absolute"
        style={{ 
          left: x - 40, 
          top: y - 70,
          cursor: isLaunching ? 'default' : 'pointer',
          zIndex: isLaunching ? 200 : 19,
          userSelect: 'none',
          ...getAnimationStyle(),
        }}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
      >
        {/* 발사 안내 표시 - 클릭 통과 */}
        {!isLaunching && (
          <div 
            className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-xs animate-pulse"
            style={{ 
              backgroundColor: '#c4b5fd',
              border: '2px solid #7c3aed',
              color: '#4c1d95',
              whiteSpace: 'nowrap',
              zIndex: 10,
              pointerEvents: 'none',
            }}
          >
            🚀 클릭하여 발사!
          </div>
        )}
        
        {/* 발사 불꽃 */}
        <LaunchFlames isLaunching={launchPhase === 2} />
        
        {/* 우주선 본체 */}
        <SpaceshipBody />
        
        {/* 효과 아이콘 - 클릭 통과 */}
        {!isLaunching && (
          <div 
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded"
            style={{ 
              backgroundColor: '#c4b5fd',
              color: '#4c1d95',
              fontSize: '9px',
              pointerEvents: 'none',
            }}
          >
            🚀
          </div>
        )}
        
        {/* 연기 효과 (발사 중) - 클릭 통과 */}
        {launchPhase === 2 && (
          <div 
            className="absolute"
            style={{
              bottom: '-60px',
              left: '0px',
              width: '80px',
              height: '60px',
              background: 'radial-gradient(ellipse, rgba(200,200,200,0.8) 0%, transparent 70%)',
              animation: 'smokeExpand 0.5s ease-out forwards',
              pointerEvents: 'none',
            }}
          />
        )}
        
        {/* CSS 애니메이션 */}
        <style>{`
          @keyframes spaceshipShake {
            0%, 100% { transform: translateX(0) rotate(0deg); }
            25% { transform: translateX(-3px) rotate(-2deg); }
            75% { transform: translateX(3px) rotate(2deg); }
          }
          
          @keyframes spaceshipLaunch {
            0% { 
              transform: translateY(0) scale(1);
              opacity: 1;
            }
            30% {
              transform: translateY(-50px) scale(1.1);
              opacity: 1;
            }
            100% { 
              transform: translateY(-500px) scale(0.3);
              opacity: 0;
            }
          }
          
          @keyframes smokeExpand {
            0% { 
              transform: scale(0.5);
              opacity: 0.8;
            }
            100% { 
              transform: scale(3);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default StrawSpaceship;
