import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import DashboardLayout from "../layouts/DashboardLayout";
import useUserRole from "../hooks/useUserRole";
import LikeCommentSection from "../components/LikeCommentSection";

function Sites() {
  const [sites, setSites] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
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
    <DashboardLayout>
      <h2>Heritage Sites</h2>

      <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
        <label>
          Filter by State:
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            style={{ marginLeft: 8 }}
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

        <label>
          Filter by City:
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            style={{ marginLeft: 8 }}
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

        <label>
          Filter by Category:
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ marginLeft: 8 }}
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

      {sites
        .filter((site) => (!selectedState || site.state === selectedState) && (!selectedCity || site.city === selectedCity) && (!selectedCategory || site.category === selectedCategory))
        .map((site) => (
          <div
            key={site.id}
            style={{
              background: "#fff",
              padding: 16,
              marginTop: 16,
              borderRadius: 10,
            }}
          >
            {/* ✅ IMAGE */}
            {site.imageUrl && (
              <img
                src={site.imageUrl}
                alt={site.name}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  marginBottom: "10px",
                }}
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
        ))}
    </DashboardLayout>
  );
}

export default Sites;
