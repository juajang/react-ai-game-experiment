import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

// 엔딩 텍스트
const ENDING_TEXTS = [
    "닭들은 오래된 숲 한가운데에 모여,\n드디어 서로 힘을 합쳐 닭의 성을 완성했어요.",
    "예전엔 인간들이 남긴 시끄러운 흔적뿐이었지만,\n이제는 바람 소리만 들려서 모두가 한숨 돌렸습니다.",
    '닭들은 성 꼭대기에서 서로를 바라보며\n"우리가… 정말 알 딛고 여기까지 왔네요!"\n하고 가볍게 꼬꼬댔어요.',
    "밤이 되자 성에 달아둔 작은 불빛들이 반짝반짝 켜져서,\n마치 새로운 시대를 축하하는 것처럼 보였습니다.",
    "그렇게 닭들은 자신들만의 세상이 열렸음을 깨닫고,\n조금 들뜬 발걸음으로 새로운 미래를 향해 걸어갔습니다.",
];

// 타이핑 효과 컴포넌트
const TypewriterText = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // text가 변경되면 초기화
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    setIsCompleted(false);
  }, [text]);

  useEffect(() => {
    if (!text || isCompleted) return;
    
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timer);
    } else if (currentIndex === text.length && currentIndex > 0 && !isCompleted) {
      setIsCompleted(true);
      if (onComplete) {
        onComplete();
      }
    }
  }, [currentIndex, text, onComplete, isCompleted]);

  return <span style={{ whiteSpace: 'pre-wrap' }}>{displayedText}</span>;
};

