import React, { useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import WeatherBackground from '../components/WeatherBackground';
import CursorGlow from '../components/CursorGlow';
import { useWeather } from '../context/WeatherContext';
import { motion } from 'framer-motion';

const getTheme = (conditionText, timeOfDay) => {
  if (timeOfDay === 'default') {
    return { bg: 'rgba(15,45,107,0.3)', border: 'rgba(59,130,246,0.25)', hover: 'rgba(15,45,107,0.5)', accent: '#3b82f6', accentRgb: '59,130,246' };
  }

  const cond = conditionText?.toLowerCase() || '';
  const isDay = timeOfDay === 'day' || timeOfDay === 'morning';

  if (cond.includes('rain') || cond.includes('drizzle'))
    return { bg: 'rgba(22,78,99,0.18)', border: 'rgba(34,211,238,0.2)', hover: 'rgba(22,78,99,0.35)', accent: '#22d3ee', accentRgb: '34,211,238' };
  if (cond.includes('snow') || cond.includes('ice') || cond.includes('sleet'))
    return { bg: 'rgba(255,255,255,0.1)', border: 'rgba(255,255,255,0.25)', hover: 'rgba(255,255,255,0.18)', accent: '#bae6fd', accentRgb: '186,230,253' };
  if (cond.includes('thunder'))
    return { bg: 'rgba(15,15,25,0.5)', border: 'rgba(100,116,139,0.2)', hover: 'rgba(15,15,25,0.65)', accent: '#94a3b8', accentRgb: '148,163,184' };
  if (cond.includes('cloud') || cond.includes('overcast'))
    return isDay
      ? { bg: 'rgba(71,85,105,0.2)', border: 'rgba(148,163,184,0.25)', hover: 'rgba(71,85,105,0.38)', accent: '#94a3b8', accentRgb: '148,163,184' }
      : { bg: 'rgba(15,23,42,0.35)', border: 'rgba(100,116,139,0.2)', hover: 'rgba(15,23,42,0.5)', accent: '#64748b', accentRgb: '100,116,139' };
  if (cond.includes('clear') || cond.includes('sun'))
    return isDay
      ? { bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.25)', hover: 'rgba(251,191,36,0.18)', accent: '#fbbf24', accentRgb: '251,191,36' }
      : { bg: 'rgba(180,90,20,0.15)', border: 'rgba(251,146,60,0.2)', hover: 'rgba(180,90,20,0.25)', accent: '#fb923c', accentRgb: '251,146,60' };

  // Night / evening default — warm slate blue, no purple
  if (timeOfDay === 'night' || timeOfDay === 'evening')
    return { bg: 'rgba(15,23,42,0.4)', border: 'rgba(71,85,105,0.2)', hover: 'rgba(15,23,42,0.6)', accent: '#64748b', accentRgb: '100,116,139' };

  return { bg: 'rgba(0,0,0,0.1)', border: 'rgba(255,255,255,0.15)', hover: 'rgba(0,0,0,0.2)', accent: '#60a5fa', accentRgb: '96,165,250' };
};

// Derive time-of-day from location.localtime string
function getTimeOfDay(localtime, isDay) {
  if (!localtime) return 'default'; // No city searched yet

  const timePart = localtime.split(' ')[1] || '12:00';
  const h = Number(timePart.split(':')[0]);
  if (h >= 0  && h < 5)  return 'night';
  if (h >= 5  && h < 7)  return 'dawn';
  if (h >= 7  && h < 10) return 'morning';
  if (h >= 10 && h < 17) return 'day';
  if (h >= 17 && h < 20) return 'dusk';
  return 'evening';
}

const DashboardLayout = () => {
  const { weatherData } = useWeather();
  const location = useLocation();

  const condition  = weatherData?.current?.condition?.text || 'clear';
  const localtime  = weatherData?.location?.localtime || null;
  const moonPhase  = weatherData?.forecast?.forecastday?.[0]?.astro?.moon_phase || 'Full Moon';
  const apiIsDay   = weatherData?.current?.is_day ?? 1;

  const timeOfDay  = useMemo(
    () => getTimeOfDay(localtime, apiIsDay === 1),
    [localtime, apiIsDay]
  );

  const theme = getTheme(condition, timeOfDay);
  const cssVars = {
    '--theme-bg': theme.bg,
    '--theme-border': theme.border,
    '--theme-hover': theme.hover,
    '--theme-accent': theme.accent,
    '--theme-accent-rgb': theme.accentRgb,
  };

  return (
    <div style={cssVars} className="flex flex-col min-h-screen overflow-hidden font-sans transition-all duration-[1500ms]">
      {/* Animated background — now receives real localtime & moonPhase */}
      <WeatherBackground
        weatherCondition={condition}
        isDay={apiIsDay === 1}
        localtime={localtime}
        moonPhase={moonPhase}
      />

      {/* Cursor glow overlay */}
      <CursorGlow />

      {/* Animated ambient blobs */}
      <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
        <div className="blob absolute w-[500px] h-[500px] top-[-10%] left-[-10%]"
          style={{ background: `rgba(${theme.accentRgb},0.12)` }} />
        <div className="blob-2 absolute w-[600px] h-[600px] bottom-[-15%] right-[-15%]"
          style={{ background: `rgba(${theme.accentRgb},0.08)` }} />
      </div>

      {/* Top navbar */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* Main content */}
      <motion.main
        layout
        className="relative z-10 flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8"
      >
        <Outlet />
      </motion.main>
    </div>
  );
};

export default DashboardLayout;
