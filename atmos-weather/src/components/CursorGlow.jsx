import React, { useEffect, useRef } from 'react';

/**
 * Follows the mouse with a large, soft radial glow.
 * Pure CSS + JS — no canvas, no performance hit.
 */
const CursorGlow = () => {
  const glowRef = useRef(null);

  useEffect(() => {
    const el = glowRef.current;
    if (!el) return;

    let raf;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const animate = () => {
      // Smooth lag — lerp toward target
      cx += (tx - cx) * 0.1;
      cy += (ty - cy) * 0.1;
      el.style.left = `${cx}px`;
      el.style.top  = `${cy}px`;
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      id="cursor-glow"
      style={{
        position: 'fixed',
        width: 500,
        height: 500,
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 9998,
        background: 'radial-gradient(circle, rgba(96,165,250,0.07) 0%, rgba(96,165,250,0.03) 40%, transparent 70%)',
        transform: 'translate(-50%, -50%)',
        transition: 'opacity 0.3s',
        mixBlendMode: 'screen',
      }}
    />
  );
};

export default CursorGlow;
