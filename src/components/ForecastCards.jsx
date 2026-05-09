import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdWaterDrop, MdAir } from 'react-icons/md';

const ForecastCards = ({ forecastDays }) => {
  const [expandedId, setExpandedId] = useState(null);

  if (!forecastDays || forecastDays.length === 0) return null;

  return (
    <div className="w-full mt-10">
      <h3 className="text-2xl font-display font-bold text-white mb-6 text-shadow-premium flex items-center gap-2">
        <span className="w-2 h-8 theme-accent-bg rounded-full inline-block theme-accent-shadow"></span>
        7-Day Forecast
      </h3>
      
      {/* Horizontal Scroll Container */}
      <div className="flex gap-4 overflow-x-auto pb-6 pt-2 custom-scrollbar snap-x snap-mandatory px-1">
        {forecastDays.map((day, index) => {
          const dateObj = new Date(day.date);
          const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(dateObj);
          const isExpanded = expandedId === index;

          return (
            <motion.div
              layout
              key={day.date}
              onClick={() => setExpandedId(isExpanded ? null : index)}
              className={`snap-center shrink-0 cursor-pointer glass-card relative group transition-all duration-500 overflow-hidden ${
                isExpanded ? 'w-64 p-6' : 'w-36 p-5'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, type: 'spring', bounce: 0.4 }}
              whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.2)' }}
            >
              <div className="glare-effect pointer-events-none"></div>
              
              <motion.div layout className="flex flex-col items-center justify-center text-center h-full">
                <motion.h4 layout className="text-lg font-bold text-white/90 uppercase tracking-widest">
                  {index === 0 ? 'Today' : dayName}
                </motion.h4>

                <motion.img 
                  layout
                  src={day.day.condition.icon} 
                  alt={day.day.condition.text}
                  className={`object-contain filter drop-shadow-lg my-2 ${isExpanded ? 'w-24 h-24' : 'w-16 h-16'}`}
                />

                <motion.div layout className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-extrabold text-white text-shadow-premium">
                    {Math.round(day.day.maxtemp_c)}°
                  </span>
                  <span className="text-sm font-bold text-white/50">
                    {Math.round(day.day.mintemp_c)}°
                  </span>
                </motion.div>

                {/* Expandable Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="w-full border-t border-white/20 pt-4 flex flex-col gap-3"
                    >
                      <p className="text-xs font-semibold text-white/80 capitalize">
                        {day.day.condition.text}
                      </p>
                      
                      <div className="flex items-center justify-between bg-black/20 rounded-xl p-2 px-3 border border-white/10">
                        <div className="flex items-center gap-1.5 text-blue-300">
                          <MdWaterDrop />
                          <span className="text-xs font-bold text-white">{day.day.avghumidity}%</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-cyan-300">
                          <MdAir />
                          <span className="text-xs font-bold text-white">{day.day.maxwind_kph} km/h</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ForecastCards;
