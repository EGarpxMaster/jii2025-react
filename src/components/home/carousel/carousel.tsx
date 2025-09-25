import { useState, useEffect } from 'react';
import './carousel.css';


// Tipo para el estado de carga de imágenes
type ImageLoadState = {
  loading: boolean;
  error: boolean;
};

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageLoadStates, setImageLoadStates] = useState<Record<number, ImageLoadState>>({});

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
      image: '/assets/images/carousel/staff.jpg',
      title: 'Staff de la JII2025',
      description: 'Equipo comprometido con la organización y éxito de la Jornada de Ingeniería Industrial 2025',
    },
    {
      image: '/assets/images/carousel/img4.jpg',
      title: 'Conoce nuestra historia',
      description: 'Historia de la Jornada de Ingenieria Industrial',
    },
  ];

  // Inicializar estados de carga
  useEffect(() => {
    const initialLoadStates: Record<number, ImageLoadState> = {};
    slides.forEach((_, index) => {
      initialLoadStates[index] = { loading: true, error: false };
    });
    setImageLoadStates(initialLoadStates);
  }, []);

  // Manejar carga exitosa de imagen
  const handleImageLoad = (index: number) => {
    setImageLoadStates(prev => ({
      ...prev,
      [index]: { loading: false, error: false }
    }));
  };

  // Manejar error de carga de imagen
  const handleImageError = (index: number, e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = '/assets/images/placeholder.jpg';
    setImageLoadStates(prev => ({
      ...prev,
      [index]: { loading: false, error: true }
    }));
  };

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
            {/* Skeleton que se muestra mientras carga la imagen */}
            {imageLoadStates[index]?.loading && (
              <div className="carousel-image-skeleton skeleton"></div>
            )}
            
            <img
              src={slide.image}
              alt={slide.title}
              className={`carousel-image ${imageLoadStates[index]?.loading ? 'loading' : 'loaded'}`}
              onLoad={() => handleImageLoad(index)}
              onError={(e) => handleImageError(index, e)}
              loading="lazy"
            />
            
            <div className="carousel-content">
              <h3 className="carousel-title">{slide.title}</h3>
              <p className="carousel-description">{slide.description}</p>
            </div>
          </div>
        ))}
        
        <button onClick={prevSlide} className="carousel-control prev" aria-label="Imagen anterior">
          <span className="carousel-control-icon">‹</span>
        </button>
        <button onClick={nextSlide} className="carousel-control next" aria-label="Siguiente imagen">
          <span className="carousel-control-icon">›</span>
        </button>
        
        <div className="carousel-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;