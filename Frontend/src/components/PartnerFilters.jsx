import React, { useState } from 'react';
import { FiFilter, FiSearch, FiMap } from 'react-icons/fi';

const departmentsList = [
  'Computer Science (CS)',
  'Software Engineering (SE)',
  'Information Technology (IT)',
  'Data Science',
  'Artificial Intelligence (AI)',
  'Cyber Security',
  'Electrical Engineering (EE)',
  'Electronics Engineering (ECE)',
  'Mechanical Engineering (ME)',
  'Civil Engineering (CE)',
  'Business Administration (BBA)',
  'Accounting & Finance',
  'Economics',
  'Mathematics',
  'Physics',
  'Mass Communication',
  'Pharmacy',
  'Biochemistry',
  'Sociology',
  'Psychology'
];

const PartnerFilters = ({ onFilterChange, initialFilters }) => {
  const [filters, setFilters] = useState(initialFilters || {
    subject: '',
    department: '',
    facultyOfStudy: '',
    semester: '',
    style: '',
    time: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    if (onFilterChange) onFilterChange(newFilters);
  };

  return (
    <div className="bg-glass-dark p-6 rounded-3xl border border-white/5 shadow-xl mb-8 animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
          <FiFilter />
        </div>
        <h3 className="text-lg font-black text-white font-jakarta">Fine-tune Search</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
        {/* Subject Search */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Subject</label>
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              name="subject"
              value={filters.subject}
              onChange={handleChange}
              placeholder="e.g. React"
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600 font-bold"
            />
          </div>
        </div>

        {/* Department */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Department</label>
          <select 
            name="department"
            value={filters.department}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-xs text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold appearance-none"
          >
            <option value="">All Depts</option>
            {departmentsList.map((d) => (
              <option key={d} value={d} className="bg-[#0a0f1e] text-white">
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Faculty of Study */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Faculty</label>
          <div className="relative">
            <FiMap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              name="facultyOfStudy"
              value={filters.facultyOfStudy}
              onChange={handleChange}
              placeholder="e.g. Science"
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600 font-bold"
            />
          </div>
        </div>

        {/* Semester */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Semester</label>
          <select 
            name="semester"
            value={filters.semester}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-xs text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold appearance-none"
          >
            <option value="">Any Sem</option>
            <option value="1">Semester 1-2</option>
            <option value="3">Semester 3-4</option>
            <option value="5">Semester 5-6</option>
            <option value="7">Semester 7-8</option>
          </select>
        </div>

        {/* Study Style */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Style</label>
          <select 
            name="style"
            value={filters.style}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-xs text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold appearance-none"
          >
            <option value="">Any Style</option>
            <option>Discussion-heavy</option>
            <option>Silent Study</option>
            <option>Project-based</option>
          </select>
        </div>

        {/* Availability */}
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Time</label>
          <select 
            name="time"
            value={filters.time}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-3 px-4 text-xs text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold appearance-none"
          >
            <option value="">Any Time</option>
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
