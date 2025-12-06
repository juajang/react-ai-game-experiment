import WorldMap from './WorldMap';

const AdventurePanel = ({ 
  chickens = [],
  playerPosition = { x: 15, y: 12 },
  onTileClick,
  exploredTiles,
  onExplore,
}) => {
  return (
    <div className="flex flex-col gap-2 w-64">
      {/* 월드맵 */}
      <WorldMap 
        playerPosition={playerPosition}
        chickens={chickens}
        onTileClick={onTileClick}
        exploredTiles={exploredTiles}
        onExplore={onExplore}
      />
    </div>
  );
};

export default AdventurePanel;

