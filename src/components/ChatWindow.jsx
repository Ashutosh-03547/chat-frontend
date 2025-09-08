function ChatWindow({ messages }) {
    return (
        <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "10px",
            overflowY: "auto",
            borderBottom: "1px solid #333"
        }}>
            {messages.length === 0 ? (
                <p style={{ color: "#777" }}>No messages yet...</p>
            ) : (
                messages.map((msg, i) => (
                    <div
                        key={i}
                        style={{
                            marginBottom: "10px",
                            alignSelf: msg.sender === localStorage.getItem("chatUser")
                                ? "flex-end"
                                : "flex-start",
                            maxWidth: "60%"
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: msg.sender === localStorage.getItem("chatUser")
                                    ? "#25D366"
                                    : "#333",
                                color: msg.sender === localStorage.getItem("chatUser")
                                    ? "#121212"
                                    : "#e0e0e0",
                                padding: "8px 12px",
                                borderRadius: "15px",
                            }}
                        >
                            {msg.text}
                        </div>
                        <small style={{ fontSize: "12px", color: "#aaa" }}>
                            {msg.sender}
                        </small>
                    </div>
                ))
            )}
        </div>
    );
}

export default ChatWindow;
