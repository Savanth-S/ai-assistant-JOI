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
  ] = useState("Persona");

  const [
    assistantPersonality,
    setAssistantPersonality,
  ] = useState(
    "Helpful, intelligent, calm, and personalized."
  );

  const [
    error,
    setError,
  ] = useState("");

  const saveAssistant =
    async () => {
      try {
        setError("");

        const token =
          localStorage.getItem(
            "token"
          );

        const finalAssistantName =
          assistantName.trim() ||
          "Persona";

        const finalAssistantPersonality =
          assistantPersonality.trim() ||
          "Helpful, intelligent, calm, and personalized.";

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
                assistantName:
                  finalAssistantName,

                assistantPersonality:
                  finalAssistantPersonality,
              }),
            }
          );

        const data =
          await res.json();

        if (!res.ok) {
          setError(
            data.message ||
              "Failed to setup assistant"
          );

          return;
        }

        localStorage.setItem(
          "assistantName",
          finalAssistantName
        );

        localStorage.setItem(
          "assistantPersonality",
          finalAssistantPersonality
        );

        localStorage.removeItem(
          "token"
        );

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
          Persona
        </div>

        <p className="auth-subtitle">
          Configure your personal AI assistant.
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
          placeholder="Describe Persona's personality..."
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