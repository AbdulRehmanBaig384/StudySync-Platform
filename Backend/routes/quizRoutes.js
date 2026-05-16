import express from 'express';
import { 
  getCourses, 
  getTopicsByCourse, 
  getQuizzesByTopic, 
  getQuizQuestions, 
  submitQuiz,
  getUserResults,
  generatePracticeQuiz,
  submitPracticeQuiz,
  getPracticeHistory
} from '../controllers/quizController.js';

const router = express.Router();

router.get('/courses', getCourses);
router.get('/courses/:courseId/topics', getTopicsByCourse);
router.get('/topics/:topic/quizzes', getQuizzesByTopic);
router.get('/:quizId/questions', getQuizQuestions);
router.post('/:quizId/submit', submitQuiz);
router.get('/results/:userId', getUserResults);

// Practice Sessions (Groq Powered)
router.post('/practice/generate', generatePracticeQuiz);
router.post('/practice/:sessionId/submit', submitPracticeQuiz);
router.get('/practice/history/:userId', getPracticeHistory);

export default router;
