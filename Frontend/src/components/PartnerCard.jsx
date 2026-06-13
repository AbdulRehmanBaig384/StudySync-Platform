import React, { useState } from 'react';
import { FiUserPlus, FiExternalLink, FiAward, FiClock, FiMap, FiCheck, FiLoader } from 'react-icons/fi';

const PartnerCard = ({ id, name, department, facultyOfStudy, semester, subjects, style, availability, compatibility, avatar, onlineStatus, matchLevel, onInvite }) => {
  const isHighMatch = matchLevel === 'HIGH';
  const [inviteStatus, setInviteStatus] = useState('idle'); // idle, sending, sent, error

  const handleConnect = async () => {
    const senderId = localStorage.getItem('userId');
    if (!senderId) return alert('Please log in first');
    
    setInviteStatus('sending');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/invite/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId, receiverId: id })
      });
      
      const data = await res.json();
      if (res.ok) {
        setInviteStatus('sent');
        // Give time for user to see "Sent" before removing from list
        setTimeout(() => {
          if (onInvite) onInvite();
        }, 1000);
      } else {
        alert(data.message || 'Failed to send invitation');
        setInviteStatus('error');
      }
    } catch (error) {
      console.error(error);
      setInviteStatus('error');
    }
  };
  
  return (
    <div className={`bg-glass-dark p-6 rounded-3xl border ${isHighMatch ? 'border-indigo-500/50 shadow-[0_0_30px_rgba(79,70,229,0.15)]' : 'border-white/5'} hover:border-indigo-500/30 transition-all duration-300 group flex flex-col h-full relative overflow-hidden animate-slide-up`}>
      {/* Compatibility Badge */}
      <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
        <div className={`${isHighMatch ? 'bg-indigo-600' : 'bg-indigo-500/10'} border border-indigo-500/20 text-${isHighMatch ? 'white' : 'indigo-400'} text-[10px] font-black px-2.5 py-1.5 rounded-full backdrop-blur-md shadow-lg shadow-indigo-500/10`}>
          {isHighMatch ? '🔥 HIGH MATCH' : `${compatibility}% Match`}
        </div>
        {/* Online Status Badge */}
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${onlineStatus === 'online' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-500 border border-white/5'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${onlineStatus === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}></span>
          {onlineStatus || 'offline'}
        </div>
      </div>

      {/* Header with Avatar */}
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${isHighMatch ? 'from-indigo-600 to-violet-700' : 'from-indigo-500 to-violet-600'} flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-indigo-500/10 group-hover:scale-110 transition-transform`}>
          {avatar}
        </div>
        <div>
          <h4 className="text-lg font-black text-white font-jakarta group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{name}</h4>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{department} • Sem {semester}</p>
        </div>
      </div>

      {/* Subjects */}
      <div className="flex flex-wrap gap-2 mb-6">
        {subjects && subjects.map((sub, idx) => (
          <span key={idx} className={`${isHighMatch ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300' : 'bg-white/5 border-white/5 text-slate-400'} text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider`}>
            {sub}
          </span>
        ))}
      </div>

      {/* Details List */}
      <div className="space-y-3 mb-8 flex-1">
        <div className="flex items-center gap-3 text-xs text-slate-400 font-bold">
          <FiMap className="text-indigo-500" />
          <span className="uppercase tracking-widest text-[10px]">Faculty: <span className="text-slate-200">{facultyOfStudy || 'Not set'}</span></span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400 font-bold">
          <FiAward className="text-indigo-500" />
          <span className="uppercase tracking-widest text-[10px]">Style: <span className="text-slate-200">{style}</span></span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400 font-bold">
          <FiClock className="text-indigo-500" />
          <span className="uppercase tracking-widest text-[10px]">Time: <span className="text-slate-200">{availability}</span></span>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3 pt-6 border-t border-white/5">
        <button 
          onClick={handleConnect}
          disabled={inviteStatus === 'sending' || inviteStatus === 'sent'}
          className={`flex items-center justify-center gap-2 ${inviteStatus === 'sent' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20 active:scale-95 disabled:opacity-70`}
        >
          {inviteStatus === 'sending' ? (
            <FiLoader className="text-base animate-spin" />
          ) : inviteStatus === 'sent' ? (
            <FiCheck className="text-base" />
          ) : (
            <FiUserPlus className="text-base" />
          )}
          {inviteStatus === 'sent' ? 'Sent' : 'Connect'}
        </button>
        <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/5 hover:bg-white/10 text-slate-400 hover:text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95">
          <FiExternalLink className="text-base" />
          Profile
        </button>
      </div>
    </div>
  );
};

export default PartnerCard;
