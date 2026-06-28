import { useEffect, useRef, useState } from 'react';

const DURATION_MS = 5 * 60 * 1000;

function formatTime(ms) {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

export default function SoftTimerRing({ durationMs = DURATION_MS }) {
  const [remaining, setRemaining] = useState(durationMs);
  const startRef = useRef(performance.now());
  const rafRef = useRef(null);

  useEffect(() => {
    startRef.current = performance.now();

    const tick = (now) => {
      const elapsed = now - startRef.current;
      setRemaining(Math.max(0, durationMs - elapsed));
      if (elapsed < durationMs) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [durationMs]);

  const progress = 1 - remaining / durationMs;
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progress * circumference;

  return (
    <div className="soft-timer" aria-label={`Focus timer ${formatTime(remaining)} remaining`}>
      <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden="true">
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth="4"
        />
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke="var(--yellow)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 36 36)"
          style={{ transition: 'stroke-dashoffset 0.3s linear' }}
        />
      </svg>
      <span className="soft-timer__label">{formatTime(remaining)}</span>
    </div>
  );
}
