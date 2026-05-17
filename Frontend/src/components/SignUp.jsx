import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
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
  HiOutlineClock
} from 'react-icons/hi';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { FiArrowRight, FiLoader, FiChevronDown, FiCheck } from 'react-icons/fi';
import { MdOutlineSchool, MdOutlineVideoCall } from 'react-icons/md';

const universities = [
  'NUST', 'FAST-NUCES', 'LUMS', 'COMSATS', 'UET Lahore', 'UET Taxila',
  'GIKI', 'IBA Karachi', 'NED University', 'QAU', 'SZABIST', 'Air University',
  'Bahria University', 'Punjab University', 'University of Karachi', 'Other',
];

const departmentsList = [
  'Computer Science (CS)',
  'Software Engineering (SE)',
  'Information Technology (IT)',
  'Data Science',
  'Artificial Intelligence (AI)',
  'Cyber Security',
  'Electrical Engineering (EE)',
  'Electronics Engineering (ECE)',
  'Mechanical Engineering (ME)',
  'Civil Engineering (CE)',
  'Business Administration (BBA)',
  'Accounting & Finance',
  'Economics',
  'Mathematics',
  'Physics',
  'Mass Communication',
  'Pharmacy',
  'Biochemistry',
  'Sociology',
  'Psychology'
];

const subjectsList = [
  'Computer Science', 'Software Engineering', 'Electrical Engineering',
  'Mechanical Engineering', 'Business Administration', 'Mathematics',
  'Physics', 'Medical Sciences', 'Data Science', 'Cybersecurity', 'Other',
];

const studyTimes = ['Morning','Afternoon','Evening','Night'];
const yearsOfStudy = ['1', '2', '3', '4', '5']; // Using numerical strings

import { GoogleLogin } from '@react-oauth/google';

