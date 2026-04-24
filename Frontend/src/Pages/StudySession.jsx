import React, { useState } from 'react';
import {
  FiUsers,
  FiMessageSquare,
  FiVideo,
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
  FiMic,
  FiMonitor,
  FiChevronRight
  // FiHand
} from 'react-icons/fi';
import { NavLink } from 'react-router-dom';

const StudySession = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [isLive, setIsLive] = useState(false);

  // Mock Data
  const participants = [
    { name: 'Ahsan Khan', role: 'Host', status: 'online', avatar: 'AK' },
    { name: 'Sarah Ahmed', role: 'Student', status: 'online', avatar: 'SA' },
    { name: 'Alex Johnson', role: 'Student', status: 'online', avatar: 'AJ' },
    { name: 'Michael Chen', role: 'Viewer', status: 'offline', avatar: 'MC' },
  ];

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
            <span className="text-xs font-bold text-slate-400">12+ Online</span>
          </div>

          <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-xl border border-white/5 font-mono text-xs text-white">
            <FiClock className="text-emerald-400" />
            01:42:05
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-indigo-600/20">
              AK
            </div>
            <div className="hidden lg:block text-left leading-none">
              <p className="text-[10px] font-black text-white">Ahsan Khan</p>
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
            <TabButton active={activeTab === 'discussion'} onClick={() => setActiveTab('discussion')} icon={<FiHelpCircle />} label="Discussion" />
            <TabButton active={activeTab === 'live'} onClick={() => setActiveTab('live')} icon={<FiVideo />} label="Live Session" />
            <TabButton active={activeTab === 'polls'} onClick={() => setActiveTab('polls')} icon={<FiBarChart2 />} label="Polls & Quiz" />
          </div>

          <div className="flex-1 overflow-hidden">
            {activeTab === 'chat' && <ChatTab />}
            {activeTab === 'discussion' && <DiscussionTab />}
            {activeTab === 'live' && <LiveTab />}
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

const LiveTab = () => (
  <div className="h-full flex items-center justify-center p-8 animate-fade-in">
    <div className="max-w-4xl w-full aspect-video bg-[#1e293b] rounded-[2.5rem] border border-white/5 shadow-2xl flex flex-col items-center justify-center space-y-8 relative overflow-hidden group">
      {/* Background Pulse */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-4xl text-slate-500 animate-pulse">
        <FiVideo />
      </div>

      <div className="text-center space-y-2 relative z-10">
        <h2 className="text-2xl font-black text-white">Join the Virtual Study Room</h2>
        <p className="text-slate-400 text-sm">Enable your camera and microphone to start collaborating.</p>
      </div>

      <div className="flex gap-4 relative z-10">
        <button className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl shadow-indigo-600/20 hover:scale-105 transition-all">
          <FiPlay fill="currentColor" /> Join Session
        </button>
        <button className="flex items-center gap-3 px-6 py-4 bg-white/5 hover:bg-white/10 text-slate-300 rounded-2xl font-black uppercase tracking-widest text-[11px] border border-white/5 transition-all">
          <FiMonitor /> Share Screen
        </button>
      </div>

      <div className="flex gap-6 pt-12 relative z-10 opacity-40">
        <div className="p-4 bg-white/5 rounded-full"><FiMic /></div>
        <div className="p-4 bg-white/5 rounded-full"><FiHand /></div>
      </div>
    </div>
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
