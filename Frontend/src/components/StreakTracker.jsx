import React from 'react';
import { FiCheckCircle, FiAward } from 'react-icons/fi';

const StreakTracker = ({ currentStreak, goal }) => {
  const progress = Math.min((currentStreak / goal) * 100, 100);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const completedDays = [true, true, true, true, false, false, false]; // Mock data

  return (
    <div className="bg-glass-dark p-6 rounded-3xl shadow-xl border border-white/5 h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black text-white flex items-center gap-2 font-jakarta">
          Study Streak
          <span className="bg-amber-500/20 text-amber-400 text-xs px-2.5 py-1 rounded-full font-black border border-amber-500/20">🔥 {currentStreak} Days</span>
        </h3>
        <FiAward className="text-2xl text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2 font-medium">
          <span className="text-slate-400">Progress to goal</span>
          <span className="font-black text-indigo-400">{currentStreak}/{goal} days</span>
        </div>
        <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden border border-white/5 p-0.5">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(79,70,229,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, idx) => (
          <div key={day} className="flex flex-col items-center gap-3">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{day}</span>
            <div className={`
              w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300
              ${completedDays[idx] 
                ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20' 
                : 'bg-white/5 text-slate-700 border border-dashed border-white/10'}
            `}>
              {completedDays[idx] && <FiCheckCircle className="text-lg" />}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-2 pt-6 border-t border-white/5">
        <div className="bg-white/5 px-3 py-2 rounded-xl flex items-center gap-2 border border-white/5 hover:bg-white/10 transition-colors cursor-help">
          <span className="text-xl">🥉</span>
          <span className="text-[10px] font-black text-slate-300 uppercase">Early Bird</span>
        </div>
        <div className="bg-white/5 px-3 py-2 rounded-xl flex items-center gap-2 border border-white/5 opacity-40 grayscale">
          <span className="text-xl">🥈</span>
          <span className="text-[10px] font-black text-slate-300 uppercase">Night Owl</span>
        </div>
      </div>
    </div>
  );
};

export default StreakTracker;
