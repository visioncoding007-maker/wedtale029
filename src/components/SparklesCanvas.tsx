import React, { useEffect, useRef } from 'react';

export const SparklesCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = ['#FFE87C', '#FFD700', '#FFF8DC', '#FFA500', '#FFFFFF'];
    const particles = Array.from({ length: 32 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 2 + Math.random() * 5,
      alpha: Math.random(),
      speedAlpha: 0.015 + Math.random() * 0.03,
      speedY: -(0.3 + Math.random() * 0.8),
      speedX: (Math.random() - 0.5) * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI,
      rotationSpeed: 0.02 + Math.random() * 0.04,
    }));

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.alpha += p.speedAlpha;
        p.rotation += p.rotationSpeed;

        if (p.alpha > 1 || p.alpha < 0.1) {
          p.speedAlpha = -p.speedAlpha;
        }
        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }

        const clampedAlpha = Math.max(0, Math.min(1, p.alpha));
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = clampedAlpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 10;

        // 4-point star sparkle
        ctx.beginPath();
        const v = p.size;
        ctx.moveTo(0, -v * 2);
        ctx.quadraticCurveTo(0, 0, v * 2, 0);
        ctx.quadraticCurveTo(0, 0, 0, v * 2);
        ctx.quadraticCurveTo(0, 0, -v * 2, 0);
        ctx.quadraticCurveTo(0, 0, 0, -v * 2);
        ctx.fill();

        // Center dot
        ctx.beginPath();
        ctx.arc(0, 0, v * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-30 w-full h-full"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
