import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getOrCreateConversation,
  getMessages,
} from "../controllers/chat.controller.js";
import Conversation from "../models/Conversation.js";

const router = express.Router();

/* =========================
   GET CONVERSATION DETAILS
========================= */
router.get("/:conversationId/details", protectRoute, async (req, res) => {
  const conversation = await Conversation.findById(req.params.conversationId)
    .populate("members", "fullName profilePic");

  if (!conversation) {
    return res.status(404).json({ message: "Conversation not found" });
  }

  res.json(conversation);
});

/* =========================
   GET MESSAGES
========================= */
router.get("/:conversationId/messages", protectRoute, getMessages);

/* =========================
   CREATE / GET CONVERSATION
========================= */
router.post("/", protectRoute, getOrCreateConversation);

export default router;
