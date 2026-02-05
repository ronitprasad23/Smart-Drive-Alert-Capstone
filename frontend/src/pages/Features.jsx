export default function Features() {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Application Features ⚙️</h2>

      {}
      <div className="feature-section">
        <h3>✅ Currently Available Features</h3>

        <div className="feature-list">
          <div className="feature-item">
            <span className="feature-icon">🚗</span>
            <div>
              <h4>Real-Time Driving Alerts</h4>
              <p>
                System detects overspeeding, harsh braking and unsafe driving
                patterns using sensor & trip data.
              </p>
            </div>
          </div>

          <div className="feature-item">
            <span className="feature-icon">🤖</span>
            <div>
              <h4>AI Risk Analysis</h4>
              <p>
                Machine Learning models analyze driving behavior and calculate
                risk scores for trips.
              </p>
            </div>
          </div>

          <div className="feature-item">
            <span className="feature-icon">📍</span>
            <div>
              <h4>Accident Zone Identification</h4>
              <p>
                High-risk accident zones are identified using historical data
                and analytics.
              </p>
            </div>
          </div>

          <div className="feature-item">
            <span className="feature-icon">🧑‍💼</span>
            <div>
              <h4>Admin Dashboard</h4>
              <p>
                Admin can monitor users, alerts, accident zones and system
                settings from a single dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>

      {}
      <hr className="divider" />

      {}
      <div className="feature-section">
        <h3>🚀 Upcoming / Future Features</h3>

        <div className="future-grid">
          <div className="future-card">
            <h4>📱 Mobile App Integration</h4>
            <p>
              Android & iOS app for drivers to receive instant alerts and trip
              summaries.
            </p>
          </div>

          <div className="future-card">
            <h4>📊 Advanced Analytics</h4>
            <p>
              Graphs, charts and reports for accident trends and driver behavior
              analysis.
            </p>
          </div>

          <div className="future-card">
            <h4>📡 Live Vehicle Tracking</h4>
            <p>
              Real-time GPS tracking for fleet and emergency response systems.
            </p>
          </div>

          <div className="future-card">
            <h4>🆘 Emergency Alert System</h4>
            <p>
              Automatic emergency alerts to contacts and authorities in case of
              severe accidents.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}