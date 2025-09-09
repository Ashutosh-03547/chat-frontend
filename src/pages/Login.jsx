import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/api"; // axios instance
import "../styles/Login.css"; // 👈 new css file

function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post("/auth/login", form);

            // ✅ Save full user info in localStorage
            localStorage.setItem("userInfo", JSON.stringify(data));

            setMessage("✅ Login successful!");
            navigate("/chat");
        } catch (error) {
            setMessage(error.response?.data?.message || "❌ Login failed");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="logo">SocketChat</h1>
                <h2>Login</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit">Enter Chat</button>
                </form>

                <p className="message">{message}</p>

                <p className="switch">
                    Don't have an account?{" "}
                    <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
