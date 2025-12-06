import { useState } from 'react';
import { STATE_TEXT, CHICK_STATE_TEXT, JUVENILE_STATE_TEXT, GROWTH_STAGE } from '../../constants/gameConfig';
import { CHICKEN_COLORS, CHICK_COLORS, JUVENILE_COLORS } from '../../constants/sprites';
import Coin from './Coin';

// 도트 스타일 닭 얼굴 클로즈업 (기존 스프라이트와 동일, viewBox로 얼굴만 확대)
const PixelChickenFace = ({ stage, state = 'idle', size = 60 }) => {
  const isSleeping = state === 'sleeping';
  const isEating = state === 'eating';
  const headOffset = isEating ? 1 : 0;
  
  if (stage === GROWTH_STAGE.CHICK) {
    const colors = CHICK_COLORS;
    // 병아리 - 기존 스프라이트와 동일한 좌표, viewBox로 얼굴만 확대
    return (
      <svg 
        width={size} 
        height={size} 
        viewBox="4 4 8 7" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* 몸통 (얼굴 배경) */}
        <rect x="5" y="5" width="6" height="6" fill={colors.BODY} />
        <rect x="4" y="6" width="8" height="4" fill={colors.BODY} />
        
        {/* 날개 (음영) */}
        <rect x="4" y="7" width="2" height="2" fill={colors.BODY_SHADE} />
        <rect x="10" y="7" width="2" height="2" fill={colors.BODY_SHADE} />
        
        {/* 눈 - 1x1 픽셀 */}
        {isSleeping ? (
          <>
            <rect x="6" y="7" width="1" height="1" fill={colors.EYE} />
            <rect x="9" y="7" width="1" height="1" fill={colors.EYE} />
          </>
        ) : (
          <>
            <rect x="6" y="6" width="1" height="1" fill={colors.EYE} />
            <rect x="9" y="6" width="1" height="1" fill={colors.EYE} />
          </>
        )}
        
        {/* 부리 */}
        <rect x="7" y="7" width="2" height="1" fill={colors.BEAK} />
        {isEating && <rect x="7" y="8" width="2" height="1" fill={colors.BEAK} />}
      </svg>
    );
  }
  
  if (stage === GROWTH_STAGE.JUVENILE) {
    const colors = JUVENILE_COLORS;
    // 청소년 - 기존 스프라이트와 동일한 좌표
    return (
      <svg 
        width={size} 
        height={size} 
        viewBox="4 2 8 7" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* 몸통 (얼굴 배경) */}
        <rect x="5" y="4" width="6" height="6" fill={colors.BODY} />
        <rect x="4" y="6" width="8" height="3" fill={colors.BODY} />
        
        {/* 날개 (음영) */}
        <rect x="4" y="7" width="2" height="2" fill={colors.BODY_SHADE} />
        <rect x="10" y="7" width="2" height="2" fill={colors.BODY_SHADE} />
        
        {/* 볏 */}
        <rect x="7" y={3 + headOffset} width="1" height="1" fill={colors.COMB} />
        <rect x="8" y={2 + headOffset} width="1" height="1" fill={colors.COMB} />
        <rect x="9" y={3 + headOffset} width="1" height="1" fill={colors.COMB} />
        
        {/* 눈 - 1x1 픽셀 */}
        {isSleeping ? (
          <>
            <rect x="6" y="6" width="1" height="1" fill={colors.EYE} />
            <rect x="9" y="6" width="1" height="1" fill={colors.EYE} />
          </>
        ) : (
          <>
            <rect x="6" y={5 + headOffset} width="1" height="1" fill={colors.EYE} />
            <rect x="9" y={5 + headOffset} width="1" height="1" fill={colors.EYE} />
          </>
        )}
        
        {/* 부리 */}
        <rect x="7" y={6 + headOffset} width="2" height="1" fill={colors.BEAK} />
        {isEating && <rect x="7" y={7 + headOffset} width="2" height="1" fill={colors.BEAK} />}
      </svg>
    );
  }
  
  // 성체 닭 - 기존 ChickenSprite와 동일한 좌표, viewBox로 얼굴만 확대
  const colors = CHICKEN_COLORS;
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="4 1 8 8" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ imageRendering: 'pixelated' }}
    >
      {/* 몸통 (얼굴 배경) */}
      <rect x="5" y="4" width="6" height="7" fill={colors.BODY} />
      <rect x="4" y="6" width="8" height="4" fill={colors.BODY} />
      
      {/* 날개 (음영) */}
      <rect x="4" y="7" width="2" height="2" fill={colors.BODY_SHADE} />
      <rect x="10" y="7" width="2" height="2" fill={colors.BODY_SHADE} />
      
      {/* 볏 */}
      <rect x="7" y={3 + headOffset} width="1" height="1" fill={colors.COMB} />
      <rect x="8" y={2 + headOffset} width="1" height="1" fill={colors.COMB} />
      <rect x="9" y={3 + headOffset} width="1" height="1" fill={colors.COMB} />
      
      {/* 눈 - 1x1 픽셀 (기존 스프라이트와 동일) */}
      {isSleeping ? (
        <>
          <rect x="6" y="6" width="1" height="1" fill={colors.EYE} />
          <rect x="9" y="6" width="1" height="1" fill={colors.EYE} />
        </>
      ) : (
        <>
          <rect x="6" y={5 + headOffset} width="1" height="1" fill={colors.EYE} />
          <rect x="9" y={5 + headOffset} width="1" height="1" fill={colors.EYE} />
        </>
      )}
      
      {/* 부리 */}
      <rect x="7" y={6 + headOffset} width="2" height="1" fill={colors.BEAK} />
      {isEating && <rect x="7" y={7 + headOffset} width="2" height="1" fill={colors.BEAK} />}
    </svg>
  );
};

