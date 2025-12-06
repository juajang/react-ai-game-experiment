import { useState } from 'react';
import { GROWTH_STAGE, STATE_TEXT, CHICK_STATE_TEXT, JUVENILE_STATE_TEXT } from '../../constants/gameConfig';
import { CHICKEN_COLORS, CHICK_COLORS, JUVENILE_COLORS } from '../../constants/sprites';

// 도트 스타일 닭 얼굴 클로즈업 (기존 스프라이트 스타일)
const PixelChickenFace = ({ stage, state = 'idle' }) => {
  const isSleeping = state === 'sleeping';
  const isEating = state === 'eating';
  
  if (stage === GROWTH_STAGE.CHICK) {
    const colors = CHICK_COLORS;
    // 병아리 얼굴 클로즈업 - viewBox로 얼굴 부분만 확대
    return (
      <svg 
        width="100%" 
        height="100%" 
        viewBox="2 2 12 10" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* 머리/몸통 */}
        <rect x="5" y="5" width="6" height="5" fill={colors.BODY} />
        <rect x="4" y="6" width="8" height="3" fill={colors.BODY} />
        
        {/* 날개 (음영) */}
        <rect x="4" y="7" width="2" height="2" fill={colors.BODY_SHADE} />
        <rect x="10" y="7" width="2" height="2" fill={colors.BODY_SHADE} />
        
        {/* 눈 */}
        {isSleeping ? (
          <>
            {/* 감은 눈 - 가로선 */}
            <rect x="6" y="6" width="1" height="1" fill={colors.EYE} />
            <rect x="9" y="6" width="1" height="1" fill={colors.EYE} />
          </>
        ) : (
          <>
            {/* 일반 눈 */}
            <rect x="6" y="6" width="1" height="1" fill={colors.EYE} />
            <rect x="9" y="6" width="1" height="1" fill={colors.EYE} />
            {/* 눈 하이라이트 */}
            <rect x="6" y="6" width="1" height="1" fill="#fff" fillOpacity="0.3" />
            <rect x="9" y="6" width="1" height="1" fill="#fff" fillOpacity="0.3" />
          </>
        )}
        
        {/* 부리 */}
        <rect x="7" y="7" width="2" height="1" fill={colors.BEAK} />
        {isEating && <rect x="7" y="8" width="2" height="1" fill={colors.BEAK} />}
        
        {/* 머리 깃털 */}
        <rect x="7" y="4" width="1" height="1" fill={colors.BODY} />
        <rect x="8" y="3" width="1" height="1" fill={colors.BODY} />
      </svg>
    );
  }
  
  if (stage === GROWTH_STAGE.JUVENILE) {
    const colors = JUVENILE_COLORS;
    // 청소년 닭 얼굴 클로즈업
    return (
      <svg 
        width="100%" 
        height="100%" 
        viewBox="2 1 12 11" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* 머리/몸통 */}
        <rect x="5" y="4" width="6" height="6" fill={colors.BODY} />
        <rect x="4" y="6" width="8" height="3" fill={colors.BODY} />
        
        {/* 날개 (음영) */}
        <rect x="4" y="7" width="2" height="2" fill={colors.BODY_SHADE} />
        <rect x="10" y="7" width="2" height="2" fill={colors.BODY_SHADE} />
        
        {/* 눈 */}
        {isSleeping ? (
          <>
            <rect x="6" y="5" width="1" height="1" fill={colors.EYE} />
            <rect x="9" y="5" width="1" height="1" fill={colors.EYE} />
          </>
        ) : (
          <>
            <rect x="6" y="5" width="1" height="1" fill={colors.EYE} />
            <rect x="9" y="5" width="1" height="1" fill={colors.EYE} />
            <rect x="6" y="5" width="1" height="1" fill="#fff" fillOpacity="0.3" />
            <rect x="9" y="5" width="1" height="1" fill="#fff" fillOpacity="0.3" />
          </>
        )}
        
        {/* 부리 */}
        <rect x="7" y="6" width="2" height="1" fill={colors.BEAK} />
        {isEating && <rect x="7" y="7" width="2" height="1" fill={colors.BEAK} />}
        
        {/* 작은 볏 */}
        <rect x="7" y="3" width="1" height="1" fill={colors.COMB} />
        <rect x="8" y="2" width="1" height="1" fill={colors.COMB} />
        <rect x="9" y="3" width="1" height="1" fill={colors.COMB} />
      </svg>
    );
  }
  
  // 성체 닭 얼굴 클로즈업
  const colors = CHICKEN_COLORS;
  return (
    <svg 
      width="100%" 
      height="100%" 
      viewBox="2 0 12 12" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ imageRendering: 'pixelated' }}
    >
      {/* 머리/몸통 */}
      <rect x="5" y="4" width="6" height="6" fill={colors.BODY} />
      <rect x="4" y="6" width="8" height="3" fill={colors.BODY} />
      
      {/* 날개 (음영) */}
      <rect x="4" y="7" width="2" height="2" fill={colors.BODY_SHADE} />
      <rect x="10" y="7" width="2" height="2" fill={colors.BODY_SHADE} />
      
      {/* 눈 */}
      {isSleeping ? (
        <>
          {/* 감은 눈 - 가로선 */}
          <rect x="6" y="5" width="1" height="1" fill={colors.EYE} />
          <rect x="9" y="5" width="1" height="1" fill={colors.EYE} />
        </>
      ) : (
        <>
          {/* 일반 눈 */}
          <rect x="6" y="5" width="1" height="1" fill={colors.EYE} />
          <rect x="9" y="5" width="1" height="1" fill={colors.EYE} />
          {/* 눈 하이라이트 */}
          <rect x="6" y="5" width="1" height="1" fill="#fff" fillOpacity="0.3" />
          <rect x="9" y="5" width="1" height="1" fill="#fff" fillOpacity="0.3" />
        </>
      )}
      
      {/* 부리 */}
      <rect x="7" y="6" width="2" height="1" fill={colors.BEAK} />
      {isEating && <rect x="7" y="7" width="2" height="1" fill={colors.BEAK} />}
      
      {/* 볏 */}
      <rect x="7" y="3" width="1" height="1" fill={colors.COMB} />
      <rect x="8" y="2" width="1" height="1" fill={colors.COMB} />
      <rect x="9" y="3" width="1" height="1" fill={colors.COMB} />
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
    growthProgress = 0,
    level = 1,
    experience = 0,
    expForNextLevel = 100,
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
      {/* 헤더 - 레벨 & 코인 표시 */}
      <div 
        className="px-2 py-1 flex justify-between items-center"
        style={{ 
          backgroundColor: '#e8d5b7',
          borderBottom: '2px solid #8b7355',
        }}
      >
        <div className="flex items-center gap-2">
          <span style={{ fontSize: '10px', color: '#5d4037' }}>{getStageName()}</span>
          <span 
            className="px-1.5 py-0.5 rounded"
            style={{ 
              fontSize: '9px', 
              color: '#fff',
              backgroundColor: level >= 10 ? '#f59e0b' : level >= 5 ? '#8b5cf6' : '#3b82f6',
              fontWeight: 'bold',
            }}
          >
            Lv.{level}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span style={{ fontSize: '12px' }}>🪙</span>
          <span style={{ fontSize: '10px', color: '#b8860b', fontWeight: 'bold' }}>
            {Math.floor(coins)}
          </span>
        </div>
      </div>
      
      {/* 닭 얼굴 클로즈업 */}
      <div 
        className="relative flex justify-center items-center"
        style={{ 
          backgroundColor: '#fff8e1',
          height: '140px',
          overflow: 'hidden',
        }}
      >
        <div 
          className="w-full h-full flex justify-center items-center"
          style={{ padding: '8px' }}
        >
          <PixelChickenFace stage={stage} state={state} />
        </div>
        
        {/* 상태 이모티콘 */}
        <div 
          className="absolute top-2 right-2 animate-bounce"
          style={{ fontSize: '20px' }}
        >
          {state === 'eating' && '😋'}
          {state === 'sleeping' && '💤'}
          {state === 'laying' && '🥚'}
          {health < 30 && '💔'}
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
        
        {/* 경험치 바 */}
        <div className="mt-2 pt-2" style={{ borderTop: '1px dashed #8b7355' }}>
          <div className="flex items-center gap-1">
            <span style={{ fontSize: '10px' }}>⭐</span>
            <div 
              className="flex-1 h-2 rounded overflow-hidden"
              style={{ backgroundColor: '#3d3d3d', border: '1px solid #5d4037' }}
            >
              <div 
                className="h-full transition-all duration-300"
                style={{ 
                  width: `${(experience / expForNextLevel) * 100}%`,
                  backgroundColor: '#fbbf24',
                  boxShadow: 'inset 0 0 4px rgba(255,255,255,0.5)',
                }}
              />
            </div>
            <span style={{ fontSize: '8px', color: '#a0a0a0' }}>
              {experience}/{expForNextLevel}
            </span>
          </div>
          <div style={{ fontSize: '8px', color: '#8b7355', textAlign: 'center', marginTop: '2px' }}>
            다음 레벨까지 경험치
          </div>
        </div>
        
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

