import React from 'react';
import { FiTrendingUp,  } from 'react-icons/fi';

const Leaderboard = () => {
  const students = [
    { rank: 1, name: 'Ava Johnson', points: 4850, avatar: 'A', trend: 'up' },
    { rank: 2, name: 'Liam Smith', points: 4720, avatar: 'L', trend: 'down' },
    { rank: 3, name: 'Noah Brown', points: 4600, avatar: 'N', trend: 'up' },
    { rank: 14, name: 'You', points: 3200, avatar: 'ME', active: true },
  ];

  return (
    <div className="bg-glass-dark p-6 rounded-3xl shadow-xl border border-white/5">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-black text-white flex items-center gap-3 font-jakarta">
          <div className="w-8 h-8 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
            <FiTrendingUp />
          </div>
          Ranking
        </h3>
        {/* <FiMedal className="text-amber-400 text-2xl drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]" /> */}
      </div>

      <div className="space-y-3">
        {students.map((student) => (
          <div key={student.rank} className={`
            flex items-center justify-between p-3.5 rounded-2xl transition-all border
            ${student.active
              ? 'bg-indigo-500/10 border-indigo-500/30'
              : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10'}
          `}>
            <div className="flex items-center gap-4">
              <span className={`w-4 text-[10px] font-black ${student.rank <= 3 ? 'text-amber-400' : 'text-slate-600'}`}>
                #{student.rank}
              </span>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black text-white shadow-lg
                ${student.rank === 1 ? 'bg-gradient-to-br from-amber-300 to-amber-500' : student.rank === 2 ? 'bg-slate-500' : student.rank === 3 ? 'bg-amber-700' : 'bg-indigo-500/40 text-indigo-100'}`}>
                {student.avatar}
              </div>
              <span className={`text-sm font-bold uppercase tracking-tight ${student.active ? 'text-indigo-400' : 'text-slate-200'}`}>
                {student.name}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-white leading-none">{student.points}</p>
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-0.5">PTS</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
