import { useEffect, useState } from "react";
import api from "../services/api";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Toggle State
  const [activeTab, setActiveTab] = useState('generated');
  const [alertTypes, setAlertTypes] = useState([]);

  // Stats State
  const [stats, setStats] = useState({
    total: 0,
    critical: 0,
    warning: 0,
    resolved: 0
  });

  useEffect(() => {
    fetchAlerts();
    fetchAlertTypes();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await api.get('/admin/alerts/');
      const data = response.data;
      setAlerts(data);
      calculateStats(data);
    } catch (error) {
      console.error("Failed to fetch alerts", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlertTypes = async () => {
    try {
      const response = await api.get('/admin/alert-types/');
      setAlertTypes(response.data);
    } catch (error) {
      console.error("Failed to fetch alert types", error);
    }
  };

  const calculateStats = (data) => {
    const total = data.length;
    const critical = data.filter(a => a.severity === 'CRITICAL' || a.severity === 'HIGH').length;
    const warning = data.filter(a => a.severity === 'MEDIUM').length;
    const resolved = data.filter(a => a.is_resolved).length;

    setStats({ total, critical, warning, resolved });
  };

  return (
    <>
      <h2>Alerts Management 🚨</h2>

      {/* Top summary cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Alerts</h4>
          <p className="stat-number">{stats.total}</p>
        </div>

        <div className="stat-card">
          <h4>Critical Alerts</h4>
          <p className="stat-number danger">{stats.critical}</p>
        </div>

        <div className="stat-card">
          <h4>Warnings</h4>
          <p className="stat-number warning">{stats.warning}</p>
        </div>

        <div className="stat-card">
          <h4>Resolved</h4>
          <p className="stat-number safe">{stats.resolved}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === 'generated' ? 'active' : ''}`}
          onClick={() => setActiveTab('generated')}
        >
          Trip Alerts
        </button>
        <button
          className={`tab-btn ${activeTab === 'types' ? 'active' : ''}`}
          onClick={() => setActiveTab('types')}
        >
          Alert Types
        </button>
      </div>

      <div className="card-section">
        {activeTab === 'generated' ? (
          <>
            <h3>Recent Trip Alerts</h3>
            <table className="alert-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Alert Type</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="text-center">Loading...</td></tr>
                ) : alerts.length > 0 ? (
                  alerts.map((alert, index) => (
                    <tr key={alert.id}>
                      <td>{index + 1}</td>
                      <td>{alert.user_username || alert.user || 'Unknown'}</td>
                      <td>{alert.alert_type}</td>
                      <td>{alert.location || 'N/A'}</td>
                      <td>{new Date(alert.timestamp).toLocaleDateString()}</td>
                      <td className={
                        alert.severity === 'CRITICAL' || alert.severity === 'HIGH' ? "danger" :
                          alert.severity === 'MEDIUM' ? "warning" : "safe"
                      }>
                        {alert.severity}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" style={{ textAlign: "center" }}>No alerts found</td></tr>
                )}
              </tbody>
            </table>
          </>
        ) : (
          <>
            <h3>Alert Types Configuration</h3>
            <table className="alert-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {alertTypes.length > 0 ? (
                  alertTypes.map((type, index) => (
                    <tr key={type.id}>
                      <td>{index + 1}</td>
                      <td>{type.name}</td>
                      <td>{type.description || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="3" style={{ textAlign: "center" }}>No alert types defined</td></tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  );
}
