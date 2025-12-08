// 금화 컴포넌트
const Coin = ({ size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 16 16" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* 외곽 테두리 (진한 금색) */}
    <rect x="3" y="3" width="10" height="1" fill="#b8860b"/>
    <rect x="3" y="12" width="10" height="1" fill="#b8860b"/>
    <rect x="3" y="4" width="1" height="8" fill="#b8860b"/>
    <rect x="12" y="4" width="1" height="8" fill="#b8860b"/>
    
    {/* 내부 코인 색 (밝은 금색) */}
    <rect x="4" y="4" width="8" height="8" fill="#ffd700"/>
    
    {/* 중앙 하이라이트 */}
    <rect x="6" y="6" width="4" height="4" fill="#fff176"/>
    
    {/* 작은 디테일 점 */}
    <rect x="5" y="5" width="1" height="1" fill="#ffecb3"/>
    <rect x="10" y="5" width="1" height="1" fill="#ffecb3"/>
    <rect x="5" y="10" width="1" height="1" fill="#ffecb3"/>
    <rect x="10" y="10" width="1" height="1" fill="#ffecb3"/>
  </svg>
);

export default Coin;



