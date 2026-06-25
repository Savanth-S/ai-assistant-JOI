import "./Chat.css";

import {
  useEffect,
  useState,
} from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import MessageList from "../components/MessageList";
import ChatInput from "../components/ChatInput";

import useChat from "../hooks/useChat";
import { useVoice } from "../hooks/useVoice";

function Chat() {
  const [
    assistantName,
    setAssistantName,
  ] = useState("Persona");

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  useEffect(() => {
    const savedName =
      localStorage.getItem(
        "assistantName"
      );

    if (
      savedName &&
      savedName !== "undefined" &&
      savedName !== "null"
    ) {
      setAssistantName(
        savedName
      );
    } else {
      localStorage.setItem(
        "assistantName",
        "Persona"
      );
    }
  }, []);

  const {
    listening,
    startListening,
    stopListening,
    browserSupportsSpeechRecognition,
    speaking,
    voices,
    selectedVoice,
    setSelectedVoice,
    voiceEnabled,
    setVoiceEnabled,
    speakText,
  } = useVoice(() => {});

  const {
    message,
    setMessage,
    chat,
    loading,
    conversations,
    setConversationId,
    sendMessage,
    newConversation,
    deleteConversation,
    handleKeyDown,
    handleFileUpload,
  } = useChat(speakText);

  useVoice(setMessage);

  const logout = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    window.location.href =
      "/login";
  };

  return (
    <div className="chat-page">
      <Sidebar
        sidebarOpen={
          sidebarOpen
        }
        setSidebarOpen={
          setSidebarOpen
        }
        conversations={
          conversations
        }
        setConversationId={
          setConversationId
        }
        deleteConversation={
          deleteConversation
        }
        newConversation={
          newConversation
        }
        voices={voices}
        selectedVoice={
          selectedVoice
        }
        setSelectedVoice={
          setSelectedVoice
        }
        voiceEnabled={
          voiceEnabled
        }
        setVoiceEnabled={
          setVoiceEnabled
        }
        logout={logout}
      />

      <div className="chat-container">
        <button
          className="mobile-menu-btn"
          onClick={() =>
            setSidebarOpen(true)
          }
        >
          ☰
        </button>

        <Header
          speaking={speaking}
          assistantName={
            assistantName
          }
        />

        <MessageList
          chat={chat}
          loading={loading}
          assistantName={
            assistantName
          }
        />

        <ChatInput
          message={message}
          setMessage={
            setMessage
          }
          sendMessage={
            sendMessage
          }
          handleKeyDown={
            handleKeyDown
          }
          listening={
            listening
          }
          startListening={
            startListening
          }
          stopListening={
            stopListening
          }
          browserSupportsSpeechRecognition={
            browserSupportsSpeechRecognition
          }
          onFileSelect={
            handleFileUpload
          }
        />
      </div>
    </div>
  );
}

export default Chat;