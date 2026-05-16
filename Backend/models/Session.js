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
  date: {
    type: String, // format: YYYY-MM-DD
    required: true
  },
  time: {
    type: String, // format: HH:mm
    required: true
  },
  startDateTime: {
    type: Date,
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed'],
    default: 'upcoming',
    index: true
  },
  invitedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  whiteboardData: {
    type: Object,
    default: {}
  },
  sharedResources: [{
    title: String,
    type: { type: String }, // pdf, doc, etc.
    url: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  startedAt: {
    type: Date
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
