import { useState, useMemo, useEffect, useRef, useCallback, memo } from 'react';

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
  // 새로운 타일 타입들
  HOUSE: { char: '⌂', color: '#9e9e9e', bg: '#757575', name: '버려진 민가', passable: true },
  LAUNCH_SITE: { char: '▲', color: '#7e57c2', bg: '#9575cd', name: '발사장', passable: true },
  TOWER: { char: '┃', color: '#42a5f5', bg: '#64b5f6', name: '통신탑', passable: true },
  FACTORY: { char: '⚙', color: '#ff7043', bg: '#ff8a65', name: '폐공장', passable: true },
  ABANDONED_LAB: { char: '⚗', color: '#26c6da', bg: '#4dd0e1', name: '버려진 과학기지', passable: true },
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

// 두 점 사이에 직선 경로를 생성 (산/물 위에도 길 생성, 단 해당 타일은 통과 불가로 유지)
const createStraightPath = (map, x1, y1, x2, y2) => {
  let x = x1;
  let y = y1;
  
  while (x !== x2 || y !== y2) {
    // 현재 타일이 초원, 숲, 해변이면 길로 변경
    const tile = map[y]?.[x];
    if (tile === 'GRASS' || tile === 'FOREST' || tile === 'BEACH') {
      map[y][x] = 'PATH';
    }
    
    // 수평 이동 우선, 그 다음 수직 이동
    if (x !== x2) {
      x += x < x2 ? 1 : -1;
    } else if (y !== y2) {
      y += y < y2 ? 1 : -1;
    }
  }
};

// POI 주변에 접근로 생성 (4방향)
const createAccessPaths = (map, poi, length = 5) => {
  const { x, y } = poi;
  const height = map.length;
  const width = map[0].length;
  
  // 4방향으로 접근로 생성
  const directions = [
    { dx: 0, dy: -1, name: '북' },  // 북
    { dx: 0, dy: 1, name: '남' },   // 남
    { dx: -1, dy: 0, name: '서' },  // 서
    { dx: 1, dy: 0, name: '동' },   // 동
  ];
  
  directions.forEach(({ dx, dy }) => {
    for (let i = 1; i <= length; i++) {
      const nx = x + dx * i;
      const ny = y + dy * i;
      
      if (nx < 0 || nx >= width || ny < 0 || ny >= height) break;
      
      const tile = map[ny]?.[nx];
      // 산이나 물을 만나면 해당 방향 접근로 중단
      if (tile === 'MOUNTAIN' || tile === 'WATER') break;
      
      if (tile === 'GRASS' || tile === 'FOREST' || tile === 'BEACH') {
        map[ny][nx] = 'PATH';
      }
    }
  });
};

// POI들을 연결하는 메인 도로 생성
const connectPOIsWithPaths = (map, pois) => {
  const height = map.length;
  const width = map[0].length;
  const centerX = Math.floor(width / 2);
  const centerY = Math.floor(height / 2);
  
  // 마을(중심)을 찾음
  const village = pois.find(p => p.type === 'VILLAGE') || { x: centerX, y: centerY };
  
  // 동서남북 메인 도로 생성 (마을에서 맵 가장자리까지)
  // 북쪽 도로
  for (let y = village.y; y >= 3; y--) {
    if (map[y]?.[village.x] && map[y][village.x] !== 'WATER' && map[y][village.x] !== 'MOUNTAIN') {
      map[y][village.x] = 'PATH';
    }
  }
  // 남쪽 도로
  for (let y = village.y; y < height - 3; y++) {
    if (map[y]?.[village.x] && map[y][village.x] !== 'WATER' && map[y][village.x] !== 'MOUNTAIN') {
      map[y][village.x] = 'PATH';
    }
  }
  // 서쪽 도로
  for (let x = village.x; x >= 3; x--) {
    if (map[village.y]?.[x] && map[village.y][x] !== 'WATER' && map[village.y][x] !== 'MOUNTAIN') {
      map[village.y][x] = 'PATH';
    }
  }
  // 동쪽 도로
  for (let x = village.x; x < width - 3; x++) {
    if (map[village.y]?.[x] && map[village.y][x] !== 'WATER' && map[village.y][x] !== 'MOUNTAIN') {
      map[village.y][x] = 'PATH';
    }
  }
  
  // 각 POI에 4방향 접근로 생성
  pois.forEach(poi => {
    createAccessPaths(map, poi, 6);
  });
  
  // POI들을 직선으로 연결 (산/물은 건너뛰지 않음)
  pois.forEach(poi => {
    if (poi.type !== 'VILLAGE') {
      createStraightPath(map, village.x, village.y, poi.x, poi.y);
    }
  });
  
  // 가로 보조 도로 (상단, 하단)
  const upperY = Math.floor(height / 3);
  const lowerY = Math.floor(height * 2 / 3);
  
  for (let x = 5; x < width - 5; x++) {
    if (map[upperY]?.[x] && map[upperY][x] !== 'WATER' && map[upperY][x] !== 'MOUNTAIN') {
      map[upperY][x] = 'PATH';
    }
    if (map[lowerY]?.[x] && map[lowerY][x] !== 'WATER' && map[lowerY][x] !== 'MOUNTAIN') {
      map[lowerY][x] = 'PATH';
    }
  }
};

