import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useWeather } from '../context/WeatherContext';
import { MdDeleteOutline, MdLocationOn } from 'react-icons/md';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};

const Favorites = () => {
  const { favorites, removeFavorite, fetchWeather } = useWeather();
  const navigate = useNavigate();

  const handleSelect = (query) => {
    fetchWeather(query);
    navigate('/dashboard');
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-display font-black text-white tracking-tight drop-shadow-lg text-shadow-premium">
            Saved Locations
          </h1>
          <p className="text-white/60 mt-2 font-medium">Quick access to your favorite atmospheric conditions.</p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center min-h-[50vh] text-center"
        >
          <div className="glass-card p-12 max-w-lg border-white/10">
            <div className="w-20 h-20 bg-pink-500/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(236,72,153,0.1)]">
              <span className="text-4xl opacity-80 text-pink-400">🤍</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">No favorites yet</h2>
            <p className="text-white/50 mb-8">
              Search for a location and tap the heart icon on the dashboard to save it here for quick access.
            </p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all duration-300 backdrop-blur-md"
            >
              Go to Dashboard
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {favorites.map((fav) => (
            <motion.div
              key={fav.id}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass-card p-6 relative group cursor-pointer border border-white/10 hover:border-white/30 transition-all duration-300"
              onClick={() => handleSelect(fav.query)}
            >
              <div className="absolute top-4 right-4 z-20">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFavorite(fav.id);
                  }}
                  className="p-2 rounded-full bg-black/20 text-white/50 hover:text-red-400 hover:bg-red-500/20 transition-colors backdrop-blur-md"
                  title="Remove from favorites"
                >
                  <MdDeleteOutline size={20} />
                </button>
              </div>

              <div className="flex items-start justify-between">
                <div className="pr-12">
                  <h3 className="text-2xl font-bold text-white tracking-tight">{fav.name}</h3>
                  <div className="flex items-center gap-1 mt-1 text-white/60 text-sm font-medium">
                    <MdLocationOn />
                    <span>{fav.region ? `${fav.region}, ` : ''}{fav.country}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-end justify-between">
                <div>
                  <div className="text-5xl font-display font-light text-white tracking-tighter drop-shadow-md">
                    {Math.round(fav.temp_c)}°
                  </div>
                  <div className="text-white/80 font-medium mt-1 capitalize">
                    {fav.conditionText}
                  </div>
                </div>
                <div className="w-20 h-20 animate-float opacity-90 drop-shadow-lg">
                  <img src={fav.icon} alt={fav.conditionText} className="w-full h-full object-contain filter drop-shadow-md" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Favorites;
