import { useState, useContext } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { AuthContext } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";
import "../styles/form.css";


function AddSite() {
  const { user } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [nearestRailway, setNearestRailway] = useState("");
  const [nearestAirport, setNearestAirport] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [imageValid, setImageValid] = useState(false);

  const submitSite = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "sites"), {
      name,
      state,
      city,
      category,
      nearestRailway,
      nearestAirport,
      description,
      imageUrl,   // ✅ URL stored directly
      createdBy: user.uid,
      createdAt: Timestamp.now()
    });

    setSuccessMsg("Heritage site added successfully");
    setName(""); setState(""); setCity(""); setCategory("");
    setNearestRailway(""); setNearestAirport("");
    setDescription(""); setImageUrl("");
    setImageValid(false);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <DashboardLayout>
      <div className="form-page">
        <div className="form-card">
          <h2 className="form-title">Add Heritage Site</h2>

          {successMsg && <div className="form-success">{successMsg}</div>}

          <form onSubmit={submitSite}>
            <label className="form-label">Site Name</label>
            <input
              className="form-input"
              placeholder="Site Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div style={{ height: 12 }} />

            <div className="form-row">
              <div className="form-col">
                <label className="form-label">State</label>
                <input
                  className="form-input"
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                />
              </div>

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
                <label className="form-label">Category</label>
                <select
                  className="form-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select category</option>
                  <option>Temple</option>
                  <option>Fort</option>
                  <option>Monument</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div style={{ height: 12 }} />

            <div className="form-row">
              <div className="form-col">
                <label className="form-label">Nearest Railway</label>
                <input
                  className="form-input"
                  placeholder="e.g., ABC Railway Station"
                  value={nearestRailway}
                  onChange={(e) => setNearestRailway(e.target.value)}
                  required
                />
              </div>

              <div className="form-col">
                <label className="form-label">Nearest Airport</label>
                <input
                  className="form-input"
                  placeholder="e.g., XYZ International Airport"
                  value={nearestAirport}
                  onChange={(e) => setNearestAirport(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ height: 12 }} />

            <label className="form-label">Image URL</label>
            <input
              className="form-input"
              placeholder="Image URL (https://...)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
            />
            {imageUrl && (
              <img
                src={imageUrl}
                alt="preview"
                className="image-preview"
                onLoad={() => setImageValid(true)}
                onError={() => setImageValid(false)}
                style={{ display: imageValid ? "block" : "none" }}
              />
            )}

            <div style={{ height: 12 }} />

            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <button className="form-button" type="submit">Add Site</button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AddSite;
