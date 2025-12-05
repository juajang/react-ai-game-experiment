import { STATE_TEXT } from '../constants/gameConfig';

// 픽셀 스타일 프로그레스 바
const PixelBar = ({ value, color, label }) => (
  <div className="flex items-center gap-2 mb-2">
    <span 
      className="min-w-[60px]"
      style={{ color: '#8b7355', fontSize: '11px' }}
    >
      {label}
    </span>
    <div 
      className="flex-1 h-4 overflow-hidden relative"
      style={{ backgroundColor: '#3d3d3d', border: '2px solid #5d4037' }}
    >
      <div 
        className="h-full transition-all duration-300"
        style={{ 
          width: `${value}%`,
          backgroundColor: color,
          boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.3)',
        }}
      />
      <div 
        className="absolute top-0 left-0 h-1"
        style={{ backgroundColor: 'rgba(255,255,255,0.3)', width: `${value}%` }}
      />
    </div>
    <span 
      className="font-bold min-w-[40px] text-right"
      style={{ color: '#5d4037', fontSize: '11px' }}
    >
      {Math.round(value)}%
    </span>
  </div>
);

const StatusBar = ({ chicken, chickenCount, juvenileCount, chickCount, eggCount }) => {
  const { hunger, happiness, health, state } = chicken || {};
  const stateText = STATE_TEXT[state] || STATE_TEXT.default;
  
  const getColor = (value, thresholds = { high: 70, low: 30 }) => {
    if (value > thresholds.high) return '#22c55e';
    if (value > thresholds.low) return '#eab308';
    return '#ef4444';
  };

  return (
    <div 
      className="p-4 rounded-lg"
      style={{
        backgroundColor: '#f5e6c8',
        border: '4px solid #8b7355',
        boxShadow: '4px 4px 0px #5d4037',
      }}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold" style={{ color: '#5d4037', fontSize: '14px' }}>
          🐔 농장 상태
        </span>
        <span 
          className="px-3 py-1 rounded"
          style={{ 
            backgroundColor: '#e8d5b7',
            border: '2px solid #8b7355',
            color: '#5d4037',
            fontSize: '11px',
          }}
        >
          {stateText}
        </span>
      </div>
      
      {/* 스탯 바들 */}
      <PixelBar value={hunger || 0} color={getColor(hunger)} label="🍽️ 포만감" />
      <PixelBar value={happiness || 0} color={getColor(happiness, { high: 60, low: 40 })} label="😊 행복도" />
      <PixelBar value={health || 0} color={getColor(health, { high: 80, low: 60 })} label="❤️ 건강" />
      
      {/* 개체 수 표시 */}
      <div 
        className="mt-3 pt-3 flex justify-around"
        style={{ borderTop: '2px dashed #8b7355' }}
      >
        <div className="text-center">
          <div style={{ fontSize: '16px' }}>🐔</div>
          <div style={{ color: '#5d4037', fontSize: '11px' }}>{chickenCount || 0}</div>
        </div>
        <div className="text-center">
          <div style={{ fontSize: '16px' }}>🐤</div>
          <div style={{ color: '#5d4037', fontSize: '11px' }}>{juvenileCount || 0}</div>
        </div>
        <div className="text-center">
          <div style={{ fontSize: '16px' }}>🐥</div>
          <div style={{ color: '#5d4037', fontSize: '11px' }}>{chickCount || 0}</div>
        </div>
        <div className="text-center">
          <div style={{ fontSize: '16px' }}>🥚</div>
          <div style={{ color: '#5d4037', fontSize: '11px' }}>{eggCount || 0}</div>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
