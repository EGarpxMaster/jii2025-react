import React, { useState } from "react";
import RegistroComponent from "../../components/registro/registro";
import AsistenciaComponent from "../../components/asistencia/asistencia";
import ConstanciaComponent from "../../components/constancias/constancias";
import "./registro.css";

type ActiveTab = "registro" | "asistencia" | "constancia";

const RegistroPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("registro");

  const handleRegistroSuccess = () => {
    // Cambiar automáticamente a la pestaña de asistencia después del registro exitoso
    setTimeout(() => {
      setActiveTab("asistencia");
    }, 3000);
  };

  return (
    <main className="w-full mt-[0px] md:mt-[0px]">
      <div className="registro-combined-page">
        {/* Navigation Tabs */}
        <div className="tabs-container">
          <div className="tabs-wrapper">
            <button
              className={`tab-button ${activeTab === "registro" ? "active" : ""}`}
              onClick={() => setActiveTab("registro")}
              type="button"
            >
              <span className="tab-icon">📝</span>
              <span className="tab-text">Registro</span>
            </button>
            <button
              className={`tab-button ${activeTab === "asistencia" ? "active" : ""}`}
              onClick={() => setActiveTab("asistencia")}
              type="button"
            >
              <span className="tab-icon">📋</span>
              <span className="tab-text">Asistencia</span>
            </button>
            <button
              className={`tab-button ${activeTab === "constancia" ? "active" : ""}`}
              onClick={() => setActiveTab("constancia")}
              type="button"
            >
              <span className="tab-icon">🏆</span>
              <span className="tab-text">Constancia</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="tab-content">
          {activeTab === "registro" && (
            <RegistroComponent 
              onSuccess={handleRegistroSuccess}
              className="tab-component"
            />
          )}
          {activeTab === "asistencia" && (
            <AsistenciaComponent 
              className="tab-component"
              showHeader={false}
            />
          )}
          {activeTab === "constancia" && (
            <ConstanciaComponent 
              className="tab-component"
              showHeader={false}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default RegistroPage;