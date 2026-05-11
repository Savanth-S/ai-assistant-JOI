// server/controllers/aiController.js

import Chat from "../models/Chat.js";

import openai from "../services/openaiService.js";

import {
  generateConversationTitle,
} from "../services/chatService.js";

// GET ALL CONVERSATIONS
export const getConversations =
  async (req, res) => {

    try {

      const chats =
        await Chat.find({
          userId: req.user,
        });

      const grouped =
        {};

      chats.forEach((chat) => {

        if (
          !grouped[
            chat.conversationId
          ]
        ) {

          grouped[
            chat.conversationId
          ] = {
            id:
              chat.conversationId,

            title:
              chat.conversationTitle ||
              "New Chat",

            createdAt:
              chat.createdAt,
          };
        }
      });

      const conversations =
        Object.values(
          grouped
        ).sort(
          (a, b) =>
            new Date(
              b.createdAt
            ) -
            new Date(
              a.createdAt
            )
        );

      res.json(
        conversations
      );

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Failed to fetch conversations",
      });
    }
  };

// GET CHAT HISTORY
export const getChatHistory =
  async (req, res) => {

    try {

      const chats =
        await Chat.find({
          userId: req.user,

          conversationId:
            req.params.id,
        }).sort({
          createdAt: 1,
        });

      res.json(chats);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Failed to fetch history",
      });
    }
  };

// DELETE CONVERSATION
export const deleteConversation =
  async (req, res) => {

    try {

      await Chat.deleteMany({
        userId: req.user,

        conversationId:
          req.params.id,
      });

      res.json({
        message:
          "Conversation deleted",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Delete failed",
      });
    }
  };

// CHAT WITH AI
export const chatWithAI =
  async (req, res) => {

    try {

      console.log(
        "CHAT REQUEST RECEIVED"
      );

      const {
        message,
        conversationId,
      } = req.body;

      if (
        !message ||
        !conversationId
      ) {

        return res
          .status(400)
          .json({
            message:
              "Message and conversationId required",
          });
      }

      // CHECK EXISTING CHAT
      const existingChat =
        await Chat.findOne({
          userId: req.user,
          conversationId,
        });

      let conversationTitle =
        "New Chat";

      if (existingChat) {

        conversationTitle =
          existingChat.conversationTitle;
      }

      // SAVE USER MESSAGE
      await Chat.create({
        userId: req.user,

        conversationId,

        conversationTitle,

        sender: "user",

        message,
      });

      // LOAD HISTORY
      const previousChats =
        await Chat.find({
          userId: req.user,
          conversationId,
        })
          .sort({
            createdAt: 1,
          })
          .limit(12);

      const messages = [
        {
          role: "system",

          content:
            `
You are Joi, a futuristic AI assistant.

You are:
- smart
- modern
- conversational
- concise
- helpful
`,
        },

        ...previousChats.map(
          (chat) => ({
            role:
              chat.sender ===
              "user"
                ? "user"
                : "assistant",

            content:
              chat.message,
          })
        ),
      ];

      console.log(
        "SENDING TO OPENROUTER..."
      );

      // NORMAL RESPONSE (NOT STREAMING)
      const completion =
        await openai.chat.completions.create({
          model:
            "openai/gpt-3.5-turbo",

          messages,
        });

      const aiReply =
        completion.choices?.[0]
          ?.message?.content ||
        "No response";

      console.log(
        "AI RESPONSE:",
        aiReply
      );

      // SAVE AI MESSAGE
      await Chat.create({
        userId: req.user,

        conversationId,

        conversationTitle,

        sender: "ai",

        message: aiReply,
      });

      // SEND RESPONSE
      res.send(aiReply);

      // GENERATE TITLE
      if (!existingChat) {

        setTimeout(async () => {

          try {

            const chats =
              await Chat.find({
                userId: req.user,
                conversationId,
              })
                .sort({
                  createdAt: 1,
                })
                .limit(6);

            const titleMessages =
              chats.map(
                (chat) => ({
                  role:
                    chat.sender ===
                    "user"
                      ? "user"
                      : "assistant",

                  content:
                    chat.message,
                })
              );

            const smartTitle =
              await generateConversationTitle(
                titleMessages
              );

            await Chat.updateMany(
              {
                userId: req.user,
                conversationId,
              },
              {
                conversationTitle:
                  smartTitle,
              }
            );

          } catch (error) {

            console.log(error);
          }

        }, 1500);
      }

    } catch (error) {

      console.log(
        "CHAT ERROR:",
        error
      );

      res.status(500).json({
        message:
          "AI response failed",
      });
    }
  };