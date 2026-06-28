import { useEffect, useState } from 'react';

const STICKY_TOP = 52;
const COMPACT_HEIGHT = 72;

export function useHeroCondense(anchorRef) {
  const [progress, setProgress] = useState(0);
  const [showCompact, setShowCompact] = useState(false);

  useEffect(() => {
    const anchor = anchorRef.current;
    if (!anchor) return undefined;

    let raf = 0;

    const update = () => {
      const rect = anchor.getBoundingClientRect();
      const anchorHeight = anchor.offsetHeight;
      const range = Math.max(anchorHeight - COMPACT_HEIGHT, 1);

      const stuckAmount = STICKY_TOP - rect.top;
      const p = Math.min(1, Math.max(0, stuckAmount / range));
      const past = rect.bottom < STICKY_TOP;

      setProgress(past ? 0 : p);
      setShowCompact(!past && p > 0.08);
      raf = 0;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [anchorRef]);

  return { progress, showCompact };
}
