import React, { useState } from 'react';
import { FiX, FiCpu, FiTarget, FiLayers, FiLoader } from 'react-icons/fi';

const QuizSetupModal = ({ isOpen, onClose, onGenerate }) => {
  const [formData, setFormData] = useState({
    topic: '',
    number: 10,
    difficulty: 'Medium'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onGenerate(formData);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1e293b] w-full max-w-lg rounded-[2.5rem] border border-white/10 p-10 shadow-2xl animate-slide-up relative">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"
        >
          <FiX className="text-xl" />
        </button>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center text-indigo-400 text-xl">
            <FiCpu />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">AI Quiz Generator</h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Powered by Gemini 2.5 Flash</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quiz Topic</label>
            <div className="relative">
              <FiTarget className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none z-10" />
              <input 
                type="text" 
                required
                autoFocus
                value={formData.topic}
                onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all text-sm relative z-0"
                placeholder="e.g. JavaScript Closures, Quantum Physics"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Number of Qs</label>
              <div className="relative">
                <FiLayers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                <select 
                  value={formData.number}
                  onChange={(e) => setFormData({...formData, number: parseInt(e.target.value)})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all text-sm appearance-none cursor-pointer"
                >
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                  <option value={15}>15 Questions</option>
                  <option value={20}>20 Questions</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Difficulty</label>
              <select 
                value={formData.difficulty}
                onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all text-sm cursor-pointer"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin text-lg" />
                  Generating...
                </>
              ) : (
                'Generate Quiz'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizSetupModal;
