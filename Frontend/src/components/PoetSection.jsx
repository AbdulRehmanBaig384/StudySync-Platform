import React, { useState, useEffect } from 'react'
import { RiDoubleQuotesL, RiDoubleQuotesR } from 'react-icons/ri'
import { HiOutlineLightBulb, HiOutlineBookOpen, HiOutlineSparkles } from 'react-icons/hi'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const poems = [
  {
    id: 1,
    poet: 'Allama Iqbal',
    title: 'Shikwa & Jawab-e-Shikwa',
    year: '1876 – 1938',
    origin: 'Poet of the East · Pakistan',
    language: 'Urdu',
    gradient: 'from-emerald-500 to-teal-600',
    accent: 'emerald',
    initials: 'AI',
    lines: [
      'خودی کو کر بلند اتنا کہ ہر تقدیر سے پہلے',
      'خدا بندے سے خود پوچھے — بتا تیری رضا کیا ہے',
    ],
    translation: 'Raise yourself so high that before every destiny is written, God Himself asks you — tell me, what is your wish?',
    note: 'Iqbal believed that the awakening of the self through knowledge and education is the greatest revolution a human being can undertake.',
  },
  {
    id: 2,
    poet: 'Allama Iqbal',
    title: 'Bang-e-Dra',
    year: '1876 – 1938',
    origin: 'Poet of the East · Pakistan',
    language: 'Urdu',
    gradient: 'from-violet-500 to-purple-600',
    accent: 'violet',
    initials: 'AI',
    lines: [
      'علم کا مقصد ہے معرفتِ حق',
      'حریتِ وجدان و قوتِ کردار',
    ],
    translation: 'The purpose of knowledge is the recognition of truth — the freedom of conscience and the strength of character.',
    note: 'For Iqbal, true education was not mere accumulation of facts but the ignition of the inner self — the "Khudi" — to pursue truth and purpose.',
  },
  {
    id: 3,
    poet: 'Nelson Mandela',
    title: 'Long Walk to Freedom',
    year: '1918 – 2013',
    origin: 'Statesman & Visionary · South Africa',
    language: 'English',
    gradient: 'from-amber-500 to-orange-600',
    accent: 'amber',
    initials: 'NM',
    lines: [
      '"Education is the most powerful weapon',
      'which you can use to change the world."',
    ],
    translation: '',
    note: 'Mandela spent 27 years in prison yet never stopped learning. He believed education was not a privilege but the birthright of every human being on earth.',
  },
  {
    id: 4,
    poet: 'Aristotle',
    title: 'Nicomachean Ethics',
    year: '384 – 322 BC',
    origin: 'Philosopher · Ancient Greece',
    language: 'Greek',
    gradient: 'from-cyan-500 to-blue-600',
    accent: 'cyan',
    initials: 'AR',
    lines: [
      '"The roots of education are bitter,',
      'but the fruit is sweet."',
    ],
    translation: '',
    note: "Aristotle shaped the foundations of Western philosophy, science, and education. He taught that the discipline of learning, though challenging, bears the sweetest rewards in a person's life.",
  },
  {
    id: 5,
    poet: 'Frederick Douglass',
    title: 'Narrative of the Life',
    year: '1818 – 1895',
    origin: 'Abolitionist & Writer · United States',
    language: 'English',
    gradient: 'from-rose-500 to-pink-600',
    accent: 'rose',
    initials: 'FD',
    lines: [
      '"Once you learn to read,',
      'you will be forever free."',
    ],
    translation: '',
    note: "Douglass escaped slavery and taught himself to read in secret — an act that was illegal. He became one of America's greatest orators, proving that literacy and knowledge are the ultimate liberators.",
  },
]

