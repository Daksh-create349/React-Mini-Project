import React, { useMemo, memo } from 'react';
import { motion } from 'framer-motion';

/**
 * Derive time-of-day period from WeatherAPI's localtime string.
 * "2024-05-08 22:35"
 * Returns: 'night' | 'dawn' | 'morning' | 'day' | 'dusk' | 'evening'
 */
export function getTimeOfDay(localtime, isDay) {
  if (!localtime) return 'default'; // Static state before search

  const timePart = localtime.split(' ')[1] || '12:00';
  const h = Number(timePart.split(':')[0]);

  if (h >= 0 && h < 5)  return 'night';
  if (h >= 5 && h < 7)  return 'dawn';
  if (h >= 7 && h < 10) return 'morning';
  if (h >= 10 && h < 17) return 'day';
  if (h >= 17 && h < 20) return 'dusk';
  return 'evening'; // 20–23
}

// Stable random helpers (keyed by seed so they don't flicker on re-render)
const seededRand = (seed) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

// ─── Stars field ──────────────────────────────────────────────────────────────
const Stars = memo(({ count = 120 }) => {
  const rand = seededRand(42);
  return (
    <div className="absolute inset-0">
      {Array.from({ length: count }).map((_, i) => {
        const x = rand() * 100;
        const y = rand() * 70; // Keep stars in upper portion
        const size = rand() * 2.5 + 0.8;
        const delay = rand() * 4;
        const opacity = rand() * 0.6 + 0.3;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              opacity,
            }}
            animate={{ opacity: [opacity, opacity * 0.3, opacity] }}
            transition={{ duration: 2 + rand() * 3, delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        );
      })}
    </div>
  );
});

// ─── Shooting star ────────────────────────────────────────────────────────────
const ShootingStar = memo(({ style }) => (
  <motion.div
    className="absolute h-px bg-gradient-to-r from-transparent via-white to-transparent"
    style={{ width: 120, ...style }}
    initial={{ opacity: 0, x: 0 }}
    animate={{ opacity: [0, 1, 0], x: 200 }}
    transition={{ duration: 1.2, delay: style.animationDelay, repeat: Infinity, repeatDelay: 8 + Math.random() * 10 }}
  />
));

// ─── Moon SVG ─────────────────────────────────────────────────────────────────
const Moon = memo(({ phase = 'full' }) => (
  <motion.div
    className="absolute top-28 right-8 md:top-32 md:right-20 z-10"
    initial={{ opacity: 0, y: -30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 2.5, ease: 'easeOut' }}
  >
    <div className="relative">
      {/* Glow ring */}
      <div className="absolute inset-[-20px] rounded-full bg-blue-100/10 blur-3xl animate-pulse" />
      <div className="absolute inset-[-8px] rounded-full bg-amber-100/8 blur-xl" />
      <svg width="90" height="90" viewBox="0 0 90 90" className="drop-shadow-[0_0_30px_rgba(220,220,180,0.5)] overflow-visible">
        {/* Full moon disc */}
        <circle cx="45" cy="45" r="38" fill="#e8e0c8" />
        {/* Subtle craters for realism */}
        <circle cx="30" cy="32" r="6" fill="#d4ccb0" opacity="0.6"/>
        <circle cx="58" cy="28" r="4" fill="#d4ccb0" opacity="0.5"/>
        <circle cx="50" cy="55" r="7" fill="#cfc8af" opacity="0.5"/>
        <circle cx="25" cy="52" r="4" fill="#d4ccb0" opacity="0.4"/>
        <circle cx="62" cy="48" r="3" fill="#d4ccb0" opacity="0.45"/>
        {/* Waxing crescent shadow overlay for non-full phases */}
        {phase !== 'full' && (
          <ellipse cx="55" cy="45" rx="32" ry="38" fill="#0f172a" opacity="0.72" />
        )}
      </svg>
    </div>
  </motion.div>
));

