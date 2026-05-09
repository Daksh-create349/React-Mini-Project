import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useWeather } from '../context/WeatherContext';
import { MdDeleteOutline, MdHistory, MdArrowForward } from 'react-icons/md';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};

const History = () => {
  const { recentSearches, removeHistoryItem, clearRecentSearches, fetchWeather } = useWeather();
  const navigate = useNavigate();

  const handleSelect = (query) => {
    fetchWeather(query);
    navigate('/dashboard');
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + date.toLocaleDateString();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-display font-black text-white tracking-tight drop-shadow-lg text-shadow-premium">
            Search History
          </h1>
          <p className="text-white/60 mt-2 font-medium">Your chronological timeline of atmospheric queries.</p>
        </div>
        
        {recentSearches.length > 0 && (
          <button 
            onClick={clearRecentSearches}
            className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-colors font-semibold text-sm backdrop-blur-md"
          >
            Clear History
          </button>
        )}
      </div>

      {recentSearches.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center min-h-[50vh] text-center"
        >
          <div className="glass-card p-12 max-w-lg border-white/10">
            <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
              <MdHistory className="text-4xl opacity-80 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">No history found</h2>
            <p className="text-white/50 mb-8">
              Looks like you haven't explored the atmosphere yet. Search for a city to start building your timeline.
            </p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all duration-300 backdrop-blur-md"
            >
              Explore Map
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="glass-card p-6 md:p-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-3"
          >
            {recentSearches.map((item, index) => (
              <motion.div
                key={item.id + index}
                variants={itemVariants}
                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all duration-200 group cursor-pointer"
                onClick={() => handleSelect(item.query)}
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-black/20 flex items-center justify-center border border-white/5 shadow-inner">
                    <img src={item.icon} alt="Weather icon" className="w-8 h-8 opacity-90 drop-shadow-md group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors tracking-wide">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-white/50 mt-1 font-medium">
                      <span>{item.country}</span>
                      <span className="w-1 h-1 rounded-full bg-white/20"></span>
                      <span>{formatTime(item.timestamp)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <div className="text-xl font-bold text-white drop-shadow-sm">{Math.round(item.temp_c)}°</div>
                    <div className="text-xs text-white/60 capitalize">{item.conditionText}</div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeHistoryItem(item.id);
                    }}
                    className="p-2.5 rounded-full hover:bg-red-500/20 text-white/40 hover:text-red-400 transition-colors"
                  >
                    <MdDeleteOutline size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default History;
