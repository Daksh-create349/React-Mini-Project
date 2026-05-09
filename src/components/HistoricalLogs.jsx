import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const HistoricalLogs = ({ history }) => {
  if (!history || history.length === 0) return null;

  // Format data for chart
  // history is an array of forecastday objects
  const chartData = history.map(day => {
    const date = new Date(day.date);
    return {
      name: date.toLocaleDateString([], { weekday: 'short' }),
      temp: day.day.avgtemp_c,
      min: day.day.mintemp_c,
      max: day.day.maxtemp_c,
      icon: day.day.condition.icon,
      condition: day.day.condition.text
    };
  }).reverse(); // Reverse to show oldest to newest

  return (
    <div className="w-full mt-10">
      <h3 className="text-2xl font-display font-bold text-white mb-6 text-shadow-premium flex items-center gap-2">
        <span className="w-2 h-8 bg-purple-500 rounded-full inline-block shadow-[0_0_15px_rgba(168,85,247,0.5)]"></span>
        Historical Weather Logs
        <span className="ml-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-white/70 border border-white/10">
          Past 3 Days
        </span>
      </h3>

      <div className="glass-card p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Chart */}
          <div className="flex-1 h-[250px]">
             <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="historyTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.5)" 
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.5)" 
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `${val}°`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)', color: '#fff' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                  formatter={(value) => [`${value}°C`, 'Avg Temp']}
                />
                <Area 
                  type="monotone" 
                  dataKey="temp" 
                  stroke="#a855f7" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#historyTemp)" 
                  activeDot={{ r: 6, fill: '#d8b4fe', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Stats */}
          <div className="w-full md:w-1/3 flex flex-col justify-center gap-4 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8">
            {chartData.map((day, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img src={day.icon} alt={day.condition} className="w-10 h-10 drop-shadow-md" />
                  <div>
                    <p className="text-sm font-bold text-white">{day.name}</p>
                    <p className="text-xs text-white/50 truncate w-24">{day.condition}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-white block leading-tight">{day.temp}°</span>
                  <span className="text-xs text-white/50 block font-medium">Avg</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
