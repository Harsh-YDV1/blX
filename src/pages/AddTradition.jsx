import { useState, useContext } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { AuthContext } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";
import "../styles/form.css";

function AddTradition() {
  const { user } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [imageValid, setImageValid] = useState(false);

  const submitTradition = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "traditions"), {
      name,
      region,
      description,
      imageUrl,
      createdBy: user.uid,
      createdAt: Timestamp.now()
    });

    setSuccessMsg("Cultural tradition added successfully");
    setName(""); setRegion(""); setDescription(""); setImageUrl("");
    setImageValid(false);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <DashboardLayout>
      <div className="form-page">
        <div className="form-card">
          <h2 className="form-title">Add Cultural Tradition</h2>

          {successMsg && <div className="form-success">{successMsg}</div>}

          <form onSubmit={submitTradition}>
            <label className="form-label">Tradition Name</label>
            <input
              className="form-input"
              placeholder="Tradition Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div style={{ height: 12 }} />

            <label className="form-label">Region / State</label>
            <input
              className="form-input"
              placeholder="Region / State"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              required
            />

            <div style={{ height: 12 }} />

            <label className="form-label">Image URL</label>
            <input
              className="form-input"
              placeholder="Image URL"
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

            <button className="form-button" type="submit">Add Tradition</button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AddTradition;
