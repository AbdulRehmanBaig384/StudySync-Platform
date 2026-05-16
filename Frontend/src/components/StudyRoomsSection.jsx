import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthGuard } from '../context/AuthGuardContext'
import {
  BiCodeAlt,
  BiQuestionMark,
  BiGroup,
} from 'react-icons/bi'
import { MdOutlineSchool } from 'react-icons/md'
import { FiArrowRight } from 'react-icons/fi'
import { HiOutlineStatusOnline } from 'react-icons/hi'

const rooms = [
  {
    Icon: BiCodeAlt,
    title: 'Coding Study Room',
    description: 'Collaborate in real-time coding environments. Solve algorithms, debug code, and pair-program with study partners.',
    color: 'from-green-500 to-emerald-600',
    bgAccent: 'hover:border-green-500/40',
    tag: '124 Active',
    tagColor: 'text-green-400',
    features: ['Live Code Sharing', 'Syntax Highlighting', '20+ Languages'],
  },
  {
    Icon: HiOutlineStatusOnline,
    title: 'Quiz Practice Room',
    description: 'Challenge yourself or your peers with adaptive quizzes, timed tests, and instant performance feedback.',
    color: 'from-orange-500 to-rose-600',
    bgAccent: 'hover:border-orange-500/40',
    tag: '89 Active',
    tagColor: 'text-orange-400',
    features: ['Adaptive Quizzes', 'Score Analytics', 'Leaderboards'],
  },
  {
    Icon: MdOutlineSchool,
    title: 'Online Class Room',
    description: 'Attend or host live virtual lectures with teachers. Record sessions, take notes, and ask questions in real-time.',
    color: 'from-indigo-500 to-purple-600',
    bgAccent: 'hover:border-indigo-500/40',
    tag: '56 Active',
    tagColor: 'text-indigo-400',
    features: ['Live Lectures', 'Session Recording', 'Q&A Mode'],
  },
  {
    Icon: BiGroup,
    title: 'Group Study Room',
    description: 'Form study groups, share resources, whiteboard ideas together, and hold structured study sprints.',
    color: 'from-cyan-500 to-blue-600',
    bgAccent: 'hover:border-cyan-500/40',
    tag: '201 Active',
    tagColor: 'text-cyan-400',
    features: ['Shared Whiteboard', 'File Sharing', 'Study Sprints'],
  },
]

const StudyRoomsSection = () => {
  const navigate = useNavigate()
  const { requireAuth } = useAuthGuard()

  return (
    <section id="study-rooms" className="section-padding relative overflow-hidden">
      <div className="orb w-[400px] h-[400px] bg-cyan-500 bottom-0 right-0 opacity-5" />

      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-16 flex flex-col items-center gap-4">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-widest">Virtual Spaces</span>
          <h2 className="section-title text-white">
            Your{' '}
            <span className="text-gradient-blue">Study Rooms</span>
            {' '}Await
          </h2>
          <p className="section-subtitle text-center">
            Specialized virtual environments built for every kind of study need.
            Jump in and start learning with others right now.
          </p>
        </div>

        {/* Room Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {rooms.map(({ Icon, title, description, color, bgAccent, tag, tagColor, features }) => (
            <div
              key={title}
              className={`group bg-glass rounded-2xl p-6 flex flex-col gap-4 border border-white/5 ${bgAccent} transition-all duration-300 card-hover`}
            >
              {/* Icon + Live Badge */}
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-xs bg-white/5 ${tagColor} px-2 py-1 rounded-full flex items-center gap-1`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
                  {tag}
                </span>
              </div>

              {/* Content */}
              <div>
                <h3 className="font-jakarta font-bold text-white text-lg mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
              </div>

              {/* Feature Tags */}
              <div className="flex flex-wrap gap-1.5">
                {features.map(f => (
                  <span key={f} className="text-xs text-slate-300 bg-white/5 px-2 py-1 rounded-md">
                    {f}
                  </span>
                ))}
              </div>

              {/* Join Button */}
              <button
                onClick={requireAuth(() => navigate('/dashboard'))}
                className={`w-full mt-auto bg-gradient-to-r ${color} text-white text-sm font-semibold py-2.5 rounded-xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2`}
              >
                Join Now <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StudyRoomsSection
