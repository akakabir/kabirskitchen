import { useRef, useEffect } from 'react';

const EMOJIS = ['🍕', '🍔', '🍟', '🍿', '🌭', '🧇', '🌮', '🍙', '🍩', '🍫', '🍰'];
const GRAVITY = 0.35;
const EMOJI_COUNT = 4;
const MAX_EMOJIS = 12;

const ClickSpark = () => {
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleClick = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      while (sparksRef.current.length + EMOJI_COUNT > MAX_EMOJIS && sparksRef.current.length > 0) {
        sparksRef.current.splice(Math.floor(Math.random() * sparksRef.current.length), 1);
      }
      for (let i = 0; i < EMOJI_COUNT; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 4;
        sparksRef.current.push({
          emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 4,
          size: 22 + Math.random() * 10,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.2
        });
      }
    };
    window.addEventListener('click', handleClick);

    let animationId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparksRef.current = sparksRef.current.filter((spark) => {
        spark.vy += GRAVITY;
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.rotation += spark.rotationSpeed;

        if (spark.y > canvas.height + 50) {
          return false;
        }

        ctx.save();
        ctx.translate(spark.x, spark.y);
        ctx.rotate(spark.rotation);
        ctx.font = `${spark.size}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(spark.emoji, 0, 0);
        ctx.restore();

        return true;
      });

      animationId = requestAnimationFrame(draw);
    };
    animationId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999
      }}
    />
  );
};

export default ClickSpark;
