import { useState, useMemo, useEffect } from 'react';

// 맵 타일 타입 정의
const TILE_TYPES = {
  WATER: { char: '~', color: '#4fc3f7', bg: '#29b6f6', name: '바다', passable: false },
  GRASS: { char: '.', color: '#66bb6a', bg: '#81c784', name: '초원', passable: true },
  FOREST: { char: 'ᵀ', color: '#2e7d32', bg: '#4caf50', name: '숲', passable: true },
  MOUNTAIN: { char: '^', color: '#78909c', bg: '#90a4ae', name: '산', passable: false },
  VILLAGE: { char: 'V', color: '#ff9800', bg: '#ffb74d', name: '마을', passable: true },
  OUTPOST: { char: 'O', color: '#8d6e63', bg: '#a1887f', name: '전초기지', passable: true },
  FARM: { char: 'F', color: '#ffd54f', bg: '#ffeb3b', name: '농장', passable: true },
  PATH: { char: '·', color: '#bcaaa4', bg: '#d7ccc8', name: '길', passable: true },
  BEACH: { char: ':', color: '#ffe082', bg: '#ffecb3', name: '해변', passable: true },
  PLAYER: { char: '@', color: '#f44336', bg: null },
  CHICKEN: { char: 'c', color: '#fff176', bg: null },
  RESOURCE: { char: '*', color: '#e91e63', bg: null, name: '자원', passable: true },
  UNKNOWN: { char: '?', color: '#3d3d5c', bg: '#2a2a3e' },
};

// 심 모양의 맵 생성
const generateIslandMap = (width, height, seed = 42) => {
  const map = [];
  const centerX = width / 2;
  const centerY = height / 2;
  
  const seededRandom = (x, y) => {
    const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
    return n - Math.floor(n);
  };
  
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      const dx = (x - centerX) / (width / 2.5);
      const dy = (y - centerY) / (height / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const noise = Math.sin(x * 0.3) * 0.1 + Math.cos(y * 0.4) * 0.1;
      const adjustedDist = distance + noise;
      
      let tile;
      const rand = seededRandom(x, y);
      if (adjustedDist > 1.1) {
        tile = 'WATER';
      } else if (adjustedDist > 0.95) {
        tile = 'BEACH';
      } else if (adjustedDist > 0.8) {
        tile = rand > 0.7 ? 'FOREST' : 'GRASS';
      } else if (adjustedDist > 0.5) {
        tile = rand > 0.5 ? 'FOREST' : 'GRASS';
      } else if (adjustedDist > 0.3) {
        tile = rand > 0.8 ? 'MOUNTAIN' : 'GRASS';
      } else {
        tile = 'GRASS';
      }
      
      row.push(tile);
    }
    map.push(row);
  }
  
  return map;
};

// 포인트 오브 인터레스트 생성
const generatePOIs = (map, seed = 42) => {
  const pois = [];
  const height = map.length;
  const width = map[0].length;
  
  const seededRandom = (i) => {
    const n = Math.sin(i * 12.9898 + seed) * 43758.5453;
    return n - Math.floor(n);
  };
  
  pois.push({ x: Math.floor(width / 2), y: Math.floor(height / 2) + 2, type: 'VILLAGE', name: '마을' });
  pois.push({ x: Math.floor(width / 2) - 2, y: Math.floor(height / 2), type: 'FARM', name: '농장' });
  pois.push({ x: Math.floor(width / 3), y: Math.floor(height / 3), type: 'OUTPOST', name: '북서 전초기지' });
  pois.push({ x: Math.floor(width * 2 / 3), y: Math.floor(height / 3), type: 'OUTPOST', name: '북동 전초기지' });
  
  for (let i = 0; i < 5; i++) {
    const x = Math.floor(seededRandom(i * 2) * (width - 10)) + 5;
    const y = Math.floor(seededRandom(i * 2 + 1) * (height - 10)) + 5;
    if (map[y]?.[x] === 'GRASS' || map[y]?.[x] === 'FOREST') {
      pois.push({ x, y, type: 'RESOURCE', name: '자원' });
    }
  }
  
  return pois;
};

// 플레이어 주변 타일을 탐험 상태로 만드는 함수
const getVisibleTiles = (playerX, playerY, radius = 2) => {
  const tiles = new Set();
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance <= radius) {
        tiles.add(`${playerX + dx},${playerY + dy}`);
      }
    }
  }
  return tiles;
};

