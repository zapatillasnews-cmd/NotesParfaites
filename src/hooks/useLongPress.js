import { useRef, useState, useCallback } from 'react';

export function useLongPress(onLongPress, ms = 620) {
  const timer = useRef(null);
  const fired = useRef(false);
  const [active, setActive] = useState(false);

  const start = useCallback((e) => {
    if (e.pointerType === 'touch') e.preventDefault();
    fired.current = false;
    setActive(true);
    timer.current = setTimeout(() => {
      fired.current = true;
      setActive(false);
      onLongPress();
    }, ms);
  }, [onLongPress, ms]);

  const cancel = useCallback(() => {
    clearTimeout(timer.current);
    setActive(false);
  }, []);

  return {
    active,
    handlers: {
      onPointerDown: start,
      onPointerUp: cancel,
      onPointerLeave: cancel,
      onPointerCancel: cancel,
    },
    didFire: () => fired.current,
  };
}
