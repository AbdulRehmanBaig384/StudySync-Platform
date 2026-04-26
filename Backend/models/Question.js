import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true }, // Index 0-3
  explanation: { type: String }
}, { timestamps: true });

export default mongoose.model('Question', questionSchema);
