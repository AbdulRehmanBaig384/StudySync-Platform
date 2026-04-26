import React from 'react';
import { FiZap } from 'react-icons/fi';

const StreakTracker = ({ currentStreak, todayStudyHours, dailyGoal, studyHistory = [] }) => {
  const today = new Date().toISOString().split('T')[0];
  const todayStats = studyHistory.find(h => h.date === today) || { hours: 0, goalMet: false };
  
  const progress = dailyGoal > 0 ? Math.min((todayStudyHours / dailyGoal) * 100, 100) : 0;
  const isGoalMetToday = todayStats.goalMet || progress >= 100;

  return (
    <div className="bg-glass-dark p-6 rounded-3xl shadow-xl border border-white/5 relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all duration-700"></div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Current Streak</p>
          <h3 className="text-3xl font-black text-white flex items-center gap-2 font-jakarta">
            {currentStreak} <span className="text-sm text-amber-500">Days</span>
          </h3>
        </div>
        <div className={`p-3 rounded-2xl ${isGoalMetToday ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-white/5 text-slate-600 border border-white/5'}`}>
          <FiZap className={`text-xl ${isGoalMetToday ? 'animate-pulse' : ''}`} />
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex justify-between text-[10px] mb-2 font-black uppercase tracking-widest">
          <span className="text-slate-400">Today's Goal</span>
          <span className={isGoalMetToday ? "text-emerald-400" : "text-amber-400"}>
            {isGoalMetToday ? "Completed" : "In Progress"}
          </span>
        </div>
        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden p-0.5 border border-white/5">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${
              isGoalMetToday 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                : 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
            }`}
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>
    </div>
  );
};

export default StreakTracker;
