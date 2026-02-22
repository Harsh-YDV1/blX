import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";

function DashboardLayout({ children, bgClass = "" }) {
  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className={`dashboard-main ${bgClass}`}>
        <div className="dashboard-content">
          {children}
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
