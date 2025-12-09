import { useState, useEffect, useRef, memo, useCallback } from 'react';
import ReactDOM from 'react-dom';

// 과학기지 - 나무로 만들어진 연구 시설
const ScienceBase = memo(({ x, y, onClick, onMouseDown, inventory = {}, onConsumeItems, onAddItem }) => {
  const [showResearchPanel, setShowResearchPanel] = useState(false);
  const [researchState, setResearchState] = useState('idle'); // idle, researching, complete, done
  const [researchProgress, setResearchProgress] = useState(0);
  const [insertedItems, setInsertedItems] = useState({ metal_scrap: 0, antenna: 0 });
  const [panelPosition, setPanelPosition] = useState({ x: 0, y: 0 });
  const buildingRef = useRef(null);
  
  // 이미 연구 완료했는지 확인
  const isResearchDone = researchState === 'done';
  
  // 연구에 필요한 재료
  const requiredItems = { metal_scrap: 3, antenna: 1 };
  
  // 재료가 충분한지 체크
  const canInsertMetalScrap = (inventory.metal_scrap || 0) > insertedItems.metal_scrap;
  const canInsertAntenna = (inventory.antenna || 0) > insertedItems.antenna;
  
  // 연구 시작 가능 여부
  const canStartResearch = 
    insertedItems.metal_scrap >= requiredItems.metal_scrap && 
    insertedItems.antenna >= requiredItems.antenna &&
    researchState === 'idle';
  
  // 아이템 투입
  const handleInsertItem = (itemType) => {
    if (researchState !== 'idle') return;
    
    if (itemType === 'metal_scrap' && canInsertMetalScrap) {
      setInsertedItems(prev => ({ ...prev, metal_scrap: prev.metal_scrap + 1 }));
    } else if (itemType === 'antenna' && canInsertAntenna) {
      setInsertedItems(prev => ({ ...prev, antenna: prev.antenna + 1 }));
    }
  };
  
  // 아이템 회수
  const handleRemoveItem = (itemType) => {
    if (researchState !== 'idle') return;
    
    if (itemType === 'metal_scrap' && insertedItems.metal_scrap > 0) {
      setInsertedItems(prev => ({ ...prev, metal_scrap: prev.metal_scrap - 1 }));
    } else if (itemType === 'antenna' && insertedItems.antenna > 0) {
      setInsertedItems(prev => ({ ...prev, antenna: prev.antenna - 1 }));
    }
  };
  
  // 연구 시작
  const handleStartResearch = () => {
    if (!canStartResearch) return;
    
    // 인벤토리에서 재료 소모
    onConsumeItems?.({
      metal_scrap: requiredItems.metal_scrap,
      antenna: requiredItems.antenna,
    });
    
    setResearchState('researching');
    setResearchProgress(0);
  };
  
  // 연구 진행 타이머
  useEffect(() => {
    if (researchState !== 'researching') return;
    
    const timer = setInterval(() => {
      setResearchProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setResearchState('complete');
          return 100;
        }
        return prev + (100 / 30); // 30초 = 100% (1초당 약 3.33%)
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [researchState]);
  
  // 연구 완료 - 결과물 수령
  const handleCollectResult = () => {
    if (researchState !== 'complete') return;
    
    // 우주선 플레이트 획득
    onAddItem?.('spaceship_plate', 1);
    
    // 연구 완료 상태로 변경 (1회성)
    setResearchState('done');
    setResearchProgress(0);
    setInsertedItems({ metal_scrap: 0, antenna: 0 });
    
    // 패널 닫기
    setShowResearchPanel(false);
  };
  
  // 패널 위치 업데이트
  const updatePanelPosition = () => {
    if (buildingRef.current) {
      const rect = buildingRef.current.getBoundingClientRect();
      setPanelPosition({
        x: rect.right + 10,
        y: rect.top + rect.height / 2
      });
    }
  };
  
  // 패널 열릴 때 위치 계산
  useEffect(() => {
    if (showResearchPanel) {
      updatePanelPosition();
    }
  }, [showResearchPanel]);
  
  return (
    <div
      ref={buildingRef}
      onMouseDown={onMouseDown}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        cursor: 'grab',
        zIndex: 15,
      }}
    >
      <svg width="80" height="80" viewBox="0 0 48 48">
        {/* 베이스/바닥 */}
        <rect x="8" y="38" width="32" height="4" fill="#5d4037" />
        
        {/* 메인 건물 (나무 판자) */}
        <rect x="10" y="18" width="28" height="20" fill="#8d6e63" />
        <rect x="10" y="18" width="28" height="2" fill="#a1887f" />
        
        {/* 나무 판자 디테일 */}
        <rect x="10" y="22" width="28" height="1" fill="#6d4c41" />
        <rect x="10" y="28" width="28" height="1" fill="#6d4c41" />
        <rect x="10" y="34" width="28" height="1" fill="#6d4c41" />
        
        {/* 지붕 (삼각형) */}
        <polygon points="24,6 6,18 42,18" fill="#6d4c41" />
        <polygon points="24,8 10,18 38,18" fill="#795548" />
        
        {/* 안테나 */}
        <rect x="23" y="2" width="2" height="6" fill="#78909c" />
        <circle cx="24" cy="2" r="2" fill={researchState === 'researching' ? '#4caf50' : '#ef5350'} />
        
        {/* 작은 안테나들 */}
        <rect x="15" y="8" width="1" height="4" fill="#90a4ae" />
        <circle cx="15.5" cy="7" r="1.5" fill="#42a5f5" />
        <rect x="32" y="8" width="1" height="4" fill="#90a4ae" />
        <circle cx="32.5" cy="7" r="1.5" fill="#66bb6a" />
        
        {/* 문 */}
        <rect x="20" y="28" width="8" height="10" fill="#5d4037" />
        <rect x="21" y="29" width="6" height="8" fill="#4e342e" />
        <circle cx="26" cy="33" r="1" fill="#ffd54f" />
        
        {/* 창문 */}
        <rect x="12" y="22" width="6" height="5" fill="#4fc3f7" />
        <rect x="14" y="22" width="2" height="5" fill="#29b6f6" />
        <rect x="30" y="22" width="6" height="5" fill="#4fc3f7" />
        <rect x="32" y="22" width="2" height="5" fill="#29b6f6" />
        
        {/* 창문 프레임 */}
        <rect x="12" y="24" width="6" height="1" fill="#5d4037" />
        <rect x="30" y="24" width="6" height="1" fill="#5d4037" />
        
        {/* 과학 기호 (원자 모양) */}
        <circle cx="24" cy="14" r="2" fill="#fff176" />
        <ellipse cx="24" cy="14" rx="4" ry="1.5" fill="none" stroke="#fff176" strokeWidth="0.5" />
        <ellipse cx="24" cy="14" rx="1.5" ry="4" fill="none" stroke="#fff176" strokeWidth="0.5" />
      </svg>
      
      {/* 연구 버튼 (연구중일 때는 표시하지 않음) */}
      {researchState !== 'researching' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowResearchPanel(!showResearchPanel);
          }}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            bottom: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: researchState === 'done' ? '#6b7280' : researchState === 'complete' ? '#ffd54f' : '#3b82f6',
            color: 'white',
            border: '1px solid #1e3a5f',
            borderRadius: '3px',
            padding: '1px 4px',
            fontSize: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            zIndex: 20,
          }}
        >
          {researchState === 'done' ? '완료됨' : researchState === 'complete' ? '수령!' : '연구'}
        </button>
      )}
      
      {/* 연구 패널 - Portal로 렌더링 (툴팁 스타일) */}
      {showResearchPanel && ReactDOM.createPortal(
        <div
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            top: panelPosition.y,
            left: panelPosition.x,
            transform: 'translateY(-50%)',
            backgroundColor: '#1a1a2e',
            border: '2px solid #3b82f6',
            borderRadius: '8px',
            padding: '10px',
            minWidth: '180px',
            zIndex: 9999,
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}
        >
          {/* 툴팁 화살표 */}
          <div style={{
            position: 'absolute',
            left: '-8px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 0,
            height: 0,
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            borderRight: '8px solid #3b82f6',
          }} />
          <div style={{ color: '#93c5fd', fontSize: '10px', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center' }}>
            🔬 과학기지
          </div>
          
          {researchState === 'done' ? (
            // 연구 완료됨 (1회성 완료)
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#6b7280', fontSize: '12px', marginBottom: '8px' }}>
                ✅ 연구 완료됨
              </div>
              <div style={{ color: '#9ca3af', fontSize: '10px' }}>
                이 과학기지에서의 연구는<br/>이미 완료되었습니다.
              </div>
            </div>
          ) : researchState === 'complete' ? (
            // 연구 완료 - 수령 대기 상태
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#ffd54f', fontSize: '12px', marginBottom: '8px' }}>
                ✨ 연구 완료! ✨
              </div>
              <div style={{ color: '#a5d6a7', fontSize: '10px', marginBottom: '8px' }}>
                🛸 우주선 플레이트 획득!
              </div>
              <button
                onClick={handleCollectResult}
                style={{
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '6px 12px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                수령하기
              </button>
            </div>
          ) : researchState === 'researching' ? (
            // 연구 진행 중
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#4fc3f7', fontSize: '10px', marginBottom: '8px' }}>
                연구 진행 중...
              </div>
              <div style={{
                width: '100%',
                height: '12px',
                backgroundColor: '#2d2d44',
                borderRadius: '6px',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${researchProgress}%`,
                  height: '100%',
                  backgroundColor: '#4caf50',
                  transition: 'width 0.5s',
                }} />
              </div>
              <div style={{ color: '#90a4ae', fontSize: '9px', marginTop: '4px' }}>
                {Math.ceil((100 - researchProgress) / (100 / 30))}초 남음
              </div>
            </div>
          ) : (
            // 재료 투입 상태
            <>
              <div style={{ color: '#90a4ae', fontSize: '9px', marginBottom: '6px' }}>
                필요 재료:
              </div>
              
              {/* 금속 조각 슬롯 */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: '6px',
                padding: '4px',
                backgroundColor: '#2d2d44',
                borderRadius: '4px',
              }}>
                <span style={{ color: '#4fc3f7', fontSize: '10px' }}>⚙️ 금속조각</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button
                    onClick={() => handleRemoveItem('metal_scrap')}
                    disabled={insertedItems.metal_scrap <= 0}
                    style={{
                      width: '18px',
                      height: '18px',
                      backgroundColor: insertedItems.metal_scrap > 0 ? '#ef4444' : '#4a4a5a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: insertedItems.metal_scrap > 0 ? 'pointer' : 'not-allowed',
                      fontSize: '10px',
                    }}
                  >-</button>
                  <span style={{ 
                    color: insertedItems.metal_scrap >= requiredItems.metal_scrap ? '#4caf50' : '#ffd54f',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    minWidth: '30px',
                    textAlign: 'center',
                  }}>
                    {insertedItems.metal_scrap}/{requiredItems.metal_scrap}
                  </span>
                  <button
                    onClick={() => handleInsertItem('metal_scrap')}
                    disabled={!canInsertMetalScrap || insertedItems.metal_scrap >= requiredItems.metal_scrap}
                    style={{
                      width: '18px',
                      height: '18px',
                      backgroundColor: canInsertMetalScrap && insertedItems.metal_scrap < requiredItems.metal_scrap ? '#4caf50' : '#4a4a5a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: canInsertMetalScrap && insertedItems.metal_scrap < requiredItems.metal_scrap ? 'pointer' : 'not-allowed',
                      fontSize: '10px',
                    }}
                  >+</button>
                </div>
              </div>
              
              {/* 부서진 안테나 슬롯 */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: '6px',
                padding: '4px',
                backgroundColor: '#2d2d44',
                borderRadius: '4px',
              }}>
                <span style={{ color: '#90caf9', fontSize: '10px' }}>📡 안테나</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button
                    onClick={() => handleRemoveItem('antenna')}
                    disabled={insertedItems.antenna <= 0}
                    style={{
                      width: '18px',
                      height: '18px',
                      backgroundColor: insertedItems.antenna > 0 ? '#ef4444' : '#4a4a5a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: insertedItems.antenna > 0 ? 'pointer' : 'not-allowed',
                      fontSize: '10px',
                    }}
                  >-</button>
                  <span style={{ 
                    color: insertedItems.antenna >= requiredItems.antenna ? '#4caf50' : '#ffd54f',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    minWidth: '30px',
                    textAlign: 'center',
                  }}>
                    {insertedItems.antenna}/{requiredItems.antenna}
                  </span>
                  <button
                    onClick={() => handleInsertItem('antenna')}
                    disabled={!canInsertAntenna || insertedItems.antenna >= requiredItems.antenna}
                    style={{
                      width: '18px',
                      height: '18px',
                      backgroundColor: canInsertAntenna && insertedItems.antenna < requiredItems.antenna ? '#4caf50' : '#4a4a5a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: canInsertAntenna && insertedItems.antenna < requiredItems.antenna ? 'pointer' : 'not-allowed',
                      fontSize: '10px',
                    }}
                  >+</button>
                </div>
              </div>
              
              {/* 보유량 표시 */}
              <div style={{ color: '#6b7280', fontSize: '8px', marginBottom: '8px' }}>
                보유: ⚙️{inventory.metal_scrap || 0} | 📡{inventory.antenna || 0}
              </div>
              
              {/* 연구 시작 버튼 */}
              <button
                onClick={handleStartResearch}
                disabled={!canStartResearch}
                style={{
                  width: '100%',
                  backgroundColor: canStartResearch ? '#7c3aed' : '#4a4a5a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '6px',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  cursor: canStartResearch ? 'pointer' : 'not-allowed',
                }}
              >
                🚀 연구 시작
              </button>
              
              {/* 결과물 미리보기 */}
              <div style={{ color: '#90a4ae', fontSize: '8px', marginTop: '6px', textAlign: 'center' }}>
                결과물: 🛸 우주선 플레이트 (30초)
              </div>
            </>
          )}
          
          {/* 닫기 버튼 */}
          <button
            onClick={() => setShowResearchPanel(false)}
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              backgroundColor: 'transparent',
              color: '#90a4ae',
              border: 'none',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>,
        document.body
      )}
    </div>
  );
});

// 미리보기용 컴포넌트
const ScienceBasePreview = memo(({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    {/* 베이스 */}
    <rect x="8" y="38" width="32" height="4" fill="#5d4037" />
    
    {/* 메인 건물 */}
    <rect x="10" y="18" width="28" height="20" fill="#8d6e63" />
    <rect x="10" y="22" width="28" height="1" fill="#6d4c41" />
    <rect x="10" y="28" width="28" height="1" fill="#6d4c41" />
    
    {/* 지붕 */}
    <polygon points="24,6 6,18 42,18" fill="#6d4c41" />
    <polygon points="24,8 10,18 38,18" fill="#795548" />
    
    {/* 안테나 */}
    <rect x="23" y="2" width="2" height="6" fill="#78909c" />
    <circle cx="24" cy="2" r="2" fill="#ef5350" />
    
    {/* 창문 */}
    <rect x="12" y="22" width="6" height="5" fill="#4fc3f7" />
    <rect x="30" y="22" width="6" height="5" fill="#4fc3f7" />
    
    {/* 문 */}
    <rect x="20" y="28" width="8" height="10" fill="#4e342e" />
    
    {/* 과학 기호 */}
    <circle cx="24" cy="14" r="2" fill="#fff176" />
  </svg>
));

export { ScienceBase, ScienceBasePreview };
export default ScienceBase;
