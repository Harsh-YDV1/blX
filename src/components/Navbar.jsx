import { auth } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";

function Navbar() {

  const logout = () => {
    signOut(auth);
  };

  return (
    <div style={{
      height: "60px",
      background: "#fde68a",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 20px"
    }}>
      <h4>भारत Legacy Explorer</h4>

      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Navbar;
