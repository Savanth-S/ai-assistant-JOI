import {
  useEffect,
  useState,
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

  // STORE FILES PER CHAT
  const [conversationFiles,
    setConversationFiles] =
    useState({});

  // CURRENT CHAT FILE
  const uploadedFile =
    conversationFiles[
      conversationId
    ];

  // LOAD CONVERSATIONS
  useEffect(() => {

    if (token) {

      loadConversations();
    }

  }, []);

  // LOAD HISTORY
  useEffect(() => {

    if (conversationId) {

      loadHistory(
        conversationId
      );
    }

  }, [conversationId]);

  // FETCH CONVERSATIONS
  const loadConversations =
    async () => {

      try {

        const data =
          await fetchConversations(
            token
          );

        setConversations(
          data
        );

      } catch (error) {

        console.log(error);
      }
    };

  // FETCH HISTORY
  const loadHistory =
    async (id) => {

      try {

        const data =
          await fetchHistory(
            token,
            id
          );

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

      } catch (error) {

        console.log(error);
      }
    };

  // FILE UPLOAD
  const handleFileUpload =
    async (file) => {

      try {

        const data =
          await uploadFile(
            token,
            file
          );

        // SAVE FILE TO THIS CHAT
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

  // SEND MESSAGE
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

  // DELETE CHAT
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

        // REMOVE FILE TOO
        setConversationFiles(
          (prev) => {

            const copy =
              { ...prev };

            delete copy[id];

            return copy;
          }
        );

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

        console.log(error);
      }
    };

  // NEW CHAT
  const newConversation =
    () => {

      const newId =
        Date.now().toString();

      setConversationId(
        newId
      );

      setChat([]);
    };

  // ENTER SEND
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