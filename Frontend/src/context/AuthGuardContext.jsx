import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthGuardContext = createContext();

export const useAuthGuard = () => useContext(AuthGuardContext);

export const AuthGuardProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const requireAuth = (action) => {
    return (e) => {
      if (e) e.preventDefault(); // Prevent default link behavior if applicable
      const token = localStorage.getItem('token');
      if (token) {
        action();
      } else {
        setIsModalOpen(true);
      }
    };
  };

  const handleLoginRedirect = () => {
    setIsModalOpen(false);
    navigate('/login');
  };

  return (
    <AuthGuardContext.Provider value={{ requireAuth }}>
      {children}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-[#0a0f1e]/80 backdrop-blur-md animate-fade-in" 
            onClick={() => setIsModalOpen(false)} 
          />
          <div className="relative bg-glass-dark border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-scale-up text-center overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600" />
            <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
              <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 font-jakarta">Login Required</h2>
            <p className="text-slate-400 mb-8 text-sm">Please login first to access the StudySync platform features.</p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleLoginRedirect}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/25"
              >
                Go to Login
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthGuardContext.Provider>
  );
};
