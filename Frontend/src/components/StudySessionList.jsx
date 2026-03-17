import React from 'react';
import { FiCalendar, FiUsers, FiArrowRight } from 'react-icons/fi';

const StudySessionList = () => {
  const sessions = [
    { id: 1, title: 'Advanced React Patterns', host: 'Alex Rivers', time: '14:00 - 15:30', partners: 12, category: 'Engineering' },
    { id: 2, title: 'Data Structures 101', host: 'Sarah Chen', time: '16:00 - 17:00', partners: 8, category: 'CS' },
    { id: 3, title: 'UI Design Principles', host: 'Jordan Smith', time: 'Tomorrow, 10:00', partners: 5, category: 'Design' },
  ];

  return (
    <div className="bg-glass-dark p-6 rounded-3xl shadow-xl border border-white/5">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-black text-white font-jakarta">Sessions</h3>
        <button className="text-indigo-400 text-xs font-black uppercase tracking-widest hover:text-indigo-300 transition-colors">View All</button>
      </div>

      <div className="space-y-4">
        {sessions.map((session) => (
          <div key={session.id} className="group p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-indigo-500/20 transition-all duration-300 cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-white/5 text-slate-400 uppercase tracking-widest border border-white/5">
                {session.category}
              </span>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-black uppercase tracking-widest">
                <FiUsers className="text-indigo-500" />
                <span>{session.partners} Joined</span>
              </div>
            </div>
            
            <h4 className="font-bold text-white mb-3 truncate group-hover:text-indigo-400 transition-colors">{session.title}</h4>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                <FiCalendar className="text-indigo-500" />
                <span>{session.time}</span>
              </div>
              <div className="p-1.5 rounded-lg bg-indigo-600 text-white opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                <FiArrowRight />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudySessionList;
