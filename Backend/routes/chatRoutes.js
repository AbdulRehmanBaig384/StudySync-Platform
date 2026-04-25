import express from 'express';
import { getChats, getMessages, saveMessage, markAsSeen } from '../controllers/chatController.js';

const router = express.Router();

router.get('/:userId', getChats);
router.get('/messages/:invitationId', getMessages);
router.post('/message', saveMessage);
router.put('/seen/:invitationId', markAsSeen);

export default router;
