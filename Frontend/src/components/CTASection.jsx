import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthGuard } from '../context/AuthGuardContext'
import {
  HiOutlineShieldCheck,
  HiOutlineUsers,
  HiOutlineAcademicCap,
  HiOutlineLightningBolt,
} from 'react-icons/hi'
import { FiArrowRight } from 'react-icons/fi'
import { RiRocketLine } from 'react-icons/ri'

const CTASection = () => {
  const navigate = useNavigate()
  const { requireAuth } = useAuthGuard()

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="container-max">
        <div className="relative bg-glass rounded-3xl p-12 md:p-20 overflow-hidden text-center">
          {/* Background blobs */}
          <div className="absolute top-[-60px] left-[-60px] w-72 h-72 rounded-full bg-indigo-600 opacity-20 blur-3xl" />
          <div className="absolute bottom-[-60px] right-[-60px] w-72 h-72 rounded-full bg-purple-600 opacity-20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-500 opacity-5 blur-3xl" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* Icon */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl animate-pulse-glow">
              <RiRocketLine className="w-10 h-10 text-white" />
            </div>

            {/* Headline */}
            <h2 className="section-title text-white max-w-2xl">
              Join Thousands of Students Improving Their{' '}
              <span className="text-gradient">Study Habits</span>
              {' '}with StudySync
            </h2>

            <p className="section-subtitle text-center max-w-xl">
              Start for free today. No credit card required. Connect with study partners,
              join live sessions, and unlock your academic potential.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              <button 
                onClick={requireAuth(() => navigate('/signup'))} 
                className="btn-primary text-base px-10 py-4 rounded-xl inline-flex items-center gap-2"
              >
                <span>Get Started Free</span>
                <FiArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={requireAuth(() => navigate('/dashboard'))}
                className="btn-secondary text-base px-8 py-4 rounded-xl flex items-center gap-2"
              >
                Learn More
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
              <div className="flex -space-x-3">
                {[
                  'from-indigo-500 to-purple-600',
                  'from-cyan-500 to-blue-600',
                  'from-pink-500 to-rose-600',
                  'from-green-500 to-emerald-600',
                  'from-orange-500 to-amber-600',
                ].map((g, i) => (
                  <div key={i} className={`w-10 h-10 rounded-full bg-gradient-to-br ${g} border-2 border-slate-900 flex items-center justify-center`}>
                    <HiOutlineUsers className="w-5 h-5 text-white" />
                  </div>
                ))}
              </div>
              <p className="text-slate-400 text-sm">
                <span className="text-white font-semibold">50,000+</span> students already studying smarter
              </p>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-4 pt-6 border-t border-white/10 w-full">
              {[
                { Icon: HiOutlineShieldCheck, text: 'Secure & Private' },
                { Icon: HiOutlineLightningBolt, text: 'Free to Start' },
                { Icon: HiOutlineAcademicCap, text: '200+ Universities' },
                { Icon: FiArrowRight, text: 'Instant Access' },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-indigo-400" />
                  <span className="text-slate-400 text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTASection
