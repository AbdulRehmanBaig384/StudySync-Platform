import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiHome, FiBookOpen, FiCode, FiFolder, FiArrowLeft, FiBook, FiCpu, FiMessageSquare } from 'react-icons/fi';

const NotFound = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, this would navigate to a search results page
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white flex flex-col items-center justify-center relative overflow-hidden font-jakarta px-6 py-12">
      {/* Background Decorative Orbs */}
      <div className="orb w-[500px] h-[500px] bg-purple-600 top-[-250px] left-[-100px] animate-spin-slow"></div>
      <div className="orb w-[400px] h-[400px] bg-blue-600 bottom-[-200px] right-[-100px] animate-pulse-glow"></div>
      <div className="orb w-[300px] h-[300px] bg-pink-500 top-[20%] right-[10%] opacity-10 animate-float"></div>

      <div className="container-max w-full flex flex-col items-center z-10">
        {/* Animated 404 Illustration Area */}
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
          
          <div className="relative flex items-center justify-center">
            {/* Main 404 Text */}
            <h1 className="text-[12rem] md:text-[18rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-white/5 select-none animate-float">
              404
            </h1>
            
            {/* Floating Icons around 404 */}
            <div className="absolute top-10 -left-10 animate-float-delayed">
              <div className="bg-glass p-4 rounded-2xl glow-purple border-purple-500/30">
                <FiBook className="text-3xl text-purple-400" />
              </div>
            </div>
            <div className="absolute bottom-20 -right-12 animate-float">
              <div className="bg-glass p-4 rounded-2xl glow-blue border-blue-500/30">
                <FiCode className="text-3xl text-blue-400" />
              </div>
            </div>
            <div className="absolute -top-4 right-10 animate-pulse-glow">
              <div className="bg-glass p-3 rounded-xl border-pink-500/30">
                <FiCpu className="text-2xl text-pink-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Message Area */}
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="section-title mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Oops! This study room seems to be missing.
          </h2>
          <p className="section-subtitle mx-auto">
            The page you're looking for might have been moved, deleted, or is currently in a deep focus session. 
            Let's get you back on track!
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-2xl mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-glass-dark rounded-xl flex items-center p-2 border border-white/10">
              <FiSearch className="text-gray-400 ml-4 text-xl" />
              <input 
                type="text" 
                placeholder="Search courses, resources, or coding rooms..."
                className="bg-transparent border-none outline-none flex-1 px-4 py-3 text-lg placeholder-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn-primary py-2 px-6 rounded-lg text-sm">
                <span>Search</span>
              </button>
            </div>
          </form>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Link to="/dashboard" className="bg-glass p-6 rounded-2xl border border-white/10 card-hover flex flex-col items-center text-center group">
            <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors">
              <FiHome className="text-2xl text-purple-400" />
            </div>
            <h3 className="font-bold mb-1">Dashboard</h3>
            <p className="text-sm text-gray-400">View your progress</p>
          </Link>

          <Link to="/pro-hub" className="bg-glass p-6 rounded-2xl border border-white/10 card-hover flex flex-col items-center text-center group">
            <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
              <FiBookOpen className="text-2xl text-blue-400" />
            </div>
            <h3 className="font-bold mb-1">Explore Courses</h3>
            <p className="text-sm text-gray-400">Learn something new</p>
          </Link>

          <Link to="/CodingRooms" className="bg-glass p-6 rounded-2xl border border-white/10 card-hover flex flex-col items-center text-center group">
            <div className="w-14 h-14 bg-pink-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-pink-500/30 transition-colors">
              <FiCode className="text-2xl text-pink-400" />
            </div>
            <h3 className="font-bold mb-1">Coding Rooms</h3>
            <p className="text-sm text-gray-400">Collaborative coding</p>
          </Link>

          <Link to="/resources" className="bg-glass p-6 rounded-2xl border border-white/10 card-hover flex flex-col items-center text-center group">
            <div className="w-14 h-14 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-500/30 transition-colors">
              <FiFolder className="text-2xl text-indigo-400" />
            </div>
            <h3 className="font-bold mb-1">Browse Resources</h3>
            <p className="text-sm text-gray-400">Notes & materials</p>
          </Link>
        </div>

        {/* Quick Links Section */}
        <div className="w-full max-w-4xl border-t border-white/10 pt-12 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-wrap justify-center md:justify-start gap-6">
              <Link to="/find-partner" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                <FiMessageSquare /> Find Study Partner
              </Link>
              <Link to="/quizzes" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                <FiBook /> Take a Quiz
              </Link>
              <Link to="/ai-tutor" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                <FiCpu /> Ask AI Tutor
              </Link>
            </div>
            
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300 font-semibold transition-colors"
            >
              <FiArrowLeft /> Go Back
            </button>
          </div>
        </div>

        {/* Motivational Text */}
        <div className="mt-20 text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <p className="text-gray-500 italic text-sm md:text-base">
            "Education is not the filling of a pail, but the lighting of a fire." — William Butler Yeats
          </p>
          <div className="mt-4 flex justify-center gap-1">
            <div className="w-2 h-2 rounded-full bg-purple-500/40"></div>
            <div className="w-12 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
            <div className="w-2 h-2 rounded-full bg-blue-500/40"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
