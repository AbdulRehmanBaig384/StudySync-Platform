import React, { useState, useEffect } from 'react';
import {
  FiLayers,
  FiSearch,
  FiClock,
  FiBarChart2,
  FiChevronRight,
  FiPlay,
  FiCheckCircle,
  FiXCircle,
  FiHelpCircle,
  FiAlertCircle,
  FiTrendingUp,
  FiFilter,
  FiArrowLeft,
  FiBookmark,
  FiCpu,
  FiZap
} from 'react-icons/fi';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import DashboardLayout from '../components/DashboardLayout';

const Quizzes = () => {
  const [view, setView] = useState('list'); // 'list', 'start', 'attempt', 'result'
  const [activeTab, setActiveTab] = useState('practice');
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timer, setTimer] = useState(0);
  const [results, setResults] = useState(null);

  // Mock Data
  const quizTypes = [
    { id: 'practice', label: 'Practice Mode', icon: <FiLayers /> },
    { id: 'exam', label: 'Exam Mode', icon: <FiClock /> },
    { id: 'topic', label: 'Topic Based', icon: <FiZap /> },
    { id: 'hardest', label: 'Elite Challenges', icon: <FiTrendingUp /> },
  ];

  const quizzes = [
    { 
      id: 1, 
      title: 'React Hooks Mastery', 
      questions: 10, 
      difficulty: 'Medium', 
      duration: 15, 
      subject: 'Web Dev', 
      tab: 'topic',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1470&auto=format&fit=crop'
    },
    { 
      id: 2, 
      title: 'DSA: Graph Theory', 
      questions: 15, 
      difficulty: 'Hard', 
      duration: 30, 
      subject: 'DSA', 
      tab: 'hardest',
      image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1469&auto=format&fit=crop'
    },
    { 
      id: 3, 
      title: 'SQL Joins & Indexing', 
      questions: 8, 
      difficulty: 'Easy', 
      duration: 10, 
      subject: 'DBMS', 
      tab: 'practice',
      image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=1421&auto=format&fit=crop'
    },
    { 
      id: 4, 
      title: 'System Design Patterns', 
      questions: 12, 
      difficulty: 'Hard', 
      duration: 45, 
      subject: 'Architecture', 
      tab: 'exam',
      image: 'https://images.unsplash.com/photo-1508921331509-4c7ee27c0d23?q=80&w=1470&auto=format&fit=crop'
    },
  ];

  const quizData = {
    questions: [
      {
        id: 1,
        q: "What is the primary purpose of the 'useEffect' hook in React?",
        options: [
          "To manage state exclusively",
          "To perform side effects in functional components",
          "To optimize rendering performance",
          "To handle complex routing logic"
        ],
        answer: 1,
        explanation: "useEffect allows you to perform side effects (data fetching, subscriptions, manual DOM changes) in functional components, serving a similar purpose to lifecycle methods in class components."
      },
      {
        id: 2,
        q: "Which hook should be used to store a mutable value that does not cause a re-render?",
        options: ["useState", "useMemo", "useRef", "useCallback"],
        answer: 2,
        explanation: "useRef returns a mutable ref object whose .current property is initialized to the passed argument. The returned object will persist for the full lifetime of the component and changing it doesn't trigger a re-render."
      }
    ]
  };

  const performanceData = [
    { name: 'Mon', score: 65 },
    { name: 'Tue', score: 80 },
    { name: 'Wed', score: 72 },
    { name: 'Thu', score: 90 },
    { name: 'Fri', score: 85 },
    { name: 'Sat', score: 95 },
    { name: 'Sun', score: 88 },
  ];

  // Logic Handlers
  const startQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setView('start');
  };

  const beginAttempt = () => {
    setView('attempt');
    setTimer(selectedQuiz.duration * 60);
    setUserAnswers({});
    setCurrentQuestion(0);
  };

  const finishQuiz = () => {
    const score = Object.keys(userAnswers).reduce((acc, qIdx) => {
      return acc + (userAnswers[qIdx] === quizData.questions[qIdx].answer ? 1 : 0);
    }, 0);

    setResults({
      score,
      total: quizData.questions.length,
      percentage: (score / quizData.questions.length) * 100,
      timeTaken: selectedQuiz.duration * 60 - timer
    });
    setView('result');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in pb-20">

        {view === 'list' && (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight">Quiz & Practice</h1>
                <p className="text-slate-400 text-sm mt-1">Challenge yourself and track your growth.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative group">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type="text" placeholder="Search quizzes..." className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 w-full md:w-[300px]" />
                </div>
                <button className="p-3 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all"><FiFilter /></button>
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
              {quizTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setActiveTab(type.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === type.id
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'bg-white/5 text-slate-500 border border-white/5 hover:bg-white/10'
                    }`}
                >
                  {type.icon} {type.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {quizzes.filter(q => q.tab === activeTab || activeTab === 'practice').map((quiz) => (
                <div key={quiz.id} className="group bg-glass-dark border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-indigo-500/30 transition-all hover:-translate-y-1 shadow-xl flex flex-col h-full">
                  {/* Card Splash Image */}
                  <div className="h-40 w-full relative overflow-hidden">
                    <img 
                      src={quiz.image} 
                      alt={quiz.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent" />
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                        quiz.difficulty === 'Hard' ? 'bg-rose-500 text-white' : quiz.difficulty === 'Medium' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
                      }`}>
                        {quiz.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 space-y-6 flex-1 flex flex-col">
                    <div>
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{quiz.subject}</span>
                      <h3 className="text-white font-bold mt-1 group-hover:text-indigo-300 transition-colors">{quiz.title}</h3>
                    </div>
                    <div className="flex items-center gap-6 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-2"><FiLayers /> {quiz.questions} Qs</span>
                      <span className="flex items-center gap-2"><FiClock /> {quiz.duration} Min</span>
                    </div>
                    <button
                      onClick={() => startQuiz(quiz)}
                      className="w-full mt-auto py-4 bg-white/5 hover:bg-indigo-600 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white rounded-2xl transition-all flex items-center justify-center gap-2"
                    >
                      <FiPlay /> Start Assessment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {view === 'start' && selectedQuiz && (
          <div className="max-w-3xl mx-auto bg-glass-dark border border-white/5 rounded-[3rem] p-12 space-y-10 animate-slide-up text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500" />
            <div className="space-y-4">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-[2rem] flex items-center justify-center text-indigo-400 text-3xl mx-auto">
                <FiZap />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight">{selectedQuiz.title}</h2>
              <p className="text-slate-400 text-sm max-w-lg mx-auto">This assessment will test your knowledge of {selectedQuiz.subject}. Please ensure you are in a quiet environment.</p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <InfoItem icon={<FiLayers />} label="Questions" val={selectedQuiz.questions} />
              <InfoItem icon={<FiClock />} label="Duration" val={`${selectedQuiz.duration} Min`} />
              <InfoItem icon={<FiTarget />} label="Difficulty" val={selectedQuiz.difficulty} />
            </div>

            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl text-left space-y-3">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Important Rules</h4>
              <ul className="text-xs text-slate-400 space-y-2">
                <li className="flex items-center gap-3"><FiCheckCircle className="text-emerald-500" /> Quiz will auto-submit when timer hits zero.</li>
                <li className="flex items-center gap-3"><FiCheckCircle className="text-emerald-500" /> No negative marking for incorrect answers.</li>
                <li className="flex items-center gap-3"><FiCheckCircle className="text-emerald-500" /> You can mark questions for review later.</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button onClick={() => setView('list')} className="flex-1 py-5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all">Go Back</button>
              <button onClick={beginAttempt} className="flex-[2] py-5 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all">Confirm & Start</button>
            </div>
          </div>
        )}

        {view === 'attempt' && (
          <div className="max-w-6xl mx-auto h-[700px] flex flex-col bg-glass-dark border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl relative">
            {/* Header / Progress */}
            <div className="h-20 bg-white/[0.02] border-b border-white/5 px-10 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <span className="text-sm font-black text-white uppercase">Q{currentQuestion + 1}<span className="text-slate-500">/{quizData.questions.length}</span></span>
                <div className="w-64 h-1.5 bg-black/30 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${((currentQuestion + 1) / quizData.questions.length) * 100}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-4 bg-rose-500/10 px-6 py-2.5 rounded-2xl border border-rose-500/20">
                <FiClock className={`text-rose-500 ${timer < 60 ? 'animate-pulse' : ''}`} />
                <span className={`font-mono text-sm font-bold ${timer < 60 ? 'text-rose-400' : 'text-white'}`}>
                  {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Main Question Area */}
            <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
              <div className="space-y-12">
                <h2 className="text-2xl font-bold text-white leading-relaxed">{quizData.questions[currentQuestion].q}</h2>
                <div className="grid grid-cols-1 gap-4">
                  {quizData.questions[currentQuestion].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => setUserAnswers({ ...userAnswers, [currentQuestion]: i })}
                      className={`w-full text-left p-6 rounded-3xl border transition-all flex items-center justify-between group ${userAnswers[currentQuestion] === i
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-xl shadow-indigo-600/10'
                          : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/10 hover:bg-white/10'
                        }`}
                    >
                      <div className="flex items-center gap-6">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${userAnswers[currentQuestion] === i ? 'bg-indigo-600 text-white' : 'bg-black/20 text-slate-500 group-hover:bg-black/40'}`}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="text-sm font-medium">{opt}</span>
                      </div>
                      {userAnswers[currentQuestion] === i && <FiCheckCircle className="text-indigo-400 text-xl" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="h-24 bg-white/[0.02] border-t border-white/5 px-10 flex items-center justify-between">
              <button
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                className="flex items-center gap-3 px-6 py-3 text-slate-500 hover:text-white transition-all text-xs font-black uppercase tracking-widest"
              >
                <FiArrowLeft /> Previous
              </button>

              <div className="flex items-center gap-4">
                <button className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 text-amber-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                  <FiBookmark /> Mark for Review
                </button>
                {currentQuestion === quizData.questions.length - 1 ? (
                  <button onClick={finishQuiz} className="px-10 py-3 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20 hover:scale-105 transition-all">Finish Assessment</button>
                ) : (
                  <button onClick={() => setCurrentQuestion(currentQuestion + 1)} className="px-10 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all flex items-center gap-2">Next <FiChevronRight /></button>
                )}
              </div>
            </div>
          </div>
        )}

        {view === 'result' && results && (
          <div className="max-w-6xl mx-auto space-y-10 animate-fade-in">
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <ResultStatCard title="Overall Score" val={`${results.score}/${results.total}`} icon={<FiAward className="text-amber-500" />} color="amber" />
              <ResultStatCard title="Percentage" val={`${results.percentage}%`} icon={<FiTrendingUp className="text-indigo-500" />} color="indigo" />
              <ResultStatCard title="Time Taken" val={`${Math.floor(results.timeTaken / 60)}m ${results.timeTaken % 60}s`} icon={<FiClock className="text-emerald-500" />} color="emerald" />
              <ResultStatCard title="Efficiency" val="High" icon={<FiActivity className="text-rose-500" />} color="rose" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Performance Graph */}
              <div className="lg:col-span-2 bg-glass-dark border border-white/5 rounded-[3rem] p-10 space-y-8">
                <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
                  <FiBarChart2 className="text-indigo-400" /> Performance Analysis
                </h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }} />
                      <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Insights / AI Section */}
              <div className="space-y-8">
                <div className="bg-glass-dark border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
                    <FiCpu className="text-amber-500" /> AI Diagnostic
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-[11px] text-slate-400 font-medium italic">"Your logical flow is strong, but you showed slight delay in dependency questions. Recommendation: Review 'React Reconciliation' patterns."</p>
                    </div>
                    <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Generate Revision Plan</button>
                  </div>
                </div>

                <div className="bg-glass-dark border border-white/5 rounded-[2.5rem] p-8 space-y-6">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Question Review</h3>
                  <div className="space-y-3">
                    {quizData.questions.map((q, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-[10px] font-bold text-white">Question {i + 1}</span>
                        {userAnswers[i] === q.answer ? <FiCheckCircle className="text-emerald-500" /> : <FiXCircle className="text-rose-500" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-8">
              <button onClick={() => setView('list')} className="px-12 py-5 bg-white text-indigo-600 rounded-3xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl shadow-white/5">Review Full Details</button>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

// --- Sub-Components ---

const InfoItem = ({ icon, label, val }) => (
  <div className="space-y-2">
    <div className="text-slate-600 text-xl mx-auto flex justify-center">{icon}</div>
    <div>
      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-bold text-white">{val}</p>
    </div>
  </div>
);

const ResultStatCard = ({ title, val, icon, color }) => {
  const colors = {
    amber: 'border-amber-500/20 text-amber-500 bg-amber-500/5',
    indigo: 'border-indigo-500/20 text-indigo-500 bg-indigo-500/5',
    emerald: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5',
    rose: 'border-rose-500/20 text-rose-400 bg-rose-500/5'
  };
  return (
    <div className={`p-8 bg-glass-dark border rounded-[2.5rem] text-center space-y-3 ${colors[color]}`}>
      <div className="text-2xl flex justify-center mb-1">{icon}</div>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</p>
      <p className="text-2xl font-black text-white">{val}</p>
    </div>
  );
};

const ActionBtn = ({ icon, label }) => (
  <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-400 transition-colors">
    <span className="text-xs">{icon}</span> {label}
  </button>
);

export default Quizzes;
