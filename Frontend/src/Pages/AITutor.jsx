import React, { useState, useEffect } from 'react';
import { 
  FiSend, 
  FiPlus, 
  FiSearch, 
  FiMessageCircle, 
  FiZap, 
  FiBook, 
  FiClock, 
  FiStar, 
  FiDownload, 
  FiCopy, 
  FiTrash2, 
  FiCheckCircle, 
  FiTrendingUp, 
  FiCpu, 
  FiActivity,
  FiEdit,
  FiLayers,
  FiShare2,
  FiMic,
  FiVolume2,
  FiHelpCircle
} from 'react-icons/fi';
import DashboardLayout from '../components/DashboardLayout';

const AITutor = () => {
  const [activeChat, setActiveChat] = useState(1);
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', text: "Hello Ahsan! I've analyzed your recent coding room sessions. You're making great progress in React, but I noticed some hesitation with 'useEffect' dependencies. Would you like to do a quick 5-minute deep dive or generate some practice questions?", type: 'text' }
  ]);
  const [inputText, setInputText] = useState('');

  const history = [
    { id: 1, title: 'React Performance Hooks', category: 'Web Dev', date: 'Just now' },
    { id: 2, title: 'Dijkstra Algorithm Help', category: 'DSA', date: 'Yesterday' },
    { id: 3, title: 'Database Normalization', category: 'DBMS', date: '2 days ago' },
  ];

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg = { id: messages.length + 1, role: 'user', text: inputText, type: 'text' };
    setMessages([...messages, newMsg]);
    setInputText('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiMsg = { 
        id: messages.length + 2, 
        role: 'ai', 
        text: "That's a great question! Here's a quick interactive quiz to test your understanding of what we just discussed.", 
        type: 'quiz',
        quiz: {
          question: "Which hook should you use to store a persistent value that doesn't trigger a re-render?",
          options: ["useState", "useMemo", "useRef", "useEffect"],
          answer: "useRef"
        }
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-160px)] bg-glass-dark rounded-[2.5rem] border border-white/5 overflow-hidden animate-fade-in shadow-2xl relative">
        
        {/* --- 1. LEFT SIDEBAR: CHAT HISTORY --- */}
        <aside className="w-80 border-r border-white/5 bg-white/[0.01] flex flex-col hidden lg:flex">
          <div className="p-6 space-y-6">
            <button className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all">
              <FiPlus /> New Session
            </button>
            
            <div className="relative group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                className="w-full bg-black/20 border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500/30 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 space-y-6 custom-scrollbar">
            <div className="space-y-2">
              <h3 className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Recent Chats</h3>
              {history.map((chat) => (
                <div 
                  key={chat.id}
                  onClick={() => setActiveChat(chat.id)}
                  className={`group flex flex-col gap-1 p-4 rounded-2xl cursor-pointer transition-all ${activeChat === chat.id ? 'bg-indigo-600/10 border border-indigo-500/20' : 'hover:bg-white/5'}`}
                >
                  <div className="flex items-center justify-between">
                    <p className={`text-xs font-bold truncate ${activeChat === chat.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>{chat.title}</p>
                    <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">{chat.category}</span>
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-slate-600 font-bold uppercase">
                    <span>{chat.date}</span>
                    <FiMessageCircle className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-indigo-600/5 border-t border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg">
                <FiZap />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-white uppercase tracking-widest">7 Day Streak!</p>
                <div className="h-1.5 bg-black/30 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-amber-500 w-[70%]" />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* --- 2. MAIN CHAT AREA --- */}
        <section className="flex-1 flex flex-col bg-[#050811]/30 relative">
          
          {/* Chat Header */}
          <header className="h-16 px-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <FiCpu />
              </div>
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-tight">AI Tutor Pro</h2>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Neural Engine Online</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-2.5 bg-white/5 text-slate-400 hover:text-white rounded-xl border border-white/5 transition-all"><FiDownload /></button>
              <button className="p-2.5 bg-white/5 text-slate-400 hover:text-white rounded-xl border border-white/5 transition-all"><FiShare2 /></button>
              <div className="h-6 w-px bg-white/10 mx-1" />
              <button className="p-2.5 bg-white/5 text-slate-400 hover:text-white rounded-xl border border-white/5 transition-all"><FiHelpCircle /></button>
            </div>
          </header>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} group animate-slide-up`}>
                <div className={`flex items-center gap-3 mb-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-lg ${msg.role === 'ai' ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                    {msg.role === 'ai' ? <FiCpu /> : 'A'}
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{msg.role === 'ai' ? 'StudySync AI' : 'You'}</span>
                </div>
                
                <div className={`max-w-[85%] p-5 rounded-[2rem] border transition-all ${
                  msg.role === 'ai' 
                    ? 'bg-glass-dark border-white/5 rounded-tl-none text-slate-200' 
                    : 'bg-indigo-600 border-indigo-500/30 rounded-tr-none text-white shadow-xl shadow-indigo-600/10'
                }`}>
                  <p className="text-sm leading-relaxed font-medium">{msg.text}</p>
                  
                  {msg.type === 'quiz' && (
                    <div className="mt-6 p-6 bg-black/30 rounded-3xl border border-white/10 space-y-4">
                      <h4 className="text-xs font-bold text-indigo-300">Quick Test: {msg.quiz.question}</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {msg.quiz.options.map((opt, i) => (
                          <button key={i} className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] hover:bg-white/10 transition-all font-medium">{opt}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.role === 'ai' && (
                    <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ActionBtn icon={<FiEdit />} label="Save Note" />
                      <ActionBtn icon={<FiStar />} label="Highlight" />
                      <ActionBtn icon={<FiCopy />} label="Copy" />
                      <ActionBtn icon={<FiVolume2 />} label="Read Aloud" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-8 bg-white/[0.01] border-t border-white/5">
            <div className="max-w-4xl mx-auto relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button className="p-2 text-slate-500 hover:text-indigo-400 transition-colors"><FiMic /></button>
              </div>
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything about your subjects..." 
                className="w-full bg-[#1e293b]/50 border border-white/10 group-focus-within:border-indigo-500/40 rounded-3xl pl-14 pr-16 py-5 text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all shadow-inner"
              />
              <button 
                onClick={handleSendMessage}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all"
              >
                <FiSend />
              </button>
            </div>
            <p className="text-center text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-4">AI can make mistakes. Verify important information.</p>
          </div>
        </section>

        {/* --- 3. RIGHT SIDEBAR: SMART INSIGHTS --- */}
        <aside className="w-[320px] xl:w-[400px] border-l border-white/5 bg-white/[0.01] flex flex-col hidden xl:flex">
          <div className="p-8 space-y-10 overflow-y-auto custom-scrollbar">
            
            {/* Learning Progress */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <FiActivity className="text-indigo-400" /> Neural Insights
              </h3>
              <div className="p-6 bg-gradient-to-br from-indigo-600/10 to-violet-600/10 rounded-[2.5rem] border border-indigo-500/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Weak Topic Detected</span>
                  <FiTrendingUp className="text-rose-400" />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-medium italic">"I noticed you're struggling with Recursion time complexity. Would you like a step-by-step walkthrough?"</p>
                <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-400 transition-all border border-indigo-500/20">
                  Start Deep Dive
                </button>
              </div>
            </div>

            {/* Smart Suggestions */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <FiStar className="text-amber-500" /> Recommended For You
              </h3>
              <div className="space-y-3">
                <SuggestionCard title="Mastering useEffect" type="Flashcards" count="15 Cards" />
                <SuggestionCard title="Binary Tree Basics" type="Mini Quiz" count="5 Questions" />
                <SuggestionCard title="SQL Joins Practice" type="Exercises" count="10 Tasks" />
              </div>
            </div>

            {/* Saved Resources Preview */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <FiBook className="text-emerald-400" /> Recent Notes
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-indigo-500/20 transition-all cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400"><FiCheckCircle /></div>
                  <div>
                    <p className="text-[11px] font-bold text-white">Dijkstra Logic</p>
                    <span className="text-[9px] text-slate-600 uppercase font-black">Saved 1h ago</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </aside>

      </div>
    </DashboardLayout>
  );
};

// --- Sub-Components ---

const ActionBtn = ({ icon, label }) => (
  <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-400 transition-colors">
    <span className="text-xs">{icon}</span> {label}
  </button>
);

const SuggestionCard = ({ title, type, count }) => (
  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-indigo-500/30 transition-all cursor-pointer">
    <div className="flex items-center gap-4">
      <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
        <FiLayers />
      </div>
      <div>
        <p className="text-[11px] font-bold text-white">{title}</p>
        <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">{type} • {count}</span>
      </div>
    </div>
    <FiZap className="text-slate-700 group-hover:text-amber-500 transition-colors" />
  </div>
);

export default AITutor;
