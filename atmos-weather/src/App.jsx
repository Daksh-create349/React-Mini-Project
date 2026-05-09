import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import DashboardLayout from './layouts/DashboardLayout';

// Lazy-loaded pages (code splitting)
const Landing    = lazy(() => import('./pages/Landing'));
const Dashboard  = lazy(() => import('./pages/Dashboard'));
const Favorites  = lazy(() => import('./pages/Favorites'));
const History    = lazy(() => import('./pages/History'));
const Alerts     = lazy(() => import('./pages/Alerts'));

// Page transition wrapper
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 14, scale: 0.99 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -8, scale: 0.99 }}
    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    className="w-full h-full"
  >
    {children}
  </motion.div>
);

// Minimal inline page-level skeleton while lazy chunk loads
const PageSkeleton = () => (
  <div className="w-full h-full min-h-[60vh] flex flex-col gap-6 p-4 md:p-8">
    <div className="skeleton h-10 w-56 rounded-2xl" />
    <div className="skeleton h-6 w-80 rounded-xl" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton h-40 rounded-[2rem]" />)}
    </div>
  </div>
);

// Animated routes with location key for transitions
const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageSkeleton />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<PageTransition><Dashboard /></PageTransition>} />
            <Route path="favorites" element={<PageTransition><Favorites /></PageTransition>} />
            <Route path="alerts"    element={<PageTransition><Alerts /></PageTransition>} />
            <Route path="history"   element={<PageTransition><History /></PageTransition>} />
            <Route path="settings"  element={
              <PageTransition>
                <div className="p-8 text-white/60 font-medium">Settings — coming soon</div>
              </PageTransition>
            } />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

const App = () => (
  <BrowserRouter>
    <AnimatedRoutes />
  </BrowserRouter>
);

export default App;
