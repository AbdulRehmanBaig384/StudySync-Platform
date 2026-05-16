import Course from '../models/Course.js';
import Quiz from '../models/Quiz.js';
import Question from '../models/Question.js';
import QuizResult from '../models/QuizResult.js';
import PracticeSession from '../models/PracticeSession.js';
import axios from 'axios';

export const generatePracticeQuiz = async (req, res) => {
  try {
    const { topic, number, difficulty, userId } = req.body;
    const apiKey = process.env.GEMINI_KEY_QUIZ_GENERATOR;

    if (!apiKey) {
      console.error("GEMINI_KEY_QUIZ_GENERATOR is missing in .env");
      return res.status(500).json({ message: "Quiz generation is currently unavailable (API Key missing)." });
    }

    const prompt = `
    Generate ${number} multiple choice questions on topic "${topic}" with difficulty "${difficulty}".

    Return ONLY a valid JSON array of objects. No extra text, no markdown code blocks like \`\`\`json.

    Each object MUST have this structure:
    {
      "question": "Question text here",
      "options": { "A": "option1", "B": "option2", "C": "option3", "D": "option4" },
      "answer": "A",
      "explanation": "why this answer is correct"
    }`;

    const versions = ["v1", "v1beta"];
    const models = ["gemini-2.5-flash", "gemini-3.1-pro", "gemini-3-flash", "gemini-2.5-pro"];
    
    let lastError = "";
    let content = "";
    let success = false;

    for (const version of versions) {
      for (const model of models) {
        if (success) break;
        try {
          console.log(`Attempting Quiz Generation: ${version} / ${model}`);
          const response = await fetch(
            `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
              }),
            }
          );

          const data = await response.json();
          if (response.ok) {
            content = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
            if (content) {
              success = true;
              break;
            }
          } else {
            lastError = data.error?.message || response.statusText;
            console.warn(`Failed ${version}/${model}: ${lastError}`);
          }
        } catch (err) {
          lastError = err.message;
          console.error(`Fetch Error ${version}/${model}:`, lastError);
        }
      }
      if (success) break;
    }

    if (!success) {
      return res.status(500).json({ message: `AI Quiz Error: All connection attempts failed. Last error: ${lastError}` });
    }

    let quizData;
    try {
      let cleanContent = content;
      if (cleanContent.includes("```")) {
        cleanContent = cleanContent.replace(/```json|```/g, "").trim();
      }

      const parsed = JSON.parse(cleanContent);
      const rawQuestions = Array.isArray(parsed) ? parsed : (parsed.questions || []);
      
      quizData = rawQuestions.map(q => {
        const optionsArray = [q.options.A, q.options.B, q.options.C, q.options.D];
        return {
          question: q.question,
          options: optionsArray,
          correctAnswer: q.options[q.answer], 
          explanation: q.explanation
        };
      });

      if (quizData.length === 0) throw new Error("No questions generated");
    } catch (e) {
      console.error("Gemini Parse Error:", e, content);
      return res.status(500).json({ message: "Failed to parse quiz from AI. Please try again." });
    }

    const practiceSession = new PracticeSession({
      userId,
      topic,
      difficulty,
      totalQuestions: number,
      questions: quizData
    });

    await practiceSession.save();

    res.json({
      sessionId: practiceSession._id,
      questions: quizData.map(q => ({
        question: q.question,
        options: q.options
      }))
    });

  } catch (error) {
    console.error("Quiz Controller Catch Block:", error.message);
    res.status(500).json({ message: "Server error during quiz generation" });
  }
};

export const submitPracticeQuiz = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { selectedAnswers } = req.body; 

    const session = await PracticeSession.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    let correctCount = 0;
    let wrongCount = 0;
    const detailedResults = [];

    session.questions.forEach((q, index) => {
      const selected = selectedAnswers[index];
      const isCorrect = selected === q.correctAnswer;

      if (isCorrect) correctCount++;
      else wrongCount++;

      detailedResults.push({
        question: q.question,
        options: q.options,
        selectedAnswer: selected,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation
      });
    });

    const percentage = (correctCount / session.questions.length) * 100;
    const score = correctCount;
    const passed = percentage >= 50;

    session.selectedAnswers = selectedAnswers;
    session.score = score;
    session.correctCount = correctCount;
    session.wrongCount = wrongCount;
    session.percentage = percentage;
    session.passed = passed;

    await session.save();

    res.json({
      score,
      total: session.questions.length,
      correctCount,
      wrongCount,
      percentage,
      passed,
      detailedResults
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPracticeHistory = async (req, res) => {
  try {
    const sessions = await PracticeSession.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTopicsByCourse = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ courseId: req.params.courseId }).distinct('topic');
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getQuizzesByTopic = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ topic: req.params.topic });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getQuizQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ quizId: req.params.quizId }).select('-correctAnswer');
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { userId, selectedAnswers } = req.body;
    const { quizId } = req.params;

    const questions = await Question.find({ quizId });
    const quiz = await Quiz.findById(quizId);

    let correctCount = 0;
    let wrongCount = 0;
    const detailedResults = [];

    questions.forEach((q, index) => {
      const selected = selectedAnswers[index];
      const isCorrect = selected === q.correctAnswer;

      if (isCorrect) correctCount++;
      else wrongCount++;

      detailedResults.push({
        question: q.question,
        options: q.options,
        selectedAnswer: selected,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation
      });
    });

    const percentage = (correctCount / questions.length) * 100;
    const score = correctCount; 
    const passed = percentage >= 50;

    const result = new QuizResult({
      userId,
      quizId,
      selectedAnswers,
      score,
      correctCount,
      wrongCount,
      percentage,
      passed
    });

    await result.save();

    res.json({
      score,
      total: questions.length,
      correctCount,
      wrongCount,
      percentage,
      passed,
      detailedResults
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserResults = async (req, res) => {
  try {
    const results = await QuizResult.find({ userId: req.params.userId })
      .populate('quizId', 'title topic')
      .sort({ submittedAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
