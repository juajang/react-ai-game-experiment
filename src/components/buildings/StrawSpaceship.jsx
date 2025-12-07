import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

// 발사 불꽃 애니메이션 (픽셀아트 역삼각형)
const LaunchFlames = ({ isLaunching }) => (
  <svg 
    width="80" 
    height="70" 
    viewBox="0 0 20 18" 
    xmlns="http://www.w3.org/2000/svg"
    style={{
      position: 'absolute',
      bottom: '0px',
      left: '15px',
      opacity: isLaunching ? 1 : 0,
      transition: 'opacity 0.3s',
      pointerEvents: 'none',
      imageRendering: 'pixelated',
    }}
  >
    {/* 역삼각형 불꽃 (위가 넓고 아래가 좁음) */}
    
    {/* 최하단 (가장 좁음) - 주황색 */}
    <rect x="9" y="17" width="2" height="1" fill="#ff4500"><animate attributeName="opacity" values="0.9;1;0.85" dur="0.1s" repeatCount="indefinite"/></rect>
    
    {/* 하단 - 주황색 */}
    <rect x="8" y="16" width="1" height="1" fill="#ff6b35"><animate attributeName="opacity" values="0.85;1;0.9" dur="0.12s" repeatCount="indefinite"/></rect>
    <rect x="9" y="16" width="2" height="1" fill="#ff8c42"><animate attributeName="opacity" values="1;0.8;1" dur="0.11s" repeatCount="indefinite"/></rect>
    <rect x="11" y="16" width="1" height="1" fill="#ff6b35"><animate attributeName="opacity" values="0.9;1;0.85" dur="0.13s" repeatCount="indefinite"/></rect>
    
    {/* 중하단 - 주황/노랑 */}
    <rect x="7" y="15" width="1" height="1" fill="#ff8c42"><animate attributeName="opacity" values="0.8;1;0.8" dur="0.14s" repeatCount="indefinite"/></rect>
    <rect x="8" y="15" width="2" height="1" fill="#ffa500"><animate attributeName="opacity" values="1;0.85;1" dur="0.12s" repeatCount="indefinite"/></rect>
    <rect x="10" y="15" width="2" height="1" fill="#ffa500"><animate attributeName="opacity" values="0.9;1;0.9" dur="0.11s" repeatCount="indefinite"/></rect>
    <rect x="12" y="15" width="1" height="1" fill="#ff8c42"><animate attributeName="opacity" values="0.85;1;0.8" dur="0.15s" repeatCount="indefinite"/></rect>
    
    {/* 중간 - 노란색 */}
    <rect x="6" y="14" width="1" height="1" fill="#ffa500"><animate attributeName="opacity" values="0.8;1;0.85" dur="0.13s" repeatCount="indefinite"/></rect>
    <rect x="7" y="14" width="2" height="1" fill="#ffd700"><animate attributeName="opacity" values="1;0.9;1" dur="0.12s" repeatCount="indefinite"/></rect>
    <rect x="9" y="14" width="2" height="1" fill="#ffed4e"><animate attributeName="opacity" values="0.95;1;0.9" dur="0.1s" repeatCount="indefinite"/></rect>
    <rect x="11" y="14" width="2" height="1" fill="#ffd700"><animate attributeName="opacity" values="1;0.85;1" dur="0.14s" repeatCount="indefinite"/></rect>
    <rect x="13" y="14" width="1" height="1" fill="#ffa500"><animate attributeName="opacity" values="0.85;1;0.8" dur="0.16s" repeatCount="indefinite"/></rect>
    
    {/* 중상단 - 밝은 노란색 */}
    <rect x="5" y="13" width="1" height="1" fill="#ffd700"><animate attributeName="opacity" values="0.75;1;0.8" dur="0.15s" repeatCount="indefinite"/></rect>
    <rect x="6" y="13" width="2" height="1" fill="#ffed4e"><animate attributeName="opacity" values="1;0.9;1" dur="0.12s" repeatCount="indefinite"/></rect>
    <rect x="8" y="13" width="2" height="1" fill="#fff"><animate attributeName="opacity" values="0.9;1;0.95" dur="0.1s" repeatCount="indefinite"/></rect>
    <rect x="10" y="13" width="2" height="1" fill="#fff"><animate attributeName="opacity" values="1;0.9;1" dur="0.11s" repeatCount="indefinite"/></rect>
    <rect x="12" y="13" width="2" height="1" fill="#ffed4e"><animate attributeName="opacity" values="0.95;1;0.9" dur="0.13s" repeatCount="indefinite"/></rect>
    <rect x="14" y="13" width="1" height="1" fill="#ffd700"><animate attributeName="opacity" values="0.8;1;0.75" dur="0.17s" repeatCount="indefinite"/></rect>
    
    {/* 상단 (가장 넓음) - 흰색/노란색 */}
    <rect x="4" y="12" width="1" height="1" fill="#ffed4e"><animate attributeName="opacity" values="0.7;1;0.75" dur="0.16s" repeatCount="indefinite"/></rect>
    <rect x="5" y="12" width="2" height="1" fill="#fff"><animate attributeName="opacity" values="1;0.85;1" dur="0.11s" repeatCount="indefinite"/></rect>
    <rect x="7" y="12" width="2" height="1" fill="#fff"><animate attributeName="opacity" values="0.9;1;0.9" dur="0.1s" repeatCount="indefinite"/></rect>
    <rect x="9" y="12" width="2" height="1" fill="#fff"><animate attributeName="opacity" values="1;0.95;1" dur="0.09s" repeatCount="indefinite"/></rect>
    <rect x="11" y="12" width="2" height="1" fill="#fff"><animate attributeName="opacity" values="0.95;1;0.9" dur="0.12s" repeatCount="indefinite"/></rect>
    <rect x="13" y="12" width="2" height="1" fill="#fff"><animate attributeName="opacity" values="1;0.9;1" dur="0.13s" repeatCount="indefinite"/></rect>
    <rect x="15" y="12" width="1" height="1" fill="#ffed4e"><animate attributeName="opacity" values="0.75;1;0.7" dur="0.18s" repeatCount="indefinite"/></rect>
    
    {/* 최상단 - 튀는 불똥 */}
    <rect x="6" y="11" width="1" height="1" fill="#fff"><animate attributeName="opacity" values="0;1;0" dur="0.2s" repeatCount="indefinite"/></rect>
    <rect x="9" y="11" width="2" height="1" fill="#fff"><animate attributeName="opacity" values="0.8;1;0.8" dur="0.15s" repeatCount="indefinite"/></rect>
    <rect x="13" y="11" width="1" height="1" fill="#fff"><animate attributeName="opacity" values="0;1;0" dur="0.22s" repeatCount="indefinite" begin="0.1s"/></rect>
    
    <rect x="8" y="10" width="1" height="1" fill="#fff"><animate attributeName="opacity" values="0;0.9;0" dur="0.25s" repeatCount="indefinite"/></rect>
    <rect x="11" y="10" width="1" height="1" fill="#fff"><animate attributeName="opacity" values="0;0.85;0" dur="0.28s" repeatCount="indefinite" begin="0.12s"/></rect>
    
    {/* 양쪽 불똥 */}
    <rect x="3" y="13" width="1" height="1" fill="#ff8c42"><animate attributeName="opacity" values="0;0.8;0" dur="0.3s" repeatCount="indefinite"/></rect>
    <rect x="16" y="13" width="1" height="1" fill="#ff8c42"><animate attributeName="opacity" values="0;0.9;0" dur="0.32s" repeatCount="indefinite" begin="0.1s"/></rect>
    <rect x="2" y="14" width="1" height="1" fill="#ffd700"><animate attributeName="opacity" values="0;0.7;0" dur="0.35s" repeatCount="indefinite" begin="0.15s"/></rect>
    <rect x="17" y="14" width="1" height="1" fill="#ffd700"><animate attributeName="opacity" values="0;0.75;0" dur="0.33s" repeatCount="indefinite" begin="0.08s"/></rect>
  </svg>
);

