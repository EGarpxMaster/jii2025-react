import { useState, useEffect, useCallback } from 'react';
import './navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [navbarTransform, setNavbarTransform] = useState('translateY(0)');

  const closeNavbar = useCallback(() => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
  }, []);

  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 150) {
      setNavbarTransform('translateY(-100%)');
    } else {
      setNavbarTransform('translateY(0)');
    }

    setLastScrollTop(scrollTop);
  }, [lastScrollTop]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const toggleDropdown = (dropdownId: string) => {
    setOpenDropdown(openDropdown === dropdownId ? null : dropdownId);
  };

  return (
    <nav className="navbar" id="mainNav" style={{ transform: navbarTransform }}>
      <div className="navbar-logo">
        <a href="index.html">
          <img src="/assets/images/LogoUnificado_Blanco.png" alt="Logotipo de la Jornada de Ingeniería Industrial" />
        </a>
      </div>

      <button 
        className="menu-toggle" 
        aria-label="Abrir menú de navegación" 
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        &#9776;
      </button>

      <div className={`menu ${isMenuOpen ? 'show' : ''}`} id="mainMenu">
        <div className="nav-item dropdown">
          <a 
            href="#" 
            className="nav-link dropdown-header"
            onClick={(e) => {
              e.preventDefault();
              toggleDropdown('nuestraJornada');
            }}
          >
            Nuestra Jornada
            <span className="dropdown-icon">▼</span>
          </a>
          <div className={`dropdown-content ${openDropdown === 'nuestraJornada' ? 'show' : ''}`}>
            <a href="#acerca" className="dropdown-item" onClick={closeNavbar}>Acerca de</a>
            <a href="#objetivo" className="dropdown-item" onClick={closeNavbar}>Objetivo general</a>
            <a href="#publico" className="dropdown-item" onClick={closeNavbar}>Público objetivo</a>
            <a href="#mision" className="dropdown-item" onClick={closeNavbar}>Misión</a>
            <a href="#vision" className="dropdown-item" onClick={closeNavbar}>Visión</a>
          </div>
        </div>

        <div className="nav-item">
          <a href="/historia" className="nav-link" onClick={closeNavbar}>Historia</a>
        </div>

        <div className="nav-item">
          <a href="/actividades" className="nav-link" onClick={closeNavbar}>Actividades</a>
        </div>

        <div className="nav-item">
          <a href="/concurso" className="nav-link" onClick={closeNavbar}>Concurso</a>
        </div>

        <div className="nav-item">
          <a href="/constancias" className="nav-link" onClick={closeNavbar}>Constancias</a>
        </div>

        <div className="nav-item">
          <a href="/aliados" className="nav-link" onClick={closeNavbar}>Aliados</a>
        </div>

        <div className="nav-item">
          <a href="/registro" className="nav-link btn-registro" onClick={closeNavbar}>Registro</a>
        </div>
      </div>

      <div className="navbar-logo2">
        <a href="https://unicaribe.mx/">
          <img src="/assets/images/LogoUnicaribe_Blanco.png" alt="Logotipo Universidad del Caribe" />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;