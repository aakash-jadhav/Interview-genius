
import React, { useState } from 'react';
import { InterviewConfig } from '../types';

interface LandingPageProps {
  onGenerate: (config: InterviewConfig) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGenerate }) => {
  const [config, setConfig] = useState<InterviewConfig>({
    role: '',
    count: 10,
    difficulty: 'Medium',
    topics: '',
    includeCoding: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config.role.trim()) return;
    onGenerate(config);
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 overflow-hidden py-2">
      <div className="text-center mb-4 w-full lg:w-[70%] max-w-[1400px]">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-1 tracking-tight leading-tight">
          AI Interview <span className="text-blue-500">Mastery</span>
        </h2>
        <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto">
          Tailored scenarios and real-time feedback for your next career move.
        </p>
      </div>

      <div className="w-full lg:w-[70%] max-w-[1400px] bg-[#1e1e1e] p-5 md:p-8 rounded-[1.5rem] shadow-2xl border border-white/5 space-y-5 overflow-y-auto max-h-[85%] custom-scrollbar">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Target Role</label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g., Senior React Frontend Engineer"
                className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-base text-white placeholder-gray-600 shadow-inner"
                value={config.role}
                onChange={(e) => setConfig({ ...config, role: e.target.value })}
                required
              />
              <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Question Count */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Questions</label>
              <div className="flex bg-[#121212] p-1 rounded-xl border border-white/10">
                {[5, 10, 20].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setConfig({ ...config, count: num })}
                    className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all ${
                      config.count === num ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Difficulty</label>
              <div className="flex bg-[#121212] p-1 rounded-xl border border-white/10">
                {(['Easy', 'Medium', 'Hard'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setConfig({ ...config, difficulty: level })}
                    className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all ${
                      config.difficulty === level ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Topics */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Key Topics</label>
            <textarea
              placeholder="e.g., System Design, React Lifecycle, Unit Testing"
              className="w-full bg-[#121212] border border-white/10 rounded-xl px-4 py-2 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-base text-white placeholder-gray-600 resize-none shadow-inner leading-relaxed"
              value={config.topics}
              onChange={(e) => setConfig({ ...config, topics: e.target.value })}
            />
          </div>

          {/* Coding Toggle */}
          <div className="flex items-center justify-between p-3 bg-[#121212] rounded-xl border border-white/10 transition-colors">
            <div>
              <p className="text-base font-bold">Include Code Analysis</p>
              <p className="text-gray-500 text-xs">Add technical logic and snippet questions</p>
            </div>
            <button
              type="button"
              onClick={() => setConfig({ ...config, includeCoding: !config.includeCoding })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                config.includeCoding ? 'bg-blue-600' : 'bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-md ${
                  config.includeCoding ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3 rounded-xl shadow-xl shadow-blue-900/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-lg uppercase tracking-widest"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Start Interview
          </button>
        </form>
      </div>

      <p className="mt-4 text-gray-600 text-xs font-medium">
        Expertly curated technical assessments.
      </p>
    </div>
  );
};

export default LandingPage;
