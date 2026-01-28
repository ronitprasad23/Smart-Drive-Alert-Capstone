import Sidebar from "../components/Sidebar";
import DashboardNavbar from "../components/DashboardNavbar";
import "../dashboard.css";

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="main-content">
        <DashboardNavbar />
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}
