import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { FiPlus, FiUsers, FiLock, FiGlobe, FiSearch, FiLoader, FiPlay } from 'react-icons/fi';

const SessionLobby = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    topic: '',
    description: '',
    maxParticipants: 5,
    privacy: 'public',
    department: localStorage.getItem('department') || '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  });
  
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    fetchActiveSessions();
  }, []);

  const fetchActiveSessions = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/session/active`);
      const data = await res.json();
      if (res.ok) setSessions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/session/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, hostId: userId })
      });
      const data = await res.json();
      if (res.ok) {
        navigate(`/StudyRoom/${data._id}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleJoinSession = async (sessionId) => {
    navigate(`/StudyRoom/${sessionId}`);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="animate-slide-up">
          <h2 className="text-4xl font-black text-white mb-2 font-jakarta tracking-tight">
            Study <span className="text-gradient font-black">Lobby</span> 🏛️
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
            <span className="w-8 h-px bg-indigo-500/30"></span>
            Join or create a live collaborative study room
          </p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-2xl shadow-indigo-600/20 flex items-center gap-3 active:scale-95"
        >
          <FiPlus className="text-lg" />
          Create Session
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-20 flex flex-col items-center gap-4">
            <FiLoader className="text-4xl text-indigo-500 animate-spin" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading sessions...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white/5 border border-dashed border-white/10 rounded-[2.5rem]">
            <FiUsers className="text-6xl text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No active sessions</h3>
            <p className="text-slate-500 text-sm mb-6">Be the first to start a collaborative study room!</p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="text-indigo-400 font-black uppercase tracking-widest text-xs hover:text-indigo-300 transition-colors"
            >
              Start Session Now &rarr;
            </button>
          </div>
        ) : (
          sessions.map(session => (
            <div key={session._id} className="group bg-glass-dark border border-white/5 rounded-[2rem] p-8 hover:border-indigo-500/30 transition-all duration-500 hover:translate-y-[-4px] shadow-2xl">
              <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col gap-2">
                  <div className={`w-fit px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    session.status === 'active' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                    session.status === 'upcoming' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                  }`}>
                    {session.status}
                  </div>
                  <div className={`p-3 rounded-2xl w-fit ${session.privacy === 'public' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                    {session.privacy === 'public' ? <FiGlobe /> : <FiLock />}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex -space-x-2">
                    {session.participants.slice(0, 3).map((p, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-[#0a0f1e] flex items-center justify-center text-[10px] font-bold text-white overflow-hidden">
                        {p.profilePicture ? <img src={p.profilePicture} alt="" className="w-full h-full object-cover" /> : p.Firstname?.[0]}
                      </div>
                    ))}
                    {session.participants.length > 3 && (
                      <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-[#0a0f1e] flex items-center justify-center text-[10px] font-bold text-white">
                        +{session.participants.length - 3}
                      </div>
                    )}
                  </div>
                  {session.status === 'upcoming' && session.timeRemaining > 0 && (
                    <span className="text-[10px] font-black text-indigo-400 animate-pulse uppercase tracking-widest">
                      Starts in {session.timeRemaining}m
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-xl font-black text-white mb-2 font-jakarta truncate group-hover:text-indigo-400 transition-colors">{session.name}</h3>
              <div className="flex items-center gap-2 mb-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{session.topic}</p>
                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{session.date === new Date().toISOString().split('T')[0] ? 'Today' : session.date} at {session.time}</p>
              </div>
              
              <p className="text-slate-400 text-sm mb-6 line-clamp-2 h-10">{session.description || "Join this session to collaborate on the topic."}</p>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-[10px] font-black text-indigo-400">
                    {session.host.Firstname[0]}
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black text-white leading-none mb-1">{session.host.Firstname}</p>
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Host</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleJoinSession(session._id)}
                  className="bg-white/5 hover:bg-indigo-600 hover:text-white text-slate-300 p-3 rounded-xl transition-all active:scale-90"
                >
                  <FiPlay />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Session Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1e293b] w-full max-w-lg rounded-[2.5rem] border border-white/10 p-10 shadow-2xl animate-slide-up relative">
            <button 
              onClick={() => setShowCreateModal(false)}
              className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"
            >
              &times;
            </button>
            
            <h2 className="text-3xl font-black text-white mb-2 font-jakarta">Start New Session</h2>
            <p className="text-slate-500 text-sm mb-8">Set up your collaborative room and invite others.</p>

            <form onSubmit={handleCreateSession} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Room Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
                  placeholder="e.g. Finals Week Grind"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Topic</label>
                  <input 
                    type="text" 
                    required
                    value={formData.topic}
                    onChange={(e) => setFormData({...formData, topic: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
                    placeholder="e.g. Physics II"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Max Capacity</label>
                  <input 
                    type="number" 
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({...formData, maxParticipants: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                  <input 
                    type="date" 
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Time</label>
                  <input 
                    type="time" 
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Privacy Setting</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, privacy: 'public'})}
                    className={`py-4 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest ${formData.privacy === 'public' ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' : 'bg-white/5 border-white/10 text-slate-500'}`}
                  >
                    Public Room
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({...formData, privacy: 'invite'})}
                    className={`py-4 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest ${formData.privacy === 'invite' ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' : 'bg-white/5 border-white/10 text-slate-500'}`}
                  >
                    Invite Only
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-indigo-600/20 mt-4"
              >
                Launch Session
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SessionLobby;
