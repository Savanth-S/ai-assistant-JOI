import mongoose from "mongoose";

const chatSchema =
  new mongoose.Schema(
    {
      userId: {
        type: String,
        required: true,
      },

      conversationId: {
        type: String,
        required: true,
      },

      conversationTitle: {
        type: String,
        default: "New Chat",
      },

      sender: {
        type: String,
        required: true,
      },

      message: {
        type: String,
        required: true,
      },
    },

    {
      timestamps: true,
    }
  );

const Chat =
  mongoose.model(
    "Chat",
    chatSchema
  );

export default Chat;