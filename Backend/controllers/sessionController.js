import Session from '../models/Session.js';

// @desc    Start a new study session
// @route   POST /api/session/start
export const startSession = async (req, res) => {
  try {
    const { invitationId, userId } = req.body;
    
    // Deactivate any previous active sessions for this invitation
    await Session.updateMany({ invitationId, isActive: true }, { isActive: false, endedAt: Date.now() });

    const session = await Session.create({
      invitationId,
      participants: [userId],
      isActive: true
    });

    res.status(201).json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Join an active study session
// @route   PUT /api/session/join
export const joinSession = async (req, res) => {
  try {
    const { invitationId, userId } = req.body;
    
    const session = await Session.findOne({ invitationId, isActive: true });
    if (!session) {
      return res.status(404).json({ message: "No active session found" });
    }

    if (!session.participants.includes(userId)) {
      session.participants.push(userId);
      await session.save();
    }

    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    End a study session
// @route   PUT /api/session/end
export const endSession = async (req, res) => {
  try {
    const { invitationId } = req.body;
    
    await Session.updateMany(
      { invitationId, isActive: true },
      { isActive: false, endedAt: Date.now() }
    );

    res.json({ message: "Session ended" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
