import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { FiArrowRight, FiLoader, FiChevronDown, FiCheck } from 'react-icons/fi';
import { HiOutlineAcademicCap, HiOutlineClock } from 'react-icons/hi';

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

const studyTimes = ['Morning', 'Afternoon', 'Evening', 'Night'];
const yearsOfStudy = ['1', '2', '3', '4', '5'];

const CompleteProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Retrieve user email from session (saved during Google Login)
  const userEmail = sessionStorage.getItem('userEmail');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      university: '',
      department: '',
      facultyOfStudy: '',
      subject: [],
      yearOfStudy: '',
      studyTime: '',
    },
  });

  const onSubmit = async (data) => {
    if (!userEmail) {
      setApiError('User session lost. Please log in again.');
      return;
    }

    setIsLoading(true);
    setApiError('');
    
    try {
      const response = await fetch('http://localhost:3000/api/users/complete-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, email: userEmail }),
      });

      const result = await response.json();

      if (response.ok) {
        // Update token if it was reissued, else just clear email and redirect
        if (result.token) sessionStorage.setItem('token', result.token);
        sessionStorage.removeItem('userEmail'); // Cleanup temporary email storage
        navigate('/dashboard');
      } else {
        setApiError(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error(error);
      setApiError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectClass = (fieldError) =>
    `w-full border ${
      fieldError ? 'border-red-500/70' : 'border-white/10'
    } rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 transition-all duration-200 appearance-none cursor-pointer bg-white/5 text-white`;

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center p-6 relative overflow-hidden font-jakarta">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-700 opacity-20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-purple-700 opacity-20 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-lg bg-glass-dark border border-white/10 rounded-3xl p-8 relative z-10 shadow-2xl">
        <div className="flex flex-col items-center text-center mb-8 animate-slide-up">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <HiOutlineAcademicCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Complete Your Profile</h1>
          <p className="text-slate-400 text-sm">
            You're almost there! Tell us about your academic background to personalize your StudySync experience.
          </p>
        </div>

        {apiError && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-6 animate-slide-up">
            <p className="text-red-400 text-sm text-center">{apiError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          
          {/* University Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-300 text-sm font-medium">University / Institution</label>
            <div className="relative">
              <select
                className={selectClass(errors.university)}
                {...register('university', { required: 'Please select your university' })}
              >
                <option value="" disabled style={{ background: '#0a0f1e' }}>Select your university</option>
                {universities.map((u) => (
                  <option key={u} value={u} style={{ background: '#0a0f1e', color: 'white' }}>{u}</option>
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
                <option value="" disabled style={{ background: '#0a0f1e' }}>Select your department</option>
                {departmentsList.map((d) => (
                  <option key={d} value={d} style={{ background: '#0a0f1e', color: 'white' }}>{d}</option>
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
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-500 transition-all duration-200"
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
                <option value="" disabled style={{ background: '#0a0f1e' }}>Select year</option>
                {yearsOfStudy.map((y) => (
                  <option key={y} value={y} style={{ background: '#0a0f1e', color: 'white' }}>Year {y}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
            {errors.yearOfStudy && <p className="text-red-400 text-xs">{errors.yearOfStudy.message}</p>}
          </div>

          {/* Preferred Subjects */}
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-300 text-sm font-medium">Preferred Subjects</label>
            <Controller
              name="subject"
              control={control}
              rules={{ validate: (v) => v && v.length > 0 || 'Please select at least one subject' }}
              render={({ field }) => (
                <div className="flex flex-wrap gap-2 p-3 bg-white/5 border border-white/10 rounded-xl min-h-[100px] max-h-[160px] overflow-y-auto custom-scrollbar">
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
                <option value="" disabled style={{ background: '#0a0f1e' }}>Select time</option>
                {studyTimes.map((time) => (
                  <option key={time} value={time} style={{ background: '#0a0f1e', color: 'white' }}>{time}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
            {errors.studyTime && <p className="text-red-400 text-xs">{errors.studyTime.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-4 rounded-xl text-base mt-4 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <><FiLoader className="w-5 h-5 animate-spin" /> Saving Profile...</>
            ) : (
              <><span>Go to Dashboard</span><FiArrowRight className="w-5 h-5" /></>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
