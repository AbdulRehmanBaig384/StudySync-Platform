import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { 
  FiUser, 
  FiShield, 
  FiBook, 
  FiUsers, 
  FiBell, 
  FiCpu, 
  FiCamera,
  FiCheck,
  FiLock,
  FiEye,
  FiEyeOff,
  FiClock,
  FiZap,
  FiSettings,
  FiLoader
} from 'react-icons/fi';

const StudentProfile = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Real User Data state
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await fetch(`http://localhost:3000/api/users/profile?email=${email}`);
        const data = await response.json();
        if (response.ok) {
          setUserData({
            name: `${data.Firstname} ${data.lastname}`,
            firstName: data.Firstname,
            lastName: data.lastname,
            email: data.email,
            university: data.University_Name,
            department: data.department,
            facultyOfStudy: data.facultyOfStudy,
            semester: `${data.Year_of_Study}${data.Year_of_Study > 3 ? 'th' : data.Year_of_Study === 1 ? 'st' : data.Year_of_Study === 2 ? 'nd' : 'rd'} Semester`,
            yearOfStudy: data.Year_of_Study,
            avatar: data.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.Firstname}`,
            dailyGoal: data.dailyGoal || 3,
            streak: data.currentStreak || 0,
            timerSettings: { focus: 25, shortBreak: 5, longBreak: 15 },
            notifications: { reminders: true, messages: true, requests: false },
            privacy: { visibility: 'public', status: data.onlineStatus || 'offline' },
            aiTutor: { style: 'detailed', focus: data.Preferred_Subjects?.[0] || 'General' },
            partnerPrefs: { 
              subjects: data.Preferred_Subjects || [],
              time: data.Preferred_Study_Time || 'Evening',
              style: 'Collaborative',
              semester: 'Any'
            }
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
          <FiLoader className="text-5xl text-indigo-500 animate-spin" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!userData) {
    return (
      <DashboardLayout>
        <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">User session not found. Please log in.</p>
        </div>
      </DashboardLayout>
    );
  }

  const tabs = [
    { id: 'general', label: 'General', icon: <FiUser /> },
    { id: 'security', label: 'Security & Privacy', icon: <FiShield /> },
    { id: 'study', label: 'Study System', icon: <FiBook /> },
    { id: 'partner', label: 'Partner Prefs', icon: <FiUsers /> },
    { id: 'ai', label: 'AI & Alerts', icon: <FiCpu /> },
  ];

  return (
    <DashboardLayout>
      <div className="relative min-h-[80vh] animate-slide-up">
        {/* Background Decorative Orbs */}
        <div className="orb w-96 h-96 bg-indigo-600 top-[-10%] right-[-10%] hidden lg:block opacity-10" />
        <div className="orb w-80 h-80 bg-violet-600 bottom-[10%] left-[-5%] hidden lg:block opacity-10" />

        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-16 relative z-10">
          <div>
            <h2 className="text-5xl font-black text-white mb-3 font-jakarta tracking-tight leading-tight">
              User <span className="text-gradient font-black">Profile</span>
            </h2>
            <div className="flex items-center gap-3">
              <span className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-transparent rounded-full"></span>
              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                Personalize your StudySync Experience
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`group relative flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-300 overflow-hidden ${
              isEditing 
                ? 'bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.3)]' 
                : 'bg-white/5 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/10 hover:border-indigo-500/40'
            }`}
          >
            <div className={`transition-transform duration-500 ${isEditing ? 'rotate-0' : 'group-hover:rotate-180'}`}>
              {isEditing ? <FiCheck className="text-lg" /> : <FiSettings className="text-lg" />}
            </div>
            <span>{isEditing ? 'Save Changes' : 'Customize Profile'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
          {/* Internal Sidebar Navigation */}
          <div className="lg:col-span-3">
            <div className="bg-glass-dark/50 backdrop-blur-3xl rounded-[2rem] p-3 border border-white/5 sticky top-24 shadow-2xl">
              <div className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl transition-all duration-500 group ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-xl shadow-indigo-900/40 translate-x-2'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className={`text-xl transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                      {tab.icon}
                    </span>
                    <span className="font-extrabold tracking-tight text-sm">{tab.label}</span>
                    {activeTab === tab.id && (
                      <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <div className="bg-glass-dark/30 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-full relative overflow-hidden">
              {/* Animated Accent Line at Top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500 animate-gradient" />
              
              <div className="p-10 lg:p-16">
                {activeTab === 'general' && <GeneralTab userData={userData} isEditing={isEditing} />}
                {activeTab === 'security' && <SecurityTab userData={userData} isEditing={isEditing} />}
                {activeTab === 'study' && <StudyTab userData={userData} isEditing={isEditing} />}
                {activeTab === 'partner' && <PartnerTab userData={userData} isEditing={isEditing} />}
                {activeTab === 'ai' && <AITab userData={userData} isEditing={isEditing} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// --- Sub-components for better organization ---

const GeneralTab = ({ userData, isEditing }) => (
  <div className="space-y-16 animate-slide-up">
    {/* Profile Hero Section */}
    <div className="flex flex-col md:flex-row items-center gap-10 p-8 bg-white/5 rounded-[2.5rem] border border-white/5">
      <div className="relative group">
        <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-8 border-white/10 group-hover:border-indigo-500/30 transition-all duration-500 shadow-2xl">
          <img src={userData.avatar} alt="Profile" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        </div>
        {isEditing && (
          <button className="absolute -bottom-2 -right-2 p-4 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-transform z-10">
            <FiCamera className="text-xl" />
          </button>
        )}
        <div className="absolute -z-10 inset-0 bg-indigo-500 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
      </div>
      
      <div className="text-center md:text-left space-y-4">
        <div>
          <h3 className="text-4xl font-black text-white tracking-tight">{userData.name}</h3>
          <p className="text-slate-400 font-medium text-lg">{userData.email}</p>
        </div>
        <div className="flex flex-wrap justify-center md:justify-start gap-3">
          <span className="px-5 py-2 bg-indigo-500/10 text-indigo-400 rounded-2xl text-xs font-black uppercase tracking-widest border border-indigo-500/20">
            Active Student
          </span>
          <span className="px-5 py-2 bg-violet-500/10 text-violet-400 rounded-2xl text-xs font-black uppercase tracking-widest border border-violet-500/20">
            {userData.semester}
          </span>
        </div>
      </div>
    </div>

    {/* Form Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <InputGroup label="Full Name" value={userData.name} disabled={!isEditing} />
      <InputGroup label="Email Address" value={userData.email} disabled={true} />
      <InputGroup label="University Name" value={userData.university} disabled={!isEditing} />
      <InputGroup label="Primary Department" value={userData.department} disabled={!isEditing} />
      <InputGroup label="Faculty of Study" value={userData.facultyOfStudy} disabled={!isEditing} />
      <SelectGroup 
        label="Current Semester" 
        value={userData.semester} 
        disabled={!isEditing} 
        options={['1st Semester', '2nd Semester', '3rd Semester', '4th Semester', '5th Semester', '6th Semester', '7th Semester', '8th Semester']} 
      />
    </div>
  </div>
);

const SecurityTab = ({ userData, isEditing }) => (
  <div className="space-y-10 animate-slide-up">
    <div>
      <h3 className="text-xl font-black text-white mb-6">Password Management</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InputGroup label="Current Password" type="password" value="********" disabled={!isEditing} />
        <InputGroup label="New Password" type="password" placeholder="Min. 8 characters" disabled={!isEditing} />
      </div>
    </div>
    
    <div className="h-px bg-white/5" />

    <div>
      <h3 className="text-xl font-black text-white mb-6">Privacy Controls</h3>
      <div className="space-y-4">
        <ToggleRow 
          label="Profile Visibility" 
          description="Allow others to find your profile in searches"
          value={userData.privacy.visibility === 'public'} 
          disabled={!isEditing}
        />
        <ToggleRow 
          label="Online Status" 
          description="Show when you are active to study partners"
          value={userData.privacy.status === 'online'} 
          disabled={!isEditing}
        />
      </div>
    </div>
  </div>
);

const StudyTab = ({ userData, isEditing }) => (
  <div className="space-y-10 animate-slide-up">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-amber-500/20 text-amber-500 rounded-2xl">
            <FiZap />
          </div>
          <h4 className="text-lg font-black text-white">Daily Study Goal</h4>
        </div>
        <div className="flex items-center gap-4">
          <input 
            type="range" 
            className="flex-1 accent-indigo-500" 
            min="1" 
            max="12" 
            value={userData.dailyGoal} 
            disabled={!isEditing}
          />
          <span className="text-2xl font-black text-indigo-400">{userData.dailyGoal}h</span>
        </div>
      </div>

      <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-500/20 text-indigo-500 rounded-2xl">
            <FiClock />
          </div>
          <h4 className="text-lg font-black text-white">Timer Settings</h4>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <SmallInput label="Focus" value={userData.timerSettings.focus} disabled={!isEditing} suffix="m" />
          <SmallInput label="Short" value={userData.timerSettings.shortBreak} disabled={!isEditing} suffix="m" />
          <SmallInput label="Long" value={userData.timerSettings.longBreak} disabled={!isEditing} suffix="m" />
        </div>
      </div>
    </div>
  </div>
);

const PartnerTab = ({ userData, isEditing }) => (
  <div className="space-y-10 animate-slide-up">
    <h3 className="text-xl font-black text-white mb-6">Partner Preferences</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <MultiSelectGroup 
        label="Preferred Subjects" 
        values={userData.partnerPrefs.subjects} 
        disabled={!isEditing} 
      />
      <SelectGroup 
        label="Preferred Study Time" 
        value={userData.partnerPrefs.time} 
        disabled={!isEditing} 
        options={['Morning', 'Afternoon', 'Evening', 'Late Night']} 
      />
      <SelectGroup 
        label="Study Style" 
        value={userData.partnerPrefs.style} 
        disabled={!isEditing} 
        options={['Collaborative', 'Silent', 'Teaching-based', 'Exam Prep']} 
      />
      <SelectGroup 
        label="Semester Preference" 
        value={userData.partnerPrefs.semester} 
        disabled={!isEditing} 
        options={['Same as mine', 'Senior', 'Junior', 'Any']} 
      />
    </div>
  </div>
);

const AITab = ({ userData, isEditing }) => (
  <div className="space-y-10 animate-slide-up">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div>
        <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
          <FiCpu className="text-indigo-400" /> AI Tutor Preferences
        </h3>
        <div className="space-y-6">
          <RadioGroup 
            label="Answer Style" 
            value={userData.aiTutor.style} 
            disabled={!isEditing}
            options={[
              { id: 'short', label: 'Concise', desc: 'Short, direct answers' },
              { id: 'detailed', label: 'Detailed', desc: 'In-depth explanations' }
            ]}
          />
          <InputGroup label="Primary Subject Focus" value={userData.aiTutor.focus} disabled={!isEditing} />
        </div>
      </div>

      <div className="h-px md:w-px md:h-auto bg-white/5" />

      <div>
        <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
          <FiBell className="text-violet-400" /> Notification Alerts
        </h3>
        <div className="space-y-4">
          <ToggleRow label="Session Reminders" description="Get notified 15m before a session" value={userData.notifications.reminders} disabled={!isEditing} />
          <ToggleRow label="New Messages" description="Instant alerts for study group chats" value={userData.notifications.messages} disabled={!isEditing} />
          <ToggleRow label="Partner Requests" description="When someone wants to study with you" value={userData.notifications.requests} disabled={!isEditing} />
        </div>
      </div>
    </div>
  </div>
);

// --- Small UI Components ---

const InputGroup = ({ label, type = "text", value, placeholder, disabled, suffix }) => (
  <div className="flex flex-col gap-3 group">
    <label className="text-[11px] uppercase tracking-[0.2em] font-black text-slate-500 ml-1 transition-colors group-focus-within:text-indigo-400">{label}</label>
    <div className="relative">
      <input 
        type={type} 
        defaultValue={value}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-all duration-300 disabled:opacity-50 text-base font-medium shadow-inner"
      />
      {suffix && <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 font-black tracking-tight">{suffix}</span>}
    </div>
  </div>
);

const SmallInput = ({ label, value, disabled, suffix }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[9px] uppercase tracking-widest font-black text-slate-500 text-center">{label}</label>
    <div className="relative">
      <input 
        type="number" 
        defaultValue={value}
        disabled={disabled}
        className="w-full bg-black/20 border border-white/10 rounded-xl px-2 py-2.5 text-center text-white focus:outline-none focus:border-indigo-500/50 transition-all disabled:opacity-50 text-sm font-bold"
      />
      <span className="absolute right-1.5 bottom-1.5 text-[8px] text-slate-600 font-bold uppercase">{suffix}</span>
    </div>
  </div>
);

const SelectGroup = ({ label, value, options, disabled }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 ml-1">{label}</label>
    <select 
      disabled={disabled}
      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-all disabled:opacity-50 appearance-none cursor-pointer"
      defaultValue={value}
    >
      {options.map(opt => <option key={opt} value={opt} className="bg-[#0a0f1e] text-white">{opt}</option>)}
    </select>
  </div>
);

const MultiSelectGroup = ({ label, values, disabled }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 ml-1">{label}</label>
    <div className="flex flex-wrap gap-2 p-3 bg-white/5 border border-white/10 rounded-2xl min-h-[58px]">
      {values.map(val => (
        <span key={val} className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg text-xs font-bold flex items-center gap-2 border border-indigo-500/30">
          {val} {!disabled && <button className="hover:text-white">×</button>}
        </span>
      ))}
      {!disabled && <button className="px-3 py-1 border border-dashed border-slate-700 text-slate-500 rounded-lg text-xs font-bold hover:text-white hover:border-slate-500 transition-colors">+ Add</button>}
    </div>
  </div>
);

const ToggleRow = ({ label, description, value, disabled }) => (
  <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
    <div>
      <h5 className="text-sm font-bold text-white">{label}</h5>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
    <button 
      disabled={disabled}
      className={`w-12 h-6 rounded-full transition-all relative ${value ? 'bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.4)]' : 'bg-slate-800'} ${disabled ? 'opacity-50' : 'cursor-pointer hover:scale-105'}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${value ? 'right-1' : 'left-1'}`} />
    </button>
  </div>
);

const RadioGroup = ({ label, value, options, disabled }) => (
  <div className="flex flex-col gap-4">
    <label className="text-[10px] uppercase tracking-widest font-black text-slate-500 ml-1">{label}</label>
    <div className="space-y-3">
      {options.map(opt => (
        <button
          key={opt.id}
          disabled={disabled}
          className={`w-full flex items-start gap-4 p-4 rounded-2xl border transition-all text-left ${
            value === opt.id 
              ? 'bg-indigo-500/10 border-indigo-500/50 ring-1 ring-indigo-500/20' 
              : 'bg-white/5 border-white/10 hover:border-white/20'
          } ${disabled ? 'opacity-50' : ''}`}
        >
          <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${value === opt.id ? 'border-indigo-500' : 'border-slate-700'}`}>
            {value === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />}
          </div>
          <div>
            <h5 className="text-sm font-bold text-white">{opt.label}</h5>
            <p className="text-xs text-slate-500">{opt.desc}</p>
          </div>
        </button>
      ))}
    </div>
  </div>
);

export default StudentProfile;
