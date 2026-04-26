import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session'
  },
  invitationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invitation'
  },
  type: {
    type: String,
    enum: ['invitation', 'accepted', 'reminder'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  readStatus: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
