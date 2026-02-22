import { useEffect, useState, useContext } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import DashboardLayout from "../layouts/DashboardLayout";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {
  const { user } = useContext(AuthContext);

  const [siteCount, setSiteCount] = useState(0);
  const [traditionCount, setTraditionCount] = useState(0);
  const [symbolCount, setSymbolCount] = useState(0);

  useEffect(() => {
    const unsubSites = onSnapshot(
      collection(db, "sites"),
      (snapshot) => setSiteCount(snapshot.size)
    );

    const unsubTraditions = onSnapshot(
      collection(db, "traditions"),
      (snapshot) => setTraditionCount(snapshot.size)
    );

    const unsubSymbols = onSnapshot(
      collection(db, "stateSymbols"),
      (snapshot) => setSymbolCount(snapshot.size)
    );

    return () => {
      unsubSites();
      unsubTraditions();
      unsubSymbols();
    };
  }, []);

  return (
    <DashboardLayout bgClass="page-dashboard">
      <div className="dashboard-content">
        <div className="hero-section">
          <div className="hero-background">
            <h1 className="hero-title">नमस्ते, {user?.displayName || "Explorer"}! 🌸</h1>
            <p className="hero-subtitle">Welcome to Bharat Legacy Explorer - Discover India's Rich Cultural Heritage</p>
          </div>
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <span className="stat-icon">🏛️</span>
            <h3>{siteCount}</h3>
            <p>Heritage Sites</p>
          </div>

          <div className="stat-card">
            <span className="stat-icon">🎭</span>
            <h3>{traditionCount}</h3>
            <p>Cultural Traditions</p>
          </div>

          <div className="stat-card">
            <span className="stat-icon">👑</span>
            <h3>{symbolCount}</h3>
            <p>State Symbols</p>
          </div>

          <div className="stat-card">
            <span className="stat-icon">📚</span>
            <h3>Community</h3>
            <p>Learning Hub</p>
          </div>
        </div>

        <div className="quick-access-section">
          <h2>Explore by Category</h2>
          <div className="quick-access-grid">
            <a href="/sites" className="quick-access-card">
              <div className="access-icon">🏰</div>
              <h3>Heritage Sites</h3>
              <p>Ancient monuments & historical places</p>
            </a>

            <a href="/traditions" className="quick-access-card">
              <div className="access-icon">🎪</div>
              <h3>Cultural Traditions</h3>
              <p>Festivals, rituals & customs</p>
            </a>

            <a href="/state-symbols" className="quick-access-card">
              <div className="access-icon">🎨</div>
              <h3>State Symbols</h3>
              <p>Unique heritage of each state</p>
            </a>

            <a href="/guides" className="quick-access-card">
              <div className="access-icon">📖</div>
              <h3>Expert Guides</h3>
              <p>Learn from heritage specialists</p>
            </a>
          </div>
        </div>

        <div className="about-section">
          <h2>About Our Platform</h2>
          <div className="about-content">
            <p>
              Bharat Legacy Explorer is a comprehensive platform dedicated to preserving and promoting awareness about India's incredible cultural heritage. Our mission is to connect people with the rich history, traditions, and symbols that make India unique.
            </p>
            <div className="about-features">
              <div className="feature">
                <span>🔐</span>
                <h4>Secure Access</h4>
                <p>Safe & secure authentication</p>
              </div>
              <div className="feature">
                <span>📱</span>
                <h4>User Roles</h4>
                <p>Multiple roles for different users</p>
              </div>
              <div className="feature">
                <span>💬</span>
                <h4>Community Driven</h4>
                <p>Share & discuss cultural topics</p>
              </div>
              <div className="feature">
                <span>🌏</span>
                <h4>All-India Content</h4>
                <p>Heritage from all 28 states</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const countStyle = {
  fontSize: "32px",
  fontWeight: "bold",
  color: "#ff7a00"
};

export default Dashboard;
