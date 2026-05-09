import React from 'react';
import { motion } from 'framer-motion';

const S = ({ className }) => <div className={`skeleton ${className}`} />;

export const DashboardSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="w-full max-w-[1400px] mx-auto space-y-8"
  >
    {/* Hero skeleton */}
    <div className="glass-card p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
      <div className="flex-1 space-y-4">
        <S className="h-6 w-40 rounded-xl" />
        <S className="h-20 w-64 rounded-2xl" />
        <S className="h-5 w-48 rounded-lg" />
        <div className="flex gap-3 mt-4">
          <S className="h-10 w-24 rounded-full" />
          <S className="h-10 w-24 rounded-full" />
        </div>
      </div>
      <S className="w-40 h-40 rounded-full shrink-0" />
    </div>

    {/* Forecast row skeleton */}
    <div>
      <S className="h-7 w-40 rounded-xl mb-5" />
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="glass-card p-4 flex flex-col items-center gap-3">
            <S className="h-4 w-12 rounded-lg" />
            <S className="h-10 w-10 rounded-full" />
            <S className="h-5 w-14 rounded-lg" />
          </div>
        ))}
      </div>
    </div>

    {/* Chart skeleton */}
    <div className="glass-card p-6">
      <S className="h-6 w-48 rounded-xl mb-6" />
      <S className="h-48 w-full rounded-2xl" />
    </div>

    {/* Highlights skeleton */}
    <div>
      <S className="h-7 w-48 rounded-xl mb-5" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card p-6 space-y-4">
            <S className="h-4 w-24 rounded-lg" />
            <S className="h-16 w-full rounded-xl" />
            <S className="h-4 w-32 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

export const AlertsSkeleton = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-[1400px] mx-auto space-y-6">
    <S className="h-10 w-48 rounded-2xl" />
    <S className="h-5 w-72 rounded-xl" />
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="glass-card p-6 space-y-4">
          <div className="flex justify-between">
            <S className="h-12 w-12 rounded-2xl" />
            <S className="h-6 w-20 rounded-full" />
          </div>
          <S className="h-4 w-20 rounded-lg" />
          <S className="h-12 w-full rounded-xl" />
          <S className="h-4 w-32 rounded-lg" />
        </div>
      ))}
    </div>
  </motion.div>
);

export const CardSkeleton = ({ count = 3 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="glass-card p-6 space-y-4">
        <div className="flex gap-3">
          <S className="h-12 w-12 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <S className="h-4 w-3/4 rounded-lg" />
            <S className="h-3 w-1/2 rounded-lg" />
          </div>
        </div>
        <S className="h-20 w-full rounded-xl" />
      </div>
    ))}
  </div>
);
