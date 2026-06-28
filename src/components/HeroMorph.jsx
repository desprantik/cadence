import { useRef } from 'react';
import { useHeroCondense } from '../hooks/useHeroCondense';

export default function HeroMorph({ compact, children }) {
  const anchorRef = useRef(null);
  const { progress, showCompact } = useHeroCondense(anchorRef);

  return (
    <>
      <div
        className="hero-morph-anchor"
        ref={anchorRef}
        style={{ '--condense': progress }}
      >
        <div className="hero-morph-anchor__content">{children}</div>
      </div>

      <div
        className={`hero-morph-bar${showCompact ? ' hero-morph-bar--visible' : ''}`}
        style={{ '--condense': progress }}
        aria-hidden={!showCompact}
      >
        {compact}
      </div>
    </>
  );
}
