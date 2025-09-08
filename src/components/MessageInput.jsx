import { useState } from "react";

function MessageInput({ onSend }) {
    const [text, setText] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
            onSend(text);
            setText("");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                display: "flex",
                padding: "10px",
                backgroundColor: "#1f1f1f"
            }}
        >
            <input
                type="text"
                placeholder="Type a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{
                    flex: 1,
                    padding: "10px",
                    border: "1px solid #333",
                    borderRadius: "20px",
                    backgroundColor: "#121212",
                    color: "#e0e0e0",
                    marginRight: "8px"
                }}
            />
            <button
                type="submit"
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#25D366",
                    color: "#121212",
                    border: "none",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontWeight: "bold"
                }}
            >
                Send
            </button>
        </form>
    );
}

export default MessageInput;
