import { useState, useEffect } from 'react';
import { GAME_CONFIG } from '../constants/gameConfig';

/**
 * 필드 크기를 감지하고 반환하는 커스텀 훅
 */
export const useFieldSize = (fieldRef) => {
  const [fieldSize, setFieldSize] = useState({
    width: GAME_CONFIG.FIELD.DEFAULT_WIDTH,
    height: GAME_CONFIG.FIELD.DEFAULT_HEIGHT,
  });

  useEffect(() => {
    const updateSize = () => {
      if (fieldRef.current) {
        const rect = fieldRef.current.getBoundingClientRect();
        setFieldSize({ width: rect.width, height: rect.height });
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    
    return () => window.removeEventListener('resize', updateSize);
  }, [fieldRef]);

  return fieldSize;
};

