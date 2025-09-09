import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";

function App() {
  return (
    <div>
      {/* Navbar */}
      <nav
        style={{
          background: "#0b141a",
          padding: "15px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #222",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        {/* Left side → Logo */}
        <Link
          to="/"
          style={{
            color: "#25D366",
            fontSize: "22px",
            fontWeight: "bold",
            textDecoration: "none",
          }}
        >
          SocketChat
        </Link>

        {/* Right side → Login button */}
        <Link
          to="/login"
          style={{
            padding: "8px 16px",
            backgroundColor: "#25D366",
            color: "#121212",
            borderRadius: "6px",
            fontWeight: "bold",
            textDecoration: "none",
          }}
        >
          Login
        </Link>
      </nav>

      {/* Routes */}
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
