import React, { useState, useEffect } from 'react';
import { FiSearch, FiUserPlus, FiLoader, FiCheckCircle, FiX } from 'react-icons/fi';
import { useSocket } from '../context/SocketContext';

const InviteModal = ({ sessionId, isOpen, onClose, userId }) => {
  const { socket } = useSocket();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [invitingId, setInvitingId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchEligibleUsers();
    }
  }, [isOpen, search]);

  const fetchEligibleUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/session/eligible-users/${sessionId}?userId=${userId}&search=${search}`);
      const data = await res.json();
      if (res.ok) setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (receiverId) => {
    setInvitingId(receiverId);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/session/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, senderId: userId, receiverId })
      });
      const data = await res.json();
      if (res.ok) {
        socket?.emit('send_session_invitation', {
          receiverId,
          notification: data.notification
        });
        setUsers(prev => prev.filter(u => u._id !== receiverId));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setInvitingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1e293b] w-full max-w-lg rounded-[2.5rem] border border-white/10 p-8 shadow-2xl animate-slide-up relative flex flex-col max-h-[80vh]">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors p-2 bg-white/5 rounded-full"
        >
          <FiX />
        </button>
        
        <h2 className="text-2xl font-black text-white mb-2 font-jakarta">Invite Study Partners</h2>
        <p className="text-slate-500 text-sm mb-6">Invite users to join this collaborative study session.</p>

        <div className="relative mb-6">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
          {loading && users.length === 0 ? (
            <div className="py-10 text-center flex flex-col items-center gap-3">
              <FiLoader className="text-2xl text-indigo-500 animate-spin" />
              <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Searching users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">No eligible users found</p>
            </div>
          ) : (
            users.map(user => (
              <div key={user._id} className="group p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between hover:bg-white/[0.08] transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-black">
                    {user.Firstname[0]}{user.lastname[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-none mb-1">{user.Firstname} {user.lastname}</h4>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{user.department}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleInvite(user._id)}
                  disabled={invitingId === user._id}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                >
                  {invitingId === user._id ? <FiLoader className="animate-spin" /> : <FiUserPlus />}
                  Invite
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
