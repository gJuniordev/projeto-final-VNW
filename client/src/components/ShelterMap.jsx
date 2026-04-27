import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

function ShelterMap({ shelters }) {
  const defaultCenter = [-15.7938, -47.8827];
  const center =
    shelters.length > 0 && shelters[0].latitude
      ? [shelters[0].latitude, shelters[0].longitude]
      : defaultCenter;

  return (
    <div
      style={{
        height: "400px",
        width: "100%",
        borderRadius: "16px",
        overflow: "hidden",
        marginTop: "1.5rem",
        border: "2px solid var(--border)",
        zIndex: 1,
      }}
    >
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <ChangeView center={center} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {shelters.map(
          (s) =>
            s.latitude &&
            s.longitude && (
              <Marker
                key={s.id}
                position={[s.latitude, s.longitude]}
                icon={defaultIcon}
              >
                <Popup>
                  <div style={{ minWidth: "150px" }}>
                    <h3 style={{ margin: "0 0 5px 0", fontSize: "1rem" }}>
                      {s.name}
                    </h3>
                    <p style={{ margin: "0", fontSize: "0.85rem" }}>{s.city}</p>
                    <hr
                      style={{
                        margin: "8px 0",
                        border: "0",
                        borderTop: "1px solid #eee",
                      }}
                    />
                    <strong style={{ color: "var(--primary)" }}>
                      {s.capacity - (s.occupied_slots || 0)} vagas livres
                    </strong>
                  </div>
                </Popup>
              </Marker>
            ),
        )}
      </MapContainer>
    </div>
  );
}

export default ShelterMap;
