import Invitation from '../models/Invitation.js';
import Message from '../models/Message.js';

// @desc    Get all chats (accepted invitations) for a user
// @route   GET /api/chat/:userId
export const getChats = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find accepted invitations where the user is either sender or receiver
    const connections = await Invitation.find({
      status: 'accepted',
      $or: [{ sender: userId }, { receiver: userId }]
    })
    .populate('sender receiver', 'Firstname lastname email profilePicture onlineStatus department facultyOfStudy');

    // Get last message for each invitation to show in sidebar
    const chatsWithLastMessage = await Promise.all(connections.map(async (conn) => {
      const lastMessage = await Message.findOne({ invitationId: conn._id })
        .sort({ createdAt: -1 });
      
      // Add unread count
      const unreadCount = await Message.countDocuments({
        invitationId: conn._id,
        senderId: { $ne: userId },
        seen: false
      });

      return {
        ...conn.toObject(),
        lastMessage,
        unreadCount
      };
    }));

    // Sort by last message time or update time
    chatsWithLastMessage.sort((a, b) => {
      const timeA = a.lastMessage ? new Date(a.lastMessage.createdAt) : new Date(a.updatedAt);
      const timeB = b.lastMessage ? new Date(b.lastMessage.createdAt) : new Date(b.updatedAt);
      return timeB - timeA;
    });

    res.json(chatsWithLastMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get messages for a specific invitation/chat
// @route   GET /api/chat/messages/:invitationId
export const getMessages = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const messages = await Message.find({ invitationId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Save a new message
// @route   POST /api/chat/message
export const saveMessage = async (req, res) => {
  try {
    const { invitationId, senderId, text } = req.body;
    
    // Verify invitation exists and is accepted
    const invitation = await Invitation.findById(invitationId);
    if (!invitation || invitation.status !== 'accepted') {
      return res.status(403).json({ message: "Not authorized to message this user" });
    }

    const message = await Message.create({
      invitationId,
      senderId,
      text
    });

    // We can update the invitation's updatedAt to trigger sorting
    await Invitation.findByIdAndUpdate(invitationId, { updatedAt: Date.now() });

    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Mark messages as seen
// @route   PUT /api/chat/seen/:invitationId
export const markAsSeen = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const { userId } = req.body;

    await Message.updateMany(
      { invitationId, senderId: { $ne: userId }, seen: false },
      { $set: { seen: true } }
    );

    res.json({ message: "Messages marked as seen" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
