import express from "express";

import {
  getConversations,
  getChatHistory,
  deleteConversation,
  chatWithAI,
} from "../controllers/aiController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router =
  express.Router();

// CHAT
router.post(
  "/chat",
  protect,
  chatWithAI
);

// ALL CONVERSATIONS
router.get(
  "/conversations",
  protect,
  getConversations
);

// CHAT HISTORY
router.get(
  "/history/:id",
  protect,
  getChatHistory
);

// DELETE CONVERSATION
router.delete(
  "/conversation/:id",
  protect,
  deleteConversation
);

export default router;