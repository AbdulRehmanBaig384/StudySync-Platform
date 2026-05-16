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
  FiChevronRight,
  FiLock,
  FiX
} from 'react-icons/fi';
import DashboardLayout from '../components/DashboardLayout';

const Resources = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [isPro, setIsPro] = useState(false); // Simulate lock status
  const [showPaymentModal, setShowPaymentModal] = useState(false);

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
    { 
      id: 1, 
      title: 'DSA Master Sheet', 
      type: 'PDF', 
      subject: 'DSA', 
      date: '2024-04-20', 
      trending: true, 
      bookmarked: true, 
      tab: 'notes',
      image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1469&auto=format&fit=crop'
    },
    { 
      id: 2, 
      title: 'React Hooks Deep Dive', 
      type: 'Video', 
      subject: 'Web Dev', 
      date: '2024-04-18', 
      trending: true, 
      tab: 'videos', 
      difficulty: 'Advanced',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1470&auto=format&fit=crop'
    },
    { 
      id: 3, 
      title: 'Neural Networks 101', 
      type: 'Notes', 
      subject: 'Data Science', 
      date: '2024-04-15', 
      tab: 'notes',
      image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=1470&auto=format&fit=crop'
    },
    { 
      id: 4, 
      title: 'Operating Systems Lab 4', 
      type: 'Assignment', 
      subject: 'OS', 
      date: '2024-04-25', 
      status: 'Pending', 
      tab: 'assignments',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1470&auto=format&fit=crop'
    },
    { 
      id: 5, 
      title: 'Python List Comprehension', 
      type: 'Code', 
      subject: 'Python', 
      date: '2024-04-10', 
      tab: 'snippets', 
      code: 'nums = [x for x in range(10) if x % 2 == 0]',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1470&auto=format&fit=crop'
    },
    { 
      id: 6, 
      title: 'SQL Queries Cheat Sheet', 
      type: 'PDF', 
      subject: 'Database', 
      date: '2024-04-22', 
      trending: true, 
      tab: 'cheatsheets',
      image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=1421&auto=format&fit=crop'
    },
    { 
      id: 7, 
      title: 'System Design Patterns', 
      type: 'Video', 
      subject: 'Architecture', 
      date: '2024-04-12', 
      tab: 'videos', 
      difficulty: 'Expert',
      image: 'https://images.unsplash.com/photo-1508921331509-4c7ee27c0d23?q=80&w=1470&auto=format&fit=crop'
    },
    { 
      id: 8, 
      title: 'C++ STL Shortcuts', 
      type: 'Cheat Sheet', 
      subject: 'C++', 
      date: '2024-04-05', 
      bookmarked: true, 
      tab: 'cheatsheets',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1470&auto=format&fit=crop'
    },
  ];

  const filteredResources = resources.filter(res => {
    const matchesTab = activeTab === 'all' || res.tab === activeTab || (activeTab === 'bookmarks' && res.bookmarked) || (activeTab === 'trending' && res.trending);
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in relative">
        
        {/* Payment CTA Banner */}
        {!isPro && (
          <div className="bg-gradient-to-r from-indigo-600/20 via-violet-600/20 to-indigo-600/20 border border-indigo-500/30 rounded-[2rem] p-8 md:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-grid-white/5 mask-gradient opacity-20 pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter">
                Unlock <span className="text-indigo-400">Premium</span> Study Resources 🚀
              </h2>
              <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed">
                Get unlimited access to expert notes, video lectures, and master cheat sheets. 
                <span className="block mt-2 font-black text-indigo-300 uppercase tracking-widest text-xs animate-pulse">
                  Please proceed with payment integration process to unlock this resources
                </span>
              </p>
              <button 
                onClick={() => setShowPaymentModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        )}

        <div className="space-y-8">

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
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id
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
              <ResourceCard key={res.id} res={res} isLocked={!isPro} />
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
      </div>

      {/* Simulated Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1e293b] w-full max-w-md rounded-[2.5rem] border border-white/10 p-10 shadow-2xl animate-slide-up relative">
            <button 
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"
            >
              <FiX className="text-xl" />
            </button>
            
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto text-indigo-400 text-4xl shadow-inner">
                <FiZap />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white mb-2">Upgrade to Pro</h3>
                <p className="text-slate-500 text-sm">One-time payment to unlock all premium resources forever.</p>
              </div>
              
              <div className="bg-white/5 border border-white/5 p-6 rounded-2xl space-y-2">
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span>Pro Plan</span>
                  <span className="text-white">$19.99</span>
                </div>
                <div className="h-px bg-white/5" />
                <p className="text-[10px] text-slate-500 font-bold leading-relaxed italic text-left">
                  * Payment integration process initiated. You will be redirected to the secure gateway.
                </p>
              </div>

              <button 
                onClick={() => {
                  setIsPro(true);
                  setShowPaymentModal(false);
                }}
                className="w-full bg-white text-indigo-600 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-indigo-50 transition-colors shadow-lg"
              >
                Complete Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

// --- Sub-Components ---

const ResourceCard = ({ res, isLocked }) => {
  return (
    <div className={`group bg-glass-dark border border-white/5 rounded-[2.5rem] overflow-hidden transition-all shadow-xl flex flex-col h-full relative ${isLocked ? 'grayscale-[0.5]' : 'hover:border-indigo-500/30 hover:-translate-y-1'}`}>
      
      {/* Locked Overlay */}
      {isLocked && (
        <div className="absolute inset-0 z-10 bg-[#0f172a]/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white text-xl shadow-lg border border-white/5 animate-pulse">
            <FiLock />
          </div>
          <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Locked Resource</p>
        </div>
      )}

      {/* Card Splash Image */}
      <div className={`h-40 w-full relative overflow-hidden ${isLocked ? 'blur-[1px]' : ''}`}>
        <img 
          src={res.image} 
          alt={res.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent" />
        {res.trending && (
          <div className="absolute top-4 right-4">
            <span className="bg-amber-500 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest shadow-lg shadow-amber-600/20">
              Trending
            </span>
          </div>
        )}
      </div>

      <div className="p-8 space-y-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{res.subject}</span>
            <h3 className="text-white font-bold mt-1 group-hover:text-indigo-300 transition-colors leading-tight">{res.title}</h3>
          </div>
          <div className="text-slate-500 text-xl group-hover:text-indigo-400 transition-colors">
            {res.type === 'Video' ? <FiVideo /> : <FiFileText />}
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
          <span className="flex items-center gap-2"><FiClock /> {res.date}</span>
          <div className="flex gap-3">
            <button className="hover:text-white transition-colors" title="Download"><FiDownload /></button>
            <button className="hover:text-amber-500 transition-colors" title="Bookmark"><FiBookmark fill={res.bookmarked ? 'currentColor' : 'none'} className={res.bookmarked ? 'text-amber-500' : ''} /></button>
          </div>
        </div>

        <button className="w-full mt-auto py-4 bg-white/5 hover:bg-indigo-600 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white rounded-2xl transition-all flex items-center justify-center gap-2">
          {res.type === 'Video' ? 'Watch Lesson' : 'View Content'}
        </button>
      </div>
    </div>
  );
};

export default Resources;
