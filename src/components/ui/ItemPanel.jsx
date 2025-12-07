import { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { GAME_CONFIG, FARM_GRADE } from '../../constants/gameConfig';
import { CoopPreview } from '../buildings/Coop';
import { FlowerPreview } from '../items/Flower';
import { FlowerBushPreview } from '../items/FlowerBush';
import { PondPreview } from '../buildings/Pond';
import { WindmillPreview } from '../buildings/Windmill';
import { StrawSpaceshipPreview } from '../buildings/StrawSpaceship';
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
  spaceshipCount = 0,
  farmGrade,
  inventory = {},
}) => {
  const isGoldenFarm = farmGrade?.level === FARM_GRADE.GOLDEN_FARM.level;
  const [hoveredItem, setHoveredItem] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState(null);
  const buttonRefs = useRef({});
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

  // 우주선 재료 체크
  const requiredItems = GAME_CONFIG.SPACESHIP?.REQUIRED_ITEMS || {};
  const hasAllMaterials = Object.entries(requiredItems).every(
    ([item, count]) => (inventory[item] || 0) >= count
  );
  const canBuildSpaceship = coins >= (GAME_CONFIG.SPACESHIP?.COST || 500) && hasAllMaterials && isGoldenFarm;

  const renderItem = (item, isGoldenItem = false) => {
    const canAfford = coins >= item.cost;
    const isLocked = isGoldenItem && !isGoldenFarm;
    const isSelected = selectedItem === item.id;
    const isDisabled = !canAfford || isLocked;
    
    const handleMouseEnter = (e) => {
      setHoveredItem(item.id);
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltipPosition({
        left: rect.right + 8,
        top: rect.top,
      });
    };
    
    const handleMouseLeave = () => {
      setHoveredItem(null);
      setTooltipPosition(null);
    };
    
    return (
      <div
        key={item.id}
        ref={el => buttonRefs.current[item.id] = el}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative w-full"
      >
        <button
          onClick={() => !isDisabled && onSelectItem(isSelected ? null : item.id)}
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
      </div>
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
      
      {/* 우주선 특별 섹션 */}
      <div 
        className="flex items-center gap-1" 
        style={{ margin: '2px 0' }}
      >
        <div style={{ borderTop: '2px dashed #7c3aed', flex: 1 }} />
        <span style={{ fontSize: '8px', color: '#7c3aed' }}>🚀</span>
        <div style={{ borderTop: '2px dashed #7c3aed', flex: 1 }} />
      </div>
      
      {/* 우주선 */}
      <div
        ref={el => buttonRefs.current['spaceship'] = el}
        onMouseEnter={(e) => {
          setHoveredItem('spaceship');
          const rect = e.currentTarget.getBoundingClientRect();
          setTooltipPosition({
            left: rect.right + 8,
            top: rect.top,
          });
        }}
        onMouseLeave={() => {
          setHoveredItem(null);
          setTooltipPosition(null);
        }}
        className="relative w-full"
      >
        <button
          onClick={() => canBuildSpaceship && onSelectItem(selectedItem === 'spaceship' ? null : 'spaceship')}
          className="flex flex-col items-center p-2 rounded transition-all w-full relative"
          style={{
            backgroundColor: selectedItem === 'spaceship' ? '#ddd6fe' : '#ede9fe',
            border: selectedItem === 'spaceship' ? '3px solid #7c3aed' : '2px solid #a78bfa',
            opacity: canBuildSpaceship ? 1 : 0.5,
            cursor: canBuildSpaceship ? 'pointer' : 'not-allowed',
          }}
        >
        
        {!isGoldenFarm && (
          <div className="absolute -top-1 -right-1 text-xs">🔒</div>
        )}
        {isGoldenFarm && !hasAllMaterials && (
          <div className="absolute -top-1 -right-1 text-xs">🔧</div>
        )}
        {canBuildSpaceship && (
          <div className="absolute -top-1 -right-1 text-xs animate-pulse">✨</div>
        )}
        <div className="mb-1"><StrawSpaceshipPreview size={28} /></div>
        <div style={{ fontSize: '9px', color: '#5b21b6', fontWeight: 'bold' }}>
          우주선
        </div>
        <div className="flex items-center gap-0.5 mt-1" style={{ fontSize: '8px', color: '#7c3aed' }}>
          <Coin size={10} />
          <span>{GAME_CONFIG.SPACESHIP?.COST || 500}</span>
        </div>
        {/* 필요 재료 표시 */}
        <div style={{ fontSize: '7px', color: '#6b7280', marginTop: '2px' }}>
          <span style={{ color: (inventory.metal_scrap || 0) >= 3 ? '#22c55e' : '#ef4444' }}>⚙️{inventory.metal_scrap || 0}/3</span>
          {' '}
          <span style={{ color: (inventory.blueprint || 0) >= 1 ? '#22c55e' : '#ef4444' }}>📜{inventory.blueprint || 0}/1</span>
          {' '}
          <span style={{ color: (inventory.fuel_cell || 0) >= 1 ? '#22c55e' : '#ef4444' }}>🔋{inventory.fuel_cell || 0}/1</span>
        </div>
      </button>
      </div>
      
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
        {spaceshipCount > 0 && <div style={{ color: '#7c3aed' }}>🚀 {spaceshipCount}개</div>}
      </div>
      
      {/* Portal 툴팁들 */}
      {hoveredItem === 'windmill' && tooltipPosition && ReactDOM.createPortal(
        <div 
          style={{ 
            position: 'fixed',
            left: `${tooltipPosition.left}px`,
            top: `${tooltipPosition.top}px`,
            backgroundColor: '#0f172a',
            border: '3px solid #eab308',
            borderRadius: '8px',
            padding: '8px 12px',
            color: '#ffffff',
            whiteSpace: 'nowrap',
            zIndex: 999999,
            pointerEvents: 'none',
            fontSize: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.8)',
            minWidth: '160px',
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#fde047', fontSize: '11px' }}>
            🌀 풍차 건설 조건
          </div>
          <div style={{ marginBottom: '3px' }}>💰 코인: <span style={{ color: '#ffd700', fontWeight: 'bold' }}>{GAME_CONFIG.WINDMILL.COST}</span></div>
          <div style={{ fontSize: '9px', color: '#fde047', marginTop: '4px', borderTop: '2px solid #475569', paddingTop: '4px' }}>
            ✨ 황금 닭 농장 필요<br/>
            (닭 10마리 이상)
          </div>
        </div>,
        document.body
      )}
      
      {hoveredItem === 'spaceship' && tooltipPosition && ReactDOM.createPortal(
        <div 
          style={{ 
            position: 'fixed',
            left: `${tooltipPosition.left}px`,
            top: `${tooltipPosition.top}px`,
            backgroundColor: '#0f172a',
            border: '3px solid #7c3aed',
            borderRadius: '8px',
            padding: '8px 12px',
            color: '#ffffff',
            whiteSpace: 'nowrap',
            zIndex: 999999,
            pointerEvents: 'none',
            fontSize: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.8)',
            minWidth: '180px',
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#c4b5fd', fontSize: '11px' }}>
            🚀 우주선 건설 조건
          </div>
          <div style={{ marginBottom: '3px' }}>💰 코인: <span style={{ color: '#ffd700', fontWeight: 'bold' }}>{GAME_CONFIG.SPACESHIP.COST}</span></div>
          <div style={{ fontSize: '9px', color: '#a5b4fc', marginTop: '4px', borderTop: '2px solid #475569', paddingTop: '4px' }}>
            필수 재료:
          </div>
          <div style={{ fontSize: '9px', paddingLeft: '8px' }}>
            <div style={{ color: (inventory.metal_scrap || 0) >= 3 ? '#86efac' : '#fca5a5', fontWeight: 'bold' }}>
              🔩 금속 조각 × {GAME_CONFIG.SPACESHIP.REQUIRED_ITEMS.metal_scrap} 
              <span style={{ color: '#cbd5e1' }}> ({inventory.metal_scrap || 0})</span>
            </div>
            <div style={{ color: (inventory.blueprint || 0) >= 1 ? '#86efac' : '#fca5a5', fontWeight: 'bold' }}>
              📜 설계도 × {GAME_CONFIG.SPACESHIP.REQUIRED_ITEMS.blueprint}
              <span style={{ color: '#cbd5e1' }}> ({inventory.blueprint || 0})</span>
            </div>
            <div style={{ color: (inventory.fuel_cell || 0) >= 1 ? '#86efac' : '#fca5a5', fontWeight: 'bold' }}>
              ⚡ 연료 전지 × {GAME_CONFIG.SPACESHIP.REQUIRED_ITEMS.fuel_cell}
              <span style={{ color: '#cbd5e1' }}> ({inventory.fuel_cell || 0})</span>
            </div>
          </div>
          <div style={{ fontSize: '9px', color: isGoldenFarm ? '#86efac' : '#fca5a5', marginTop: '4px', fontWeight: 'bold' }}>
            {isGoldenFarm ? '✓' : '✗'} 황금 닭 농장 (10마리 이상)
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ItemPanel;

