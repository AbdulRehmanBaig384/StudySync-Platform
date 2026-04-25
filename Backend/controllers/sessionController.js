import Session from '../models/Session.js';
import SessionMessage from '../models/SessionMessage.js';

// @desc    Create a new dynamic study session
// @route   POST /api/session/create
export const createSession = async (req, res) => {
  try {
    const { name, topic, description, maxParticipants, department, privacy, hostId } = req.body;
    
    const session = await Session.create({
      name,
      topic,
      description,
      maxParticipants,
      department,
      privacy,
      host: hostId,
      participants: [hostId],
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

// @desc    Get all active study sessions
// @route   GET /api/session/active
export const getActiveSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ isActive: true })
      .populate('host', 'Firstname lastname profilePicture')
      .populate('participants', 'Firstname lastname profilePicture')
      .sort({ createdAt: -1 });
    
    res.json(sessions);
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
