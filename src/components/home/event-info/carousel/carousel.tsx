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
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="carousel relative w-full overflow-hidden">
      <div className="carousel-inner relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`carousel-item absolute w-full h-full ${
              index === currentSlide ? 'active' : ''
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="carousel-caption">
              <h5>{slide.title}</h5>
              <p>{slide.description}</p>
            </div>
          </div>
        ))}

        {/* Control buttons */}
        <button
          onClick={prevSlide}
          className="carousel-control-prev"
          type="button"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true">
          </span>
          <span className="sr-only">Previous</span>
        </button>
        <button
          onClick={nextSlide}
          className="carousel-control-next"
          type="button"
        >
          <span className="carousel-control-next-icon" aria-hidden="true">
          </span>
          <span className="sr-only">Next</span>
        </button>

        {/* Indicators */}
        <div className="carousel-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target=""
              className={index === currentSlide ? 'active' : ''}
              onClick={() => setCurrentSlide(index)}
            >
              <span className="sr-only">Slide {index + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;