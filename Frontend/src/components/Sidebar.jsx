import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiSearch,
  FiBookOpen,
  FiLayers,
  FiCode,
  FiFolder,
  FiCpu,
  FiTrendingUp,
  FiUser,
  FiSettings,
  FiLogOut,
  FiStar,
  FiMessageSquare
} from 'react-icons/fi';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userName');
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: <FiHome />, path: '/dashboard' },
    { name: 'Find Study Partner', icon: <FiSearch />, path: '/find-partner' },
    { name: 'Study Sessions', icon: <FiBookOpen />, path: '/StudySession' },
    { name: 'Quiz & Practice', icon: <FiLayers />, path: '/quizzes' },
    { name: 'Coding Room', icon: <FiCode />, path: '/CodingRooms' },
    { name: 'Resources', icon: <FiFolder />, path: '/resources' },
    { name: 'AI Tutor', icon: <FiCpu />, path: '/ai-tutor' },
    { name: 'Messages', icon: <FiMessageSquare />, path: '/chat' },
    { name: 'Pro Hub', icon: <FiStar className="text-amber-400" />, path: '/pro-hub' },
    // { name: 'Leaderboard', icon: <FiTrendingUp />, path: '/leaderboard' },
  ];

  return (
    <aside className="w-64 h-screen sticky top-0 bg-glass-dark border-r border-white/5 flex flex-col transition-all duration-300">
      <div className="p-6">
        <h1 className="text-2xl font-black text-gradient font-jakarta">
          StudySync
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive
                ? 'bg-indigo-500/10 text-indigo-400 font-medium shadow-[0_0_20px_rgba(99,102,241,0.1)] border border-indigo-500/20'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'}
            `}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-white/5">
        <NavLink
          to="/StudentProfile"
          className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-all"
        >
          <FiUser className="text-xl" />
          <span className="font-medium">Profile</span>
        </NavLink>
        <NavLink
          to="/settings"
          className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-white/5 hover:text-white rounded-xl transition-all"
        >
          <FiSettings className="text-xl" />
          <span className="font-medium">Settings</span>
        </NavLink>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all mt-2 font-medium"
        >
          <FiLogOut className="text-xl" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
