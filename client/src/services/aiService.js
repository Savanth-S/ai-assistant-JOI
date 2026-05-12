const API_URL =
  "https://ai-assistant-joi-backend.onrender.com/api/ai";

// FETCH CONVERSATIONS
export const fetchConversations =
  async (token) => {

    const res =
      await fetch(
        `${API_URL}/conversations`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return res.json();
  };

// FETCH HISTORY
export const fetchHistory =
  async (
    token,
    conversationId
  ) => {

    const res =
      await fetch(
        `${API_URL}/history/${conversationId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return res.json();
  };

// DELETE CHAT
export const deleteChat =
  async (
    token,
    id
  ) => {

    const res =
      await fetch(
        `${API_URL}/conversation/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return res.json();
  };

// STREAM CHAT
export const streamChat =
  async ({
    token,
    message,
    conversationId,
    onChunk,
  }) => {

    const res =
      await fetch(
        `${API_URL}/chat`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            message,
            conversationId,
          }),
        }
      );

    if (!res.ok) {

      throw new Error(
        "Failed to get AI response"
      );
    }

    const text =
      await res.text();

    onChunk(text);
  };