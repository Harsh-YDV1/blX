import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Sites from "./pages/Sites";
import AddSite from "./pages/AddSite";
import Traditions from "./pages/Traditions";
import AddTradition from "./pages/AddTradition";
import Admin from "./pages/Admin";
import StateSymbols from "./pages/StateSymbols";
import AddStateSymbol from "./pages/AddStateSymbol";
import Guides from "./pages/Guides";
import AddGuide from "./pages/AddGuide";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Heritage Sites */}
        <Route
          path="/sites"
          element={
            <ProtectedRoute>
              <Sites />
            </ProtectedRoute>
          }
        />

        {/* Add Heritage Site */}
        <Route
          path="/add-site"
          element={
            <ProtectedRoute>
              <RoleRoute allow={["admin", "creator"]}>
                <AddSite />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Cultural Traditions */}
        <Route
          path="/traditions"
          element={
            <ProtectedRoute>
              <Traditions />
            </ProtectedRoute>
          }
        />

        {/* Add Cultural Tradition */}
        <Route
          path="/add-tradition"
          element={
            <ProtectedRoute>
              <RoleRoute allow={["admin", "creator"]}>
                <AddTradition />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Tours (placeholder) */}
        <Route
          path="/tours"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Forum (placeholder) */}
        <Route
          path="/forum"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin Panel */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RoleRoute allow={["admin"]}>
                <Admin />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Guides */}
        <Route
          path="/guides"
          element={
            <ProtectedRoute>
              <Guides />
            </ProtectedRoute>
          }
        />

        {/* Add Guide */}
        <Route
          path="/add-guide"
          element={
            <ProtectedRoute>
              <RoleRoute allow={["admin"]}>
                <AddGuide />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        /><Route
  path="/symbols"
  element={
    <ProtectedRoute>
      <StateSymbols />
    </ProtectedRoute>
  }
/>

<Route
  path="/add-symbol"
  element={
    <ProtectedRoute>
      <RoleRoute allow={["admin","creator"]}>
        <AddStateSymbol />
      </RoleRoute>
    </ProtectedRoute>
  }
/>


      </Routes>
    </BrowserRouter>
  );
}

export default App;
