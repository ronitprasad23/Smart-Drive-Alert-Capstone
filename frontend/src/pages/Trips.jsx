import { useEffect, useState } from "react";
import api from "../services/api";

export default function Trips() {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrips();
    }, []);

    const fetchTrips = async () => {
        try {
            const response = await api.get('/admin/trips/');
            setTrips(response.data);
        } catch (error) {
            console.error("Failed to fetch trips", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h2>Trip Management 🚗</h2>
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
                                    <td>{trip.user || 'Unknown'}</td> {/* Serializer usually handles nested user representation */}
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
        </>
    );
}