// ─── Sun SVG ──────────────────────────────────────────────────────────────────
const Sun = memo(({ period }) => {
  const sunColor = period === 'dawn' ? '#FDBA74' : period === 'dusk' ? '#FB923C' : '#FDE68A';
  const glowColor = period === 'dawn' ? 'rgba(251,146,60,0.4)' : period === 'dusk' ? 'rgba(239,68,68,0.35)' : 'rgba(253,230,138,0.45)';
  const yPos = period === 'dawn' || period === 'dusk' ? 'bottom-16 right-10 md:bottom-24 md:right-20' : 'top-28 right-8 md:top-32 md:right-20';

  return (
    <motion.div
      className={`absolute ${yPos} z-10`}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 2, ease: 'easeOut' }}
    >
      <div className="relative">
        <div className="absolute inset-[-30px] rounded-full blur-3xl" style={{ background: glowColor }} />
        <svg width="80" height="80" viewBox="0 0 80 80" className="overflow-visible">
          {/* Rays */}
          {[0,45,90,135,180,225,270,315].map((angle, i) => (
            <motion.line
              key={i}
              x1="40" y1="40"
              x2={40 + Math.cos(angle * Math.PI / 180) * 36}
              y2={40 + Math.sin(angle * Math.PI / 180) * 36}
              stroke={sunColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, delay: i * 0.15, repeat: Infinity }}
            />
          ))}
          <circle cx="40" cy="40" r="18" fill={sunColor} />
          <circle cx="40" cy="40" r="14" fill="white" fillOpacity="0.25" />
        </svg>
      </div>
    </motion.div>
  );
});

// ─── Horizon glow for dawn/dusk ───────────────────────────────────────────────
const HorizonGlow = memo(({ period }) => {
  const color = period === 'dawn'
    ? 'from-orange-400/40 via-pink-400/20 to-transparent'
    : 'from-red-500/40 via-orange-400/25 to-transparent';
  return (
    <div className={`absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t ${color} pointer-events-none`} />
  );
});

