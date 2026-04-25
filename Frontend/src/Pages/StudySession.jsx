import React, { useState, useEffect } from 'react';
import {
  FiUsers,
  FiMessageSquare,
  FiBarChart2,
  FiHelpCircle,
  FiSearch,
  FiUserPlus,
  FiSend,
  FiThumbsUp,
  FiThumbsDown,
  FiCheckCircle,
  FiPlay,
  FiSquare,
  FiCoffee,
  FiLogOut,
  FiFolder,
  FiBookmark,
  FiClock,
  FiBell,
  FiMoreVertical,
  FiLoader,
  FiMic,
  FiMicOff,
  FiVideo,
  FiVideoOff,
  FiMonitor,
  FiEdit2,
  FiHeart,
  FiChevronRight
} from 'react-icons/fi';
import { NavLink, useLocation } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useWebRTC } from '../hooks/useWebRTC';
import Whiteboard from '../components/Whiteboard';

const StudySession = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('chat');
  const [isLive, setIsLive] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentInvitationId, setCurrentInvitationId] = useState(null);
  
  const userId = sessionStorage.getItem('userId');
  const userEmail = sessionStorage.getItem('userEmail');
  const { socket } = useSocket();

  const {
    localStream,
    remoteStream,
    localVideoRef,
    remoteVideoRef,
    isAudioMuted,
    isVideoOff,
    isScreenSharing,
    startCall,
    joinCall,
    toggleAudio,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
    endCall,
  } = useWebRTC(socket, currentInvitationId, userId);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/invite/connections/${userId}`);
        const data = await res.json();
        if (res.ok) {
          // If we came from chat with a specific partner
          if (location.state?.invitationId) {
            setCurrentInvitationId(location.state.invitationId);
          } else if (data.length > 0) {
            // For now, default to the first connection or wait for user to select
            // In a real app, you'd select the connection based on the session room
          }

          const formatted = data.map(p => ({
            name: `${p.Firstname} ${p.lastname}`,
            role: 'Student',
            status: p.onlineStatus || 'offline',
            avatar: p.Firstname[0] + (p.lastname ? p.lastname[0] : '')
          }));
          
          const userName = sessionStorage.getItem('userName') || 'Me';
          setParticipants([
            { name: userName, role: 'Host', status: 'online', avatar: userName.split(' ').map(n => n[0]).join('') },
            ...formatted
          ]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchParticipants();
  }, [userId, location.state]);

  const handleStartSession = async () => {
    if (!currentInvitationId) return alert("Select a partner to start a session");
    
    try {
      await fetch('http://localhost:3000/api/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitationId: currentInvitationId, userId })
      });
      
      setIsLive(true);
      setActiveTab('live');
      await startCall();
      socket.emit('join-session', { invitationId: currentInvitationId, userId });
    } catch (error) {
      console.error("Error starting session:", error);
    }
  };

  const handleJoinSession = async () => {
    if (!currentInvitationId) return alert("No active session found");

    try {
      const res = await fetch('http://localhost:3000/api/session/join', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitationId: currentInvitationId, userId })
      });
      
      if (!res.ok) return alert("No active session to join");

      setIsLive(true);
      setActiveTab('live');
      await joinCall();
      socket.emit('join-session', { invitationId: currentInvitationId, userId });
    } catch (error) {
      console.error("Error joining session:", error);
    }
  };

  const handleEndSession = async () => {
    try {
      await fetch('http://localhost:3000/api/session/end', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invitationId: currentInvitationId })
      });
      endCall();
      setIsLive(false);
    } catch (error) {
      console.error("Error ending session:", error);
    }
  };


  return (
    <div className="h-screen bg-[#0f172a] flex flex-col font-jakarta overflow-hidden text-slate-300">

      {/* --- 1. TOP HEADER BAR --- */}
      <header className="h-16 bg-[#1e293b]/50 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-50 shadow-2xl">
        <div className="flex items-center gap-6">
          <NavLink to="/dashboard" className="text-xl font-black text-white tracking-tighter hover:text-indigo-400 transition-colors">StudySync</NavLink>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex flex-col">
            <h1 className="text-sm font-black text-white leading-tight">DSA Practice Room</h1>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Session</span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Topic:</span>
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Data Structures & Algorithms</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {participants.slice(0, 3).map((p, i) => (
                <div key={i} className="w-7 h-7 rounded-full bg-slate-700 border-2 border-[#1e293b] flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                  {p.avatar}
                </div>
              ))}
            </div>
            <span className="text-xs font-bold text-slate-400">{participants.length} Online</span>
          </div>

          <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-xl border border-white/5 font-mono text-xs text-white">
            <FiClock className="text-emerald-400" />
            01:42:05
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-indigo-600/20">
              {sessionStorage.getItem('userName')?.split(' ').map(n => n[0]).join('') || 'U'}
            </div>
            <div className="hidden lg:block text-left leading-none">
              <p className="text-[10px] font-black text-white">{sessionStorage.getItem('userName') || 'User'}</p>
              <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest">Session Host</span>
            </div>
          </div>
        </div>
      </header>

      {/* --- 2. MAIN LAYOUT (3 COLUMN) --- */}
      <main className="flex-1 flex overflow-hidden">

        {/* LEFT SIDEBAR (Participants) */}
        <aside className="hidden lg:flex w-72 bg-[#0f172a] border-r border-white/5 flex-col">
          <div className="p-6 space-y-6">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Find participant..."
                className="w-full bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/30 transition-all"
              />
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
              <FiUserPlus /> Invite User
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 space-y-4 custom-scrollbar">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Participants</h3>
            {participants.map((p, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer p-2 hover:bg-white/5 rounded-xl transition-all">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-xs text-white">
                      {p.avatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#0f172a] ${p.status === 'online' ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{p.name}</p>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${p.role === 'Host' ? 'text-amber-500' : p.role === 'Student' ? 'text-indigo-400' : 'text-slate-500'
                      }`}>{p.role}</span>
                  </div>
                </div>
                <FiMoreVertical className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </aside>

        {/* CENTER (Main Interaction Area) */}
        <section className="flex-1 flex flex-col bg-[#050811] relative">
          {/* Tabs */}
          <div className="h-14 bg-[#1e293b]/20 border-b border-white/5 flex items-center px-8 gap-8 overflow-x-auto">
            <TabButton active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} icon={<FiMessageSquare />} label="Chat" />
            <TabButton active={activeTab === 'whiteboard'} onClick={() => setActiveTab('whiteboard')} icon={<FiEdit2 />} label="Whiteboard" />
            <TabButton active={activeTab === 'live'} onClick={() => setActiveTab('live')} icon={<FiVideo />} label="Live Session" />
            <TabButton active={activeTab === 'polls'} onClick={() => setActiveTab('polls')} icon={<FiBarChart2 />} label="Polls & Quiz" />
          </div>

          <div className="flex-1 overflow-hidden">
            {activeTab === 'chat' && <ChatTab />}
            {activeTab === 'whiteboard' && currentInvitationId && (
              <div className="h-full p-8 animate-fade-in">
                <Whiteboard socket={socket} invitationId={currentInvitationId} />
              </div>
            )}
            {activeTab === 'live' && (
              <LiveTab 
                isLive={isLive} 
                localVideoRef={localVideoRef} 
                remoteVideoRef={remoteVideoRef}
                onStart={handleStartSession}
                onJoin={handleJoinSession}
                onEnd={handleEndSession}
                onToggleMic={toggleAudio}
                onToggleCam={toggleVideo}
                onShareScreen={isScreenSharing ? stopScreenShare : startScreenShare}
                isMicMuted={isAudioMuted}
                isCamOff={isVideoOff}
                isSharing={isScreenSharing}
                hasRemoteStream={!!remoteStream}
              />
            )}
            {activeTab === 'polls' && <PollsTab />}
          </div>
        </section>

        {/* RIGHT SIDEBAR (Tools) */}
        <aside className="hidden xl:flex w-80 bg-[#0f172a] border-l border-white/5 flex-col overflow-y-auto custom-scrollbar">

          {/* Session Controls */}
          <div className="p-6 border-b border-white/5 space-y-4">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Session Controls</h3>
            <div className="grid grid-cols-2 gap-3">
              <ControlButton icon={<FiPlay />} label="Start" color="emerald" />
              <ControlButton icon={<FiSquare />} label="End" color="rose" />
              <ControlButton icon={<FiCoffee />} label="Break" color="amber" />
              <ControlButton icon={<FiLogOut />} label="Leave" color="slate" />
            </div>
          </div>

          {/* Resources */}
          <div className="p-6 border-b border-white/5 space-y-4">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Shared Resources</h3>
            <div className="space-y-3">
              <ResourceItem title="DSA_Quick_Ref.pdf" type="pdf" />
              <ResourceItem title="Graph_Algorithms.notes" type="doc" />
            </div>
          </div>

          {/* Leaderboard */}
          <div className="p-6 border-b border-white/5 space-y-4">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Leaderboard</h3>
            <div className="space-y-3">
              <LeaderboardUser rank={1} name="Sarah Ahmed" points={1250} />
              <LeaderboardUser rank={2} name="Ahsan Khan" points={1100} />
              <LeaderboardUser rank={3} name="Alex Johnson" points={950} />
            </div>
          </div>

          {/* Activity Feed */}
          <div className="p-6 space-y-4">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Activity Feed</h3>
            <div className="space-y-4">
              <ActivityItem text="Ahsan Khan pinned a message" time="2m ago" />
              <ActivityItem text="Sarah Ahmed joined the session" time="5m ago" />
              <ActivityItem text="New poll created: Big O Complexity" time="12m ago" />
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
};

