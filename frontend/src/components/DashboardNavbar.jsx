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
      {}
      {}
      <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
        Welcome, <span className="text-gray-800">{user?.first_name || user?.username || 'Admin'}</span> 👋
      </h3>

      {}
      <div className="navbar-right">
        {}
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

          {}
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