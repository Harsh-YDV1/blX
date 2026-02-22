import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import DashboardLayout from "../layouts/DashboardLayout";
import "../styles/sites.css";
import useUserRole from "../hooks/useUserRole";
import LikeCommentSection from "../components/LikeCommentSection";

function Traditions() {
  const [traditions, setTraditions] = useState([]);
  const { role } = useUserRole();
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchTraditions = async () => {
      const snap = await getDocs(collection(db, "traditions"));
      setTraditions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchTraditions();
  }, []);

  const deleteTradition = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this tradition?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "traditions", id));
      setTraditions(prev => prev.filter(t => t.id !== id));
      alert("Tradition deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Error deleting tradition");
    }
  };

  return (
    <DashboardLayout bgClass="page-traditions">
      <h1>Cultural Traditions</h1>

      <div className="sites-filter-section">
        <input
          className="search-box search-input"
          placeholder="Search by name or region..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="filter-dropdown-wrapper">
          <button className="filter-dropdown-btn" onClick={() => setShowFilters(s => !s)}>Filters ▾</button>

          {showFilters && (
            <div className="filter-content">
              <label>
                Region
                <select className="filter-select" value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
                  <option value="">All Regions</option>
                  {[...new Set(traditions.map(t => t.region).filter(Boolean))].sort().map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </label>

              <label>
                Category
                <select className="filter-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                  <option value="">All Categories</option>
                  {[...new Set(traditions.map(t => t.category).filter(Boolean))].sort().map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </label>
            </div>
          )}
        </div>
      </div>

      {traditions.filter(t => {
        const matchesRegion = !selectedRegion || t.region === selectedRegion;
        const matchesCategory = !selectedCategory || t.category === selectedCategory;
        const term = (searchTerm || "").toLowerCase();
        const name = (t.name || "").toLowerCase();
        const location = (t.region || "").toLowerCase();
        const matchesSearch = !term || name.includes(term) || location.includes(term);

        return matchesRegion && matchesCategory && matchesSearch;
      }).map(tradition => (
        <div key={tradition.id} style={{
          background: "#fff",
          padding: 16,
          marginTop: 16,
          borderRadius: 10
        }}>
          {tradition.imageUrl && (
            <img
              src={tradition.imageUrl}
              alt={tradition.name}
              style={{
                width: "100%",
                height: "400px",
                objectFit: "cover",
                borderRadius: "8px"
              }}
            />
          )}

          <h3>{tradition.name}</h3>
          <p><b>Region:</b> {tradition.region}</p>
          <p>{tradition.description}</p>

          <LikeCommentSection itemId={tradition.id} itemType="tradition" />

          {(role === "admin" || role === "creator") && (
            <button onClick={() => deleteTradition(tradition.id)} style={{ marginTop: 12, padding: "8px 12px", background: "#ef4444", color: "white", border: "none", borderRadius: 6 }}>
              Delete
            </button>
          )}
        </div>
      ))}
    </DashboardLayout>
  );
}

export default Traditions;
