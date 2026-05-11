import {
  Send,
  Mic,
  MicOff,
} from "lucide-react";

import FileUpload from "./FileUpload";

function ChatInput({
  message,
  setMessage,
  sendMessage,
  handleKeyDown,
  listening,
  startListening,
  stopListening,
  browserSupportsSpeechRecognition,
  onFileSelect,
  loading,
}) {

  return (

    <div className="input-container">

      {/* FILE */}

      <FileUpload
        onFileSelect={
          onFileSelect
        }
      />

      {/* TEXTAREA */}

      <textarea
        value={message}

        onChange={(e) =>
          setMessage(
            e.target.value
          )
        }

        onKeyDown={
          handleKeyDown
        }

        placeholder="Ask Joi anything..."

        rows={1}
      />

      {/* VOICE */}

      <button
        className={`voice-btn ${
          listening
            ? "active"
            : ""
        }`}

        onClick={
          listening
            ? stopListening
            : startListening
        }

        disabled={
          !browserSupportsSpeechRecognition
        }
      >

        {listening ? (
          <MicOff size={20} />
        ) : (
          <Mic size={20} />
        )}

      </button>

      {/* SEND */}

      <button
        className="send-btn"

        onClick={
          sendMessage
        }

        disabled={loading}
      >

        <Send size={20} />

      </button>

    </div>
  );
}

export default ChatInput;