// ─── Main WeatherBackground ───────────────────────────────────────────────────
const WeatherBackground = ({ weatherCondition, isDay, localtime, moonPhase }) => {
  const condition = weatherCondition?.toLowerCase() || '';
  const timeOfDay = useMemo(() => getTimeOfDay(localtime, isDay), [localtime, isDay]);

  // ── Sky gradient ──────────────────────────────────────────────────────────
  const gradient = useMemo(() => {
    if (timeOfDay === 'default') {
      return 'from-[#1a4a8a] via-[#2563eb] to-[#0e3a70]'; // Light sky blue default
    }

    // Weather overrides first
    if (condition.includes('thunder'))
      return 'from-slate-900 via-purple-950 to-black';
    if (condition.includes('snow') || condition.includes('sleet') || condition.includes('ice'))
      return timeOfDay === 'night' || timeOfDay === 'evening'
        ? 'from-slate-800 via-slate-700 to-slate-900'
        : 'from-slate-300 via-sky-400 to-blue-500';

    // Time-of-day sky
    switch (timeOfDay) {
      case 'night':
        return 'from-[#020817] via-[#0d1b3e] to-[#0a0f1e]';
      case 'evening':
        return 'from-[#0f0c29] via-[#302b63] to-[#24243e]';
      case 'dawn':
        return 'from-[#1a1a2e] via-[#e96c50] to-[#f5a25d]';
      case 'morning':
        return 'from-[#c97b2e] via-[#e8a84a] to-[#5ba3c9]';
      case 'dusk':
        return 'from-[#0f2027] via-[#c94b4b] to-[#f7971e]';
      case 'day':
      default:
        if (condition.includes('cloud') || condition.includes('overcast'))
          return 'from-slate-500 via-slate-600 to-slate-700';
        if (condition.includes('rain') || condition.includes('drizzle'))
          return 'from-slate-700 via-cyan-900 to-blue-900';
        return 'from-sky-400 via-blue-500 to-blue-700';
    }
  }, [condition, timeOfDay]);

  const isNight = timeOfDay === 'night' || timeOfDay === 'evening';
  const isDawnOrDusk = timeOfDay === 'dawn' || timeOfDay === 'dusk';
  const rand = seededRand(99);
  const particles = Array.from({ length: 50 });

  return (
    <div className={`fixed inset-0 z-0 bg-gradient-to-br ${gradient} transition-all duration-[2000ms] pointer-events-none overflow-hidden`}>

      {/* ── Default state (No search yet) ──────────────────────────── */}
      {timeOfDay === 'default' && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-700/20 via-transparent to-transparent opacity-60" />
      )}

      {/* ── Night / Evening ─────────────────────────────────────────── */}
      {isNight && (
        <>
          <Stars count={timeOfDay === 'night' ? 150 : 80} />
          {/* Shooting stars */}
          {[0,1,2].map(i => (
            <ShootingStar key={i} style={{
              top: `${10 + i * 12}%`,
              left: `${5 + i * 20}%`,
              animationDelay: i * 6,
              transform: `rotate(${-20 + i * 5}deg)`
            }} />
          ))}
          <Moon phase={moonPhase} />
          {/* Nebula glow */}
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[400px] bg-indigo-900/30 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-blue-900/20 rounded-full blur-[100px] mix-blend-screen" />
        </>
      )}

      {/* ── Dawn / Dusk ─────────────────────────────────────────────── */}
      {isDawnOrDusk && (
        <>
          {/* Fade in a few stars for dusk */}
          {timeOfDay === 'dusk' && <Stars count={30} />}
          <Sun period={timeOfDay} />
          <HorizonGlow period={timeOfDay} />
          {/* Atmosphere scatter */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] mix-blend-screen"
            style={{ background: timeOfDay === 'dawn' ? 'rgba(251,113,133,0.25)' : 'rgba(239,68,68,0.2)' }} />
        </>
      )}

      {/* ── Morning ─────────────────────────────────────────────────── */}
      {timeOfDay === 'morning' && (
        <>
          <Sun period="morning" />
          <div className="absolute top-[-5%] right-[-5%] w-[700px] h-[700px] bg-yellow-200/40 rounded-full mix-blend-overlay filter blur-[120px]" />
          <div className="absolute top-[10%] right-[15%] w-[300px] h-[300px] bg-orange-300/30 rounded-full mix-blend-color-dodge filter blur-[60px]" />
        </>
      )}

      {/* ── Day (clear/sunny) ───────────────────────────────────────── */}
      {timeOfDay === 'day' && !condition.includes('rain') && !condition.includes('snow') && !condition.includes('thunder') && (
        <>
          {!condition.includes('cloud') && <Sun period="day" />}
          <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-yellow-300/50 rounded-full mix-blend-overlay filter blur-[100px] animate-pulse" />
        </>
      )}

      {/* ── Rain particles ───────────────────────────────────────────── */}
      {(condition.includes('rain') || condition.includes('drizzle')) && (
        <div className="absolute inset-0">
          {particles.map((_, i) => (
            <div
              key={i}
              className="absolute w-[2px] h-10 bg-cyan-100/50 rounded-full animate-rain"
              style={{
                left: `${rand() * 100}%`,
                top: `-${rand() * 20 + 10}%`,
                animationDelay: `${rand()}s`,
                animationDuration: `${rand() * 0.4 + 0.4}s`
              }}
            />
          ))}
        </div>
      )}

      {/* ── Snow particles ───────────────────────────────────────────── */}
      {(condition.includes('snow') || condition.includes('sleet')) && (
        <div className="absolute inset-0">
          {particles.map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-white/90 rounded-full animate-snow blur-[1px] shadow-[0_0_10px_rgba(255,255,255,0.8)]"
              style={{
                left: `${rand() * 100}%`,
                top: `-${rand() * 20 + 10}%`,
                animationDelay: `${rand() * 3}s`,
                animationDuration: `${rand() * 3 + 2}s`,
                transform: `scale(${rand() * 1.5 + 0.5})`
              }}
            />
          ))}
        </div>
      )}

      {/* ── Thunder lightning flash ──────────────────────────────────── */}
      {condition.includes('thunder') && (
        <>
          <div className="absolute inset-0 bg-white/80 mix-blend-overlay animate-lightning pointer-events-none" />
          <div className="absolute top-[20%] left-[30%] w-[500px] h-[500px] bg-purple-500/20 rounded-full mix-blend-screen filter blur-[100px]" />
        </>
      )}

      {/* ── Moving clouds (if not clear night) ──────────────────────── */}
      {!isNight && (condition.includes('cloud') || condition.includes('overcast') || condition.includes('rain')) && (
        <div className="absolute inset-0 opacity-30 mix-blend-screen">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/40 rounded-full filter blur-[60px] animate-clouds"
              style={{
                width: `${400 + i * 120}px`,
                height: `${150 + i * 60}px`,
                top: `${i * 10 - 5}%`,
                left: '100%',
                animationDelay: `${i * -8}s`,
                animationDuration: `${35 + i * 7}s`
              }}
            />
          ))}
        </div>
      )}

      {/* ── Subtle vignette ─────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />
    </div>
  );
};

export default memo(WeatherBackground);
