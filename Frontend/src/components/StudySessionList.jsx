import React, { useState, useEffect } from 'react';
import { FiCalendar, FiUsers, FiArrowRight, FiPlus, FiBookOpen } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const StudySessionList = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) return;

        const res = await fetch(`http://localhost:3000/api/session/active?userId=${userId}`);
        const data = await res.json();
        if (res.ok) {
          setSessions(data.slice(0, 3)); // Only show top 3 on dashboard
        }
      } catch (error) {
        console.error("Error fetching dashboard sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (loading) {
    return (
      <div className="bg-glass-dark p-6 rounded-3xl shadow-xl border border-white/5 animate-pulse">
        <div className="h-6 bg-white/5 rounded w-1/3 mb-8"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white/5 rounded-2xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-glass-dark p-6 rounded-3xl shadow-xl border border-white/5">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-black text-white font-jakarta">My Study Sessions</h3>
        <button 
          onClick={() => navigate('/StudySession')}
          className="text-indigo-400 text-xs font-black uppercase tracking-widest hover:text-indigo-300 transition-colors"
        >
          View All
        </button>
      </div>

      <div className="space-y-4">
        {sessions.length === 0 ? (
          <div className="py-8 px-4 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-4 border border-white/5">
              <FiBookOpen className="text-slate-600 text-xl" />
            </div>
            <p className="text-slate-400 font-bold text-sm mb-6">No study sessions created yet.</p>
            <button 
              onClick={() => navigate('/StudySession')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 mx-auto active:scale-95 shadow-lg shadow-indigo-600/20"
            >
              <FiPlus />
              Create Session
            </button>
          </div>
        ) : (
          sessions.map((session) => (
            <div 
              key={session._id} 
              onClick={() => navigate(`/StudyRoom/${session._id}`)}
              className="group p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-indigo-500/20 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest border ${
                  session.status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                  session.status === 'upcoming' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                  'bg-white/5 text-slate-400 border-white/5'
                }`}>
                  {session.status}
                </span>
                <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-black uppercase tracking-widest">
                  <FiUsers className="text-indigo-500" />
                  <span>{session.participants?.length || 0} Joined</span>
                </div>
              </div>
              
              <h4 className="font-bold text-white mb-2 truncate group-hover:text-indigo-400 transition-colors uppercase tracking-tight text-sm">{session.name}</h4>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">{session.topic}</p>
              
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex flex-col gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-indigo-500" />
                    <span>{session.date === new Date().toISOString().split('T')[0] ? 'Today' : session.date}</span>
                  </div>
                  <div className="ml-4 text-slate-500">{session.time}</div>
                </div>
                <div className="p-1.5 rounded-lg bg-indigo-600 text-white opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                  <FiArrowRight />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudySessionList;
