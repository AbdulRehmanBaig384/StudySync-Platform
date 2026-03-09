import React from 'react'
import {
  MdOutlineSchool,
  MdOutlineAssignment,
  MdOutlineBarChart,
  MdOutlineLiveTv,
} from 'react-icons/md'
import { FiArrowRight } from 'react-icons/fi'
import { HiOutlineCheckCircle } from 'react-icons/hi'

const teacherFeatures = [
  {
    Icon: MdOutlineSchool,
    title: 'Create Online Classes',
    description: 'Set up virtual classrooms with custom schedules, capacity limits, and prerequisites for your students.',
  },
  {
    Icon: MdOutlineAssignment,
    title: 'Assign Quizzes & Tasks',
    description: 'Build and assign quizzes, homework, and coding challenges with automated grading and due dates.',
  },
  {
    Icon: MdOutlineBarChart,
    title: 'Monitor Student Progress',
    description: 'Access real-time dashboards showing individual and class-wide performance, engagement, and attendance.',
  },
  {
    Icon: MdOutlineLiveTv,
    title: 'Host Live Study Sessions',
    description: 'Run interactive live sessions with screen sharing, polls, whiteboards, and breakout rooms.',
  },
]

const TeacherSection = () => {
  return (
    <section id="teachers" className="section-padding relative overflow-hidden">
      <div className="orb w-[400px] h-[400px] bg-purple-600 top-0 left-0 opacity-5" />

      <div className="container-max">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Dashboard Mockup */}
          <div className="relative order-2 lg:order-1">
            <div className="relative bg-glass rounded-3xl p-8 glow-purple">
              {/* Teacher header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <MdOutlineSchool className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Prof. Sarah Ahmed</p>
                  <p className="text-slate-400 text-xs">CS101 - Data Structures</p>
                </div>
                <span className="ml-auto text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                  Live
                </span>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: 'Students', value: '34', color: 'text-indigo-400' },
                  { label: 'Joined', value: '28', color: 'text-green-400' },
                  { label: 'Avg. Score', value: '87%', color: 'text-yellow-400' },
                ].map(s => (
                  <div key={s.label} className="bg-white/5 rounded-xl p-3 text-center">
                    <p className={`text-xl font-bold font-jakarta ${s.color}`}>{s.value}</p>
                    <p className="text-slate-400 text-xs">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Progress bars */}
              <div className="flex flex-col gap-3">
                <p className="text-slate-300 text-xs font-semibold uppercase tracking-wider mb-1">Assignment Completion</p>
                {[
                  { name: 'Quiz 1 - Arrays', pct: 92, color: 'bg-indigo-500' },
                  { name: 'Lab 3 - Recursion', pct: 78, color: 'bg-cyan-500' },
                  { name: 'Project 1 - Trees', pct: 65, color: 'bg-purple-500' },
                ].map(task => (
                  <div key={task.name}>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>{task.name}</span>
                      <span>{task.pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${task.color} rounded-full transition-all duration-500`}
                        style={{ width: `${task.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom actions */}
              <div className="flex gap-2 mt-6">
                <button className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold py-2.5 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5">
                  <MdOutlineLiveTv className="w-4 h-4" />
                  Announcement
                </button>
                <button className="flex-1 bg-white/5 text-slate-300 text-xs font-semibold py-2.5 rounded-xl hover:bg-white/10 transition-colors border border-white/10 flex items-center justify-center gap-1.5">
                  <MdOutlineAssignment className="w-4 h-4" />
                  Assign Task
                </button>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-glass rounded-2xl px-4 py-3 flex items-center gap-2 animate-float">
              <HiOutlineCheckCircle className="w-6 h-6 text-yellow-400" />
              <div>
                <p className="text-white text-xs font-bold">Top Rated</p>
                <p className="text-yellow-400 text-xs">4.9 / 5.0</p>
              </div>
            </div>
          </div>

          {/* Right - Text Content */}
          <div className="order-1 lg:order-2 flex flex-col gap-8">
            <div>
              <span className="text-purple-400 font-semibold text-sm uppercase tracking-widest">For Educators</span>
              <h2 className="section-title text-white mt-3">
                Empower Your{' '}
                <span className="text-gradient">Teaching</span>
              </h2>
              <p className="section-subtitle mt-4">
                StudySync gives teachers and mentors powerful tools to create engaging online classes,
                monitor progress, and support students — all from one dashboard.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              {teacherFeatures.map(({ Icon, title, description }) => (
                <div key={title} className="flex gap-4 group">
                  <div className="w-12 h-12 flex-shrink-0 bg-glass rounded-xl flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-indigo-600 transition-all duration-300">
                    <Icon className="w-6 h-6 text-slate-300 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold font-jakarta mb-1">{title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="btn-primary w-fit text-sm px-8 py-3 rounded-xl flex items-center gap-2">
              <span>Start as a Teacher</span>
              <FiArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TeacherSection
