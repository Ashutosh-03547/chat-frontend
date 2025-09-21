import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../utils/socket";
import API from "../utils/api";
import Sidebar from "../components/Sidebar";

function Chat() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo) {
            setUser(userInfo);
            socket.emit("registerUser", userInfo._id);

            API.get("/auth/users")
                .then((res) => {
                    setUsers(res.data.filter((u) => u._id !== userInfo._id));
                })
                .catch((err) => console.error("❌ Error fetching users:", err));
        } else {
            navigate("/login");
        }

        // ✅ Listen for incoming private messages
        socket.on("privateMessage", (msg) => {
            setMessages((prev) => {
                const isDuplicate = prev.some(
                    (m) =>
                        m.text === msg.text &&
                        m.time === msg.time &&
                        (m.from?._id || m.from) === (msg.from?._id || msg.from)
                );
                if (!isDuplicate) {
                    return [...prev, msg];
                }
                return prev;
            });
        });

        return () => {
            socket.off("privateMessage");
        };
    }, [navigate]);

    useEffect(() => {
        if (selectedUser && user) {
            API.get(`/messages/${selectedUser._id}?myId=${user._id}`)
                .then((res) => {
                    setMessages(res.data);
                })
                .catch((err) => console.error("❌ Error fetching messages:", err));
        } else {
            setMessages([]);
        }
    }, [selectedUser, user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
        navigate("/login");
    };

    const sendMessage = () => {
        if (!message.trim() || !selectedUser || !user) return;

        const msgData = {
            from: user._id,
            to: selectedUser._id,
            text: message,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        // ✅ Optimistic update
        setMessages((prev) => [...prev, { ...msgData, from: { _id: user._id } }]);

        socket.emit("privateMessage", msgData);

        setMessage("");
    };

    return (
        <div
            style={{
                display: "flex",
                height: "100vh",
                flexDirection: "row",
            }}
        >
            {/* Sidebar */}
            <div
                style={{
                    width: "280px",
                    minWidth: "220px",
                    borderRight: "1px solid #333",
                }}
            >
                <Sidebar
                    users={users}
                    selectedUser={selectedUser}
                    onSelectUser={setSelectedUser}
                    onLogout={handleLogout}
                />
            </div>

            {/* Chat Window */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#0b141a",
                    color: "white",
                }}
            >
                <div style={{ padding: "10px", borderBottom: "1px solid #333" }}>
                    <h3 style={{ fontSize: "1rem" }}>
                        {selectedUser ? selectedUser.name : "Select a chat"}
                    </h3>
                </div>

                {/* Messages */}
                <div
                    style={{
                        flex: 1,
                        padding: "10px",
                        overflowY: "auto",
                        fontSize: "0.95rem",
                    }}
                >
                    {selectedUser ? (
                        messages.map((msg, i) => {
                            const fromId = msg.from?._id || msg.from;
                            return (
                                <div
                                    key={i}
                                    style={{
                                        margin: "6px 0",
                                        textAlign: fromId === user?._id ? "right" : "left",
                                    }}
                                >
                                    <span
                                        style={{
                                            display: "inline-block",
                                            background:
                                                fromId === user?._id ? "#25D366" : "#2f2f2f",
                                            color: fromId === user?._id ? "black" : "white",
                                            padding: "8px 12px",
                                            borderRadius: "12px",
                                            maxWidth: "80%",
                                            wordWrap: "break-word",
                                            fontSize: "0.9rem",
                                        }}
                                    >
                                        {msg.text}
                                        <div
                                            style={{
                                                fontSize: "0.7rem",
                                                marginTop: "2px",
                                                opacity: 0.7,
                                            }}
                                        >
                                            {msg.time}
                                        </div>
                                    </span>
                                </div>
                            );
                        })
                    ) : (
                        <p
                            style={{
                                textAlign: "center",
                                marginTop: "20px",
                                color: "#aaa",
                                fontSize: "0.9rem",
                            }}
                        >
                            👈 Select a user to start chatting
                        </p>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Row */}
                {selectedUser && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "10px",
                            background: "#1f1f1f",
                            borderTop: "1px solid #333",
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            style={{
                                flex: 1,
                                padding: "12px",
                                borderRadius: "20px",
                                border: "none",
                                outline: "none",
                                backgroundColor: "#2a2f32",
                                color: "white",
                                fontSize: "0.9rem",
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            style={{
                                marginLeft: "10px",
                                backgroundColor: "#25D366",
                                color: "#121212",
                                fontWeight: "bold",
                                padding: "12px 16px",
                                border: "none",
                                borderRadius: "50%",
                                cursor: "pointer",
                            }}
                        >
                            ➤
                        </button>
                    </div>
                )}
            </div>

            {/* ✅ Responsive adjustments */}
            <style>
                {`
                    @media (max-width: 768px) {
                        div[style*="display: flex"][style*="height: 100vh"] {
                            flex-direction: column;
                        }
                        div[style*="width: 280px"] {
                            width: 100% !important;
                            min-width: unset !important;
                            border-right: none !important;
                            border-bottom: 1px solid #333 !important;
                        }
                        div[style*="flex: 1"][style*="flex-direction: column"] {
                            height: calc(100vh - 60px);
                        }
                    }
                `}
            </style>
        </div>
    );
}

export default Chat;
