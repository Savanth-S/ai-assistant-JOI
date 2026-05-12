import express from "express";

import User from "../models/User.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router =
  express.Router();

// SETUP ASSISTANT
router.put(
  "/setup-assistant",

  authMiddleware,

  async (req, res) => {

    try {

      const {
        assistantName,
        assistantPersonality,
      } = req.body;

      const user =
        await User.findByIdAndUpdate(

          req.user.id,

          {
            assistantName,
            assistantPersonality,
          },

          {
            new: true,
          }
        );

      res.json({

        message:
          "Assistant updated",

        user,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Server error",
      });
    }
  }
);

export default router;