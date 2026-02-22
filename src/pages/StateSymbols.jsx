import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import DashboardLayout from "../layouts/DashboardLayout";
import "../styles/sites.css";
import useUserRole from "../hooks/useUserRole";
import LikeCommentSection from "../components/LikeCommentSection";

function StateSymbols() {
  const [symbols, setSymbols] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const { role } = useUserRole();

  useEffect(() => {
    const fetchSymbols = async () => {
      const snap = await getDocs(collection(db, "stateSymbols"));
      setSymbols(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchSymbols();
  }, []);

  const deleteSymbol = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this symbol?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "stateSymbols", id));
      setSymbols(prev => prev.filter(s => s.id !== id));
      alert("Symbol deleted successfully");
    } catch (error) {
      console.error(error);
      alert("Error deleting symbol");
    }
  };

  return (
    <DashboardLayout bgClass="page-statesymbols">
      <h2>State Symbols</h2>

      <div className="sites-filter-section">
        <input
          className="search-box search-input"
          placeholder="Search by name or state..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="filter-dropdown-wrapper">
          <button className="filter-dropdown-btn" onClick={() => setShowFilters(s => !s)}>Filters ▾</button>

          {showFilters && (
            <div className="filter-content">
              <label>
                State
                <select className="filter-select" value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
                  <option value="">All States</option>
                  {[...new Set(symbols.map(s => s.stateName).filter(Boolean))].sort().map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </label>

              <label>
                Type
                <select className="filter-select" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                  <option value="">All Types</option>
                  {[...new Set(symbols.map(s => s.symbolType).filter(Boolean))].sort().map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </label>
            </div>
          )}
        </div>
      </div>

      {symbols.filter(s => {
        const matchesState = !selectedState || s.stateName === selectedState;
        const matchesType = !selectedType || s.symbolType === selectedType;
        const term = (searchTerm || "").toLowerCase();
        const name = (s.symbolName || "").toLowerCase();
        const location = (s.stateName || "").toLowerCase();
        const matchesSearch = !term || name.includes(term) || location.includes(term);

        return matchesState && matchesType && matchesSearch;
      }).map(symbol => (
        <div
          key={symbol.id}
          style={{
            background: "#fff",
            padding: 16,
            marginTop: 16,
            borderRadius: 10
          }}
        >
          {symbol.imageUrl && (
            <img
              src={symbol.imageUrl}
              alt={symbol.symbolName}
              style={{
                width: "100%",
                height: "400px",
                objectFit: "cover",
                borderRadius: "8px"
              }}
            />
          )}

          <h3>{symbol.symbolName}</h3>
          <p><b>State:</b> {symbol.stateName}</p>
          <p><b>Type:</b> {symbol.symbolType}</p>
          <p>{symbol.description}</p>

          <LikeCommentSection itemId={symbol.id} itemType="symbol" />

          {(role === "admin" || role === "creator") && (
            <button
              onClick={() => deleteSymbol(symbol.id)}
              style={{
                marginTop: "12px",
                padding: "8px 14px",
                background: "#e53935",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </DashboardLayout>
  );
}

export default StateSymbols;
