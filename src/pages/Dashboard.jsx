import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeather } from '../context/WeatherContext';
import ForecastCards from '../components/ForecastCards';
import HourlyForecastChart from '../components/HourlyForecastChart';
import WeatherHighlights from '../components/WeatherHighlights';
import { HistoricalLogs } from '../components/HistoricalLogs';
import AlertBanner from '../components/AlertBanner';
import { HeroWeatherIcon } from '../components/HeroWeatherIcon';
import { DashboardSkeleton } from '../components/SkeletonLoader';
import { MdWbSunny, MdFavorite, MdFavoriteBorder, MdErrorOutline, MdWifiOff } from 'react-icons/md';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  }
};

const Dashboard = () => {
  const { weatherData, loading, error, toggleFavorite, isCurrentFavorite } = useWeather();

  if (loading) return <DashboardSkeleton />;

  if (error) {
    const isOffline = !navigator.onLine;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[65vh]"
      >
        <div className="glass-card p-12 text-center max-w-lg depth-3">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            isOffline ? 'bg-slate-500/20' : 'bg-red-500/15'
          }`}>
            {isOffline
              ? <MdWifiOff className="text-4xl text-slate-400 offline-pulse" />
              : <MdErrorOutline className="text-4xl text-red-400" />
            }
          </div>
          <p className="text-2xl font-display font-extrabold text-white mb-3">
            {isOffline ? 'No Connection' : 'Something went wrong'}
          </p>
          <p className="text-white/70 font-medium mb-6 leading-relaxed">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-glow px-6 py-3 rounded-2xl bg-white/10 border border-white/20 text-white font-bold text-sm hover:bg-white/20 transition-all"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  if (!weatherData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="glass-card p-12 max-w-2xl relative overflow-hidden group"
        >
          <div className="glare-effect"></div>
          <MdWbSunny className="text-[100px] text-yellow-300 mx-auto mb-8 animate-pulse drop-shadow-[0_0_40px_rgba(253,224,71,0.6)]" />
          <h2 className="text-4xl font-display font-extrabold mb-4 text-white tracking-tight text-shadow-premium">Enter the Atmosphere</h2>
          <p className="text-white/70 text-lg font-medium leading-relaxed max-w-md mx-auto">
            Search for any city to see its weather.
          </p>
        </motion.div>
      </div>
    );
  }

  const { location, current, forecast, alerts } = weatherData;
  const forecastDays = forecast?.forecastday || [];
  const hourlyData = forecastDays.length > 0 ? forecastDays[0].hour.concat(forecastDays[1]?.hour || []) : [];
  const astro = forecastDays.length > 0 ? forecastDays[0].astro : null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-[1400px] mx-auto space-y-8"
    >
      {/* Animated Alert Banner (only renders if alerts exist) */}
      <AlertBanner alerts={alerts?.alert} />

      {/* Massive Hero Section */}
      <motion.div 
        variants={itemVariants}
        className="glass-card w-full min-h-[400px] p-8 md:p-14 flex flex-col md:flex-row items-center justify-between relative group"
      >
        <div className="glare-effect"></div>
        <div className="flex-1 z-10 text-center md:text-left mb-8 md:mb-0">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4"
          >
            <h1 className="text-5xl md:text-[80px] font-display font-black text-white tracking-tighter leading-none drop-shadow-lg text-shadow-premium">
              {location.name}
            </h1>
            <span className="px-5 py-2 bg-black/20 backdrop-blur-md rounded-full text-sm font-extrabold text-white shadow-[0_4px_10px_rgba(0,0,0,0.2)] border border-white/20 tracking-widest uppercase">
              {location.country}
            </span>
            <button 
              onClick={toggleFavorite}
              className={`ml-2 p-3 rounded-full backdrop-blur-md border shadow-lg transition-all duration-300 ${
                isCurrentFavorite 
                  ? 'bg-pink-500/20 border-pink-500/50 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.3)]' 
                  : 'bg-black/20 border-white/20 text-white/50 hover:text-white hover:bg-white/10'
              }`}
            >
              {isCurrentFavorite ? <MdFavorite size={24} /> : <MdFavoriteBorder size={24} />}
            </button>
          </motion.div>
          <p className="text-xl md:text-2xl text-white/80 font-semibold tracking-wide">{location.region}</p>

          <div className="mt-12 flex items-center justify-center md:justify-start gap-8">
            <h2 className="text-[120px] md:text-[200px] font-display font-light leading-none tracking-tighter text-white text-glow-intense drop-shadow-2xl">
              {Math.round(current.temp_c)}°
            </h2>
            <div className="flex flex-col items-start gap-2">
              <span className="text-3xl md:text-4xl font-extrabold text-white capitalize tracking-tight drop-shadow-md text-shadow-premium">
                {current.condition.text}
              </span>
              <span className="text-xl font-bold text-white/90 bg-black/20 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/20 shadow-lg">
                Feels like {Math.round(current.feelslike_c)}°
              </span>
            </div>
          </div>
        </div>

        {/* Animated Weather Icon from API */}
        <motion.div 
          initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', delay: 0.4, bounce: 0.5 }}
          className="relative z-10 w-64 h-64 md:w-[350px] md:h-[350px] flex items-center justify-center"
        >
          {/* Intense Drop Shadow on the Image */}
          <HeroWeatherIcon 
            conditionText={current.condition.text} 
            isDay={current.is_day === 1} 
          />
        </motion.div>
      </motion.div>

      {/* Advanced Weather Highlights */}
      <WeatherHighlights current={current} astro={astro} />

      {/* Forecasting System */}
      <HourlyForecastChart hourlyData={hourlyData} />
      <HistoricalLogs history={weatherData.history} />
      <ForecastCards forecastDays={forecastDays} />
    </motion.div>
  );
};

export default Dashboard;
