import React, { useState, useRef, useEffect } from "react";
import RegistroComponent from "../../components/forms/registro";
import WorkshopComponent from "../../components/forms/workshop";
import AsistenciaComponent from "../../components/forms/asistencia";
import ConstanciaComponent from "../../components/forms/constancias";
import RegistroConcursoComponent from "../../components/forms/registro_concurso";
import "./registro.css";

type ActiveTab = "registro" | "workshop" | "asistencia" | "constancia" | "concurso";

const RegistroPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("registro");
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  const handleRegistroSuccess = () => {
    setTimeout(() => setActiveTab("asistencia"), 3000);
  };

  const checkScrollButtons = () => {
    if (tabsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth); // Solo mostrar si hay más contenido para desplazarse
    }
  };



  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
      const maxScrollLeft = scrollWidth - clientWidth;

      // Desplazarse al final de los tabs solo si hay más contenido por mostrar
      const newScrollLeft = direction === 'left'
        ? 0 // Ir al inicio
        : maxScrollLeft; // Ir al final si es posible

      // Solo hacer scroll si no estamos ya al final
      if (scrollLeft !== newScrollLeft) {
        tabsRef.current.scrollTo({
          left: newScrollLeft,
          behavior: 'smooth',
        });
      }
    }
  };



  const scrollToActiveTab = () => {
    if (tabsRef.current) {
      const activeTabElement = tabsRef.current.querySelector('.tab-button.active') as HTMLElement;
      if (activeTabElement) {
        const containerRect = tabsRef.current.getBoundingClientRect();
        const activeTabRect = activeTabElement.getBoundingClientRect();
        const scrollLeft = activeTabElement.offsetLeft - (containerRect.width / 2) + (activeTabRect.width / 2);
        
        tabsRef.current.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, []);

  useEffect(() => {
    const tabsElement = tabsRef.current;
    if (tabsElement) {
      tabsElement.addEventListener('scroll', checkScrollButtons);
      return () => tabsElement.removeEventListener('scroll', checkScrollButtons);
    }
  }, []);


  useEffect(() => {
    // Scroll to active tab when it changes
    setTimeout(scrollToActiveTab, 100);
  }, [activeTab]);

  return (
    <main className="w-full mt-[0px] md:mt-[0px]">
      <div className="registro-combined-page">
        {/* Navigation Tabs */}
        <div className="tabs-container">
          <div className={`tabs-navigation ${showLeftArrow ? 'show-left-gradient' : ''} ${showRightArrow ? 'show-right-gradient' : ''}`}>
            {showLeftArrow && (
              <button 
                className="scroll-arrow scroll-arrow-left"
                onClick={() => scrollTabs('left')}
                type="button"
                aria-label="Scroll tabs left"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15,18 9,12 15,6"></polyline>
                </svg>
              </button>
            )}
            
            <div className="tabs-wrapper" ref={tabsRef} onScroll={checkScrollButtons}>
              <button
                className={`tab-button ${activeTab === "registro" ? "active" : ""}`}
                onClick={() => setActiveTab("registro")}
                type="button"
              >
                <span className="tab-icon">📝</span>
                <span className="tab-text">Registro</span>
              </button>
              <button
                className={`tab-button ${activeTab === "workshop" ? "active" : ""}`}
                onClick={() => setActiveTab("workshop")}
                type="button"
              >
                <span className="tab-icon">⚙️</span>
                <span className="tab-text">Workshop</span>
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

            {showRightArrow && (
              <button 
                className="scroll-arrow scroll-arrow-right"
                onClick={() => scrollTabs('right')}
                type="button"
                aria-label="Scroll tabs right"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9,18 15,12 9,6"></polyline>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="tab-content">
          {activeTab === "registro" && (
            <RegistroComponent onSuccess={handleRegistroSuccess} className="tab-component" />
          )}
          {activeTab === "workshop" && (
            <WorkshopComponent className="tab-component" showHeader={false} />
          )}
          {activeTab === "asistencia" && (
            <AsistenciaComponent className="tab-component" showHeader={false} />
          )}
          {activeTab === "constancia" && (
            <ConstanciaComponent className="tab-component" showHeader={false} />
          )}
          {activeTab === "concurso" && (
            <RegistroConcursoComponent className="tab-component" />
          )}
        </div>
      </div>
    </main>
  );
};

export default RegistroPage;
