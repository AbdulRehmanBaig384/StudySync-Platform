import express from 'express';
import { startSession, joinSession, endSession } from '../controllers/sessionController.js';

const router = express.Router();

router.post('/start', startSession);
router.put('/join', joinSession);
router.put('/end', endSession);

export default router;
