function Sidebar() {
    return (
        <div style={{
            width: "25%",
            borderRight: "1px solid #ddd",
            padding: "10px"
        }}>
            <h2>Chats</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
                <li>User 1</li>
                <li>User 2</li>
                <li>User 3</li>
            </ul>
        </div>
    );
}

export default Sidebar;
