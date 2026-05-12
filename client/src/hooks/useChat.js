import {
  useEffect,
  useState,
  useCallback,
} from "react";

import {
  fetchConversations,
  fetchHistory,
  deleteChat,
  streamChat,
} from "../services/aiService";

import {
  uploadFile,
} from "../services/fileService";

function useChat(
  speakText
) {

  const token =
    localStorage.getItem(
      "token"
    );

  const [message,
    setMessage] =
    useState("");

  const [chat,
    setChat] =
    useState([]);

  const [loading,
    setLoading] =
    useState(false);

  // FIXED
  const [conversationId,
    setConversationId] =
    useState(() => {

      return (
        localStorage.getItem(
          "currentConversationId"
        ) ||
        Date.now().toString()
      );
    });

  const [conversations,
    setConversations] =
    useState([]);

  const [conversationFiles,
    setConversationFiles] =
    useState({});

  const uploadedFile =
    conversationFiles[
      conversationId
    ];

  // SAVE CURRENT CONVERSATION
  useEffect(() => {

    localStorage.setItem(
      "currentConversationId",
      conversationId
    );

  }, [conversationId]);

  // FIXED
  const loadConversations =
    useCallback(
      async () => {

        try {

          const data =
            await fetchConversations(
              token
            );

          if (
            Array.isArray(data)
          ) {

            setConversations(
              data
            );

            // RESTORE SAVED CHAT ONLY
            const savedConversation =
              localStorage.getItem(
                "currentConversationId"
              );

            if (
              savedConversation &&
              data.find(
                (conv) =>
                  conv.id ===
                  savedConversation
              )
            ) {

              setConversationId(
                savedConversation
              );
            }

          } else {

            console.log(
              "Invalid conversations data:",
              data
            );

            setConversations(
              []
            );
          }

        } catch (error) {

          console.log(error);

          setConversations(
            []
          );
        }
      },
      [
        token,
      ]
    );

  const loadHistory =
    useCallback(
      async (id) => {

        try {

          const data =
            await fetchHistory(
              token,
              id
            );

          if (
            Array.isArray(data)
          ) {

            const formatted =
              data.map(
                (chat) => ({
                  sender:
                    chat.sender,

                  text:
                    chat.message,
                })
              );

            setChat(
              formatted
            );

          } else {

            console.log(
              "Invalid history data:",
              data
            );

            setChat([]);
          }

        } catch (error) {

          console.log(error);

          setChat([]);
        }
      },
      [token]
    );

  useEffect(() => {

    if (token) {

      loadConversations();
    }

  }, [
    loadConversations,
    token,
  ]);

  useEffect(() => {

    if (conversationId) {

      loadHistory(
        conversationId
      );
    }

  }, [
    conversationId,
    loadHistory,
  ]);

  const handleFileUpload =
    async (file) => {

      try {

        const data =
          await uploadFile(
            token,
            file
          );

        setConversationFiles(
          (prev) => ({
            ...prev,

            [conversationId]: {
              filename:
                data.file.filename,

              originalname:
                data.file.originalname,

              content:
                data.file.content,
            },
          })
        );

        setChat((prev) => [
          ...prev,
          {
            sender: "user",

            text:
              `📎 Uploaded: ${file.name}`,
          },
        ]);

      } catch (error) {

        console.log(error);
      }
    };

  const sendMessage =
    async () => {

      if (
        !message.trim()
      ) return;

      const currentMessage =
        message;

      setMessage("");

      setLoading(true);

      setChat((prev) => [
        ...prev,
        {
          sender: "user",

          text:
            currentMessage,
        },
        {
          sender: "ai",

          text: "",
        },
      ]);

      let finalResponse =
        "";

      try {

        await streamChat({
          token,

          message:
            uploadedFile
              ? `
User Message:
${currentMessage}

Uploaded File Name:
${uploadedFile.originalname}

Uploaded File Content:
${uploadedFile.content}
`
              : currentMessage,

          conversationId,

          onChunk:
            (fullText) => {

              finalResponse =
                fullText;

              setChat(
                (prev) => {

                  const updated =
                    [...prev];

                  updated[
                    updated.length - 1
                  ] = {
                    sender: "ai",

                    text:
                      fullText,
                  };

                  return updated;
                }
              );
            },
        });

        if (
          speakText &&
          finalResponse
        ) {

          speakText(
            finalResponse
          );
        }

        setLoading(false);

        loadConversations();

      } catch (error) {

        console.log(error);

        setLoading(false);
      }
    };

  // FIXED DELETE
  const deleteConversation =
    async (
      e,
      id
    ) => {

      e.stopPropagation();

      try {

        await deleteChat(
          token,
          id
        );

        const updated =
          conversations.filter(
            (conv) =>
              conv.id !== id
          );

        setConversations(
          updated
        );

        localStorage.removeItem(
          "currentConversationId"
        );

        if (
          conversationId === id
        ) {

          if (
            updated.length > 0
          ) {

            setConversationId(
              updated[0].id
            );

          } else {

            const newId =
              Date.now().toString();

            setConversationId(
              newId
            );

            setChat([]);
          }
        }

      } catch (error) {

        console.log(
          "DELETE ERROR:",
          error
        );
      }
    };

  // FIXED NEW CHAT
  const newConversation =
    () => {

      const newId =
        Date.now().toString();

      localStorage.setItem(
        "currentConversationId",
        newId
      );

      setConversationId(
        newId
      );

      setChat([]);
    };

  const handleKeyDown =
    (e) => {

      if (
        e.key === "Enter" &&
        !e.shiftKey
      ) {

        e.preventDefault();

        sendMessage();
      }
    };

  return {
    message,
    setMessage,
    chat,
    loading,
    conversations,
    conversationId,
    setConversationId,
    sendMessage,
    newConversation,
    deleteConversation,
    handleKeyDown,
    uploadedFile,
    handleFileUpload,
  };
}

export default useChat;