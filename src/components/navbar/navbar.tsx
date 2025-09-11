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

  // refs para scroll y rAF
  const lastScrollTopRef = useRef(0);
  const tickingRef = useRef(false);

  const closeNavbar = useCallback(() => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
  }, []);

  // Toggle dropdown
  const toggleDropdown = (dropdownId: string) => {
    setOpenDropdown((prev) => (prev === dropdownId ? null : dropdownId));
  };

  // Scroll (optimizado con rAF)
  const handleScroll = useCallback(() => {
    const work = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const goingDown = scrollTop > lastScrollTopRef.current;
      setNavbarHidden(goingDown && scrollTop > 150);
      lastScrollTopRef.current = Math.max(scrollTop, 0);
      tickingRef.current = false;
    };
    if (!tickingRef.current) {
      tickingRef.current = true;
      requestAnimationFrame(work);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Cerrar con Escape + devolver foco al botón
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setOpenDropdown(null);
        (document.querySelector(".menu-toggle") as HTMLButtonElement | null)?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Bloquear scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // resaltar link activo sin React Router (simple por pathname)
  const isActive = (href: string) =>
    typeof window !== "undefined" && window.location?.pathname === href;

  return (
    <nav className={`navbar ${navbarHidden ? "navbar-hidden" : ""}`} id="mainNav">
      <div className="navbar-container" role="navigation" aria-label="Principal">
        {/* Logo izquierdo */}
        <div className="navbar-logo">
          <a href="/"  aria-label="Ir a inicio">
            <img
              src="/assets/images/LogoUnificado_Blanco.png"
              alt="Logotipo de la Jornada de Ingeniería Industrial"
            />
          </a>
        </div>

        {/* Contenedor central para los enlaces */}
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
          <div className={`menu ${isMenuOpen ? "show" : ""}`} id="mainMenu">
            <div className="nav-item">
              <a
                href="/" id="homebtn"
                className={`nav-link ${isActive("/#") ? "is-active" : ""}`}
                onClick={closeNavbar}
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
              >
                <span>Nuestra Jornada</span>
                <FontAwesomeIcon icon={faChevronDown} className="dropdown-icon" />
              </button>

              <div
                id="submenu-nuestra-jornada"
                className={`dropdown-content ${openDropdown === "nuestraJornada" ? "show" : ""}`}
                role="menu"
                tabIndex={-1}
                onBlur={(e) => {
                  // cierra si el foco sale del contenedor
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
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
                href="/staff"
                className={`nav-link ${isActive("/staff") ? "is-active" : ""}`}
                onClick={closeNavbar}
              >
                <FontAwesomeIcon icon={faClock} className="home-icon" />
                Staff
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