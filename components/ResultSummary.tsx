
import React from 'react';
import { OverallFeedback } from '../types';

interface ResultSummaryProps {
  results: OverallFeedback;
  onRestart: () => void;
  onBack: () => void;
  onReviewDetails: () => void;
}

const ResultSummary: React.FC<ResultSummaryProps> = ({ results, onRestart, onBack, onReviewDetails }) => {
  return (
    <div className="w-full lg:w-[70%] max-w-[1400px] mx-auto px-4 py-8 animate-in fade-in zoom-in duration-700">
      <div className="bg-[#1e1e1e] rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
        {/* Header/Score */}
        <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 p-10 md:p-14 text-center">
          <p className="text-blue-100 font-black uppercase tracking-[0.3em] text-sm mb-3 opacity-80">Final Readiness Score</p>
          <div className="text-7xl md:text-9xl font-black text-white mb-4 drop-shadow-2xl">{results.score}</div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="inline-block px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
               <p className="text-blue-50 text-lg font-bold">Performance Analysis</p>
            </div>
            {results.duration && (
              <div className="inline-block px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                <p className="text-blue-50 text-lg font-bold">Time: <span className="font-mono">{results.duration}</span></p>
              </div>
            )}
          </div>
        </div>

        <div className="p-8 md:p-12 space-y-12">
          {/* Summary */}
          <section className="space-y-4">
            <h3 className="text-2xl font-black flex items-center gap-4">
              <span className="w-1.5 h-8 bg-blue-500 rounded-full"></span>
              Expert Consensus
            </h3>
            <p className="text-gray-300 leading-relaxed text-xl font-light">
              {results.summary}
            </p>
          </section>

          {/* Detailed Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 bg-green-500/5 p-6 rounded-3xl border border-green-500/10">
              <h4 className="text-green-500 font-black uppercase tracking-widest text-xs">Elite Strengths</h4>
              <ul className="space-y-3">
                {results.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-200 text-lg font-medium">
                    <svg className="w-6 h-6 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 bg-amber-500/5 p-6 rounded-3xl border border-amber-500/10">
              <h4 className="text-amber-500 font-black uppercase tracking-widest text-xs">Growth Opportunities</h4>
              <ul className="space-y-3">
                {results.improvements.map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-200 text-lg font-medium">
                    <svg className="w-6 h-6 text-amber-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-8 border-t border-white/5 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={onReviewDetails}
                className="bg-blue-600 hover:bg-blue-500 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-xl active:scale-95 text-sm md:text-lg uppercase tracking-widest flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className="truncate">Review Detailed Responses</span>
              </button>
              
              <button
                onClick={onRestart}
                className="bg-white text-black hover:bg-gray-100 font-black py-4 px-6 rounded-2xl transition-all shadow-xl active:scale-95 text-sm md:text-lg uppercase tracking-widest flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="truncate">Retry This Session</span>
              </button>
            </div>
            
            <button
              onClick={onBack}
              className="w-full bg-transparent border-2 border-white/10 hover:bg-white/5 text-gray-400 hover:text-white font-black py-4 px-6 rounded-2xl transition-all active:scale-95 text-sm md:text-lg uppercase tracking-widest flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span className="truncate">Configure New Interview Session</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultSummary;
