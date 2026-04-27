import { useState } from "react";
import api from "../services/api"; 
import { Save, X, Dog, Accessibility, Zap, Bath } from "lucide-react";
import Swal from "sweetalert2";
import "./RegisterShelter.css";

function RegisterShelter({ onCancel, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    capacity: "",
    address: "",
    phone: "",
  });

  const [selectedFeatures, setSelectedFeatures] = useState([]);

  const resourceOptions = [
    { id: "pet", label: "Aceita Pets", icon: <Dog size={18} /> },
    { id: "pcd", label: "Acessibilidade", icon: <Accessibility size={18} /> },
    { id: "energy", label: "Energia/Gerador", icon: <Zap size={18} /> },
    { id: "bath", label: "Banho Quente", icon: <Bath size={18} /> },
  ];

  const toggleFeature = (id) => {
    if (selectedFeatures.includes(id)) {
      setSelectedFeatures(selectedFeatures.filter((item) => item !== id));
    } else {
      setSelectedFeatures([...selectedFeatures, id]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Enviando para o backend real
      await api.post("/shelters", {
        ...formData,
        features: selectedFeatures.join(","),
      });

      Swal.fire({
        title: "Sucesso!",
        text: "Abrigo cadastrado com sucesso!",
        icon: "success",
        confirmButtonColor: "var(--primary)",
      });

      onSuccess(); 
    } catch (error) {
      Swal.fire("Erro!", "Não foi possível conectar ao servidor.", "error");
    }
  };

  return (
    <div className="register-container">
      <div className="register-header">
        <h2>Cadastrar Novo Abrigo</h2>
        <p>Preencha as informações para disponibilizar novas vagas.</p>
      </div>

      <form onSubmit={handleSubmit} className="register-form">
        <div className="input-row">
          <div className="input-group">
            <label>Nome do Abrigo</label>
            <input
              type="text"
              placeholder="Ex: Ginásio Municipal"
              required
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label>Cidade</label>
            <input
              type="text"
              placeholder="Ex: Porto Alegre"
              required
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
          </div>
        </div>

        <div className="input-group">
          <label>Endereço Completo</label>
          <input
            type="text"
            placeholder="Rua, número, bairro..."
            required
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>

        <div className="input-row">
          <div className="input-group">
            <label>Capacidade Total</label>
            <input
              type="number"
              placeholder="Ex: 50"
              required
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label>Telefone</label>
            <input
              type="text"
              placeholder="(00) 00000-0000"
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        <div className="features-section">
          <label>Recursos e Facilidades:</label>
          <div className="features-grid">
            {resourceOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`feature-btn ${selectedFeatures.includes(opt.id) ? "active" : ""}`}
                onClick={() => toggleFeature(opt.id)}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="register-actions">
          <button type="button" className="btn-cancel" onClick={onCancel}>
            <X size={20} /> Cancelar
          </button>
          <button type="submit" className="btn-submit">
            <Save size={20} /> Salvar Abrigo
          </button>
        </div>
      </form>
    </div>
  );
}

export default RegisterShelter;