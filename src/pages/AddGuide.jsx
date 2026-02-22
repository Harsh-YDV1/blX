import { useState, useContext } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { AuthContext } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";
import "../styles/form.css";

function AddGuide() {
  const { user } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [experience, setExperience] = useState("");
  const [ratePerDay, setRatePerDay] = useState("");
  const [languages, setLanguages] = useState("");
  const [contact, setContact] = useState("");
  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [photoValid, setPhotoValid] = useState(false);

  const submitGuide = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "guides"), {
        name,
        city,
        specialty,
        experience: parseInt(experience),
        ratePerDay: parseFloat(ratePerDay),
        languages,
        contact,
        bio,
        photoUrl,
        createdBy: user.uid,
        createdAt: Timestamp.now(),
        verified: false,
      });

      setSuccessMsg("Guide added successfully!");
      setName("");
      setCity("");
      setSpecialty("");
      setExperience("");
      setRatePerDay("");
      setLanguages("");
      setContact("");
      setBio("");
      setPhotoUrl("");
      setPhotoValid(false);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Error adding guide:", err);
      setSuccessMsg("Error adding guide. Please try again.");
    }
  };

  return (
    <DashboardLayout bgClass="page-addguide">
      <div className="form-page">
        <div className="form-card">
          <h2 className="form-title">Add Guide</h2>

          {successMsg && <div className="form-success">{successMsg}</div>}

          <form onSubmit={submitGuide}>
            <label className="form-label">Guide Name</label>
            <input
              className="form-input"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div style={{ height: 12 }} />

            <div className="form-row">
              <div className="form-col">
                <label className="form-label">City</label>
                <input
                  className="form-input"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>

              <div className="form-col">
                <label className="form-label">Specialty</label>
                <select
                  className="form-input"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  required
                >
                  <option value="">Select specialty</option>
                  <option>Heritage Sites</option>
                  <option>Cultural Tours</option>
                  <option>Historical Walking</option>
                  <option>Adventure</option>
                  <option>Food & Culture</option>
                  <option>Multi-day Tours</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div style={{ height: 12 }} />

            <div className="form-row">
              <div className="form-col">
                <label className="form-label">Experience (years)</label>
                <input
                  className="form-input"
                  placeholder="Years"
                  type="number"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  required
                />
              </div>

              <div className="form-col">
                <label className="form-label">Rate per day (₹)</label>
                <input
                  className="form-input"
                  placeholder="Rate"
                  type="number"
                  value={ratePerDay}
                  onChange={(e) => setRatePerDay(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ height: 12 }} />

            <label className="form-label">Languages</label>
            <input
              className="form-input"
              placeholder="e.g., English, Hindi, Tamil"
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
              required
            />

            <div style={{ height: 12 }} />

            <label className="form-label">Contact Number</label>
            <input
              className="form-input"
              placeholder="Phone Number"
              type="tel"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
            />

            <div style={{ height: 12 }} />

            <label className="form-label">Photo URL</label>
            <input
              className="form-input"
              placeholder="Photo URL (https://...)"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              required
            />
            {photoUrl && (
              <img
                src={photoUrl}
                alt="preview"
                className="image-preview"
                onLoad={() => setPhotoValid(true)}
                onError={() => setPhotoValid(false)}
                style={{ display: photoValid ? "block" : "none" }}
              />
            )}

            <div style={{ height: 12 }} />

            <label className="form-label">Bio</label>
            <textarea
              className="form-textarea"
              placeholder="Brief bio about the guide..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
            />

            <button className="form-button" type="submit">
              Add Guide
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AddGuide;