// 타일이 통과 가능한지 체크
const isPassableTile = (map, x, y) => {
  const tile = map[y]?.[x];
  return tile && tile !== 'WATER' && tile !== 'MOUNTAIN';
};

// 포인트 오브 인터레스트 생성 (자동 점프 없음 - 통과 가능한 곳에만 배치)
const generatePOIs = (map, seed = 42) => {
  const pois = [];
  const height = map.length;
  const width = map[0].length;
  
  const seededRandom = (i) => {
    const n = Math.sin(i * 12.9898 + seed) * 43758.5453;
    return n - Math.floor(n);
  };
  
  // 중심 좌표
  const centerX = Math.floor(width / 2);
  const centerY = Math.floor(height / 2);
  
  // POI를 추가 (통과 가능한 곳에만)
  const addPOI = (x, y, type, name) => {
    if (isPassableTile(map, x, y)) {
      pois.push({ x, y, type, name });
    }
  };
  
  // 기본 POI (마을 제거)
  addPOI(centerX - 3, centerY, 'FARM', '농장');
  addPOI(Math.floor(width / 4), Math.floor(height / 3), 'OUTPOST', '북서 전초기지');
  addPOI(Math.floor(width * 3 / 4), Math.floor(height / 3), 'OUTPOST', '북동 전초기지');
  
  // 🚀 발사장 - 동쪽 가장자리 근처
  addPOI(Math.floor(width * 4 / 5), centerY, 'LAUNCH_SITE', '발사장');
  
  // 📡 통신탑 - 발사장과 마을 사이
  addPOI(Math.floor(width * 3 / 5), centerY - 3, 'TOWER', '벼락 맞은 통신탑');
  
  // 🏭 폐공장 - 마을 서쪽에 배치 (금속 조각 100% 획득)
  addPOI(Math.floor(width / 4), centerY + 2, 'FACTORY', '버려진 폐공장');
  
  // 🔬 버려진 과학기지 - 발사장 근처 (연료전지 100% 획득)
  addPOI(Math.floor(width * 3 / 4), centerY + 4, 'ABANDONED_LAB', '버려진 과학기지');
  
  // 🏚️ 버려진 민가들 - 숲속에 드문드문 배치 (첫 번째는 시작점 근처)
  const housePositions = [
    { x: centerX - 3, y: centerY - 2 },  // 시작점 근처 (삽 획득용)
    { x: Math.floor(width / 5), y: centerY },
    { x: Math.floor(width / 3), y: Math.floor(height * 2 / 3) },
    { x: Math.floor(width * 2 / 3), y: Math.floor(height * 2 / 3) },
    { x: Math.floor(width / 4), y: Math.floor(height / 3) + 3 },
  ];
  
  const houseNames = ['낡은 오두막', '버려진 민가', '폐허가 된 집', '잊혀진 주거지', '무너진 헛간'];
  housePositions.forEach((pos, i) => {
    if (isPassableTile(map, pos.x, pos.y)) {
      pois.push({ x: pos.x, y: pos.y, type: 'HOUSE', name: houseNames[i % houseNames.length] });
    }
  });
  
  // 자원 포인트 - 맵 곳곳에 배치
  for (let i = 0; i < 6; i++) {
    const x = Math.floor(seededRandom(i * 2) * (width - 14)) + 7;
    const y = Math.floor(seededRandom(i * 2 + 1) * (height - 10)) + 5;
    if (isPassableTile(map, x, y)) {
      pois.push({ x, y, type: 'RESOURCE', name: '자원' });
    }
  }
  
  // POI들을 길로 연결
  connectPOIsWithPaths(map, pois);
  
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
  playerPosition = { x: 17, y: 12 },
  chickens = [],
  onTileClick,
  exploredTiles,
  onExplore,
  investigatedTiles = new Set(),
  onMapData,
  adventuringChicken = null,
}) => {
  const mapWidth = 35;
  const mapHeight = 25;
  
  const [hoveredTile, setHoveredTile] = useState(null);
  const mapContainerRef = useRef(null);
  
  // 맵과 POI 생성 (메모이제이션)
  const { baseMap, pois, poiMap } = useMemo(() => {
    const base = generateIslandMap(mapWidth, mapHeight);
    const points = generatePOIs(base);
    // POI를 좌표로 빠르게 찾기 위한 Map 생성
    const poiLookup = new Map();
    points.forEach(p => poiLookup.set(`${p.x},${p.y}`, p));
    return { baseMap: base, pois: points, poiMap: poiLookup };
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
  
  // 플레이어 위치에 따라 자동 스크롤
  useEffect(() => {
    if (mapContainerRef.current) {
      const container = mapContainerRef.current;
      const tileSize = 10; // 타일 크기와 동일
      const containerHeight = container.clientHeight;
      const containerWidth = container.clientWidth;
      const playerY = playerPosition.y * tileSize;
      const playerX = playerPosition.x * tileSize;
      
      // 플레이어가 보이는 영역 중앙에 오도록 스크롤
      const targetScrollY = playerY - containerHeight / 2 + tileSize / 2;
      const targetScrollX = playerX - containerWidth / 2 + tileSize / 2;
      
      container.scrollTo({
        top: Math.max(0, targetScrollY),
        left: Math.max(0, targetScrollX),
        behavior: 'smooth'
      });
    }
  }, [playerPosition.x, playerPosition.y]);
  
  // 마을까지의 거리 계산
  const village = pois.find(p => p.type === 'VILLAGE');
  const distanceToVillage = village 
    ? Math.abs(playerPosition.x - village.x) + Math.abs(playerPosition.y - village.y)
    : 0;
  
  // 닭 위치 맵 (O(1) 탐색용)
  const chickenMap = useMemo(() => {
    const map = new Map();
    chickens.forEach(c => {
      const key = `${Math.floor(c.mapX || 0)},${Math.floor(c.mapY || 0)}`;
      map.set(key, c);
    });
    return map;
  }, [chickens]);
  
  // 타일 렌더링 함수 (useCallback으로 메모이제이션)
  const renderTile = useCallback((x, y) => {
    const posKey = `${x},${y}`;
    const explored = exploredTiles ? exploredTiles.has(posKey) : false;
    const baseTile = baseMap[y]?.[x] || 'WATER';
    
    if (!explored) {
      return (
        <span
          key={posKey}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '10px',
            height: '10px',
            color: '#2a2a3e',
            backgroundColor: 'transparent',
            cursor: 'default',
            fontSize: '8px',
          }}
        >
          ░
        </span>
      );
    }
    
    // O(1) 탐색으로 변경
    const poi = poiMap.get(posKey);
    const isPlayer = playerPosition.x === x && playerPosition.y === y;
    const chicken = chickenMap.get(posKey);
    const isInvestigated = investigatedTiles.has(posKey);
    
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
    
    // 모험 중인 닭 위치 표시
    if (adventuringChicken && isPlayer) {
      char = '🐔';
      color = '#ffd54f';
    }
    
    const isHovered = hoveredTile?.x === x && hoveredTile?.y === y;
    
    return (
      <span
        key={posKey}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '10px',
          height: '10px',
          color: color,
          backgroundColor: isHovered ? 'rgba(255,255,255,0.3)' : 'transparent',
          cursor: 'pointer',
          fontWeight: isPlayer || poi ? 'bold' : 'normal',
          opacity: isInvestigated ? 1 : 0.7,
          fontSize: '8px',
          lineHeight: 1,
          overflow: 'hidden',
        }}
        onMouseEnter={() => setHoveredTile({ x, y, poi, baseTile, isInvestigated })}
        onMouseLeave={() => setHoveredTile(null)}
        onClick={() => onTileClick?.({ x, y, poi, baseTile })}
        title={poi?.name || TILE_TYPES[baseTile]?.name || baseTile}
      >
        {char}
      </span>
    );
  }, [baseMap, poiMap, chickenMap, playerPosition, adventuringChicken, exploredTiles, investigatedTiles, hoveredTile, onTileClick]);

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
        ref={mapContainerRef}
        className="p-1 overflow-auto"
        style={{ 
          maxHeight: '180px',
        }}
      >
        {baseMap.map((row, y) => (
          <div key={y} style={{ display: 'flex', height: '10px' }}>
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
