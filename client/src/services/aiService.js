const API =
  "https://ai-assistant-joi-backend.onrender.com/api";

export const fetchConversations =
  async (token) => {

    const res = await fetch(
      `${API}/conversations`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    return res.json();
  };

export const fetchHistory =
  async (
    token,
    conversationId
  ) => {

    const res = await fetch(
      `${API}/history/${conversationId}`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    return res.json();
  };

export const deleteChat =
  async (
    token,
    conversationId
  ) => {

    return fetch(
      `${API}/conversation/${conversationId}`,
      {
        method: "DELETE",

        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );
  };

export const streamChat =
  async ({
    token,
    message,
    conversationId,
    onChunk,
  }) => {

    const response =
      await fetch(
        `${API}/chat`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body:
            JSON.stringify({
              message,
              conversationId,
            }),
        }
      );

    if (!response.ok) {

      throw new Error(
        "Streaming failed"
      );
    }

    const reader =
      response.body.getReader();

    const decoder =
      new TextDecoder();

    let fullText = "";

    while (true) {

      const {
        done,
        value,
      } = await reader.read();

      if (done) break;

      const chunk =
        decoder.decode(value);

      fullText += chunk;

      await new Promise(
        (resolve) =>
          setTimeout(
            resolve,
            20
          )
      );

      onChunk(fullText);
    }

    return fullText;
  };