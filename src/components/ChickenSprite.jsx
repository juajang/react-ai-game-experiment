import { CHICKEN_SPRITES } from '../constants/sprites';

const ChickenSprite = ({ frame, direction }) => {
  return (
    <div 
      className="text-xs leading-none whitespace-pre font-mono"
      style={{ 
        transform: direction < 0 ? 'scaleX(-1)' : 'scaleX(1)',
        fontSize: '8px',
        lineHeight: '8px'
      }}
    >
      {CHICKEN_SPRITES[frame]}
    </div>
  );
};

export default ChickenSprite;

