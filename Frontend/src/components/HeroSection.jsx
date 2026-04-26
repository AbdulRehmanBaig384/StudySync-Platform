import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthGuard } from '../context/AuthGuardContext'
import {
  HiOutlineUsers,
  HiOutlineVideoCamera,
  HiOutlineChartBar,
} from 'react-icons/hi'
import { FiArrowRight, FiPlay } from 'react-icons/fi'
import { MdOutlineAccessTimeFilled } from 'react-icons/md'
import { BiCodeAlt, BiTargetLock, BiTrophy } from 'react-icons/bi'
import { RiUserSmileLine } from 'react-icons/ri'

const HeroSection = () => {
  const navigate = useNavigate()
  const { requireAuth } = useAuthGuard()

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background orbs */}
      <div className="orb w-[600px] h-[600px] bg-purple-600 top-[-200px] left-[-200px]" />
      <div className="orb w-[400px] h-[400px] bg-indigo-500 bottom-[-100px] right-[-100px] opacity-10" />
      <div className="orb w-[300px] h-[300px] bg-cyan-400 top-[30%] right-[10%] opacity-10" />

      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="container-max px-6 py-24 grid lg:grid-cols-2 gap-16 items-center w-full">
        {/* Left Content */}
        <div className="flex flex-col gap-8 z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-glass rounded-full px-4 py-2 w-fit">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-slate-300 font-medium">Trusted by 50,000+ students</span>
          </div>

          {/* Headline */}
          <div className="flex flex-col gap-4">
            <h1 className="section-title text-white leading-tight">
              Study Smarter,{' '}
              <span className="text-gradient">Together</span>
              {' '}with{' '}
              <span className="text-gradient-blue">StudySync</span>
            </h1>
            <p className="section-subtitle text-lg">
              The all-in-one collaborative learning platform for university students.
              Find study partners, join live sessions, practice coding, and ace your exams — together.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={requireAuth(() => navigate('/signup'))} 
              className="btn-primary text-base px-8 py-3.5 rounded-xl inline-flex items-center gap-2"
            >
              <HiOutlineUsers className="w-5 h-5" />
              <span>Find Study Partner</span>
            </button>
            <button 
              onClick={requireAuth(() => navigate('/dashboard'))}
              className="btn-secondary text-base px-8 py-3.5 rounded-xl flex items-center gap-2"
            >
              <FiPlay className="w-4 h-4" />
              Start Studying
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 pt-4">
            {[
              { value: '50K+', label: 'Students', Icon: HiOutlineUsers },
              { value: '2K+', label: 'Study Sessions', Icon: HiOutlineVideoCamera },
              { value: '98%', label: 'Satisfaction Rate', Icon: HiOutlineChartBar },
            ].map(stat => (
              <div key={stat.label} className="flex items-center gap-2">
                <stat.Icon className="w-5 h-5 text-indigo-400" />
                <div>
                  <span className="text-2xl font-bold font-jakarta text-white block">{stat.value}</span>
                  <span className="text-sm text-slate-400">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Illustration */}
        <div className="relative items-center justify-center z-10 hidden lg:flex">
          <div className="relative w-[500px] h-[500px]">
            {/* Decorative rings */}
            <div className="absolute inset-0 rounded-full border border-indigo-500/20 animate-spin-slow" />
            <div className="absolute inset-8 rounded-full border border-purple-500/20 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '15s' }} />

            {/* Main card */}
            <div className="absolute inset-16 bg-glass rounded-3xl flex flex-col items-center justify-center gap-4 animate-float glow-purple">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <HiOutlineVideoCamera className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <p className="text-white font-bold font-jakarta text-lg">Live Study Session</p>
                <p className="text-slate-400 text-sm">3 students joined</p>
              </div>
              {/* Avatars row */}
              <div className="flex -space-x-2">
                {[
                  'from-indigo-500 to-purple-600',
                  'from-cyan-500 to-blue-600',
                  'from-pink-500 to-rose-600',
                  'from-green-500 to-emerald-600',
                ].map((g, i) => (
                  <div key={i} className={`w-10 h-10 rounded-full bg-gradient-to-br ${g} border-2 border-slate-900 flex items-center justify-center`}>
                    <RiUserSmileLine className="w-5 h-5 text-white" />
                  </div>
                ))}
              </div>
            </div>

            {/* Floating mini cards */}
            <div className="absolute top-4 right-4 bg-glass rounded-xl px-3 py-2 flex items-center gap-2 animate-float-delayed">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <BiCodeAlt className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white text-xs font-semibold">Coding Room</p>
                <p className="text-green-400 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
                  Live
                </p>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 bg-glass rounded-xl px-3 py-2 flex items-center gap-2 animate-float">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
                <BiTrophy className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white text-xs font-semibold">Quiz Score</p>
                <p className="text-yellow-400 text-xs">95 / 100</p>
              </div>
            </div>

            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-glass rounded-xl px-3 py-2 flex items-center gap-2 animate-float-delayed">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <BiTargetLock className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white text-xs font-semibold">Match Found!</p>
                <p className="text-cyan-400 text-xs">Study Partner</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <span className="text-xs text-slate-400">Scroll to explore</span>
        <div className="w-5 h-8 border border-slate-600 rounded-full flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-slate-400 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  )
}

export default HeroSection
