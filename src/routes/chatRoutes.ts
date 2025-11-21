import express from "express";
import { createChat, sendMessage, getChats, getChatById, deleteChat } from "../controllers/chatController";
import { requireAuth } from "../middleware/user"; // <-- your middleware

const router = express.Router();

// Create new chat
router.post("/new", requireAuth, createChat);

// Send message to AI + save both sides
router.post("/send", requireAuth, sendMessage);

// Get list of chat summaries for logged in user
router.get("/list", requireAuth, getChats);

// Get full chat by ID
router.get("/:id", requireAuth, getChatById);

// Delete chat by ID
router.delete("/:id", requireAuth, deleteChat );

export default router;
