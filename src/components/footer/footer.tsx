import './footer.css';

function Footer() {
  return (
    <footer id="footer" className="text-white body-font">
      <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
        <a className="flex title-font font-medium items-center md:justify-start justify-center text-white">
          <img 
            src="/assets/images/LogoUnificado_Blanco.png" 
            className="w-20 h-10 p-2 rounded-full" 
            alt="Logo Jornada de Ingeniería Industrial"
          />
          <span className="ml-3 text-xl">Jornada de Ingeniería Industrial</span>
        </a>
        <p className="text-sm sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-white sm:border-opacity-30 sm:py-2 sm:mt-0 mt-4">
          © 2025 <a href="#">EGarpx Company</a>
        </p>
        <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
          <a 
            href="https://www.facebook.com/profile.php?id=61550645371287" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-blue-200 transition-colors duration-300" 
            aria-label="Facebook"
          >
            <i className="fab fa-facebook-f w-5 h-5 text-lg"></i>
          </a>

          <a 
            href="https://www.instagram.com/jornada_ing_industrial/" 
            target="_blank"
            rel="noopener noreferrer" 
            className="ml-3 text-white hover:text-pink-200 transition-colors duration-300" 
            aria-label="Instagram"
          >
            <i className="fab fa-instagram w-5 h-5 text-lg"></i>
          </a>

          <a 
            href="https://wa.me/529982288611" 
            target="_blank"
            rel="noopener noreferrer" 
            className="ml-3 text-white hover:text-green-200 transition-colors duration-300" 
            aria-label="Chat en WhatsApp con primer contacto"
          >
            <i className="fab fa-whatsapp w-5 h-5 text-lg"></i>
          </a>

          <a 
            href="https://wa.me/529983982543" 
            target="_blank"
            rel="noopener noreferrer" 
            className="ml-3 text-white hover:text-green-200 transition-colors duration-300" 
            aria-label="Chat en WhatsApp con segundo contacto"
          >
            <i className="fab fa-whatsapp w-5 h-5 text-lg"></i>
          </a>
        </span>
      </div>
    </footer>
  );
}

export default Footer;
