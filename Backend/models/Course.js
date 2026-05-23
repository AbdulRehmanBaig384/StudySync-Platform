import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {type:String,required:true },
  category: { type: String, required: true },
  description: { type: String },
  image: { type: String }
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);
