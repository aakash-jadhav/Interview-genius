import { Question, InterviewConfig, OverallFeedback } from "../types";

const getBaseUrl = () => {
  const url = import.meta.env.VITE_BACKEND_URL;
  if (!url) throw new Error("VITE_BACKEND_URL is not set in .env");
  return url.replace(/\/$/, "");
};

export const generateQuestions = async (config: InterviewConfig): Promise<Question[]> => {
  const res = await fetch(`${getBaseUrl()}/api/generate-questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to generate questions (${res.status})`);
  }
  return res.json();
};

export const getSingleFeedback = async (question: string, userAnswer: string): Promise<string> => {
  const res = await fetch(`${getBaseUrl()}/api/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, userAnswer }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to get feedback (${res.status})`);
  }
  const data = await res.json();
  return data.feedback ?? "Could not generate feedback at this time.";
};

export const getOverallReview = async (
  questions: Question[],
  answers: Record<string, string>
): Promise<OverallFeedback> => {
  const res = await fetch(`${getBaseUrl()}/api/overall-review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questions, answers }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to get review (${res.status})`);
  }
  return res.json();
};
