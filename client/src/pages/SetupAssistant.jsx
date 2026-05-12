import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import "./Auth.css";

function SetupAssistant() {

  const navigate =
    useNavigate();

  const [
    assistantName,
    setAssistantName,
  ] = useState("");

  const [
    assistantPersonality,
    setAssistantPersonality,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const saveAssistant =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await fetch(
            "https://ai-assistant-joi-backend.onrender.com/api/user/setup-assistant",
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({

                assistantName,

                assistantPersonality,
              }),
            }
          );

        const data =
          await res.json();

        if (!res.ok) {

          setError(
            data.message
          );

          return;
        }

        // SAVE LOCALLY
        localStorage.setItem(
          "assistantName",
          assistantName
        );

        localStorage.setItem(
          "assistantPersonality",
          assistantPersonality
        );

        // LOGOUT AFTER SETUP
        localStorage.removeItem(
          "token"
        );

        // GO TO LOGIN
        navigate("/login");

      } catch (error) {

        console.log(error);

        setError(
          "Server error"
        );
      }
    };

  return (

    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          Create Your AI
        </div>

        <p className="auth-subtitle">
          Personalize your assistant.
        </p>

        <input
          type="text"
          placeholder="Assistant Name"

          value={assistantName}

          onChange={(e) =>
            setAssistantName(
              e.target.value
            )
          }

          className="auth-input"
        />

        <textarea
          placeholder="Describe your assistant personality..."

          value={
            assistantPersonality
          }

          onChange={(e) =>
            setAssistantPersonality(
              e.target.value
            )
          }

          className="auth-input"

          style={{
            height: "120px",
            resize: "none",
          }}
        />

        <button
          onClick={
            saveAssistant
          }

          className="auth-button"
        >
          Continue
        </button>

        {error && (

          <p className="auth-error">
            {error}
          </p>

        )}

      </div>

    </div>
  );
}

export default SetupAssistant;