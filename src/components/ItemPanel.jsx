import { GAME_CONFIG } from '../constants/gameConfig';
import { CoopPreview } from './Coop';
import { FlowerPreview } from './Flower';
import { PondPreview } from './Pond';
import Coin from './Coin';

// 사료 미리보기
const FeedPreview = ({ size = 32 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 16 16" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="7" y="5" width="2" height="6" fill="#c0a848" />
    <rect x="6" y="6" width="1" height="1" fill="#f5d879" />
    <rect x="9" y="7" width="1" height="1" fill="#f5d879" />
    <rect x="6" y="8" width="1" height="1" fill="#f5d879" />
    <rect x="9" y="9" width="1" height="1" fill="#f5d879" />
    <rect x="7" y="10" width="2" height="1" fill="#f1cf5e" />
  </svg>
);

const ItemPanel = ({ 
  selectedItem, 
  onSelectItem, 
  coins, 
  coopCount,
  pondCount,
  flowerCount,
}) => {
  const consumables = [
    {
      id: 'feed',
      name: '벼',
      icon: <FeedPreview size={28} />,
      cost: GAME_CONFIG.FEED.COST,
    },
  ];

  const decorations = [
    {
      id: 'flower',
      name: '꽃',
      icon: <FlowerPreview size={28} />,
      cost: GAME_CONFIG.FLOWER.COST,
    },
  ];

  const buildings = [
    {
      id: 'pond',
      name: '연못',
      icon: <PondPreview size={28} />,
      cost: GAME_CONFIG.POND.COST,
    },
    {
      id: 'coop',
      name: '닭집',
      icon: <CoopPreview size={28} />,
      cost: GAME_CONFIG.COOP.COST,
    },
  ];

  const renderItem = (item) => {
    const canAfford = coins >= item.cost;
    const isSelected = selectedItem === item.id;
    
    return (
      <button
        key={item.id}
        onClick={() => onSelectItem(isSelected ? null : item.id)}
        disabled={!canAfford}
        className="flex flex-col items-center p-2 rounded transition-all w-full"
        style={{
          backgroundColor: isSelected ? '#fef3c7' : '#e8d5b7',
          border: isSelected ? '3px solid #f59e0b' : '2px solid #8b7355',
          opacity: canAfford ? 1 : 0.5,
          cursor: canAfford ? 'pointer' : 'not-allowed',
        }}
      >
        <div className="mb-1">{item.icon}</div>
        <div style={{ fontSize: '9px', color: '#5d4037', fontWeight: 'bold' }}>
          {item.name}
        </div>
        <div className="flex items-center gap-0.5 mt-1" style={{ fontSize: '8px', color: '#8b7355' }}>
          <Coin size={10} />
          <span>{item.cost}</span>
        </div>
      </button>
    );
  };

  return (
    <div 
      className="w-20 rounded-lg p-2 flex flex-col gap-2"
      style={{
        backgroundColor: '#f5e6c8',
        border: '4px solid #8b7355',
        boxShadow: '4px 4px 0px #5d4037',
      }}
    >
      {/* 타이틀 */}
      <div 
        className="text-center font-bold pb-1"
        style={{ 
          color: '#5d4037', 
          fontSize: '10px',
          borderBottom: '2px dashed #8b7355',
        }}
      >
        🛠️ 아이템
      </div>
      
      {/* 소모품 */}
      {consumables.map(renderItem)}
      
      {/* 구분선 */}
      <div style={{ borderTop: '2px dashed #8b7355', margin: '2px 0' }} />
      
      {/* 장식 */}
      {decorations.map(renderItem)}
      
      {/* 구분선 */}
      <div style={{ borderTop: '2px dashed #8b7355', margin: '2px 0' }} />
      
      {/* 건물 */}
      {buildings.map(renderItem)}
      
      {/* 보유 개수 */}
      <div 
        className="mt-1 pt-1 text-center"
        style={{ 
          borderTop: '2px dashed #8b7355',
          fontSize: '9px',
          color: '#8b7355',
        }}
      >
        <div>🌸 {flowerCount || 0}개</div>
        <div>💧 {pondCount || 0}개</div>
        <div>🏠 {coopCount}개</div>
      </div>
    </div>
  );
};

export default ItemPanel;
