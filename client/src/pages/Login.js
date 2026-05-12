import {
  useState,
  useEffect,
} from "react";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import "./Auth.css";

function Login() {

  const navigate =
    useNavigate();

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

  const [
    assistantName,
    setAssistantName,
  ] = useState("Joi");

  useEffect(() => {

    const savedName =
      localStorage.getItem(
        "assistantName"
      );

    if (savedName) {

      setAssistantName(
        savedName
      );
    }

  }, []);

  const loginUser =
    async () => {

      try {

        const res = await fetch(
          "https://ai-assistant-joi-backend.onrender.com/api/auth/login",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
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

        localStorage.setItem(
          "token",
          data.token
        );

        navigate("/chat");

        window.location.reload();

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
        loginUser();
      }
    };

  return (

    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-logo">
          {assistantName}
        </div>

        <p className="auth-subtitle">
          Welcome back.
        </p>

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
          onClick={loginUser}
          className="auth-button"
        >
          Login
        </button>

        {error && (

          <p className="auth-error">
            {error}
          </p>

        )}

        <div className="auth-footer">

          No account?{" "}

          <Link to="/register">
            Register
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Login;