
import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { getSingleFeedback } from '../services/geminiService';

interface QuestionPageProps {
  questions: Question[];
  onFinish: (answers: Record<string, string>) => void;
  userAnswers: Record<string, { answer: string; feedback?: string; showModelAnswer?: boolean }>;
  setUserAnswers: React.Dispatch<React.SetStateAction<Record<string, { answer: string; feedback?: string; showModelAnswer?: boolean }>>>;
  isReviewMode: boolean;
  onBackToResults: () => void;
  startTime: number | null;
  onExit: () => void;
}

const QuestionPage: React.FC<QuestionPageProps> = ({
  questions,
  onFinish,
  userAnswers,
  setUserAnswers,
  isReviewMode,
  onBackToResults,
  startTime,
  onExit
}) => {
  const [loadingFeedback, setLoadingFeedback] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState("0:00");
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  useEffect(() => {
    if (!startTime || isReviewMode) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const mins = Math.floor(elapsed / 60);
      const secs = elapsed % 60;
      setElapsedTime(`${mins}:${secs.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isReviewMode]);

  const handleAnswerChange = (qId: string, value: string) => {
    if (isReviewMode) return;
    if (value.length > 500) return;
    setUserAnswers(prev => ({
      ...prev,
      [qId]: { ...prev[qId], answer: value }
    }));
  };

  const copyToClipboard = (qId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(qId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleAnswer = (qId: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [qId]: { ...prev[qId], showModelAnswer: !prev[qId]?.showModelAnswer }
    }));
  };

  const handleGetFeedback = async (qId: string, questionText: string) => {
    const ansData = userAnswers[qId];
    if (!ansData?.answer || ansData.answer.trim().length < 2) return;

    setLoadingFeedback(qId);
    try {
      const fb = await getSingleFeedback(questionText, ansData.answer);
      setUserAnswers(prev => ({
        ...prev,
        [qId]: { ...prev[qId], feedback: fb }
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFeedback(null);
    }
  };

  const answeredCount = questions.filter(q => (userAnswers[q.id]?.answer?.trim().length || 0) > 0).length;
  const isAllAnswered = answeredCount === questions.length;

  return (
    <div className="w-full lg:w-[70%] max-w-[1400px] mx-auto px-4 py-8 pb-32">
      {isReviewMode && (
        <div className="mb-8">
          <button
            onClick={onBackToResults}
            className="flex items-center gap-2 text-blue-400 font-bold text-lg hover:text-blue-300 transition-colors group active:scale-95"
          >
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Score Report
          </button>
        </div>
      )}

      {/* Header Info Panel */}
      <div className="mb-10 bg-[#1e1e1e] p-6 rounded-3xl border border-white/5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-8 w-full md:w-auto">
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Session Progress</h4>
            <p className="text-2xl font-black text-white">
              {answeredCount} <span className="text-gray-700">/ {questions.length}</span>
            </p>
          </div>
          <div className="space-y-0.5">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Time Elapsed</h4>
            <p className="text-2xl font-black text-blue-500 font-mono tracking-wider transition-all duration-300">
              {isReviewMode ? "Complete" : elapsedTime}
            </p>
          </div>
        </div>
        <div className="w-full md:w-1/3 h-2 bg-gray-900 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-blue-600 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(37,99,235,0.4)]"
            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {questions.map((q, index) => (
          <div key={q.id} className="bg-[#1e1e1e] rounded-[2rem] border border-white/5 overflow-hidden shadow-xl hover:border-white/10 transition-colors">
            <div className="p-8 md:p-10 space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-5">
                  <span className="bg-blue-600/10 text-blue-500 text-xs font-black px-2.5 py-1 rounded-lg border border-blue-500/20 uppercase">
                    Q{index + 1}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-white/95 leading-snug">
                    {q.text}
                  </h3>
                </div>
              </div>

              <div className="relative group">
                <textarea
                  className={`w-full bg-[#121212] border rounded-2xl p-5 min-h-[160px] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-lg text-white placeholder-gray-700 resize-none leading-relaxed ${(userAnswers[q.id]?.answer?.trim().length || 0) > 0 ? 'border-blue-500/30' : 'border-white/10'
                    } ${isReviewMode ? 'opacity-80 cursor-default' : ''}`}
                  placeholder={isReviewMode ? "No response provided" : "Type your answer here..."}
                  readOnly={isReviewMode}
                  value={userAnswers[q.id]?.answer || ''}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                />

                <div className="absolute -bottom-1 left-0 w-full h-1 bg-gray-900 rounded-b-2xl overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${(userAnswers[q.id]?.answer?.length || 0) > 450 ? 'bg-amber-500' : 'bg-blue-500/50'
                      }`}
                    style={{ width: `${((userAnswers[q.id]?.answer?.length || 0) / 500) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleAnswer(q.id)}
                    className="px-5 py-2.5 rounded-xl text-sm md:text-base font-bold border border-white/10 bg-white/5 hover:bg-white/10 transition-all active:scale-95 flex items-center gap-2 group"
                  >
                    <svg className={`w-5 h-5 transition-transform duration-300 ${userAnswers[q.id]?.showModelAnswer ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {userAnswers[q.id]?.showModelAnswer ? 'Hide Answer' : 'Show Answer'}
                  </button>
                  <button
                    onClick={() => handleGetFeedback(q.id, q.text)}
                    disabled={loadingFeedback === q.id || !userAnswers[q.id]?.answer || userAnswers[q.id]?.answer.trim().length < 2}
                    className="px-5 py-2.5 rounded-xl text-sm md:text-base font-bold border border-blue-500/30 bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 active:scale-95 group"
                  >
                    {loadingFeedback === q.id ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> AI Thinking...</>
                    ) : (
                      <>
                        <svg className="w-5 h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        AI Feedback
                      </>
                    )}
                  </button>
                </div>

                <div className="text-xs font-mono text-gray-600 uppercase tracking-tighter">
                  {userAnswers[q.id]?.answer?.length || 0} / 500 Chars
                </div>
              </div>

              {/* Collapsible Answer Section */}
              {userAnswers[q.id]?.showModelAnswer && (
                <div className="p-6 bg-green-500/5 border border-green-500/20 rounded-2xl relative animate-in slide-in-from-top-4 duration-300">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-xs font-black text-green-500 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                      Model Answer Reference
                    </p>
                    <button
                      onClick={() => copyToClipboard(q.id, q.modelAnswer)}
                      className={`p-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold active:scale-90 border ${copiedId === q.id
                        ? 'bg-green-600 text-white border-green-500'
                        : 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20'
                        }`}
                      title="Copy Answer"
                    >
                      {copiedId === q.id ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                          Copy Answer
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed">{q.modelAnswer}</p>
                </div>
              )}

              {/* Collapsible Feedback Section */}
              {userAnswers[q.id]?.feedback && (
                <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl animate-in slide-in-from-top-4 duration-300">
                  <p className="text-xs font-black text-blue-500 uppercase mb-3 tracking-widest flex items-center gap-2">
                    <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                    AI Critique
                  </p>
                  <p className="text-gray-300 text-lg leading-relaxed">{userAnswers[q.id]?.feedback}</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {!isReviewMode && (
          <div className="mt-8 flex flex-col md:flex-row items-center gap-4">
            <button
              onClick={() => setShowExitConfirm(true)}
              className="w-full md:w-auto px-8 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 font-black py-5 rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-lg uppercase tracking-widest group whitespace-nowrap"
            >
              <svg className="w-6 h-6 rotate-180 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              Exit
            </button>

            <button
              onClick={() => {
                const finalAnswers: Record<string, string> = {};
                Object.keys(userAnswers).forEach(id => {
                  finalAnswers[id] = userAnswers[id].answer;
                });
                onFinish(finalAnswers);
              }}
              disabled={!isAllAnswered}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed text-xl uppercase tracking-widest group"
            >
              Analyze Interview
              <svg className="w-6 h-6 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-[#0a0a0a]/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-[#1e1e1e] border border-white/10 p-8 rounded-3xl max-w-md w-full shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-white">End Interview?</h3>
              <p className="text-gray-400">
                Are you sure you want to exit? Your progress for this session will be lost.
              </p>

              <div className="flex gap-3 w-full mt-4">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 px-6 py-3.5 rounded-xl text-white font-bold bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={onExit}
                  className="flex-1 px-6 py-3.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg shadow-red-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Confirm Exit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionPage;
