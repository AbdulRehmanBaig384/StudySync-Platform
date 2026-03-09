import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  HiOutlineBookOpen,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineShieldCheck,
  HiOutlineLightBulb,
  HiOutlineTrendingUp,
  HiOutlineBookmark,
  HiOutlineAcademicCap,
  HiOutlineCheckCircle,
  HiOutlineUsers,
} from 'react-icons/hi'
import { FaGoogle, FaGithub } from 'react-icons/fa'
import { FiArrowRight, FiLoader, FiChevronDown } from 'react-icons/fi'
import { MdOutlineSchool, MdOutlineVideoCall } from 'react-icons/md'

const universities = [
  'NUST', 'FAST-NUCES', 'LUMS', 'COMSATS', 'UET Lahore', 'UET Taxila',
  'GIKI', 'IBA Karachi', 'NED University', 'QAU', 'SZABIST', 'Air University',
  'Bahria University', 'Punjab University', 'University of Karachi', 'Other',
]

const subjects = [
  'Computer Science', 'Software Engineering', 'Electrical Engineering',
  'Mechanical Engineering', 'Business Administration', 'Mathematics',
  'Physics', 'Medical Sciences', 'Data Science', 'Cybersecurity', 'Other',
]

const SignUp = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '',
    university: '', subject: '', yearOfStudy: '',
    password: '', confirmPassword: '', agreeToTerms: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateStep1 = () => {
    const errs = {}
    if (!formData.firstName.trim()) errs.firstName = 'First name is required'
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required'
    if (!formData.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Enter a valid email'
    return errs
  }

  const validateStep2 = () => {
    const errs = {}
    if (!formData.university) errs.university = 'Please select your university'
    if (!formData.subject) errs.subject = 'Please select your subject'
    if (!formData.yearOfStudy) errs.yearOfStudy = 'Please select your year of study'
    return errs
  }

  const validateStep3 = () => {
    const errs = {}
    if (!formData.password) errs.password = 'Password is required'
    else if (formData.password.length < 8) errs.password = 'Password must be at least 8 characters'
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
      errs.password = 'Must include uppercase, lowercase, and a number'
    if (!formData.confirmPassword) errs.confirmPassword = 'Please confirm your password'
    else if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    if (!formData.agreeToTerms) errs.agreeToTerms = 'You must agree to the terms'
    return errs
  }

  const getPasswordStrength = (pw) => {
    if (!pw) return { strength: 0, label: '', color: '' }
    let score = 0
    if (pw.length >= 8) score++
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++
    if (/\d/.test(pw)) score++
    if (/[^a-zA-Z\d]/.test(pw)) score++
    return [
      { strength: 0, label: '', color: '' },
      { strength: 25, label: 'Weak', color: 'bg-red-500' },
      { strength: 50, label: 'Fair', color: 'bg-orange-500' },
      { strength: 75, label: 'Good', color: 'bg-yellow-500' },
      { strength: 100, label: 'Strong', color: 'bg-green-500' },
    ][score]
  }

  const passwordStrength = getPasswordStrength(formData.password)

  const nextStep = () => {
    let errs = {}
    if (step === 1) errs = validateStep1()
    if (step === 2) errs = validateStep2()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setStep(s => s + 1)
  }

  const prevStep = () => { setErrors({}); setStep(s => s - 1) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validateStep3()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setIsLoading(true)
    await new Promise(res => setTimeout(res, 1800))
    setIsLoading(false)
    navigate('/login')
  }

  const inputClass = (field) =>
    `w-full bg-white/5 border ${errors[field] ? 'border-red-500/70' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-500 transition-all duration-200`

  const selectClass = (field) =>
    `w-full border ${errors[field] ? 'border-red-500/70' : 'border-white/10'} rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-all duration-200 appearance-none cursor-pointer`

  const steps = [
    { label: 'Personal Info', Icon: HiOutlineUsers },
    { label: 'Academic Info', Icon: HiOutlineAcademicCap },
    { label: 'Secure Account', Icon: HiOutlineShieldCheck },
  ]

  const leftBenefits = [
    { Icon: HiOutlineLightBulb, text: 'AI-matched study partners in your field' },
    { Icon: MdOutlineVideoCall, text: 'Collaborative coding & quiz rooms' },
    { Icon: HiOutlineTrendingUp, text: 'Track your progress & productivity' },
    { Icon: HiOutlineBookmark, text: 'Access a curated resource library' },
    { Icon: MdOutlineSchool, text: 'Connect with teachers & mentors' },
  ]

  const socialProviders = [
    { name: 'Google', Icon: FaGoogle },
    { name: 'GitHub', Icon: FaGithub },
  ]

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex">
      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full bg-indigo-700 opacity-20 blur-3xl" />
        <div className="absolute bottom-[-80px] right-[-60px] w-[400px] h-[400px] rounded-full bg-purple-700 opacity-20 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 relative z-10 w-fit">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <HiOutlineBookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold font-jakarta">
            <span className="text-white">Study</span>
            <span className="text-gradient">Sync</span>
          </span>
        </Link>

        {/* Content */}
        <div className="relative z-10 flex flex-col gap-8">
          <div>
            <h2 className="text-3xl font-bold font-jakarta text-white">
              Start your journey<br />
              <span className="text-gradient">to smarter learning</span>
            </h2>
            <p className="text-slate-400 leading-relaxed mt-3">
              Join StudySync and find your perfect study tribe. Your academic success story starts here.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {leftBenefits.map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-glass rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-indigo-400" />
                </div>
                <p className="text-slate-300 text-sm">{text}</p>
              </div>
            ))}
          </div>

          <div className="bg-glass rounded-2xl p-5 flex items-center gap-4">
            <div className="flex -space-x-2">
              {['from-indigo-500 to-purple-600', 'from-cyan-500 to-blue-600', 'from-pink-500 to-rose-600', 'from-green-500 to-emerald-600'].map((g, i) => (
                <div key={i} className={`w-9 h-9 rounded-full bg-gradient-to-br ${g} border-2 border-slate-900 flex items-center justify-center`}>
                  <HiOutlineUsers className="w-4 h-4 text-white" />
                </div>
              ))}
            </div>
            <div>
              <p className="text-white text-sm font-semibold">50,000+ students</p>
              <p className="text-slate-400 text-xs">already study smarter with StudySync</p>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-slate-400 text-sm italic">"I went from failing to top 5% in my class — all thanks to StudySync."</p>
          <p className="text-slate-500 text-xs mt-1">— Hassan Raza, COMSATS '24</p>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 relative overflow-y-auto">
        <div className="lg:hidden absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-purple-700 opacity-10 blur-3xl pointer-events-none" />
        <div className="lg:hidden absolute bottom-0 left-0 w-[250px] h-[250px] rounded-full bg-indigo-700 opacity-10 blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10 py-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <HiOutlineBookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-jakarta">
                <span className="text-white">Study</span>
                <span className="text-gradient">Sync</span>
              </span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold font-jakarta text-white mb-1">Create your account ✨</h1>
            <p className="text-slate-400 text-sm">Join 50,000+ students studying smarter.</p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map(({ label, Icon: StepIcon }, i) => {
              const num = i + 1
              const isActive = num === step
              const isDone = num < step
              return (
                <React.Fragment key={label}>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isDone ? 'bg-green-500' : isActive ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-white/10'}`}>
                      {isDone
                        ? <HiOutlineCheckCircle className="w-5 h-5 text-white" />
                        : <StepIcon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      }
                    </div>
                    <span className={`text-xs font-medium hidden sm:block transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-500'}`}>{label}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 h-px transition-all duration-500 ${num < step ? 'bg-green-500' : 'bg-white/10'}`} />
                  )}
                </React.Fragment>
              )
            })}
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="flex flex-col gap-5 animate-slide-up">
              <div className="flex gap-3">
                {socialProviders.map(({ name, Icon }) => (
                  <button key={name} type="button" className="flex-1 flex items-center justify-center gap-2 bg-glass border border-white/10 text-slate-300 hover:text-white hover:border-white/20 hover:bg-white/10 rounded-xl py-3 text-sm font-medium transition-all duration-200">
                    <Icon className="w-4 h-4" />
                    <span>{name}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-slate-500 text-xs">or sign up with email</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-300 text-sm font-medium">First Name</label>
                  <input name="firstName" type="text" value={formData.firstName} onChange={handleChange} placeholder="Ahmad" className={inputClass('firstName')} />
                  {errors.firstName && <p className="text-red-400 text-xs">{errors.firstName}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-300 text-sm font-medium">Last Name</label>
                  <input name="lastName" type="text" value={formData.lastName} onChange={handleChange} placeholder="Khan" className={inputClass('lastName')} />
                  {errors.lastName && <p className="text-red-400 text-xs">{errors.lastName}</p>}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-300 text-sm font-medium">Email Address</label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@university.edu"
                    className={`w-full bg-white/5 border ${errors.email ? 'border-red-500/70' : 'border-white/10'} rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-500 transition-all duration-200`}
                  />
                </div>
                {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
              </div>

              <button type="button" onClick={nextStep} className="btn-primary w-full py-3.5 rounded-xl text-sm flex items-center justify-center gap-2">
                <span>Continue</span>
                <FiArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="flex flex-col gap-5 animate-slide-up">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-300 text-sm font-medium">University / Institution</label>
                <div className="relative">
                  <select name="university" value={formData.university} onChange={handleChange}
                    className={selectClass('university')}
                    style={{ background: 'rgba(255,255,255,0.05)', color: formData.university ? 'white' : '#6b7280' }}
                  >
                    <option value="" disabled style={{ background: '#0a0f1e' }}>Select your university</option>
                    {universities.map(u => <option key={u} value={u} style={{ background: '#0a0f1e', color: 'white' }}>{u}</option>)}
                  </select>
                  <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
                {errors.university && <p className="text-red-400 text-xs">{errors.university}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-300 text-sm font-medium">Major / Subject</label>
                <div className="relative">
                  <select name="subject" value={formData.subject} onChange={handleChange}
                    className={selectClass('subject')}
                    style={{ background: 'rgba(255,255,255,0.05)', color: formData.subject ? 'white' : '#6b7280' }}
                  >
                    <option value="" disabled style={{ background: '#0a0f1e' }}>Select your major</option>
                    {subjects.map(s => <option key={s} value={s} style={{ background: '#0a0f1e', color: 'white' }}>{s}</option>)}
                  </select>
                  <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
                {errors.subject && <p className="text-red-400 text-xs">{errors.subject}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-slate-300 text-sm font-medium">Year of Study</label>
                <div className="grid grid-cols-4 gap-2">
                  {['1st', '2nd', '3rd', '4th+'].map(yr => (
                    <button key={yr} type="button"
                      onClick={() => { setFormData(p => ({ ...p, yearOfStudy: yr })); if (errors.yearOfStudy) setErrors(p => ({ ...p, yearOfStudy: '' })) }}
                      className={`py-3 rounded-xl text-sm font-medium border transition-all duration-200 ${formData.yearOfStudy === yr ? 'bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:border-indigo-500/50 hover:text-white'}`}
                    >{yr}</button>
                  ))}
                </div>
                {errors.yearOfStudy && <p className="text-red-400 text-xs">{errors.yearOfStudy}</p>}
              </div>

              <div className="flex gap-3 mt-1">
                <button type="button" onClick={prevStep} className="btn-secondary flex-1 py-3.5 rounded-xl text-sm flex items-center justify-center gap-1">
                  Back
                </button>
                <button type="button" onClick={nextStep} className="btn-primary flex-[2] py-3.5 rounded-xl text-sm flex items-center justify-center gap-2">
                  <span>Continue</span>
                  <FiArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 animate-slide-up" noValidate>
              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-300 text-sm font-medium">Create Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} placeholder="Min 8 characters"
                    className={`w-full bg-white/5 border ${errors.password ? 'border-red-500/70' : 'border-white/10'} rounded-xl pl-10 pr-12 py-3 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-500 transition-all duration-200`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                    {showPassword ? <HiOutlineEyeOff className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                  </button>
                </div>
                {formData.password && (
                  <div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-1">
                      <div className={`h-full ${passwordStrength.color} rounded-full transition-all duration-500`} style={{ width: `${passwordStrength.strength}%` }} />
                    </div>
                    <p className={`text-xs mt-1 ${passwordStrength.label === 'Strong' ? 'text-green-400' : passwordStrength.label === 'Good' ? 'text-yellow-400' : passwordStrength.label === 'Fair' ? 'text-orange-400' : 'text-red-400'}`}>
                      Password strength: {passwordStrength.label}
                    </p>
                  </div>
                )}
                {errors.password && <p className="text-red-400 text-xs">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-300 text-sm font-medium">Confirm Password</label>
                <div className="relative">
                  <HiOutlineShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input name="confirmPassword" type={showConfirm ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat your password"
                    className={`w-full bg-white/5 border ${errors.confirmPassword ? 'border-red-500/70' : formData.confirmPassword && formData.confirmPassword === formData.password ? 'border-green-500/50' : 'border-white/10'} rounded-xl pl-10 pr-12 py-3 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-500 transition-all duration-200`}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                    {showConfirm ? <HiOutlineEyeOff className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-xs">{errors.confirmPassword}</p>}
                {!errors.confirmPassword && formData.confirmPassword && formData.confirmPassword === formData.password && (
                  <p className="text-green-400 text-xs flex items-center gap-1">
                    <HiOutlineCheckCircle className="w-3.5 h-3.5" /> Passwords match
                  </p>
                )}
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5 flex-shrink-0">
                  <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} className="sr-only peer" />
                  <div className={`w-5 h-5 bg-white/5 border ${errors.agreeToTerms ? 'border-red-500' : 'border-white/15'} rounded-md peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all duration-200 group-hover:border-indigo-500`} />
                  <svg className="absolute inset-0 w-5 h-5 text-white opacity-0 peer-checked:opacity-100 transition-opacity p-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                  I agree to the{' '}
                  <a href="#" className="text-indigo-400 hover:text-indigo-300 underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-indigo-400 hover:text-indigo-300 underline">Privacy Policy</a>
                </span>
              </label>
              {errors.agreeToTerms && <p className="text-red-400 text-xs -mt-2">{errors.agreeToTerms}</p>}

              <div className="flex gap-3 mt-1">
                <button type="button" onClick={prevStep} className="btn-secondary flex-1 py-3.5 rounded-xl text-sm">Back</button>
                <button type="submit" disabled={isLoading} className="btn-primary flex-[2] py-3.5 rounded-xl text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {isLoading ? (
                    <><FiLoader className="w-4 h-4 animate-spin" /> Creating account...</>
                  ) : (
                    <><span>Create Account</span><FiArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-slate-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors inline-flex items-center gap-1">
              Sign in <FiArrowRight className="w-3 h-3" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp
