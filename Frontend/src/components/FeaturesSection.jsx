import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthGuard } from '../context/AuthGuardContext'
import {
  HiOutlineUsers,
  HiOutlineVideoCamera,
  HiOutlineCode,
  HiOutlineClipboardCheck,
  HiOutlineFolderOpen,
} from 'react-icons/hi'
import { FiArrowRight } from 'react-icons/fi'
const features = [
  {
    icon: HiOutlineUsers,
    title: 'Study Partner Matching',
    description: 'Our AI-powered algorithm matches you with compatible study partners based on your subjects, schedule, and learning style.',
    gradient: 'from-indigo-500 to-purple-600',
    glow: 'group-hover:shadow-indigo-500/25',
  },
  {
    icon: HiOutlineVideoCamera,
    title: 'Online Study Sessions',
    description: 'Create or join live virtual study rooms with video, audio, shared whiteboards, and real-time collaboration tools.',
    gradient: 'from-cyan-500 to-blue-600',
    glow: 'group-hover:shadow-cyan-500/25',
  },
  {
    icon: HiOutlineCode,
    title: 'Coding Practice Rooms',
    description: 'Collaborative coding environments with syntax highlighting, live code sharing, and instant output for 20+ languages.',
    gradient: 'from-green-500 to-emerald-600',
    glow: 'group-hover:shadow-green-500/25',
  },
  {
    icon: HiOutlineClipboardCheck,
    title: 'Quiz & Practice Tests',
    description: 'Access thousands of quizzes and practice tests, or create your own. Track performance with detailed analytics.',
    gradient: 'from-orange-500 to-rose-600',
    glow: 'group-hover:shadow-orange-500/25',
  },
  {
    icon: HiOutlineFolderOpen,
    title: 'Resource Sharing',
    description: 'Share notes, slides, documents, and study materials within your study groups. Everything organized in one place.',
    gradient: 'from-violet-500 to-pink-600',
    glow: 'group-hover:shadow-violet-500/25',
  },]
const FeaturesSection = () => {
  const navigate = useNavigate()
  const { requireAuth } = useAuthGuard()

  return (
    <section id="features" className="section-padding relative overflow-hidden">
      <div className="orb w-[500px] h-[500px] bg-indigo-600 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5" />
      <div className="container-max">
        {/* header */}
        <div className="text-center mb-16 flex flex-col items-center gap-4">
          <span className="text-indigo-400 font-semibold text-sm uppercase tracking-widest">Platform Features</span>
          <h2 className="section-title text-white">
            Everything You Need to{' '}
            <span className="text-gradient">Learn Better</span>
          </h2>
          <p className="section-subtitle text-center">
            A complete toolkit designed for modern university students who want to
            collaborate, stay productive, and achieve academic excellence.
          </p>
        </div>
        {/* feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                onClick={requireAuth(() => navigate('/dashboard'))}
                className={`group bg-glass rounded-2xl p-6 card-hover cursor-pointer ${feature.glow} group-hover:shadow-2xl ${index === 4 ? 'lg:col-start-2' : ''
                  }`}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-jakarta font-bold text-white text-xl mb-3 group-hover:text-gradient transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-5 flex items-center gap-2 text-indigo-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-8px] group-hover:translate-x-0">
                  <span>Learn more</span>
                  <FiArrowRight className="w-4 h-4" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
export default FeaturesSection
