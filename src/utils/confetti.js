const COLORS = ['#f5c842', '#e8734a', '#2a9d5c', '#0056d2', '#a435f0', '#111111'];

function createParticle(canvas) {
  return {
    x: Math.random() * canvas.width,
    y: -10 - Math.random() * canvas.height * 0.3,
    w: 6 + Math.random() * 6,
    h: 4 + Math.random() * 4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 12,
    vx: (Math.random() - 0.5) * 4,
    vy: 2 + Math.random() * 4,
    opacity: 1,
  };
}

export function fireConfetti(durationMs = 2200) {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText =
    'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const particles = Array.from({ length: 120 }, () => createParticle(canvas));
  const start = performance.now();

  const frame = (now) => {
    const elapsed = now - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08;
      p.rotation += p.rotationSpeed;
      if (elapsed > durationMs * 0.6) {
        p.opacity = Math.max(0, 1 - (elapsed - durationMs * 0.6) / (durationMs * 0.4));
      }

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    if (elapsed < durationMs) {
      requestAnimationFrame(frame);
    } else {
      canvas.remove();
    }
  };

  requestAnimationFrame(frame);
}
