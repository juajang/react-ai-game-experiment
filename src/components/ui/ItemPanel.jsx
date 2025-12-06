import { GAME_CONFIG, FARM_GRADE } from '../../constants/gameConfig';
import { CoopPreview } from '../buildings/Coop';
import { FlowerPreview } from '../items/Flower';
import { FlowerBushPreview } from '../items/FlowerBush';
import { PondPreview } from '../buildings/Pond';
import { WindmillPreview } from '../buildings/Windmill';
import Coin from './Coin';

// 사료 미리보기
const FeedPreview = ({ size = 28 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 16 20" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* 줄기 */}
    <rect x="7" y="10" width="2" height="8" fill="#7CB342"/>
    
    {/* 벼 이삭 */}
    <rect x="4" y="4" width="2" height="3" fill="#FFD54F"/>
    <rect x="7" y="2" width="2" height="4" fill="#FFD54F"/>
    <rect x="10" y="4" width="2" height="3" fill="#FFD54F"/>
  </svg>
);

const ItemPanel = ({ 
  selectedItem, 
  onSelectItem, 
  coins, 
  coopCount,
  pondCount,
  flowerCount,
  flowerBushCount,
  windmillCount,
  farmGrade,
}) => {
  const isGoldenFarm = farmGrade?.level === FARM_GRADE.GOLDEN_FARM.level;
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

  // 황금 농장 전용 아이템
  const goldenItems = [
    {
      id: 'flowerBush',
      name: '꽃덤불',
      icon: <FlowerBushPreview size={28} />,
      cost: GAME_CONFIG.FLOWER_BUSH.COST,
      goldenOnly: true,
    },
    {
      id: 'windmill',
      name: '풍차',
      icon: <WindmillPreview size={28} />,
      cost: GAME_CONFIG.WINDMILL.COST,
      goldenOnly: true,
    },
  ];

  const renderItem = (item, isGoldenItem = false) => {
    const canAfford = coins >= item.cost;
    const isLocked = isGoldenItem && !isGoldenFarm;
    const isSelected = selectedItem === item.id;
    const isDisabled = !canAfford || isLocked;
    
    return (
      <button
        key={item.id}
        onClick={() => !isDisabled && onSelectItem(isSelected ? null : item.id)}
        disabled={isDisabled}
        className="flex flex-col items-center p-2 rounded transition-all w-full relative"
        style={{
          backgroundColor: isSelected ? '#fef3c7' : isGoldenItem ? '#fef08a' : '#e8d5b7',
          border: isSelected ? '3px solid #f59e0b' : isGoldenItem ? '2px solid #eab308' : '2px solid #8b7355',
          opacity: isDisabled ? 0.5 : 1,
          cursor: isDisabled ? 'not-allowed' : 'pointer',
        }}
      >
        {isLocked && (
          <div 
            className="absolute -top-1 -right-1 text-xs"
            title="황금 닭 농장에서만 사용 가능"
          >
            🔒
          </div>
        )}
        {isGoldenItem && !isLocked && (
          <div 
            className="absolute -top-1 -right-1 text-xs"
            title="황금 닭 농장 전용"
          >
            ✨
          </div>
        )}
        <div className="mb-1">{item.icon}</div>
        <div style={{ fontSize: '9px', color: isGoldenItem ? '#854d0e' : '#5d4037', fontWeight: 'bold' }}>
          {item.name}
        </div>
        <div className="flex items-center gap-0.5 mt-1" style={{ fontSize: '8px', color: isGoldenItem ? '#a16207' : '#8b7355' }}>
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
      {consumables.map(item => renderItem(item))}
      
      {/* 구분선 */}
      <div style={{ borderTop: '2px dashed #8b7355', margin: '2px 0' }} />
      
      {/* 장식 */}
      {decorations.map(item => renderItem(item))}
      
      {/* 구분선 */}
      <div style={{ borderTop: '2px dashed #8b7355', margin: '2px 0' }} />
      
      {/* 건물 */}
      {buildings.map(item => renderItem(item))}
      
      {/* 황금 농장 전용 구분선 */}
      <div 
        className="flex items-center gap-1" 
        style={{ margin: '2px 0' }}
      >
        <div style={{ borderTop: '2px dashed #eab308', flex: 1 }} />
        <span style={{ fontSize: '8px', color: '#eab308' }}>✨</span>
        <div style={{ borderTop: '2px dashed #eab308', flex: 1 }} />
      </div>
      
      {/* 황금 농장 전용 아이템 */}
      {goldenItems.map(item => renderItem(item, true))}
      
      {/* 보유 개수 */}
      <div 
        className="mt-1 pt-1 text-center"
        style={{ 
          borderTop: '2px dashed #8b7355',
          fontSize: '9px',
          color: '#8b7355',
        }}
      >
        <div>🌸 {(flowerCount || 0) + (flowerBushCount || 0)}개</div>
        <div>💧 {pondCount || 0}개</div>
        <div>🏠 {coopCount}개</div>
        {windmillCount > 0 && <div>🌀 {windmillCount}개</div>}
      </div>
    </div>
  );
};

export default ItemPanel;

