import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/api";
import "../styles/Login.css"; // 👈 reuse login css theme

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post("/auth/register", form);

            // Save full user info for consistency
            localStorage.setItem("userInfo", JSON.stringify(data));

            setMessage("✅ Registered successfully!");
            navigate("/chat");
        } catch (error) {
            setMessage(error.response?.data?.message || "❌ Registration failed");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="logo">SocketChat</h1>
                <h2>Register</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
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

                    <button type="submit">Create Account</button>
                </form>

                <p className="message">{message}</p>

                <p className="switch">
                    Already have an account?{" "}
                    <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
}
