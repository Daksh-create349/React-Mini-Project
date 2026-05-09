import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeather } from '../context/WeatherContext';
import { weatherApi } from '../services/weatherApi';
import WarningModal from '../components/WarningModal';
import { generateConditionAlerts } from '../utils/generateConditionAlerts';
import {
  MdNotificationsActive, MdNotificationsOff, MdWarning,
  MdChevronRight, MdAccessTime, MdPublic, MdSpeed,
  MdWaterDrop, MdWbSunny, MdAir, MdVisibility,
  MdOutlineAcUnit, MdLocalFireDepartment, MdFlood
} from 'react-icons/md';
import { WiThunderstorm, WiSnow, WiRain, WiFog } from 'react-icons/wi';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { y: 24, opacity: 0, scale: 0.97 },
  visible: { y: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 120, damping: 16 } }
};

const GLOBAL_HOTSPOTS = ['Houston', 'Miami', 'Tokyo', 'London', 'Sydney', 'Mumbai', 'New York', 'Chicago', 'Dubai', 'Singapore'];

// Map event category -> icon & gradient
const getCategoryMeta = (category = '', severity = '') => {
  const cat = category.toLowerCase();
  const sev = severity.toLowerCase();

  const topColor = sev === 'extreme' ? 'from-red-600 to-orange-500'
    : sev === 'severe' ? 'from-orange-500 to-amber-400'
    : 'from-yellow-500 to-lime-400';

  const glowColor = sev === 'extreme' ? 'shadow-[inset_0_0_40px_rgba(239,68,68,0.1)]'
    : sev === 'severe' ? 'shadow-[inset_0_0_40px_rgba(249,115,22,0.1)]'
    : 'shadow-[inset_0_0_40px_rgba(234,179,8,0.07)]';

  if (cat.includes('heat') || cat.includes('fire')) return { Icon: MdLocalFireDepartment, iconColor: 'text-orange-400', topColor, glowColor };
  if (cat.includes('wind')) return { Icon: MdSpeed, iconColor: 'text-blue-300', topColor, glowColor };
  if (cat.includes('flood')) return { Icon: MdFlood, iconColor: 'text-cyan-400', topColor, glowColor };
  if (cat.includes('thunder') || cat.includes('storm')) return { Icon: WiThunderstorm, iconColor: 'text-purple-400', topColor, glowColor };
  if (cat.includes('snow') || cat.includes('winter') || cat.includes('cold') || cat.includes('ice')) return { Icon: WiSnow, iconColor: 'text-sky-200', topColor, glowColor };
  if (cat.includes('rain')) return { Icon: WiRain, iconColor: 'text-blue-400', topColor, glowColor };
  if (cat.includes('fog')) return { Icon: WiFog, iconColor: 'text-slate-300', topColor, glowColor };
  if (cat.includes('uv')) return { Icon: MdWbSunny, iconColor: 'text-yellow-400', topColor, glowColor };
  if (cat.includes('air') || cat.includes('quality')) return { Icon: MdAir, iconColor: 'text-green-400', topColor, glowColor };
  if (cat.includes('humid')) return { Icon: MdWaterDrop, iconColor: 'text-teal-400', topColor, glowColor };
  return { Icon: MdNotificationsActive, iconColor: 'text-white/80', topColor, glowColor };
};

const getSeverityColor = (severity) => {
  switch (severity?.toLowerCase()) {
    case 'extreme': return 'bg-red-500/20 text-red-400 border-red-500/40';
    case 'severe': return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
    case 'moderate': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    default: return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
  }
};

