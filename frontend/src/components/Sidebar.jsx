import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Smart Drive</h2>

      <nav className="sidebar-menu">
        <NavLink to="/dashboard" className="menu-item">
          Dashboard
        </NavLink>

        <NavLink to="/dashboard/alerts" className="menu-item">
          Alerts
        </NavLink>

        <NavLink to="/dashboard/trips" className="menu-item">
          Trips
        </NavLink>

        <NavLink to="/dashboard/users" className="menu-item">
          Users
        </NavLink>

        <NavLink to="/dashboard/vehicles" className="menu-item">
          Vehicles
        </NavLink>

        <NavLink to="/dashboard/AccidentZones" className="menu-item">
          Accident Zones
        </NavLink>

        <NavLink to="/dashboard/features" className="menu-item">
          Features
        </NavLink>

        {/* <NavLink to="/dashboard/AboutApp" className="menu-item">
          About App
        </NavLink> */}

        <NavLink to="/dashboard/settings" className="menu-item">
          Settings
        </NavLink>
      </nav>
    </div>
  );
}
