import Chat from "../models/Chat.js";

import openai from "./openaiService.js";

// GET CHAT HISTORY
export const getChatHistory =
  async (
    userId,
    conversationId
  ) => {

    const chats =
      await Chat.find({
        userId,
        conversationId,
      })
        .sort({
          createdAt: 1,
        })
        .limit(12);

    return chats.map(
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
  };

// SAVE MESSAGE
export const saveMessage =
  async ({
    userId,
    conversationId,
    conversationTitle,
    sender,
    message,
  }) => {

    return Chat.create({
      userId,
      conversationId,
      conversationTitle,
      sender,
      message,
    });
  };

// SMART TITLE GENERATION
export const generateConversationTitle =
  async (messages) => {

    try {

      const formatted =
        messages
          .map(
            (msg) =>
              `${msg.role}: ${msg.content}`
          )
          .join("\n");

      const completion =
        await openai.chat.completions.create({
          model:
            "openai/gpt-3.5-turbo",

          messages: [
            {
              role: "system",

              content:
                `
Generate a highly accurate short chat title.

Rules:
- maximum 5 words
- no quotes
- no punctuation
- highly relevant
- summarize the REAL topic
- avoid vague titles
- use concrete wording
`,
            },

            {
              role: "user",

              content:
                formatted,
            },
          ],
        });

      return completion
        .choices?.[0]?.message?.content
        ?.trim() ||
        "New Chat";

    } catch (error) {

      console.log(error);

      return "New Chat";
    }
  };