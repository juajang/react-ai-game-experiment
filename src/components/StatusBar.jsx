import { STATE_TEXT } from '../constants/gameConfig';
import { getHungerColor } from '../utils/gameUtils';

const StatusBar = ({ hunger, state }) => {
  const stateText = STATE_TEXT[state] || STATE_TEXT.default;
  const hungerColor = getHungerColor(hunger);

  return (
    <div className="bg-amber-100 p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-amber-800">🐔 닭의 상태</span>
        <span className="text-sm bg-amber-200 px-2 py-1 rounded">{stateText}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-amber-700">포만감:</span>
        <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${hungerColor}`}
            style={{ width: `${hunger}%` }}
          />
        </div>
        <span className="text-sm font-bold text-amber-800">{Math.round(hunger)}%</span>
      </div>
    </div>
  );
};

export default StatusBar;

