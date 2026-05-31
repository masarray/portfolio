// @ts-nocheck
import React, { useEffect, useRef } from 'react';

const palette = [
  [53, 97, 255],
  [103, 72, 255],
  [204, 42, 255],
  [38, 205, 255],
  [255, 62, 214]
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export default function LiveWallpaper() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let frame = 0;

    const mouse = {
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.5,
      tx: window.innerWidth * 0.5,
      ty: window.innerHeight * 0.5,
      vx: 0,
      vy: 0
    };

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onPointerMove = (event) => {
      mouse.vx = event.clientX - mouse.tx;
      mouse.vy = event.clientY - mouse.ty;
      mouse.tx = event.clientX;
      mouse.ty = event.clientY;
    };

    const drawBase = (time) => {
      const base = ctx.createLinearGradient(0, 0, width, height);
      base.addColorStop(0, '#04040a');
      base.addColorStop(0.42, '#070716');
      base.addColorStop(0.72, '#05040b');
      base.addColorStop(1, '#010104');
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const breathe = Math.sin(time * 0.42) * 0.5 + 0.5;

      const mistA = ctx.createRadialGradient(width * 0.27, height * 0.74, 0, width * 0.27, height * 0.74, width * 0.72);
      mistA.addColorStop(0, `rgba(83,64,255,${0.10 + breathe * 0.035})`);
      mistA.addColorStop(0.42, 'rgba(54,88,255,0.032)');
      mistA.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = mistA;
      ctx.fillRect(0, 0, width, height);

      const mistB = ctx.createRadialGradient(width * 0.86, height * 0.80, 0, width * 0.86, height * 0.80, width * 0.55);
      mistB.addColorStop(0, `rgba(226,38,255,${0.055 + breathe * 0.02})`);
      mistB.addColorStop(0.38, 'rgba(30,147,255,0.035)');
      mistB.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = mistB;
      ctx.fillRect(0, 0, width, height);

      const mouseGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 220 + clamp(Math.hypot(mouse.vx, mouse.vy), 0, 140) * 1.2);
      mouseGlow.addColorStop(0, 'rgba(134,92,255,0.070)');
      mouseGlow.addColorStop(0.35, 'rgba(40,138,255,0.038)');
      mouseGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = mouseGlow;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    };

    const splineY = (x, time, options) => {
      const p = x / Math.max(1, width);
      const mouseP = mouse.x / Math.max(1, width);
      const mouseInfluence = Math.exp(-Math.pow((p - mouseP) * 5.8, 2));
      const push = ((mouse.y / Math.max(1, height)) - 0.5) * options.amp * mouseInfluence * (1 + clamp(Math.hypot(mouse.vx, mouse.vy) / 130, 0, 1.2));
      return height * options.y
        + Math.sin(p * options.freq + time * options.speed + options.phase) * options.amp
        + Math.sin(p * (options.freq * 2.2) - time * options.speed * 0.7 + options.phase) * options.amp * 0.22
        + Math.sin(p * 18 + time * 0.33 + options.phase) * options.amp * 0.06
        + (p - 0.5) * height * options.slope
        + push;
    };

    const drawSpline = (time, color, options, glowPass = false) => {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},${glowPass ? options.alpha * 0.18 : options.alpha})`;
      ctx.lineWidth = glowPass ? options.width * 7.4 : options.width;
      ctx.shadowColor = `rgba(${color[0]},${color[1]},${color[2]},${glowPass ? 0.32 : options.alpha})`;
      ctx.shadowBlur = glowPass ? 38 : 18;
      if (glowPass) ctx.filter = 'blur(9px)';

      ctx.beginPath();
      let first = true;
      for (let x = -180; x <= width + 180; x += 24) {
        const y = splineY(x, time, options);
        if (first) {
          ctx.moveTo(x, y);
          first = false;
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.restore();
    };

    const drawFanLines = (time) => {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (let i = 0; i < 11; i += 1) {
        const color = palette[(i + 1) % palette.length];
        const alpha = 0.038 + i * 0.004;
        const startX = width * (0.70 + Math.sin(time * 0.15 + i) * 0.012);
        const startY = height * (0.62 + i * 0.018);
        ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},${alpha})`;
        ctx.lineWidth = 1.0;
        ctx.shadowColor = `rgba(${color[0]},${color[1]},${color[2]},${alpha * 4})`;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.bezierCurveTo(width * 0.80, height * (0.70 + i * 0.025), width * 0.92, height * (0.84 + i * 0.03), width * 1.13, height * (0.86 + i * 0.035));
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawNoise = (time) => {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = 'rgba(255,255,255,0.018)';
      const step = 34;
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const v = Math.sin(x * 12.9898 + y * 78.233 + time * 5.1) * 43758.5453;
          if (v - Math.floor(v) > 0.91) ctx.fillRect(x, y, 1, 1);
        }
      }
      ctx.restore();
    };

    const tick = () => {
      frame += 1;
      const time = frame / 60;
      mouse.x += (mouse.tx - mouse.x) * 0.075;
      mouse.y += (mouse.ty - mouse.y) * 0.075;
      mouse.vx *= 0.9;
      mouse.vy *= 0.9;

      drawBase(time);

      const lines = [
        { color: palette[0], options: { y: 0.47, amp: 24, speed: 0.36, phase: 0.4, freq: 4.8, width: 2.0, alpha: 0.58, slope: 0.03 } },
        { color: palette[1], options: { y: 0.56, amp: 34, speed: 0.31, phase: 2.2, freq: 5.6, width: 2.35, alpha: 0.48, slope: -0.012 } },
        { color: palette[2], options: { y: 0.62, amp: 22, speed: 0.39, phase: 3.9, freq: 6.2, width: 2.7, alpha: 0.42, slope: -0.025 } },
        { color: palette[3], options: { y: 0.42, amp: 18, speed: 0.33, phase: 1.4, freq: 5.0, width: 1.05, alpha: 0.34, slope: 0.05 } }
      ];

      lines.forEach((line) => drawSpline(time, line.color, line.options, true));
      lines.forEach((line) => drawSpline(time, line.color, line.options, false));
      drawFanLines(time);
      drawNoise(time);
      raf = requestAnimationFrame(tick);
    };

    resize();
    tick();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="live-wallpaper" aria-hidden="true" />;
}
