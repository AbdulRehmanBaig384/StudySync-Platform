import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';
import StreakTracker from '../components/StreakTracker';
import QuizCard from '../components/QuizCard';
import AnalyticsSection from '../components/AnalyticsSection';
import AITutorChat from '../components/AITutorChat';
import StudySessionList from '../components/StudySessionList';
import CodingChallengeCard from '../components/CodingChallengeCard';
import ResourceList from '../components/ResourceList';
import Leaderboard from '../components/Leaderboard';
import { FiBookOpen, FiClock, FiTarget, FiZap, FiPlus, FiBell } from 'react-icons/fi';

const Dashboard = () => {
  return (
    <DashboardLayout>
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="animate-slide-up">
          <h2 className="text-4xl font-black text-white mb-2 font-jakarta tracking-tight">
            Welcome back, <span className="text-gradient font-black">Alex!</span> 👋
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
            <span className="w-8 h-px bg-indigo-500/30"></span>
            You've completed 85% of your weekly goal
          </p>
        </div>
        <div className="flex items-center gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <button className="relative p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-all shadow-xl backdrop-blur-md">
            <FiBell className="text-xl" />
            <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#0a0f1e] animate-pulse"></span>
          </button>
          <button className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-7 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-indigo-600/20 group">
            <div className="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform">
              <FiPlus className="text-lg" />
            </div>
            Start Session
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <StatCard
          title="Study Hours"
          value="42.5h"
          icon={<FiClock />}
          trend="up"
          trendValue="12%"
          color="indigo"
        />
        <StatCard
          title="Courses Active"
          value="6"
          icon={<FiBookOpen />}
          color="blue"
        />
        <StatCard
          title="Avg. Quiz Score"
          value="92%"
          icon={<FiTarget />}
          trend="up"
          trendValue="5%"
          color="emerald"
        />
        <StatCard
          title="Current Streak"
          value="14 Days"
          icon={<FiZap />}
          trend="up"
          trendValue="2 days"
          color="amber"
        />
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">
        {/* Left 2 Columns */}
        <div className="xl:col-span-2 space-y-8">
          {/* Analytics Block */}
          <AnalyticsSection />

          {/* Quiz Section */}
          <section className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-white font-jakarta tracking-tight">Ready to Practice?</h3>
              <button className="text-indigo-400 font-black uppercase tracking-widest text-[10px] hover:text-indigo-300 transition-colors">See all quizzes</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <QuizCard
                title="React Hooks Mastery"
                questions={20}
                duration={15}
                category="Engineering"
                difficulty="Intermediate"
                image="https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1470&auto=format&fit=crop"
              />
              <QuizCard
                title="System Design Basics"
                questions={15}
                duration={20}
                category="Architecture"
                difficulty="Advanced"
                image="https://images.unsplash.com/photo-1508921331509-4c7ee27c0d23?q=80&w=1470&auto=format&fit=crop"
                completed={true}
              />
            </div>
          </section>

          {/* AI Tutor Chat - Desktop Only maybe, or just below */}
          <AITutorChat />
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-8">
          <StreakTracker currentStreak={14} goal={20} />
          <StudySessionList />
          <Leaderboard />
          <CodingChallengeCard />
          <ResourceList />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

