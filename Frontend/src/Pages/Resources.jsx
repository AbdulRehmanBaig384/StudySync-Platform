import React, { useState } from 'react';
import { 
  FiSearch, 
  FiFileText, 
  FiVideo, 
  FiEdit3, 
  FiCode, 
  FiBookmark, 
  FiTrendingUp, 
  FiDownload, 
  FiEye, 
  FiClipboard, 
  FiClock, 
  FiFilter,
  FiGrid,
  FiList,
  FiZap,
  FiChevronRight
} from 'react-icons/fi';
import DashboardLayout from '../components/DashboardLayout';

const Resources = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const tabs = [
    { id: 'all', label: 'All Resources', icon: <FiGrid /> },
    { id: 'notes', label: 'Notes', icon: <FiFileText /> },
    { id: 'videos', label: 'Videos', icon: <FiVideo /> },
    { id: 'assignments', label: 'Assignments', icon: <FiEdit3 /> },
    { id: 'cheatsheets', label: 'Cheat Sheets', icon: <FiZap /> },
    { id: 'snippets', label: 'Code Snippets', icon: <FiCode /> },
    { id: 'bookmarks', label: 'Bookmarks', icon: <FiBookmark /> },
    { id: 'trending', label: 'Trending', icon: <FiTrendingUp /> },
  ];

  // Mock Data
  const resources = [
    { id: 1, title: 'DSA Master Sheet', type: 'PDF', subject: 'DSA', date: '2024-04-20', trending: true, bookmarked: true, tab: 'notes' },
    { id: 2, title: 'React Hooks Deep Dive', type: 'Video', subject: 'Web Dev', date: '2024-04-18', trending: true, tab: 'videos', difficulty: 'Advanced' },
    { id: 3, title: 'Neural Networks 101', type: 'Notes', subject: 'Data Science', date: '2024-04-15', tab: 'notes' },
    { id: 4, title: 'Operating Systems Lab 4', type: 'Assignment', subject: 'OS', date: '2024-04-25', status: 'Pending', tab: 'assignments' },
    { id: 5, title: 'Python List Comprehension', type: 'Code', subject: 'Python', date: '2024-04-10', tab: 'snippets', code: 'nums = [x for x in range(10) if x % 2 == 0]' },
    { id: 6, title: 'SQL Queries Cheat Sheet', type: 'PDF', subject: 'Database', date: '2024-04-22', trending: true, tab: 'cheatsheets' },
    { id: 7, title: 'System Design Patterns', type: 'Video', subject: 'Architecture', date: '2024-04-12', tab: 'videos', difficulty: 'Expert' },
    { id: 8, title: 'C++ STL Shortcuts', type: 'Cheat Sheet', subject: 'C++', date: '2024-04-05', bookmarked: true, tab: 'cheatsheets' },
  ];

  const filteredResources = resources.filter(res => {
    const matchesTab = activeTab === 'all' || res.tab === activeTab || (activeTab === 'bookmarks' && res.bookmarked) || (activeTab === 'trending' && res.trending);
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Study Resources</h1>
            <p className="text-slate-400 text-sm mt-1">Explore, download, and master your subjects.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all w-full md:w-[300px]"
              />
            </div>
            <button className="p-3 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all">
              <FiFilter />
            </button>
          </div>
        </div>

        {/* Custom Tab Navigation */}
        <div className="overflow-x-auto pb-2 custom-scrollbar">
          <div className="flex items-center gap-2 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/5'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Resource Grid/List */}
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
          {filteredResources.length > 0 ? (
            filteredResources.map((res) => (
              <ResourceCard key={res.id} res={res} />
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-600 space-y-4">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-3xl opacity-20">
                <FiFileText />
              </div>
              <p className="font-bold opacity-30 uppercase tracking-[0.2em]">No resources found</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

// --- Sub-Components ---

const ResourceCard = ({ res }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'PDF': return <FiFileText className="text-rose-400" />;
      case 'Video': return <FiVideo className="text-indigo-400" />;
      case 'Assignment': return <FiEdit3 className="text-emerald-400" />;
      case 'Code': return <FiCode className="text-amber-400" />;
      default: return <FiFileText className="text-slate-400" />;
    }
  };

  return (
    <div className="group bg-glass-dark border border-white/5 rounded-3xl p-6 hover:border-indigo-500/30 transition-all hover:-translate-y-1 shadow-xl hover:shadow-indigo-600/5 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-600/5 blur-3xl group-hover:bg-indigo-600/10 transition-colors" />
      
      <div className="flex flex-col h-full space-y-5">
        <div className="flex items-start justify-between">
          <div className={`p-3 rounded-2xl bg-white/5 text-xl`}>
            {getTypeIcon(res.type)}
          </div>
          <div className="flex gap-2">
            {res.trending && (
              <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[8px] font-black uppercase tracking-widest rounded-md border border-amber-500/20">
                Trending
              </span>
            )}
            {res.difficulty && (
              <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[8px] font-black uppercase tracking-widest rounded-md border border-indigo-500/20">
                {res.difficulty}
              </span>
            )}
          </div>
        </div>

        <div>
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{res.subject}</span>
          <h3 className="text-white font-bold mt-1 group-hover:text-indigo-300 transition-colors">{res.title}</h3>
        </div>

        {res.type === 'Code' && (
          <div className="bg-black/40 rounded-xl p-3 font-mono text-[10px] text-slate-400 overflow-hidden line-clamp-2">
            {res.code}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold">
            <FiClock /> {res.date}
          </div>
          
          <div className="flex items-center gap-2">
            {res.tab === 'assignments' ? (
              <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${res.status === 'Pending' ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                {res.status}
              </span>
            ) : (
              <>
                <button className="p-2 text-slate-400 hover:text-white transition-colors" title="Download">
                  <FiDownload />
                </button>
                <button className="p-2 text-slate-400 hover:text-white transition-colors" title="Bookmark">
                  <FiBookmark fill={res.bookmarked ? 'currentColor' : 'none'} className={res.bookmarked ? 'text-amber-500' : ''} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Hover Action Button */}
        <button className="w-full mt-2 py-2.5 bg-white/5 hover:bg-indigo-600 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-white rounded-xl transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 shadow-lg shadow-indigo-600/20">
          {res.type === 'Video' ? <><FiVideo /> Watch Now</> : <><FiEye /> View Resource</>}
        </button>
      </div>
    </div>
  );
};

export default Resources;
