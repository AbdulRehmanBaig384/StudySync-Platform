import mongoose from 'mongoose';

const quizResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  selectedAnswers: { type: Map, of: Number }, // { "0": 1, "1": 2 ... }
  score: { type: Number, required: true },
  correctCount: { type: Number, required: true },
  wrongCount: { type: Number, required: true },
  percentage: { type: Number, required: true },
  passed: { type: Boolean },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('QuizResult', quizResultSchema);
