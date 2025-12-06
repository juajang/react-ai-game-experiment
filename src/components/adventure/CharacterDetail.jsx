import { useState } from 'react';
import { GROWTH_STAGE, STATE_TEXT, CHICK_STATE_TEXT, JUVENILE_STATE_TEXT } from '../../constants/gameConfig';

// 큰 닭 스프라이트 (클로즈업용)
const LargeChickenSprite = ({ stage, frame = 0, direction = 1 }) => {
  const size = 120;
  
  if (stage === GROWTH_STAGE.CHICK) {
    return (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 16 16" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ 
          transform: direction < 0 ? 'scaleX(-1)' : 'scaleX(1)',
          imageRendering: 'pixelated',
        }}
      >
        {/* 병아리 */}
        <rect x="3" y="7" width="1" height="2" fill="#f3e17a" />
        <rect x="5" y="5" width="6" height="6" fill="#ffe866" />
        <rect x="4" y="6" width="8" height="4" fill="#ffe866" />
        <rect x="4" y="7" width="2" height="2" fill="#f7d94d" />
        <rect x="10" y="7" width="2" height="2" fill="#f7d94d" />
        <rect x="6" y="6" width="1" height="1" fill="#000" />
        <rect x="9" y="6" width="1" height="1" fill="#000" />
        <rect x="7" y="7" width="2" height="1" fill="#ffb347" />
        <rect x="6" y="11" width="1" height="1" fill="#ff9933" />
        <rect x="9" y="11" width="1" height="1" fill="#ff9933" />
      </svg>
    );
  }
  
  if (stage === GROWTH_STAGE.JUVENILE) {
    return (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 16 16" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ 
          transform: direction < 0 ? 'scaleX(-1)' : 'scaleX(1)',
          imageRendering: 'pixelated',
        }}
      >
        {/* 청소년 닭 */}
        <rect x="3" y="6" width="1" height="3" fill="#f3e17a" />
        <rect x="5" y="5" width="6" height="6" fill="#ffe866" />
        <rect x="4" y="6" width="8" height="4" fill="#ffe866" />
        <rect x="4" y="7" width="2" height="2" fill="#f7d94d" />
        <rect x="10" y="7" width="2" height="2" fill="#f7d94d" />
        <rect x="6" y="6" width="1" height="1" fill="#000" />
        <rect x="9" y="6" width="1" height="1" fill="#000" />
        <rect x="7" y="7" width="2" height="1" fill="#ffb347" />
        <rect x="7" y="3" width="1" height="1" fill="#ff6666" />
        <rect x="8" y="3" width="1" height="1" fill="#ff6666" />
        <rect x="6" y="11" width="1" height="1" fill="#ff9933" />
        <rect x="9" y="11" width="1" height="1" fill="#ff9933" />
      </svg>
    );
  }
  
  // 성체 닭
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 16 16" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ 
        transform: direction < 0 ? 'scaleX(-1)' : 'scaleX(1)',
        imageRendering: 'pixelated',
      }}
    >
      {/* 꼬리 */}
      <rect x="3" y="6" width="1" height="2" fill="#c4a574" />
      {/* 몸통 */}
      <rect x="5" y="4" width="6" height="7" fill="#fff8e1" />
      <rect x="4" y="6" width="8" height="4" fill="#fff8e1" />
      {/* 날개 */}
      <rect x="4" y="7" width="2" height="2" fill="#e8d5b7" />
      <rect x="10" y="7" width="2" height="2" fill="#e8d5b7" />
      {/* 눈 */}
      <rect x="6" y="5" width="1" height="1" fill="#000" />
      <rect x="9" y="5" width="1" height="1" fill="#000" />
      {/* 부리 */}
      <rect x="7" y="6" width="2" height="1" fill="#ff9800" />
      {/* 볏 */}
      <rect x="7" y="3" width="1" height="1" fill="#f44336" />
      <rect x="8" y="2" width="1" height="1" fill="#f44336" />
      <rect x="9" y="3" width="1" height="1" fill="#f44336" />
      {/* 발 */}
      <rect x="6" y="11" width="1" height="1" fill="#ff9800" />
      <rect x="9" y="11" width="1" height="1" fill="#ff9800" />
    </svg>
  );
};

