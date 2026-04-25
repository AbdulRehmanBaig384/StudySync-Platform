import React, { useState, useEffect } from 'react';
import { FiMessageSquare, FiUser, FiLoader, FiCircle } from 'react-icons/fi';

const PartnerConnections = ({ onSelectPartner }) => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = sessionStorage.getItem('userId');

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/invite/connections/${userId}`);
        const data = await res.json();
        if (res.ok) {
          setConnections(data);
        }
      } catch (error) {
        console.error("Error fetching connections:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchConnections();
  }, [userId]);

  if (loading) return (
    <div className="flex justify-center p-4">
      <FiLoader className="animate-spin text-indigo-500" />
    </div>
  );

  return (
    <div className="space-y-2">
      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 mb-3 flex items-center justify-between">
        My Connections
        <span className="bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded-full text-[8px]">{connections.length}</span>
      </h3>
      
      {connections.length === 0 ? (
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest text-center py-4 bg-white/[0.01] rounded-2xl border border-dashed border-white/5">No connections yet</p>
      ) : (
        connections.map((conn) => (
          <div 
            key={conn._id} 
            onClick={() => onSelectPartner && onSelectPartner(conn)}
            className="flex items-center justify-between p-3 hover:bg-white/5 rounded-2xl transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center text-xs font-black text-indigo-400 border border-indigo-500/10">
                  {conn.Firstname[0]}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#0a0f1e] ${conn.onlineStatus === 'online' ? 'bg-emerald-500' : 'bg-slate-600'}`} />
              </div>
              <div>
                <p className="text-xs font-black text-white group-hover:text-indigo-400 transition-colors">
                  {conn.Firstname} {conn.lastname}
                </p>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">
                  {conn.department}
                </p>
              </div>
            </div>
            <FiMessageSquare className="text-slate-600 group-hover:text-indigo-500 transition-colors" />
          </div>
        ))
      )}
    </div>
  );
};

export default PartnerConnections;