const AlertCard = ({ alert, index, isGlobal = false, onClick }) => {
  const { Icon, iconColor, topColor, glowColor } = getCategoryMeta(alert.category, alert.severity);
  
  // Bento sizing logic: first card is large hero, next 2 are medium, rest are small
  let span = 'col-span-1';
  if (index === 0) span = 'col-span-1 md:col-span-2 xl:col-span-2 row-span-1 md:row-span-2';
  else if (index === 1 || index === 2) span = 'col-span-1 row-span-1';

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.025, y: -4 }}
      onClick={onClick}
      className={`glass-card relative cursor-pointer overflow-hidden group border border-white/10 hover:border-white/25 transition-all duration-300 flex flex-col ${span} ${glowColor}`}
    >
      {/* Top accent gradient bar */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${topColor}`} />
      {/* Hover shimmer */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="flex flex-col h-full p-5 md:p-6">
        {/* Header row */}
        <div className="flex justify-between items-start mb-5">
          <div className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors ${iconColor}`}>
            <Icon size={24} />
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest border ${getSeverityColor(alert.severity)}`}>
              {alert.severity || 'Advisory'}
            </span>
            {alert.isGenerated && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white/5 text-white/40 border border-white/10">
                Live Condition
              </span>
            )}
          </div>
        </div>

        {/* Category + Headline */}
        <div className="flex-1 mb-4">
          <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-2">
            {alert.category || 'Weather Event'}
          </p>
          <h3 className={`font-display font-bold text-white leading-tight line-clamp-4 group-hover:text-blue-100 transition-colors ${index === 0 ? 'text-2xl md:text-3xl' : 'text-lg'}`}>
            {alert.headline || alert.event}
          </h3>

          {isGlobal && alert.locationName && (
            <div className="mt-3 inline-flex items-center gap-1.5 bg-blue-500/10 px-3 py-1 rounded-full text-xs font-bold text-blue-200 border border-blue-500/20">
              <MdPublic size={12} /> {alert.locationName}, {alert.country}
            </div>
          )}

          {/* Show desc snippet on large card */}
          {index === 0 && alert.desc && (
            <p className="mt-4 text-white/60 text-sm font-medium line-clamp-3 leading-relaxed">
              {alert.desc}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
          <div className="flex flex-col gap-1 text-[11px] text-white/50 font-medium">
            <div className="flex items-center gap-1.5">
              <MdAccessTime size={12} />
              <span>{new Date(alert.effective).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            {alert.expires && (
              <div className="flex items-center gap-1.5 text-red-300/70">
                <MdWarning size={12} />
                <span>Exp. {new Date(alert.expires).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            )}
          </div>
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <MdChevronRight className="text-white/60 group-hover:text-white" size={18} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Summary strip ───────────────────────────────────────────────────────────
const AlertSummaryStrip = ({ alerts }) => {
  const counts = { Extreme: 0, Severe: 0, Moderate: 0, Advisory: 0 };
  alerts.forEach(a => {
    const sev = a.severity?.toLowerCase();
    if (sev === 'extreme') counts.Extreme++;
    else if (sev === 'severe') counts.Severe++;
    else if (sev === 'moderate') counts.Moderate++;
    else counts.Advisory++;
  });

  const items = [
    { label: 'Extreme', count: counts.Extreme, color: 'bg-red-500/20 text-red-400 border-red-500/30' },
    { label: 'Severe', count: counts.Severe, color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    { label: 'Moderate', count: counts.Moderate, color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    { label: 'Advisory', count: counts.Advisory, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {items.map(({ label, count, color }) => (
        <div key={label} className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold ${color}`}>
          <span>{count}</span>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const Alerts = () => {
  const { weatherData } = useWeather();
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [globalAlerts, setGlobalAlerts] = useState([]);
  const [loadingGlobal, setLoadingGlobal] = useState(true);

  // Official API alerts for current searched location
  const officialLocalAlerts = weatherData?.alerts?.alert || [];

  // Smart condition-based alerts derived from live weather readings
  const conditionAlerts = useMemo(
    () => (weatherData ? generateConditionAlerts(weatherData) : []),
    [weatherData]
  );

  // Merge: official alerts first (they're most authoritative), then condition-based
  const localAlerts = [...officialLocalAlerts, ...conditionAlerts];

  // Global alerts from hotspot cities (official API + condition-based merged)
  useEffect(() => {
    const fetch = async () => {
      setLoadingGlobal(true);
      try {
        const results = await Promise.allSettled(
          GLOBAL_HOTSPOTS.map(city => weatherApi.getWeather(city))
        );
        const agg = [];
        results.forEach(r => {
          if (r.status !== 'fulfilled') return;
          const data = r.value;
          // Official alerts
          (data?.alerts?.alert || []).forEach(a =>
            agg.push({ ...a, locationName: data.location.name, country: data.location.country })
          );
          // Condition-based alerts
          generateConditionAlerts(data).forEach(a =>
            agg.push({ ...a })
          );
        });
        setGlobalAlerts(agg);
      } catch (e) {
        console.error('Global alerts fetch failed:', e);
      } finally {
        setLoadingGlobal(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-14">

      {/* ── LOCAL SECTION ── */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-display font-black text-white tracking-tight drop-shadow-lg text-shadow-premium">
              Local Alerts
            </h1>
            <p className="text-white/60 mt-1.5 font-medium">
              Safety advisories for <span className="text-white font-bold">{weatherData?.location?.name || 'your searched location'}</span>
            </p>
          </div>
          {localAlerts.length > 0 && (
            <div className="text-white/50 text-sm font-bold bg-white/5 px-4 py-2 rounded-full border border-white/10">
              {localAlerts.length} Active {localAlerts.length === 1 ? 'Alert' : 'Alerts'}
            </div>
          )}
        </div>

        {!weatherData ? (
          <div className="glass-card p-12 text-center border-white/10 max-w-2xl mx-auto">
            <p className="text-white/50 font-medium">Search for a city to see local weather advisories.</p>
          </div>
        ) : localAlerts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-14 text-center border-white/10 max-w-2xl mx-auto"
          >
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(34,197,94,0.1)]">
              <MdNotificationsOff className="text-4xl text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">All Clear</h2>
            <p className="text-white/60 font-medium max-w-md mx-auto">
              No warnings or advisories are active for <span className="text-white">{weatherData?.location?.name}</span>. Conditions are within normal safe parameters.
            </p>
          </motion.div>
        ) : (
          <>
            <AlertSummaryStrip alerts={localAlerts} />
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 auto-rows-auto"
            >
              {localAlerts.map((alert, i) => (
                <AlertCard key={i} alert={alert} index={i} isGlobal={false} onClick={() => setSelectedAlert(alert)} />
              ))}
            </motion.div>
          </>
        )}
      </section>

      <div className="w-full h-px bg-white/10" />

      {/* ── GLOBAL WATCHLIST SECTION ── */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
              <MdPublic className="text-blue-400" /> Global Watchlist
            </h2>
            <p className="text-white/60 mt-1.5 font-medium">
              Live safety advisories monitored across {GLOBAL_HOTSPOTS.length} global cities.
            </p>
          </div>
          {loadingGlobal ? (
            <div className="flex items-center gap-2 text-white/50 text-sm font-bold bg-white/5 px-4 py-2 rounded-full border border-white/10 animate-pulse">
              <div className="w-3.5 h-3.5 border-2 border-white/50 border-t-transparent rounded-full animate-spin" />
              Scanning {GLOBAL_HOTSPOTS.length} Cities…
            </div>
          ) : (
            <div className="text-white/50 text-sm font-bold bg-white/5 px-4 py-2 rounded-full border border-white/10">
              {globalAlerts.length} Advisories Found
            </div>
          )}
        </div>

        {!loadingGlobal && globalAlerts.length === 0 ? (
          <div className="glass-card p-12 text-center border-white/10 max-w-2xl mx-auto">
            <p className="text-white/60 font-medium">All monitored global cities are currently reporting normal conditions.</p>
          </div>
        ) : (
          <>
            {!loadingGlobal && <AlertSummaryStrip alerts={globalAlerts} />}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 auto-rows-auto"
            >
              {globalAlerts.map((alert, i) => (
                <AlertCard key={i} alert={alert} index={i} isGlobal={true} onClick={() => setSelectedAlert(alert)} />
              ))}
            </motion.div>
          </>
        )}
      </section>

      {/* Warning Modal */}
      <AnimatePresence>
        {selectedAlert && (
          <WarningModal
            alert={selectedAlert}
            isOpen={!!selectedAlert}
            onClose={() => setSelectedAlert(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Alerts;
