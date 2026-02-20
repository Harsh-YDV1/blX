import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import DashboardLayout from "../layouts/DashboardLayout";
import useUserRole from "../hooks/useUserRole";
import "../styles/guides.css";

function Guides() {
  const [guides, setGuides] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const { role } = useUserRole();

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const snap = await getDocs(collection(db, "guides"));
        setGuides(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Error fetching guides:", err);
      }
    };
    fetchGuides();
  }, []);

  const deleteGuide = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this guide?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "guides", id));
      setGuides((prev) => prev.filter((g) => g.id !== id));
      alert("Guide deleted successfully");
    } catch (err) {
      console.error("Error deleting guide:", err);
      alert("Error deleting guide");
    }
  };

  const filteredGuides = guides.filter(
    (guide) =>
      (!selectedCity || guide.city === selectedCity) &&
      (!selectedSpecialty || guide.specialty === selectedSpecialty)
  );

  const cities = [...new Set(guides.map((g) => g.city).filter(Boolean))].sort();
  const specialties = [...new Set(guides.map((g) => g.specialty).filter(Boolean))].sort();

  return (
    <DashboardLayout>
      <h2>Find a Guide</h2>

      <div className="filter-container">
        <label>
          Filter by City:
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="filter-select"
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>

        <label>
          Filter by Specialty:
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="filter-select"
          >
            <option value="">All Specialties</option>
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filteredGuides.length === 0 ? (
        <div className="no-guides">
          <p>No guides found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="guides-grid">
          {filteredGuides.map((guide) => (
            <div key={guide.id} className="guide-card">
              {guide.photoUrl && (
                <img
                  src={guide.photoUrl}
                  alt={guide.name}
                  className="guide-photo"
                />
              )}

              <div className="guide-content">
                <h3 className="guide-name">{guide.name}</h3>

                <div className="guide-badge">
                  <span className="city-badge">{guide.city}</span>
                  <span className="specialty-badge">{guide.specialty}</span>
                </div>

                <div className="guide-details">
                  <p>
                    <strong>Experience:</strong> {guide.experience} years
                  </p>
                  <p>
                    <strong>Rate:</strong> ₹{guide.ratePerDay}/day
                  </p>
                  <p>
                    <strong>Languages:</strong> {guide.languages}
                  </p>
                </div>

                <p className="guide-bio">{guide.bio}</p>

                <div className="guide-actions">
                  <button className="contact-btn" onClick={() => alert(`Contact: ${guide.contact}`)}>
                    📞 Contact: {guide.contact}
                  </button>

                  {role === "admin" && (
                    <button
                      className="delete-btn"
                      onClick={() => deleteGuide(guide.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default Guides;
