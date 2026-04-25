import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  topic: {
    type: String,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  maxParticipants: {
    type: Number,
    default: 10
  },
  department: {
    type: String
  },
  privacy: {
    type: String,
    enum: ['public', 'invite'],
    default: 'public'
  },
  invitationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invitation'
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  endedAt: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Session = mongoose.model('Session', sessionSchema);

export default Session;
