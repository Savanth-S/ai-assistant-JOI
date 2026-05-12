import "./ChatInput.css";

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
}) {

  return (

    <div className="input-container">

      <label className="file-upload-btn">

        📎

        <input
          type="file"
          hidden
          onChange={onFileSelect}
        />

      </label>

      <textarea
        value={message}

        onChange={(e) =>
          setMessage(
            e.target.value
          )
        }

        onKeyDown={handleKeyDown}

        placeholder="Message Atrium..."
      />

      {browserSupportsSpeechRecognition && (

        <button
          className={`voice-btn ${
            listening
              ? "active"
              : ""
          }`}

          onClick={() =>
            listening
              ? stopListening()
              : startListening()
          }
        >
          🎤
        </button>
      )}

      <button
        className="send-btn"

        onClick={sendMessage}
      >
        Send
      </button>

    </div>
  );
}

export default ChatInput;