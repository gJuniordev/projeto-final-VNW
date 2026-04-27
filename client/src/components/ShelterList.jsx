import { useEffect, useState } from "react";
import api from "../services/api";
import { 
  Search, MapPin, Trash2, Map as MapIcon, Navigation, 
  Dog, Accessibility, Zap, Bath, Utensils, Soup, 
  HeartPulse, Shirt, Wifi 
} from "lucide-react";
import ShelterMap from "./ShelterMap";
import ShelterDetails from "./ShelterDetails";
import Swal from "sweetalert2";
import "./ShelterList.css";

function ShelterList() {
  const [shelters, setShelters] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedShelter, setSelectedShelter] = useState(null);

  const iconMap = {
    pet: <Dog size={16} />,
    pcd: <Accessibility size={16} />,
    energy: <Zap size={16} />,
    bath: <Bath size={16} />,
    food: <Utensils size={16} />,
    kitchen: <Soup size={16} />,
    health: <HeartPulse size={16} />,
    clothes: <Shirt size={16} />,
    wifi: <Wifi size={16} />,
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      api.get(`/shelters?search=${searchTerm}`)
        .then((res) => setShelters(res.data))
        .catch((err) => console.error("Erro ao buscar abrigos:", err));
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const updateShelterData = (updated) => {
    setShelters((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const openInGoogleMaps = (e, address) => {
    e.stopPropagation();
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, "_blank");
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    const result = await Swal.fire({
      title: "Excluir Abrigo?",
      text: "Esta ação não pode ser desfeita!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff4646",
      cancelButtonColor: "#718096",
      confirmButtonText: "Sim, excluir",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/shelters/${id}`);
        setShelters(shelters.filter((s) => s.id !== id));
        Swal.fire({ title: "Deletado!", icon: "success", timer: 1500, showConfirmButton: false });
      } catch {
        Swal.fire("Erro!", "Não foi possível excluir.", "error");
      }
    }
  };

  return (
    <section className="shelter-list-container">
      <div className="list-header">
        <div className="header-text">
          <h2>Rede de Abrigos</h2>
          <p>{shelters.length} abrigos encontrados</p>
        </div>

        <div className="controls-wrapper">
          <div className="search-box">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por nome ou cidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button onClick={() => setIsMapOpen(!isMapOpen)} className={`btn-map-toggle ${isMapOpen ? 'active' : ''}`}>
            <MapIcon size={20} />
            <span>{isMapOpen ? "Ocultar Mapa" : "Ver no Mapa"}</span>
          </button>
        </div>

        {isMapOpen && (
          <div className="map-wrapper-animated">
            <ShelterMap shelters={shelters} />
          </div>
        )}
      </div>

      <div className="shelter-grid">
        {shelters.map((s) => (
          <div key={s.id} className="shelter-card" onClick={() => setSelectedShelter(s)}>
            <div className="card-header-flex">
              <div className="vaga-badge">
                {s.capacity - (s.occupied_slots || 0)} Vagas Livres
              </div>
              <div className="card-features">
                {s.features?.split(',').map(feat => feat && (
                  <span key={feat} className="feature-dot">{iconMap[feat]}</span>
                ))}
              </div>
            </div>

            <div className="card-info">
              <h3>{s.name}</h3>
              <p><MapPin size={16} /> {s.city}</p>
            </div>

            <div className="progress-container">
              <div className="progress-label">
                <span>Ocupação</span>
                <span>{Math.round(((s.occupied_slots || 0) / s.capacity) * 100)}%</span>
              </div>
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${Math.min(((s.occupied_slots || 0) / s.capacity) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="card-actions">
              <button className="btn-route" onClick={(e) => openInGoogleMaps(e, s.address)}>
                <Navigation size={18} /> Rota
              </button>
              <button className="btn-delete-icon" onClick={(e) => handleDelete(e, s.id)}>
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedShelter && (
        <ShelterDetails
          shelter={selectedShelter}
          onClose={() => setSelectedShelter(null)}
          onUpdate={updateShelterData}
        />
      )}
    </section>
  );
}

export default ShelterList;