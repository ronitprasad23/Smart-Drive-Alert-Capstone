import { useEffect, useState } from "react";
import api from "../services/api";

export default function Trips() {
    const [trips, setTrips] = useState([]);
    const [users, setUsers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalError, setModalError] = useState("");

    // Form State
    const [formData, setFormData] = useState({
        user: "",
        vehicle: "",
        start_time: "",
        end_time: "",
        start_location: "",
        end_location: "",
        distance_km: 0,
        status: "ONGOING"
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [tripsRes, usersRes, vehiclesRes] = await Promise.all([
                api.get('/admin/trips/'),
                api.get('/admin/users/'),
                api.get('/admin/vehicles/')
            ]);
            setTrips(tripsRes.data);
            setUsers(usersRes.data);
            setVehicles(vehiclesRes.data);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserChange = (e) => {
        const userId = e.target.value;
        setFormData({
            ...formData,
            user: userId,
            vehicle: "" // Reset vehicle when user changes
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setModalError("");
        try {
            await api.post('/admin/trips/', formData);
            setIsModalOpen(false);
            fetchData(); // Refresh list
            // Reset form
            setFormData({
                user: "",
                vehicle: "",
                start_time: "",
                end_time: "",
                start_location: "",
                end_location: "",
                distance_km: 0,
                status: "ONGOING"
            });
        } catch (error) {
            console.error("Failed to create trip", error);
            setModalError(error.response?.data?.detail || "Failed to create trip. Please check your inputs.");
        }
    };

    // Filter vehicles based on selected user
    const availableVehicles = formData.user
        ? vehicles.filter(v => String(v.user) === String(formData.user))
        : [];

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Trip Management 🚗</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm flex items-center gap-2"
                >
                    <span>+</span> Add Trip
                </button>
            </div>

            <div className="card-section">
                <h3>All Trips</h3>
                <table className="alert-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>User</th>
                            <th>Status</th>
                            <th>Start Time</th>
                            <th>Distance (km)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="text-center">Loading...</td></tr>
                        ) : trips.length > 0 ? (
                            trips.map((trip) => (
                                <tr key={trip.id}>
                                    <td>{trip.id}</td>
                                    <td>{trip.user_details || trip.username || trip.user || 'Unknown'}</td>
                                    <td>
                                        <span style={{
                                            color: trip.status === 'COMPLETED' ? '#16a34a' :
                                                trip.status === 'ONGOING' ? '#2563eb' : '#dc2626',
                                            fontWeight: 'bold'
                                        }}>
                                            {trip.status}
                                        </span>
                                    </td>
                                    <td>{new Date(trip.start_time).toLocaleString()}</td>
                                    <td>{trip.distance_km}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" style={{ textAlign: "center" }}>No trips found</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Trip Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-[500px] max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">Add New Trip</h3>

                        {modalError && (
                            <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-sm">
                                {modalError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">User</label>
                                <select
                                    className="w-full border p-2 rounded"
                                    value={formData.user}
                                    onChange={handleUserChange}
                                    required
                                >
                                    <option value="">Select User</option>
                                    {users.map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.username} ({user.email})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Vehicle</label>
                                <select
                                    className="w-full border p-2 rounded disabled:bg-gray-100 disabled:text-gray-400"
                                    value={formData.vehicle}
                                    onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                                    required
                                    disabled={!formData.user}
                                >
                                    <option value="">Select Vehicle</option>
                                    {availableVehicles.map(vehicle => (
                                        <option key={vehicle.id} value={vehicle.id}>
                                            {vehicle.make} {vehicle.model} ({vehicle.license_plate})
                                        </option>
                                    ))}
                                </select>
                                {!formData.user && <p className="text-xs text-gray-500 mt-1">Select a user first to see their vehicles</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Start Time</label>
                                    <input
                                        type="datetime-local"
                                        className="w-full border p-2 rounded"
                                        value={formData.start_time}
                                        onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">End Time</label>
                                    <input
                                        type="datetime-local"
                                        className="w-full border p-2 rounded"
                                        value={formData.end_time}
                                        onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Start Location</label>
                                    <input
                                        type="text"
                                        className="w-full border p-2 rounded"
                                        value={formData.start_location}
                                        onChange={(e) => setFormData({ ...formData, start_location: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">End Location</label>
                                    <input
                                        type="text"
                                        className="w-full border p-2 rounded"
                                        value={formData.end_location}
                                        onChange={(e) => setFormData({ ...formData, end_location: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Distance (km)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        className="w-full border p-2 rounded"
                                        value={formData.distance_km}
                                        onChange={(e) => setFormData({ ...formData, distance_km: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Status</label>
                                    <select
                                        className="w-full border p-2 rounded"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="ONGOING">Ongoing</option>
                                        <option value="COMPLETED">Completed</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border rounded hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Save Trip
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}