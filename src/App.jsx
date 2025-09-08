import {  Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
// At the top of App.jsx
import Register from "./pages/Register"; // or wherever your component is


function App() {
  return (
    
      <div>
        <nav
          style={{
            background: "#1f1f1f",
            padding: "10px",
            display: "flex",
            gap: "15px",
          }}
        >
          <Link to="/" style={{ color: "#25D366", textDecoration: "none" }}>
            Home
          </Link>
          <Link to="/login" style={{ color: "#25D366", textDecoration: "none" }}>
            Login
          </Link>
          <Link to="/chat" style={{ color: "#25D366", textDecoration: "none" }}>
            Chat
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    
  );
}

export default App;