const WorldMap = ({ 
  playerPosition = { x: 15, y: 12 },
  chickens = [],
  onTileClick,
  exploredTiles,
  onExplore,
  investigatedTiles = new Set(),
  onMapData,
}) => {
  const mapWidth = 35;
  const mapHeight = 25;
  
  const [hoveredTile, setHoveredTile] = useState(null);
  
  // 맵과 POI 생성 (메모이제이션)
  const { baseMap, pois } = useMemo(() => {
    const base = generateIslandMap(mapWidth, mapHeight);
    const points = generatePOIs(base);
    return { baseMap: base, pois: points };
  }, []);
  
  // 맵 데이터를 부모에게 전달
  useEffect(() => {
    if (onMapData) {
      onMapData({ baseMap, pois, mapWidth, mapHeight, TILE_TYPES });
    }
  }, [baseMap, pois, onMapData]);
  
  // 플레이어가 이동할 때마다 주변 탐험
  useEffect(() => {
    if (onExplore) {
      const newVisibleTiles = getVisibleTiles(playerPosition.x, playerPosition.y, 2);
      onExplore(newVisibleTiles);
    }
  }, [playerPosition.x, playerPosition.y, onExplore]);
  
  // 마을까지의 거리 계산
  const village = pois.find(p => p.type === 'VILLAGE');
  const distanceToVillage = village 
    ? Math.abs(playerPosition.x - village.x) + Math.abs(playerPosition.y - village.y)
    : 0;
  
  // 타일이 탐험되었는지 체크
  const isExplored = (x, y) => {
    if (!exploredTiles) return true;
    return exploredTiles.has(`${x},${y}`);
  };
  
  const renderTile = (x, y) => {
    const explored = isExplored(x, y);
    const baseTile = baseMap[y]?.[x] || 'WATER';
    
    if (!explored) {
      return (
        <span
          key={`${x}-${y}`}
          style={{
            color: '#2a2a3e',
            backgroundColor: 'transparent',
            cursor: 'default',
          }}
        >
          ░
        </span>
      );
    }
    
    const poi = pois.find(p => p.x === x && p.y === y);
    const isPlayer = playerPosition.x === x && playerPosition.y === y;
    const chicken = chickens.find(c => 
      Math.floor(c.mapX || 0) === x && Math.floor(c.mapY || 0) === y
    );
    
    // 조사 완료 여부
    const isInvestigated = investigatedTiles.has(`${x},${y}`);
    
    let displayTile = TILE_TYPES[baseTile];
    let char = displayTile.char;
    let color = displayTile.color;
    
    if (poi) {
      const poiTile = TILE_TYPES[poi.type];
      char = poiTile.char;
      color = poiTile.color;
    }
    
    if (chicken) {
      char = 'c';
      color = '#fff176';
    }
    
    if (isPlayer) {
      char = '@';
      color = '#f44336';
    }
    
    const isHovered = hoveredTile?.x === x && hoveredTile?.y === y;
    
    return (
      <span
        key={`${x}-${y}`}
        style={{
          color: color,
          backgroundColor: isHovered ? 'rgba(255,255,255,0.3)' : 'transparent',
          cursor: 'pointer',
          fontWeight: isPlayer || poi ? 'bold' : 'normal',
          opacity: isInvestigated ? 1 : 0.7,
        }}
        onMouseEnter={() => setHoveredTile({ x, y, poi, baseTile, isInvestigated })}
        onMouseLeave={() => setHoveredTile(null)}
        onClick={() => onTileClick?.({ x, y, poi, baseTile })}
        title={poi?.name || TILE_TYPES[baseTile]?.name || baseTile}
      >
        {char}
      </span>
    );
  };

  const currentTile = baseMap[playerPosition.y]?.[playerPosition.x] || 'UNKNOWN';
  const currentPoi = pois.find(p => p.x === playerPosition.x && p.y === playerPosition.y);

  return (
    <div 
      className="rounded-lg overflow-hidden"
      style={{
        backgroundColor: '#1a1a2e',
        border: '3px solid #5d4037',
        fontFamily: 'monospace',
      }}
    >
      {/* 헤더 */}
      <div 
        className="px-2 py-1 flex justify-between items-center"
        style={{ 
          backgroundColor: '#2d2d44',
          borderBottom: '2px solid #5d4037',
          fontSize: '10px',
          color: '#e0e0e0',
        }}
      >
        <span>🗺️ 월드맵</span>
        <span style={{ color: '#90a4ae' }}>마을까지: {distanceToVillage}칸</span>
      </div>
      
      {/* 맵 */}
      <div 
        className="p-1 overflow-auto"
        style={{ 
          fontSize: '8px',
          lineHeight: '9px',
          letterSpacing: '0.5px',
          maxHeight: '160px',
        }}
      >
        {baseMap.map((row, y) => (
          <div key={y} style={{ whiteSpace: 'nowrap' }}>
            {row.map((_, x) => renderTile(x, y))}
          </div>
        ))}
      </div>
      
      {/* 현재 위치 / 호버 정보 */}
      <div 
        className="px-2 py-1"
        style={{ 
          backgroundColor: '#2d2d44',
          borderTop: '2px solid #5d4037',
          fontSize: '9px',
          color: '#e0e0e0',
        }}
      >
        {hoveredTile ? (
          <>
            <span style={{ color: '#90a4ae' }}>🔍 </span>
            [{hoveredTile.x}, {hoveredTile.y}] {hoveredTile.poi?.name || TILE_TYPES[hoveredTile.baseTile]?.name || hoveredTile.baseTile}
            {hoveredTile.isInvestigated && <span style={{ color: '#4caf50' }}> ✓</span>}
          </>
        ) : (
          <>
            <span style={{ color: '#f44336' }}>📍 </span>
            [{playerPosition.x}, {playerPosition.y}] {currentPoi?.name || TILE_TYPES[currentTile]?.name || currentTile}
          </>
        )}
      </div>
    </div>
  );
};

// 타일 타입 정보 export
export { TILE_TYPES };
export default WorldMap;
