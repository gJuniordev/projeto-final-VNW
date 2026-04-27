import { useEffect, useState, useRef } from "react";
import "./App.css";
import {
  Home,
  LayoutGrid,
  PlusCircle,
  Moon,
  Sun,
  MapPin,
  AlertCircle,
  HeartHandshake,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { gsap } from "gsap";

// Importações dos componentes de Abrigo
import RegisterShelter from "./components/RegisterShelter";
import ShelterList from "./components/ShelterList";

function App() {
  const [view, setView] = useState("landing");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const mainRef = useRef(null);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    gsap.fromTo(
      mainRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
    );
  }, [view]);

  return (
    <div className="app-wrapper">
      {/* SIDEBAR DESKTOP */}
      <aside className="sidebar">
        <div className="brand">ApoioDF+</div>
        <nav className="nav-menu">
          <button
            className={`nav-link ${["landing", "phones"].includes(view) ? "active" : ""}`}
            onClick={() => setView("landing")}
          >
            <Home size={20} /> <span>Início</span>
          </button>
          <button
            className={`nav-link ${view === "list" ? "active" : ""}`}
            onClick={() => setView("list")}
          >
            <LayoutGrid size={20} /> <span>Lista de Abrigos</span>
          </button>
          <button
            className={`nav-link ${view === "register" ? "active" : ""}`}
            onClick={() => setView("register")}
          >
            <PlusCircle size={20} /> <span>Cadastrar Abrigo</span>
          </button>
        </nav>
        <button className="theme-switcher" onClick={toggleTheme}>
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          <span>{theme === "light" ? "Modo Escuro" : "Modo Claro"}</span>
        </button>
      </aside>

      {/* NAV MOBILE */}
      <nav className="mobile-nav">
        <button
          className={["landing", "phones"].includes(view) ? "active" : ""}
          onClick={() => setView("landing")}
        >
          <Home size={24} />
        </button>
        <button
          className={view === "list" ? "active" : ""}
          onClick={() => setView("list")}
        >
          <LayoutGrid size={24} />
        </button>
        <button
          className={view === "register" ? "active" : ""}
          onClick={() => setView("register")}
        >
          <PlusCircle size={24} />
        </button>
        <button onClick={toggleTheme}>
          {theme === "light" ? <Moon size={24} /> : <Sun size={24} />}
        </button>
      </nav>

      <main className="main-content" ref={mainRef}>
        {/* TELA INICIAL */}
        {view === "landing" && (
          <section className="hero-section">
            <div className="hero-badge">Portal de Apoio Emergencial</div>
            <h1>
              Sistema de Gestão de <br /> <span>Abrigos e Resgate</span>
            </h1>

            <div className="landing-container">
              {/* CARD: BUSCAR ABRIGO */}
              <div className="action-card" onClick={() => setView("list")}>
                <div
                  className="action-icon-wrapper"
                  style={{ background: "var(--primary)", color: "white" }}
                >
                  <MapPin size={32} />
                </div>
                <div className="action-info">
                  <h2>Preciso de um abrigo</h2>
                  <p>
                    Localize locais seguros com vagas disponíveis e informações
                    de contato.
                  </p>
                </div>
                <ChevronRight className="chevron-right" />
              </div>

              {/* CARD: CADASTRAR ABRIGO */}
              <div className="action-card" onClick={() => setView("register")}>
                <div className="action-icon-wrapper icon-help">
                  <HeartHandshake size={32} />
                </div>
                <div className="action-info">
                  <h2>Quero cadastrar um abrigo</h2>
                  <p>
                    Disponibilize novas vagas e ajude na organização do
                    acolhimento.
                  </p>
                </div>
                <ChevronRight className="chevron-right" />
              </div>

              {/* CARD: TELEFONES ÚTEIS */}
              <div className="action-card" onClick={() => setView("phones")}>
                <div className="action-icon-wrapper icon-info">
                  <AlertCircle size={32} />
                </div>
                <div className="action-info">
                  <h2>Telefones de Emergência</h2>
                  <p>
                    Números da Defesa Civil, Bombeiros e SAMU para suporte
                    imediato.
                  </p>
                </div>
                <ChevronRight className="chevron-right" />
              </div>
            </div>
          </section>
        )}

        {/* TELA DE TELEFONES */}
        {view === "phones" && (
          <section>
            <div style={{ marginBottom: "2rem" }}>
              <h2>Contatos de Urgência</h2>
              <p style={{ color: "var(--text-muted)" }}>
                Canais oficiais para resgate e orientação em desastres.
              </p>
            </div>
            <div className="shelter-grid">
              <div className="card">
                <h3 style={{ color: "#ef4444" }}>193</h3>
                <p style={{ fontWeight: "bold", margin: "0.5rem 0" }}>
                  Bombeiros
                </p>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--text-muted)",
                    marginBottom: "1.5rem",
                  }}
                >
                  Resgate e salvamento em áreas de risco.
                </p>
                <a
                  href="tel:193"
                  className="btn-call"
                  style={{ background: "#ef4444" }}
                >
                  Ligar Agora
                </a>
              </div>
              <div className="card">
                <h3 style={{ color: "var(--primary)" }}>199</h3>
                <p style={{ fontWeight: "bold", margin: "0.5rem 0" }}>
                  Defesa Civil
                </p>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--text-muted)",
                    marginBottom: "1.5rem",
                  }}
                >
                  Alertas de risco e suporte logístico.
                </p>
                <a href="tel:199" className="btn-call">
                  Ligar Agora
                </a>
              </div>
              <div className="card">
                <h3 style={{ color: "#10b981" }}>192</h3>
                <p style={{ fontWeight: "bold", margin: "0.5rem 0" }}>SAMU</p>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--text-muted)",
                    marginBottom: "1.5rem",
                  }}
                >
                  Emergências médicas e ambulâncias.
                </p>
                <a
                  href="tel:192"
                  className="btn-call"
                  style={{ background: "#10b981" }}
                >
                  Ligar Agora
                </a>
              </div>
            </div>
            <button
              className="btn-ghost"
              style={{ marginTop: "2rem", width: "auto", padding: "12px 24px" }}
              onClick={() => setView("landing")}
            >
              Voltar ao Início
            </button>
          </section>
        )}

        {/* COMPONENTES DE ABRIGOS */}
        {view === "list" && <ShelterList onBack={() => setView("landing")} />}

        {view === "register" && (
          <RegisterShelter
            onCancel={() => setView("landing")}
            onSuccess={() => setView("list")}
          />
        )}
      </main>
    </div>
  );
}

export default App;
