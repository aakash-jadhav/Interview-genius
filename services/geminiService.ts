
import { GoogleGenAI, Type } from "@google/genai";
import { Question, InterviewConfig, OverallFeedback } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateQuestions = async (config: InterviewConfig): Promise<Question[]> => {
  const prompt = `Generate ${config.count} interview questions for a ${config.role} position.
  Difficulty: ${config.difficulty}.
  Topics to focus on: ${config.topics || 'General technical and behavioral'}.
  ${config.includeCoding ? 'Include some code-output based questions where appropriate.' : 'Focus on conceptual and architectural questions.'}
  
  Provide exactly ${config.count} questions. Each question must have a clear "modelAnswer" (one concise paragraph).`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING, description: "The interview question text." },
            modelAnswer: { type: Type.STRING, description: "A high-quality model answer (1 paragraph)." },
            type: { type: Type.STRING, description: "The type of question (e.g., technical, behavioral, coding)." }
          },
          required: ["text", "modelAnswer", "type"]
        }
      }
    }
  });

  const parsed = JSON.parse(response.text || "[]");
  return parsed.map((q: any, index: number) => ({
    ...q,
    id: `q-${index}`
  }));
};

export const getSingleFeedback = async (question: string, userAnswer: string): Promise<string> => {
  const prompt = `Act as an expert interviewer. Provide constructive feedback for this answer.
  Question: ${question}
  User's Answer: ${userAnswer}
  
  Requirements:
  - Keep it to one concise paragraph (max 400 chars).
  - Mention what was good.
  - Suggest specific missing points or improvements.
  - Use professional, encouraging tone.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt
  });

  return response.text || "Could not generate feedback at this time.";
};

export const getOverallReview = async (questions: Question[], answers: Record<string, string>): Promise<OverallFeedback> => {
  const interviewData = questions.map(q => ({
    question: q.text,
    answer: answers[q.id] || "No answer provided"
  }));

  const prompt = `Analyze these interview responses and provide a summary review.
  Data: ${JSON.stringify(interviewData)}
  
  Instructions:
  - Give an overall score from 0-100.
  - Provide a one-paragraph summary.
  - List 2-3 key strengths.
  - List 2-3 specific areas for improvement.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          summary: { type: Type.STRING },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvements: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["score", "summary", "strengths", "improvements"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};
