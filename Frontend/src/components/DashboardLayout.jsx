import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { useTimer } from '../context/TimerContext';
import { FiClock, FiSquare } from 'react-icons/fi';
import WelcomeModal from './WelcomeModal';

const DashboardLayout = ({ children }) => {
  const { isActive, isPaused, sessionSeconds, stopSession } = useTimer();
  const [showWelcome, setShowWelcome] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const shouldShowWelcome = localStorage.getItem('showWelcomeModal');
    if (shouldShowWelcome === 'true') {
      setShowWelcome(true);
      setUserName(localStorage.getItem('userName') || 'User');
      localStorage.removeItem('showWelcomeModal');
    }
  }, []);

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s`;
  };

  return (
    <div className="flex min-h-screen bg-[#0a0f1e] font-sans text-slate-200">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto relative">
        
        {/* Global Timer Indicator */}
        {isActive && (
          <div className="absolute top-4 right-8 bg-indigo-600/20 border border-indigo-500/30 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-4 z-50 animate-fade-in shadow-xl">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`}></span>
              <FiClock className="text-indigo-400" />
              <span className="font-mono font-bold text-sm text-white">{formatTime(sessionSeconds)}</span>
            </div>
            <button 
              onClick={stopSession}
              className="p-1.5 bg-rose-500/20 text-rose-400 hover:bg-rose-500/40 rounded-full transition-colors"
              title="Stop Session"
            >
              <FiSquare className="w-3 h-3" />
            </button>
          </div>
        )}

        <div className="max-w-7xl mx-auto font-jakarta mt-8">
          {children}
        </div>
      </main>

      {/* Welcome Modal */}
      <WelcomeModal 
        isOpen={showWelcome} 
        onClose={() => setShowWelcome(false)} 
        userName={userName} 
      />
    </div>
  );
};

export default DashboardLayout;
