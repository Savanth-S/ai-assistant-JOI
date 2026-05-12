import express from "express";

import {
  getConversations,
  getChatHistory,
  deleteConversation,
  chatWithAI,
} from "../controllers/aiController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router =
  express.Router();

// CHAT
router.post(
  "/chat",
  authMiddleware,
  chatWithAI
);

// ALL CONVERSATIONS
router.get(
  "/conversations",
  authMiddleware,
  getConversations
);

// CHAT HISTORY
router.get(
  "/history/:id",
  authMiddleware,
  getChatHistory
);

// DELETE CONVERSATION
router.delete(
  "/conversation/:id",
  authMiddleware,
  deleteConversation
);

export default router;