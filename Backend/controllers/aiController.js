import {generateTutorReply} from "../services/geminiService.js";

export const chatWithTutor=async(req,res)=>{
  try{
    const {message}=req.body;

    if(!message || !message.trim()){
      return res.status(400).json({message:"Message is required" });}
    
    const reply=await generateTutorReply(message);
    
    return res.status(200).json({
      reply,
      model:process.env.GEMINI_MODEL||"gemini-pro",
    });
  } catch(error){
    console.error("Gemini chat error:",error);
    return res.status(500).json({ message:"Failed to get AI response"});
  }
};
