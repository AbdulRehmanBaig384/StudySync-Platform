import React from 'react'
import {HiOutlineUserCircle,HiOutlineUsers, HiOutlineAcademicCap, HiOutlineChartBar,} from 'react-icons/hi'
import { FiArrowRight } from 'react-icons/fi'
const steps = [
  {
    number: '01',
    Icon: HiOutlineUserCircle,
    title: 'Create Your Student Profile',
    description: 'Sign up and set up your academic profile — add your university, major, subjects, schedule, and learning preferences.',
    color: 'from-indigo-500 to-purple-600',
  },{
    number: '02',
    Icon: HiOutlineUsers,
    title: 'Find Compatible Study Partners',
    description: 'Our smart matching engine recommends the best study partners that align with your goals, pace, and availability.',
    color: 'from-cyan-500 to-blue-600',
  },{
    number: '03',
    Icon: HiOutlineAcademicCap,
    title: 'Join Study Sessions',
    description: 'Jump into virtual study rooms, coding labs, quiz challenges, or live classes — collaborate in real time.',
    color: 'from-green-500 to-emerald-600',
  },
  {
    number: '04',
    Icon: HiOutlineChartBar,
    title: 'Track Your Progress',
    description: 'Review your study stats, scores, achievements, and streaks. Celebrate milestones and stay motivated.',
    color: 'from-orange-500 to-rose-600',
  },]
const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="section-padding relative overflow-hidden">
      <div className="orb w-[500px] h-[500px] bg-indigo-600 bottom-0 left-0 opacity-5" />
      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-20 flex flex-col items-center gap-4">
          <span className="text-indigo-400 font-semibold text-sm uppercase tracking-widest">Simple Process</span>
          <h2 className="section-title text-white">
            How{' '}
            <span className="text-gradient">StudySync</span>
            {' '}Works
          </h2>
          <p className="section-subtitle text-center">
            Get started in minutes. No complicated setup — just create your profile and start learning smarter.
          </p>
        </div>
        {/* Steps */}
        <div className="relative grid md:grid-cols-4 gap-8">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-indigo-500/30 via-cyan-500/30 via-green-500/30 to-orange-500/30" />
          {steps.map(({ number, Icon, title, description, color }) => (
            <div key={number} className="flex flex-col items-center text-center gap-5 group">
              {/* Step Circle */}
              <div className="relative z-10">
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${color} flex flex-col items-center justify-center gap-1 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                  <span className="text-white/70 text-xs font-mono">{number}</span>
                </div>
                <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`} />
              </div>

              {/* Content */}
              <div className="flex flex-col gap-2">
                <h3 className="font-jakarta font-bold text-white text-lg">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA below steps */}
        <div className="text-center mt-16">
          <p className="text-slate-400 mb-4">Ready to get started?</p>
          <button className="btn-primary text-base px-10 py-3.5 rounded-xl flex items-center gap-2 mx-auto">
            <span>Create Your Profile Now</span>
            <FiArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection
