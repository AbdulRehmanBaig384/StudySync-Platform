import express from 'express';
import { registerUser, loginUser, googleLogin, completeProfile, updateStudyTime, getStudyStats, getUserProfile, getStudyPartners } from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/google-login', googleLogin);
router.put('/complete-profile', completeProfile);
router.get('/profile', getUserProfile);
router.get('/partners', getStudyPartners);

router.put('/update-study-time', updateStudyTime);
router.get('/study-stats', getStudyStats);

export default router;
