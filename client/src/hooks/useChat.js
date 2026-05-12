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

  const [conversationId,
    setConversationId] =
    useState(
      Date.now().toString()
    );

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
      [token]
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

        // REMOVE FROM UI
        const updated =
          conversations.filter(
            (conv) =>
              conv.id !== id
          );

        setConversations(
          updated
        );

        // CLEAR CURRENT CHAT
        if (
          conversationId === id
        ) {

          const newId =
            Date.now().toString();

          setConversationId(
            newId
          );

          setChat([]);
        }

      } catch (error) {

        console.log(
          "DELETE ERROR:",
          error
        );
      }
    };

  const newConversation =
    () => {

      const newId =
        Date.now().toString();

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