export default function PoetSection() {
  const [active, setActive] = useState(0)
  const [animating, setAnimating] = useState(false)

  const goTo = (index) => {
    if (animating || index === active) return
    setAnimating(true)
    setTimeout(() => {
      setActive(index)
      setAnimating(false)
    }, 300)
  }

  const prev = () => goTo((active - 1 + poems.length) % poems.length)
  const next = () => goTo((active + 1) % poems.length)

  // Auto-advance every 8 seconds
  useEffect(() => {
    const timer = setInterval(next, 8000)
    return () => clearInterval(timer)
  }, [active])

  const poem = poems[active]

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background orbs */}
      <div className="orb w-[600px] h-[600px] bg-indigo-700 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.06]" />
      <div className="orb w-[300px] h-[300px] bg-purple-600 top-0 right-0 opacity-[0.08]" />

      {/* Decorative grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="container-max relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 bg-glass px-4 py-2 rounded-full">
            <HiOutlineSparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-semibold text-sm uppercase tracking-widest">Inspired by Greatness</span>
          </div>
          <h2 className="section-title text-white">
            Words That{' '}
            <span className="text-gradient">Changed the World</span>
          </h2>
          <p className="section-subtitle text-center">
            The greatest minds in history believed in one truth — education is the
            most powerful force for human liberation and progress.
          </p>
        </div>

        {/* Main Quote Card */}
        <div className="max-w-4xl mx-auto">
          <div className={`relative bg-glass rounded-3xl overflow-hidden border border-white/10 transition-all duration-300 ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>

            {/* Colored top accent bar */}
            <div className={`h-1.5 w-full bg-gradient-to-r ${poem.gradient}`} />

            <div className="p-8 md:p-12">
              <div className="grid md:grid-cols-3 gap-8 items-start">

                {/* Left — Poet info */}
                <div className="flex flex-col items-center md:items-start gap-5">
                  {/* Avatar */}
                  <div className="relative">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${poem.gradient} flex items-center justify-center text-2xl font-bold font-jakarta text-white shadow-2xl`}>
                      {poem.initials}
                    </div>
                    <div className={`absolute -bottom-2 -right-2 w-7 h-7 rounded-lg bg-gradient-to-br ${poem.gradient} flex items-center justify-center shadow-lg`}>
                      <HiOutlineBookOpen className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* Poet details */}
                  <div className="text-center md:text-left">
                    <h3 className="font-jakarta font-bold text-white text-xl">{poem.poet}</h3>
                    <p className="text-slate-400 text-sm mt-1">{poem.year}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{poem.origin}</p>
                  </div>

                  {/* Language tag */}
                  <span className={`text-xs px-3 py-1 rounded-full bg-gradient-to-r ${poem.gradient} text-white font-medium`}>
                    {poem.language}
                  </span>

                  {/* Source */}
                  <div className="bg-white/5 rounded-xl px-4 py-2 text-center md:text-left">
                    <p className="text-slate-500 text-xs">Source</p>
                    <p className="text-slate-300 text-xs font-medium">{poem.title}</p>
                  </div>
                </div>

                {/* Right — Quote */}
                <div className="md:col-span-2 flex flex-col gap-6">
                  {/* Opening quote */}
                  <RiDoubleQuotesL className="w-10 h-10 text-indigo-500/40" />

                  {/* Poetry lines */}
                  <div className="flex flex-col gap-2 pl-2">
                    {poem.lines.map((line, i) => (
                      <p
                        key={i}
                        className="text-white font-jakarta text-2xl md:text-3xl font-bold leading-tight"
                        style={{
                          fontStyle: poem.language === 'Urdu' ? 'normal' : 'italic',
                          direction: poem.language === 'Urdu' ? 'rtl' : 'ltr',
                          textAlign: poem.language === 'Urdu' ? 'right' : 'left',
                          fontFamily: poem.language === 'Urdu' ? "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif" : undefined,
                        }}
                      >
                        {line}
                      </p>
                    ))}
                  </div>

                  {/* Translation */}
                  {poem.translation && (
                    <div className="bg-white/5 rounded-xl p-4 border-l-4 border-indigo-500/50">
                      <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">Translation</p>
                      <p className="text-slate-200 text-base italic leading-relaxed">{poem.translation}</p>
                    </div>
                  )}

                  {/* Closing quote + note */}
                  <div className="flex flex-col gap-3">
                    <RiDoubleQuotesR className="w-8 h-8 text-indigo-500/30 self-end" />
                    <div className="flex items-start gap-3">
                      <HiOutlineLightBulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-400 text-sm leading-relaxed">{poem.note}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {/* Dot indicators */}
            <div className="flex gap-2">
              {poems.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => goTo(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === active
                      ? `w-8 h-2 bg-gradient-to-r ${poem.gradient}`
                      : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to quote ${i + 1}`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex gap-3">
              <button
                onClick={prev}
                className="w-10 h-10 bg-glass border border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:border-white/30 transition-all duration-200 hover:bg-white/10"
                aria-label="Previous quote"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="w-10 h-10 bg-glass border border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:border-white/30 transition-all duration-200 hover:bg-white/10"
                aria-label="Next quote"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Poet thumbnails strip */}
          <div className="mt-6 grid grid-cols-5 gap-3">
            {poems.map((p, i) => (
              <button
                key={p.id}
                onClick={() => goTo(i)}
                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all duration-200 ${
                  i === active
                    ? 'bg-white/10 border-white/20'
                    : 'bg-white/3 border-white/5 hover:bg-white/8 hover:border-white/15'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${p.gradient} flex items-center justify-center text-xs font-bold text-white`}>
                  {p.initials}
                </div>
                <span className={`text-xs font-medium text-center leading-tight transition-colors ${i === active ? 'text-white' : 'text-slate-500'}`}>
                  {p.poet.split(' ').slice(-1)[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