// 흰색 깃털 하나 (픽셀아트 - 부드럽고 풍성한 디자인)
const WhiteFeather = ({ x, y, rotation = 0, scale = 1 }) => {
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`}>
      {/* 깃털 줄기 */}
      <rect x="7" y="12" width="1" height="3" fill="#e8e4dc"/>
      <rect x="7" y="10" width="1" height="2" fill="#f0ece4"/>
      
      {/* 깃털 몸통 - 넓고 부드러운 형태 */}
      <rect x="4" y="8" width="1" height="4" fill="#fdfcfa"/>
      <rect x="5" y="6" width="1" height="6" fill="#ffffff"/>
      <rect x="6" y="4" width="1" height="8" fill="#fefefe"/>
      <rect x="7" y="2" width="1" height="10" fill="#ffffff"/>
      <rect x="8" y="3" width="1" height="9" fill="#fefefe"/>
      <rect x="9" y="5" width="1" height="7" fill="#ffffff"/>
      <rect x="10" y="7" width="1" height="5" fill="#fdfcfa"/>
      
      {/* 깃털 끝 - 부드러운 곡선 */}
      <rect x="5" y="3" width="1" height="3" fill="#fafafa"/>
      <rect x="6" y="1" width="1" height="3" fill="#f8f8f8"/>
      <rect x="7" y="0" width="1" height="2" fill="#ffffff"/>
      <rect x="8" y="1" width="1" height="2" fill="#f8f8f8"/>
      <rect x="9" y="3" width="1" height="2" fill="#fafafa"/>
      
      {/* 깃털 양쪽 곡선 (더 풍성한 느낌) */}
      <rect x="3" y="10" width="1" height="2" fill="#fdfcfa" opacity="0.7"/>
      <rect x="11" y="9" width="1" height="3" fill="#fdfcfa" opacity="0.7"/>
      
      {/* 깃털 테두리 (연한 그림자) */}
      <rect x="4" y="12" width="1" height="1" fill="#e0dcd4" opacity="0.5"/>
      <rect x="10" y="12" width="1" height="1" fill="#e0dcd4" opacity="0.5"/>
    </g>
  );
};

// 하단 깃털 다발 (깃털 없음)
const BottomFeatherCluster = () => (
  <g>
    {/* 깃털 제거됨 */}
  </g>
);

// 짚단 우주선 본체
const SpaceshipBody = () => (
  <svg 
    width="110" 
    height="115" 
    viewBox="0 0 32 32" 
    xmlns="http://www.w3.org/2000/svg"
    style={{ imageRendering: 'pixelated' }}
  >
    {/* ===== 둥근 로켓 몸통 (더 귀여운 형태) ===== */}
    {/* 외곽 - 어두운 짚색 */}
    <rect x="10" y="4" width="12" height="16" fill="#c4a574" rx="2"/>
    {/* 내부 - 밝은 짚색 */}
    <rect x="11" y="5" width="10" height="14" fill="#f5deb3" rx="1.5"/>
    {/* 하이라이트 */}
    <rect x="12" y="6" width="8" height="12" fill="#ffe4b5" rx="1"/>
    
    {/* 짚 세로 텍스처 */}
    <rect x="13" y="5" width="1" height="14" fill="#c4a574" opacity="0.4"/>
    <rect x="16" y="5" width="1" height="14" fill="#c4a574" opacity="0.4"/>
    <rect x="19" y="5" width="1" height="14" fill="#c4a574" opacity="0.4"/>
    
    {/* 짚 묶음 밴드 */}
    <rect x="10" y="7" width="12" height="2" fill="#a0522d"/>
    <rect x="10" y="14" width="12" height="2" fill="#a0522d"/>
    
    {/* ===== 꼭대기 (둥근 삼각형) ===== */}
    <polygon points="16,0 22,4 10,4" fill="#f5deb3" stroke="#c4a574" strokeWidth="0.5"/>
    <polygon points="16,1 20,4 12,4" fill="#ffe4b5"/>
    
    {/* 귀여운 별 장식 (꼭대기) */}
    <circle cx="16" cy="-1" r="1.5" fill="#ffd700"/>
    <rect x="15.5" y="-2.5" width="1" height="1" fill="#ffe082"/>
    <rect x="15.5" y="0" width="1" height="0.5" fill="#ffe082"/>
    <rect x="14.5" y="-1.5" width="0.5" height="1" fill="#ffe082"/>
    <rect x="17" y="-1.5" width="0.5" height="1" fill="#ffe082"/>
    
    {/* ===== 창문 (둥근 사각형) ===== */}
    <rect x="12" y="9" width="8" height="5" fill="#87CEEB" stroke="#8b7355" strokeWidth="0.8" rx="1"/>
    <rect x="13" y="9.5" width="6" height="4" fill="#b0e0e6" rx="0.8"/>
    {/* 창문 반사 */}
    <rect x="13.5" y="10" width="2.5" height="2" fill="#fff" opacity="0.5" rx="0.5"/>
    <rect x="14" y="10.5" width="1.5" height="1" fill="#fff" opacity="0.7" rx="0.3"/>
    
    {/* ===== 좌우 날개 (수직으로 붙은 깃털) ===== */}
    {/* 왼쪽 깃털 날개 - 우주선 외곽에 수직 */}
    <g>
      {/* 중심 줄기 - 완전히 수직 (일직선) */}
      <line x1="10" y1="10" x2="10" y2="18" stroke="#d8d8d8" strokeWidth="0.5" opacity="0.8"/>
      
      {/* 깃털 날 왼쪽으로 수평 퍼짐 (역삼각형) */}
      {/* 상단 (가장 넓음) */}
      <line x1="10" y1="10.5" x2="5.5" y2="10.5" stroke="#ffffff" strokeWidth="1.2" opacity="0.9" strokeLinecap="round"/>
      <line x1="10" y1="11" x2="6" y2="11" stroke="#fefefe" strokeWidth="1" opacity="0.85" strokeLinecap="round"/>
      
      {/* 중상단 */}
      <line x1="10" y1="12" x2="6.5" y2="12" stroke="#ffffff" strokeWidth="1.1" opacity="0.88" strokeLinecap="round"/>
      <line x1="10" y1="12.5" x2="7" y2="12.5" stroke="#fefefe" strokeWidth="0.9" opacity="0.82" strokeLinecap="round"/>
      
      {/* 중간 */}
      <line x1="10" y1="14" x2="7.5" y2="14" stroke="#ffffff" strokeWidth="0.9" opacity="0.85" strokeLinecap="round"/>
      <line x1="10" y1="14.5" x2="8" y2="14.5" stroke="#f0f8ff" strokeWidth="0.8" opacity="0.8" strokeLinecap="round"/>
      
      {/* 중하단 */}
      <line x1="10" y1="16" x2="8.5" y2="16" stroke="#e8f4fc" strokeWidth="0.7" opacity="0.75" strokeLinecap="round"/>
      <line x1="10" y1="16.5" x2="9" y2="16.5" stroke="#d0e8f0" strokeWidth="0.6" opacity="0.7" strokeLinecap="round"/>
      
      {/* 하단 (가장 좁음) */}
      <line x1="10" y1="17.5" x2="9.5" y2="17.5" stroke="#c0d8e8" strokeWidth="0.5" opacity="0.65" strokeLinecap="round"/>
    </g>
    
    {/* 오른쪽 깃털 날개 - 우주선 외곽에 수직 */}
    <g>
      {/* 중심 줄기 - 완전히 수직 (일직선) */}
      <line x1="22" y1="10" x2="22" y2="18" stroke="#d8d8d8" strokeWidth="0.5" opacity="0.8"/>
      
      {/* 깃털 날 오른쪽으로 수평 퍼짐 (역삼각형) */}
      {/* 상단 (가장 넓음) */}
      <line x1="22" y1="10.5" x2="26.5" y2="10.5" stroke="#ffffff" strokeWidth="1.2" opacity="0.9" strokeLinecap="round"/>
      <line x1="22" y1="11" x2="26" y2="11" stroke="#fefefe" strokeWidth="1" opacity="0.85" strokeLinecap="round"/>
      
      {/* 중상단 */}
      <line x1="22" y1="12" x2="25.5" y2="12" stroke="#ffffff" strokeWidth="1.1" opacity="0.88" strokeLinecap="round"/>
      <line x1="22" y1="12.5" x2="25" y2="12.5" stroke="#fefefe" strokeWidth="0.9" opacity="0.82" strokeLinecap="round"/>
      
      {/* 중간 */}
      <line x1="22" y1="14" x2="24.5" y2="14" stroke="#ffffff" strokeWidth="0.9" opacity="0.85" strokeLinecap="round"/>
      <line x1="22" y1="14.5" x2="24" y2="14.5" stroke="#f0f8ff" strokeWidth="0.8" opacity="0.8" strokeLinecap="round"/>
      
      {/* 중하단 */}
      <line x1="22" y1="16" x2="23.5" y2="16" stroke="#e8f4fc" strokeWidth="0.7" opacity="0.75" strokeLinecap="round"/>
      <line x1="22" y1="16.5" x2="23" y2="16.5" stroke="#d0e8f0" strokeWidth="0.6" opacity="0.7" strokeLinecap="round"/>
      
      {/* 하단 (가장 좁음) */}
      <line x1="22" y1="17.5" x2="22.5" y2="17.5" stroke="#c0d8e8" strokeWidth="0.5" opacity="0.65" strokeLinecap="round"/>
    </g>
    
    {/* ===== 하단 깃털 다발 ===== */}
    <BottomFeatherCluster />
    
    {/* ===== 바닥 엔진 ===== */}
    <rect x="12" y="19" width="8" height="2" fill="#8b4513"/>
    <rect x="13" y="20" width="2" height="1" fill="#4a4a4a"/>
    <rect x="17" y="20" width="2" height="1" fill="#4a4a4a"/>
    
    {/* 귀여운 하트 장식 (더 크고 부드럽게) */}
    <circle cx="15.5" cy="16.5" r="0.8" fill="#ff69b4"/>
    <circle cx="16.5" cy="16.5" r="0.8" fill="#ff69b4"/>
    <polygon points="14.7,16.5 16,18 17.3,16.5" fill="#ff69b4"/>
    {/* 하트 하이라이트 */}
    <circle cx="15.3" cy="16.2" r="0.3" fill="#ffb6d9" opacity="0.7"/>
    <circle cx="16.3" cy="16.2" r="0.3" fill="#ffb6d9" opacity="0.7"/>
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
    
    {/* 좌우 깃털 날개 (미리보기용, 길쭉한 형태) */}
    {/* 왼쪽 깃털 */}
    <g>
      <rect x="4.5" y="4" width="0.3" height="8" fill="#e8e4dc"/>
      <rect x="4.2" y="4.5" width="0.3" height="1.5" fill="#fafafa"/>
      <rect x="4" y="6" width="0.5" height="2" fill="#ffffff"/>
      <rect x="3.5" y="7" width="0.5" height="1.5" fill="#fefefe"/>
      <rect x="4" y="8.5" width="0.5" height="2" fill="#ffffff"/>
      <rect x="4.2" y="10.5" width="0.3" height="1.5" fill="#fafafa"/>
      <line x1="3.5" y1="7" x2="4.8" y2="7" stroke="#e0e0e0" strokeWidth="0.15" opacity="0.4"/>
      <line x1="3.5" y1="8.5" x2="4.8" y2="8.5" stroke="#e0e0e0" strokeWidth="0.15" opacity="0.4"/>
      <line x1="4" y1="10" x2="4.8" y2="10" stroke="#e0e0e0" strokeWidth="0.15" opacity="0.4"/>
    </g>
    {/* 오른쪽 깃털 */}
    <g>
      <rect x="11.2" y="4" width="0.3" height="8" fill="#e8e4dc"/>
      <rect x="11.5" y="4.5" width="0.3" height="1.5" fill="#fafafa"/>
      <rect x="11.5" y="6" width="0.5" height="2" fill="#ffffff"/>
      <rect x="12" y="7" width="0.5" height="1.5" fill="#fefefe"/>
      <rect x="11.5" y="8.5" width="0.5" height="2" fill="#ffffff"/>
      <rect x="11.5" y="10.5" width="0.3" height="1.5" fill="#fafafa"/>
      <line x1="11.2" y1="7" x2="12.5" y2="7" stroke="#e0e0e0" strokeWidth="0.15" opacity="0.4"/>
      <line x1="11.2" y1="8.5" x2="12.5" y2="8.5" stroke="#e0e0e0" strokeWidth="0.15" opacity="0.4"/>
      <line x1="11.2" y1="10" x2="12" y2="10" stroke="#e0e0e0" strokeWidth="0.15" opacity="0.4"/>
    </g>
    
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
          left: x - 55, 
          top: y - 90,
          cursor: isLaunching ? 'default' : 'pointer',
          zIndex: isLaunching ? 200 : 19,
          userSelect: 'none',
          ...getAnimationStyle(),
        }}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
      >
        {/* 발사 불꽃 */}
        <LaunchFlames isLaunching={launchPhase === 2} />
        
        {/* 우주선 본체 */}
        <SpaceshipBody />
        
        {/* 먼지/연기 효과 (카운트다운 중) */}
        {launchPhase === 1 && (
          <>
            {/* 먼지 구름 1 (왼쪽) */}
            <div 
              className="absolute"
              style={{
                bottom: '0px',
                left: '10px',
                width: '50px',
                height: '50px',
                background: 'radial-gradient(circle, rgba(120,100,80,0.8) 0%, rgba(140,120,100,0.4) 40%, transparent 70%)',
                animation: 'dustExpand1 0.8s ease-out infinite',
                pointerEvents: 'none',
              }}
            />
            {/* 먼지 구름 2 (오른쪽) */}
            <div 
              className="absolute"
              style={{
                bottom: '0px',
                left: '50px',
                width: '50px',
                height: '50px',
                background: 'radial-gradient(circle, rgba(100,80,60,0.7) 0%, rgba(130,110,90,0.3) 40%, transparent 70%)',
                animation: 'dustExpand2 0.7s ease-out infinite',
                animationDelay: '0.15s',
                pointerEvents: 'none',
              }}
            />
            {/* 중앙 먼지 입자들 */}
            <div 
              className="absolute"
              style={{
                bottom: '5px',
                left: '35px',
                width: '40px',
                height: '40px',
                background: 'radial-gradient(circle, rgba(140,120,100,0.6) 0%, rgba(160,140,120,0.2) 50%, transparent 70%)',
                animation: 'dustPuff 0.6s ease-out infinite',
                animationDelay: '0.3s',
                pointerEvents: 'none',
              }}
            />
          </>
        )}
        
        {/* 연기 효과 (발사 중) - 클릭 통과 */}
        {launchPhase === 2 && (
          <div 
            className="absolute"
            style={{
              bottom: '0px',
              left: '5px',
              width: '100px',
              height: '80px',
              background: 'radial-gradient(ellipse, rgba(140,140,140,0.95) 0%, rgba(120,120,120,0.7) 40%, rgba(100,100,100,0.3) 70%, transparent 100%)',
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
              transform: scale(0.8);
              opacity: 0.9;
            }
            100% { 
              transform: scale(3.5);
              opacity: 0;
            }
          }
          
          @keyframes dustExpand1 {
            0% { 
              transform: scale(0.3) translateX(0);
              opacity: 0.6;
            }
            100% { 
              transform: scale(1.5) translateX(-15px);
              opacity: 0;
            }
          }
          
          @keyframes dustExpand2 {
            0% { 
              transform: scale(0.3) translateX(0);
              opacity: 0.5;
            }
            100% { 
              transform: scale(1.5) translateX(15px);
              opacity: 0;
            }
          }
          
          @keyframes dustPuff {
            0% { 
              transform: scale(0.5) translateY(0);
              opacity: 0.4;
            }
            100% { 
              transform: scale(1.2) translateY(-10px);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default StrawSpaceship;
