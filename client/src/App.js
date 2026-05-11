import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./App.css";

import Login from "./pages/Login";

import Register from "./pages/Register";

import Chat from "./pages/Chat";

function App() {

  const token =
    localStorage.getItem("token");

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
            <Navigate
              to={
                token
                  ? "/chat"
                  : "/login"
              }
            />
          }
        />

      </Routes>

    </div>
  );
}

export default App;