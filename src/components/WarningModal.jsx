import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdWarning, MdSecurity, MdAccessTime, MdInfoOutline } from 'react-icons/md';

const WarningModal = ({ alert, isOpen, onClose }) => {
  if (!alert) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
          />
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-[#0f172a] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col pointer-events-auto overflow-hidden shadow-2xl relative"
            >
              {/* Header with glow */}
              <div className="relative p-6 border-b border-white/5 bg-gradient-to-br from-red-900/40 to-transparent">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500" />
                <button 
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
                >
                  <MdClose size={24} />
                </button>
                
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                    <MdWarning className="text-red-400 text-2xl animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold uppercase tracking-wider">
                        {alert.severity || 'Alert'}
                      </span>
                      <span className="text-white/50 text-sm font-medium">{alert.category || 'Meteorological Event'}</span>
                    </div>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white leading-tight pr-12">{alert.headline || alert.event}</h2>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                
                {/* Timestamps */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MdAccessTime className="text-blue-400" size={18} />
                    <span className="text-white/60">Issued: <span className="text-white font-medium">{new Date(alert.effective).toLocaleString()}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MdAccessTime className="text-orange-400" size={18} />
                    <span className="text-white/60">Expires: <span className="text-white font-medium">{new Date(alert.expires).toLocaleString()}</span></span>
                  </div>
                </div>

                {/* Description */}
                {alert.desc && (
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3 text-white">
                      <MdInfoOutline className="text-blue-400" size={20} />
                      <h3 className="font-bold text-lg">Alert Description</h3>
                    </div>
                    <p className="text-white/70 leading-relaxed text-sm whitespace-pre-wrap">
                      {alert.desc}
                    </p>
                  </div>
                )}

                {/* Safety Recommendations */}
                {alert.instruction && (
                  <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3 text-red-400">
                      <MdSecurity size={20} />
                      <h3 className="font-bold text-lg">Safety Recommendations</h3>
                    </div>
                    <p className="text-red-100/80 leading-relaxed text-sm whitespace-pre-wrap font-medium">
                      {alert.instruction}
                    </p>
                  </div>
                )}
                
                <div className="text-xs text-white/40 pt-4 text-center">
                  Source: {alert.msgtype} • Certainty: {alert.certainty}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WarningModal;
