import React from 'react';
import { FiFilter, FiSearch } from 'react-icons/fi';

const PartnerFilters = () => {
  return (
    <div className="bg-glass-dark p-6 rounded-3xl border border-white/5 shadow-xl mb-8 animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
          <FiFilter />
        </div>
        <h3 className="text-lg font-black text-white font-jakarta">Fine-tune Search</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Subject Search */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Subject</label>
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="e.g. React" 
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600 font-bold"
            />
          </div>
        </div>

        {/* Department */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Department</label>
          <select className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-xs text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold appearance-none">
            <option>All Departments</option>
            <option>Computer Science</option>
            <option>Engineering</option>
            <option>Business</option>
            <option>Design</option>
          </select>
        </div>

        {/* Semester */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Semester</label>
          <select className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-xs text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold appearance-none">
            <option>Any Semester</option>
            <option>Semester 1-2</option>
            <option>Semester 3-4</option>
            <option>Semester 5-6</option>
            <option>Semester 7-8</option>
          </select>
        </div>

        {/* Study Style */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Study Style</label>
          <select className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-xs text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold appearance-none">
            <option>Any Style</option>
            <option>Discussion-heavy</option>
            <option>Silent Study</option>
            <option>Project-based</option>
          </select>
        </div>

        {/* Skill Level */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Skill Level</label>
          <select className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-xs text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold appearance-none">
            <option>Any Level</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>

        {/* Availability */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Available Time</label>
          <select className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-xs text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold appearance-none">
            <option>Any Time</option>
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Evening</option>
            <option>Weekend</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default PartnerFilters;
