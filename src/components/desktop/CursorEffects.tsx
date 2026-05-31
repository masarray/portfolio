// @ts-nocheck
import React, { useEffect, useRef } from 'react';

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export default function CursorEffects() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let hue = 245;
    let lastMove = performance.now();

    const pointer = {
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.52,
      px: window.innerWidth * 0.5,
      py: window.innerHeight * 0.52,
      vx: 0,
      vy: 0
    };

    const plumes = [];
    const sparks = [];
    const ribbons = Array.from({ length: 26 }, () => ({ x: pointer.x, y: pointer.y }));

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
    };

    const addPlume = (x, y, vx, vy, count) => {
      const speed = clamp(Math.hypot(vx, vy), 2, 180);
      const angle = Math.atan2(vy || 0.01, vx || 0.01);
      for (let i = 0; i < count; i += 1) {
        const reverse = angle + Math.PI + (Math.random() - 0.5) * 1.15;
        const side = angle + Math.PI / 2;
        const sideOffset = (Math.random() - 0.5) * (18 + speed * 0.22);
        plumes.push({
          x: x + Math.cos(side) * sideOffset,
          y: y + Math.sin(side) * sideOffset,
          vx: Math.cos(reverse) * (0.35 + speed * (0.012 + Math.random() * 0.026)) - vx * 0.018,
          vy: Math.sin(reverse) * (0.35 + speed * (0.012 + Math.random() * 0.026)) - vy * 0.018,
          r: 20 + Math.random() * 60 + speed * 0.20,
          age: 0,
          life: 78 + Math.random() * 92,
          hue: hue + Math.random() * 110 - 36,
          alpha: 0.055 + Math.random() * 0.12,
          rotate: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.018,
          stretch: 1.15 + Math.random() * 1.85
        });
      }
      if (plumes.length > 320) plumes.splice(0, plumes.length - 320);
    };

    const addSparks = (x, y, vx, vy, count) => {
      const speed = clamp(Math.hypot(vx, vy), 0, 150);
      for (let i = 0; i < count; i += 1) {
        const a = Math.random() * Math.PI * 2;
        sparks.push({
          x: x + (Math.random() - 0.5) * 10,
          y: y + (Math.random() - 0.5) * 10,
          vx: Math.cos(a) * (0.45 + Math.random() * 2.8) - vx * 0.012,
          vy: Math.sin(a) * (0.45 + Math.random() * 2.8) - vy * 0.012,
          size: 0.85 + Math.random() * 2.4 + speed * 0.012,
          hue: hue + 20 + Math.random() * 130,
          age: 0,
          life: 26 + Math.random() * 34,
          alpha: 0.45 + Math.random() * 0.45
        });
      }
      if (sparks.length > 260) sparks.splice(0, sparks.length - 260);
    };

    const onPointerMove = (event) => {
      const x = event.clientX;
      const y = event.clientY;
      pointer.vx = x - pointer.x;
      pointer.vy = y - pointer.y;
      pointer.px = pointer.x;
      pointer.py = pointer.y;
      pointer.x = x;
      pointer.y = y;
      lastMove = performance.now();

      const speed = Math.hypot(pointer.vx, pointer.vy);
      hue = (hue + speed * 0.35 + 2.5) % 360;
      addPlume(x, y, pointer.vx, pointer.vy, clamp(Math.floor(speed / 14), 2, 12));
      addSparks(x, y, pointer.vx, pointer.vy, clamp(Math.floor(speed / 18), 1, 7));
    };

    const onTouchMove = (event) => {
      if (event.touches[0]) onPointerMove(event.touches[0]);
    };

    const drawRibbon = () => {
      ribbons[0].x += (pointer.x - ribbons[0].x) * 0.34;
      ribbons[0].y += (pointer.y - ribbons[0].y) * 0.34;
      for (let i = 1; i < ribbons.length; i += 1) {
        const pull = Math.max(0.14, 0.32 - i * 0.006);
        ribbons[i].x += (ribbons[i - 1].x - ribbons[i].x) * pull;
        ribbons[i].y += (ribbons[i - 1].y - ribbons[i].y) * pull;
      }

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let pass = 0; pass < 4; pass += 1) {
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowBlur = 18 + pass * 8;
        ctx.shadowColor = `hsla(${hue + pass * 34},100%,62%,${0.22 - pass * 0.035})`;
        ctx.strokeStyle = `hsla(${hue + pass * 42},100%,${62 + pass * 5}%,${0.18 - pass * 0.03})`;
        ctx.lineWidth = 18 - pass * 3.4;
        ctx.moveTo(ribbons[0].x, ribbons[0].y);
        for (let i = 1; i < ribbons.length - 2; i += 1) {
          const xc = (ribbons[i].x + ribbons[i + 1].x) / 2;
          const yc = (ribbons[i].y + ribbons[i + 1].y) / 2;
          ctx.quadraticCurveTo(ribbons[i].x, ribbons[i].y, xc, yc);
        }
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawPlume = (p, index, now) => {
      const life = Math.max(0, 1 - p.age / p.life);
      const radius = Math.max(2, p.r + p.age * 0.38);
      const alpha = p.alpha * life * life;
      const wobbleX = Math.sin(now * 0.0012 + index * 1.7) * 8 * life;
      const wobbleY = Math.cos(now * 0.0011 + index * 1.3) * 6 * life;

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.translate(p.x + wobbleX, p.y + wobbleY);
      ctx.rotate(p.rotate + p.age * p.spin);
      ctx.scale(p.stretch, 0.55 + Math.sin(p.age * 0.04) * 0.08);
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
      g.addColorStop(0, `hsla(${p.hue},100%,68%,${alpha})`);
      g.addColorStop(0.28, `hsla(${p.hue + 34},100%,60%,${alpha * 0.62})`);
      g.addColorStop(0.68, `hsla(${p.hue + 86},100%,58%,${alpha * 0.22})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawSpark = (p) => {
      const life = Math.max(0, 1 - p.age / p.life);
      const r = Math.max(0, p.size * life);
      if (r <= 0) return;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.shadowColor = `hsla(${p.hue},100%,68%,${0.85 * life})`;
      ctx.shadowBlur = 14;
      ctx.fillStyle = `hsla(${p.hue},100%,72%,${p.alpha * life})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const tick = (now) => {
      // Persistent fade: do not wipe the canvas clean. This gives the smoke a premium afterglow.
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.075)';
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      const idle = now - lastMove > 1700;
      if (idle) {
        const t = now * 0.00024;
        pointer.x += (width * (0.5 + Math.sin(t * 1.1) * 0.18) - pointer.x) * 0.006;
        pointer.y += (height * (0.55 + Math.cos(t * 1.3) * 0.11) - pointer.y) * 0.006;
      }

      drawRibbon();

      for (let i = plumes.length - 1; i >= 0; i -= 1) {
        const p = plumes[i];
        const swirl = Math.sin((p.x + p.y) * 0.005 + now * 0.001 + i) * 0.022;
        p.vx += Math.cos(now * 0.0007 + i) * 0.010 + swirl;
        p.vy += Math.sin(now * 0.0006 + i) * 0.010 - 0.002;
        p.vx *= 0.986;
        p.vy *= 0.986;
        p.x += p.vx;
        p.y += p.vy;
        p.age += 1;
        drawPlume(p, i, now);
        if (p.age >= p.life) plumes.splice(i, 1);
      }

      for (let i = sparks.length - 1; i >= 0; i -= 1) {
        const p = sparks[i];
        p.vx *= 0.968;
        p.vy *= 0.968;
        p.x += p.vx;
        p.y += p.vy;
        p.age += 1;
        drawSpark(p);
        if (p.age >= p.life) sparks.splice(i, 1);
      }

      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="cursor-effects-canvas" aria-hidden="true" />;
}