const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    control,
    trigger,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      university: '',
      department: '',
      facultyOfStudy: '',
      subject: [],
      yearOfStudy: '',
      studyTime: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
    },
    mode: 'onChange',
  });

  const watchPassword = watch('password', '');

  const getPasswordStrength = (pw) => {
    if (!pw) return { strength: 0, label: '', color: '' };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^a-zA-Z\d]/.test(pw)) score++;
    return [
      { strength: 0, label: '', color: '' },
      { strength: 25, label: 'Weak', color: 'bg-red-500' },
      { strength: 50, label: 'Fair', color: 'bg-orange-500' },
      { strength: 75, label: 'Good', color: 'bg-yellow-500' },
      { strength: 100, label: 'Strong', color: 'bg-green-500' },
    ][score];
  };

  const passwordStrength = getPasswordStrength(watchPassword);

  const nextStep = async () => {
    let fieldsToValidate = [];
    if (step === 1) fieldsToValidate = ['firstName', 'lastName', 'email'];
    if (step === 2) fieldsToValidate = ['university', 'subject', 'yearOfStudy', 'studyTime'];
    
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setStep((s) => s + 1);
    }
  };

  const prevStep = () => {
    setStep((s) => s - 1);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setApiError('');
    try {
      const response = await fetch('http://localhost:3000/api/users/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const result = await response.json();

      if (response.ok) {
        if (!result.profileCompleted) {
          sessionStorage.setItem('userEmail', result.email);
          navigate('/complete-profile');
        } else {
          sessionStorage.setItem('token', result.token);
          sessionStorage.setItem('userName', result.name);
          sessionStorage.setItem('userId', result._id);
          navigate('/dashboard');
        }
      } else {
        setApiError(result.message || 'Google Signup failed');
      }
    } catch (error) {
      console.error(error);
      setApiError('Network error during Google Signup.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setApiError('Google Signup Failed');
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError('');
    try {
      const response = await fetch('http://localhost:3000/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        // Store JWT token
        sessionStorage.setItem('token', result.token);
        sessionStorage.setItem('userName', result.name);
        sessionStorage.setItem('userEmail', result.email);
        sessionStorage.setItem('userId', result._id);
        
        // Redirect to Dashboard
        navigate('/dashboard');
      } else {
        setApiError(result.message || 'Signup failed');
      }
    } catch (error) {
      console.error(error);
      setApiError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (fieldError) =>
    `w-full bg-white/5 border ${
      fieldError ? 'border-red-500/70' : 'border-white/10'
    } rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-500 transition-all duration-200`;

  const selectClass = (fieldError) =>
    `w-full border ${
      fieldError ? 'border-red-500/70' : 'border-white/10'
    } rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-all duration-200 appearance-none cursor-pointer bg-white/5 text-white`;

  const steps = [
    { label: 'Personal Info', Icon: HiOutlineUsers },
    { label: 'Academic Info', Icon: HiOutlineAcademicCap },
    { label: 'Secure Account', Icon: HiOutlineShieldCheck },
  ];

  const leftBenefits = [
    { Icon: HiOutlineLightBulb, text: 'AI-matched study partners in your field' },
    { Icon: MdOutlineVideoCall, text: 'Collaborative coding & quiz rooms' },
    { Icon: HiOutlineTrendingUp, text: 'Track your progress & productivity' },
    { Icon: HiOutlineBookmark, text: 'Access a curated resource library' },
    { Icon: MdOutlineSchool, text: 'Connect with teachers & mentors' },
  ];

  const socialProviders = [
    { name: 'Google', Icon: FaGoogle },
    { name: 'GitHub', Icon: FaGithub },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex">
      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full bg-indigo-700 opacity-20 blur-3xl" />
        <div className="absolute bottom-[-80px] right-[-60px] w-[400px] h-[400px] rounded-full bg-purple-700 opacity-20 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

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
              {['from-indigo-500 to-purple-600', 'from-cyan-500 to-blue-600', 'from-pink-500 to-rose-600', 'from-green-500 to-emerald-600'].map(
                (g, i) => (
                  <div key={i} className={`w-9 h-9 rounded-full bg-gradient-to-br ${g} border-2 border-slate-900 flex items-center justify-center`}>
                    <HiOutlineUsers className="w-4 h-4 text-white" />
                  </div>
                )
              )}
            </div>
            <div>
              <p className="text-white text-sm font-semibold">50,000+ students</p>
              <p className="text-slate-400 text-xs">already study smarter with StudySync</p>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-slate-400 text-sm italic">
            "I went from failing to top 5% in my class — all thanks to StudySync."
          </p>
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
              const num = i + 1;
              const isActive = num === step;
              const isDone = num < step;
              return (
                <React.Fragment key={label}>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isDone
                          ? 'bg-green-500'
                          : isActive
                          ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                          : 'bg-white/10'
                      }`}
                    >
                      {isDone ? (
                        <HiOutlineCheckCircle className="w-5 h-5 text-white" />
                      ) : (
                        <StepIcon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium hidden sm:block transition-colors duration-300 ${
                        isActive ? 'text-white' : 'text-slate-500'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`flex-1 h-px transition-all duration-500 ${
                        num < step ? 'bg-green-500' : 'bg-white/10'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-5" noValidate>
            {/* STEP 1: Personal Info */}
            {step === 1 && (
              <div className="flex flex-col gap-5 animate-slide-up">
                {apiError && (
                  <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                    <p className="text-red-400 text-sm text-center">{apiError}</p>
                  </div>
                )}
                <div className="flex justify-center w-full">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="filled_black"
                    shape="pill"
                    size="large"
                    text="signup_with"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-slate-500 text-xs">or sign up with email</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-300 text-sm font-medium">First Name</label>
                    <input
                      type="text"
                      placeholder="Ahmad"
                      className={inputClass(errors.firstName)}
                      {...register('firstName', { required: 'First name is required' })}
                    />
                    {errors.firstName && <p className="text-red-400 text-xs">{errors.firstName.message}</p>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-slate-300 text-sm font-medium">Last Name</label>
                    <input
                      type="text"
                      placeholder="Khan"
                      className={inputClass(errors.lastName)}
                      {...register('lastName', { required: 'Last name is required' })}
                    />
                    {errors.lastName && <p className="text-red-400 text-xs">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-300 text-sm font-medium">Email Address</label>
                  <div className="relative">
                    <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      placeholder="you@university.edu"
                      className={`w-full bg-white/5 border ${
                        errors.email ? 'border-red-500/70' : 'border-white/10'
                      } rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-500 transition-all duration-200`}
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Enter a valid email address',
                        },
                      })}
                    />
                  </div>
                  {errors.email && <p className="text-red-400 text-xs">{errors.email.message}</p>}
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  className="btn-primary w-full py-3.5 rounded-xl text-sm flex items-center justify-center gap-2"
                >
                  <span>Continue</span>
                  <FiArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 2: Academic Info */}
            {step === 2 && (
              <div className="flex flex-col gap-5 animate-slide-up">
                {/* University Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-300 text-sm font-medium">University / Institution</label>
                  <div className="relative">
                    <select
                      className={selectClass(errors.university)}
                      {...register('university', { required: 'Please select your university' })}
                    >
                      <option value="" disabled style={{ background: '#0a0f1e' }}>
                        Select your university
                      </option>
                      {universities.map((u) => (
                        <option key={u} value={u} style={{ background: '#0a0f1e', color: 'white' }}>
                          {u}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                  {errors.university && <p className="text-red-400 text-xs">{errors.university.message}</p>}
                </div>

                {/* Department */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-300 text-sm font-medium">Department</label>
                  <div className="relative">
                    <select
                      className={selectClass(errors.department)}
                      {...register('department', { required: 'Please select your department' })}
                    >
                      <option value="" disabled style={{ background: '#0a0f1e' }}>
                        Select your department
                      </option>
                      {departmentsList.map((d) => (
                        <option key={d} value={d} style={{ background: '#0a0f1e', color: 'white' }}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                  {errors.department && <p className="text-red-400 text-xs">{errors.department.message}</p>}
                </div>

                {/* Faculty of Study */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-300 text-sm font-medium">Faculty of Study</label>
                  <input
                    type="text"
                    placeholder="e.g. Science & IT"
                    className={inputClass(errors.facultyOfStudy)}
                    {...register('facultyOfStudy', { required: 'Faculty is required' })}
                  />
                  {errors.facultyOfStudy && <p className="text-red-400 text-xs">{errors.facultyOfStudy.message}</p>}
                </div>

                {/* Year of Study */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-300 text-sm font-medium">Year of Study</label>
                  <div className="relative">
                    <select
                      className={selectClass(errors.yearOfStudy)}
                      {...register('yearOfStudy', { required: 'Please select year of study' })}
                    >
                      <option value="" disabled style={{ background: '#0a0f1e' }}>
                        Select year
                      </option>
                      {yearsOfStudy.map((y) => (
                        <option key={y} value={y} style={{ background: '#0a0f1e', color: 'white' }}>
                          Year {y}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                  {errors.yearOfStudy && <p className="text-red-400 text-xs">{errors.yearOfStudy.message}</p>}
                </div>

                {/* Preferred Subjects (Multi-select) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-300 text-sm font-medium">Preferred Subjects</label>
                  <Controller
                    name="subject"
                    control={control}
                    rules={{ validate: (v) => v && v.length > 0 || 'Please select at least one subject' }}
                    render={({ field }) => (
                      <div className="flex flex-wrap gap-2 p-2 bg-white/5 border border-white/10 rounded-xl min-h-[100px] max-h-[150px] overflow-y-auto custom-scrollbar">
                        {subjectsList.map((subj) => {
                          const isSelected = field.value.includes(subj);
                          return (
                            <button
                              key={subj}
                              type="button"
                              onClick={() => {
                                const newValue = isSelected
                                  ? field.value.filter((i) => i !== subj)
                                  : [...field.value, subj];
                                field.onChange(newValue);
                              }}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 flex items-center gap-1 ${
                                isSelected
                                  ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                                  : 'bg-transparent border-white/10 text-slate-400 hover:border-white/30 hover:text-slate-200'
                              }`}
                            >
                              {subj}
                              {isSelected && <FiCheck className="w-3 h-3" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  />
                  {errors.subject && <p className="text-red-400 text-xs">{errors.subject.message}</p>}
                </div>

                {/* Preferred Study Time */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-300 text-sm font-medium">Preferred Study Time</label>
                  <div className="relative">
                    <HiOutlineClock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 z-10" />
                    <select
                      className={`${selectClass(errors.studyTime)} pl-10`}
                      {...register('studyTime', { required: 'Please select preferred study time' })}
                    >
                      <option value="" disabled style={{ background: '#0a0f1e' }}>
                        Select time
                      </option>
                      {studyTimes.map((time) => (
                        <option key={time} value={time} style={{ background: '#0a0f1e', color: 'white' }}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                  {errors.studyTime && <p className="text-red-400 text-xs">{errors.studyTime.message}</p>}
                </div>

                <div className="flex gap-3 mt-1">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="btn-secondary flex-1 py-3.5 rounded-xl text-sm flex items-center justify-center gap-1"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn-primary flex-[2] py-3.5 rounded-xl text-sm flex items-center justify-center gap-2"
                  >
                    <span>Continue</span>
                    <FiArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Secure Account */}
            {step === 3 && (
              <div className="flex flex-col gap-5 animate-slide-up">
                {apiError && (
                  <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                    <p className="text-red-400 text-sm text-center">{apiError}</p>
                  </div>
                )}
                
                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-300 text-sm font-medium">Create Password</label>
                  <div className="relative">
                    <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min 8 characters"
                      className={`w-full bg-white/5 border ${
                        errors.password ? 'border-red-500/70' : 'border-white/10'
                      } rounded-xl pl-10 pr-12 py-3 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-500 transition-all duration-200`}
                      {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 8, message: 'Must be at least 8 characters' },
                        pattern: {
                          value: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                          message: 'Must include uppercase, lowercase, and a number',
                        },
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <HiOutlineEyeOff className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                    </button>
                  </div>
                  {watchPassword && (
                    <div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full ${passwordStrength.color} rounded-full transition-all duration-500`}
                          style={{ width: `${passwordStrength.strength}%` }}
                        />
                      </div>
                      <p
                        className={`text-xs mt-1 ${
                          passwordStrength.label === 'Strong'
                            ? 'text-green-400'
                            : passwordStrength.label === 'Good'
                            ? 'text-yellow-400'
                            : passwordStrength.label === 'Fair'
                            ? 'text-orange-400'
                            : 'text-red-400'
                        }`}
                      >
                        Password strength: {passwordStrength.label}
                      </p>
                    </div>
                  )}
                  {errors.password && <p className="text-red-400 text-xs">{errors.password.message}</p>}
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-300 text-sm font-medium">Confirm Password</label>
                  <div className="relative">
                    <HiOutlineShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Repeat your password"
                      className={`w-full bg-white/5 border ${
                        errors.confirmPassword ? 'border-red-500/70' : 'border-white/10'
                      } rounded-xl pl-10 pr-12 py-3 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-500 transition-all duration-200`}
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (value) => value === watchPassword || 'Passwords do not match',
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showConfirm ? <HiOutlineEyeOff className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-400 text-xs">{errors.confirmPassword.message}</p>}
                </div>

                {/* Terms */}
                <label className="flex items-start gap-3 cursor-pointer group mt-2">
                  <div className="relative mt-0.5 flex-shrink-0">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      {...register('agreeToTerms', { required: 'You must agree to the terms' })}
                    />
                    <div
                      className={`w-5 h-5 bg-white/5 border ${
                        errors.agreeToTerms ? 'border-red-500' : 'border-white/15'
                      } rounded-md peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all duration-200 group-hover:border-indigo-500 flex items-center justify-center`}
                    >
                      <svg
                        className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                    I agree to the{' '}
                    <a href="#" className="text-indigo-400 hover:text-indigo-300 underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-indigo-400 hover:text-indigo-300 underline">
                      Privacy Policy
                    </a>
                  </span>
                </label>
                {errors.agreeToTerms && <p className="text-red-400 text-xs -mt-2">{errors.agreeToTerms.message}</p>}

                <div className="flex gap-3 mt-1">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="btn-secondary flex-1 py-3.5 rounded-xl text-sm"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary flex-[2] py-3.5 rounded-xl text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <FiLoader className="w-4 h-4 animate-spin" /> Creating account...
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <FiArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors inline-flex items-center gap-1"
            >
              Sign in <FiArrowRight className="w-3 h-3" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
