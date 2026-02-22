import { auth } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    signOut(auth);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => navigate("/dashboard")}>
          <span className="brand-icon">🏛️</span>
          <div className="brand-text">
            <h1>Bharat Legacy Explorer</h1>
            <p>Discover India's Rich Heritage & Culture</p>
          </div>
        </div>

        <div className="navbar-center">
          <a href="/dashboard" className="nav-link">Dashboard</a>
          <a href="/sites" className="nav-link">Heritage Sites</a>
          <a href="/traditions" className="nav-link">Traditions</a>
          <a href="/state-symbols" className="nav-link">State Symbols</a>
          <a href="/guides" className="nav-link">Guides</a>
        </div>

        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
