const SYSTEM_PROMPT=`
You are StudySync AI Tutor.
Rules:
- Be concise and practical.
- Explain concepts in student-friendly language.
- Use bullet points when useful.
- If the user asks coding questions, provide short examples.
- If unsure, say so clearly.
`;
export const generateTutorReply =async (message) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return "AI configuration error.Please check backend environment.";
  }
  const versions = ["v1", "v1beta"];
  const models = ["gemini-3-flash","gemini-3.1-pro", "gemini-2.5-flash", "gemini-2.5-pro"];

  let lastError = "";

  for (const version of versions) {
    for (const model of models) {
      try {
        console.log(`Attempting Direct Fetch: ${version} / ${model}`);
        
        const response = await fetch(
          `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `${SYSTEM_PROMPT}\n\nStudent question: ${message}`
                    }
                  ]
                }
              ]
            }),
          }
        );

        const data = await response.json();

        if(response.ok){
          return data.candidates?.[0]?.content?.parts?.[0]?.text || "I received an empty response from the AI.";
        } else {
          console.error(`Failed ${version}/${model}:`, data.error?.message || response.statusText);
          lastError = data.error?.message || response.statusText;
          
          if (response.status === 429) {
            return "AI Quota Exceeded. Please wait a minute before trying again.";
          }
        }
      } catch (err) {
        console.error(`Fetch Error ${version}/${model}:`, err.message);
        lastError = err.message;
      }
    }
  }

  return `AI Error: All connection attempts failed. Last error: ${lastError}. Please ensure the Generative Language API is enabled in your Google Cloud Console.`;
};
