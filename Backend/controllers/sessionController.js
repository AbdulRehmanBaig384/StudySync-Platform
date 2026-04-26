import Session from '../models/Session.js';
import SessionMessage from '../models/SessionMessage.js';
import User from '../models/UserData.js';
import Invitation from '../models/Invitation.js';
import Notification from '../models/Notification.js';
import mongoose from 'mongoose';

// @desc    Get users eligible for session invitation
// @route   GET /api/session/eligible-users/:sessionId
export const getEligibleUsersForSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { userId, search } = req.query;

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    const participants = session.participants.map(p => p.toString());

    const matchQuery = {
      _id: { 
        $ne: new mongoose.Types.ObjectId(userId),
        $nin: participants.map(id => new mongoose.Types.ObjectId(id))
      }
    };

    if (search) {
      matchQuery.$or = [
        { Firstname: { $regex: search, $options: 'i' } },
        { lastname: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.aggregate([
      { $match: matchQuery },
      {
        $lookup: {
          from: 'invitations',
          let: { receiverId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$sessionId', new mongoose.Types.ObjectId(sessionId)] },
                    { $eq: ['$receiver', '$$receiverId'] }
                  ]
                }
              }
            }
          ],
          as: 'sessionInvitation'
        }
      },
      {
        $addFields: {
          invitationStatus: {
            $cond: {
              if: { $gt: [{ $size: '$sessionInvitation' }, 0] },
              then: { $arrayElemAt: ['$sessionInvitation.status', 0] },
              else: null
            }
          }
        }
      },
      {
        $match: {
          $or: [
            { invitationStatus: null },
            { invitationStatus: 'rejected' }
          ]
        }
      },
      { $limit: 20 },
      { $project: { password: 0 } }
    ]);

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Send session invitation
// @route   POST /api/session/invite
export const sendSessionInvitation = async (req, res) => {
  try {
    const { sessionId, senderId, receiverId, message } = req.body;

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    // Check for existing invitation for this session
    let invitation = await Invitation.findOne({ sessionId, receiver: receiverId });

    if (invitation) {
      if (invitation.status === 'pending') {
        return res.status(400).json({ message: "Invitation already pending" });
      }
      if (invitation.status === 'accepted') {
        return res.status(400).json({ message: "User already accepted invitation" });
      }
      // If rejected, we can delete and create new or update
      await Invitation.findByIdAndDelete(invitation._id);
    }

    invitation = await Invitation.create({
      sender: senderId,
      receiver: receiverId,
      sessionId,
      message: message || `You have been invited to join the session: ${session.name}`,
      status: 'pending'
    });

    const host = await User.findById(senderId);

    // Create Notification
    const notification = await Notification.create({
      userId: receiverId,
      sessionId,
      invitationId: invitation._id,
      type: 'invitation',
      message: `${host.Firstname} invited you to join: ${session.name}`
    });

    res.status(201).json({ invitation, notification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Respond to session invitation
// @route   PUT /api/session/invitation-response
export const respondToSessionInvitation = async (req, res) => {
  try {
    const { invitationId, status, userId } = req.body;

    const invitation = await Invitation.findById(invitationId).populate('sessionId');
    if (!invitation) return res.status(404).json({ message: "Invitation not found" });

    if (invitation.receiver.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    invitation.status = status;
    await invitation.save();

    if (status === 'accepted') {
      const session = await Session.findById(invitation.sessionId);
      if (!session.participants.includes(userId)) {
        session.participants.push(userId);
        await session.save();
      }

      const receiverUser = await User.findById(userId);

      // Notify Host
      await Notification.create({
        userId: invitation.sender,
        sessionId: invitation.sessionId,
        type: 'accepted',
        message: `${receiverUser.Firstname} accepted your invitation to: ${session.name}`
      });
    }

    // Mark notification as read
    await Notification.updateMany({ invitationId, userId }, { readStatus: true });

    res.json({ message: `Invitation ${status} successfully`, invitation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get user notifications
// @route   GET /api/session/notifications/:userId
export const getUserSessionNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId, readStatus: false })
      .populate({
        path: 'sessionId',
        populate: { path: 'host', select: 'Firstname lastname profilePicture' }
      })
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a new dynamic study session
// @route   POST /api/session/create
export const createSession = async (req, res) => {
  try {
    const { name, topic, description, maxParticipants, department, privacy, hostId, date, time } = req.body;
    
    // Combine date and time or use current if not provided
    const sessionDate = date || new Date().toISOString().split('T')[0];
    const sessionTime = time || new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const startDateTime = new Date(`${sessionDate}T${sessionTime}`);

    const session = await Session.create({
      name,
      topic,
      description,
      maxParticipants,
      department,
      privacy,
      host: hostId,
      participants: [hostId],
      date: sessionDate,
      time: sessionTime,
      startDateTime,
      status: 'upcoming',
      isActive: true
    });

    const populatedSession = await Session.findById(session._id)
      .populate('host', 'Firstname lastname email profilePicture')
      .populate('participants', 'Firstname lastname email profilePicture onlineStatus');

    res.status(201).json(populatedSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Join an existing study session
// @route   PUT /api/session/join/:sessionId
export const joinSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { userId } = req.body;
    
    const session = await Session.findById(sessionId);
    
    if (!session || !session.isActive) {
      return res.status(404).json({ message: "Session not found or inactive" });
    }

    if (session.participants.length >= session.maxParticipants) {
      return res.status(400).json({ message: "Session is full" });
    }

    if (!session.participants.includes(userId)) {
      session.participants.push(userId);
      await session.save();
    }

    const populatedSession = await Session.findById(sessionId)
      .populate('host', 'Firstname lastname email profilePicture')
      .populate('participants', 'Firstname lastname email profilePicture onlineStatus');

    res.json(populatedSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get all study sessions with updated status and sorting
// @route   GET /api/session/active
export const getActiveSessions = async (req, res) => {
  try {
    const { userId } = req.query;
    
    let query = {};
    if (userId) {
      query = {
        $or: [
          { host: userId },
          { participants: userId }
        ]
      };
    }

    const sessions = await Session.find(query)
      .populate('host', 'Firstname lastname profilePicture')
      .populate('participants', 'Firstname lastname profilePicture');

    const now = new Date();
    const today = now.toISOString().split('T')[0];

    const updatedSessions = await Promise.all(sessions.map(async (session) => {
      let status = session.status;
      const startTime = new Date(session.startDateTime);
      const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); 

      if (now < startTime) {
        status = 'upcoming';
      } else if (now >= startTime && now <= endTime) {
        status = 'active';
      } else {
        status = 'completed';
      }

      if (status !== session.status) {
        session.status = status;
        if (status === 'completed') session.isActive = false;
        await session.save();
      }

      const sessionObj = session.toObject();
      sessionObj.isTodaySession = session.date === today;
      sessionObj.timeRemaining = status === 'upcoming' 
        ? Math.max(0, Math.floor((startTime - now) / 60000))
        : 0;

      return sessionObj;
    }));

    const statusOrder = { 'upcoming': 1, 'active': 2, 'completed': 3 };
    
    updatedSessions.sort((a, b) => {
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return new Date(a.startDateTime) - new Date(b.startDateTime);
    });
    
    res.json(updatedSessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get session details
// @route   GET /api/session/:sessionId
export const getSessionDetails = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await Session.findById(sessionId)
      .populate('host', 'Firstname lastname email profilePicture')
      .populate('participants', 'Firstname lastname email profilePicture onlineStatus');
    
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    End session (Host only)
// @route   PUT /api/session/end/:sessionId
export const endSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { userId } = req.body;

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    if (session.host.toString() !== userId) {
      return res.status(403).json({ message: "Only host can end session" });
    }

    session.isActive = false;
    session.endedAt = Date.now();
    await session.save();

    res.json({ message: "Session ended successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get session messages
// @route   GET /api/session/messages/:sessionId
export const getSessionMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const messages = await SessionMessage.find({ sessionId })
      .populate('senderId', 'Firstname lastname profilePicture')
      .sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Save session message
// @route   POST /api/session/message
export const saveSessionMessage = async (req, res) => {
  try {
    const { sessionId, senderId, message } = req.body;
    
    const newMessage = await SessionMessage.create({
      sessionId,
      senderId,
      message
    });

    const populatedMessage = await SessionMessage.findById(newMessage._id)
      .populate('senderId', 'Firstname lastname profilePicture');

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
