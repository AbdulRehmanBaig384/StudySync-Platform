import React, { useState, useEffect, useRef } from 'react';
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
  FiHelpCircle,
  FiImage,
  FiX
} from 'react-icons/fi';
import DashboardLayout from '../components/DashboardLayout';
import { postAiChat } from '../Services/apiClient';

const AITutor = () => {
  // --- State for Session Management ---
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('studySync_ai_sessions');
    return saved ? JSON.parse(saved) : [
      {
        id: 'default',
        title: 'New Session',
        category: 'General',
        date: new Date().toLocaleDateString(),
        messages: [
          { id: 1, role: 'ai', text: "Hello! I'm your StudySync AI Tutor. How can I help you with your studies today?", type: 'text' }
        ]
      }
    ];
  });
  
  const [activeSessionId, setActiveSessionId] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  
  // --- Input State ---
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [chatError, setChatError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // --- Refs ---
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // --- Derived Data ---
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const filteredSessions = sessions.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem('studySync_ai_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // --- Auto-scroll ---
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession.messages, isSending]);

  // --- Textarea Auto-resize ---
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [inputText]);

  // --- Handlers ---
  const handleNewSession = () => {
    const newId = Date.now().toString();
    const newSession = {
      id: newId,
      title: 'New Session',
      category: 'General',
      date: new Date().toLocaleDateString(),
      messages: [
        { id: 1, role: 'ai', text: "New session started. What are we studying today?", type: 'text' }
      ]
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newId);
    setInputText('');
    setChatError('');
  };

  const deleteSession = (id, e) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== id);
    if (updated.length === 0) {
      handleNewSession();
    } else {
      setSessions(updated);
      if (activeSessionId === id) {
        setActiveSessionId(updated[0].id);
      }
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(prev => prev + (prev ? ' ' : '') + transcript);
    };

    recognition.start();
  };

  const handleSendMessage = async () => {
    if ((!inputText.trim() && !selectedImage) || isSending) return;

    const userText = inputText.trim();
    const currentImg = imagePreview;
    
    // 1. Create User Message
    const userMsg = { 
      id: Date.now(), 
      role: 'user', 
      text: userText, 
      image: currentImg,
      type: 'text' 
    };

    // 2. Update Session Messages and Title (if first prompt)
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        const isFirstPrompt = s.messages.length <= 1;
        return {
          ...s,
          title: isFirstPrompt ? (userText.slice(0, 30) + (userText.length > 30 ? '...' : '')) : s.title,
          messages: [...s.messages, userMsg]
        };
      }
      return s;
    }));

    setInputText('');
    removeImage();
    setChatError('');
    setIsSending(true);

    try {
      // Note: Backend current logic only takes 'message' string.
      // We send the text but keep the image in the UI for persistence.
      const data = await postAiChat(userText || "[Image Reference]");
      
      const aiMsg = {
        id: Date.now() + 1,
        role: 'ai',
        text: data.reply,
        type: 'text',
      };

      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return { ...s, messages: [...s.messages, aiMsg] };
        }
        return s;
      }));
    } catch (error) {
      setChatError(error.message || 'AI request failed');
      const errorMsg = {
        id: Date.now() + 1,
        role: 'ai',
        text: 'Sorry, I encountered an issue while processing your request. Please check your connection and try again.',
        type: 'text',
      };
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return { ...s, messages: [...s.messages, errorMsg] };
        }
        return s;
      }));
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-160px)] bg-glass-dark rounded-[2.5rem] border border-white/5 overflow-hidden animate-fade-in shadow-2xl relative">

        {/* --- 1. LEFT SIDEBAR: CHAT HISTORY --- */}
        <aside className="hidden w-80 border-r border-white/5 bg-white/[0.01] lg:flex lg:flex-col">
          <div className="p-6 space-y-6">
            <button 
              onClick={handleNewSession}
              className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all group"
            >
              <FiPlus className="group-hover:rotate-90 transition-transform duration-300" /> New Session
            </button>

            <div className="relative group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full bg-black/20 border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500/30 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 space-y-6 custom-scrollbar pb-6">
            <div className="space-y-2">
              <h3 className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Recent Chats</h3>
              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => setActiveSessionId(session.id)}
                  className={`group flex flex-col gap-1 p-4 rounded-2xl cursor-pointer transition-all relative ${activeSessionId === session.id ? 'bg-indigo-600/10 border border-indigo-500/20 shadow-lg shadow-indigo-600/5' : 'hover:bg-white/5'}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs font-bold truncate flex-1 ${activeSessionId === session.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                      {session.title}
                    </p>
                    <button 
                      onClick={(e) => deleteSession(session.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-rose-500/20 hover:text-rose-400 rounded-lg text-slate-500 transition-all"
                    >
                      <FiTrash2 size={12} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-slate-600 font-bold uppercase">
                    <span>{session.date}</span>
                    <FiMessageCircle className={activeSessionId === session.id ? 'text-indigo-400' : 'opacity-0 group-hover:opacity-100'} />
                  </div>
                </div>
              ))}
              {filteredSessions.length === 0 && (
                <p className="text-center text-[10px] text-slate-600 py-10 font-bold uppercase">No chats found</p>
              )}
            </div>
          </div>

          <div className="p-6 bg-indigo-600/5 border-t border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg">
                <FiZap />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Global Rank: #42</p>
                <div className="h-1.5 bg-black/30 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-amber-500 w-[85%] transition-all duration-1000" />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* --- 2. MAIN CHAT AREA --- */}
        <section className="flex-1 flex flex-col bg-[#050811]/30 relative">

          {/* Chat Header */}
          <header className="h-16 px-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01] backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 animate-pulse-subtle">
                <FiCpu />
              </div>
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-tight">AI Tutor Pro</h2>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Core 3.0 Active</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button title="Export Conversation" className="p-2.5 bg-white/5 text-slate-400 hover:text-white rounded-xl border border-white/5 hover:border-indigo-500/30 transition-all"><FiDownload /></button>
              <button title="Share Session" className="p-2.5 bg-white/5 text-slate-400 hover:text-white rounded-xl border border-white/5 hover:border-indigo-500/30 transition-all"><FiShare2 /></button>
              <div className="h-6 w-px bg-white/10 mx-1" />
              <button title="Help Center" className="p-2.5 bg-white/5 text-slate-400 hover:text-white rounded-xl border border-white/5 hover:border-indigo-500/30 transition-all"><FiHelpCircle /></button>
            </div>
          </header>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar scroll-smooth">
            {activeSession.messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} group animate-slide-up`}>
                <div className={`flex items-center gap-3 mb-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-lg ${msg.role === 'ai' ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                    {msg.role === 'ai' ? <FiCpu /> : 'A'}
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{msg.role === 'ai' ? 'StudySync AI' : 'You'}</span>
                </div>

                <div className={`max-w-[85%] p-5 rounded-[2rem] border transition-all shadow-xl ${msg.role === 'ai'
                    ? 'bg-glass-dark border-white/5 rounded-tl-none text-slate-200'
                    : 'bg-indigo-600 border-indigo-500/30 rounded-tr-none text-white shadow-indigo-600/10'
                  }`}>
                  {msg.image && (
                    <div className="mb-4 rounded-2xl overflow-hidden border border-white/10 max-h-60">
                      <img src={msg.image} alt="Uploaded content" className="w-full h-full object-contain bg-black/20" />
                    </div>
                  )}
                  <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap">{msg.text}</p>

                  {msg.role === 'ai' && (
                    <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ActionBtn icon={<FiEdit />} label="Save" />
                      <ActionBtn icon={<FiCopy />} label="Copy" />
                      <ActionBtn icon={<FiVolume2 />} label="Speak" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isSending && (
              <div className="flex flex-col items-start animate-slide-up">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-lg animate-pulse">
                    <FiCpu />
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AI is thinking...</span>
                </div>
                <div className="bg-glass-dark border border-white/5 rounded-[2rem] rounded-tl-none p-5 text-slate-200 shadow-xl">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-8 bg-white/[0.01] border-t border-white/5 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto space-y-4">
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="relative inline-block group animate-scale-in">
                  <img src={imagePreview} alt="Preview" className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500 shadow-lg shadow-indigo-600/20" />
                  <button 
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow-lg hover:scale-110 transition-transform"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              )}

              <div className="relative group flex items-end gap-4">
                <div className="flex-1 relative">
                  <div className="absolute left-4 bottom-5 flex items-center gap-3 text-slate-500">
                    <button 
                      onClick={handleVoiceInput}
                      className={`p-2 rounded-xl transition-all ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'hover:text-indigo-400 hover:bg-white/5'}`}
                      title="Voice Input"
                    >
                      <FiMic size={18} />
                    </button>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 rounded-xl hover:text-indigo-400 hover:bg-white/5 transition-all"
                      title="Upload Image"
                    >
                      <FiImage size={18} />
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageSelect} 
                      accept="image/*" 
                      className="hidden" 
                    />
                  </div>
                  
                  <textarea
                    ref={textareaRef}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    placeholder={isListening ? "Listening..." : "Ask me anything about your subjects..."}
                    className="w-full bg-[#1e293b]/50 border border-white/10 group-focus-within:border-indigo-500/40 rounded-3xl pl-24 pr-16 py-5 text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all shadow-inner custom-scrollbar resize-none overflow-y-auto"
                  />
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={isSending || (!inputText.trim() && !selectedImage)}
                    className={`absolute right-3 bottom-3 p-3 text-white rounded-2xl shadow-lg transition-all ${
                      (isSending || (!inputText.trim() && !selectedImage)) 
                        ? 'bg-slate-700 opacity-50 cursor-not-allowed' 
                        : 'bg-indigo-600 shadow-indigo-600/30 hover:scale-105 active:scale-95'
                    }`}
                  >
                    <FiSend />
                  </button>
                </div>
              </div>
              
              {chatError && (
                <p className="text-center text-[10px] text-red-400 font-semibold animate-shake">{chatError}</p>
              )}
              <p className="text-center text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                Press Enter to send • Shift + Enter for new line • AI can make mistakes
              </p>
            </div>
          </div>
        </section>

        {/* --- 3. RIGHT SIDEBAR: SMART INSIGHTS --- */}
        <aside className="hidden w-[320px] border-l border-white/5 bg-white/[0.01] xl:flex xl:w-[400px] xl:flex-col">
          <div className="p-8 space-y-10 overflow-y-auto custom-scrollbar">

            {/* Learning Progress */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <FiActivity className="text-indigo-400" /> Neural Insights
              </h3>
              <div className="p-6 bg-gradient-to-br from-indigo-600/10 to-violet-600/10 rounded-[2.5rem] border border-indigo-500/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Concept Mastery</span>
                  <FiTrendingUp className="text-emerald-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                    <span>React Hooks</span>
                    <span className="text-indigo-400">92%</span>
                  </div>
                  <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[92%]" />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium">You've mastered useEffect! I recommend focusing on <span className="text-white">useMemo</span> and <span className="text-white">useCallback</span> next.</p>
              </div>
            </div>

            {/* Smart Suggestions */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <FiStar className="text-amber-500" /> Recommended For You
              </h3>
              <div className="space-y-3">
                <SuggestionCard title="State Management" type="Flashcards" count="24 Cards" />
                <SuggestionCard title="DOM Manipulation" type="Mini Quiz" count="8 Questions" />
                <SuggestionCard title="CSS Grid & Flexbox" type="Exercises" count="12 Tasks" />
              </div>
            </div>

            {/* AI Settings Quick Access */}
            <div className="space-y-6 pt-4 border-t border-white/5">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tutor Settings</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform"><FiLayers /></div>
                  <span className="text-[9px] font-black text-white uppercase">Focus Mode</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform"><FiClock /></div>
                  <span className="text-[9px] font-black text-white uppercase">History</span>
                </button>
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
