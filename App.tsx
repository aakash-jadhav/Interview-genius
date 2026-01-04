
import React, { useState, useCallback, useEffect } from 'react';
import { AppState, InterviewConfig, Question, OverallFeedback } from './types';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import QuestionPage from './components/QuestionPage';
import ResultSummary from './components/ResultSummary';
import LoadingOverlay from './components/LoadingOverlay';
import { generateQuestions, getOverallReview } from './services/geminiService';

const STORAGE_KEY = 'interview_genius_session_v2';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [loadingDesc, setLoadingDesc] = useState('');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [results, setResults] = useState<OverallFeedback | null>(null);
  const [currentConfig, setCurrentConfig] = useState<InterviewConfig | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, { answer: string; feedback?: string; showModelAnswer?: boolean }>>({});
  const [startTime, setStartTime] = useState<number | null>(null);

  // Persistence: Load session on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { state, qs, cfg, ans, res, start } = JSON.parse(saved);
        setAppState(state);
        setQuestions(qs);
        setCurrentConfig(cfg);
        setUserAnswers(ans);
        setResults(res);
        setStartTime(start);
      } catch (e) {
        console.error("Failed to restore session", e);
      }
    }
  }, []);

  // Persistence: Save session on change
  useEffect(() => {
    if (appState !== AppState.LANDING || questions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        state: appState,
        qs: questions,
        cfg: currentConfig,
        ans: userAnswers,
        res: results,
        start: startTime
      }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [appState, questions, currentConfig, userAnswers, results, startTime]);

  const handleGenerate = useCallback(async (config: InterviewConfig) => {
    setLoading(true);
    setLoadingMsg('Curating Question Bank');
    setLoadingDesc('Our AI is tailoring high-impact questions to challenge your specific role and seniority level...');
    setCurrentConfig(config);
    setUserAnswers({});

    try {
      const qs = await generateQuestions(config);
      setQuestions(qs);
      setStartTime(Date.now());
      setAppState(AppState.INTERVIEW);
    } catch (error) {
      console.error("Failed to generate questions:", error);
      alert("Something went wrong while generating questions. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFinishInterview = useCallback(async (finalAnswers: Record<string, string>) => {
    setLoading(true);
    setLoadingMsg('Analyzing Performance');
    setLoadingDesc('Our AI is reviewing your responses, identifying key strengths, and pinpointing areas for professional growth...');

    // Calculate duration
    let durationStr = "N/A";
    if (startTime) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const mins = Math.floor(elapsed / 60);
      const secs = elapsed % 60;
      durationStr = `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    try {
      const review = await getOverallReview(questions, finalAnswers);
      const finalReview = { ...review, duration: durationStr };
      setResults(finalReview);
      setAppState(AppState.RESULTS);
    } catch (error) {
      console.error("Failed to generate results:", error);
      alert("Analysis failed. We're showing a basic summary instead.");
      setResults({
        score: 0,
        summary: "Analysis failed. Please try again later.",
        strengths: ["Internal error"],
        improvements: ["Check internet connection"],
        duration: durationStr
      });
      setAppState(AppState.RESULTS);
    } finally {
      setLoading(false);
    }
  }, [questions, startTime]);

  const configureNewInterview = useCallback(() => {
    setAppState(AppState.LANDING);
    setQuestions([]);
    setResults(null);
    setUserAnswers({});
    setCurrentConfig(null);
    setStartTime(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const retryCurrentQuestions = useCallback(() => {
    setUserAnswers({});
    setResults(null);
    setStartTime(Date.now());
    setAppState(AppState.INTERVIEW);
  }, []);

  const goToReview = useCallback(() => {
    setAppState(AppState.INTERVIEW);
  }, []);

  return (
    <div className="min-h-screen relative bg-[#121212] overflow-x-hidden">
      <Header score={results?.score} />

      <main className="transition-all duration-500 pt-16">
        {appState === AppState.LANDING && (
          <LandingPage onGenerate={handleGenerate} />
        )}

        {appState === AppState.INTERVIEW && (
          <QuestionPage
            questions={questions}
            onFinish={handleFinishInterview}
            userAnswers={userAnswers}
            setUserAnswers={setUserAnswers}
            isReviewMode={results !== null}
            onBackToResults={() => setAppState(AppState.RESULTS)}
            startTime={startTime}
            onExit={configureNewInterview}
          />
        )}

        {appState === AppState.RESULTS && results && (
          <ResultSummary
            results={results}
            onRestart={retryCurrentQuestions}
            onBack={configureNewInterview}
            onReviewDetails={goToReview}
          />
        )}
      </main>

      {loading && <LoadingOverlay message={loadingMsg} description={loadingDesc} />}
    </div>
  );
};

export default App;
