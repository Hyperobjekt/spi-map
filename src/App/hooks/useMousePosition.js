import { useEffect, useState } from 'react';

/**
 * Gets the position of the mouse in the provided element,
 * or in the viewport if no element is provided
 * @returns {object} {x,y}
 */
export default function useMousePosition(el) {
  if (!el) el = window;
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (!el) return;
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    el.addEventListener('mousemove', handleMouseMove);
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
    };
  });
  return position;
}
