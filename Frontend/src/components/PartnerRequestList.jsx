import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiClock, FiUser, FiLoader, FiInbox, FiSend, FiUsers } from 'react-icons/fi';

const PartnerRequestList = () => {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const userId = localStorage.getItem('userId');

  const fetchData = async () => {
    try {
      const [incRes, outRes] = await Promise.all([
        fetch(`http://localhost:3000/api/invite/incoming/${userId}`),
        fetch(`http://localhost:3000/api/invite/outgoing/${userId}`)
      ]);
      
      const incData = await incRes.json();
      const outData = await outRes.json();
      
      if (incRes.ok) setIncoming(incData);
      if (outRes.ok) setOutgoing(outData);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchData();
  }, [userId]);

  const handleResponse = async (invitationId, status) => {
    setProcessingId(invitationId);
    try {
      const res = await fetch(`http://localhost:3000/api/invite/respond/${invitationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        fetchData();
      } else {
        alert("Failed to update invitation status");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return (
    <div className="flex justify-center p-8 bg-glass-dark rounded-3xl border border-white/5 shadow-xl">
      <FiLoader className="w-6 h-6 text-indigo-500 animate-spin" />
    </div>
  );

  return (
    <div className="bg-glass-dark p-6 rounded-3xl border border-white/5 shadow-xl animate-slide-up">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
          <FiInbox />
        </div>
        <h3 className="text-lg font-black text-white font-jakarta">Requests</h3>
      </div>

      {/* Received Requests */}
      <div className="space-y-2 mb-8">
        <div className="flex items-center justify-between px-2 mb-3">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Received</h4>
          <span className="bg-indigo-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">{incoming.length}</span>
        </div>
        {incoming.length === 0 ? (
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest text-center py-4 bg-white/[0.01] rounded-2xl border border-dashed border-white/5">No incoming requests</p>
        ) : incoming.map((req) => (
          <div key={req._id} className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between group animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-xs font-black text-indigo-400 border border-indigo-500/20">
                {req.sender.Firstname[0]}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-white truncate">{req.sender.Firstname} {req.sender.lastname}</p>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tight truncate">{req.sender.department}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <button 
                onClick={() => handleResponse(req._id, 'accepted')}
                disabled={processingId === req._id}
                className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-lg border border-emerald-500/20 transition-all duration-200 disabled:opacity-50 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-emerald-500/10"
              >
                {processingId === req._id ? <FiLoader className="animate-spin" /> : <FiCheck />}
                Accept
              </button>
              <button 
                onClick={() => handleResponse(req._id, 'rejected')}
                disabled={processingId === req._id}
                className="px-3 py-1.5 bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg border border-rose-500/20 transition-all duration-200 disabled:opacity-50 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-rose-500/10"
              >
                {processingId === req._id ? <FiLoader className="animate-spin" /> : <FiX />}
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sent Requests */}
      <div className="space-y-2 mb-8">
        <div className="flex items-center justify-between px-2 mb-3">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sent</h4>
          <span className="bg-slate-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">{outgoing.filter(o => o.status === 'pending').length}</span>
        </div>
        {outgoing.filter(o => o.status === 'pending').length === 0 ? (
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest text-center py-4 bg-white/[0.01] rounded-2xl border border-dashed border-white/5">No pending sent requests</p>
        ) : outgoing.filter(o => o.status === 'pending').map((req) => (
          <div key={req._id} className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-3 opacity-70 group hover:opacity-100 transition-all">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xs font-black text-slate-600 border border-white/5">
              {req.receiver.Firstname[0]}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-slate-300 truncate">{req.receiver.Firstname} {req.receiver.lastname}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <FiSend className="text-[8px] text-indigo-500" />
                <p className="text-[8px] font-black text-indigo-500/80 uppercase tracking-widest">Pending</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnerRequestList;
