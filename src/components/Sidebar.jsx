import { Link } from "react-router-dom";
import useUserRole from "../hooks/useUserRole";

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import DiscussionPanel from "./DiscussionPanel";
import "../styles/sidebar.css";


function Sidebar() {
  const { role, loading } = useUserRole();
  const { user } = useContext(AuthContext);

  if (loading) return null;

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  return (
    <div className="sidebar">
      <h2 className="logo">Bharat Legacy Explorer</h2>
      <p className="tagline">Discover India’s Soul</p>

      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/sites">Heritage Sites</Link>

        {(role === "admin" || role === "creator") && (
          <Link to="/add-site">Add Heritage Site</Link>
        )}

        {role === "admin" && (
          <Link to="/admin">Admin Panel</Link>
        )}

        {role === "admin" && (
          <>
            <Link to="/guides">Manage Guides</Link>
            <Link to="/add-guide">Add Guide</Link>
          </>
        )}

        <Link to="/traditions">Cultural Traditions</Link>

        {(role === "admin" || role === "creator") && (
          <Link to="/add-tradition">Add Tradition</Link>
        )}

        <Link to="/symbols">State Symbols</Link>

        {(role === "admin" || role === "creator") && (
          <Link to="/add-symbol">Add Symbol</Link>
        )}
      </nav>

      <DiscussionPanel />

      {/* 🔻 PROFILE SECTION (NEW) */}
      <div className="sidebar-profile">
        <div className="profile-info">
          <img
            src={
              user?.photoURL ||
              (user?.email
                ? `https://robohash.org/${encodeURIComponent(user.email)}.png?size=200x200&set=set2`
                : "https://i.imgur.com/6VBx3io.png")
            }
            alt="profile"
            className="profile-pic"
          />

          <div className="profile-text">
            <div className="profile-name">
              {user?.displayName || user?.email?.split("@")[0]}
            </div>
            <div className="profile-email">
              {user?.email}
            </div>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
