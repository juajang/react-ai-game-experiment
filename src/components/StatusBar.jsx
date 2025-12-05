import { STATE_TEXT, CHICK_STATE_TEXT, JUVENILE_STATE_TEXT, GROWTH_STAGE, GAME_CONFIG } from '../constants/gameConfig';
import Coin from './Coin';

// 픽셀 스타일 프로그레스 바
const PixelBar = ({ value, color, label }) => (
  <div className="flex items-center gap-2 mb-2">
    <span 
      className="min-w-[60px]"
      style={{ color: '#8b7355', fontSize: '10px' }}
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
      className="font-bold min-w-[32px] text-right"
      style={{ color: '#5d4037', fontSize: '10px' }}
    >
      {Math.round(value)}%
    </span>
  </div>
);

const StatusBar = ({ selectedChicken, chickenCount, juvenileCount, chickCount, eggCount, coopCount, sleepingCount, coins, onBuyCoop, canBuyCoop }) => {
  const { hunger, happiness, health, tiredness, state, stage } = selectedChicken || {};
  
  // 단계별 상태 텍스트
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
  
  // 단계별 아이콘
  const getStageIcon = () => {
    switch (stage) {
      case GROWTH_STAGE.CHICK: return '🐥';
      case GROWTH_STAGE.JUVENILE: return '🐤';
      default: return '🐔';
    }
  };
  
  // 단계별 이름
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
  
  // 피로도는 반대로 (높을수록 나쁨)
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
      {/* 헤더 - 코인 표시 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: '16px' }}>{getStageIcon()}</span>
          <span className="font-bold" style={{ color: '#5d4037', fontSize: '12px' }}>
            {getStageName()}
          </span>
        </div>
        
        {/* 코인 표시 */}
        <div 
          className="flex items-center gap-1 px-2 py-1 rounded"
          style={{ 
            backgroundColor: '#e8d5b7',
            border: '2px solid #8b7355',
          }}
        >
          <Coin size={14} />
          <span style={{ color: '#5d4037', fontSize: '11px', fontWeight: 'bold' }}>
            {Math.floor(coins)}
          </span>
        </div>
      </div>
      
      {/* 상태 표시 */}
      <div 
        className="mb-2 px-2 py-1 rounded text-center"
        style={{ 
          backgroundColor: '#e8d5b7',
          border: '2px solid #8b7355',
          color: '#5d4037',
          fontSize: '10px',
        }}
      >
        {getStateText()}
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
      
      {/* 닭집 구매 버튼 */}
      <div className="mt-2 mb-2">
        <button
          onClick={onBuyCoop}
          disabled={!canBuyCoop}
          className="w-full py-1 px-2 rounded font-bold text-xs"
          style={{
            backgroundColor: canBuyCoop ? '#4ade80' : '#9ca3af',
            border: '2px solid ' + (canBuyCoop ? '#22c55e' : '#6b7280'),
            color: 'white',
            cursor: canBuyCoop ? 'pointer' : 'not-allowed',
          }}
        >
          🏠 닭집 구매 ({GAME_CONFIG.COOP.COST} 코인)
        </button>
      </div>
      
      {/* 개체 수 표시 */}
      <div 
        className="pt-2 flex justify-around flex-wrap gap-1"
        style={{ borderTop: '2px dashed #8b7355' }}
      >
        <div className="text-center min-w-[30px]">
          <div style={{ fontSize: '14px' }}>🐔</div>
          <div style={{ color: '#5d4037', fontSize: '10px' }}>{chickenCount || 0}</div>
        </div>
        <div className="text-center min-w-[30px]">
          <div style={{ fontSize: '14px' }}>🐤</div>
          <div style={{ color: '#5d4037', fontSize: '10px' }}>{juvenileCount || 0}</div>
        </div>
        <div className="text-center min-w-[30px]">
          <div style={{ fontSize: '14px' }}>🐥</div>
          <div style={{ color: '#5d4037', fontSize: '10px' }}>{chickCount || 0}</div>
        </div>
        <div className="text-center min-w-[30px]">
          <div style={{ fontSize: '14px' }}>🥚</div>
          <div style={{ color: '#5d4037', fontSize: '10px' }}>{eggCount || 0}</div>
        </div>
        <div className="text-center min-w-[30px]">
          <div style={{ fontSize: '14px' }}>🏠</div>
          <div style={{ color: '#5d4037', fontSize: '10px' }}>{coopCount || 0}</div>
        </div>
        <div className="text-center min-w-[30px]">
          <div style={{ fontSize: '14px' }}>💤</div>
          <div style={{ color: '#5d4037', fontSize: '10px' }}>{sleepingCount || 0}</div>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