// --- Sub-Components ---

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 h-full border-b-2 transition-all px-2 ${active ? 'border-indigo-500 text-white font-bold' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
  >
    <span className="text-lg">{icon}</span>
    <span className="text-[10px] uppercase tracking-widest">{label}</span>
  </button>
);

const ChatTab = () => (
  <div className="flex flex-col h-full animate-fade-in">
    <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
      <Message user="Sarah Ahmed" time="12:42" text="Has anyone tried the graph traversal question from last week?" />
      <Message user="Ahsan Khan" time="12:45" text="Yes, Sarah. I recommend using BFS for shortest path." code="function bfs(graph, start) {\n  const queue = [start];\n  // logic here\n}" />
      <Message user="Alex Johnson" time="12:46" text="I'm stuck on the adjacency list implementation." reactions={['👍', '💡']} />
    </div>
    <div className="p-6 bg-white/[0.02] border-t border-white/5">
      <div className="relative group max-w-4xl mx-auto">
        <input
          type="text"
          placeholder="Send a message to everyone..."
          className="w-full bg-[#1e293b] border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-indigo-500/40 transition-all shadow-inner"
        />
        <button className="absolute right-3 top-2.5 p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all">
          <FiSend />
        </button>
      </div>
    </div>
  </div>
);

const DiscussionTab = () => (
  <div className="h-full overflow-y-auto p-8 space-y-6 custom-scrollbar animate-fade-in">
    <QuestionCard
      title="How to optimize Dijkstra's for sparse graphs?"
      desc="I'm currently using a priority queue but it still feels slow on large data sets."
      tags={['DSA', 'Optimization']}
      author="Sarah Ahmed"
      votes={42}
      solved={true}
    />
    <QuestionCard
      title="React.memo vs useMemo: When to use which?"
      desc="I'm confused about the performance benefits when wrapping child components."
      tags={['React', 'Web Dev']}
      author="Alex Johnson"
      votes={12}
      solved={false}
    />
  </div>
);

