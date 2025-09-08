function Sidebar({ users, selectedUser, onSelectUser, onLogout }) {
    return (
        <div style={{
            width: "25%",
            borderRight: "1px solid #333",
            background: "#111",
            color: "white",
            overflowY: "auto"
        }}>
            <div style={{
                padding: "10px",
                borderBottom: "1px solid #333",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <h2 style={{ margin: 0 }}>Chats</h2>
                <button
                    onClick={onLogout}
                    style={{
                        background: "#ff4444",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "5px 10px",
                        cursor: "pointer"
                    }}
                >
                    Logout
                </button>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {users.length === 0 ? (
                    <li style={{ padding: "10px", color: "#888" }}>No users online</li>
                ) : (
                    users.map((u) => (
                        <li
                            key={u._id}
                            onClick={() => onSelectUser(u)}
                            style={{
                                padding: "10px",
                                cursor: "pointer",
                                background: selectedUser?._id === u._id ? "#333" : "transparent"
                            }}
                        >
                            {u.name}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}

export default Sidebar;
