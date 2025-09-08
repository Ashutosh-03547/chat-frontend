import { Link } from "react-router-dom";

function Home() {
    return (
        <div style={{
            padding: "40px",
            textAlign: "center"
        }}>
            <h1 style={{ color: "#25D366", marginBottom: "20px" }}>
                Welcome to MERN Chat
            </h1>
            <p style={{ marginBottom: "30px" }}>
                A real-time chat app built with MERN & Socket.io
            </p>
            <Link
                to="/login"
                style={{
                    padding: "12px 20px",
                    backgroundColor: "#25D366",
                    color: "#121212",
                    borderRadius: "6px",
                    fontWeight: "bold"
                }}
            >
                Get Started
            </Link>
        </div>
    );
}

export default Home;
