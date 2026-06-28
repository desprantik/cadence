import { useEffect, useState } from 'react';

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

export default function AnimatedNumber({
  value,
  from,
  duration = 1200,
  decimals = 0,
  className,
}) {
  const [display, setDisplay] = useState(from ?? value);

  useEffect(() => {
    const startVal = from ?? value;
    const endVal = value;
    if (startVal === endVal) {
      setDisplay(endVal);
      return undefined;
    }

    const start = performance.now();
    let frame;

    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = easeOutCubic(t);
      const current = startVal + (endVal - startVal) * eased;
      setDisplay(current);
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, from, duration]);

  const formatted =
    decimals > 0 ? display.toFixed(decimals) : Math.round(display).toString();

  return <span className={className}>{formatted}</span>;
}
