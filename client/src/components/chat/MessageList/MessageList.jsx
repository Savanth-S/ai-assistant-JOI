import "./MessageList.css";

function MessageList({
  chat,
  loading,
  assistantName,
}) {

  return (

    <div className="messages-container">

      {chat.length === 0 ? (

        <div className="welcome-screen">

          <div className="welcome-badge">
            AI Assistant
          </div>

          <h1>
            {assistantName}
          </h1>

          <p>
            Your futuristic AI assistant
            for coding, research,
            creativity, and productivity.
          </p>

          <div className="welcome-suggestions">

            <div className="suggestion-card">
              Build me a React dashboard
            </div>

            <div className="suggestion-card">
              Explain quantum computing
            </div>

            <div className="suggestion-card">
              Create a business plan
            </div>

            <div className="suggestion-card">
              Help debug my code
            </div>

          </div>

        </div>

      ) : (

        <>
          {chat.map((msg, index) => (

            <div
              key={index}

              className={`message-row ${msg.role}`}
            >

              <div
                className={`message-bubble ${msg.role}`}
              >
                {msg.content}
              </div>

            </div>
          ))}

          {loading && (

            <div className="message-row ai">

              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>

            </div>
          )}
        </>
      )}

    </div>
  );
}

export default MessageList;