const LiveTab = ({ 
  isLive, 
  localVideoRef, 
  remoteVideoRef, 
  onStart, 
  onJoin, 
  onEnd,
  onToggleMic,
  onToggleCam,
  onShareScreen,
  isMicMuted,
  isCamOff,
  isSharing,
  hasRemoteStream
}) => (
  <div className="h-full flex flex-col p-8 animate-fade-in overflow-hidden">
    {!isLive ? (
      <div className="max-w-4xl w-full aspect-video bg-[#1e293b] rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col items-center justify-center space-y-8 relative overflow-hidden group mx-auto my-auto">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-4xl text-slate-500 animate-pulse">
          <FiVideo />
        </div>
        <div className="text-center space-y-2 relative z-10">
          <h2 className="text-2xl font-black text-white">Join the Virtual Study Room</h2>
          <p className="text-slate-400 text-sm">Enable your camera and microphone to start collaborating.</p>
        </div>
        <div className="flex gap-4 relative z-10">
          <button onClick={onStart} className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-indigo-600/20 hover:scale-105 transition-all">
            <FiPlay fill="currentColor" /> Start Session
          </button>
          <button onClick={onJoin} className="flex items-center gap-3 px-6 py-4 bg-white/5 hover:bg-white/10 text-slate-300 rounded-2xl font-black uppercase tracking-widest text-[11px] border border-white/5 transition-all">
            Join Active Session
          </button>
        </div>
      </div>
    ) : (
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        {/* Video Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
          <div className="relative bg-[#1e293b] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl group">
            <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">You (Host)</span>
            </div>
            {isCamOff && (
              <div className="absolute inset-0 bg-[#0f172a] flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-3xl text-slate-600">
                  <FiVideoOff />
                </div>
              </div>
            )}
          </div>
          
          <div className="relative bg-[#1e293b] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl group">
            {hasRemoteStream ? (
              <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-2xl text-slate-600 animate-pulse">
                  <FiUsers />
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Waiting for partner...</p>
              </div>
            )}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Study Partner</span>
            </div>
          </div>
        </div>

        {/* Call Controls */}
        <div className="flex items-center justify-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-3xl backdrop-blur-xl">
          <button 
            onClick={onToggleMic}
            className={`p-4 rounded-2xl border transition-all ${isMicMuted ? 'bg-rose-500/20 border-rose-500/40 text-rose-400' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'}`}
          >
            {isMicMuted ? <FiMicOff /> : <FiMic />}
          </button>
          <button 
            onClick={onToggleCam}
            className={`p-4 rounded-2xl border transition-all ${isCamOff ? 'bg-rose-500/20 border-rose-500/40 text-rose-400' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'}`}
          >
            {isCamOff ? <FiVideoOff /> : <FiVideo />}
          </button>
          <button 
            onClick={onShareScreen}
            className={`p-4 rounded-2xl border transition-all ${isSharing ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'}`}
          >
            <FiMonitor />
          </button>
          <button 
            className="p-4 rounded-2xl border border-white/10 bg-white/5 text-rose-400 hover:bg-rose-500/10 transition-all"
            onClick={() => {/* Emit reaction */}}
          >
            <FiHeart />
          </button>
          <div className="h-6 w-px bg-white/10 mx-2" />
          <button 
            onClick={onEnd}
            className="px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-rose-600/20 transition-all flex items-center gap-2"
          >
            <FiLogOut /> End Session
          </button>
        </div>
      </div>
    )}
  </div>
);

