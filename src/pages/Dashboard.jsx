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
    <DashboardLayout>
      <div className="dashboard-content">
        <div className="dashboard-welcome">
          <h1>नमस्ते 🌸</h1>
          <p>Welcome back, <strong>{user?.displayName || "Explorer"}</strong></p>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <div className="icon">🏛️</div>
            <h2>{siteCount}</h2>
            <p>Heritage Sites</p>
          </div>

          <div className="stat-card">
            <div className="icon">🎭</div>
            <h2>{traditionCount}</h2>
            <p>Cultural Traditions</p>
          </div>

          <div className="stat-card">
            <div className="icon">👑</div>
            <h2>{symbolCount}</h2>
            <p>State Symbols</p>
          </div>
        </div>

        <div className="section">
          <h2>Quick Overview</h2>
          <div className="content-card">
            <p>
             Bharat Legacy Explorer is a full-stack web application designed to promote awareness and learning about India’s rich cultural heritage, historical places, and traditional symbols. The platform allows users to securely sign in using Google or email authentication and explore detailed information about heritage sites, cultural traditions, and state symbols through an interactive dashboard. It supports multiple user roles—Admin, Content Creator, Tour Guide, and Cultural Enthusiast—each with specific permissions such as managing content, adding new heritage entries, conducting virtual tours, or participating in discussions.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const cardStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  width: "220px",
  textAlign: "center",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
};

const countStyle = {
  fontSize: "32px",
  fontWeight: "bold",
  color: "#ff7a00"
};

export default Dashboard;
