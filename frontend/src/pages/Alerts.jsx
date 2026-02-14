import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { FaInfoCircle } from 'react-icons/fa';

export default function Alerts() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [activeTab, setActiveTab] = useState('generated');
  const [alertTypes, setAlertTypes] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    critical: 0,
    moderate: 0,
    minor: 0,
    resolved: 0
  });

  // Modal & Form State
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  const [newAlert, setNewAlert] = useState({
    user_id: '',
    trip_id: '',
    alert_type: '',
    severity: 'MODERATE_RISK',
    vehicle_speed: '',
    location: '',
    latitude: '',
    longitude: '',
    is_resolved: false,
  });

  useEffect(() => {
    fetchAlerts();
    fetchAlertTypes();
    fetchAlertTypes();
    fetchUsers();
    fetchTrips();
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

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await api.get('/admin/users/');
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchTrips = async () => {
    try {
      const response = await api.get('/admin/trips/');
      setTrips(response.data);
    } catch (error) {
      console.error("Failed to fetch trips", error);
    }
  };

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    setCreateLoading(true);

    try {
      // Validate
      if (!newAlert.user_id || !newAlert.alert_type) {
        alert("Please select a user and alert type");
        return;
      }

      const payload = {
        ...newAlert,
        user: newAlert.user_id,
        trip: newAlert.trip_id || null,
        latitude: newAlert.latitude || null,
        longitude: newAlert.longitude || null,
      };

      await api.post('/admin/alerts/', payload);

      // Reset and refresh
      setShowModal(false);
      setNewAlert({
        user_id: '',
        trip_id: '',
        alert_type: '',
        severity: 'MODERATE_RISK',
        vehicle_speed: '',
        location: '',
        latitude: '',
        longitude: '',
        is_resolved: false,
      });
      fetchAlerts();
      alert("Alert created successfully!");
    } catch (error) {
      console.error("Failed to create alert", error);
      alert("Failed to create alert. Please check console for details.");
    } finally {
      setCreateLoading(false);
    }
  };

  const calculateStats = (data) => {
    const total = data.length;
    // Check both display name (from new serializer) and raw value (for backward compatibility/safety)
    const critical = data.filter(a => a.severity_display === 'Critical Risk' || a.severity === 'CRITICAL_RISK' || a.severity === 'CRITICAL' || a.severity === 'HIGH').length;
    const moderate = data.filter(a => a.severity_display === 'Moderate Risk' || a.severity === 'MODERATE_RISK' || a.severity === 'MEDIUM').length;
    const minor = data.filter(a => a.severity_display === 'Minor Risk' || a.severity === 'MINOR_RISK' || a.severity === 'LOW').length;
    const resolved = data.filter(a => a.is_resolved).length;

    setStats({ total, critical, moderate, minor, resolved });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Alerts Management 🚨</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all flex items-center gap-2 transform hover:scale-105 active:scale-95"
        >
          <span className="text-lg">+</span> Add Alert
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Alerts</h4>
          <p className="stat-number">{stats.total}</p>
        </div>

        <div className="stat-card">
          <h4>Critical Risk</h4>
          <p className="stat-number danger">{stats.critical}</p>
        </div>

        <div className="stat-card">
          <h4>Moderate Risk</h4>
          <p className="stat-number warning">{stats.moderate}</p>
        </div>

        <div className="stat-card">
          <h4>Minor Risk</h4>
          <p className="stat-number safe">{stats.minor}</p>
        </div>
      </div>

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
            <table className="alert-table w-full">
              <thead>
                <tr className="text-left text-gray-500 uppercase text-xs tracking-wider">
                  <th className="p-3">#</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Alert Type</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-center">More Info</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="6" className="text-center p-4">Loading...</td></tr>
                ) : alerts.length > 0 ? (
                  (() => {
                    const startIndex = (currentPage - 1) * itemsPerPage;
                    const currentAlerts = alerts.slice(startIndex, startIndex + itemsPerPage);
                    return (
                      <>
                        {currentAlerts.map((alert, index) => (
                          <tr
                            key={alert.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="p-3 text-gray-600">{startIndex + index + 1}</td>
                            <td className="p-3 font-medium text-gray-800">{alert.user_username || alert.user || 'Unknown'}</td>
                            <td className="p-3 text-gray-600">{alert.alert_type}</td>
                            <td className="p-3 text-gray-600">{new Date(alert.timestamp).toLocaleDateString()}</td>
                            <td className="p-3">
                              <span
                                style={{ whiteSpace: 'nowrap' }}
                                className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap inline-block ${(alert.severity_display === 'Critical Risk' || alert.severity === 'CRITICAL_RISK' || alert.severity === 'CRITICAL' || alert.severity === 'HIGH') ? "bg-red-100 text-red-700" :
                                  (alert.severity_display === 'Moderate Risk' || alert.severity === 'MODERATE_RISK' || alert.severity === 'MEDIUM') ? "bg-yellow-100 text-yellow-800" :
                                    "bg-green-100 text-green-700"
                                  }`}>
                                {alert.severity_display || (
                                  alert.severity === 'MINOR_RISK' ? 'Minor Risk' :
                                    alert.severity === 'MODERATE_RISK' ? 'Moderate Risk' :
                                      alert.severity === 'CRITICAL_RISK' ? 'Critical Risk' :
                                        alert.severity
                                )}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => {
                                  const lat = alert.latitude || 20.5937;
                                  const lng = alert.longitude || 78.9629;
                                  const user = alert.user_username || alert.user || 'Unknown';
                                  const type = alert.alert_type;
                                  const vehicle = alert.vehicle_name || 'Unknown Vehicle';
                                  const speed = alert.vehicle_speed || 0;
                                  const risk = alert.severity_display || alert.severity;

                                  navigate(`map?lat=${lat}&lng=${lng}&type=${type}&user=${user}&vehicle=${encodeURIComponent(vehicle)}&speed=${speed}&risk=${risk}`);
                                }}
                                className="text-blue-500 hover:text-blue-700 transition-transform transform hover:scale-110 p-2"
                                title="View Details"
                              >
                                <FaInfoCircle size={24} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </>
                    );
                  })()
                ) : (
                  <tr><td colSpan="6" className="text-center p-8 text-gray-500 italic">No alerts found</td></tr>
                )}
              </tbody>
            </table>

            {!loading && alerts.length > 0 && (
              (() => {
                const totalPages = Math.ceil(alerts.length / itemsPerPage);
                const startIndex = (currentPage - 1) * itemsPerPage;

                if (totalPages <= 1) return null;

                return (
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t border-gray-100 px-4 pb-4">
                    <span className="text-sm text-gray-500 mb-4 sm:mb-0">
                      Showing <span className="font-medium text-gray-900">{startIndex + 1}</span> to <span className="font-medium text-gray-900">{Math.min(startIndex + itemsPerPage, alerts.length)}</span> of <span className="font-medium text-gray-900">{alerts.length}</span> alerts
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                          }`}
                      >
                        Previous
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${currentPage === page
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'text-gray-600 hover:bg-gray-100'
                              }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                          }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                );
              })()
            )}
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

      {/* Add Alert Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
            <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
              <h3 className="text-white text-lg font-bold">Add New Alert</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:text-gray-200 transition-colors text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateAlert} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
                <select
                  value={newAlert.user_id}
                  onChange={(e) => setNewAlert({ ...newAlert, user_id: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  required
                >
                  <option value="">Select User</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.username} ({user.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trip</label>
                <select
                  value={newAlert.trip_id}
                  onChange={(e) => setNewAlert({ ...newAlert, trip_id: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={!newAlert.user_id}
                >
                  <option value="">Select Trip</option>
                  {trips.filter(t => String(t.user) === String(newAlert.user_id)).length > 0 ? (
                    trips
                      .filter(t => String(t.user) === String(newAlert.user_id))
                      .map(trip => (
                        <option key={trip.id} value={trip.id}>
                          {trip.start_location} ➝ {trip.end_location} ({new Date(trip.start_time).toLocaleDateString()})
                        </option>
                      ))
                  ) : (
                    <option value="" disabled>No trips available for this user</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alert Type</label>
                <select
                  value={newAlert.alert_type}
                  onChange={(e) => setNewAlert({ ...newAlert, alert_type: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                  disabled={!newAlert.user_id}
                >
                  <option value="">Select Type</option>
                  {alertTypes.map(type => (
                    <option key={type.id} value={type.name}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                <select
                  value={newAlert.severity}
                  onChange={(e) => setNewAlert({ ...newAlert, severity: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={!newAlert.user_id}
                >
                  <option value="MINOR_RISK">Minor Risk</option>
                  <option value="MODERATE_RISK">Moderate Risk</option>
                  <option value="CRITICAL_RISK">Critical Risk</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Speed (km/h)</label>
                  <input
                    type="number"
                    value={newAlert.vehicle_speed}
                    onChange={(e) => setNewAlert({ ...newAlert, vehicle_speed: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Speed in km/h</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={newAlert.location}
                    onChange={(e) => setNewAlert({ ...newAlert, location: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="e.g. Hive"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={newAlert.latitude}
                    onChange={(e) => setNewAlert({ ...newAlert, latitude: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="e.g. 20.5937"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={newAlert.longitude}
                    onChange={(e) => setNewAlert({ ...newAlert, longitude: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="e.g. 78.9629"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="is_resolved"
                  type="checkbox"
                  checked={newAlert.is_resolved}
                  onChange={(e) => setNewAlert({ ...newAlert, is_resolved: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="is_resolved" className="ml-2 block text-sm text-gray-900">
                  Is resolved
                </label>
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-md flex items-center"
                >
                  {createLoading ? 'Saving...' : 'Save Alert'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}