import {
  useState,
} from "react";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import "./Auth.css";

function Register() {

  const navigate =
    useNavigate();

  const [
    name,
    setName,
  ] = useState("");

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const registerUser =
    async () => {

      try {

        const res = await fetch(
          "https://ai-assistant-joi-backend.onrender.com/api/auth/register",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              name,
              email,
              password,
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

        // TEMP SAVE TOKEN
        localStorage.setItem(
          "token",
          data.token
        );

        navigate(
          "/setup-assistant"
        );

      } catch (error) {

        console.log(error);

        setError(
          "Server error"
        );
      }
    };

  const handleKeyDown =
    (e) => {

      if (e.key === "Enter") {
        registerUser();
      }
    };

  return (

    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          Atrium
        </div>

        <p className="auth-subtitle">
          Create your personalized AI workspace.
        </p>

        <input
          type="text"
          placeholder="Name"

          value={name}

          onChange={(e) =>
            setName(
              e.target.value
            )
          }

          onKeyDown={
            handleKeyDown
          }

          className="auth-input"
        />

        <input
          type="email"
          placeholder="Email"

          value={email}

          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }

          onKeyDown={
            handleKeyDown
          }

          className="auth-input"
        />

        <input
          type="password"
          placeholder="Password"

          value={password}

          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }

          onKeyDown={
            handleKeyDown
          }

          className="auth-input"
        />

        <button
          onClick={
            registerUser
          }

          className="auth-button"
        >
          Register
        </button>

        {error && (

          <p className="auth-error">
            {error}
          </p>

        )}

        <div className="auth-footer">

          Already have an account?{" "}

          <Link to="/login">
            Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Register;