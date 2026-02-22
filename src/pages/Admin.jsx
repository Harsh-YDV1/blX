import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import DashboardLayout from "../layouts/DashboardLayout";
import "../styles/sites.css";

function Admin() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, "users"));
      const usersData = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    };

    fetchUsers();
  }, []);

  const changeRole = async (uid, newRole) => {
    await updateDoc(doc(db, "users", uid), {
      role: newRole
    });

    setUsers(prev =>
      prev.map(u => (u.id === uid ? { ...u, role: newRole } : u))
    );
  };

  return (
    <DashboardLayout bgClass="page-admin">
      <h2>Admin Panel – User Management</h2>

      <div className="sites-filter-section">
        <input
          className="search-box search-input"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="filter-dropdown-wrapper">
          <button className="filter-dropdown-btn" onClick={() => setShowFilters(s => !s)}>Filters ▾</button>

          {showFilters && (
            <div className="filter-content">
              <label>
                Role
                <select className="filter-select" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                  <option value="">All Roles</option>
                  {[...new Set(users.map(u => u.role).filter(Boolean))].sort().map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </label>
            </div>
          )}
        </div>
      </div>

      <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Role</th>
            <th>Change Role</th>
          </tr>
        </thead>
        <tbody>
          {users.filter(u => {
            const term = (searchTerm || "").toLowerCase();
            const name = (u.name || "").toLowerCase();
            const email = (u.email || "").toLowerCase();
            const matchesSearch = !term || name.includes(term) || email.includes(term);
            const matchesRole = !selectedRole || u.role === selectedRole;

            return matchesSearch && matchesRole;
          }).map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.name}</td>
              <td>{user.role}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => changeRole(user.id, e.target.value)}
                >
                  <option value="enthusiast">Enthusiast</option>
                  <option value="creator">Creator</option>
                  <option value="guide">Tour Guide</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardLayout>
  );
}

export default Admin;
