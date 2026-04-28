import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  invitationId:{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'Invitation',
    required: true,
  },
  senderId: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true},
  
  text:{
    type:String,
    required:true
  },
  messageType:{
    type:String,
    enum: ['text'] ,
    default: 'text'
  },
  seen: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});
const Message = mongoose.model('Message', messageSchema);
export default Message;
