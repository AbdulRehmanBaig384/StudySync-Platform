import React, { useState, useEffect } from 'react';
import {
  FiCode,
  FiPlay,
  FiSend,
  FiCpu,
  FiMessageSquare,
  FiClock,
  FiMaximize,
  FiSettings,
  FiChevronDown,
  FiTerminal,
  FiTrash2,
  FiChevronRight,
  FiCheckCircle,
  FiInfo,
  FiHash,
  FiMoreVertical,
  FiX,
  FiArrowLeft,
  FiZap,
  FiLayout
} from 'react-icons/fi';
import { NavLink } from 'react-router-dom';

const CodingRooms = () => {
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('// StudySync IDE v1.0\n\nfunction solve(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}');
  const [output, setOutput] = useState('');
  const [testCase, setTestCase] = useState('[2, 7, 11, 15]\n9');
  const [activeRightPanel, setActiveRightPanel] = useState(null); // null, 'chat', or 'ai'
  const [activeBottomTab, setActiveBottomTab] = useState('output'); // 'output' or 'input'
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [timer, setTimer] = useState(0);

  const toggleRightPanel = (panel) => {
    if (activeRightPanel === panel) {
      setActiveRightPanel(null);
    } else {
      setActiveRightPanel(panel);
    }
  };

  // Timer logic
  useEffect(() => {
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRun = () => {
    setOutput('Compilation Successful...\nExecuting Test Cases...\n\nResult: [0, 1]\nTime: 42ms\nMemory: 12.4MB\n\n✅ Test Case 1 Passed');
    setIsConsoleOpen(true);
    setActiveBottomTab('output');
  };

  return (
    <div className="h-screen bg-[#050811] flex flex-col font-inter overflow-hidden text-slate-300">

      {/* --- ELITE IDE HEADER --- */}
      <header className="h-14 bg-[#0a0f1e] border-b border-white/5 flex items-center justify-between px-4 z-50 shadow-2xl">
        <div className="flex items-center gap-4">
          <NavLink to="/dashboard" className="p-2.5 hover:bg-white/5 rounded-xl transition-colors text-slate-500 hover:text-white">
            <FiArrowLeft className="text-xl" />
          </NavLink>
          <div className="h-6 w-px bg-white/10 mx-1" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
              <FiHash />
            </div>
            <div>
              <h1 className="text-sm font-black text-white tracking-tight uppercase">1. Two Sum</h1>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Collaborative Session</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/5 shadow-inner">
            <FiClock className="text-emerald-400 text-xs" />
            <span className="text-xs font-mono font-bold text-white tracking-widest">{formatTime(timer)}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleRightPanel('ai')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${activeRightPanel === 'ai'
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30 border-violet-500'
                  : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white'
                }`}
            >
              <FiCpu /> AI Tutor
            </button>

            <button
              onClick={() => toggleRightPanel('chat')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${activeRightPanel === 'chat'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border-indigo-500'
                  : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white'
                }`}
            >
              <FiMessageSquare /> Partner Chat
            </button>

            <div className="h-6 w-px bg-white/10 mx-2" />

            <div className="flex items-center bg-[#0d1226] border border-white/5 rounded-xl p-1 shadow-2xl">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-xs font-black uppercase tracking-widest px-3 py-1.5 text-indigo-400 outline-none cursor-pointer hover:text-indigo-300 transition-colors"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python 3.1</option>
                <option value="cpp">C++ 20</option>
              </select>
            </div>

            <button
              onClick={handleRun}
              className="flex items-center gap-2 px-5 py-2 bg-white/5 hover:bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-black uppercase tracking-widest text-[10px] rounded-xl transition-all active:scale-95"
            >
              <FiPlay fill="currentColor" className="text-[10px]" /> Run
            </button>

            <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black uppercase tracking-widest text-[10px] rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95">
              Submit Solution
            </button>
          </div>

          <div className="h-6 w-px bg-white/10 mx-1" />

          <button className="p-2.5 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all">
            <FiSettings className="text-lg" />
          </button>
        </div>
      </header>

      {/* --- MAIN SPLIT SPACE --- */}
      <main className="flex-1 flex overflow-hidden">

        {/* PANEL 1: PROBLEM DESCRIPTION */}
        <section className="w-[450px] xl:w-[550px] bg-[#0a0f1e]/50 border-r border-white/5 flex flex-col overflow-hidden animate-slide-up">
          <div className="flex items-center gap-6 px-6 h-12 border-b border-white/5 bg-white/[0.01]">
            <button className="text-[10px] font-black uppercase tracking-widest text-indigo-400 border-b-2 border-indigo-500 h-full">Description</button>
            <button className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors h-full">Solutions</button>
            <button className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors h-full">Submissions</button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20 rounded-md">Easy</span>
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">ID: #001</span>
              </div>
              <h2 className="text-3xl font-black text-white tracking-tight leading-tight">Two Sum</h2>
              <div className="flex items-center gap-4 py-2 border-y border-white/5">
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="text-emerald-500" />
                  <span className="text-[10px] font-bold text-slate-400">4.2M Solved</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiInfo className="text-amber-500" />
                  <span className="text-[10px] font-bold text-slate-400">Acceptance Rate: 51.2%</span>
                </div>
              </div>
            </div>

            <article className="prose prose-invert prose-sm">
              <p className="text-slate-300 leading-relaxed font-medium">
                Given an array of integers <code className="bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded italic">nums</code> and an integer <code className="bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded italic">target</code>, return indices of the two numbers such that they add up to <code className="text-white font-bold">target</code>.
              </p>
              <p className="text-slate-400 mt-4 italic border-l-2 border-indigo-500/40 pl-4 bg-indigo-500/5 py-4 rounded-r-xl">
                You may assume that each input would have exactly one solution, and you may not use the same element twice.
              </p>
            </article>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-3">
                <span className="w-8 h-px bg-indigo-500" /> Examples
              </h4>
              <div className="space-y-4">
                <ExampleCard
                  input="nums = [2,7,11,15], target = 9"
                  output="[0,1]"
                  explanation="Because nums[0] + nums[1] == 9, we return [0, 1]."
                />
              </div>
            </div>

            <div className="space-y-4 pb-12">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-3">
                <span className="w-8 h-px bg-emerald-500" /> Constraints
              </h4>
              <div className="grid grid-cols-1 gap-3">
                <ConstraintItem text="2 <= nums.length <= 10^4" />
                <ConstraintItem text="-10^9 <= nums[i] <= 10^9" />
                <ConstraintItem text="-10^9 <= target <= 10^9" />
              </div>
            </div>
          </div>
        </section>

        {/* PANEL 2: EDITOR CORE */}
        <section className="flex-1 flex flex-col bg-[#050811] relative border-r border-white/5">
          <div className="flex-1 flex overflow-hidden relative">
            {/* Line Gutter */}
            <div className="w-12 bg-black/20 border-r border-white/5 py-6 flex flex-col items-center text-slate-700 font-mono text-[11px] leading-[1.8rem] select-none">
              {[...Array(30)].map((_, i) => <div key={i}>{i + 1}</div>)}
            </div>

            {/* Professional Editor Sim */}
            <div className="flex-1 flex flex-col relative custom-scrollbar overflow-auto">
              {/* Fake Syntax Overlay would go here in real Monaco, using styled textarea for now */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck="false"
                className="flex-1 bg-transparent p-6 font-mono text-[14px] leading-[1.8rem] text-indigo-50/90 focus:outline-none resize-none overflow-visible whitespace-pre"
              />

              {/* Editor Floating Actions */}
              <div className="absolute top-4 right-6 flex items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all">
                  <FiZap /> Optimized
                </button>
              </div>
            </div>
          </div>

          {/* PANEL 3: BOTTOM TERMINAL / EXECUTION (Conditional) */}
          {isConsoleOpen && (
            <div className="h-[300px] xl:h-[350px] bg-glass-dark border-t border-white/10 flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.5)] animate-slide-up relative">
              <div className="h-10 flex items-center px-6 border-b border-white/5 bg-white/[0.01] justify-between">
                <div className="flex gap-8 h-full">
                  <button
                    onClick={() => setActiveBottomTab('output')}
                    className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all h-full border-b-2 ${activeBottomTab === 'output' ? 'text-indigo-400 border-indigo-500' : 'text-slate-600 border-transparent hover:text-slate-400'}`}
                  >
                    <FiTerminal /> Console Output
                  </button>
                  <button
                    onClick={() => setActiveBottomTab('input')}
                    className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all h-full border-b-2 ${activeBottomTab === 'input' ? 'text-indigo-400 border-indigo-500' : 'text-slate-600 border-transparent hover:text-slate-400'}`}
                  >
                    <FiCheckCircle /> Test Cases
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setOutput('')}
                    className="text-slate-600 hover:text-rose-400 transition-colors"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                  <button
                    onClick={() => setIsConsoleOpen(false)}
                    className="p-1 text-slate-500 hover:text-white hover:bg-white/5 rounded transition-all"
                  >
                    <FiX />
                  </button>
                </div>
              </div>

              <div className="flex-1 p-6 overflow-y-auto font-mono text-xs custom-scrollbar">
                {activeBottomTab === 'output' ? (
                  <div className="animate-slide-up space-y-2">
                    {output ? (
                      <div className="text-emerald-400 whitespace-pre-wrap leading-relaxed animate-slide-up">
                        {output}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-700 opacity-20 py-10 scale-90">
                        <FiPlay className="text-[60px] mb-4" />
                        <p className="text-sm font-black uppercase tracking-[0.3em]">Ready for execution</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="animate-slide-up space-y-4 h-full flex flex-col">
                    <div className="flex items-center justify-between">
                      <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Compiler Stdin</h5>
                      <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[8px] font-black rounded uppercase">Array Formatted</span>
                    </div>
                    <textarea
                      value={testCase}
                      onChange={(e) => setTestCase(e.target.value)}
                      className="flex-1 bg-black/30 rounded-2xl border border-white/5 p-4 text-emerald-400 focus:outline-none focus:border-emerald-500/20 resize-none font-mono"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
        {/* PANEL 4: SIDE UTILITY COLLABORATION (Conditional) */}
        {activeRightPanel && (
          <section className="w-[350px] xl:w-[450px] bg-[#0a0f1e] flex flex-col relative shadow-full animate-slide-right">
            {/* Right Header Navigation */}
            <div className="h-14 flex items-center px-4 bg-white/[0.01] border-b border-white/5 justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${activeRightPanel === 'chat' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-violet-500/10 text-violet-400'}`}>
                  {activeRightPanel === 'chat' ? <FiMessageSquare /> : <FiCpu />}
                </div>
                <h4 className="text-xs font-black uppercase tracking-widest text-white">
                  {activeRightPanel === 'chat' ? 'Partner Chat' : 'AI Assistant'}
                </h4>
              </div>
              <button
                onClick={() => setActiveRightPanel(null)}
                className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                <FiX />
              </button>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">
              {activeRightPanel === 'chat' ? (
                <>
                  <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    <ChatMessage
                      user="Study Assistant"
                      time="10:42 AM"
                      color="indigo"
                      text="Hello! Remember that using a Hash Map can reduce the complexity to O(n)."
                    />
                    <ChatMessage
                      user="Alex (Partner)"
                      time="10:45 AM"
                      color="emerald"
                      text="I'm testing the edge case with [3, 3] target = 6. Can you check my indices?"
                      self={false}
                    />
                  </div>

                  <div className="p-5 bg-white/[0.02] border-t border-white/5">
                    <div className="relative group">
                      <input
                        type="text"
                        placeholder="Message partner..."
                        className="w-full bg-[#0d1226] border border-white/10 focus:border-indigo-500/40 rounded-2xl px-5 py-4 text-xs text-white focus:outline-none transition-all pr-12 shadow-inner"
                      />
                      <button className="absolute right-2 top-2 p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all">
                        <FiSend />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col p-8 space-y-10 animate-slide-up">
                  <div className="p-6 bg-gradient-to-br from-violet-600/20 to-indigo-600/20 rounded-[2rem] border border-violet-500/20 space-y-4 shadow-xl">
                    <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-600/30">
                      <FiCpu className="text-xl" />
                    </div>
                    <h4 className="text-sm font-black text-white">Advanced AI Tutor</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">I'm analyzing your current code context in real-time. How can I assist your learning?</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <AIActionBtn icon={<FiZap />} text="Analyze Complexity" />
                    <AIActionBtn icon={<FiInfo />} text="Get Small Hint" />
                    <AIActionBtn icon={<FiCode />} text="Review My Logic" />
                  </div>

                  <div className="mt-auto p-4 border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                    <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest text-center leading-relaxed">
                      AI assistance is enabled as part of your StudySync Pro session
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

      </main>

      {/* --- ELITE STATUS BAR --- */}
      <footer className="h-8 bg-[#0a0f1e] border-t border-white/5 px-6 flex items-center justify-between text-[9px] font-bold text-slate-600 uppercase tracking-widest z-50">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-indigo-400">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            <span>IDE Ready</span>
          </div>
          <span className="flex items-center gap-2"><FiMaximize className="text-xs" /> Line 12, Col 4</span>
          <span className="flex items-center gap-2 text-emerald-500"><FiCheckCircle className="text-xs" /> All Nodes Healthy</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2">UTF-8</span>
          <span className="flex items-center gap-2 text-slate-400"><FiLayout className="text-xs" /> 3 Pane Split</span>
          <div className="h-4 w-px bg-white/10" />
          <span className="text-slate-500">© StudySync Cloud IDE</span>
        </div>
      </footer>
    </div>
  );
};

// --- Reusable Modern Components ---

const ExampleCard = ({ input, output, explanation }) => (
  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3 group hover:border-white/10 transition-colors">
    <div className="flex flex-col gap-1.5">
      <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Input</span>
      <code className="text-xs text-slate-300 font-mono font-medium">{input}</code>
    </div>
    <div className="flex flex-col gap-1.5">
      <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Output</span>
      <code className="text-xs text-slate-300 font-mono font-medium">{output}</code>
    </div>
    <div className="bg-white/[0.02] p-3 rounded-xl">
      <p className="text-[10px] leading-relaxed text-slate-500 font-medium italic">{explanation}</p>
    </div>
  </div>
);

const ConstraintItem = ({ text }) => (
  <div className="flex items-center gap-3 py-1.5 px-4 bg-white/[0.02] border border-white/5 rounded-xl group hover:bg-white/5 transition-colors">
    <div className="w-1 h-1 bg-indigo-500 rounded-full group-hover:scale-150 transition-transform" />
    <code className="text-[10px] text-slate-400 font-mono group-hover:text-slate-200">{text}</code>
  </div>
);

const ChatMessage = ({ user, time, color, text, self = false }) => (
  <div className="flex flex-col group animate-slide-up">
    <div className="flex items-center justify-between mb-2">
      <span className={`text-[10px] font-black tracking-widest uppercase ${color === 'indigo' ? 'text-indigo-400' : 'text-emerald-400'}`}>{user}</span>
      <span className="text-[8px] text-slate-600 font-bold">{time}</span>
    </div>
    <div className={`p-4 rounded-2xl rounded-tl-none border border-white/5 text-[12px] leading-relaxed transition-all shadow-sm ${self ? 'bg-indigo-600/10 border-indigo-500/20 text-indigo-100' : 'bg-white/5 text-slate-300'}`}>
      {text}
    </div>
  </div>
);

const AIActionBtn = ({ icon, text }) => (
  <button className="w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-violet-600/10 border border-white/5 hover:border-violet-500/30 rounded-2xl text-left text-xs font-bold text-slate-400 hover:text-white transition-all group">
    <span className="text-base text-slate-600 group-hover:text-violet-400 transition-colors">{icon}</span>
    {text}
    <FiChevronRight className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
  </button>
);

export default CodingRooms;