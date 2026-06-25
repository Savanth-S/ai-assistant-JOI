import {
  Trash2,
} from "lucide-react";

function Sidebar({
  sidebarOpen,
  setSidebarOpen,

  conversations,
  setConversationId,
  deleteConversation,
  newConversation,

  voices,
  selectedVoice,
  setSelectedVoice,

  voiceEnabled,
  setVoiceEnabled,

  logout,
}) {
  return (
    <>
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      <div
        className={`sidebar ${
          sidebarOpen
            ? "open"
            : ""
        }`}
      >
        <div>
          <h1 className="logo">
            Persona
          </h1>

          <button
            className="new-chat-btn"
            onClick={() => {
              newConversation();
              setSidebarOpen(false);
            }}
          >
            + New Chat
          </button>

          <div className="conversation-list">
            {conversations.map(
              (conversation) => (
                <div
                  key={conversation.id}
                  className="conversation-item"
                  onClick={() => {
                    setConversationId(
                      conversation.id
                    );

                    setSidebarOpen(false);
                  }}
                >
                  <span>
                    {conversation.title}
                  </span>

                  <button
                    className="delete-chat-btn"
                    onClick={(e) => {
                      deleteConversation(
                        e,
                        conversation.id
                      );
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        <div className="sidebar-bottom">
          <select
            className="voice-select"
            value={
              selectedVoice?.name || ""
            }
            onChange={(e) => {
              const selected =
                voices.find(
                  (voice) =>
                    voice.name ===
                    e.target.value
                );

              setSelectedVoice(
                selected
              );
            }}
          >
            {voices.map(
              (voice, index) => (
                <option
                  key={index}
                  value={voice.name}
                >
                  {voice.name.length >
                  40
                    ? voice.name.slice(
                        0,
                        40
                      ) + "..."
                    : voice.name}
                </option>
              )
            )}
          </select>

          <button
            className="voice-toggle-btn"
            onClick={() =>
              setVoiceEnabled(
                !voiceEnabled
              )
            }
          >
            {voiceEnabled
              ? "Voice ON"
              : "Voice OFF"}
          </button>

          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;