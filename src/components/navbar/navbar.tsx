import { useEffect, useRef, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faClock,
  faPersonRunning,
  faAward,
  faAddressCard,
  faPeopleGroup,
  faHome,
} from "@fortawesome/free-solid-svg-icons";
import "./navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [navbarHidden, setNavbarHidden] = useState(false);

  // refs para scroll
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const closeNavbar = useCallback(() => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
  }, []);

  // Toggle dropdown
  const toggleDropdown = (dropdownId: string) => {
    setOpenDropdown((prev) => (prev === dropdownId ? null : dropdownId));
  };

  // Scroll handling - CORREGIDO
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    if (!ticking.current) {
      ticking.current = true;
      requestAnimationFrame(() => {
        // Determinar dirección del scroll
        const scrollingDown = currentScrollY > lastScrollY.current;
        const scrollingUp = currentScrollY < lastScrollY.current;

        // Ocultar navbar al bajar, mostrar al subir
        if (scrollingDown && currentScrollY > 100) {
          setNavbarHidden(true);
        } else if (scrollingUp) {
          setNavbarHidden(false);
        }

        lastScrollY.current = currentScrollY;
        ticking.current = false;
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Cerrar con Escape
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeNavbar();
        (document.querySelector(".menu-toggle") as HTMLButtonElement | null)?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeNavbar]);

  // Bloquear scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }
    
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isMenuOpen]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown === "nuestraJornada") {
        const dropdown = document.getElementById('submenu-nuestra-jornada');
        const button = document.querySelector('.dropdown-header');
        
        if (dropdown && 
            button && 
            !dropdown.contains(event.target as Node) &&
            !button.contains(event.target as Node)) {
          setOpenDropdown(null);
        }
      }
    };

    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  // resaltar link activo
  const isActive = (href: string) =>
    typeof window !== "undefined" && window.location?.pathname === href;

  return (
    <nav className={`navbar ${navbarHidden ? "navbar-hidden" : ""}`} id="mainNav">
          <div className="navbar-container" role="navigation" aria-label="Principal">
      {/* Logo izquierdo */}
      <div className="navbar-logo">
        <a href="/" aria-label="Ir a inicio">
          <img
            src="/assets/images/LogoUnificado_Blanco.png"
            alt="Logotipo de la Jornada de Ingeniería Industrial"
          />
        </a>
      </div>
      <div className="nav-links-container">
        {/* Toggle móvil */}
        <button
          className="menu-toggle"
          aria-label={isMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
          aria-controls="mainMenu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((v) => !v)}
        >
          <span className="hamburger-box">
            <span className="hamburger-inner" />
          </span>
          <span className="menu-text">Menú</span>
        </button>

          {/* Menú */}
          <div 
            className={`menu ${isMenuOpen ? "show" : ""}`} 
            id="mainMenu"
            onScroll={(e) => {
              // Prevenir que el scroll se propague al body
              e.stopPropagation();
            }}
          >
            <div className="mobile-home-btn" id="init">
              <a
                href="/"
                className="nav-link"
                onClick={closeNavbar}
                aria-label="Ir a inicio"
              >
                <FontAwesomeIcon icon={faHome} className="home-icon" />
                Inicio
              </a>
            </div>
            {/* Dropdown: Nuestra Jornada */}
            <div className="nav-item dropdown">
              <button
                className="nav-link dropdown-header"
                aria-expanded={openDropdown === "nuestraJornada"}
                aria-controls="submenu-nuestra-jornada"
                onClick={() => toggleDropdown("nuestraJornada")}
                onMouseEnter={(e) => {
                  // Prevenir que se abra con hover
                  e.stopPropagation();
                }}
              >
                <span>Nuestra Jornada</span>
                <FontAwesomeIcon 
                  icon={faChevronDown} 
                  className={`dropdown-icon ${openDropdown === "nuestraJornada" ? "rotated" : ""}`}
                />
              </button>
                  <div
                  id="submenu-nuestra-jornada"
                  className={`dropdown-content ${openDropdown === "nuestraJornada" ? "show" : ""}`}
                  role="menu"
                  tabIndex={-1}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                      setOpenDropdown(null);
                    }
                  }}
                  onMouseLeave={() => {
                    // Cerrar el dropdown cuando el mouse sale (opcional)
                    if (openDropdown === "nuestraJornada") {
                      setOpenDropdown(null);
                    }
                  }}
                >
                <a href="#acerca" className="dropdown-item" onClick={closeNavbar} role="menuitem">
                  Acerca de
                </a>
                <a href="#objetivo" className="dropdown-item" onClick={closeNavbar} role="menuitem">
                  Objetivo general
                </a>
                <a href="#publico" className="dropdown-item" onClick={closeNavbar} role="menuitem">
                  Público objetivo
                </a>
                <a href="#mision" className="dropdown-item" onClick={closeNavbar} role="menuitem">
                  Misión
                </a>
                <a href="#vision" className="dropdown-item" onClick={closeNavbar} role="menuitem">
                  Visión
                </a>
              </div>
            </div>

            <div className="nav-item">
              <a
                href="/historia"
                className={`nav-link ${isActive("/historia") ? "is-active" : ""}`}
                onClick={closeNavbar}
              >
                <FontAwesomeIcon icon={faClock} className="home-icon" />
                Historia
              </a>
            </div>

            <div className="nav-item">
              <a
                href="/actividades"
                className={`nav-link ${isActive("/actividades") ? "is-active" : ""}`}
                onClick={closeNavbar}
              >
                <FontAwesomeIcon icon={faPersonRunning} className="home-icon" />
                Actividades
              </a>
            </div>

            <div className="nav-item">
              <a
                href="/concurso"
                className={`nav-link ${isActive("/concurso") ? "is-active" : ""}`}
                onClick={closeNavbar}
              >
                <FontAwesomeIcon icon={faAward} className="home-icon" />
                Concurso
              </a>
            </div>

            <div className="nav-item">
              <a
                href="/constancias"
                className={`nav-link ${isActive("/constancias") ? "is-active" : ""}`}
                onClick={closeNavbar}
              >
                <FontAwesomeIcon icon={faAddressCard} className="home-icon" />
                Constancias
              </a>
            </div>

            <div className="nav-item">
              <a
                href="/aliados"
                className={`nav-link ${isActive("/aliados") ? "is-active" : ""}`}
                onClick={closeNavbar}
              >
                <FontAwesomeIcon icon={faPeopleGroup} className="home-icon" />
                Aliados
              </a>
            </div>

            <div className="nav-item">
              <a
                href="/registro"
                className="nav-link btn-registro"
                onClick={closeNavbar}
              >
                Registro
              </a>
            </div>
          </div>
        </div>

        {/* Logo derecho */}
        <div className="navbar-logo2">
          <a href="https://unicaribe.mx/" aria-label="Ir al sitio de Universidad del Caribe">
            <img src="/assets/images/LogoUnicaribe_Blanco.png" alt="Logotipo Universidad del Caribe" />
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;