import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import PartnerFilters from '../components/PartnerFilters';
import PartnerCard from '../components/PartnerCard';
import PartnerRequestList from '../components/PartnerRequestList';
import { FiUsers, FiFilter, FiExternalLink } from 'react-icons/fi';
import { NavLink } from 'react-router';

const FindPartner = () => {
  const partners = [
    {
      id: 1,
      name: 'Sarah Chen',
      department: 'Computer Science',
      semester: 6,
      subjects: ['React', 'Node.js', 'System Design'],
      style: 'Silent Study',
      availability: 'Evenings (6 PM - 9 PM)',
      compatibility: 95,
      avatar: 'SC'
    },
    {
      id: 2,
      name: 'Jordan Smith',
      department: 'Engineering',
      semester: 4,
      subjects: ['Calculus III', 'Physics II'],
      style: 'Discussion',
      availability: 'Afternoons (2 PM - 5 PM)',
      compatibility: 82,
      avatar: 'JS'
    },
    {
      id: 3,
      name: 'Emily Davis',
      department: 'Business',
      semester: 2,
      subjects: ['Economics', 'Business Ethics'],
      style: 'Project-based',
      availability: 'Weekends',
      compatibility: 78,
      avatar: 'ED'
    },
    {
      id: 4,
      name: 'Alex Rivera',
      department: 'Computer Science',
      semester: 6,
      subjects: ['Databases', 'Java Mastery'],
      style: 'Silent Study',
      availability: 'Mornings',
      compatibility: 88,
      avatar: 'AR'
    },
    {
      id: 5,
      name: 'Maya Patel',
      department: 'Design',
      semester: 5,
      subjects: ['UI Design', 'Typography'],
      style: 'Discussion',
      availability: 'Flexible',
      compatibility: 91,
      avatar: 'MP'
    },
    {
      id: 6,
      name: 'Leo King',
      department: 'Mathematics',
      semester: 3,
      subjects: ['Linear Algebra', 'Discrete Math'],
      style: 'Silent Study',
      availability: 'Late Nights',
      compatibility: 85,
      avatar: 'LK'
    }
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="animate-slide-up">
          <h2 className="text-4xl font-black text-white mb-2 font-jakarta tracking-tight">
            Find <span className="text-gradient font-black">Study Partner</span> 🤝
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
            <span className="w-8 h-px bg-indigo-500/30"></span>
            Discover students with matching study styles
          </p>
        </div>
        <div className="flex items-center gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-2xl shadow-indigo-600/20 flex items-center gap-3">
            <FiUsers className="text-lg" />
            My Partners
          </button>
        </div>
      </div>

      {/* Discovery Section */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Main Feed */}
        <div className="xl:col-span-3 space-y-8">
          <PartnerFilters />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner) => (
              <PartnerCard key={partner.id} {...partner} />
            ))}
          </div>

          {/* Load More/Status */}
          <div className="pt-12 pb-20 flex justify-center">
            <button className="bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-3 active:scale-95 shadow-xl">
              Show more potential matches
            </button>
          </div>
        </div>

        {/* Sidebar Interactions */}
        <div className="space-y-8">
          <PartnerRequestList />

          {/* Quick Tip Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-3xl shadow-2xl shadow-indigo-600/20 relative overflow-hidden group animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
            <h4 className="text-white font-black text-xl mb-4 relative z-10 font-jakarta leading-tight">Pro Tip: Fill your Profile!</h4>
            <p className="text-indigo-100/70 text-sm font-medium mb-6 relative z-10 leading-relaxed">Students with complete profiles get 4x more partner requests.</p>
            <button className="w-full bg-white text-indigo-700 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-50 transition-all relative z-10 shadow-lg">
              <NavLink to={'/StudentProfile'}> Update Profile </NavLink>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FindPartner;
