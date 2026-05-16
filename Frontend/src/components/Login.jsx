import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineBookOpen, HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi'
import { FiArrowRight, FiLoader } from 'react-icons/fi'
import { MdOutlineBarChart, MdOutlineVideoCall } from 'react-icons/md'
import { BiUserCircle } from 'react-icons/bi'
import { getBackendBaseUrl, postUserLogin } from '../Services/apiClient'
import { GoogleLogin } from '@react-oauth/google'
import { useSocket } from '../context/SocketContext'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const { connectUser } = useSocket()
  const [apiError, setApiError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    setApiError('');
    setIsLoading(true);
    try {
      const response = await fetch(`${getBackendBaseUrl()}/api/users/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Google Login failed');

      localStorage.setItem('token', result.token);
      localStorage.setItem('userName', result.name);
      localStorage.setItem('userEmail', result.email);
      localStorage.setItem('userId', result._id);
      localStorage.setItem('showWelcomeModal', 'true');
      window.dispatchEvent(new Event('authChange'));
      connectUser(result.email);

      if (result.profileCompleted === false) {
        navigate('/complete-profile');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Google Login Error:', error);
      setApiError(error.message || 'Google Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setApiError('Google Login Failed. Please try again.');
  };

  const validate = () => {
    const newErrors = {}
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError('')
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return }
    
    setIsLoading(true)
    try {
      const result = await postUserLogin(formData)
      localStorage.setItem('token', result.token)
      localStorage.setItem('userName', result.name)
      localStorage.setItem('userEmail', result.email)
      localStorage.setItem('userId', result._id)
      localStorage.setItem('showWelcomeModal', 'true')
      window.dispatchEvent(new Event('authChange'))
      connectUser(result.email)
      if (result.profileCompleted === false) {
        navigate('/complete-profile')
      } else {
        navigate('/dashboard')
      }
    } catch (error) {
      console.error(error)
      setApiError(error.message || 'Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const activityFeed = [
    { initials: 'AK', name: 'Aisha K.', action: 'joined Coding Room', time: '2m ago', gradient: 'from-indigo-500 to-purple-600' },
    { initials: 'OF', name: 'Omar F.', action: 'scored 98 in Quiz', time: '5m ago', gradient: 'from-green-500 to-emerald-600' },
    { initials: 'FM', name: 'Fatima M.', action: 'started Group Study', time: '12m ago', gradient: 'from-cyan-500 to-blue-600' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex">
      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full bg-indigo-700 opacity-20 blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-60px] w-[400px] h-[400px] rounded-full bg-purple-700 opacity-20 blur-3xl" />
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

        {/* Central illustration */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 gap-8">
          <div className="bg-glass rounded-3xl p-8 w-full max-w-sm flex flex-col gap-6 animate-float glow-purple">
            <p className="text-slate-300 text-sm font-semibold flex items-center gap-2">
              <MdOutlineVideoCall className="w-4 h-4 text-indigo-400" />
              Recent Activity
            </p>
            {activityFeed.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center flex-shrink-0 font-bold text-white text-xs`}>
                  {item.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{item.name}</p>
                  <p className="text-slate-400 text-xs truncate">{item.action}</p>
                </div>
                <span className="text-slate-500 text-xs whitespace-nowrap">{item.time}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
            {[
              { value: '50K+', label: 'Students', icon: <BiUserCircle className="w-6 h-6 text-indigo-400 mx-auto mb-1" /> },
              { value: '2K+', label: 'Sessions', icon: <MdOutlineVideoCall className="w-6 h-6 text-indigo-400 mx-auto mb-1" /> },
              { value: '98%', label: 'Satisfied', icon: <MdOutlineBarChart className="w-6 h-6 text-indigo-400 mx-auto mb-1" /> },
            ].map(({ value, label, icon }) => (
              <div key={label} className="bg-glass rounded-2xl p-4 text-center">
                {icon}
                <p className="text-white font-bold font-jakarta text-lg">{value}</p>
                <p className="text-slate-400 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-slate-400 text-sm italic">"StudySync helped me find the perfect study group in minutes."</p>
          <p className="text-slate-500 text-xs mt-1">— Aisha Khan, NUST '24</p>
        </div>
      </div>

      {/* ── Right Panel (form) ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 relative">
        <div className="lg:hidden absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-purple-700 opacity-10 blur-3xl pointer-events-none" />
        <div className="lg:hidden absolute bottom-0 left-0 w-[250px] h-[250px] rounded-full bg-indigo-700 opacity-10 blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-jakarta text-white mb-2">Welcome back 👋</h1>
            <p className="text-slate-400">Log in to continue your learning journey.</p>
          </div>

          {/* Social Login */}
          <div className="flex justify-center mb-6 w-full">
            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                width="400"
                theme="filled_black"
                shape="rectangular"
                text="signin_with"
                size="large"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-slate-500 text-xs">or continue with email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            {apiError && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-2">
                <p className="text-red-400 text-sm text-center">{apiError}</p>
              </div>
            )}
            
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-300 text-sm font-medium" htmlFor="login-email">Email Address</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@university.edu"
                  className={`w-full bg-white/5 border ${errors.email ? 'border-red-500/70' : 'border-white/10'} rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-500 transition-all duration-200`}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 text-sm font-medium" htmlFor="login-password">Password</label>
                <a href="#" className="text-indigo-400 hover:text-indigo-300 text-xs transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full bg-white/5 border ${errors.password ? 'border-red-500/70' : 'border-white/10'} rounded-xl pl-10 pr-12 py-3 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-500 transition-all duration-200`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPassword
                    ? <HiOutlineEyeOff className="w-4 h-4" />
                    : <HiOutlineEye className="w-4 h-4" />
                  }
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs">{errors.password}</p>}
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input type="checkbox" className="sr-only peer" id="remember" />
                <div className="w-5 h-5 bg-white/5 border border-white/15 rounded-md peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all duration-200 group-hover:border-indigo-500" />
                <svg className="absolute inset-0 w-5 h-5 text-white opacity-0 peer-checked:opacity-100 transition-opacity p-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors">Remember me for 30 days</span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              
              disabled={isLoading}
              className="btn-primary w-full py-3.5 rounded-xl text-base mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <FiLoader className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <FiArrowRight className="w-4 h-4" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Signup link */}
          <p className="text-center text-slate-400 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors inline-flex items-center gap-1">
              Create one free <FiArrowRight className="w-3 h-3" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
