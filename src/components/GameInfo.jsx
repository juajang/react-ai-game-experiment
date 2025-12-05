const GameInfo = ({ feedCount }) => (
  <>
    {/* 안내 UI */}
    <div 
      className="mt-4 p-4 rounded-lg text-center"
      style={{
        backgroundColor: '#f5e6c8',
        border: '4px solid #8b7355',
        boxShadow: '4px 4px 0px #5d4037',
      }}
    >
      <p 
        className="mb-2"
        style={{ 
          color: '#5d4037',
          fontFamily: 'monospace',
        }}
      >
        👆 <span className="font-bold">필드를 클릭</span>해서 벼를 놓아주세요!
      </p>
      <p 
        className="text-xs"
        style={{ color: '#8b7355' }}
      >
        닭이 배고프면 벼를 찾아 먹어요
      </p>
    </div>
    
    {/* 사료 개수 표시 */}
    <div 
      className="mt-3 flex justify-center gap-4 py-2 px-4 rounded"
      style={{
        backgroundColor: '#e8d5b7',
        border: '3px solid #8b7355',
      }}
    >
      <span 
        style={{ 
          color: '#5d4037',
          fontFamily: 'monospace',
          fontSize: '14px',
        }}
      >
        🌾 벼: <strong>{feedCount}</strong>개
      </span>
    </div>
  </>
);

export default GameInfo;