// 상태 바 컴포넌트
const StatBar = ({ value, color, label, icon }) => (
  <div className="flex items-center gap-1 mb-1">
    <span style={{ fontSize: '10px', width: '16px' }}>{icon}</span>
    <div 
      className="flex-1 h-2 rounded overflow-hidden"
      style={{ backgroundColor: '#3d3d3d', border: '1px solid #5d4037' }}
    >
      <div 
        className="h-full transition-all duration-300"
        style={{ 
          width: `${value}%`,
          backgroundColor: color,
        }}
      />
    </div>
    <span style={{ fontSize: '8px', color: '#a0a0a0', width: '24px', textAlign: 'right' }}>
      {Math.round(value)}%
    </span>
  </div>
);

const CharacterDetail = ({ 
  selectedChicken, 
  onNameChange,
  coins = 0,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState('');
  
  const { 
    id, 
    name, 
    stage = GROWTH_STAGE.ADULT, 
    state = 'idle',
    hunger = 50, 
    happiness = 50, 
    health = 100, 
    tiredness = 0,
    frame = 0,
    direction = 1,
    growthProgress = 0,
  } = selectedChicken || {};
  
  const getStateText = () => {
    if (!stage) return STATE_TEXT?.default || '대기 중';
    switch (stage) {
      case GROWTH_STAGE.CHICK:
        return CHICK_STATE_TEXT?.[state] || CHICK_STATE_TEXT?.default || '대기 중';
      case GROWTH_STAGE.JUVENILE:
        return JUVENILE_STATE_TEXT?.[state] || JUVENILE_STATE_TEXT?.default || '대기 중';
      default:
        return STATE_TEXT?.[state] || STATE_TEXT?.default || '대기 중';
    }
  };
  
  const getStageName = () => {
    switch (stage) {
      case GROWTH_STAGE.CHICK: return '🐥 병아리';
      case GROWTH_STAGE.JUVENILE: return '🐤 청소년';
      default: return '🐔 성체';
    }
  };
  
  const getColor = (value, thresholds = { high: 70, low: 30 }) => {
    if (value > thresholds.high) return '#4caf50';
    if (value > thresholds.low) return '#ff9800';
    return '#f44336';
  };
  
  const getTirednessColor = (value) => {
    if (value < 30) return '#4caf50';
    if (value < 70) return '#ff9800';
    return '#f44336';
  };
  
  if (!selectedChicken) {
    return (
      <div 
        className="rounded-lg p-3 flex flex-col items-center justify-center"
        style={{
          backgroundColor: '#f5e6c8',
          border: '3px solid #8b7355',
          boxShadow: '3px 3px 0px #5d4037',
          minHeight: '200px',
        }}
      >
        <div style={{ fontSize: '48px', opacity: 0.3 }}>🐔</div>
        <p style={{ color: '#8b7355', fontSize: '11px', marginTop: '8px' }}>
          닭을 선택해주세요
        </p>
      </div>
    );
  }

  return (
    <div 
      className="rounded-lg overflow-hidden"
      style={{
        backgroundColor: '#f5e6c8',
        border: '3px solid #8b7355',
        boxShadow: '3px 3px 0px #5d4037',
      }}
    >
      {/* 헤더 - 코인 표시 */}
      <div 
        className="px-2 py-1 flex justify-between items-center"
        style={{ 
          backgroundColor: '#e8d5b7',
          borderBottom: '2px solid #8b7355',
        }}
      >
        <span style={{ fontSize: '10px', color: '#5d4037' }}>{getStageName()}</span>
        <div className="flex items-center gap-1">
          <span style={{ fontSize: '12px' }}>🪙</span>
          <span style={{ fontSize: '10px', color: '#b8860b', fontWeight: 'bold' }}>
            {Math.floor(coins)}
          </span>
        </div>
      </div>
      
      {/* 닭 클로즈업 */}
      <div 
        className="flex justify-center items-center py-2"
        style={{ backgroundColor: '#fff8e1' }}
      >
        <div className="relative">
          <LargeChickenSprite stage={stage} frame={frame} direction={direction} />
          
          {/* 상태 이모티콘 */}
          <div 
            className="absolute -top-2 -right-2 animate-bounce"
            style={{ fontSize: '16px' }}
          >
            {state === 'eating' && '😋'}
            {state === 'sleeping' && '💤'}
            {state === 'laying' && '🥚'}
            {health < 30 && '💔'}
          </div>
        </div>
      </div>
      
      {/* 이름 */}
      <div 
        className="text-center py-1 px-2"
        style={{ 
          backgroundColor: '#e8d5b7',
          borderTop: '2px solid #8b7355',
          borderBottom: '2px solid #8b7355',
        }}
      >
        {isEditingName ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={() => {
              if (editName.trim() && onNameChange && id) {
                onNameChange(id, editName.trim());
              }
              setIsEditingName(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (editName.trim() && onNameChange && id) {
                  onNameChange(id, editName.trim());
                }
                setIsEditingName(false);
              }
              if (e.key === 'Escape') {
                setIsEditingName(false);
              }
            }}
            autoFocus
            className="text-center font-bold px-2 py-0.5 rounded outline-none w-full"
            style={{ 
              color: '#5d4037', 
              fontSize: '12px',
              backgroundColor: '#fff',
              border: '2px solid #f59e0b',
            }}
          />
        ) : (
          <div 
            className="font-bold cursor-pointer hover:underline"
            style={{ color: '#5d4037', fontSize: '12px' }}
            onClick={() => {
              setEditName(name || getStageName());
              setIsEditingName(true);
            }}
            title="클릭해서 이름 변경"
          >
            {name || '이름 없음'}
          </div>
        )}
        <div 
          className="mt-1 px-2 py-0.5 rounded inline-block"
          style={{ 
            backgroundColor: '#c4a574',
            color: '#fff',
            fontSize: '9px',
          }}
        >
          {getStateText()}
        </div>
      </div>
      
      {/* 상태 바들 */}
      <div className="p-2">
        <StatBar 
          value={hunger} 
          color={getColor(hunger)} 
          icon="🍽️"
        />
        <StatBar 
          value={happiness} 
          color={getColor(happiness, { high: 60, low: 40 })} 
          icon="😊"
        />
        <StatBar 
          value={health} 
          color={getColor(health, { high: 80, low: 60 })} 
          icon="❤️"
        />
        <StatBar 
          value={tiredness} 
          color={getTirednessColor(tiredness)} 
          icon="😪"
        />
        
        {/* 성장 진행도 (병아리/청소년만) */}
        {(stage === GROWTH_STAGE.CHICK || stage === GROWTH_STAGE.JUVENILE) && (
          <div className="mt-2 pt-2" style={{ borderTop: '1px dashed #8b7355' }}>
            <div className="flex items-center gap-1">
              <span style={{ fontSize: '10px' }}>📈</span>
              <div 
                className="flex-1 h-2 rounded overflow-hidden"
                style={{ backgroundColor: '#3d3d3d', border: '1px solid #5d4037' }}
              >
                <div 
                  className="h-full transition-all duration-300"
                  style={{ 
                    width: `${growthProgress}%`,
                    backgroundColor: stage === GROWTH_STAGE.CHICK ? '#4caf50' : '#ff9800',
                  }}
                />
              </div>
              <span style={{ fontSize: '8px', color: '#a0a0a0' }}>
                {Math.round(growthProgress)}%
              </span>
            </div>
            <div style={{ fontSize: '8px', color: '#8b7355', textAlign: 'center', marginTop: '2px' }}>
              성장 진행도
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterDetail;

