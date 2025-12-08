const Feed = ({ x, y }) => (
  <div 
    className="absolute flex items-center justify-center"
    style={{ left: x - 11, top: y - 14, zIndex: 2 }}
  >
    <svg 
      width="22" 
      height="28" 
      viewBox="0 0 16 20" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 줄기 */}
      <rect x="7" y="10" width="2" height="8" fill="#7CB342"/>
      <rect x="8" y="10" width="1" height="8" fill="#8BC34A"/>
      
      {/* 잎사귀 */}
      <rect x="5" y="14" width="2" height="1" fill="#8BC34A"/>
      <rect x="9" y="12" width="2" height="1" fill="#8BC34A"/>
      
      {/* 벼 이삭 - 왼쪽 */}
      <rect x="4" y="4" width="2" height="3" fill="#FFD54F"/>
      <rect x="3" y="5" width="1" height="2" fill="#FFCA28"/>
      
      {/* 벼 이삭 - 중앙 */}
      <rect x="7" y="2" width="2" height="4" fill="#FFD54F"/>
      <rect x="6" y="3" width="1" height="3" fill="#FFCA28"/>
      <rect x="9" y="3" width="1" height="3" fill="#FFCA28"/>
      <rect x="7" y="1" width="2" height="1" fill="#FFE082"/>
      
      {/* 벼 이삭 - 오른쪽 */}
      <rect x="10" y="4" width="2" height="3" fill="#FFD54F"/>
      <rect x="12" y="5" width="1" height="2" fill="#FFCA28"/>
      
      {/* 반짝임 */}
      <rect x="8" y="2" width="1" height="1" fill="#FFFFFF" fillOpacity="0.5"/>
    </svg>
  </div>
);

export default Feed;



