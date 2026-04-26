import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
import Course from './models/Course.js';
import Quiz from './models/Quiz.js';
import Question from './models/Question.js';

configDotenv({ path: './.env' });

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Course.deleteMany();
    await Quiz.deleteMany();
    await Question.deleteMany();

    // Create Courses
    const webDev = await Course.create({
      title: 'Web Development',
      category: 'Computer Science',
      description: 'Master the art of building modern websites.',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085'
    });

    const dsa = await Course.create({
      title: 'Data Structures & Algorithms',
      category: 'Computer Science',
      description: 'The foundation of efficient programming.',
      image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4'
    });

    // Create Quizzes for Web Dev
    const jsQuiz = await Quiz.create({
      courseId: webDev._id,
      topic: 'JavaScript',
      title: 'JS Arrays & Methods',
      difficulty: 'Medium',
      totalQuestions: 2,
      timeLimit: 10,
      image: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a'
    });

    // Create Questions for JS Quiz
    await Question.create([
      {
        quizId: jsQuiz._id,
        question: 'Which method is used to add an element at the end of an array?',
        options: ['push()', 'pop()', 'shift()', 'unshift()'],
        correctAnswer: 0,
        explanation: 'The push() method adds one or more elements to the end of an array and returns the new length.'
      },
      {
        quizId: jsQuiz._id,
        question: 'What does map() return?',
        options: ['A new array', 'The same array', 'A boolean', 'An object'],
        correctAnswer: 0,
        explanation: 'map() creates a new array populated with the results of calling a provided function on every element in the calling array.'
      }
    ]);

    // Create Quizzes for DSA
    const stackQuiz = await Quiz.create({
      courseId: dsa._id,
      topic: 'Stacks',
      title: 'Stack Operations',
      difficulty: 'Easy',
      totalQuestions: 2,
      timeLimit: 5,
      image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904'
    });

    await Question.create([
      {
        quizId: stackQuiz._id,
        question: 'What principle does a stack follow?',
        options: ['LIFO', 'FIFO', 'Random', 'None'],
        correctAnswer: 0,
        explanation: 'A stack follows the Last-In-First-Out (LIFO) principle.'
      },
      {
        quizId: stackQuiz._id,
        question: 'Which operation is used to remove the top element of a stack?',
        options: ['push', 'pop', 'peek', 'enqueue'],
        correctAnswer: 1,
        explanation: 'The pop operation removes the element that was most recently added (the top).'
      }
    ]);

    console.log('Seed data created successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
