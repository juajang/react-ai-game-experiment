import WorldMap from './WorldMap';
import CharacterDetail from './CharacterDetail';

const AdventurePanel = ({ 
  selectedChicken,
  chickens = [],
  onNameChange,
  coins = 0,
  playerPosition = { x: 15, y: 12 },
  onTileClick,
}) => {
  return (
    <div className="flex flex-col gap-2 w-64">
      {/* 상단: 월드맵 */}
      <WorldMap 
        playerPosition={playerPosition}
        chickens={chickens}
        onTileClick={onTileClick}
      />
      
      {/* 하단: 캐릭터 상세 */}
      <CharacterDetail 
        selectedChicken={selectedChicken}
        onNameChange={onNameChange}
        coins={coins}
      />
    </div>
  );
};

export default AdventurePanel;

