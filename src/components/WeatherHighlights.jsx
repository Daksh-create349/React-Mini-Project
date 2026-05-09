import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MdWbSunny, 
  MdAir, 
  MdWaterDrop, 
  MdVisibility, 
  MdCompress, 
  MdOutlineAir,
  MdOutlineModeNight
} from 'react-icons/md';
import { 
  WiSunrise, 
  WiSunset, 
  WiMoonrise, 
  WiMoonset,
  WiMoonNew,
  WiMoonAltWaxingCrescent3,
  WiMoonAltFirstQuarter,
  WiMoonAltWaxingGibbous3,
  WiMoonFull,
  WiMoonAltWaningGibbous3,
  WiMoonAltThirdQuarter,
  WiMoonAltWaningCrescent3
} from 'react-icons/wi';

// Helper component for circular progress (AQI, UV)
const CircularProgress = ({ value, max, color, label, sublabel, indexLabel }) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(value, max) / max) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center">
        <svg width="90" height="90" className="transform -rotate-90">
          <circle 
            cx="45" cy="45" r={radius} 
            stroke="rgba(255,255,255,0.1)" 
            strokeWidth="8" fill="transparent" 
          />
          <motion.circle 
            cx="45" cy="45" r={radius} 
            stroke={color} 
            strokeWidth="8" fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-display font-extrabold text-white text-shadow-premium">{indexLabel || value}</span>
        </div>
      </div>
      {label && <p className="mt-3 text-base font-bold text-white text-center drop-shadow-md">{label}</p>}
      {sublabel && <p className="text-xs text-white/60 font-medium text-center max-w-[120px] leading-tight mt-1">{sublabel}</p>}
    </div>
  );
};

const getMoonIcon = (phase) => {
  if (!phase) return <WiMoonFull size={28} />;
  const phaseLower = phase.toLowerCase();
  if (phaseLower.includes('new')) return <WiMoonNew size={28} />;
  if (phaseLower.includes('waxing crescent')) return <WiMoonAltWaxingCrescent3 size={28} />;
  if (phaseLower.includes('first quarter')) return <WiMoonAltFirstQuarter size={28} />;
  if (phaseLower.includes('waxing gibbous')) return <WiMoonAltWaxingGibbous3 size={28} />;
  if (phaseLower.includes('full')) return <WiMoonFull size={28} />;
  if (phaseLower.includes('waning gibbous')) return <WiMoonAltWaningGibbous3 size={28} />;
  if (phaseLower.includes('last quarter') || phaseLower.includes('third quarter')) return <WiMoonAltThirdQuarter size={28} />;
  if (phaseLower.includes('waning crescent')) return <WiMoonAltWaningCrescent3 size={28} />;
  return <WiMoonFull size={28} />;
};

