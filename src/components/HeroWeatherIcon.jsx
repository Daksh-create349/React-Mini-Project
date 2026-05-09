import React from 'react';
import { motion } from 'framer-motion';

// High-fidelity, crisp, infinitely scalable vector weather icons.
// These replace the pixelated 64x64 WeatherAPI raster images.

export const HeroWeatherIcon = ({ conditionText, isDay }) => {
  const text = conditionText?.toLowerCase() || '';

  // 1. FOG / MIST
  if (text.includes('fog') || text.includes('mist')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_20px_40px_rgba(255,255,255,0.15)]">
        {/* Cloud Base */}
        <motion.path
          d="M 25 60 Q 15 60 15 50 Q 15 40 25 40 Q 30 30 45 30 Q 60 30 65 40 Q 75 40 80 45 Q 85 50 80 60 Z"
          fill="#cbd5e1"
          animate={{ y: [-2, 2, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Fog lines */}
        <motion.line x1="20" y1="70" x2="80" y2="70" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round"
          animate={{ x: [-3, 3, -3], opacity: [0.6, 1, 0.6] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.line x1="30" y1="82" x2="70" y2="82" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round"
          animate={{ x: [3, -3, 3], opacity: [0.6, 1, 0.6] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }} />
      </svg>
    );
  }

  // 2. RAIN / DRIZZLE
  if (text.includes('rain') || text.includes('drizzle') || text.includes('shower')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_20px_40px_rgba(59,130,246,0.3)]">
        {/* Darker Rain Cloud */}
        <path d="M 25 55 Q 15 55 15 45 Q 15 35 25 35 Q 30 25 45 25 Q 60 25 65 35 Q 75 35 80 40 Q 85 45 80 55 Z" fill="#64748b" />
        {/* Raindrops */}
        {[30, 45, 60, 75].map((x, i) => (
          <motion.line
            key={i}
            x1={x} y1="55" x2={x - 10} y2="75"
            stroke="#38bdf8" strokeWidth="4" strokeLinecap="round"
            initial={{ y: 0, opacity: 1 }}
            animate={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </svg>
    );
  }

  // 3. THUNDERSTORM
  if (text.includes('thunder') || text.includes('storm')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_20px_40px_rgba(168,85,247,0.3)]">
        <path d="M 25 50 Q 15 50 15 40 Q 15 30 25 30 Q 30 20 45 20 Q 60 20 65 30 Q 75 30 80 35 Q 85 40 80 50 Z" fill="#475569" />
        {/* Lightning Bolt */}
        <motion.path
          d="M 55 45 L 40 65 L 50 65 L 45 85 L 65 55 L 55 55 Z"
          fill="#fcd34d"
          animate={{ opacity: [1, 0, 1, 1, 0, 1], scale: [1, 1, 1.1, 1, 1, 1] }}
          transition={{ duration: 2, repeat: Infinity, times: [0, 0.1, 0.2, 0.3, 0.4, 1] }}
        />
      </svg>
    );
  }

  // 4. SNOW / ICE
  if (text.includes('snow') || text.includes('ice') || text.includes('sleet')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_20px_40px_rgba(255,255,255,0.4)]">
        <path d="M 25 50 Q 15 50 15 40 Q 15 30 25 30 Q 30 20 45 20 Q 60 20 65 30 Q 75 30 80 35 Q 85 40 80 50 Z" fill="#94a3b8" />
        {/* Snowflakes */}
        {[30, 50, 70].map((x, i) => (
          <motion.circle
            key={i}
            cx={x} cy="60" r="4" fill="white"
            initial={{ y: 0, x: 0, opacity: 1 }}
            animate={{ y: 25, x: Math.sin(i) * 10, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}
      </svg>
    );
  }

  // 5. CLOUDY / OVERCAST (Heavy Clouds)
  if (text === 'cloudy' || text === 'overcast') {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
        <motion.path
          d="M 30 65 Q 15 65 15 50 Q 15 35 30 35 Q 35 20 55 20 Q 75 20 80 35 Q 95 35 95 50 Q 95 65 80 65 Z"
          fill="#94a3b8"
          animate={{ x: [-2, 2, -2] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.path
          d="M 20 75 Q 5 75 5 60 Q 5 45 20 45 Q 25 35 40 35 Q 55 35 60 45 Q 70 45 75 60 Q 75 75 60 75 Z"
          fill="#cbd5e1"
          animate={{ x: [2, -2, 2] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    );
  }

  // 6. PARTLY CLOUDY
  if (text.includes('partly') || text.includes('cloud')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_20px_40px_rgba(250,204,21,0.2)]">
        {isDay ? (
          <motion.circle cx="35" cy="35" r="20" fill="#fde047"
            animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity }} />
        ) : (
          <motion.circle cx="35" cy="35" r="18" fill="#e2e8f0"
            animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 4, repeat: Infinity }} />
        )}
        <motion.path
          d="M 35 70 Q 20 70 20 55 Q 20 40 35 40 Q 40 25 60 25 Q 80 25 85 40 Q 95 40 95 55 Q 95 70 80 70 Z"
          fill="#f1f5f9"
          animate={{ x: [0, 4, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    );
  }

  // 7. CLEAR / SUNNY
  if (isDay) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_60px_rgba(253,224,71,0.6)]">
        {/* Rays */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <motion.line
            key={i}
            x1="50" y1="50"
            x2={50 + Math.cos(angle * Math.PI / 180) * 45}
            y2={50 + Math.sin(angle * Math.PI / 180) * 45}
            stroke="#fde047" strokeWidth="4" strokeLinecap="round"
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 3, delay: i * 0.2, repeat: Infinity }}
          />
        ))}
        <circle cx="50" cy="50" r="25" fill="#fef08a" />
      </svg>
    );
  }

  // 8. CLEAR NIGHT
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_40px_rgba(226,232,240,0.4)]">
      <motion.path
        d="M 50 15 A 35 35 0 0 0 50 85 A 40 40 0 0 1 50 15 Z"
        fill="#f8fafc"
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: 'center' }}
      />
      {/* Sparkles */}
      <motion.circle cx="20" cy="30" r="2" fill="white" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2, repeat: Infinity }} />
      <motion.circle cx="80" cy="40" r="3" fill="white" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 3, repeat: Infinity }} />
      <motion.circle cx="30" cy="70" r="2" fill="white" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2.5, repeat: Infinity }} />
    </svg>
  );
};