const PollsTab = () => (
  <div className="h-full overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8 custom-scrollbar animate-fade-in">
    <PollCard
      question="What is the average time complexity of Quick Sort?"
      options={['O(n log n)', 'O(n^2)', 'O(n)', 'O(log n)']}
      votes={24}
    />
    <QuizCard
      title="Weekly Algorithm Quiz"
      progress={65}
      questionCount={10}
    />
  </div>
);

const Message = ({ user, time, text, code, reactions }) => (
  <div className="flex items-start gap-4 group">
    <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-xs text-white flex-shrink-0">
      {user.split(' ').map(n => n[0]).join('')}
    </div>
    <div className="flex-1 space-y-2">
      <div className="flex items-center gap-3">
        <span className="text-sm font-black text-white">{user}</span>
        <span className="text-[9px] text-slate-600 font-bold">{time}</span>
      </div>
      <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl rounded-tl-none text-sm leading-relaxed text-slate-300">
        {text}
        {code && (
          <pre className="mt-4 p-4 bg-black/40 rounded-xl font-mono text-[11px] text-indigo-300 overflow-x-auto border border-indigo-500/10">
            {code}
          </pre>
        )}
      </div>
      {reactions && (
        <div className="flex gap-2">
          {reactions.map((r, i) => (
            <span key={i} className="px-2 py-1 bg-white/5 rounded-lg text-xs cursor-pointer hover:bg-white/10 transition-colors border border-white/5">{r}</span>
          ))}
        </div>
      )}
    </div>
  </div>
);

