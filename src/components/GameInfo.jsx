const GameInfo = ({ feedCount }) => (
  <>
    {/* 안내 UI */}
    <div 
      className="mt-4 p-4 rounded-lg"
      style={{
        backgroundColor: '#f5e6c8',
        border: '4px solid #8b7355',
        boxShadow: '4px 4px 0px #5d4037',
      }}
    >
      <p 
        className="mb-2 text-center"
        style={{ 
          color: '#5d4037',
          fontSize: '13px',
        }}
      >
        👆 <span className="font-bold">필드를 클릭</span>해서 벼를 놓아주세요!
      </p>
      
      <div 
        className="mt-3 pt-3 text-center"
        style={{ 
          borderTop: '2px dashed #8b7355',
          color: '#8b7355',
          fontSize: '11px',
        }}
      >
        <p>🥚 닭이 행복하면 알을 낳아요</p>
        <p>🐣 알 근처에 닭이 있으면 부화해요</p>
        <p>🐥 병아리는 시간이 지나면 성체가 돼요</p>
      </div>
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
          fontSize: '13px',
        }}
      >
        🌾 벼: <strong>{feedCount}</strong>개
      </span>
    </div>
  </>
);

export default GameInfo;
