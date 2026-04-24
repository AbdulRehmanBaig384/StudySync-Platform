import React, { useState } from 'react';
import { 
  FiStar, 
  FiZap, 
  FiLock, 
  FiCheck, 
  FiTrendingUp, 
  FiCpu, 
  FiBookOpen, 
  FiActivity, 
  FiMap, 
  FiCreditCard, 
  FiAward,
  FiChevronRight,
  FiSearch,
  FiFilter,
  FiPlay,
  FiBarChart2,
  FiTarget,
  FiCode
} from 'react-icons/fi';
import DashboardLayout from '../components/DashboardLayout';

const ProHub = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  return (
    <DashboardLayout>
      <div className="space-y-16 animate-fade-in pb-20">
        
        {/* --- HERO & PRICING SECTION --- */}
        <section className="text-center space-y-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full">
              <FiStar className="text-amber-500" />
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Premium Experience</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Unlock Your <span className="text-gradient">Academic Potential</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
              Join thousands of elite students using StudySync Pro to master complex subjects with AI-driven intelligence and exclusive resources.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-12 h-6 bg-white/5 rounded-full relative p-1 transition-all"
            >
              <div className={`w-4 h-4 bg-indigo-500 rounded-full transition-all ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <span className={`text-xs font-bold ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-500'}`}>Yearly <span className="text-emerald-400 text-[10px] ml-1">(Save 20%)</span></span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
            <PricingCard 
              name="Free" 
              price="0" 
              features={['Basic AI Chat', 'Public Resources', '1 Study Session/Day']} 
              btnText="Current Plan"
              active={false}
            />
            <PricingCard 
              name="Student Plus" 
              price={billingCycle === 'monthly' ? '9' : '7'} 
              features={['Advanced AI Tutor', 'Private Study Rooms', 'Unlimited Resources', 'Mock Exams']} 
              btnText="Get Started"
              popular={true}
              active={true}
            />
            <PricingCard 
              name="Premium Tutor" 
              price={billingCycle === 'monthly' ? '29' : '24'} 
              features={['1-on-1 AI Mentorship', 'Hardest Problems Mode', 'Personalized Roadmap', 'Official Certificates']} 
              btnText="Go Elite"
              active={false}
            />
          </div>
        </section>

        {/* --- AI PREMIUM EXPERIENCE --- */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              <FiCpu className="text-indigo-400" /> AI World Experience
            </h2>
            <button className="text-xs font-bold text-indigo-400 hover:underline">Explore AI Mode</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<FiZap />} 
              title="24/7 Expert AI" 
              desc="Instant answers for DSA, DBMS, and Web Dev."
            />
            <FeatureCard 
              icon={<FiMap />} 
              title="Guided Solving" 
              desc="Step-by-step logic without giving the answer."
              locked={true}
            />
            <FeatureCard 
              icon={<FiActivity />} 
              title="Exam Mode" 
              desc="MCQs & Short questions tailored to exams."
              locked={true}
            />
            <FeatureCard 
              icon={<FiCode />} 
              title="Code Tutor" 
              desc="Live debugging and logic optimization."
              locked={true}
            />
          </div>
        </section>

        {/* --- MARKETPLACE & CHALLENGES --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Course Marketplace (Left 2/3) */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              <FiBookOpen className="text-violet-400" /> Course Marketplace
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CourseCard title="Mastering System Design" tag="Advanced" instructor="Dr. Arshad" rating={4.9} />
              <CourseCard title="Full Stack React Pro" tag="Beginner" instructor="Engr. Ahsan" rating={4.8} />
            </div>
          </div>

          {/* Hardest Problems (Right 1/3) */}
          <div className="space-y-8">
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              <FiAward className="text-rose-400" /> Elite Challenges
            </h2>
            <div className="bg-glass-dark border border-white/5 rounded-[2rem] p-8 space-y-6 relative overflow-hidden group">
              <div className="absolute top-4 right-4 w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-400 shadow-lg">
                <FiLock />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Hardest Problem Mode</h3>
                <p className="text-xs text-slate-500 leading-relaxed">Weekly LeetCode-style elite challenges for top 1% students.</p>
              </div>
              <div className="blur-[2px] opacity-30 select-none space-y-3 pointer-events-none">
                <div className="h-4 bg-white/5 rounded-full w-3/4" />
                <div className="h-4 bg-white/5 rounded-full w-1/2" />
              </div>
              <button className="w-full py-3 bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                Unlock Elite Mode
              </button>
            </div>
          </div>

        </div>

        {/* --- INTELLIGENCE & ROADMAP --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-glass-dark border border-white/5 rounded-[2.5rem] p-10 space-y-8">
            <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
              <FiTarget className="text-emerald-400" /> Learning Path
            </h3>
            <div className="space-y-6">
              <RoadmapStep title="Foundation: Basic React" completed={true} />
              <RoadmapStep title="Intermediate: State Management" completed={true} />
              <RoadmapStep title="Advanced: System Design" current={true} />
              <RoadmapStep title="Elite: Enterprise Patterns" locked={true} />
            </div>
          </div>

          <div className="bg-glass-dark border border-white/5 rounded-[2.5rem] p-10 space-y-8 relative overflow-hidden">
            <div className="absolute top-6 right-8 text-indigo-400 text-2xl opacity-10">
              <FiBarChart2 />
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
              <FiTrendingUp className="text-indigo-400" /> Progress Intel
            </h3>
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Skill Score</span>
                  <p className="text-2xl font-black text-white mt-1">72<span className="text-xs text-slate-500">/100</span></p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Study Efficiency</span>
                  <p className="text-2xl font-black text-emerald-400 mt-1">84%</p>
                </div>
              </div>
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Weak Topic Alert</span>
                <p className="text-xs text-slate-400 italic">"Recursive Backtracking seems to be your primary bottleneck in recent DSA tests."</p>
              </div>
              <button className="w-full py-4 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                Generate Full Report
              </button>
            </div>
          </div>

        </section>

      </div>
    </DashboardLayout>
  );
};

// --- Sub-Components ---

const PricingCard = ({ name, price, features, btnText, popular, active }) => (
  <div className={`p-10 rounded-[3rem] border flex flex-col h-full transition-all hover:-translate-y-2 ${
    popular 
      ? 'bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border-indigo-500/30 scale-105 shadow-2xl shadow-indigo-600/10' 
      : 'bg-glass-dark border-white/5'
  }`}>
    {popular && <span className="mx-auto -mt-14 mb-8 px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Most Popular</span>}
    <h3 className="text-xl font-black text-white uppercase tracking-tight">{name}</h3>
    <div className="mt-6 flex items-baseline gap-1">
      <span className="text-4xl font-black text-white">${price}</span>
      <span className="text-slate-500 text-sm">/mo</span>
    </div>
    <ul className="mt-10 space-y-4 flex-1">
      {features.map((f, i) => (
        <li key={i} className="flex items-center gap-3 text-xs text-slate-400">
          <FiCheck className="text-emerald-500 flex-shrink-0" /> {f}
        </li>
      ))}
    </ul>
    <button className={`mt-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
      active 
        ? 'bg-white text-indigo-900' 
        : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
    }`}>
      {btnText}
    </button>
  </div>
);

const FeatureCard = ({ icon, title, desc, locked }) => (
  <div className="group p-6 bg-glass-dark border border-white/5 rounded-3xl space-y-4 hover:border-indigo-500/20 transition-all relative overflow-hidden">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all ${locked ? 'bg-slate-800 text-slate-600' : 'bg-indigo-500/10 text-indigo-400'}`}>
      {locked ? <FiLock /> : icon}
    </div>
    <div>
      <h4 className="text-sm font-bold text-white mb-1">{title}</h4>
      <p className="text-[11px] text-slate-500 leading-relaxed">{desc}</p>
    </div>
    {locked && (
      <div className="absolute inset-0 bg-[#0a0f1e]/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <button className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg">Upgrade</button>
      </div>
    )}
  </div>
);

const CourseCard = ({ title, tag, instructor, rating }) => (
  <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:border-violet-500/20 transition-all group cursor-pointer">
    <div className="h-40 bg-black/20 rounded-2xl mb-5 flex items-center justify-center relative overflow-hidden">
      <FiPlay className="text-4xl text-white/10 group-hover:text-white/40 transition-all group-hover:scale-125" />
      <span className="absolute top-4 left-4 px-3 py-1 bg-violet-600/10 text-violet-400 text-[9px] font-black uppercase tracking-widest rounded-lg border border-violet-500/20">{tag}</span>
    </div>
    <div className="space-y-3">
      <h3 className="font-bold text-white group-hover:text-violet-400 transition-colors">{title}</h3>
      <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
        <span>By {instructor}</span>
        <div className="flex items-center gap-1 text-amber-500">
          <FiStar fill="currentColor" /> {rating}
        </div>
      </div>
      <button className="w-full py-2.5 bg-white/5 group-hover:bg-violet-600 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white rounded-xl transition-all">Preview Course</button>
    </div>
  </div>
);

const RoadmapStep = ({ title, completed, current, locked }) => (
  <div className="flex items-center gap-4 relative group">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center z-10 transition-all ${
      completed ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
      current ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 border border-indigo-500/20' : 
      'bg-slate-800 text-slate-600 border border-white/5'
    }`}>
      {completed ? <FiCheck /> : locked ? <FiLock /> : <FiZap />}
    </div>
    <div className="flex-1">
      <p className={`text-xs font-bold ${locked ? 'text-slate-600' : 'text-white'}`}>{title}</p>
      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{completed ? 'Completed' : current ? 'In Progress' : 'Locked'}</span>
    </div>
    {!locked && <FiChevronRight className="text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity" />}
  </div>
);

export default ProHub;