const AstroTrajectory = ({ astro, isDay }) => {
  const [activeTab, setActiveTab] = useState(isDay ? 'sun' : 'moon');

  // Convert "06:00 AM" to Date object
  const parseTime = (timeStr) => {
    if (!timeStr || timeStr === "No moonset" || timeStr === "No moonrise") return null;
    const [time, modifier] = timeStr.split(' ');
    if (!time || !modifier) return null;
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours, 10);
    if (hours === 12) hours = 0;
    if (modifier === 'PM') hours += 12;
    const d = new Date();
    d.setHours(hours, parseInt(minutes, 10), 0, 0);
    return d.getTime();
  };

  const now = new Date().getTime();
  
  let riseTimeStr = activeTab === 'sun' ? astro?.sunrise : astro?.moonrise;
  let setTimeStr = activeTab === 'sun' ? astro?.sunset : astro?.moonset;
  
  const riseTime = parseTime(riseTimeStr);
  let setTime = parseTime(setTimeStr);

  // If sunset is early morning (e.g. next day moonset), add 24 hours
  if (riseTime && setTime && setTime < riseTime) {
    setTime += 24 * 60 * 60 * 1000;
  }

  let progress = 0;
  if (riseTime && setTime) {
    if (now < riseTime) progress = 0;
    else if (now > setTime) progress = 1;
    else progress = (now - riseTime) / (setTime - riseTime);
  } else {
    progress = 0.5; // fallback
  }

  const isSun = activeTab === 'sun';

  return (
    <div className="relative w-full flex flex-col h-full">
      {/* Tabs */}
      <div className="flex gap-2 mb-4 bg-black/20 p-1 rounded-xl self-start backdrop-blur-md border border-white/5">
        <button 
          onClick={() => setActiveTab('sun')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${isSun ? 'bg-white/20 text-yellow-300 shadow-md' : 'text-white/50 hover:text-white'}`}
        >
          <MdWbSunny size={16} /> Sun
        </button>
        <button 
          onClick={() => setActiveTab('moon')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${!isSun ? 'bg-white/20 text-blue-300 shadow-md' : 'text-white/50 hover:text-white'}`}
        >
          <MdOutlineModeNight size={16} /> Moon
        </button>
      </div>

      {/* Arc Container */}
      <div className="relative w-full flex-1 flex flex-col items-center justify-end">
        {/* Arc Path */}
        <svg width="220" height="110" viewBox="0 0 220 110" className="absolute bottom-8 drop-shadow-lg">
          <path 
            d="M 10 110 A 100 100 0 0 1 210 110" 
            fill="transparent" 
            stroke="rgba(255,255,255,0.15)" 
            strokeWidth="3" 
            strokeDasharray="4 6" 
          />
          <motion.path 
            key={activeTab} // Force re-animation on tab switch
            d="M 10 110 A 100 100 0 0 1 210 110" 
            fill="transparent" 
            stroke={`url(#${isSun ? 'sunGradient' : 'moonGradient'})`} 
            strokeWidth="5" 
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="sunGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <linearGradient id="moonGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="50%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Moving Icon */}
        <motion.div 
          key={`icon-${activeTab}`}
          className="absolute bottom-8 w-[220px] h-[110px]"
          initial={{ rotate: -90 }}
          animate={{ rotate: -90 + (progress * 180) }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ transformOrigin: 'bottom center' }}
        >
          <div className={`absolute top-[-16px] right-[-16px] bg-white/10 backdrop-blur-md rounded-full p-1.5 shadow-[0_0_20px_rgba(0,0,0,0.5)] ${isSun ? 'text-yellow-400 shadow-yellow-500/40' : 'text-blue-300 shadow-blue-500/40'}`}>
            {isSun ? <MdWbSunny size={22} className="animate-spin-slow" /> : getMoonIcon(astro?.moon_phase)}
          </div>
        </motion.div>

        {/* Labels */}
        <div className="w-full flex justify-between px-2 text-white absolute bottom-0">
          <div className="flex flex-col items-center">
            {isSun ? <WiSunrise size={26} className="text-yellow-300 drop-shadow-md" /> : <WiMoonrise size={26} className="text-blue-300 drop-shadow-md" />}
            <span className="text-xs font-bold mt-0.5 tracking-wider">{riseTimeStr || 'N/A'}</span>
          </div>
          {!isSun && astro?.moon_phase && (
            <div className="flex flex-col items-center justify-end pb-1 opacity-70">
              <span className="text-[10px] font-bold uppercase tracking-widest">{astro.moon_phase}</span>
              <span className="text-[10px] font-medium">{astro.moon_illumination}% Illumination</span>
            </div>
          )}
          <div className="flex flex-col items-center">
            {isSun ? <WiSunset size={26} className="text-orange-400 drop-shadow-md" /> : <WiMoonset size={26} className="text-indigo-400 drop-shadow-md" />}
            <span className="text-xs font-bold mt-0.5 tracking-wider">{setTimeStr || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const HighlightCard = ({ title, icon, children, className = "" }) => (
  <motion.div 
    whileHover={{ y: -4, scale: 1.01, boxShadow: '0 15px 35px rgba(0,0,0,0.2)' }}
    className={`glass-card p-5 md:p-6 relative overflow-hidden group border border-white/10 ${className}`}
  >
    <div className="glare-effect pointer-events-none opacity-40"></div>
    <div className="flex items-center gap-2 text-white/50 mb-3 group-hover:text-white/80 transition-colors">
      <span className="text-lg">{icon}</span>
      <span className="text-xs font-bold uppercase tracking-widest">{title}</span>
    </div>
    <div className="relative z-10 flex flex-col h-[calc(100%-28px)]">
      {children}
    </div>
  </motion.div>
);

const WeatherHighlights = ({ current, astro }) => {
  
  // AQI Processing
  const aqiIndex = current?.air_quality?.['us-epa-index'] || 1;
  const aqiMap = {
    1: { label: 'Good', color: '#4ade80', desc: 'Ideal air quality for outdoor activities.' },
    2: { label: 'Moderate', color: '#facc15', desc: 'Acceptable quality. Sensitive groups take care.' },
    3: { label: 'Unhealthy (SG)', color: '#fb923c', desc: 'Sensitive groups may experience health effects.' },
    4: { label: 'Unhealthy', color: '#f87171', desc: 'Everyone may begin to experience health effects.' },
    5: { label: 'Very Unhealthy', color: '#c084fc', desc: 'Health warnings of emergency conditions.' },
    6: { label: 'Hazardous', color: '#9f1239', desc: 'Health alert: everyone may experience serious effects.' },
  };
  const aqiData = aqiMap[aqiIndex] || aqiMap[1];

  // UV Processing
  const uvValue = current.uv;
  let uvColor = '#4ade80';
  let uvLabel = 'Low';
  let uvDesc = 'Safe to be outside.';
  if (uvValue > 2) { uvColor = '#facc15'; uvLabel = 'Moderate'; uvDesc = 'Seek shade during midday.'; }
  if (uvValue > 5) { uvColor = '#fb923c'; uvLabel = 'High'; uvDesc = 'Wear sun protection.'; }
  if (uvValue > 7) { uvColor = '#f87171'; uvLabel = 'Very High'; uvDesc = 'Minimize sun exposure.'; }
  if (uvValue > 10) { uvColor = '#c084fc'; uvLabel = 'Extreme'; uvDesc = 'Avoid being outside.'; }

  return (
    <div className="w-full mt-10">
      <h3 className="text-2xl font-display font-bold text-white mb-6 text-shadow-premium flex items-center gap-2">
        <span className="w-2 h-8 theme-accent-bg rounded-full inline-block theme-accent-shadow"></span>
        Today's Highlights
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        
        {/* Air Quality */}
        <HighlightCard title="Air Quality Index" icon={<MdOutlineAir />} className="lg:col-span-1">
          <div className="flex-1 flex flex-col justify-center items-center">
            <CircularProgress 
              value={aqiIndex} 
              max={6} 
              color={aqiData.color} 
              label={aqiData.label} 
              sublabel={aqiData.desc} 
            />
          </div>
        </HighlightCard>

        {/* Sunrise / Sunset */}
        <HighlightCard title="Celestial Trajectory" icon={<MdWbSunny />} className="lg:col-span-2">
          <AstroTrajectory astro={astro} isDay={current.is_day === 1} />
        </HighlightCard>

        {/* UV Index */}
        <HighlightCard title="UV Index" icon={<MdWbSunny />} className="lg:col-span-1">
          <div className="flex-1 flex flex-col justify-center items-center">
             <CircularProgress 
              value={uvValue} 
              max={12} 
              color={uvColor} 
              label={uvLabel} 
              sublabel={uvDesc} 
            />
          </div>
        </HighlightCard>

        {/* Wind */}
        <HighlightCard title="Wind" icon={<MdAir />}>
          <div className="mt-2 flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-display font-extrabold text-white text-shadow-premium">{current.wind_kph}</span>
              <span className="text-lg font-bold text-white/60">km/h</span>
            </div>
            <div className="mt-4 flex items-center gap-3 bg-black/20 p-3 rounded-2xl border border-white/10">
              <div 
                className="w-10 h-10 rounded-full bg-blue-500/30 flex items-center justify-center border border-blue-400/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                style={{ transform: `rotate(${current.wind_degree}deg)` }}
              >
                <div className="w-1 h-3 bg-blue-300 rounded-full mb-4"></div>
              </div>
              <div>
                <p className="text-sm text-white font-bold">{current.wind_dir}</p>
                <p className="text-xs text-white/60 font-medium">Direction</p>
              </div>
            </div>
          </div>
        </HighlightCard>

        {/* Humidity */}
        <HighlightCard title="Humidity" icon={<MdWaterDrop />}>
          <div className="mt-2 flex-1 flex flex-col justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-display font-extrabold text-white text-shadow-premium">{current.humidity}</span>
              <span className="text-lg font-bold text-white/60">%</span>
            </div>
            <p className="text-sm text-white/80 font-medium mt-2">
              {current.humidity > 60 ? 'High humidity may feel warmer.' : 'Comfortable humidity levels.'}
            </p>
            {/* Progress Bar */}
            <div className="w-full h-2 bg-black/30 rounded-full mt-4 overflow-hidden border border-white/10">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-400 to-cyan-300"
                initial={{ width: 0 }}
                animate={{ width: `${current.humidity}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        </HighlightCard>

        {/* Visibility */}
        <HighlightCard title="Visibility" icon={<MdVisibility />}>
           <div className="mt-2 flex-1 flex flex-col justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-display font-extrabold text-white text-shadow-premium">{current.vis_km}</span>
              <span className="text-lg font-bold text-white/60">km</span>
            </div>
            <p className="text-sm text-white/80 font-medium mt-4">
              {current.vis_km >= 10 ? "Clear view, excellent visibility." : "Reduced visibility. Drive safely."}
            </p>
          </div>
        </HighlightCard>

        {/* Pressure */}
        <HighlightCard title="Pressure" icon={<MdCompress />}>
           <div className="mt-2 flex-1 flex flex-col justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-display font-extrabold text-white text-shadow-premium">{current.pressure_mb}</span>
              <span className="text-lg font-bold text-white/60">hPa</span>
            </div>
            <p className="text-sm text-white/80 font-medium mt-4">
              {current.pressure_mb > 1013 ? "High pressure system." : "Low pressure system."}
            </p>
          </div>
        </HighlightCard>

      </div>
    </div>
  );
};

export default WeatherHighlights;
