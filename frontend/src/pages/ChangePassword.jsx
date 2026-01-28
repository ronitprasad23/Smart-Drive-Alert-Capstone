import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPwd !== confirmPwd) {
      setError("New password & Confirm password do not match");
      return;
    }

    try {
      const response = await api.post('/auth/change-password/', {
        old_password: oldPwd,
        new_password: newPwd
      });
      setSuccess(response.data.message);
      setOldPwd("");
      setNewPwd("");
      setConfirmPwd("");

      // Optional: logout or redirect
      // navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to change password");
    }
  };

  return (
    <div className="settings-card">
      <h2>🔐 Change Password</h2>

      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: '1rem' }}>{success}</div>}

      <form onSubmit={handleSubmit} className="settings-form">
        <input
          type="password"
          placeholder="Old Password"
          value={oldPwd}
          onChange={(e) => setOldPwd(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPwd}
          onChange={(e) => setNewPwd(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPwd}
          onChange={(e) => setConfirmPwd(e.target.value)}
          required
        />

        <button type="submit" className="save-btn">
          Update Password
        </button>
      </form>
    </div>
  );
}