const QuestionCard = ({ title, desc, tags, author, votes, solved }) => (
  <div className="p-6 bg-glass-dark border border-white/5 rounded-3xl space-y-4 hover:border-indigo-500/30 transition-all group">
    <div className="flex items-start gap-6">
      <div className="flex flex-col items-center gap-2 pt-1">
        <button className="p-2 hover:text-indigo-400 transition-colors"><FiThumbsUp /></button>
        <span className="text-xs font-black text-white">{votes}</span>
        <button className="p-2 hover:text-rose-400 transition-colors"><FiThumbsDown /></button>
      </div>
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-3">
          {solved && <FiCheckCircle className="text-emerald-500" />}
          <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">{title}</h3>
        </div>
        <p className="text-sm text-slate-400 line-clamp-2">{desc}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-500">{tag}</span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <span className="text-[10px] text-slate-600 font-bold">Asked by <span className="text-indigo-400">{author}</span></span>
          <button className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:underline">View Discussion</button>
        </div>
      </div>
    </div>
  </div>
);

const PollCard = ({ question, options, votes }) => (
  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-6 shadow-xl">
    <h4 className="text-sm font-bold text-white leading-relaxed">{question}</h4>
    <div className="space-y-3">
      {options.map((opt, i) => (
        <label key={i} className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl cursor-pointer hover:bg-indigo-500/10 hover:border-indigo-500/20 transition-all group">
          <input type="radio" name="poll" className="accent-indigo-500" />
          <span className="text-xs text-slate-300 group-hover:text-white transition-colors">{opt}</span>
        </label>
      ))}
    </div>
    <button className="w-full py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">
      Cast Vote
    </button>
  </div>
);

const QuizCard = ({ title, progress, questionCount }) => (
  <div className="p-6 bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/20 rounded-3xl space-y-6">
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <h4 className="text-lg font-black text-white">{title}</h4>
        <p className="text-xs text-indigo-300/60 font-bold">{questionCount} Questions</p>
      </div>
      <FiBarChart2 className="text-2xl text-indigo-400" />
    </div>
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white">
        <span>Overall Progress</span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 bg-black/30 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${progress}%` }} />
      </div>
    </div>
    <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-50 transition-colors">
      Continue Quiz
    </button>
  </div>
);

const ControlButton = ({ icon, label, color }) => {
  const colors = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20',
    slate: 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10'
  };
  return (
    <button className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all gap-2 ${colors[color]}`}>
      <span className="text-lg">{icon}</span>
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
};

const ResourceItem = ({ title, type }) => (
  <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5 group hover:border-indigo-500/30 transition-all">
    <div className="flex items-center gap-3 overflow-hidden">
      <FiFolder className={type === 'pdf' ? 'text-rose-400' : 'text-indigo-400'} />
      <span className="text-[11px] font-bold text-slate-300 truncate">{title}</span>
    </div>
    <div className="flex gap-2">
      <FiBookmark className="text-slate-600 hover:text-amber-500 cursor-pointer transition-colors" />
      <FiChevronRight className="text-slate-600" />
    </div>
  </div>
);

const LeaderboardUser = ({ rank, name, points }) => (
  <div className="flex items-center justify-between p-3 bg-white/[0.02] rounded-xl border border-white/5">
    <div className="flex items-center gap-3">
      <span className={`text-[10px] font-black ${rank === 1 ? 'text-amber-400' : rank === 2 ? 'text-slate-400' : 'text-amber-700'}`}>#{rank}</span>
      <span className="text-xs font-bold text-slate-300">{name}</span>
    </div>
    <span className="text-[10px] font-black text-indigo-400">{points} pts</span>
  </div>
);

const ActivityItem = ({ text, time }) => (
  <div className="space-y-1">
    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{text}</p>
    <span className="text-[9px] text-slate-600 font-bold uppercase">{time}</span>
  </div>
);

export default StudySession;
