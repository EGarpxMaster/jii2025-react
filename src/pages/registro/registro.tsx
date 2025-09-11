import React, { useState } from "react";
import RegistroComponent from "../../components/forms/registro";
import AsistenciaComponent from "../../components/forms/asistencia";
import ConstanciaComponent from "../../components/forms/constancias";
import RegistroConcursoComponent from '../../components/forms/registro_concurso';
import "./registro.css";


type ActiveTab = "registro" | "asistencia" | "constancia" | "concurso";

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

            <button
              className={`tab-button ${activeTab === "concurso" ? "active" : ""}`}
              onClick={() => setActiveTab("concurso")}
              type="button"
            >
              <span className="tab-icon">⚽</span>
              <span className="tab-text">Concurso</span>
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
          {activeTab === "concurso" && (
            <RegistroConcursoComponent
              className="tab-component"
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default RegistroPage;