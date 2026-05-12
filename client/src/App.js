import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat/Chat";
import SetupAssistant from "./pages/SetupAssistant";

function App() {

  const token =
    localStorage.getItem(
      "token"
    );

  return (

    <div className="App">

      <Routes>

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            token
              ? <Navigate to="/chat" />
              : <Login />
          }
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={
            token
              ? <Navigate to="/chat" />
              : <Register />
          }
        />

        {/* SETUP ASSISTANT */}
        <Route
          path="/setup-assistant"
          element={
            <SetupAssistant />
          }
        />

        {/* CHAT */}
        <Route
          path="/chat"
          element={
            token
              ? <Chat />
              : <Navigate to="/login" />
          }
        />

        {/* DEFAULT */}
        <Route
          path="*"
          element={
            <Navigate to="/login" />
          }
        />

      </Routes>

    </div>
  );
}

export default App;