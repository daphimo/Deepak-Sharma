'use client';

import * as React from 'react';

export function useIsTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = React.useState(false);

  React.useEffect(() => {
    const getIsTouchDevice = () => {
      if (typeof window === 'undefined') return false;
      const hasTouch =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.maxTouchPoints > 0;
      const hasCoarsePointer =
        window.matchMedia?.('(pointer: coarse)')?.matches ?? false;
      const noHover =
        window.matchMedia?.('(hover: none)')?.matches ?? false;
      return hasTouch || hasCoarsePointer || noHover;
    };

    const update = () => setIsTouchDevice(getIsTouchDevice());

    window.addEventListener('resize', update);
    update();

    return () => {
      window.removeEventListener('resize', update);
    };
  }, []);

  return isTouchDevice;
}
