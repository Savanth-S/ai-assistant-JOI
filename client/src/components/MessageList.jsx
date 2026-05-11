import MessageBubble from "./MessageBubble";

import TypingIndicator from "./TypingIndicator";

function MessageList({
  chat,
  loading,
  chatEndRef,
}) {

  return (

    <div className="messages-container">

      {/* EMPTY STATE */}

      {chat.length === 0 && (

        <div className="welcome-screen">

          <div className="welcome-badge">
            AI Assistant
          </div>

          <h1>
            Meet Joi
          </h1>

          <p>
            Your intelligent AI companion for coding,
            research, productivity, and conversation.
          </p>

          <div className="welcome-suggestions">

            <div className="suggestion-card">
              Explain this codebase
            </div>

            <div className="suggestion-card">
              Summarize a PDF
            </div>

            <div className="suggestion-card">
              Generate React components
            </div>

            <div className="suggestion-card">
              Analyze uploaded files
            </div>

          </div>

        </div>
      )}

      {/* MESSAGES */}

      {chat.map((msg, index) => (

        <MessageBubble
          key={index}
          message={msg}
        />

      ))}

      {/* LOADING */}

      {loading && (
        <TypingIndicator />
      )}

      <div ref={chatEndRef}></div>

    </div>
  );
}

export default MessageList;