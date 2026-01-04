
export interface Question {
  id: string;
  text: string;
  modelAnswer: string;
  type: string;
}

export interface UserAnswer {
  questionId: string;
  answer: string;
  feedback?: string;
  showModelAnswer?: boolean;
}

export interface InterviewConfig {
  role: string;
  count: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: string;
  includeCoding: boolean;
}

export interface OverallFeedback {
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  duration?: string;
}

export enum AppState {
  LANDING = 'LANDING',
  INTERVIEW = 'INTERVIEW',
  RESULTS = 'RESULTS'
}
