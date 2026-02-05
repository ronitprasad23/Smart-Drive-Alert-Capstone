
import PublicNavbar from "../components/PublicNavbar";

function Home() {
  return (
    <>
      <PublicNavbar />

      {}
      <section className="bg-gray-100 min-h-[80vh] flex flex-col justify-center items-center text-center px-6">
        <h2 className="text-4xl font-bold mb-4">
          AI Powered Smart Drive Alert
        </h2>
        <p className="text-gray-600 max-w-xl mb-6">
          Detects unsafe driving behavior using Machine Learning and alerts drivers
          in real-time for safer roads.
        </p>

        <a
          href="/login"
          className="bg-green-500 text-white px-6 py-3 rounded text-lg hover:bg-green-600"
        >
          Get Started
        </a>
      </section>

      {}
      <section id="features" className="py-16 px-8 bg-white">
        <h3 className="text-3xl font-bold text-center mb-10">Features</h3>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 shadow rounded">
            <h4 className="font-bold mb-2"> Real-Time Alerts</h4>
            <p className="text-gray-600">
              Instant alerts for overspeeding, drowsiness and unsafe driving.
            </p>
          </div>

          <div className="p-6 shadow rounded">
            <h4 className="font-bold mb-2"> AI Detection</h4>
            <p className="text-gray-600">
              Machine learning models analyze driving behavior continuously.
            </p>
          </div>

          <div className="p-6 shadow rounded">
            <h4 className="font-bold mb-2">Admin Dashboard</h4>
            <p className="text-gray-600">
              Admin can monitor users, alerts, and driving statistics.
            </p>
          </div>
        </div>
      </section>

      {}
      <section id="about" className="py-16 px-8 bg-gray-100">
        <h3 className="text-3xl font-bold text-center mb-6">About Project</h3>
        <p className="max-w-3xl mx-auto text-center text-gray-700">
          Smart Drive Alert is a final year project built using React, Django,
          PostgreSQL and Machine Learning. The goal is to reduce road accidents
          by providing intelligent alerts and insights.
        </p>
      </section>
    </>
  );
}

export default Home;