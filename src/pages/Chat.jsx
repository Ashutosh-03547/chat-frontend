import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../utils/socket";

function Chat() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null); // for auto-scroll

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo) {
            setUser(userInfo);
        } else {
            navigate("/login");
        }
        // ✅ Load old messages
        socket.on("chatHistory", (history) => {
            setMessages(history);
        });

        // ✅ Listen for messages from server
        socket.on("chatMessage", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.off("chatMessage");
            socket.off("chatHistory");
        };
    }, [navigate]);

    useEffect(() => {
        // ✅ Auto-scroll to bottom on new message
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
        navigate("/login");
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            const msgData = {
                user: user._id,  // send user ID from logged-in user
                text: message,
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            };
            socket.emit("chatMessage", msgData); // send to server
            setMessage(""); // clear input
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
            <h2 style={{ color: "#25D366" }}>Welcome, {user?.name} 👋</h2>
            <button
                onClick={handleLogout}
                style={{
                    background: "#ff4444",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "8px 12px",
                    cursor: "pointer",
                    marginTop: "5px"
                }}
            >
                Logout
            </button>

            {/* Messages Box */}
            <div
                style={{
                    marginTop: "20px",
                    border: "1px solid #333",
                    padding: "10px",
                    height: "350px",
                    overflowY: "auto",
                    background: "#121212",
                    color: "white",
                    borderRadius: "6px"
                }}
            >
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        style={{
                            margin: "6px 0",
                            textAlign: msg.user._id === user?._id ? "right" : "left" // ✅ compare IDs
                        }}
                    >
                        <span
                            style={{
                                display: "inline-block",
                                background: msg.user._id === user?._id ? "#25D366" : "#2f2f2f",
                                color: msg.user._id === user?._id ? "black" : "white",
                                padding: "8px 12px",
                                borderRadius: "12px",
                                maxWidth: "70%",
                                wordWrap: "break-word"
                            }}
                        >
                            <strong>{msg.user._id === user?._id ? "You" : msg.user.name}</strong>: {msg.text}
                            <div style={{ fontSize: "0.75rem", marginTop: "2px", opacity: 0.7 }}>
                                {msg.time}
                            </div>
                        </span>
                    </div>
                ))}
  
                <div ref={messagesEndRef} />
            </div>

            {/* Input + Button */}
            <form
                onSubmit={sendMessage}
                style={{ marginTop: "10px", display: "flex", gap: "5px" }}
            >
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "4px",
                        border: "1px solid #333",
                        background: "#1f1f1f",
                        color: "white"
                    }}
                />
                <button
                    type="submit"
                    style={{
                        padding: "10px 15px",
                        backgroundColor: "#25D366",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}
                >
                    Send
                </button>
            </form>
        </div>
    );
}

export default Chat;
