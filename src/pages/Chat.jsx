import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../utils/socket";
import API from "../utils/api";
import MessageInput from "./MessageInput";
import Sidebar from "./Sidebar"; // ✅ new import

function Chat() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo) {
            setUser(userInfo);
            socket.emit("join", userInfo._id);
        } else {
            navigate("/login");
        }

        API.get("/auth/users").then((res) => {
            setUsers(res.data.filter((u) => u._id !== userInfo._id));
        });

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

    const sendMessage = (text) => {
        if (!text.trim() || !selectedUser) return;

        const msgData = {
            from: user._id,
            to: selectedUser._id,
            text,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        };

        socket.emit("privateMessage", msgData);
        setMessages((prev) => [...prev, msgData]);
    };

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            {/* ✅ Sidebar component */}
            <Sidebar
                users={users}
                selectedUser={selectedUser}
                onSelectUser={setSelectedUser}
                onLogout={handleLogout}
            />

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
                {selectedUser && <MessageInput onSend={sendMessage} />}
            </div>
        </div>
    );
}

export default Chat;
