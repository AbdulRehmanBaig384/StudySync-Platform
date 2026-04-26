import express from 'express';
import { 
  createSession, 
  joinSession, 
  getActiveSessions, 
  getSessionDetails, 
  endSession,
  getSessionMessages,
  saveSessionMessage,
  getEligibleUsersForSession,
  sendSessionInvitation,
  respondToSessionInvitation,
  getUserSessionNotifications
} from '../controllers/sessionController.js';

const router = express.Router();

router.post('/create', createSession);
router.get('/active', getActiveSessions);
router.get('/:sessionId', getSessionDetails);
router.put('/join/:sessionId', joinSession);
router.put('/end/:sessionId', endSession);
router.get('/messages/:sessionId', getSessionMessages);
router.post('/message', saveSessionMessage);

// Session Invitations & Notifications
router.get('/eligible-users/:sessionId', getEligibleUsersForSession);
router.post('/invite', sendSessionInvitation);
router.put('/invitation-response', respondToSessionInvitation);
router.get('/notifications/:userId', getUserSessionNotifications);

export default router;
