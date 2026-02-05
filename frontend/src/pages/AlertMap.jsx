import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function AlertMap() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const DEFAULT_LAT = 20.5937;
    const DEFAULT_LNG = 78.9629;

    const latParam = searchParams.get('lat');
    const lngParam = searchParams.get('lng');
    const hasParams = latParam && lngParam && latParam !== "null" && latParam !== "undefined" && latParam !== "0" && lngParam !== "0";

    const lat = hasParams ? parseFloat(latParam) : DEFAULT_LAT;
    const lng = hasParams ? parseFloat(lngParam) : DEFAULT_LNG;

    const zoomLevel = hasParams ? 13 : 5;

    const alertType = searchParams.get('type') || 'Accident Alert';
    const user = searchParams.get('user') || 'Unknown User';

    return (
        <div className="flex flex-col h-[calc(100vh-100px)]">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <span onClick={() => navigate(-1)} className="cursor-pointer hover:text-gray-600">
                        ←
                    </span>
                    Alert Location Map 🗺️
                </h2>
                <div className="text-sm text-gray-500">
                    Viewing {alertType} for {user}
                </div>
            </div>

            <div className="flex-grow rounded-xl overflow-hidden shadow-lg border border-gray-200 relative z-0">
                <MapContainer
                    center={[lat, lng]}
                    zoom={zoomLevel}
                    scrollWheelZoom={true}
                    className="h-full w-full"
                    key={`${lat}-${lng}-${zoomLevel}`}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {hasParams && (
                        <Marker position={[lat, lng]}>
                            <Popup>
                                <strong>{alertType}</strong><br />
                                User: {user}
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>
        </div>
    );
}