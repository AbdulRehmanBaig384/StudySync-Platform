import React, { useState } from 'react'
import { HiOutlineStar } from 'react-icons/hi'
import { RiDoubleQuotesL } from 'react-icons/ri'

const testimonials = [
  {
    name: 'Aisha Khan',
    role: 'Computer Science, Final Year',
    university: 'NUST',
    initials: 'AK',
    rating: 5,
    text: "StudySync completely transformed how I prepare for exams. I found an amazing study group through the matching feature and our Coding Room sessions have helped me ace three Data Structures assignments!",
    gradient: 'from-indigo-500 to-purple-600',
  },
  {
    name: 'Omar Farooq',
    role: 'Business Administration, 3rd Year',
    university: 'LUMS',
    initials: 'OF',
    rating: 5,
    text: "The quiz practice rooms are incredible. I went from struggling with economics to scoring in the top 10% of my class. The AI-suggested study partners were spot on for my learning style.",
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    name: 'Fatima Malik',
    role: 'Medical Sciences, 2nd Year',
    university: 'PUMHS',
    initials: 'FM',
    rating: 5,
    text: "As a medical student, keeping up with vast syllabi is overwhelming. StudySync's resource library and live study sessions with senior students have been a lifesaver for my anatomy prep.",
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    name: 'Hassan Raza',
    role: 'Software Engineering, Final Year',
    university: 'COMSATS',
    initials: 'HR',
    rating: 5,
    text: "The coding practice rooms with live collaboration are genuinely the best I've used. Being able to debug code together with study partners in real-time is something no other platform offers.",
    gradient: 'from-green-500 to-emerald-600',
  },
  {
    name: 'Zara Ahmed',
    role: 'Mathematics, 3rd Year',
    university: 'QAU',
    initials: 'ZA',
    rating: 5,
    text: "I started using StudySync three months ago and my GPA jumped from 2.8 to 3.6. The productivity tracking keeps me accountable, and finding study partners with the same course load was incredibly useful.",
    gradient: 'from-orange-500 to-amber-600',
  },
  {
    name: 'Ali Kamran',
    role: 'Electrical Engineering, 2nd Year',
    university: 'UET',
    initials: 'AK',
    rating: 5,
    text: "My professor uses StudySync to host our supplementary sessions and track our progress. The teacher-side tools are phenomenal — I always know exactly what I need to work on.",
    gradient: 'from-violet-500 to-purple-600',
  },
]

const StarRating = ({ rating }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <HiOutlineStar
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`}
        style={i < rating ? { fill: 'currentColor' } : {}}
      />
    ))}
  </div>
)

const TestimonialsSection = () => {
  const [hovered, setHovered] = useState(null)

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="orb w-[400px] h-[400px] bg-pink-600 top-0 right-0 opacity-5" />

      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-16 flex flex-col items-center gap-4">
          <span className="text-pink-400 font-semibold text-sm uppercase tracking-widest">Student Reviews</span>
          <h2 className="section-title text-white">
            Loved by{' '}
            <span className="text-gradient">Students</span>
            {' '}Everywhere
          </h2>
          <p className="section-subtitle text-center">
            Thousands of students across Pakistan and beyond have transformed their academic
            performance using StudySync.
          </p>
        </div>
        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <div
              key={t.name}
              className="group bg-glass rounded-2xl p-6 flex flex-col gap-4 card-hover border border-white/5 hover:border-white/10 cursor-default"
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Quote icon */}
              <RiDoubleQuotesL className="w-8 h-8 text-slate-700" />

              {/* Text */}
              <p className="text-slate-300 text-sm leading-relaxed flex-1">{t.text}</p>

              {/* Rating */}
              <StarRating rating={t.rating} />

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center flex-shrink-0 font-bold text-white text-sm ${hovered === index ? 'scale-110' : ''} transition-transform duration-300`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-slate-400 text-xs">{t.role}</p>
                  <p className="text-slate-500 text-xs">{t.university}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Aggregate Rating */}
        <div className="mt-12 text-center flex flex-col items-center gap-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <HiOutlineStar key={i} className="w-6 h-6 text-yellow-400" style={{ fill: 'currentColor' }} />
            ))}
          </div>
          <p className="text-white font-bold text-lg font-jakarta">4.9 out of 5.0</p>
          <p className="text-slate-400 text-sm">Based on 12,000+ student reviews</p>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