// 픽셀 스타일 프로그레스 바
const PixelBar = ({ value, color, label }) => (
  <div className="flex items-center gap-2 mb-1">
    <span 
      className="min-w-[55px]"
      style={{ color: '#8b7355', fontSize: '9px' }}
    >
      {label}
    </span>
    <div 
      className="flex-1 h-3 overflow-hidden relative"
      style={{ backgroundColor: '#3d3d3d', border: '2px solid #5d4037' }}
    >
      <div 
        className="h-full transition-all duration-300"
        style={{ 
          width: `${value}%`,
          backgroundColor: color,
          boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.3)',
        }}
      />
    </div>
    <span 
      className="font-bold min-w-[28px] text-right"
      style={{ color: '#5d4037', fontSize: '9px' }}
    >
      {Math.round(value)}%
    </span>
  </div>
);

const StatusBar = ({ selectedChicken, chickenCount, juvenileCount, chickCount, eggCount, deathCount, coins, onNameChange }) => {
  const { hunger, happiness, health, tiredness, state, stage, name, id } = selectedChicken || {};
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState('');
  
  const getStateText = () => {
    if (!stage) return STATE_TEXT.default;
    switch (stage) {
      case GROWTH_STAGE.CHICK:
        return CHICK_STATE_TEXT[state] || CHICK_STATE_TEXT.default;
      case GROWTH_STAGE.JUVENILE:
        return JUVENILE_STATE_TEXT[state] || JUVENILE_STATE_TEXT.default;
      default:
        return STATE_TEXT[state] || STATE_TEXT.default;
    }
  };
  
  const getStageIcon = () => {
    switch (stage) {
      case GROWTH_STAGE.CHICK: return '🐥';
      case GROWTH_STAGE.JUVENILE: return '🐤';
      default: return '🐔';
    }
  };
  
  const getStageName = () => {
    switch (stage) {
      case GROWTH_STAGE.CHICK: return '병아리';
      case GROWTH_STAGE.JUVENILE: return '청소년';
      default: return '성체 닭';
    }
  };
  
  const getColor = (value, thresholds = { high: 70, low: 30 }) => {
    if (value > thresholds.high) return '#22c55e';
    if (value > thresholds.low) return '#eab308';
    return '#ef4444';
  };
  
  const getTirednessColor = (value) => {
    if (value < 30) return '#22c55e';
    if (value < 70) return '#eab308';
    return '#ef4444';
  };

  return (
    <div 
      className="p-3 rounded-lg"
      style={{
        backgroundColor: '#f5e6c8',
        border: '4px solid #8b7355',
        boxShadow: '4px 4px 0px #5d4037',
      }}
    >
      <div className="flex gap-3" style={{ alignItems: 'stretch' }}>
        {/* 닭 얼굴 클로즈업 - 정사각형, 우측 영역과 높이 맞춤 */}
        <div 
          className="flex-shrink-0 flex items-center justify-center rounded-lg"
          style={{ 
            backgroundColor: '#fff8e1',
            border: '3px solid #8b7355',
            width: '110px',
            minHeight: '110px',
            aspectRatio: '1',
          }}
        >
          {selectedChicken ? (
            <PixelChickenFace stage={stage} state={state} size={90} />
          ) : (
            <span style={{ fontSize: '48px', opacity: 0.3 }}>🐔</span>
          )}
        </div>
        
        {/* 정보 영역 */}
        <div className="flex-1">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span style={{ fontSize: '14px' }}>{getStageIcon()}</span>
              
              {/* 이름 (클릭하면 편집 가능) */}
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
                  className="font-bold px-1 rounded outline-none"
                  style={{ 
                    color: '#5d4037', 
                    fontSize: '11px',
                    backgroundColor: '#fff',
                    border: '2px solid #f59e0b',
                    width: '70px',
                  }}
                />
              ) : (
                <span 
                  className="font-bold cursor-pointer hover:underline"
                  style={{ color: '#5d4037', fontSize: '11px' }}
                  onClick={() => {
                    setEditName(name || getStageName());
                    setIsEditingName(true);
                  }}
                  title="클릭해서 이름 변경"
                >
                  {name || getStageName()}
                </span>
              )}
              
              <span 
                className="px-2 py-0.5 rounded"
                style={{ 
                  backgroundColor: '#e8d5b7',
                  border: '2px solid #8b7355',
                  color: '#5d4037',
                  fontSize: '9px',
                }}
              >
                {getStateText()}
              </span>
            </div>
            
            {/* 코인 */}
            <div 
              className="flex items-center gap-1 px-2 py-1 rounded"
              style={{ backgroundColor: '#e8d5b7', border: '2px solid #8b7355' }}
            >
              <Coin size={14} />
              <span style={{ color: '#5d4037', fontSize: '11px', fontWeight: 'bold' }}>
                {Math.floor(coins)}
              </span>
            </div>
          </div>
          
          {/* 스탯 바들 */}
          {selectedChicken && (
            <>
              <PixelBar value={hunger || 0} color={getColor(hunger)} label="🍽️ 포만감" />
              <PixelBar value={happiness || 0} color={getColor(happiness, { high: 60, low: 40 })} label="😊 행복도" />
              <PixelBar value={health || 0} color={getColor(health, { high: 80, low: 60 })} label="❤️ 건강" />
              <PixelBar value={tiredness || 0} color={getTirednessColor(tiredness)} label="😪 피로도" />
            </>
          )}
        </div>
      </div>
      
      {/* 개체 수 */}
      <div 
        className="mt-2 pt-2 flex justify-around"
        style={{ borderTop: '2px dashed #8b7355' }}
      >
        <div className="text-center">
          <div style={{ fontSize: '12px' }}>🥚</div>
          <div style={{ color: '#5d4037', fontSize: '9px' }}>{eggCount || 0}</div>
        </div>
        <div className="text-center">
          <div style={{ fontSize: '12px' }}>🐥</div>
          <div style={{ color: '#5d4037', fontSize: '9px' }}>{chickCount || 0}</div>
        </div>
        <div className="text-center">
          <div style={{ fontSize: '12px' }}>🐤</div>
          <div style={{ color: '#5d4037', fontSize: '9px' }}>{juvenileCount || 0}</div>
        </div>
        <div className="text-center">
          <div style={{ fontSize: '12px' }}>🐔</div>
          <div style={{ color: '#5d4037', fontSize: '9px' }}>{chickenCount || 0}</div>
        </div>
        <div className="text-center">
          <div style={{ fontSize: '12px' }}>💀</div>
          <div style={{ color: '#ef4444', fontSize: '9px', fontWeight: 'bold' }}>{deathCount || 0}</div>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;

