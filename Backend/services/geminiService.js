const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // apni key yahan paste karein

const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: "Hello!" }] }]
    })
  }
);
const data = await response.json();
console.log(data.candidates[0].content.parts[0].text); import { GoogleGenerativeAI } from "@google/generative-ai";

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

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const model = genAI.getGenerativeModel({ model: modelName });

  const prompt = `${SYSTEM_PROMPT}\n\nStudent question: ${message}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return text?.trim() || "I could not generate a response right now.";
};
