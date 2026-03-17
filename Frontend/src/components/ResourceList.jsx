import React from 'react';
import { FiFileText, FiDownload, FiBookmark } from 'react-icons/fi';

const ResourceList = () => {
  const resources = [
    { title: 'React Hooks Cheat Sheet', size: '1.2 MB', type: 'PDF' },
    { title: 'System Design Patterns', size: '4.5 MB', type: 'PDF' },
    { title: 'Algorithm Lab', size: '800 KB', type: 'DOCX' },
  ];

  return (
    <div className="bg-glass-dark p-6 rounded-3xl shadow-xl border border-white/5">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-black text-white font-jakarta">Resources</h3>
        <button className="text-indigo-400 text-xs font-black uppercase tracking-widest">Library</button>
      </div>

      <div className="space-y-4">
        {resources.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between group p-3 rounded-2xl border border-transparent hover:border-white/5 hover:bg-white/[0.02] transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/10 transition-all border border-white/5 group-hover:border-indigo-500/20 shadow-sm">
                <FiFileText className="text-xl" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors uppercase tracking-tight">{item.title}</h4>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">{item.type} • {item.size}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
              <button className="p-2 text-slate-500 hover:text-indigo-400 bg-white/5 rounded-xl border border-transparent hover:border-white/10 transition-all">
                <FiBookmark />
              </button>
              <button className="p-2 text-slate-500 hover:text-indigo-400 bg-white/5 rounded-xl border border-transparent hover:border-white/10 transition-all">
                <FiDownload />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceList;
