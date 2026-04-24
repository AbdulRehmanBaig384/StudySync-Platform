import React from 'react';
import { FiPlay, FiClock, FiFileText } from 'react-icons/fi';

const QuizCard = ({ title, questions, duration, category, difficulty, completed, image }) => {
  const difficultyColors = {
    Beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Intermediate: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Advanced: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  return (
    <div className="bg-glass-dark rounded-[2.5rem] shadow-xl border border-white/5 hover:border-indigo-500/30 transition-all duration-300 group overflow-hidden flex flex-col h-full">
      {/* Card Splash Image */}
      <div className="h-40 w-full relative overflow-hidden">
        <img 
          src={image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1470&auto=format&fit=crop'} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-50 group-hover:opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent opacity-80" />
        <div className="absolute top-4 left-4">
          <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${difficultyColors[difficulty] || difficultyColors.Beginner}`}>
            {difficulty}
          </span>
        </div>
      </div>

      <div className="p-8 space-y-6 flex-1 flex flex-col">
        <div className="flex justify-between items-center">
          <span className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">{category}</span>
          <div className="text-slate-500 group-hover:text-indigo-400 transition-colors">
            <FiFileText />
          </div>
        </div>

        <h4 className="text-xl font-black text-white group-hover:text-indigo-300 transition-colors font-jakarta leading-tight">{title}</h4>

        <div className="flex items-center gap-6 text-slate-500 text-[10px] font-black uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <FiFileText className="text-indigo-500" />
            <span>{questions} Qs</span>
          </div>
          <div className="flex items-center gap-2">
            <FiClock className="text-indigo-500" />
            <span>{duration} Min</span>
          </div>
        </div>

        <button className={`
          w-full mt-auto py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all duration-300
          ${completed
            ? 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'
            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-95'}
        `}>
          {completed ? 'Attempted' : <><FiPlay className="text-base" /> Start Assessment</>}
        </button>
      </div>
    </div>
  );
};

export default QuizCard;
