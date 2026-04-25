import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `
You are StudySync AI Tutor.
Rules:
- Be concise and practical.
- Explain concepts in student-friendly language.
- Use bullet points when useful.
- If the user asks coding questions, provide short examples.
- If unsure, say so clearly.
`;

export const generateTutorReply = async (message) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing in backend environment.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  const response = await ai.models.generateContent({
    model,
    contents: `${SYSTEM_PROMPT}\n\nStudent question: ${message}`,
  });

  return response.text?.trim() || "I could not generate a response right now.";
};
