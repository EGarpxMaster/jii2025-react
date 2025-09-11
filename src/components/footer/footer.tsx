import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFacebookF, 
  faInstagram, 
  faTiktok 
} from '@fortawesome/free-brands-svg-icons';
import './footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="text-white body-font">
      <div className="footer-container">
        <div className="footer-content">
          <a href="/" className="footer-logo">
            <img 
              src="/assets/images/LogoUnificado_Blanco.png" 
              alt="Logo Jornada de Ingeniería Industrial"
            />
            <span>Jornada de Ingeniería Industrial</span>
          </a>
          
          <div className="footer-social">
            {/* Facebook */}
            <a 
              href="https://www.facebook.com/profile.php?id=61550645371287" 
              target="_blank" 
              rel="noopener noreferrer"
              className="facebook" 
              aria-label="Síguenos en Facebook"
            >
              <FontAwesomeIcon icon={faFacebookF} className="social-icon" />
            </a>

            {/* Instagram */}
            <a 
              href="https://www.instagram.com/jornada_ing_industrial/" 
              target="_blank"
              rel="noopener noreferrer" 
              className="instagram" 
              aria-label="Síguenos en Instagram"
            >
              <FontAwesomeIcon icon={faInstagram} className="social-icon" />
            </a>

            {/* WhatsApp - Segundo contacto */}
            <a 
              href="https://www.tiktok.com/@jornada.ing.industrial" 
              target="_blank"
              rel="noopener noreferrer" 
              className="tiktok" 
              aria-label="@jornada.ing.industrial"
            >
              <FontAwesomeIcon icon={faTiktok} className="social-icon" />
            </a>
          </div>
        </div>
        
        <div className="footer-copyright">
          <p>© {currentYear} <a href="https://egarpxmaster.github.io/TechQuarters/">TechnoWards Company</a> - Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;