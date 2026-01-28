import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardNavbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard-navbar">
      {/* Left */}
      <h3>Dashboard</h3>

      {/* Right */}
      <div className="navbar-right">
        {/* Admin Profile */}
        <div
          className="admin-profile-wrapper"
          onClick={() => setOpen(!open)}
        >
          <div className="admin-avatar">
            {user?.username?.charAt(0).toUpperCase() || 'A'}
          </div>

          <div className="admin-profile">
            <div className="admin-name">{user?.username || 'Admin'}</div>
            <div className="admin-role">{user?.is_staff ? 'System Admin' : 'User'}</div>
          </div>

          <span className="dropdown-arrow">▼</span>

          {/* Dropdown */}
          {open && (
            <div className="admin-dropdown">
              <div className="dropdown-item">
                <strong>{user?.username || 'Admin'}</strong>
                <div className="email">{user?.email || 'admin@gmail.com'}</div>
              </div>

              <hr />

              <div
                className="dropdown-item"
                onClick={() => navigate("/dashboard/profile")}
              >
                Profile
              </div>

              <div
                className="dropdown-item"
                onClick={() => navigate("/dashboard/change-password")}
              >
                Change Password
              </div>

              <div
                className="dropdown-item"
                onClick={() => navigate("/dashboard/forgot-password")}
              >
                Forgot Password
              </div>

              <hr />

              <div
                className="dropdown-item logout"
                onClick={handleLogout}
              >
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
