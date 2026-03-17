import React from 'react';
import { FiPlay, FiClock, FiFileText } from 'react-icons/fi';

const QuizCard = ({ title, questions, duration, category, difficulty, completed }) => {
  const difficultyColors = {
    Beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Intermediate: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Advanced: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <div className="bg-glass-dark p-6 rounded-3xl shadow-xl border border-white/5 hover:border-indigo-500/30 transition-all duration-300 group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
        <FiFileText className="text-8xl -rotate-12" />
      </div>

      <div className="flex justify-between items-start mb-6 relative z-10">
        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border ${difficultyColors[difficulty] || difficultyColors.Beginner}`}>
          {difficulty}
        </span>
        <span className="text-slate-500 text-xs font-black uppercase tracking-widest">{category}</span>
      </div>
      
      <h4 className="text-xl font-black text-white mb-2 group-hover:text-indigo-400 transition-colors relative z-10 font-jakarta">{title}</h4>
      
      <div className="flex items-center gap-6 mb-8 relative z-10">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
          <FiFileText className="text-indigo-500" />
          <span>{questions} Questions</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
          <FiClock className="text-indigo-500" />
          <span>{duration} mins</span>
        </div>
      </div>

      <button className={`
        w-full py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all duration-300 relative z-10
        ${completed 
          ? 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5' 
          : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-95'}
      `}>
        {completed ? 'Attempted' : <><FiPlay className="text-base" /> Start Quiz</>}
      </button>
    </div>
  );
};

export default QuizCard;
