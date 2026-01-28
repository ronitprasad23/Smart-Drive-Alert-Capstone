export default function AboutApp() {
  return (
    <>
      <h2>About Smart Drive Alert ℹ️</h2>

      <div className="card-section" style={{ maxWidth: '800px' }}>
        <h3>Project Overview</h3>
        <p style={{ lineHeight: '1.6', color: '#555' }}>
          <strong>Smart Drive Alert</strong> is an advanced road safety system designed to reduce accidents
          caused by human error. By leveraging <strong>Artificial Intelligence (AI)</strong> and
          <strong>Machine Learning (ML)</strong>, the system analyzes driving patterns in real-time to
          detect anomalies such as drowsiness, distraction, and aggressive driving.
        </p>
        <p style={{ lineHeight: '1.6', color: '#555', marginTop: '1rem' }}>
          Our mission is to make roads safer for everyone by providing timely alerts to drivers and
          actionable insights to fleet managers and administrators.
        </p>

        <h3 style={{ marginTop: '2rem' }}>Key Technologies</h3>
        <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: '#555', lineHeight: '1.6' }}>
          <li><strong>Frontend:</strong> React.js, Vite, Chart.js</li>
          <li><strong>Backend:</strong> Django REST Framework (Python)</li>
          <li><strong>Database:</strong> PostgreSQL</li>
          <li><strong>Authentication:</strong> JWT (JSON Web Tokens)</li>
          <li><strong>AI/ML:</strong> TensorFlow / Scikit-learn (Planned Integration)</li>
        </ul>

        <h3 style={{ marginTop: '2rem' }}>System Information</h3>
        <div className="details-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block' }}>Version</label>
            <span>1.0.0 (Beta)</span>
          </div>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block' }}>Last Updated</label>
            <span>January 2026</span>
          </div>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block' }}>License</label>
            <span>Proprietary / Internal Use</span>
          </div>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block' }}>Status</label>
            <span className="safe" style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem' }}>Active Development</span>
          </div>
        </div>
      </div>
    </>
  );
}
