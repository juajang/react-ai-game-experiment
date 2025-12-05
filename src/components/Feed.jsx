const Feed = ({ x, y }) => (
  <div 
    className="absolute w-4 h-4 flex items-center justify-center"
    style={{ left: x - 8, top: y - 8 }}
  >
    <span className="text-lg">🌾</span>
  </div>
);

export default Feed;

