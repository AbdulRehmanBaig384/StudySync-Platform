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
import { NavLink, useParams } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useWebRTC } from '../hooks/useWebRTC';
import Whiteboard from '../components/Whiteboard';
import InviteModal from '../components/InviteModal';

const StudySession = () => {
  const { sessionId } = useParams();
  const [activeTab, setActiveTab] = useState('chat');
  const [isLive, setIsLive] = useState(false);
  const [session, setSession] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  
  const userId = localStorage.getItem('userId');
  const userEmail = localStorage.getItem('userEmail');
  const { socket } = useSocket();

  const {
    localStream,
    remoteStreams,
    localVideoRef,
    isAudioMuted,
    isVideoOff,
    isScreenSharing,
    initLocalStream,
    toggleAudio,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
    endCall,
  } = useWebRTC(socket, sessionId, userId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionRes, messagesRes] = await Promise.all([
          fetch(`http://localhost:3000/api/session/${sessionId}`),
          fetch(`http://localhost:3000/api/session/messages/${sessionId}`)
        ]);
        
        const sessionData = await sessionRes.json();
        const messagesData = await messagesRes.json();

        if (sessionRes.ok) {
          setSession(sessionData);
          setParticipants(sessionData.participants);
          setMessages(messagesData);
          
          // Join socket room
          socket?.emit('join_study_session', { sessionId, userId, userEmail });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId && socket) fetchData();
  }, [sessionId, socket, userId, userEmail]);

  useEffect(() => {
    if (!socket) return;

    socket.on('receive_session_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('participant_joined', (data) => {
      // Re-fetch session to get updated participants list
      fetch(`http://localhost:3000/api/session/${sessionId}`)
        .then(res => res.json())
        .then(data => setParticipants(data.participants));
    });

    socket.on('invitation_response', (data) => {
      // Optional: Show a toast notification to the host
      console.log(`Invitation ${data.status} by user ${data.receiverId}`);
    });

    socket.on('participant_left', (data) => {
      setParticipants(prev => prev.filter(p => p._id !== data.userId));
    });

    socket.on('user_session_typing', (data) => {
      if (data.userId !== userId) setPartnerTyping(true);
    });

    socket.on('user_session_stop_typing', (data) => {
      if (data.userId !== userId) setPartnerTyping(false);
    });

    return () => {
      socket.off('receive_session_message');
      socket.off('participant_joined');
      socket.off('invitation_response');
      socket.off('participant_left');
      socket.off('user_session_typing');
      socket.off('user_session_stop_typing');
    };
  }, [socket, sessionId, userId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const res = await fetch('http://localhost:3000/api/session/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, senderId: userId, message: newMessage })
      });
      const savedMsg = await res.json();
      if (res.ok) {
        socket.emit('send_session_message', savedMsg);
        setNewMessage('');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleStartSession = async () => {
    setIsLive(true);
    setActiveTab('live');
    await initLocalStream();
  };

  const handleEndSession = async () => {
    if (userId !== session.host._id) return alert("Only host can end the session");
    
    try {
      await fetch(`http://localhost:3000/api/session/end/${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      endCall();
      setIsLive(false);
    } catch (error) {
      console.error(error);
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
            <h1 className="text-sm font-black text-white leading-tight">{session?.name || 'Loading Room...'}</h1>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Session</span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Topic:</span>
          <span className="text-[10px] font-black text-white uppercase tracking-widest">{session?.topic || 'N/A'}</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {participants.slice(0, 3).map((p, i) => (
                <div key={i} className="w-7 h-7 rounded-full bg-slate-700 border-2 border-[#1e293b] flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                  {p.Firstname?.[0]}
                </div>
              ))}
            </div>
            <span className="text-xs font-bold text-slate-400">{participants.length} Online</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-indigo-600/20">
              {session?.host?.Firstname?.[0]}
            </div>
            <div className="hidden lg:block text-left leading-none">
              <p className="text-[10px] font-black text-white">{session?.host?.Firstname} {session?.host?.lastname}</p>
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
            <button 
              onClick={() => setIsInviteModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
            >
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
                      {p.Firstname?.[0]}{p.lastname?.[0]}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#0f172a] ${p.onlineStatus === 'online' ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{p.Firstname} {p.lastname}</p>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${p._id === session?.host?._id ? 'text-amber-500' : 'text-indigo-400'}`}>
                      {p._id === session?.host?._id ? 'Host' : 'Student'}
                    </span>
                  </div>
                </div>
                {userId === session?.host?._id && p._id !== userId && (
                  <button className="text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-rose-500/10 rounded-lg">
                    &times;
                  </button>
                )}
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
            {activeTab === 'chat' && (
              <ChatTab 
                messages={messages} 
                onSendMessage={handleSendMessage} 
                newMessage={newMessage} 
                setNewMessage={setNewMessage}
                partnerTyping={partnerTyping}
              />
            )}
            {activeTab === 'whiteboard' && sessionId && (
              <div className="h-full p-8 animate-fade-in">
                <Whiteboard socket={socket} invitationId={sessionId} />
              </div>
            )}
            {activeTab === 'live' && (
              <LiveTab 
                isLive={isLive} 
                localVideoRef={localVideoRef} 
                remoteStreams={remoteStreams}
                onStart={handleStartSession}
                onEnd={handleEndSession}
                onToggleMic={toggleAudio}
                onToggleCam={toggleVideo}
                onShareScreen={isScreenSharing ? stopScreenShare : startScreenShare}
                isMicMuted={isAudioMuted}
                isCamOff={isVideoOff}
                isSharing={isScreenSharing}
                isHost={userId === session?.host?._id}
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

      <InviteModal 
        sessionId={sessionId}
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        userId={userId}
      />
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

const ChatTab = ({ messages, onSendMessage, newMessage, setNewMessage, partnerTyping }) => (
  <div className="flex flex-col h-full animate-fade-in">
    <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full opacity-20">
          <FiMessageSquare className="text-6xl mb-4" />
          <p className="font-black uppercase tracking-widest text-sm">No messages yet</p>
        </div>
      ) : (
        messages.map((msg, i) => (
          <Message 
            key={i} 
            user={`${msg.senderId?.Firstname} ${msg.senderId?.lastname}`} 
            time={new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
            text={msg.message} 
          />
        ))
      )}
      {partnerTyping && (
        <div className="flex items-center gap-2 text-indigo-400 animate-pulse ml-12">
          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
        </div>
      )}
    </div>
    <div className="p-6 bg-white/[0.02] border-t border-white/5">
      <form onSubmit={onSendMessage} className="relative group max-w-4xl mx-auto">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Send a message to everyone..."
          className="w-full bg-[#1e293b] border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-indigo-500/40 transition-all shadow-inner"
        />
        <button type="submit" className="absolute right-3 top-2.5 p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all">
          <FiSend />
        </button>
      </form>
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
  remoteStreams, 
  onStart, 
  onEnd,
  onToggleMic,
  onToggleCam,
  onShareScreen,
  isMicMuted,
  isCamOff,
  isSharing,
  isHost
}) => (
  <div className="h-full flex flex-col p-8 animate-fade-in overflow-hidden">
    {!isLive ? (
      <div className="max-w-4xl w-full aspect-video bg-[#1e293b] rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col items-center justify-center space-y-8 relative overflow-hidden group mx-auto my-auto">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-4xl text-slate-500 animate-pulse">
          <FiVideo />
        </div>
        <div className="text-center space-y-2 relative z-10">
          <h2 className="text-2xl font-black text-white">Group Video Session</h2>
          <p className="text-slate-400 text-sm">Join the collaborative room with your camera and mic.</p>
        </div>
        <div className="flex gap-4 relative z-10">
          <button onClick={onStart} className="flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-indigo-600/20 hover:scale-105 transition-all">
            <FiPlay fill="currentColor" /> Enter Session
          </button>
        </div>
      </div>
    ) : (
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        {/* Multi-Video Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-0 overflow-y-auto p-2 custom-scrollbar">
          {/* Local Video */}
          <div className="relative aspect-video bg-[#1e293b] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl group">
            <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">You {isHost ? '(Host)' : ''}</span>
            </div>
            {isCamOff && (
              <div className="absolute inset-0 bg-[#0f172a] flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-2xl text-slate-600">
                  <FiVideoOff />
                </div>
              </div>
            )}
          </div>
          
          {/* Remote Videos */}
          {Object.entries(remoteStreams).map(([peerId, stream]) => (
            <RemoteVideo key={peerId} stream={stream} peerId={peerId} />
          ))}

          {Object.keys(remoteStreams).length === 0 && (
            <div className="relative aspect-video bg-white/[0.02] border border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center gap-4">
              <FiUsers className="text-4xl text-slate-700" />
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Waiting for others...</p>
            </div>
          )}
        </div>

        {/* Call Controls */}
        <div className="flex items-center justify-center gap-4 bg-[#1e293b]/50 border border-white/5 p-4 rounded-3xl backdrop-blur-xl max-w-2xl mx-auto w-full">
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
          <div className="h-6 w-px bg-white/10 mx-2" />
          <button 
            onClick={onEnd}
            className={`px-8 py-4 ${isHost ? 'bg-rose-600 hover:bg-rose-500' : 'bg-slate-700 hover:bg-slate-600'} text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl transition-all flex items-center gap-2`}
          >
            <FiLogOut /> {isHost ? 'End Session' : 'Leave Session'}
          </button>
        </div>
      </div>
    )}
  </div>
);

const RemoteVideo = ({ stream, peerId }) => {
  const videoRef = React.useRef();
  React.useEffect(() => {
    if (videoRef.current && stream) videoRef.current.srcObject = stream;
  }, [stream]);

  return (
    <div className="relative aspect-video bg-[#1e293b] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl group">
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
        <span className="text-[10px] font-black text-white uppercase tracking-widest">Participant</span>
      </div>
    </div>
  );
};

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
