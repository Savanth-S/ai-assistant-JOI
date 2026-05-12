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

      {/* OVERLAY */}

      {sidebarOpen && (

        <div
          className="sidebar-overlay"

          onClick={() =>
            setSidebarOpen(false)
          }
        />

      )}

      {/* SIDEBAR */}

      <div
        className={`sidebar ${
          sidebarOpen
            ? "open"
            : ""
        }`}
      >

        <div>

          <h1 className="logo">
            Atrium
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

          {/* CONVERSATIONS */}

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

                      e.stopPropagation();

                      deleteConversation(
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

        {/* FOOTER */}

        <div className="sidebar-bottom">

          <select
            className="voice-select"

            value={selectedVoice}

            onChange={(e) =>
              setSelectedVoice(
                e.target.value
              )
            }
          >

            {voices.map(
              (voice, index) => (

                <option
                  key={index}
                  value={voice.name}
                >
                  {voice.name}
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