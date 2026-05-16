import mongoose from 'mongoose';

const practiceSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  topic: { type: String, required: true },
  difficulty: { type: String, required: true },
  totalQuestions: { type: Number, required: true },
  questions: [{
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
    explanation: { type: String }
  }],
  selectedAnswers: { type: Array }, // Store indexes of selected answers
  score: { type: Number },
  correctCount: { type: Number },
  wrongCount: { type: Number },
  percentage: { type: Number },
  passed: { type: Boolean }
}, { timestamps: true });

export default mongoose.model('PracticeSession', practiceSessionSchema);
