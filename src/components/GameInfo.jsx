const GameInfo = ({ feedCount }) => (
  <>
    {/* 안내 UI */}
    <div className="mt-4 bg-amber-100 p-3 rounded-lg text-center">
      <p className="text-amber-700">
        👆 <span className="font-bold">필드를 클릭</span>해서 사료를 놓아주세요!
      </p>
      <p className="text-xs text-amber-600 mt-1">
        닭이 배고프면 사료를 찾아 먹어요
      </p>
    </div>
    
    {/* 사료 개수 표시 */}
    <div className="mt-2 flex justify-center gap-4 text-sm text-amber-700">
      <span>🌾 사료: {feedCount}개</span>
    </div>
  </>
);

export default GameInfo;

