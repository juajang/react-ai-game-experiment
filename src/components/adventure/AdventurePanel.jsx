import { useState, useCallback } from 'react';
import WorldMap, { TILE_TYPES } from './WorldMap';
import ExplorationControl from './ExplorationControl';

const AdventurePanel = ({ 
  chickens = [],
  playerPosition = { x: 15, y: 12 },
  onPlayerMove,
  onTileClick,
  exploredTiles,
  onExplore,
  water = 30,
  rice = 10,
  onConsumeWater,
  onConsumeRice,
  investigatedTiles = new Set(),
  onInvestigate,
  inventory = {},
  onAddItem,
  selectedTool,
  onSelectTool,
}) => {
  const [mapData, setMapData] = useState(null);
  const [explorationLog, setExplorationLog] = useState([]);
  
  // 맵 데이터 수신
  const handleMapData = useCallback((data) => {
    setMapData(data);
  }, []);
  
  // 탐험 로그 추가
  const handleAddLog = useCallback((log) => {
    setExplorationLog(prev => [...prev, log]);
  }, []);
  
  // 통과 가능 여부 체크 함수
  const canPass = useCallback((x, y) => {
    if (!mapData) return { canPass: false, reason: '맵 로딩 중...' };
    
    const { baseMap, pois, mapWidth, mapHeight } = mapData;
    
    // 맵 범위 체크
    if (x < 0 || x >= mapWidth || y < 0 || y >= mapHeight) {
      return { canPass: false, reason: '맵 밖으로는 이동할 수 없습니다!' };
    }
    
    // 타일 통과 가능 여부 체크
    const tileType = baseMap[y]?.[x];
    const tileInfo = TILE_TYPES[tileType];
    
    if (!tileInfo?.passable) {
      return { canPass: false, reason: `${tileInfo?.name || '그곳'}은(는) 지나갈 수 없습니다!` };
    }
    
    return { canPass: true };
  }, [mapData]);
  
  // 현재 타일 정보
  const getCurrentTileInfo = useCallback(() => {
    if (!mapData) return { tileType: 'GRASS', poi: null };
    
    const { baseMap, pois } = mapData;
    const tileType = baseMap[playerPosition.y]?.[playerPosition.x] || 'GRASS';
    const poi = pois.find(p => p.x === playerPosition.x && p.y === playerPosition.y);
    
    return { tileType, poi };
  }, [mapData, playerPosition]);
  
  const { tileType, poi } = getCurrentTileInfo();

  return (
    <div className="flex flex-col gap-2 w-72 self-stretch">
      {/* 상단: 월드맵 */}
      <WorldMap 
        playerPosition={playerPosition}
        chickens={chickens}
        onTileClick={onTileClick}
        exploredTiles={exploredTiles}
        onExplore={onExplore}
        investigatedTiles={investigatedTiles}
        onMapData={handleMapData}
      />
      
      {/* 하단: 탐험 컨트롤 + 조사 기록 (남은 공간 채움) */}
      <ExplorationControl
        playerPosition={playerPosition}
        onPlayerMove={onPlayerMove}
        water={water}
        rice={rice}
        onConsumeWater={onConsumeWater}
        onConsumeRice={onConsumeRice}
        investigatedTiles={investigatedTiles}
        onInvestigate={onInvestigate}
        explorationLog={explorationLog}
        onAddLog={handleAddLog}
        currentTileType={tileType}
        currentPoi={poi}
        canPass={canPass}
        fillHeight={true}
        inventory={inventory}
        onAddItem={onAddItem}
        selectedTool={selectedTool}
        onSelectTool={onSelectTool}
      />
    </div>
  );
};

export default AdventurePanel;
