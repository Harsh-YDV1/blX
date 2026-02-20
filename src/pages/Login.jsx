import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { auth, db } from "../firebase/firebaseConfig";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  // 🔐 Google Login
  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const userRef = doc(db, "users", result.user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        await setDoc(userRef, {
          name: result.user.displayName,
          email: result.user.email,
          role: "enthusiast"
        });
      }

      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  // 📧 Email Login or Register
  const emailAuth = async () => {
    try {
      let result;

      if (isRegister) {
        result = await createUserWithEmailAndPassword(auth, email, password);

        await setDoc(doc(db, "users", result.user.uid), {
          name: email.split("@")[0],
          email,
          role: "enthusiast"
        });
      } else {
        result = await signInWithEmailAndPassword(auth, email, password);
      }

      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="login-page">

      {/* LEFT CULTURAL PANEL */}
      <div className="login-left">
       
        <h1>𝓑𝓱𝓪𝓻𝓪𝓽 𝓛𝓮𝓰𝓪𝓬𝔂 𝓔𝔁𝓹𝓵𝓸𝓻𝓮𝓻</h1>

        <p className="intro-text">
          Discover India's rich heritage, explore monuments, and learn
          cultural traditions from every state of Bharat.
        </p>

        <div className="culture-box">
          <h3>Did You Know?</h3>
          <p>
            India has more than 40 UNESCO World Heritage Sites including
            forts, temples, caves, and historical monuments.
          </p>
        </div>

        <div className="culture-box">
          <h3>Cultural Diversity</h3>
          <p>
            Every Indian state has its own festivals, dances, languages,
            food, attire, and traditional practices.
          </p>
        </div>

        <div className="culture-box">
          <h3>Our Mission</h3>
          <p>
            To digitally preserve and spread awareness about India’s
            heritage and traditions for future generations.
          </p>
        </div>
      </div>

      {/* RIGHT LOGIN CARD */}
      <div className="login-right">
        <div className="login-card">

          <h2 className="login-title">
            {isRegister ? "Create Account" : "Namaskaram!"}
          </h2>

          {/* Email */}
          <input
            className="login-input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Login/Register */}
          <button className="login-btn" onClick={emailAuth}>
            {isRegister ? "Register" : "Login"}
          </button>

          {/* Toggle */}
          <p
            className="login-toggle"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister
              ? "Already have an account? Login"
              : "New user? Register here"}
          </p>

          <div className="login-divider">OR</div>

          {/* Google */}
          <button className="google-btn" onClick={googleLogin}>
            <svg className="google-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 533.5 544.3" width="18" height="18" aria-hidden="true">
              <path fill="#4285F4" d="M533.5 278.4c0-18.5-1.5-37-4.7-54.6H272.1v103.3h147.1c-6.4 34.6-25.7 63.9-54.8 83.5v69.2h88.5c51.9-47.9 82.6-118.3 82.6-201.4z"/>
              <path fill="#34A853" d="M272.1 544.3c73.9 0 135.9-24.6 181.2-66.8l-88.5-69.2c-24.6 16.5-56.1 26.3-92.7 26.3-71 0-131.2-47.9-152.8-112.3H30.4v70.6C75.5 485.1 168 544.3 272.1 544.3z"/>
              <path fill="#FBBC05" d="M119.3 328.3c-8.9-26.3-8.9-54.6 0-80.9V176.8H30.4c-37.6 73.9-37.6 161.6 0 235.5l88.9-84z"/>
              <path fill="#EA4335" d="M272.1 109.7c39.9-.6 78.4 14.2 107.6 40.8l80.6-80.6C409 27.3 343.3 0 272.1 0 168 0 75.5 59.2 30.4 148.6l88.9 70.6C140.9 157.6 201 109.7 272.1 109.7z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

        </div>
      </div>

    </div>
  );
}

export default Login;
