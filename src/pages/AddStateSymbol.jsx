import { useState, useContext } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { AuthContext } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";
import "../styles/form.css";

function AddStateSymbol() {
  const { user } = useContext(AuthContext);

  const [stateName, setStateName] = useState("");
  const [symbolType, setSymbolType] = useState("");
  const [symbolName, setSymbolName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [imageValid, setImageValid] = useState(false);
  const [description, setDescription] = useState("");

  const submitSymbol = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "stateSymbols"), {
      stateName,
      symbolType,
      symbolName,
      imageUrl,
      description,
      createdBy: user.uid,
      createdAt: Timestamp.now()
    });

    setSuccessMsg("State symbol added successfully");

    setStateName("");
    setSymbolType("");
    setSymbolName("");
    setImageUrl("");
    setDescription("");
    setImageValid(false);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <DashboardLayout bgClass="page-addstatesymbol">
      <div className="form-page">
        <div className="form-card">
          <h2 className="form-title">Add State Symbol</h2>

          {successMsg && <div className="form-success">{successMsg}</div>}

          <form onSubmit={submitSymbol}>
            <label className="form-label">State Name</label>
            <input
              className="form-input"
              placeholder="State Name"
              value={stateName}
              onChange={(e)=>setStateName(e.target.value)}
              required
            />

            <div style={{ height: 12 }} />

            <label className="form-label">Symbol Type</label>
            <select
              className="form-input"
              value={symbolType}
              onChange={(e)=>setSymbolType(e.target.value)}
              required
            >
              <option value="">Select type</option>
              <option>Bird</option>
              <option>Animal</option>
              <option>Flower</option>
              <option>Tree</option>
              <option>Other</option>
            </select>

            <div style={{ height: 12 }} />

            <label className="form-label">Symbol Name</label>
            <input
              className="form-input"
              placeholder="Symbol Name"
              value={symbolName}
              onChange={(e)=>setSymbolName(e.target.value)}
              required
            />

            <div style={{ height: 12 }} />

            <label className="form-label">Image URL</label>
            <input
              className="form-input"
              placeholder="Image URL"
              value={imageUrl}
              onChange={(e)=>setImageUrl(e.target.value)}
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
              onChange={(e)=>setDescription(e.target.value)}
              required
            />

            <button className="form-button" type="submit">Add Symbol</button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AddStateSymbol;
