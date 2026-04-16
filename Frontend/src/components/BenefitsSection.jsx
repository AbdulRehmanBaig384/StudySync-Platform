import React from 'react'
import {HiOutlineLightBulb, HiOutlineChatAlt2,HiOutlineTrendingUp,HiOutlineBookOpen,HiOutlineAcademicCap,HiOutlineVideoCamera,
  HiOutlineGlobe,
  HiOutlineStar,
} from 'react-icons/hi'

const benefits = [
  {
    Icon: HiOutlineLightBulb,
    title: 'Smart Study Partner Matching',
    description: 'AI-driven matching finds study partners based on subjects, availability, learning pace, and personal goals.',
    gradient: 'from-indigo-500 to-purple-600',
  },
  {
    Icon: HiOutlineChatAlt2,
    title: 'Real-Time Chat & Collaboration',
    description: 'Instant messaging, voice chat, video calls, and shared editor — everything in one seamless workspace.',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    Icon: HiOutlineTrendingUp,
    title: 'Productivity Tracking',
    description: 'Daily streaks, focus timers, study logs, and performance trends help you stay accountable and on track.',
    gradient: 'from-green-500 to-emerald-600',
  },
  {
    Icon: HiOutlineBookOpen,
    title: 'Study Resources Library',
    description: 'Access a vast library of notes, past papers, textbooks, and study guides curated by peers and educators.',
    gradient: 'from-orange-500 to-rose-600',
  },
]

const stats = [
  { value: '50K+', label: 'Active Students', Icon: HiOutlineAcademicCap },
  { value: '5K+', label: 'Study Sessions Daily', Icon: HiOutlineVideoCamera },
  { value: '200+', label: 'Universities', Icon: HiOutlineGlobe },
  { value: '4.9★', label: 'App Rating', Icon: HiOutlineStar },
]

const BenefitsSection = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="orb w-[350px] h-[350px] bg-green-500 top-0 right-0 opacity-5" />

      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-16 flex flex-col items-center gap-4">
          <span className="text-green-400 font-semibold text-sm uppercase tracking-widest">Why StudySync?</span>
          <h2 className="section-title text-white">
            Built for{' '}
            <span className="text-gradient">Student Success</span>
          </h2>
          <p className="section-subtitle text-center">
            Every feature is crafted to remove friction from studying so you can focus
            on what matters most — actually learning.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map(({ Icon, title, description, gradient }) => (
            <div
              key={title}
              className="group bg-glass rounded-2xl p-6 text-center card-hover flex flex-col items-center gap-4 border border-white/5 hover:border-white/10"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="font-jakarta font-bold text-white text-base mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Banner */}
        <div className="mt-20 bg-glass rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ value, label, Icon }) => (
            <div key={label} className="text-center flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                <Icon className="w-6 h-6 text-indigo-400" />
              </div>
              <div className="text-2xl font-bold font-jakarta text-white">{value}</div>
              <div className="text-slate-400 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BenefitsSection
