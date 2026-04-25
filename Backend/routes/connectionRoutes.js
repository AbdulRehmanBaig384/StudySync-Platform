import express from 'express';
import {
  sendInvitation,
  getIncomingInvitations,
  getOutgoingInvitations,
  respondToInvitation,
  getMyConnections
} from '../controllers/connectionController.js';

const router = express.Router();

router.post('/send', sendInvitation);
router.get('/incoming/:userId', getIncomingInvitations);
router.get('/outgoing/:userId', getOutgoingInvitations);
router.put('/respond/:invitationId', respondToInvitation);
router.get('/connections/:userId', getMyConnections);

export default router;
