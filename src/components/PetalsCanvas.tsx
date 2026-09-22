import React, { useEffect, useRef } from 'react';

interface PetalsCanvasProps {
  triggerShower?: number;
  petalColors?: string[];
}

interface Petal {
  x: number;
  y: number;
  size: number;
  color: string;
  speedY: number;
  speedX: number;
  rotate: number;
  rotateSpeed: number;
  flip: number;
  flipSpeed: number;
  opacity: number;
}

export const PetalsCanvas: React.FC<PetalsCanvasProps> = ({
  triggerShower = 0,
  petalColors = ['#F472B6', '#E9D5FF', '#FDE047', '#FFFFFF', '#C084FC', '#FBBF24'],
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const petalsRef = useRef<Petal[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const createPetal = (startY?: number): Petal => {
      return {
        x: Math.random() * width,
        y: startY !== undefined ? startY : Math.random() * height,
        size: 8 + Math.random() * 12,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        speedY: 1.2 + Math.random() * 2.2,
        speedX: Math.sin(Math.random() * Math.PI) * 1.5,
        rotate: Math.random() * 360,
        rotateSpeed: (Math.random() - 0.5) * 3,
        flip: Math.random() * Math.PI,
        flipSpeed: 0.03 + Math.random() * 0.05,
        opacity: 0.6 + Math.random() * 0.4,
      };
    };

    // Ambient floating petals
    petalsRef.current = Array.from({ length: 18 }, () => createPetal());

    let animId: number;
    let wave = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      wave += 0.02;

      petalsRef.current.forEach((p, idx) => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(wave + idx) * 0.8;
        p.rotate += p.rotateSpeed;
        p.flip += p.flipSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotate * Math.PI) / 180);
        ctx.scale(Math.cos(p.flip), 1);
        ctx.globalAlpha = p.opacity;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        // Delicate petal shape
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.8, p.size * 0.5, 0, p.size);
        ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.5, -p.size * 0.8, -p.size * 0.5, 0, -p.size);
        ctx.fill();

        // Subtle petal vein highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 0.7);
        ctx.lineTo(0, p.size * 0.7);
        ctx.stroke();

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [petalColors]);

  // Burst petals when shower triggered
  useEffect(() => {
    if (triggerShower <= 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.width;

    const burstPetals: Petal[] = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: -10 - Math.random() * 100,
      size: 9 + Math.random() * 14,
      color: petalColors[Math.floor(Math.random() * petalColors.length)],
      speedY: 2.8 + Math.random() * 4.2,
      speedX: (Math.random() - 0.5) * 3,
      rotate: Math.random() * 360,
      rotateSpeed: (Math.random() - 0.5) * 6,
      flip: Math.random() * Math.PI,
      flipSpeed: 0.04 + Math.random() * 0.08,
      opacity: 0.75 + Math.random() * 0.25,
    }));

    petalsRef.current = [...petalsRef.current, ...burstPetals];

    // Clean up excess after a while
    const timer = setTimeout(() => {
      if (petalsRef.current.length > 25) {
        petalsRef.current = petalsRef.current.slice(0, 22);
      }
    }, 6000);

    return () => clearTimeout(timer);
  }, [triggerShower, petalColors]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30 w-full h-full"
    />
  );
};
