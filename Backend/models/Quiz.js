import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  topic: { type: String, required: true },
  title: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  totalQuestions: { type: Number, default: 0 },
  timeLimit: { type: Number, required: true }, // in minutes
  image: { type: String }
}, { timestamps: true });

export default mongoose.model('Quiz', quizSchema);
