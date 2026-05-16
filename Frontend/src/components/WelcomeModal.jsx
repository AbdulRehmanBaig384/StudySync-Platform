import React, { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';

const WelcomeModal = ({ isOpen, onClose, userName }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), 300); // match transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className={`absolute inset-0 bg-[#0a0f1e]/80 backdrop-blur-md transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose} 
      />
      
      <div 
        className={`relative bg-glass-dark border border-white/10 rounded-3xl p-8 md:p-10 max-w-lg w-full shadow-2xl transition-all duration-300 transform overflow-hidden ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
        }`}
      >
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="text-center mt-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px] mb-6 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full rounded-full bg-glass-dark flex items-center justify-center">
              <span className="text-3xl">🚀</span>
            </div>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 font-jakarta leading-tight">
            Welcome to StudySync,<br/>
            <span className="text-gradient">{userName} 👋</span>
          </h2>
          
          <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
            You are now ready to proceed with your learning journey. Stay consistent, stay focused, and level up your skills daily.
          </p>

          <div className="inline-block px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl mb-8">
            <p className="text-indigo-300 text-sm font-semibold italic">
              "Success is built one session at a time."
            </p>
          </div>
          
          <button 
            onClick={onClose}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5 active:translate-y-0"
          >
            Start Learning
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
