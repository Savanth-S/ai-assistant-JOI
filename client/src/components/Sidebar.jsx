import {
  Plus,
  Trash2,
  Volume2,
  VolumeX,
  LogOut,
  MessageSquare,
} from "lucide-react";

function Sidebar({
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

    <div className="sidebar">

      {/* TOP */}

      <div>

        <h1 className="logo">
          Joi
        </h1>

        <button
          className="new-chat-btn"
          onClick={newConversation}
        >

          <Plus size={20} />

          New Chat

        </button>

        {/* CONVERSATIONS */}

        <div className="conversation-list">

          {conversations.map(
            (conv, index) => (

              <div
                key={index}
                className="conversation-item"
                onClick={() =>
                  setConversationId(
                    conv.id
                  )
                }
              >

                <div className="conversation-left">

                  <MessageSquare
                    size={16}
                  />

                  <span>

                    {conv.title}

                  </span>

                </div>

                <button
                  className="delete-chat-btn"
                  onClick={(e) =>
                    deleteConversation(
                      e,
                      conv.id
                    )
                  }
                >

                  <Trash2
                    size={17}
                  />

                </button>

              </div>
            )
          )}

        </div>

      </div>

      {/* BOTTOM */}

      <div className="sidebar-bottom">

        {/* VOICE SELECT */}

        <select
          className="voice-select"

          value={
            selectedVoice
          }

          onChange={(e) =>
            setSelectedVoice(
              e.target.value
            )
          }
        >

          {voices.length === 0 ? (

            <option>
              Loading voices...
            </option>

          ) : (

            voices.map(
              (voice, index) => (

                <option
                  key={index}
                  value={
                    voice.name
                  }
                >

                  {voice.name}

                </option>
              )
            )

          )}

        </select>

        {/* VOICE TOGGLE */}

        <button
          className="voice-toggle-btn"

          onClick={() =>
            setVoiceEnabled(
              !voiceEnabled
            )
          }
        >

          {voiceEnabled ? (
            <Volume2 size={20} />
          ) : (
            <VolumeX size={20} />
          )}

          {voiceEnabled
            ? "Voice Enabled"
            : "Voice Disabled"}

        </button>

        {/* LOGOUT */}

        <button
          className="logout-btn"
          onClick={logout}
        >

          <LogOut size={20} />

          Logout

        </button>

      </div>

    </div>
  );
}

export default Sidebar;