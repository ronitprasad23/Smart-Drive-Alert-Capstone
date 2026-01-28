import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import api from "../services/api";

export default function Settings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  // Local state for form inputs
  const [appName, setAppName] = useState("");
  const [sensitivity, setSensitivity] = useState("Medium");
  const [emailAlerts, setEmailAlerts] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/admin/system-settings/');
      const data = response.data;

      // Convert list to object for easier access
      const settingsMap = {};
      data.forEach(item => {
        settingsMap[item.key] = item;
      });

      setSettings(settingsMap);

      // Initialize form state
      if (settingsMap['app_name']) setAppName(settingsMap['app_name'].value);
      if (settingsMap['alert_sensitivity']) setSensitivity(settingsMap['alert_sensitivity'].value);
      if (settingsMap['email_alerts']) setEmailAlerts(settingsMap['email_alerts'].value === 'true');

    } catch (error) {
      console.error("Failed to fetch settings", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSetting = async (key, value) => {
    try {
      // Check if setting exists to decide PUT or POST (though our seed ensures they exist usually)
      // For simplicity, assuming they exist because we seeded them.
      // We need the ID to update.
      const setting = settings[key];
      if (setting) {
        await api.patch(`/admin/system-settings/${setting.id}/`, { value: String(value) });
      } else {
        // Create if not exists (edge case)
        await api.post('/admin/system-settings/', { key, value: String(value) });
      }
      alert(`Setting ${key} updated!`);
      fetchSettings(); // Refresh
    } catch (error) {
      console.error("Failed to save setting", error);
      alert("Failed to save setting");
    }
  };

  const handleAppSave = () => {
    saveSetting('app_name', appName);
    saveSetting('alert_sensitivity', sensitivity);
    // email alerts is auto-saved on toggle usually, or can be batch saved here
    saveSetting('email_alerts', emailAlerts);
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <>
      <h2>Settings ⚙️</h2>

      <div className="settings-wrapper">

        {/* App Settings */}
        <div className="settings-card">
          <h3>Application Settings</h3>

          <label>App Name</label>
          <input
            type="text"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
          />

          <label>Admin Email</label>
          <input type="email" defaultValue={user?.email || ""} readOnly />

          <label>Alert Sensitivity</label>
          <select
            value={sensitivity}
            onChange={(e) => setSensitivity(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <button className="save-btn" onClick={handleAppSave}>Save Settings</button>
        </div>

        {/* Notification Settings */}
        <div className="settings-card">
          <h3>Notification Settings</h3>

          <div className="toggle">
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
            />
            <span>Email Alerts</span>
          </div>

          <div className="toggle">
            <input type="checkbox" disabled />
            <span>SMS Alerts (Coming Soon)</span>
          </div>

          <div className="toggle">
            <input type="checkbox" disabled />
            <span>Push Notifications (Coming Soon)</span>
          </div>
        </div>

        {/* Security Settings Link */}
        <div className="settings-card">
          <h3>Security</h3>
          <p>To change your password, verify your identity on the dedicated page.</p>
          <Link to="/dashboard/change-password">
            <button className="save-btn danger" style={{ marginTop: '1rem' }}>Go to Change Password</button>
          </Link>
        </div>

      </div>
    </>
  );
}
