import React from 'react';
import { FiCheck, FiX, FiSend, FiInbox, FiUsers } from 'react-icons/fi';

const PartnerRequestList = () => {
  const received = [
    { id: 1, name: 'Ava Johnson', subject: 'React Patterns', status: 'pending', avatar: 'AJ' },
    { id: 2, name: 'Liam Smith', subject: 'Data Structures', status: 'pending', avatar: 'LS' },
  ];

  const sent = [
    { id: 3, name: 'Noah Brown', subject: 'UI Design', status: 'sent', avatar: 'NB' },
  ];

  return (
    <div className="bg-glass-dark p-6 rounded-3xl border border-white/5 shadow-xl sticky top-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
          <FiInbox />
        </div>
        <h3 className="text-lg font-black text-white font-jakarta">Connections</h3>
      </div>

      {/* Received Requests */}
      <div className="space-y-2 mb-8">
        <div className="flex items-center justify-between px-2 mb-3">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Received</h4>
          <span className="bg-indigo-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">{received.length}</span>
        </div>
        {received.map((req) => (
          <div key={req.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between group animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-xs font-black text-indigo-400 border border-indigo-500/20">
                {req.avatar}
              </div>
              <div>
                <p className="text-xs font-black text-white group-hover:text-indigo-400 transition-colors">{req.name}</p>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">{req.subject}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
              <button className="p-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg border border-emerald-500/20 transition-colors">
                <FiCheck />
              </button>
              <button className="p-2 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 rounded-lg border border-rose-500/20 transition-colors">
                <FiX />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sent Requests */}
      <div className="space-y-2 mb-8">
        <div className="flex items-center justify-between px-2 mb-3">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sent</h4>
        </div>
        {sent.map((req) => (
          <div key={req.id} className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-3 opacity-70 hover:opacity-100 transition-all">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xs font-black text-slate-600 border border-white/5">
              {req.avatar}
            </div>
            <div>
              <p className="text-xs font-black text-slate-300">{req.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <FiSend className="text-[8px] text-indigo-500" />
                <p className="text-[8px] font-black text-indigo-500/80 uppercase tracking-widest">Pending Match</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full py-4 rounded-2xl bg-white/5 border border-dashed border-white/10 text-slate-500 font-black uppercase tracking-widest text-[10px] hover:border-indigo-500/50 hover:text-indigo-400 transition-all flex items-center justify-center gap-3">
        <FiUsers />
        Manage Groups
      </button>
    </div>
  );
};

export default PartnerRequestList;
