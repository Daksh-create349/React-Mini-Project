import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { motion } from 'framer-motion';

const HourlyForecastChart = ({ hourlyData }) => {
  const [activeTab, setActiveTab] = useState('temp');

  if (!hourlyData || hourlyData.length === 0) return null;

  // Format data for Recharts
  // We typically just take the next 24 hours.
  const currentHour = new Date().getHours();
  // Filter for next 24 hours
  const filteredData = hourlyData.slice(currentHour, currentHour + 24).map(hour => ({
    time: new Date(hour.time).toLocaleTimeString([], { hour: 'numeric', hour12: true }),
    temp: Math.round(hour.temp_c),
    humidity: hour.humidity,
    wind: Math.round(hour.wind_kph),
  }));

  const chartConfig = {
    temp: {
      color: '#fbbf24', // Amber
      gradientId: 'colorTemp',
      dataKey: 'temp',
      unit: '°C'
    },
    humidity: {
      color: '#60a5fa', // Blue
      gradientId: 'colorHumidity',
      dataKey: 'humidity',
      unit: '%'
    },
    wind: {
      color: '#22d3ee', // Cyan
      gradientId: 'colorWind',
      dataKey: 'wind',
      unit: ' km/h'
    }
  };

  const activeConfig = chartConfig[activeTab];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-white/20 shadow-2xl backdrop-blur-md bg-black/40 !rounded-xl">
          <p className="text-white/80 text-xs font-bold mb-1">{label}</p>
          <p className="text-white font-extrabold text-lg flex items-center gap-1 drop-shadow-md">
            <span style={{ color: activeConfig.color }}>
              {payload[0].value}{activeConfig.unit}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full mt-10"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <h3 className="text-2xl font-display font-bold text-white text-shadow-premium flex items-center gap-2">
          <span className="w-2 h-8 theme-accent-bg rounded-full inline-block theme-accent-shadow"></span>
          Hourly Trends
        </h3>
        
        {/* Tabs */}
        <div className="flex bg-black/20 p-1 rounded-full border border-white/10 backdrop-blur-md">
          {Object.keys(chartConfig).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-300 capitalize ${
                activeTab === key 
                  ? 'bg-white/20 text-white shadow-md border border-white/20' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card p-4 md:p-6 h-[350px] relative group overflow-hidden">
        <div className="glare-effect pointer-events-none opacity-50"></div>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorHumidity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="rgba(255,255,255,0.4)" 
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              minTickGap={20}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.4)" 
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 2, strokeDasharray: '5 5' }} />
            <Area 
              type="monotone" 
              dataKey={activeConfig.dataKey} 
              stroke={activeConfig.color} 
              strokeWidth={4}
              fillOpacity={1} 
              fill={`url(#${activeConfig.gradientId})`} 
              animationDuration={1500}
              animationEasing="ease-in-out"
              activeDot={{ r: 6, fill: activeConfig.color, stroke: '#fff', strokeWidth: 2, className: 'drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default HourlyForecastChart;
