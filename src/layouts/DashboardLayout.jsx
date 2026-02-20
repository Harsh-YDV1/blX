import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";

function DashboardLayout({ children }) {
  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="dashboard-main">
        <div className="dashboard-content">
          {children}
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
