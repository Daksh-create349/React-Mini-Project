import React from 'react';
import { motion } from 'framer-motion';
import { WiDayCloudy, WiStrongWind, WiHumidity, WiBarometer } from 'react-icons/wi';
import { MdSearch } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative min-h-screen text-white overflow-hidden font-sans"
      style={{ background: 'linear-gradient(160deg, #0f2f6e 0%, #1d4ed8 40%, #0369a1 75%, #0c4a6e 100%)' }}
    >
      {/* Multi-color Background Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top-left warm yellow/gold glow */}
        <div className="absolute top-[-150px] left-[-100px] w-[500px] h-[500px] rounded-full bg-amber-400/20 blur-[130px]" />
        {/* Right cyan/teal glow */}
        <div className="absolute top-[10%] right-[-150px] w-[450px] h-[450px] rounded-full bg-cyan-400/20 blur-[120px]" />
        {/* Bottom-left indigo glow */}
        <div className="absolute bottom-[-100px] left-[10%] w-[400px] h-[400px] rounded-full bg-indigo-500/25 blur-[100px]" />
        {/* Center soft white */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-white/5 blur-[80px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 w-full px-8 py-8 flex justify-between items-center max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-400/30 border border-amber-300/40 flex items-center justify-center backdrop-blur-sm">
            <WiDayCloudy className="text-3xl text-amber-200" />
          </div>
          <span className="font-bold text-3xl tracking-tight">Atmos.</span>
        </motion.div>
      </nav>

      {/* Hero — Centered */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-4 pb-20 min-h-[calc(100vh-104px)]">

        {/* Live Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cyan-500/20 border border-cyan-400/30 backdrop-blur-md mb-12"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
          </span>
          <span className="text-sm font-semibold text-cyan-100">Live weather data</span>
        </motion.div>

        {/* Big Weather Icon with golden glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8, type: 'spring', stiffness: 80 }}
          className="relative mb-12"
        >
          {/* Outer golden glow ring */}
          <div className="absolute inset-[-20px] rounded-full bg-amber-400/20 blur-2xl" />
          <div className="w-52 h-52 rounded-full bg-gradient-to-br from-amber-400/20 to-blue-600/20 border border-amber-300/30 flex items-center justify-center backdrop-blur-sm shadow-2xl">
            <WiDayCloudy className="text-[9rem] text-amber-200 drop-shadow-lg" />
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-amber-300/20 scale-125 animate-pulse" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-6xl md:text-8xl font-black tracking-tight mb-6 leading-tight"
        >
          Weather,
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-amber-300">
            made simple.
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-xl text-white/70 max-w-lg mb-12 leading-relaxed"
        >
          Real-time forecasts, severe alerts, and a 7-day outlook — all in one clean dashboard.
        </motion.p>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          onClick={() => navigate('/dashboard')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-3 px-10 py-5 bg-white text-blue-700 font-bold rounded-full text-xl shadow-2xl shadow-blue-900/40 hover:bg-cyan-50 transition-all duration-300 mb-20"
        >
          <MdSearch size={24} />
          Search your city
        </motion.button>

        {/* Stat Cards Row — each with a different accent color */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid grid-cols-3 gap-6 max-w-2xl w-full"
        >
          {[
            { icon: <WiStrongWind className="text-4xl" />, label: 'Wind', value: '18 km/h', color: 'from-cyan-500/30 to-cyan-500/5', border: 'border-cyan-400/30', iconColor: 'text-cyan-300' },
            { icon: <WiHumidity className="text-4xl" />, label: 'Humidity', value: '64%', color: 'from-blue-500/30 to-blue-500/5', border: 'border-blue-400/30', iconColor: 'text-blue-200' },
            { icon: <WiBarometer className="text-4xl" />, label: 'Pressure', value: '1013 hPa', color: 'from-amber-500/30 to-amber-500/5', border: 'border-amber-400/30', iconColor: 'text-amber-300' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
              className={`bg-gradient-to-br ${stat.color} border ${stat.border} backdrop-blur-sm rounded-3xl p-6 flex flex-col items-center gap-2`}
            >
              <div className={stat.iconColor}>{stat.icon}</div>
              <p className="text-white font-bold text-xl">{stat.value}</p>
              <p className="text-white/50 text-xs uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default Landing;
