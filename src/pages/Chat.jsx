import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../utils/socket";
import API from "../utils/api"; // 👈 to fetch users

function Chat() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]); // all users
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    // Load user & register socket
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo) {
            setUser(userInfo);
            socket.emit("join", userInfo._id); // ✅ register on socket
        } else {
            navigate("/login");
        }

        // Load all users (except me)
        API.get("/auth/users").then((res) => {
            setUsers(res.data.filter((u) => u._id !== userInfo._id));
        });

        // Listen for private messages
        socket.on("privateMessage", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.off("privateMessage");
        };
    }, [navigate]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
        navigate("/login");
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (!message.trim() || !selectedUser) return;

        const msgData = {
            from: user._id,
            to: selectedUser._id,
            text: message,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        };

        socket.emit("privateMessage", msgData);
        setMessages((prev) => [...prev, msgData]); // show immediately
        setMessage("");
    };

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            {/* Sidebar (Users) */}
            <div style={{
                width: "30%",
                background: "#111",
                color: "white",
                borderRight: "1px solid #333",
                overflowY: "auto"
            }}>
                <div style={{ padding: "10px", borderBottom: "1px solid #333" }}>
                    <h3>Chats</h3>
                    <button
                        onClick={handleLogout}
                        style={{
                            background: "#ff4444",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            padding: "5px 10px",
                            cursor: "pointer",
                            marginTop: "5px"
                        }}
                    >
                        Logout
                    </button>
                </div>
                {users.map((u) => (
                    <div
                        key={u._id}
                        onClick={() => setSelectedUser(u)}
                        style={{
                            padding: "10px",
                            cursor: "pointer",
                            background: selectedUser?._id === u._id ? "#333" : "transparent"
                        }}
                    >
                        {u.name}
                    </div>
                ))}
            </div>

            {/* Chat Window */}
            <div style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#0b141a",
                color: "white"
            }}>
                <div style={{ padding: "10px", borderBottom: "1px solid #333" }}>
                    <h3>{selectedUser?.name || "Select a chat"}</h3>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, padding: "10px", overflowY: "auto" }}>
                    {messages
                        .filter(
                            (m) =>
                                (m.from === user?._id && m.to === selectedUser?._id) ||
                                (m.from === selectedUser?._id && m.to === user?._id)
                        )
                        .map((msg, i) => (
                            <div
                                key={i}
                                style={{
                                    margin: "6px 0",
                                    textAlign: msg.from === user?._id ? "right" : "left"
                                }}
                            >
                                <span
                                    style={{
                                        display: "inline-block",
                                        background: msg.from === user?._id ? "#25D366" : "#2f2f2f",
                                        color: msg.from === user?._id ? "black" : "white",
                                        padding: "8px 12px",
                                        borderRadius: "12px",
                                        maxWidth: "70%",
                                        wordWrap: "break-word"
                                    }}
                                >
                                    {msg.text}
                                    <div style={{ fontSize: "0.75rem", marginTop: "2px", opacity: 0.7 }}>
                                        {msg.time}
                                    </div>
                                </span>
                            </div>
                        ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                {selectedUser && (
                    <form
                        onSubmit={sendMessage}
                        style={{ marginTop: "10px", display: "flex", padding: "10px" }}
                    >
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            style={{
                                flex: 1,
                                padding: "10px",
                                borderRadius: "20px",
                                border: "none",
                                background: "#1f1f1f",
                                color: "white"
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                marginLeft: "5px",
                                backgroundColor: "#25D366",
                                border: "none",
                                borderRadius: "20px",
                                padding: "10px 20px"
                            }}
                        >
                            Send
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Chat;
