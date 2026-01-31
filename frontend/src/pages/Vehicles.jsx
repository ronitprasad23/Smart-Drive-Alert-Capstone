import { useState, useEffect } from "react";
import api from "../services/api";

export default function Vehicles() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await api.get("/admin/vehicles/");
                setVehicles(response.data);
            } catch (err) {
                console.error("Failed to fetch vehicles:", err);
                setError("Failed to load vehicle data.");
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    if (loading) return <div>Loading vehicles...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="card-section">
            <h3>All Vehicles</h3>
            <table className="alert-table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Make</th>
                        <th>Model</th>
                        <th>Year</th>
                        <th>License Plate</th>
                        <th>VIN</th>
                    </tr>
                </thead>
                <tbody>
                    {vehicles.length > 0 ? (
                        vehicles.map((vehicle) => (
                            <tr key={vehicle.id}>
                                <td>{vehicle.user_details}</td>
                                <td>{vehicle.make}</td>
                                <td>{vehicle.model}</td>
                                <td>{vehicle.year}</td>
                                <td>{vehicle.license_plate}</td>
                                <td>{vehicle.vin || "-"}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ textAlign: "center" }}>
                                No vehicles found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
