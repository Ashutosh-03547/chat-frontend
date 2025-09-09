import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
    return (
        <div className="home-container">
            {/* Header */}
            <header className="home-header">
                <h1 className="logo">SocketChat</h1>
                <nav>
                    <Link to="/login" className="nav-btn">Login</Link>
                    <Link to="/register" className="nav-btn secondary">Register</Link>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-text">
                    <h2>Chat in Real-Time, Anywhere</h2>
                    <p>
                        Connect instantly with your friends using <b>SocketChat</b>.
                        Fast, reliable and secure — powered by <b>Socket.io</b> & MongoDB.
                    </p>
                    <Link to="/login" className="cta-btn">Get Started</Link>
                </div>

                <div className="hero-image">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/134/134914.png"
                        alt="Chat Illustration"
                    />
                </div>
            </section>
        </div>
    );
}

export default Home;
