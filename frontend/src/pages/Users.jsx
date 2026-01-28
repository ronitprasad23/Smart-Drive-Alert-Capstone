import { useEffect, useState } from "react";
import api from "../services/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    blocked: 0,
    newThisMonth: 0
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users/');
      const data = response.data;
      setUsers(data);
      calculateStats(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const total = data.length;
    const active = data.filter(u => u.is_active).length;
    const blocked = data.filter(u => !u.is_active).length; // Assuming inactive = blocked

    // Simple "New This Month" mock or calculation
    // Assuming data includes 'date_joined'
    const now = new Date();
    const newThisMonth = data.filter(u => {
      const joined = new Date(u.date_joined);
      return joined.getMonth() === now.getMonth() && joined.getFullYear() === now.getFullYear();
    }).length;

    setStats({ total, active, blocked, newThisMonth });
  };

  return (
    <>
      <h2>Users Management 👥</h2>

      {/* Summary cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Users</h4>
          <p className="stat-number">{stats.total}</p>
        </div>

        <div className="stat-card">
          <h4>Active Users</h4>
          <p className="stat-number safe">{stats.active}</p>
        </div>

        <div className="stat-card">
          <h4>Blocked / Inactive</h4>
          <p className="stat-number danger">{stats.blocked}</p>
        </div>

        <div className="stat-card">
          <h4>New This Month</h4>
          <p className="stat-number warning">{stats.newThisMonth}</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="card-section">
        <h3>Registered Users</h3>

        <table className="alert-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Email</th>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>

            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="text-center">Loading...</td></tr>
            ) : users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.email || 'N/A'}</td>
                  <td>{user.first_name} {user.last_name}</td>
                  <td>{user.is_staff ? 'Admin' : 'User'}</td>
                  <td className={user.is_active ? "safe" : "danger"}>
                    {user.is_active ? "Active" : "Inactive"}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" style={{ textAlign: "center" }}>No users found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
