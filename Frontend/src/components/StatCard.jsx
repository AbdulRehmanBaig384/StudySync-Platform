import React from 'react';

const StatCard = ({ title, value, icon, trend, trendValue, color }) => {
  const colorMap = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };

  return (
    <div className="bg-glass-dark p-6 rounded-3xl shadow-lg border border-white/5 hover:border-indigo-500/30 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
          <h3 className="text-2xl font-black text-white">{value}</h3>

          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-bold ${trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
              <span>{trend === 'up' ? '↑' : '↓'}</span>
              <span>{trendValue}</span>
              <span className="text-slate-500 font-medium ml-0.5 whitespace-nowrap">vs last week</span>
            </div>
          )}
        </div>

        <div className={`p-3 rounded-2xl ${colorMap[color] || colorMap.indigo} bg-opacity-10 backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
