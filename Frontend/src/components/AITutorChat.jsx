import React, { useState } from 'react';
import { FiSend, FiCpu, FiUser } from 'react-icons/fi';
import { postAiChat } from '../Services/apiClient';

const AITutorChat = () => {
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', content: 'Hello! I am your StudySync AI Tutor. How can I help you with your studies today?' },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [chatError, setChatError] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const userText = input.trim();
    const userMsg = { id: Date.now(), role: 'user', content: userText };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setChatError('');
    setIsSending(true);

    try {
      const data = await postAiChat(userText);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'ai',
          content: data.reply,
        },
      ]);
    } catch (error) {
      setChatError(error.message || 'AI request failed');
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'ai',
          content: 'Sorry, I could not respond right now. Please try again.',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-glass-dark rounded-3xl shadow-xl border border-white/5 flex flex-col h-[500px] overflow-hidden">
      <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-indigo-500/20">
            <FiCpu />
          </div>
          <div>
            <h3 className="font-black text-white font-jakarta">AI Tutor Assistant</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Active Now</p>
            </div>
          </div>
        </div>
        <button className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Clear Chat</button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-black/10">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg shadow-sm
                ${msg.role === 'user' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-white/5 text-slate-300 border border-white/10'}`}>
                {msg.role === 'user' ? <FiUser /> : <FiCpu />}
              </div>
              <div className={`p-4 rounded-3xl text-sm leading-relaxed shadow-sm
                ${msg.role === 'user' 
                  ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-tr-none' 
                  : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none backdrop-blur-sm'}`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="p-5 border-t border-white/5 flex gap-3 bg-white/[0.02]">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about coding, math, or study tips..."
          className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600 font-medium"
        />
        <button type="submit" disabled={isSending} className="bg-indigo-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-90 flex-shrink-0 disabled:opacity-60 disabled:cursor-not-allowed">
          <FiSend className="text-xl" />
        </button>
      </form>
      {chatError && <p className="px-5 pb-4 text-xs text-red-400">{chatError}</p>}
    </div>
  );
};

export default AITutorChat;
