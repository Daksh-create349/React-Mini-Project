import React from 'react';
import { motion } from 'framer-motion';
import { WiDayCloudy } from 'react-icons/wi';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-[#e0e5ec] text-slate-800 overflow-hidden font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Soft Animated Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-white rounded-full mix-blend-overlay filter blur-[80px] animate-blob opacity-80"></div>
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full mix-blend-multiply filter blur-[100px] animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-sky-200 rounded-full mix-blend-multiply filter blur-[120px] animate-blob" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Navbar Placeholder */}
      <nav className="relative z-10 w-full px-8 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-2"
        >
          <WiDayCloudy className="text-4xl text-blue-500 drop-shadow-sm" />
          <span className="font-display font-bold text-xl tracking-wide text-slate-800">Atmos</span>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <button onClick={() => navigate('/dashboard')} className="text-sm font-semibold text-slate-500 hover:text-blue-500 transition-colors duration-300">
            Sign In
          </button>
        </motion.div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-100px)] px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/60 shadow-skeuo-card mb-8 border border-white/60"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-sm font-bold text-slate-500">Next-gen forecasting engine is live</span>
          </motion.div>

          <h1 className="text-6xl md:text-[80px] font-display font-extrabold tracking-tight mb-6 leading-tight text-slate-800">
            Predict the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600 drop-shadow-sm">
              Unpredictable.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto font-medium">
            Experience weather forecasting reimagined. Atmos delivers hyper-local accuracy through a stunning, skeuomorphic interface inspired by physical realism.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <motion.button 
              onClick={() => navigate('/dashboard')}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-8 py-4 bg-white text-blue-500 font-bold rounded-2xl group w-full sm:w-auto transition-all duration-300 shadow-skeuo-button active:shadow-inner"
            >
              Get Started
            </motion.button>
            
            <motion.button 
              onClick={() => navigate('/dashboard')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 font-bold text-slate-500 hover:text-blue-500 transition-colors duration-300 w-full sm:w-auto"
            >
              Explore Dashboard →
            </motion.button>
          </div>
        </motion.div>

        {/* Floating Weather Widget Demo */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-20 w-full max-w-md animate-float"
        >
          <div className="skeuo-card p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-3xl font-display font-bold text-slate-800">Cupertino</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">Current Location</p>
              </div>
              <WiDayCloudy className="text-6xl text-yellow-500 drop-shadow-md" />
            </div>
            <div className="flex justify-between items-end mt-4">
              <div className="text-7xl font-light tracking-tighter text-slate-800">
                72°
              </div>
              <div className="text-right pb-2">
                <p className="text-lg font-medium text-slate-500">Partly Cloudy</p>
                <p className="text-sm font-bold text-slate-500 mt-1">H: 78° <span className="mx-1 opacity-50">|</span> L: 65°</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Landing;
