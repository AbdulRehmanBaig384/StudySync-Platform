import React from 'react';
import { FiCode, FiChevronRight, FiCheckCircle } from 'react-icons/fi';

const CodingChallengeCard = () => {
  const challenges = [
    { title: 'Merge Sort Implementation', difficulty: 'Med', language: 'JS', solved: true },
    { title: 'Binary Tree Traversal', difficulty: 'Hard', language: 'Py', solved: false },
    { title: 'Reverse a Linked List', difficulty: 'Easy', language: 'Java', solved: true },
  ];

  return (
    <div className="bg-glass-dark p-6 rounded-3xl shadow-xl border border-white/5">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-black text-white flex items-center gap-3 font-jakarta">
          <div className="w-8 h-8 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
            <FiCode />
          </div>
          Practice
        </h3>
        <span className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/20">12/30</span>
      </div>

      <div className="space-y-3">
        {challenges.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer group">
            <div className="flex items-center gap-4 min-w-0">
              <div className={`
                w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg border
                ${item.solved 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-lg shadow-emerald-500/10' 
                  : 'bg-white/5 text-slate-600 border-white/10'}
              `}>
                {item.solved ? <FiCheckCircle /> : <FiCode />}
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-white truncate group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{item.title}</h4>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${item.difficulty === 'Hard' ? 'text-rose-400' : item.difficulty === 'Med' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {item.difficulty}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{item.language}</span>
                </div>
              </div>
            </div>
            <FiChevronRight className="text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
          </div>
        ))}
      </div>

      <button className="w-full mt-8 py-3.5 rounded-2xl border border-dashed border-white/10 text-slate-500 font-black uppercase tracking-widest text-[10px] hover:border-indigo-500/50 hover:text-indigo-400 transition-all bg-white/[0.01] hover:bg-white/[0.03]">
        Open IDE
      </button>
    </div>
  );
};

export default CodingChallengeCard;
