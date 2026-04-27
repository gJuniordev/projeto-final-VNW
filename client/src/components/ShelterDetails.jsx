import { useEffect, useRef, useState } from "react";
import {
  X,
  Phone,
  MapPin,
  Users,
  Clock,
  UserCheck,
  Dog,
  Accessibility,
  Zap,
  Bath,
} from "lucide-react";
import { gsap } from "gsap";
import Swal from "sweetalert2";
import api from "../services/api";
import "./ShelterDetails.css";

function ShelterDetails({ shelter, onClose, onUpdate }) {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const [userName, setUserName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mapeamento de ícones para os recursos
  const iconMap = {
    pet: { label: "Aceita Pets", icon: <Dog size={18} /> },
    pcd: { label: "Acessibilidade", icon: <Accessibility size={18} /> },
    energy: { label: "Energia/Gerador", icon: <Zap size={18} /> },
    bath: { label: "Banho Quente", icon: <Bath size={18} /> },
  };

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 },
    ).fromTo(
      modalRef.current,
      { y: 50, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" },
      "-=0.2",
    );
  }, []);

  const handleClose = () => {
    gsap.to(modalRef.current, {
      y: 30,
      opacity: 0,
      scale: 0.9,
      duration: 0.3,
      onComplete: onClose,
    });
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 });
  };

  const handleCheckIn = async () => {
    if (!userName.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Ops...",
        text: "Digite seu nome completo!",
        confirmButtonColor: "var(--primary)",
      });
    }

    setIsSubmitting(true);
    try {
      const res = await api.post(`/shelters/${shelter.id}/checkin`, {
        name: userName,
      });

      onUpdate(res.data);

      await Swal.fire({
        icon: "success",
        title: "Vaga Confirmada!",
        text: "Sua reserva foi feita com sucesso.",
        timer: 2000,
        showConfirmButton: false,
      });

      handleClose();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: err.response?.data?.error || "Erro ao realizar check-in",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!shelter) return null;

  // Processa os recursos salvos (ex: "pet,pcd")
  const featuresArray = shelter.features ? shelter.features.split(",") : [];

  return (
    <div className="modal-overlay" ref={overlayRef} onClick={handleClose}>
      <div
        className="modal-content"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={handleClose}>
          <X size={24} />
        </button>

        <div className="modal-header">
          <div className="badge-vagas">
            {shelter.capacity - (shelter.occupied_slots || 0)} vagas livres
          </div>
          <h2>{shelter.name}</h2>
          <p>
            <MapPin size={18} /> {shelter.city}
          </p>
        </div>

        <div className="modal-body">
          <div className="info-grid">
            <div className="info-item">
              <Users size={22} />
              <div>
                <span>Total</span>
                <strong>{shelter.capacity}</strong>
              </div>
            </div>
            <div className="info-item">
              <Clock size={22} />
              <div>
                <span>Ocupados</span>
                <strong>{shelter.occupied_slots || 0}</strong>
              </div>
            </div>
          </div>

          {/* NOVA SEÇÃO DE RECURSOS */}
          <div className="features-details-section">
            <h4>Recursos Disponíveis</h4>
            <div className="features-details-grid">
              {featuresArray.length > 0 ? (
                featuresArray.map((feat) => (
                  <div key={feat} className="feature-detail-card">
                    <span className="feature-detail-icon">
                      {iconMap[feat]?.icon}
                    </span>
                    <span className="feature-detail-text">
                      {iconMap[feat]?.label}
                    </span>
                  </div>
                ))
              ) : (
                <p className="no-features-text">
                  Informações de recursos não fornecidas.
                </p>
              )}
            </div>
          </div>

          <div className="checkin-form">
            <h3>
              <UserCheck size={20} /> Reservar Vaga
            </h3>
            <div className="checkin-container">
              <input
                type="text"
                placeholder="Seu nome completo"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="checkin-input"
              />
              <button
                onClick={handleCheckIn}
                disabled={isSubmitting}
                className="btn-primary-modal"
              >
                {isSubmitting ? "..." : "Reservar"}
              </button>
            </div>
          </div>

          <a
            href={`tel:${shelter.phone || shelter.contact_phone}`}
            className="btn-contact-outline"
          >
            <Phone size={20} /> Ligar para o abrigo
          </a>
        </div>
      </div>
    </div>
  );
}

export default ShelterDetails;
