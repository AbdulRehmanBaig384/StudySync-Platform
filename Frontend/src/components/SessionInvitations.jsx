import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiUser, FiCheck, FiX, FiBell } from 'react-icons/fi';
import { useSocket } from '../context/SocketContext';

const SessionInvitations = ({ userId }) => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  useEffect(() => {
    fetchInvitations();
    
    if (socket) {
      socket.on('new_session_invitation', (data) => {
        setInvitations(prev => [data, ...prev]);
      });
      
      return () => socket.off('new_session_invitation');
    }
  }, [userId, socket]);

  const fetchInvitations = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/session/notifications/${userId}`);
      const data = await res.json();
      if (res.ok) setInvitations(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (invitationId, status) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/session/invitation-response`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitationId, status, userId })
      });
      const data = await res.json();
      if (res.ok) {
        socket?.emit('respond_to_invitation', {
          senderId: data.invitation.sender,
          receiverId: userId,
          status,
          sessionId: data.invitation.sessionId
        });
        setInvitations(prev => prev.filter(notif => notif.invitationId !== invitationId));
        if (status === 'accepted') {
          // Optionally trigger a dashboard refresh or just let the session list handle it
          window.location.reload(); 
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading && invitations.length === 0) return null;
  if (invitations.length === 0) return null;

  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
          <FiBell />
        </div>
        <h3 className="text-lg font-black text-white font-jakarta">New Invitations</h3>
        <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black">{invitations.length}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {invitations.map((notif) => (
          <div key={notif._id} className="bg-glass-dark border border-indigo-500/20 rounded-3xl p-6 shadow-xl animate-slide-up relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-600/10 transition-all duration-700" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 font-black">
                  {notif.sessionId?.host?.Firstname?.[0]}
                </div>
                <div>
                  <h4 className="text-sm font-black text-white leading-none mb-1">{notif.sessionId?.name}</h4>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{notif.sessionId?.topic}</p>
                </div>
              </div>

              <p className="text-slate-400 text-xs mb-6 line-clamp-2 italic">"{notif.message}"</p>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <FiCalendar className="text-indigo-500" />
                  <span>{notif.sessionId?.date}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <FiClock className="text-indigo-500" />
                  <span>{notif.sessionId?.time}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => handleResponse(notif.invitationId, 'accepted')}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                >
                  <FiCheck /> Accept
                </button>
                <button 
                  onClick={() => handleResponse(notif.invitationId, 'rejected')}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-white/10 hover:border-rose-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                >
                  <FiX /> Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionInvitations;
