import express from "express";
import { chatWithTutor } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/chat", protect, chatWithTutor);

export default router;
