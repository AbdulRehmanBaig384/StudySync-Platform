import Invitation from '../models/Invitation.js';
import User from '../models/UserData.js';
import mongoose from 'mongoose';

// @desc    Send an invitation
// @route   POST /api/invite/send
export const sendInvitation = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;

    if (senderId === receiverId) {
      return res.status(400).json({ message: "You cannot send an invitation to yourself" });
    }

    // Check if invitation already exists
    const existing = await Invitation.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    });

    if (existing) {
      if (existing.status === 'rejected') {
        // If rejected, delete it so we can send a new one
        await Invitation.findByIdAndDelete(existing._id);
      } else {
        return res.status(400).json({ message: "Invitation already exists or you are already connected" });
      }
    }

    const invitation = await Invitation.create({
      sender: senderId,
      receiver: receiverId,
      message
    });

    res.status(201).json(invitation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get incoming pending invitations
// @route   GET /api/invite/incoming/:userId
export const getIncomingInvitations = async (req, res) => {
  try {
    const { userId } = req.params;
    const invitations = await Invitation.find({ receiver: userId, status: 'pending' })
      .populate('sender', 'Firstname lastname email profilePicture department facultyOfStudy');
    
    res.json(invitations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get outgoing invitations
// @route   GET /api/invite/outgoing/:userId
export const getOutgoingInvitations = async (req, res) => {
  try {
    const { userId } = req.params;
    const invitations = await Invitation.find({ sender: userId })
      .populate('receiver', 'Firstname lastname email profilePicture department facultyOfStudy');
    
    res.json(invitations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Respond to an invitation (Accept/Reject)
// @route   PUT /api/invite/respond/:invitationId
export const respondToInvitation = async (req, res) => {
  try {
    const { invitationId } = req.params;
    const { status } = req.body; // 'accepted' or 'rejected'

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const invitation = await Invitation.findById(invitationId);
    if (!invitation) {
      return res.status(404).json({ message: "Invitation not found" });
    }

    invitation.status = status;
    await invitation.save();

    // If accepted, notify both users via socket to update their messaging list
    if (status === 'accepted') {
      const io = req.app.get('io');
      const populatedInvitation = await Invitation.findById(invitationId)
        .populate('sender receiver', 'Firstname lastname email profilePicture onlineStatus department facultyOfStudy');
      
      io.emit('invitation_accepted', populatedInvitation);
    }

    res.json({ message: `Invitation ${status}`, invitation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get all accepted connections
// @route   GET /api/invite/connections/:userId
export const getMyConnections = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const connections = await Invitation.find({
      status: 'accepted',
      $or: [{ sender: userId }, { receiver: userId }]
    }).populate('sender receiver', 'Firstname lastname email profilePicture department facultyOfStudy onlineStatus');

    // Filter out the current user from each connection object to return a list of "partners"
    const partners = connections.map(conn => {
      const isSender = conn.sender._id.toString() === userId;
      return isSender ? conn.receiver : conn.sender;
    });

    res.json(partners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