// 엔딩 오버레이
const EndingOverlay = ({ isVisible, currentTextIndex, isTypingComplete, onTypingComplete, onContinue, onRestart }) => {
  if (!isVisible) return null;

  return ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(30, 20, 10, 0.98)',
        background: 'linear-gradient(135deg, rgba(40, 25, 15, 0.98) 0%, rgba(25, 15, 10, 0.98) 50%, rgba(35, 20, 12, 0.98) 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10001,
        padding: '40px',
        animation: 'fadeIn 1s ease-in',
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes candleFlicker {
          0%, 100% { 
            opacity: 0.9;
            filter: brightness(1);
          }
          25% { 
            opacity: 0.95;
            filter: brightness(1.1);
          }
          50% { 
            opacity: 0.85;
            filter: brightness(0.95);
          }
          75% { 
            opacity: 1;
            filter: brightness(1.05);
          }
        }
        @keyframes candleGlow {
          0%, 100% { 
            text-shadow: 0 0 10px rgba(255, 200, 100, 0.8), 0 0 20px rgba(255, 180, 80, 0.5);
          }
          50% { 
            text-shadow: 0 0 15px rgba(255, 200, 100, 1), 0 0 30px rgba(255, 180, 80, 0.7);
          }
        }
      `}</style>

      {/* 배경 촛불 장식 */}
      <div style={{ position: 'absolute', top: '12%', left: '8%', fontSize: '28px', animation: 'candleFlicker 3s infinite, candleGlow 3s infinite' }}>🕯️</div>
      <div style={{ position: 'absolute', top: '18%', right: '12%', fontSize: '24px', animation: 'candleFlicker 3.5s infinite, candleGlow 3.5s infinite' }}>🕯️</div>
      <div style={{ position: 'absolute', bottom: '18%', left: '15%', fontSize: '26px', animation: 'candleFlicker 2.8s infinite, candleGlow 2.8s infinite' }}>🕯️</div>
      <div style={{ position: 'absolute', top: '55%', right: '20%', fontSize: '22px', animation: 'candleFlicker 3.2s infinite, candleGlow 3.2s infinite' }}>🕯️</div>
      <div style={{ position: 'absolute', bottom: '28%', left: '10%', fontSize: '24px', animation: 'candleFlicker 2.5s infinite, candleGlow 2.5s infinite' }}>🕯️</div>
      <div style={{ position: 'absolute', top: '38%', left: '6%', fontSize: '20px', animation: 'candleFlicker 3.8s infinite, candleGlow 3.8s infinite' }}>🕯️</div>
      <div style={{ position: 'absolute', bottom: '35%', right: '8%', fontSize: '28px', animation: 'candleFlicker 2.9s infinite, candleGlow 2.9s infinite' }}>🕯️</div>
      <div style={{ position: 'absolute', top: '25%', left: '50%', fontSize: '22px', animation: 'candleFlicker 3.3s infinite, candleGlow 3.3s infinite' }}>🕯️</div>

      {/* 제목 */}
      <div
        style={{
          fontSize: '48px',
          marginBottom: '20px',
          animation: 'fadeIn 2s ease-in',
        }}
      >
        🏰
      </div>

      <h1
        style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#ffcc80',
          marginBottom: '40px',
          textShadow: '0 0 20px rgba(255, 180, 80, 0.8), 0 0 40px rgba(255, 150, 50, 0.4)',
          animation: 'fadeIn 2s ease-in',
        }}
      >
        닭들의 나무 성
      </h1>

      {/* 엔딩 텍스트 */}
      <div
        style={{
          maxWidth: '700px',
          fontSize: '20px',
          lineHeight: '2',
          color: '#f5e6d3',
          textAlign: 'center',
          marginBottom: '60px',
          minHeight: '160px',
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'keep-all',
        }}
      >
        <TypewriterText 
          text={ENDING_TEXTS[currentTextIndex] || ''} 
          onComplete={onTypingComplete}
        />
      </div>

      {/* 버튼들 (마지막 텍스트에서만 표시) */}
      {currentTextIndex === ENDING_TEXTS.length - 1 && isTypingComplete && (
        <div
          style={{
            display: 'flex',
            gap: '20px',
            animation: 'fadeIn 1s ease-in',
          }}
        >
          <button
            onClick={onContinue}
            style={{
              padding: '14px 36px',
              backgroundColor: '#8b4513',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 'bold',
              color: 'white',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(139, 69, 19, 0.4)',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(139, 69, 19, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(139, 69, 19, 0.4)';
            }}
          >
            🌟 계속하기
          </button>
          <button
            onClick={onRestart}
            style={{
              padding: '14px 36px',
              backgroundColor: 'transparent',
              border: '2px solid #8b4513',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#8b4513',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(139, 69, 19, 0.1)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            🔄 처음으로
          </button>
        </div>
      )}

    </div>,
    document.body
  );
};

// 미리보기용 작은 나무 성
export const MansionPreview = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
    {/* 왼쪽 기둥 */}
    <rect x="0.5" y="5" width="1.5" height="7" fill="#a0522d"/>
    <rect x="0.7" y="5.2" width="1.1" height="6.6" fill="#cd853f"/>
    <rect x="0.5" y="6.5" width="1.5" height="0.5" fill="#8b4513" opacity="0.3"/>
    <rect x="0.5" y="8.5" width="1.5" height="0.5" fill="#8b4513" opacity="0.3"/>
    <rect x="0.5" y="10.5" width="1.5" height="0.5" fill="#8b4513" opacity="0.3"/>
    
    {/* 왼쪽 망루 */}
    <rect x="0.2" y="2.5" width="2" height="2.5" fill="#a0522d"/>
    <rect x="0.5" y="2.7" width="1.4" height="2.1" fill="#cd853f"/>
    <polygon points="1.2,1.5 0.2,2.5 2.2,2.5" fill="#8b4513"/>
    <rect x="0.8" y="3.5" width="0.8" height="0.8" fill="#ffe082"/>
    
    {/* 오른쪽 기둥 */}
    <rect x="14" y="5" width="1.5" height="7" fill="#a0522d"/>
    <rect x="14.2" y="5.2" width="1.1" height="6.6" fill="#cd853f"/>
    <rect x="14" y="6.5" width="1.5" height="0.5" fill="#8b4513" opacity="0.3"/>
    <rect x="14" y="8.5" width="1.5" height="0.5" fill="#8b4513" opacity="0.3"/>
    <rect x="14" y="10.5" width="1.5" height="0.5" fill="#8b4513" opacity="0.3"/>
    
    {/* 오른쪽 망루 */}
    <rect x="13.8" y="2.5" width="2" height="2.5" fill="#a0522d"/>
    <rect x="14.1" y="2.7" width="1.4" height="2.1" fill="#cd853f"/>
    <polygon points="14.8,1.5 13.8,2.5 15.8,2.5" fill="#8b4513"/>
    <rect x="14.4" y="3.5" width="0.8" height="0.8" fill="#ffe082"/>
    
    {/* 삼각형 지붕 */}
    <polygon points="8,1 2.5,3 13.5,3" fill="#8b4513"/>
    <polygon points="8,1.5 3.5,3 12.5,3" fill="#a0522d"/>
    
    {/* 성벽 (통나무) */}
    <rect x="3" y="3" width="10" height="9" fill="#cd853f"/>
    <rect x="3.5" y="3.5" width="9" height="8.3" fill="#deb887"/>
    
    {/* 통나무 무늬 */}
    <rect x="3" y="4" width="10" height="0.4" fill="#a0522d" opacity="0.2"/>
    <rect x="3" y="5.5" width="10" height="0.4" fill="#a0522d" opacity="0.2"/>
    <rect x="3" y="7" width="10" height="0.4" fill="#a0522d" opacity="0.2"/>
    <rect x="3" y="8.5" width="10" height="0.4" fill="#a0522d" opacity="0.2"/>
    <rect x="3" y="10" width="10" height="0.4" fill="#a0522d" opacity="0.2"/>
    <rect x="3" y="11.5" width="10" height="0.4" fill="#a0522d" opacity="0.2"/>
    
    {/* 세로로 긴 창문 */}
    <rect x="4" y="4.5" width="1.5" height="3" fill="#ffe082"/>
    <rect x="4.5" y="4.5" width="0.4" height="3" fill="#cd853f" opacity="0.3"/>
    <rect x="4" y="5.8" width="1.5" height="0.4" fill="#cd853f" opacity="0.3"/>
    
    <rect x="10.5" y="4.5" width="1.5" height="3" fill="#ffe082"/>
    <rect x="11" y="4.5" width="0.4" height="3" fill="#cd853f" opacity="0.3"/>
    <rect x="10.5" y="5.8" width="1.5" height="0.4" fill="#cd853f" opacity="0.3"/>
    
    {/* 창문 아래 꽃 화분 */}
    <rect x="4.1" y="7.5" width="1.3" height="0.8" fill="#d2691e"/>
    <circle cx="4.4" cy="7.3" r="0.25" fill="#f472b6"/>
    <circle cx="4.8" cy="7.2" r="0.2" fill="#fbbf24"/>
    <circle cx="5.2" cy="7.3" r="0.25" fill="#f87171"/>
    
    <rect x="10.6" y="7.5" width="1.3" height="0.8" fill="#d2691e"/>
    <circle cx="10.9" cy="7.3" r="0.25" fill="#fbbf24"/>
    <circle cx="11.3" cy="7.2" r="0.2" fill="#f472b6"/>
    <circle cx="11.7" cy="7.3" r="0.25" fill="#fbbf24"/>
    
    {/* 중앙 문 */}
    <rect x="6" y="8" width="4" height="4" fill="#6b4423"/>
    <polygon points="8,8 6,9 10,9" fill="#6b4423"/>
    <circle cx="9" cy="10" r="0.3" fill="#8b8b8b"/>
    
    {/* 성벽 꼭대기 */}
    <rect x="3" y="2.5" width="1" height="0.8" fill="#cd853f"/>
    <rect x="5" y="2.5" width="1" height="0.8" fill="#cd853f"/>
    <rect x="7" y="2.5" width="2" height="0.8" fill="#cd853f"/>
    <rect x="10" y="2.5" width="1" height="0.8" fill="#cd853f"/>
    <rect x="12" y="2.5" width="1" height="0.8" fill="#cd853f"/>
    
    {/* 하단 왼쪽 큰 꽃덤불 */}
    <ellipse cx="2" cy="12.2" rx="2.5" ry="1.5" fill="#22c55e" opacity="0.9"/>
    <circle cx="1" cy="11.5" r="0.4" fill="#f472b6"/>
    <circle cx="2" cy="11.5" r="0.35" fill="#fbbf24"/>
    <circle cx="3" cy="11.5" r="0.4" fill="#f87171"/>
    <circle cx="2" cy="12" r="0.35" fill="#fbbf24"/>
    
    {/* 하단 오른쪽 큰 꽃덤불 */}
    <ellipse cx="14" cy="12.2" rx="2.5" ry="1.5" fill="#22c55e" opacity="0.9"/>
    <circle cx="13" cy="11.5" r="0.4" fill="#fbbf24"/>
    <circle cx="14" cy="11.5" r="0.35" fill="#f472b6"/>
    <circle cx="15" cy="11.5" r="0.4" fill="#fbbf24"/>
    <circle cx="14" cy="12" r="0.35" fill="#f87171"/>
  </svg>
);

const Mansion = ({ x, y, onMouseDown, onClick, onRestart }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEnding, setShowEnding] = useState(false);
  const [endingTextIndex, setEndingTextIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  
  const handleSummonClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setShowConfirm(true);
  };
  
  const handleConfirm = () => {
    setShowConfirm(false);
    setShowEnding(true);
  };
  
  const handleCancel = () => {
    setShowConfirm(false);
  };
  
  // 엔딩 텍스트 자동 진행 (타이핑 완료 후)
  useEffect(() => {
    if (!showEnding || !isTypingComplete) return;
    
    if (endingTextIndex < ENDING_TEXTS.length - 1) {
      const timer = setTimeout(() => {
        setEndingTextIndex(prev => prev + 1);
        setIsTypingComplete(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [showEnding, isTypingComplete, endingTextIndex]);

  const handleContinue = () => {
    setShowEnding(false);
    setEndingTextIndex(0);
    setIsTypingComplete(false);
    onClick?.();
  };

  const handleRestartGame = () => {
    setShowEnding(false);
    setEndingTextIndex(0);
    setIsTypingComplete(false);
    onRestart?.();
  };

  return (
    <>
      <div 
        className="absolute"
        style={{ 
          left: x - 48, 
          top: y - 90,
          cursor: 'move',
          zIndex: 18,
          userSelect: 'none',
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          onMouseDown?.(e);
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        
        {/* 나무 성 본체 */}
        <svg 
          width="96" 
          height="96" 
          viewBox="0 -5 32 37" 
          xmlns="http://www.w3.org/2000/svg"
          style={{ imageRendering: 'pixelated', filter: 'drop-shadow(0 0 8px rgba(255, 235, 59, 0.3))' }}
        >
          <defs>
            {/* 창문 빛 효과 필터 */}
            <filter id="windowGlow">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>
          </defs>
          
          {/* 왼쪽 기둥 */}
          <rect x="1" y="10" width="3" height="14" fill="#a0522d"/>
          <rect x="1.5" y="10.5" width="2" height="13" fill="#cd853f"/>
          <rect x="1" y="12" width="3" height="1" fill="#8b4513" opacity="0.3"/>
          <rect x="1" y="16" width="3" height="1" fill="#8b4513" opacity="0.3"/>
          <rect x="1" y="20" width="3" height="1" fill="#8b4513" opacity="0.3"/>
          
          {/* 왼쪽 망루 */}
          <rect x="0.5" y="5" width="4" height="5" fill="#a0522d"/>
          <rect x="1" y="5.5" width="3" height="4" fill="#cd853f"/>
          <polygon points="2.5,3 0.5,5 4.5,5" fill="#8b4513"/>
          {/* 왼쪽 망루 창문 글로우 - 외곽 */}
          <rect x="0.8" y="6.3" width="3.4" height="2.8" fill="#ffd700" opacity="0.15">
            <animate attributeName="opacity" values="0.1;0.25;0.1" dur="2s" repeatCount="indefinite"/>
          </rect>
          {/* 왼쪽 망루 창문 글로우 - 중간 */}
          <rect x="1.1" y="6.6" width="2.8" height="2.2" fill="#ffeb3b" opacity="0.3">
            <animate attributeName="opacity" values="0.2;0.4;0.2" dur="2s" repeatCount="indefinite"/>
          </rect>
          {/* 왼쪽 망루 창문 글로우 - 내부 */}
          <rect x="1.3" y="6.8" width="2.4" height="1.8" fill="#ffe082" opacity="0.5">
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite"/>
          </rect>
          <rect x="1.5" y="7" width="2" height="1.5" fill="#ffe082">
            <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite"/>
          </rect>
          
          {/* 오른쪽 기둥 */}
          <rect x="28" y="10" width="3" height="14" fill="#a0522d"/>
          <rect x="28.5" y="10.5" width="2" height="13" fill="#cd853f"/>
          <rect x="28" y="12" width="3" height="1" fill="#8b4513" opacity="0.3"/>
          <rect x="28" y="16" width="3" height="1" fill="#8b4513" opacity="0.3"/>
          <rect x="28" y="20" width="3" height="1" fill="#8b4513" opacity="0.3"/>
          
          {/* 오른쪽 망루 */}
          <rect x="27.5" y="5" width="4" height="5" fill="#a0522d"/>
          <rect x="28" y="5.5" width="3" height="4" fill="#cd853f"/>
          <polygon points="29.5,3 27.5,5 31.5,5" fill="#8b4513"/>
          {/* 오른쪽 망루 창문 글로우 - 외곽 */}
          <rect x="27.8" y="6.3" width="3.4" height="2.8" fill="#ffd700" opacity="0.15">
            <animate attributeName="opacity" values="0.1;0.25;0.1" dur="2.2s" repeatCount="indefinite"/>
          </rect>
          {/* 오른쪽 망루 창문 글로우 - 중간 */}
          <rect x="28.1" y="6.6" width="2.8" height="2.2" fill="#ffeb3b" opacity="0.3">
            <animate attributeName="opacity" values="0.2;0.4;0.2" dur="2.2s" repeatCount="indefinite"/>
          </rect>
          {/* 오른쪽 망루 창문 글로우 - 내부 */}
          <rect x="28.3" y="6.8" width="2.4" height="1.8" fill="#ffe082" opacity="0.5">
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2.2s" repeatCount="indefinite"/>
          </rect>
          <rect x="28.5" y="7" width="2" height="1.5" fill="#ffe082">
            <animate attributeName="opacity" values="0.7;1;0.7" dur="2.2s" repeatCount="indefinite"/>
          </rect>
          
          {/* 삼각형 지붕 */}
          <polygon points="16,2 5,6 27,6" fill="#8b4513"/>
          <polygon points="16,3 7,6 25,6" fill="#a0522d"/>
          
          {/* 깃발 기둥 */}
          <rect x="15.7" y="-3" width="0.6" height="5.5" fill="#6b4423"/>
          <rect x="15.8" y="-3" width="0.4" height="5.5" fill="#8b6f47"/>
          
          {/* 깃발 천 (바람에 흔들림) */}
          <g>
            <path d="M 16.3,-2.5 L 20,-2.5 Q 20.5,-2.3 20,-2.1 L 16.3,-2.1 Z" fill="#dc2626">
              <animate attributeName="d" 
                values="M 16.3,-2.5 L 20,-2.5 Q 20.5,-2.3 20,-2.1 L 16.3,-2.1 Z;
                        M 16.3,-2.5 L 20,-2.5 Q 20.3,-2.3 20.2,-2.1 L 16.3,-2.1 Z;
                        M 16.3,-2.5 L 20,-2.5 Q 20.5,-2.3 20,-2.1 L 16.3,-2.1 Z" 
                dur="1.5s" repeatCount="indefinite"/>
            </path>
            <path d="M 16.3,-2.1 L 20,-2.1 Q 20.5,-1.9 20,-1.7 L 16.3,-1.7 Z" fill="#b91c1c">
              <animate attributeName="d" 
                values="M 16.3,-2.1 L 20,-2.1 Q 20.5,-1.9 20,-1.7 L 16.3,-1.7 Z;
                        M 16.3,-2.1 L 20,-2.1 Q 20.3,-1.9 20.2,-1.7 L 16.3,-1.7 Z;
                        M 16.3,-2.1 L 20,-2.1 Q 20.5,-1.9 20,-1.7 L 16.3,-1.7 Z" 
                dur="1.5s" repeatCount="indefinite"/>
            </path>
            <path d="M 16.3,-1.7 L 20,-1.7 Q 20.5,-1.5 20,-1.3 L 16.3,-1.3 Z" fill="#dc2626">
              <animate attributeName="d" 
                values="M 16.3,-1.7 L 20,-1.7 Q 20.5,-1.5 20,-1.3 L 16.3,-1.3 Z;
                        M 16.3,-1.7 L 20,-1.7 Q 20.3,-1.5 20.2,-1.3 L 16.3,-1.3 Z;
                        M 16.3,-1.7 L 20,-1.7 Q 20.5,-1.5 20,-1.3 L 16.3,-1.3 Z" 
                dur="1.5s" repeatCount="indefinite"/>
            </path>
            
            {/* 깃발 위의 닭 실루엣 */}
            <g transform="translate(17.5, -2)">
              {/* 닭 머리 */}
              <circle cx="0.5" cy="0" r="0.35" fill="#fbbf24"/>
              {/* 닭 볏 */}
              <path d="M 0.4,-0.35 L 0.5,-0.5 L 0.6,-0.35 Z" fill="#ef4444"/>
              {/* 닭 부리 */}
              <path d="M 0.85,-0.05 L 1,-0.05 L 0.85,0.05 Z" fill="#f59e0b"/>
              {/* 닭 눈 */}
              <circle cx="0.6" cy="-0.05" r="0.08" fill="#1f2937"/>
              {/* 닭 몸통 */}
              <ellipse cx="0.2" cy="0.3" rx="0.5" ry="0.4" fill="#fbbf24"/>
              {/* 닭 날개 */}
              <ellipse cx="0.3" cy="0.25" rx="0.3" ry="0.25" fill="#f59e0b" opacity="0.8"/>
              {/* 닭 꼬리 */}
              <path d="M -0.2,0.2 Q -0.4,0 -0.5,0.3 Q -0.4,0.5 -0.2,0.4 Z" fill="#f59e0b"/>
            </g>
          </g>
          
          {/* 성벽 (나무 통나무) */}
          <rect x="6" y="6" width="20" height="18" fill="#cd853f"/>
          <rect x="7" y="7" width="18" height="16" fill="#deb887"/>
          
          {/* 통나무 무늬 (가로선) */}
          <rect x="6" y="8" width="20" height="1" fill="#a0522d" opacity="0.25"/>
          <rect x="6" y="10" width="20" height="1" fill="#a0522d" opacity="0.25"/>
          <rect x="6" y="12" width="20" height="1" fill="#a0522d" opacity="0.25"/>
          <rect x="6" y="14" width="20" height="1" fill="#a0522d" opacity="0.25"/>
          <rect x="6" y="16" width="20" height="1" fill="#a0522d" opacity="0.25"/>
          <rect x="6" y="18" width="20" height="1" fill="#a0522d" opacity="0.25"/>
          <rect x="6" y="20" width="20" height="1" fill="#a0522d" opacity="0.25"/>
          <rect x="6" y="22" width="20" height="1" fill="#a0522d" opacity="0.25"/>
          
          {/* 통나무 세로 무늬 */}
          <rect x="9" y="7" width="1" height="16" fill="#a0522d" opacity="0.15"/>
          <rect x="13" y="7" width="1" height="16" fill="#a0522d" opacity="0.15"/>
          <rect x="16" y="7" width="1" height="16" fill="#a0522d" opacity="0.15"/>
          <rect x="19" y="7" width="1" height="16" fill="#a0522d" opacity="0.15"/>
          <rect x="23" y="7" width="1" height="16" fill="#a0522d" opacity="0.15"/>
          
          {/* 중앙 큰 문 (아치형) */}
          <rect x="11" y="15" width="10" height="9" fill="#6b4423"/>
          <rect x="12" y="16" width="8" height="8" fill="#8b6f47"/>
          <polygon points="16,15 12,17 20,17" fill="#6b4423"/>
          
          {/* 문 철판 장식 */}
          <rect x="13" y="17" width="6" height="1" fill="#4a4a4a" opacity="0.4"/>
          <rect x="13" y="19" width="6" height="1" fill="#4a4a4a" opacity="0.4"/>
          <rect x="13" y="21" width="6" height="1" fill="#4a4a4a" opacity="0.4"/>
          <circle cx="18" cy="20" r="0.6" fill="#8b8b8b"/>
          <circle cx="18" cy="20" r="0.3" fill="#a8a8a8"/>
          
          {/* 좌우 세로로 긴 창문 (십자가 모양) */}
          {/* 왼쪽 창문 글로우 - 외곽 */}
          <rect x="7" y="8" width="4.5" height="8" fill="#ffd700" opacity="0.15">
            <animate attributeName="opacity" values="0.1;0.25;0.1" dur="2.5s" repeatCount="indefinite"/>
          </rect>
          {/* 왼쪽 창문 글로우 - 중간 */}
          <rect x="7.4" y="8.4" width="3.7" height="7.2" fill="#ffeb3b" opacity="0.25">
            <animate attributeName="opacity" values="0.15;0.35;0.15" dur="2.5s" repeatCount="indefinite"/>
          </rect>
          {/* 왼쪽 창문 글로우 - 내부 */}
          <rect x="7.7" y="8.7" width="3.1" height="6.6" fill="#ffe082" opacity="0.4">
            <animate attributeName="opacity" values="0.25;0.5;0.25" dur="2.5s" repeatCount="indefinite"/>
          </rect>
          <rect x="8" y="9" width="2.5" height="6" fill="#ffe082">
            <animate attributeName="opacity" values="0.8;1;0.8" dur="2.5s" repeatCount="indefinite"/>
          </rect>
          <rect x="9" y="9" width="0.6" height="6" fill="#cd853f" opacity="0.3"/>
          <rect x="8" y="11.5" width="2.5" height="0.6" fill="#cd853f" opacity="0.3"/>
          
          {/* 왼쪽 창문 아래 꽃 화분 */}
          <rect x="8.2" y="15" width="2" height="1.2" fill="#d2691e"/>
          <rect x="8.3" y="15.1" width="1.8" height="1" fill="#cd853f"/>
          <circle cx="8.5" cy="14.8" r="0.35" fill="#f472b6"/>
          <circle cx="9.2" cy="14.7" r="0.3" fill="#fbbf24"/>
          <circle cx="10" cy="14.8" r="0.35" fill="#f87171"/>
          
          {/* 오른쪽 창문 글로우 - 외곽 */}
          <rect x="20.5" y="8" width="4.5" height="8" fill="#ffd700" opacity="0.15">
            <animate attributeName="opacity" values="0.1;0.25;0.1" dur="2.7s" repeatCount="indefinite"/>
          </rect>
          {/* 오른쪽 창문 글로우 - 중간 */}
          <rect x="20.9" y="8.4" width="3.7" height="7.2" fill="#ffeb3b" opacity="0.25">
            <animate attributeName="opacity" values="0.15;0.35;0.15" dur="2.7s" repeatCount="indefinite"/>
          </rect>
          {/* 오른쪽 창문 글로우 - 내부 */}
          <rect x="21.2" y="8.7" width="3.1" height="6.6" fill="#ffe082" opacity="0.4">
            <animate attributeName="opacity" values="0.25;0.5;0.25" dur="2.7s" repeatCount="indefinite"/>
          </rect>
          <rect x="21.5" y="9" width="2.5" height="6" fill="#ffe082">
            <animate attributeName="opacity" values="0.8;1;0.8" dur="2.7s" repeatCount="indefinite"/>
          </rect>
          <rect x="22.4" y="9" width="0.6" height="6" fill="#cd853f" opacity="0.3"/>
          <rect x="21.5" y="11.5" width="2.5" height="0.6" fill="#cd853f" opacity="0.3"/>
          
          {/* 오른쪽 창문 아래 꽃 화분 */}
          <rect x="21.8" y="15" width="2" height="1.2" fill="#d2691e"/>
          <rect x="21.9" y="15.1" width="1.8" height="1" fill="#cd853f"/>
          <circle cx="22" cy="14.8" r="0.35" fill="#fbbf24"/>
          <circle cx="22.8" cy="14.7" r="0.3" fill="#f472b6"/>
          <circle cx="23.5" cy="14.8" r="0.35" fill="#fbbf24"/>
          
          {/* 성벽 꼭대기 (battlements) */}
          <rect x="6" y="5" width="2" height="2" fill="#cd853f"/>
          <rect x="10" y="5" width="2" height="2" fill="#cd853f"/>
          <rect x="14" y="5" width="4" height="2" fill="#cd853f"/>
          <rect x="20" y="5" width="2" height="2" fill="#cd853f"/>
          <rect x="24" y="5" width="2" height="2" fill="#cd853f"/>
          
          {/* 바닥 (나무 판자) */}
          <rect x="1" y="23" width="30" height="1" fill="#a0522d"/>
          
          {/* 하단 왼쪽 큰 꽃덤불 (기둥까지 확장) */}
          <ellipse cx="4" cy="24" rx="4.5" ry="2.5" fill="#22c55e" opacity="0.9"/>
          <circle cx="2" cy="23" r="0.8" fill="#f472b6"/>
          <circle cx="3.5" cy="23" r="0.7" fill="#fbbf24"/>
          <circle cx="5" cy="23" r="0.8" fill="#f87171"/>
          <circle cx="6" cy="23.5" r="0.7" fill="#fbbf24"/>
          <circle cx="7" cy="23.5" r="0.6" fill="#f472b6"/>
          <circle cx="4" cy="24" r="0.8" fill="#fbbf24"/>
          
          {/* 하단 오른쪽 큰 꽃덤불 (기둥까지 확장) */}
          <ellipse cx="28" cy="24" rx="4.5" ry="2.5" fill="#22c55e" opacity="0.9"/>
          <circle cx="30" cy="23" r="0.8" fill="#fbbf24"/>
          <circle cx="28.5" cy="23" r="0.7" fill="#f472b6"/>
          <circle cx="27" cy="23" r="0.8" fill="#fbbf24"/>
          <circle cx="25" cy="23.5" r="0.7" fill="#f87171"/>
          <circle cx="26" cy="23.5" r="0.6" fill="#fbbf24"/>
          <circle cx="28" cy="24" r="0.8" fill="#f472b6"/>
        </svg>
        
        {/* 소집 버튼 */}
        <div
          style={{
            position: 'absolute',
            top: '79px',
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'auto',
          }}
        >
          <button
            onClick={handleSummonClick}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            style={{
              padding: '2px 8px',
              backgroundColor: isButtonHovered ? '#6b4423' : '#8b4513',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              fontSize: '10px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: isButtonHovered 
                ? '0 2px 6px rgba(139, 69, 19, 0.4)' 
                : '0 1px 4px rgba(139, 69, 19, 0.3)',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            소집
          </button>
        </div>
        
      </div>
      
      {/* 엔딩 오버레이 */}
      <EndingOverlay 
        isVisible={showEnding} 
        currentTextIndex={endingTextIndex}
        isTypingComplete={isTypingComplete}
        onTypingComplete={() => setIsTypingComplete(true)}
        onContinue={handleContinue}
        onRestart={handleRestartGame}
      />
      
      {/* 확인 창 */}
      {showConfirm && ReactDOM.createPortal(
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000,
          }}
          onClick={handleCancel}
        >
          <div
            style={{
              backgroundColor: '#fff8dc',
              border: '4px solid #8b4513',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '400px',
              textAlign: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏰</div>
            <div
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#5d4037',
                marginBottom: '12px',
                lineHeight: '1.5',
              }}
            >
              성이 모두 완성되었어요!
            </div>
            <div
              style={{
                fontSize: '16px',
                color: '#8b4513',
                marginBottom: '24px',
                lineHeight: '1.5',
              }}
            >
              닭들을 모두 소집할까요?
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={handleConfirm}
                style={{
                  padding: '12px 32px',
                  backgroundColor: '#8b4513',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                }}
              >
                예
              </button>
              <button
                onClick={handleCancel}
                style={{
                  padding: '12px 32px',
                  backgroundColor: 'white',
                  color: '#8b4513',
                  border: '2px solid #8b4513',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                아니요
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default Mansion;

