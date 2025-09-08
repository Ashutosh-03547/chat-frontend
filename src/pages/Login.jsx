import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/api"; // axios instance

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
            navigate("/chat"); // redirect to chat page
        } catch (error) {
            setMessage(error.response?.data?.message || "❌ Login failed");
        }
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "80vh",
            }}
        >
            <form
                onSubmit={handleSubmit}
                style={{
                    backgroundColor: "#1f1f1f",
                    padding: "30px",
                    borderRadius: "8px",
                    width: "300px",
                    textAlign: "center",
                }}
            >
                <h2 style={{ color: "#25D366", marginBottom: "20px" }}>Login</h2>

                <input
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={form.email}
                    onChange={handleChange}
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "15px",
                        borderRadius: "4px",
                        border: "1px solid #333",
                        backgroundColor: "#121212",
                        color: "#e0e0e0",
                    }}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={handleChange}
                    style={{
                        width: "100%",
                        padding: "10px",
                        marginBottom: "15px",
                        borderRadius: "4px",
                        border: "1px solid #333",
                        backgroundColor: "#121212",
                        color: "#e0e0e0",
                    }}
                />

                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "10px",
                        backgroundColor: "#25D366",
                        border: "none",
                        borderRadius: "4px",
                        fontWeight: "bold",
                        cursor: "pointer",
                    }}
                >
                    Enter Chat
                </button>

                <p style={{ color: "white", marginTop: "10px" }}>{message}</p>

                {/* ✅ Add register link */}
                <p style={{ color: "#e0e0e0", marginTop: "15px" }}>
                    Don't have an account?{" "}
                    <Link to="/register" style={{ color: "#ffbb33", fontWeight: "bold" }}>
                        Register here
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default Login;
