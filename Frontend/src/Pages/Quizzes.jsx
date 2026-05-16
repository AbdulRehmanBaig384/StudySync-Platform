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
import QuizSetupModal from '../components/QuizSetupModal';

const Quizzes = () => {
  const [view, setView] = useState('courses'); 
  const [courses, setCourses] = useState([]);
  const [topics, setTopics] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timer, setTimer] = useState(0);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isPracticeModalOpen, setIsPracticeModalOpen] = useState(false);
  const [practiceSessionId, setPracticeSessionId] = useState(null);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [practiceResults, setPracticeResults] = useState(null);
  const [practiceHistory, setPracticeHistory] = useState([]);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchCourses();
    fetchPracticeHistory();
  }, []);

  const fetchPracticeHistory = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/quiz/practice/history/${userId}`);
      const data = await res.json();
      setPracticeHistory(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/quiz/courses');
      const data = await res.json();
      setCourses(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchTopics = async (courseId) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/quiz/courses/${courseId}/topics`);
      const data = await res.json();
      setTopics(data);
      setView('topics');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizzes = async (topic) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/quiz/topics/${topic}/quizzes`);
      const data = await res.json();
      setQuizzes(data);
      setView('quizzes');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (quizId) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/quiz/${quizId}/questions`);
      const data = await res.json();
      setQuestions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    fetchTopics(course._id);
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    fetchQuizzes(topic);
  };

  const handleQuizSelect = (quiz) => {
    setSelectedQuiz(quiz);
    setView('start');
  };

  const beginAttempt = async () => {
    await fetchQuestions(selectedQuiz._id);
    setView('attempt');
    setTimer(selectedQuiz.timeLimit * 60);
    setUserAnswers({});
    setCurrentQuestion(0);
  };

  const handleGeneratePractice = async (formData) => {
    try {
      const res = await fetch('http://localhost:3000/api/quiz/practice/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, userId })
      });
      const data = await res.json();
      if (res.ok) {
        setQuestions(data.questions);
        setPracticeSessionId(data.sessionId);
        setIsPracticeMode(true);
        setIsPracticeModalOpen(false);
        setView('practice-attempt');
        setCurrentQuestion(0);
        setUserAnswers({});
      } else {
        alert(data.message || "Generation failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server");
    }
  };

  const finishPracticeQuiz = async () => {
    setLoading(true);
    try {
      const answersArray = questions.map((_, i) => userAnswers[i] !== undefined ? questions[i].options[userAnswers[i]] : null);
      
      const res = await fetch(`http://localhost:3000/api/quiz/practice/${practiceSessionId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedAnswers: answersArray })
      });
      const data = await res.json();
      setPracticeResults(data);
      setView('practice-result');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const finishQuiz = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/quiz/${selectedQuiz._id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, selectedAnswers: userAnswers })
      });
      const data = await res.json();
      setResults(data);
      setView('result');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval;
    if (view === 'attempt' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0 && view === 'attempt') {
      finishQuiz();
    }
    return () => clearInterval(interval);
  }, [view, timer]);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in pb-20">

        {view === 'courses' && (
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight">Quiz & Practice</h1>
                <p className="text-slate-400 text-sm mt-1">Select a course or generate a custom AI practice session.</p>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => {
                    fetchPracticeHistory();
                    setView('history');
                  }}
                  className="flex items-center gap-2 px-6 py-4 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  <FiClock /> History
                </button>
                <button 
                  onClick={() => setIsPracticeModalOpen(true)}
                  className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-600/20 group"
                >
                  <div className="bg-white/20 p-2 rounded-xl group-hover:rotate-12 transition-transform">
                    <FiCpu className="text-lg" />
                  </div>
                  Attempt MCQs
                </button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1,2,3,4].map(i => <div key={i} className="h-64 bg-white/5 animate-pulse rounded-[2.5rem]" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {courses.map((course) => (
                  <div key={course._id} onClick={() => handleCourseSelect(course)} className="group bg-glass-dark border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-indigo-500/30 transition-all hover:-translate-y-1 shadow-xl flex flex-col h-full cursor-pointer">
                    <div className="h-40 w-full relative overflow-hidden">
                      <img src={course.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'} className="w-full h-full object-cover opacity-60" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent" />
                    </div>
                    <div className="p-8">
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{course.category}</span>
                      <h3 className="text-white font-bold mt-1 group-hover:text-indigo-300 transition-colors">{course.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {view === 'topics' && (
          <div className="space-y-8 animate-fade-in">
            <button onClick={() => setView('courses')} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
              <FiArrowLeft /> Back to Courses
            </button>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">{selectedCourse?.title} Topics</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics.length > 0 ? (
                topics.map((topic, i) => (
                  <div key={i} onClick={() => handleTopicSelect(topic)} className="p-8 bg-glass-dark border border-white/5 rounded-[2rem] hover:border-indigo-500/30 transition-all cursor-pointer group flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-indigo-400 text-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <FiZap />
                      </div>
                      <h3 className="text-white font-black uppercase tracking-widest text-xs">{topic}</h3>
                    </div>
                    <FiChevronRight className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                ))
              ) : (
                <div className="col-span-full py-10 flex flex-col items-center justify-center text-slate-600 space-y-4">
                   <FiAlertCircle className="text-2xl opacity-30" />
                   <p className="font-bold opacity-30 uppercase tracking-[0.2em] text-[10px]">No topics found for this course</p>
                </div>
              )}
            </div>

            <div className="mt-12 p-8 bg-indigo-600/5 border border-indigo-500/10 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600/20 rounded-full flex items-center justify-center text-indigo-400 text-xl">
                  <FiCpu />
                </div>
                <div>
                  <h4 className="text-white font-black uppercase tracking-widest text-xs">AI Quiz Generator</h4>
                  <p className="text-slate-500 text-[10px]">Generate custom MCQs for any topic in this course instantly.</p>
                </div>
              </div>
              <button className="px-8 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all">
                Try AI Generator
              </button>
            </div>
          </div>
        )}

        {view === 'quizzes' && (
          <div className="space-y-8 animate-fade-in">
            <button onClick={() => setView('topics')} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
              <FiArrowLeft /> Back to Topics
            </button>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">{selectedTopic} Assessments</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {quizzes.length > 0 ? (
                quizzes.map((quiz) => (
                  <div key={quiz._id} className="group bg-glass-dark border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-indigo-500/30 transition-all shadow-xl flex flex-col h-full">
                    <div className="h-40 w-full relative overflow-hidden">
                      <img src={quiz.image || 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4'} className="w-full h-full object-cover opacity-60" />
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-indigo-600 text-white rounded-full text-[8px] font-black uppercase tracking-widest">
                          {quiz.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="p-8 space-y-6 flex-1 flex flex-col">
                      <h3 className="text-white font-bold">{quiz.title}</h3>
                      <div className="flex items-center gap-6 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-2"><FiLayers /> {quiz.totalQuestions} Qs</span>
                        <span className="flex items-center gap-2"><FiClock /> {quiz.timeLimit} Min</span>
                      </div>
                      <button onClick={() => handleQuizSelect(quiz)} className="w-full py-4 bg-white/5 hover:bg-indigo-600 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white rounded-2xl transition-all">
                        Start Assessment
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-10 flex flex-col items-center justify-center text-slate-600 space-y-4">
                   <FiAlertCircle className="text-2xl opacity-30" />
                   <p className="font-bold opacity-30 uppercase tracking-[0.2em] text-[10px]">No quizzes available for this topic</p>
                </div>
              )}
            </div>
          </div>
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
              <InfoItem icon={<FiLayers />} label="Questions" val={selectedQuiz.totalQuestions} />
              <InfoItem icon={<FiClock />} label="Duration" val={`${selectedQuiz.timeLimit} Min`} />
              <InfoItem icon={<FiTrendingUp />} label="Difficulty" val={selectedQuiz.difficulty} />
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

        {(view === 'attempt' || view === 'practice-attempt') && (
          <div className="max-w-6xl mx-auto h-[700px] flex flex-col bg-glass-dark border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl relative">
            <div className="h-20 bg-white/[0.02] border-b border-white/5 px-10 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <span className="text-sm font-black text-white uppercase">Q{currentQuestion + 1}<span className="text-slate-500">/{questions.length}</span></span>
                <div className="w-64 h-1.5 bg-black/30 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 transition-all duration-500" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }} />
                </div>
              </div>
              {!isPracticeMode && (
                <div className="flex items-center gap-4 bg-rose-500/10 px-6 py-2.5 rounded-2xl border border-rose-500/20">
                  <FiClock className={`text-rose-500 ${timer < 60 ? 'animate-pulse' : ''}`} />
                  <span className={`font-mono text-sm font-bold ${timer < 60 ? 'text-rose-400' : 'text-white'}`}>
                    {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              )}
              {isPracticeMode && (
                <div className="flex items-center gap-4 bg-indigo-500/10 px-6 py-2.5 rounded-2xl border border-indigo-500/20">
                  <FiZap className="text-indigo-400" />
                  <span className="text-xs font-black text-white uppercase tracking-widest">Practice Mode</span>
                </div>
              )}
            </div>

            <div className="flex-1 p-12 overflow-y-auto custom-scrollbar">
              {questions.length > 0 && (
                <div className="space-y-12">
                  <h2 className="text-2xl font-bold text-white leading-relaxed">{questions[currentQuestion].question}</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {questions[currentQuestion].options.map((opt, i) => (
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
              )}
            </div>

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
                {currentQuestion === questions.length - 1 ? (
                  <button 
                    onClick={isPracticeMode ? finishPracticeQuiz : finishQuiz} 
                    className="px-10 py-3 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20 hover:scale-105 transition-all"
                  >
                    Finish Assessment
                  </button>
                ) : (
                  <button onClick={() => setCurrentQuestion(currentQuestion + 1)} className="px-10 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all flex items-center gap-2">Next <FiChevronRight /></button>
                )}
              </div>
            </div>
          </div>
        )}

        {(view === 'result' || view === 'practice-result') && (isPracticeMode ? practiceResults : results) && (
          <div className="max-w-6xl mx-auto space-y-10 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <ResultStatCard title="Overall Score" val={`${(isPracticeMode ? practiceResults : results).score}/${(isPracticeMode ? practiceResults : results).total}`} icon={<FiZap className="text-amber-500" />} color="amber" />
              <ResultStatCard title="Percentage" val={`${(isPracticeMode ? practiceResults : results).percentage.toFixed(1)}%`} icon={<FiTrendingUp className="text-indigo-500" />} color="indigo" />
              <ResultStatCard title="Correct" val={(isPracticeMode ? practiceResults : results).correctCount} icon={<FiCheckCircle className="text-emerald-500" />} color="emerald" />
              <ResultStatCard title="Wrong" val={(isPracticeMode ? practiceResults : results).wrongCount} icon={<FiXCircle className="text-rose-500" />} color="rose" />
            </div>

            <div className="grid grid-cols-1 gap-8">
              <div className="bg-glass-dark border border-white/5 rounded-[3rem] p-10 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
                    <FiSearch className="text-indigo-400" /> Review Detailed Results
                  </h3>
                  <div className={`px-6 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest ${
                    (isPracticeMode ? practiceResults : results).passed ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                  }`}>
                    {(isPracticeMode ? practiceResults : results).passed ? 'Passed' : 'Failed'}
                  </div>
                </div>
                
                <div className="space-y-6">
                  {(isPracticeMode ? practiceResults : results).detailedResults.map((item, i) => (
                    <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] space-y-6">
                      <div className="flex items-start justify-between gap-4">
                        <h4 className="text-sm font-bold text-white leading-relaxed">
                          <span className="text-slate-500 mr-2">Q{i+1}.</span> {item.question}
                        </h4>
                        {item.isCorrect ? (
                          <span className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[8px] font-black uppercase tracking-widest border border-emerald-500/20 rounded-lg">Correct</span>
                        ) : (
                          <span className="flex items-center gap-2 px-3 py-1 bg-rose-500/10 text-rose-400 text-[8px] font-black uppercase tracking-widest border border-rose-500/20 rounded-lg">Incorrect</span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {item.options.map((opt, idx) => {
                          const isSelected = isPracticeMode ? (item.selectedAnswer === opt) : (item.selectedAnswer === idx);
                          const isCorrect = isPracticeMode ? (item.correctAnswer === opt) : (item.correctAnswer === idx);
                          
                          return (
                            <div key={idx} className={`p-4 rounded-xl text-xs font-medium border ${
                              isCorrect ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' :
                              isSelected && !isCorrect ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' :
                              'bg-white/5 border-white/5 text-slate-500'
                            }`}>
                              {opt}
                            </div>
                          );
                        })}
                      </div>

                      {item.explanation && (
                        <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl">
                          <p className="text-[10px] text-indigo-300 italic"><span className="font-black uppercase tracking-widest mr-2">Explanation:</span> {item.explanation}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-8">
              <button 
                onClick={() => {
                  setView('courses');
                  setIsPracticeMode(false);
                }} 
                className="px-12 py-5 bg-white text-indigo-600 rounded-3xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl shadow-white/5"
              >
                Back to Courses
              </button>
            </div>
          </div>
        )}
        {view === 'history' && (
          <div className="space-y-8 animate-fade-in">
            <button onClick={() => setView('courses')} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
              <FiArrowLeft /> Back to Courses
            </button>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-black text-white tracking-tight">Practice History</h1>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {practiceHistory.length > 0 ? (
                practiceHistory.map((session) => (
                  <div 
                    key={session._id} 
                    onClick={() => {
                      const detailedResults = session.questions.map((q, i) => ({
                        question: q.question,
                        options: q.options,
                        selectedAnswer: session.selectedAnswers[i],
                        correctAnswer: q.correctAnswer,
                        isCorrect: session.selectedAnswers[i] === q.correctAnswer,
                        explanation: q.explanation
                      }));
                      setPracticeResults({ ...session, detailedResults });
                      setIsPracticeMode(true);
                      setView('practice-result');
                    }}
                    className="p-6 bg-glass-dark border border-white/5 rounded-3xl hover:border-indigo-500/30 transition-all cursor-pointer group flex items-center justify-between"
                  >
                    <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${session.passed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {session.passed ? <FiCheckCircle /> : <FiXCircle />}
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-sm">{session.topic}</h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{session.difficulty}</span>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">|</span>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{new Date(session.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-8 text-right">
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Score</p>
                        <p className="text-lg font-black text-white">{session.score}/{session.totalQuestions}</p>
                      </div>
                      <FiChevronRight className="text-slate-600 group-hover:text-white transition-all" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-slate-600 space-y-4 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                   <FiClock className="text-4xl opacity-30" />
                   <p className="font-bold opacity-30 uppercase tracking-[0.2em] text-[10px]">No history found. Start your first practice session!</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      <QuizSetupModal 
        isOpen={isPracticeModalOpen} 
        onClose={() => setIsPracticeModalOpen(false)} 
        onGenerate={handleGeneratePractice} 
      />
    </DashboardLayout>
  );
};

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
