import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import DashboardLayout from "../layouts/DashboardLayout";
import useUserRole from "../hooks/useUserRole";
import LikeCommentSection from "../components/LikeCommentSection";
import "../styles/sites.css";

function Sites() {
  const [sites, setSites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showLocationFilter, setShowLocationFilter] = useState(false);
  const { role } = useUserRole();

  useEffect(() => {
    const fetchSites = async () => {
      const snap = await getDocs(collection(db, "sites"));
      setSites(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchSites();
  }, []);

  const deleteSite = async (id) => {
    await deleteDoc(doc(db, "sites", id));
    setSites(prev => prev.filter(s => s.id !== id));
  };

  return (
    <DashboardLayout bgClass="page-sites">
      <h2>Heritage Sites</h2>

      <div className="sites-filter-section">
        {/* Search Input */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name, description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        {/* Main Filter Dropdown */}
        <div className="main-filter-group">
          <button
            className="filter-dropdown-btn"
            onClick={() => setShowLocationFilter(!showLocationFilter)}
          >
            🎛️ Filters
            <span className={`dropdown-arrow ${showLocationFilter ? "open" : ""}`}>▼</span>
          </button>

          {showLocationFilter && (
            <div className="filter-content">
              <div className="filter-row">
                <label className="filter-label">
                  <span>📍 State</span>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="filter-select"
                  >
                    <option value="">All States</option>
                    {[...new Set(sites.map((s) => s.state).filter(Boolean))]
                      .sort()
                      .map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                  </select>
                </label>

                <label className="filter-label">
                  <span>🏙️ City</span>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="filter-select"
                  >
                    <option value="">All Cities</option>
                    {[...new Set(sites.map((s) => s.city).filter(Boolean))]
                      .sort()
                      .map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                  </select>
                </label>
              </div>

              <div className="filter-row">
                <label className="filter-label full-width">
                  <span>🏷️ Category</span>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="filter-select"
                  >
                    <option value="">All Categories</option>
                    {[...new Set(sites.map((s) => s.category).filter(Boolean))]
                      .sort()
                      .map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </select>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {sites
        .filter((site) => {
          const matchesState = !selectedState || site.state === selectedState;
          const matchesCity = !selectedCity || site.city === selectedCity;
          const matchesCategory = !selectedCategory || site.category === selectedCategory;
          
          const matchesSearch = !searchTerm || 
            (site.name && site.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (site.city && site.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (site.state && site.state.toLowerCase().includes(searchTerm.toLowerCase()));
          
          return matchesState && matchesCity && matchesCategory && matchesSearch;
        })
        .length > 0 ? (
          sites
            .filter((site) => {
              const matchesState = !selectedState || site.state === selectedState;
              const matchesCity = !selectedCity || site.city === selectedCity;
              const matchesCategory = !selectedCategory || site.category === selectedCategory;
              
              const matchesSearch = !searchTerm || 
                (site.name && site.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (site.city && site.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (site.state && site.state.toLowerCase().includes(searchTerm.toLowerCase()));
              
              return matchesState && matchesCity && matchesCategory && matchesSearch;
            })
            .map((site) => (
              <div key={site.id} className="site-card">
                {/* ✅ IMAGE */}
                {site.imageUrl && (
                  <img
                    src={site.imageUrl}
                    alt={site.name}
                  />
                )}

                <h3>{site.name}</h3>
                <p>
                  <b>State:</b> {site.state}
                </p>
                <p>
                  <b>City:</b> {site.city}
                </p>
                <p>
                  <b>Category:</b> {site.category}
                </p>
                <p>
                  <b>Nearest Railway:</b> {site.nearestRailway}
                </p>
                <p>
                  <b>Nearest Airport:</b> {site.nearestAirport}
                </p>
                <p>{site.description}</p>

                <LikeCommentSection itemId={site.id} itemType="site" />

                {(role === "admin" || role === "creator") && (
                  <button onClick={() => deleteSite(site.id)}>Delete</button>
                )}
              </div>
            ))
        ) : (
          <div className="no-results">
            <p>📍 No heritage sites found matching your search.</p>
            <p>Try clearing your search or filters.</p>
          </div>
        )}
    </DashboardLayout>
  );
}

export default Sites;
