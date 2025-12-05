const Feed = ({ x, y }) => (
  <div 
    className="absolute flex items-center justify-center"
    style={{ left: x - 24, top: y - 24 }}
  >
    <svg 
      width="48" 
      height="48" 
      viewBox="0 0 16 16" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Stem */}
      <rect x="7" y="5" width="2" height="6" fill="#c0a848" />
      
      {/* Grain clusters */}
      <rect x="6" y="6" width="1" height="1" fill="#f5d879" />
      <rect x="9" y="7" width="1" height="1" fill="#f5d879" />
      <rect x="6" y="8" width="1" height="1" fill="#f5d879" />
      <rect x="9" y="9" width="1" height="1" fill="#f5d879" />
      <rect x="7" y="10" width="2" height="1" fill="#f1cf5e" />
    </svg>
  </div>
);

export default Feed;
