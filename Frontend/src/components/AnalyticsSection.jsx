import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';

const AnalyticsSection = () => {
  const studyHoursData = [
    { day: 'Mon', hours: 4.5 },
    { day: 'Tue', hours: 3.2 },
    { day: 'Wed', hours: 5.8 },
    { day: 'Thu', hours: 4.0 },
    { day: 'Fri', hours: 6.5 },
    { day: 'Sat', hours: 2.5 },
    { day: 'Sun', hours: 1.5 },
  ];

  const progressData = [
    { week: 'W1', score: 65 },
    { week: 'W2', score: 72 },
    { week: 'W3', score: 68 },
    { week: 'W4', score: 85 },
    { week: 'W5', score: 82 },
    { week: 'W6', score: 91 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Study Hours Bar Chart */}
      <div className="bg-glass-dark p-6 rounded-3xl shadow-xl border border-white/5 min-h-[380px]">
        <h3 className="text-lg font-black text-white mb-8 flex items-center justify-between font-jakarta">
          Weekly Study Hours
          <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest">+12% growth</span>
        </h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={studyHoursData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                contentStyle={{ 
                  backgroundColor: '#111827', 
                  borderRadius: '16px', 
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
                }}
              />
              <Bar 
                dataKey="hours" 
                fill="url(#indigoVioletGradient)" 
                radius={[6, 6, 0, 0]} 
                barSize={32}
              />
              <defs>
                <linearGradient id="indigoVioletGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity={0.8} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quiz Performance Area Chart */}
      <div className="bg-glass-dark p-6 rounded-3xl shadow-xl border border-white/5 min-h-[380px]">
        <h3 className="text-lg font-black text-white mb-8 flex items-center justify-between font-jakarta">
          Quiz Performance
          <span className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20 uppercase tracking-widest">Avg: 82%</span>
        </h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={progressData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
              <XAxis 
                dataKey="week" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#111827', 
                  borderRadius: '16px', 
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#6366f1" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorScore)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;
