import { useState, useEffect } from 'react';
import './carousel.css';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: '/assets/images/carousel/comite.jpg',
      title: 'Comité Organizador',
      description: 'Equipo responsable de la Jornada de Ingeniería Industrial 2025',
    },
    {
      image: '/assets/images/carousel/img1.jpg',
      title: 'Actividades Académicas',
      description: 'Ponencias y talleres para el desarrollo profesional',
    },
    {
      image: '/assets/images/carousel/img2.jpg',
      title: 'Participación Estudiantil',
      description: 'Involucramiento activo de los futuros ingenieros industriales',
    },
    {
      image: '/assets/images/carousel/img3.jpg',
      title: 'Concursos y Sorteos',
      description: 'Para el cierre de la Jornada se realizan concursos y sorteos con diversos premios',
    },
    {
      image: '/assets/images/carousel/img4.jpg',
      title: 'Conoce nuestra historia',
      description: 'Historia de la Jornada de Ingenieria Industrial',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="carousel">
      <div className="carousel-inner">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="carousel-image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/assets/images/placeholder.jpg';
              }}
            />
            <div className="carousel-content">
              <h3 className="carousel-title">{slide.title}</h3>
              <p className="carousel-description">{slide.description}</p>
            </div>
          </div>
        ))}
        
        <button onClick={prevSlide} className="carousel-control prev">
          <span className="carousel-control-icon">‹</span>
        </button>
        <button onClick={nextSlide} className="carousel-control next">
          <span className="carousel-control-icon">›</span>
        </button>
        
        <div className="carousel-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;