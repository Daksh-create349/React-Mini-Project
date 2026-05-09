import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdWarning, MdClose, MdChevronRight } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const AlertBanner = ({ alerts }) => {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  if (!alerts || alerts.length === 0) return null;

  // Get the most severe alert to display in the banner
  const topAlert = alerts[0];

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'extreme': return 'from-red-600 to-red-900 border-red-500 text-red-100';
      case 'severe': return 'from-orange-500 to-red-600 border-orange-400 text-orange-50';
      case 'moderate': return 'from-yellow-500 to-orange-500 border-yellow-400 text-yellow-50';
      default: return 'from-blue-600 to-indigo-800 border-blue-400 text-blue-50';
    }
  };

  const colors = getSeverityColor(topAlert.severity);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="w-full mb-8 relative z-40"
        >
          <div className={`relative overflow-hidden rounded-2xl border bg-gradient-to-r ${colors} shadow-[0_10px_30px_rgba(220,38,38,0.3)]`}>
            {/* Animated pulsing glow background */}
            <motion.div 
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-white/10 mix-blend-overlay"
            />
            
            <div className="p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
              <div className="flex items-start md:items-center gap-4 flex-1">
                <motion.div 
                  animate={{ rotate: [-10, 10, -10], scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                  className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0 shadow-inner backdrop-blur-md"
                >
                  <MdWarning className="text-3xl drop-shadow-md" />
                </motion.div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/30 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                      {topAlert.severity || 'Alert'}
                    </span>
                    <span className="text-sm opacity-80 font-medium">
                      {topAlert.event}
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold leading-tight drop-shadow-sm line-clamp-2 md:line-clamp-1">
                    {topAlert.headline}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end mt-2 md:mt-0">
                <button 
                  onClick={() => navigate('/dashboard/alerts')}
                  className="flex items-center gap-1 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-bold text-sm transition-all duration-300 backdrop-blur-md border border-white/10"
                >
                  View Details <MdChevronRight size={18} />
                </button>
                <button 
                  onClick={() => setIsVisible(false)}
                  className="p-2 rounded-xl bg-black/10 hover:bg-black/20 transition-all duration-300 backdrop-blur-md"
                >
                  <MdClose size={20} />
                </button>
              </div>
            </div>
            
            {/* Progress bar at bottom */}
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 10, ease: "linear" }}
              onAnimationComplete={() => setIsVisible(false)}
              className="absolute bottom-0 left-0 h-1 bg-white/40"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertBanner;
