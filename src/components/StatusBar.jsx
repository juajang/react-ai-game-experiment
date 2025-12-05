import { STATE_TEXT } from '../constants/gameConfig';
import { getHungerColor } from '../utils/gameUtils';

const StatusBar = ({ hunger, state }) => {
  const stateText = STATE_TEXT[state] || STATE_TEXT.default;
  
  // 도트 스타일 배고픔 바 색상
  const getPixelHungerColor = () => {
    if (hunger > 70) return '#22c55e';
    if (hunger > 30) return '#eab308';
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
      <div className="flex items-center justify-between mb-3">
        <span 
          className="font-bold"
          style={{ 
            color: '#5d4037',
            fontSize: '14px',
          }}
        >
          🐔 닭의 상태
        </span>
        <span 
          className="px-3 py-1 rounded"
          style={{ 
            backgroundColor: '#e8d5b7',
            border: '2px solid #8b7355',
            color: '#5d4037',
            fontSize: '12px',
          }}
        >
          {stateText}
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        <span 
          style={{ 
            color: '#8b7355',
            fontSize: '12px',
          }}
        >
          포만감:
        </span>
        
        {/* 도트 스타일 프로그레스 바 */}
        <div 
          className="flex-1 h-5 overflow-hidden relative"
          style={{
            backgroundColor: '#3d3d3d',
            border: '3px solid #5d4037',
          }}
        >
          <div 
            className="h-full transition-all duration-300"
            style={{ 
              width: `${hunger}%`,
              backgroundColor: getPixelHungerColor(),
              boxShadow: 'inset 0 -4px 0 rgba(0,0,0,0.3)',
            }}
          />
          
          {/* 픽셀 하이라이트 */}
          <div 
            className="absolute top-0 left-0 right-0 h-1"
            style={{
              backgroundColor: 'rgba(255,255,255,0.3)',
              width: `${hunger}%`,
            }}
          />
        </div>
        
        <span 
          className="font-bold min-w-[50px] text-right"
          style={{ 
            color: '#5d4037',
            fontSize: '12px',
          }}
        >
          {Math.round(hunger)}%
        </span>
      </div>
    </div>
  );
};

export default StatusBar;
