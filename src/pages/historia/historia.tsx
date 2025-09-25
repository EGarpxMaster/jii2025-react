import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Añade esta importación
import "./historia.css";
import { motion } from 'framer-motion';
import { AnimatedH1, AnimatedH2, AnimatedParagraph } from '../../components/animations';
import { 
  SlideLeftContainer,
  SlideRightContainer
} from '../../components/animations';
import {
  ScrollSlideUp
} from '../../components/animations';


// Definición de tipos
type Variant = "A" | "B";
type MobileMode = "same" | "stack";

function GalleryMosaic({
  variant = "A",
  mobileMode = "stack",
}: { variant?: Variant; mobileMode?: MobileMode }) {
  const navigate = useNavigate(); // Añade esto
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);
  const [hoverPosition, setHoverPosition] = useState<{x: number, y: number}>({x: 0, y: 0});
  const spansA = [
    "lg:col-span-4 lg:row-span-2",
    "lg:col-span-2 lg:row-span-1",
    "lg:col-span-2 lg:row-span-2",
    "lg:col-span-2 lg:row-span-1",
    "lg:col-span-3 lg:row-span-2",
    "lg:col-span-3 lg:row-span-1",
    "lg:col-span-2 lg:row-span-1",
  ];

  const spansB = [
    "lg:col-span-3 lg:row-span-2",
    "lg:col-span-3 lg:row-span-2",
    "lg:col-span-2 lg:row-span-1",
    "lg:col-span-4 lg:row-span-1",
    "lg:col-span-2 lg:row-span-2",
    "lg:col-span-2 lg:row-span-1",
    "lg:col-span-2 lg:row-span-1",
  ];

  const GALLERY_IMAGES = [
    {
      src: "/assets/images/galeria/2024/G30_2024.jpg",
      alt: "Conferencia principal con expertos internacionales",
      title: "Conferencia Principal"
    },
    {
      src: "/assets/images/galeria/2024/G4_2024.jpg",
      alt: "Taller práctico sobre innovación industrial",
      title: "Taller Práctico"
    },
    {
      src: "/assets/images/galeria/2023/G22_2023.jpg",
      alt: "Networking entre participantes y profesionales",
      title: "Sesión de Networking"
    },
    {
      src: "/assets/images/galeria/2023/G15_2023.jpg",
      alt: "Exposición de proyectos estudiantiles innovadores",
      title: "Exposición de Proyectos"
    },
    {
      src: "/assets/images/galeria/2023/G25_2023.jpg",
      alt: "Panel de expertos discutiendo tendencias industriales",
      title: "Panel de Expertos"
    },
    {
      src: "/assets/images/galeria/2024/G9_2024.jpg",
      alt: "Entrega de reconocimientos a los mejores proyectos",
      title: "Entrega de Reconocimientos"
    },
    {
      src: "/assets/images/galeria/2023/G21_2023.jpg", // Agrega una URL real
      alt: "Estudiantes presentando proyectos innovadores",
      title: "Presentación de Proyectos"
    },

  ];

  const spans = variant === "A" ? spansA : spansB;

  useEffect(() => {
    setImagesLoaded(new Array(GALLERY_IMAGES.length).fill(false));
  }, []);

  const handleImageLoad = (index: number) => {
    setImagesLoaded(prev => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setHoverPosition({x, y});
  };

  const gridBase = mobileMode === "same"
    ? "gallery-grid grid grid-cols-2 sm:grid-cols-3 gap-4 md:grid-cols-4 lg:grid-cols-6 gap-3 "
    : "gallery-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4";

  const getHeightClass = (index: number) => {
    if (mobileMode === "same") {
      return "h-40 sm:h-48 md:h-40 lg:h-48 xl:h-56";
    }
    
    switch(index % 7) {
      case 0: return "h-56 sm:h-48 md:h-56 lg:h-72";
      case 1: return "h-48 sm:h-56 md:h-48 lg:h-52";
      case 2: return "h-52 sm:h-44 md:h-52 lg:h-96";
      case 3: return "h-44 sm:h-48 md:h-44 lg:h-72";
      case 4: return "h-48 sm:h-56 m:h-52 lg:h-64";
      case 5: return "h-60 sm:h-40 md:h-60 lg:h-64";
      case 6: return "h-40 sm:h-48 md:h-44 lg:h-72";
      
      default: return "h-40";
    }
  };

  const getMobileSpan = (index: number) => {
    if (mobileMode === "same") return "";
    
    switch(index % 6) {
      case 0: return "sm:col-span-2 sm:row-span-2";
      case 4: return "sm:col-span-2";
      case 5: return "sm:col-span-2";
      default: return "";
    }
  };

  return (
    <section className="text-gray-700 body-font bg-white">
      <div className="container px-4 sm:px-8 py-12">
        <div className="text-center mb-12 mt-8">
          <motion.h2
            className="historia-h2 font-bold title-font text-gray-900 mb-4 p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Galería de Momentos
          </motion.h2>
          <div className="flex mt-2 justify-center">
            <div className="w-16 h-1 rounded-full bg-[#00d4d4] inline-flex"></div>
          </div>
          <p className="max-w-2xl mx-auto mt-6 historia-text-lg">
            Algunos de los mejores momentos de nuestras jornadas
          </p>
        </div>

        <div className={`${gridBase}`}>
          {GALLERY_IMAGES.map((image, i) => (
            <div
              key={i}
              className={`gallery-item ${getHeightClass(i)} ${getMobileSpan(i)} ${spans[i]}`}
              onMouseMove={handleMouseMove}
              style={{ 
                '--x': `${hoverPosition.x}%`,
                '--y': `${hoverPosition.y}%`
              } as React.CSSProperties}
            >
              {!imagesLoaded[i] && (
                <div className="absolute inset-0 historia-skeleton historia-gallery-skeleton"></div>
              )}
              
              <motion.img
                src={image.src}
                alt={image.alt}
                className="gallery-image"
                loading="lazy"
                decoding="async"
                onLoad={() => handleImageLoad(i)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ opacity: imagesLoaded[i] ? 1 : 0 }}
              />
              
              {imagesLoaded[i] && (
                <>
                  <div className="gallery-overlay">
                    <div className="gallery-content">
                      <h3 className="gallery-title">{image.title}</h3>
                      <p className="gallery-description">
                        {image.alt}
                      </p>
                    </div>
                  </div>
                  
                  <div className="gallery-badge sm:hidden">
                    {image.title}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-center pb-12 pt-12">
          <button 
            onClick={() => navigate("/galeria")} 
            id="btn_galery" 
            className="inline-flex items-center text-white px-3 py-3 rounded-full font-medium text-lg"
          >
            Ver galería completa
            <svg className="w-5 h-5 ml-3" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

// Componente principal Historia
export default function Historia() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<{[key: string]: boolean}>({});
  
  // Efecto para la barra de progreso de scroll
  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollPx = document.documentElement.scrollTop;
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (scrollPx / winHeightPx) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  const handleImageLoad = (imageKey: string) => {
    setImagesLoaded(prev => ({
      ...prev,
      [imageKey]: true
    }));
  };

  const jornadas = [
    {
      año: "2024",
      titulo: "II Jornada de Ingeniería Industrial",
      imagen: "/assets/images/galeria/2024/G33_2024.jpg",
      descripcion: "La segunda edición de nuestra jornada se centró en la innovación tecnológica y su aplicación en los procesos industriales. Contamos con la participación de expertos internacionales y más de 500 asistentes.",
      logros: [
        "20 ponentes especializados",
        "15 empresas participantes",
        "8 workshops técnicos",
        "Premiación a proyectos estudiantiles"
      ],
      color: "#1b1c39",
      destacado: "Tecnología e Innovación Industrial"
    },
    {
      año: "2023",
      titulo: "I Jornada de Ingeniería Industrial",
      imagen: "/assets/images/galeria/2023/G25_2023.jpg",
      descripcion: "La primera jornada marcó el inicio de este evento anual, estableciendo las bases para el intercambio de conocimiento entre estudiantes, académicos y profesionales del sector industrial.",
      logros: [
        "Conferencias magistrales",
        "Casos de estudio exitosos",
        "Networking con profesionales",
        "Primer concurso de innovación"
      ],
      color: "#2a2b4a",
      destacado: "Fundamentos de la Ingeniería Industrial"
    }
  ];

  return (
    <div className="w-full historia-container">
      {/* Barra de progreso de scroll */}
      <div 
        className="scroll-progress-bar" 
        style={{ 
          '--scroll-progress': `${scrollProgress}%` 
        } as React.CSSProperties}
      ></div>
      
      <main className="w-full h-full lg:h-full">
        {/* Hero Section */}
        <section className="historia-container text-white body-font bg-gradient-to-r from-[#1b1c39] to-[#2a2b4a] py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full pattern-grid-lg text-[#00d4d4]/20"></div>
          </div>
          <div className="container mx-auto px-5 text-center relative z-10">
            <AnimatedH1 className="text-white">Historia de las Jornadas</AnimatedH1>
            <div className="flex mt-6 justify-center">
              <div className="w-16 h-1 rounded-full bg-[#00d4d4] inline-flex"></div>
            </div>
            <AnimatedParagraph className="max-w-2xl mx-auto mt-6 historia-text-lg text-white" delay={0.2}>Revive los momentos más destacados de ediciones anteriores de la Jornada de Ingeniería Industrial</AnimatedParagraph>
          </div>
        </section>

        {/* Origen y Propósito */}
        <ScrollSlideUp>
        <section className="text-gray-700 body-font py-16 bg-white">
          <div className="container px-5 py-12 mx-auto">
            <div className="text-center mb-12">
              <AnimatedH2>
              <h2 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Origen y Propósito</h2></AnimatedH2>
              <div className="w-20 h-1 bg-[#00d4d4] rounded mx-auto mb-6"></div>
            </div>
            <div className="lg:w-4/5 mx-auto">
            <AnimatedParagraph>
              <p className="text-lg leading-relaxed mb-6 text-center">
                Este emblemático evento del Programa Educativo de Ingeniería Industrial surgió en el año 2012 como tema central de un proyecto terminal, 
                cuyo objetivo era claro: Crear un foro especializado de aprendizaje e intercambio de conocimientos y experiencias entre ingenieros industriales. 
                Aquella primera edición fue la semilla de una tradición que, con el paso del tiempo, se convirtió en una de las iniciativas más emblemáticas del 
                Departamento de Ciencias Básicas e Ingenierías de la Universidad del Caribe, la Jornada de Ingeniería Industrial.

              </p>
            </AnimatedParagraph>
              <div className="grid md:grid-cols-2 gap-8 mt-10">
                <SlideLeftContainer>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">Nuestra Misión</h3>
                  <p className="text-base leading-relaxed">
                    Vincular a estudiantes, docentes, egresados, empleadores y expertos del sector productivo, 
                    generando un punto de encuentro estratégico para el intercambio de conocimientos y experiencias.
                  </p>
                </div></SlideLeftContainer>
                <SlideRightContainer>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">Nuestro Enfoque</h3>
                  <p className="text-base leading-relaxed">
                    Compartir tendencias actuales de la disciplina y fortalecer la formación integral de los 
                    futuros profesionales en Ingeniería Industrial a través de experiencias enriquecedoras.
                  </p>
                </div></SlideRightContainer>
              </div>
            </div>
          </div>
        </section></ScrollSlideUp>

        {/* Evolución y Características */}
        <ScrollSlideUp>
        <section className="text-gray-700 body-font py-16 bg-gray-50">
          <div className="container px-5 py-12 mx-auto">

            <div className="text-center mb-12">
              <AnimatedH2><h2 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Evolución del Evento</h2></AnimatedH2>
              <div className="w-20 h-1 bg-[#00d4d4] rounded mx-auto mb-6"></div>
            </div>
            <div className="lg:w-4/5 mx-auto">
              <p className="text-lg leading-relaxed mb-10 text-center">
                Desde sus primeras ediciones, la JII se ha distinguido por su capacidad de adaptación y crecimiento continuo, 
                evolucionando tanto en organización como en alcance para convertirse en un referente académico.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                  <div className="w-16 h-16 mx-auto mb-4 bg-[#00d4d4] rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Conferencias Magistrales</h3>
                  <p className="text-sm text-gray-600">Expertos reconocidos comparten sus conocimientos y experiencias profesionales.</p>
                </div>
                
                <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                  <div className="w-16 h-16 mx-auto mb-4 bg-[#00d4d4] rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Talleres Prácticos</h3>
                  <p className="text-sm text-gray-600">Actividades hands-on que fortalecen las competencias técnicas y profesionales.</p>
                </div>
                
                <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                  <div className="w-16 h-16 mx-auto mb-4 bg-[#00d4d4] rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17 8h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1H4v1a1 1 0 11-2 0v-1H1a1 1 0 110-2h1V7a1 1 0 112 0v1h11V7a1 1 0 112 0v1z"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Paneles de Discusión</h3>
                  <p className="text-sm text-gray-600">Espacios de debate sobre tendencias y desafíos actuales de la industria.</p>
                </div>
              </div>
            </div>
          </div>
        </section></ScrollSlideUp>

        {/* Nuestra Trayectoria */}
        <ScrollSlideUp>
        <section className="text-gray-700 body-font py-16 bg-white">
          <div className="container px-5 py-12 mx-auto flex flex-col">
            <div className="lg:w-4/6 mx-auto">
              <div className="flex flex-col sm:flex-row mt-10">
                <div className="sm:w-1/3 text-center sm:pr-8">
                  <div className="w-28 h-28 rounded-full inline-flex items-center justify-center bg-sky-500 text-gray-400 mb-4"> 
                    <a href="/" aria-label="Ir a inicio">
                      <img
                        src="/assets/images/LogoUnificado_Blanco.png"
                        alt="Logotipo de la Jornada de Ingeniería Industrial"
                      />
                    </a>
                  </div>
                  <div className="flex flex-col items-center text-center justify-center">
                    <h2 className="historia-h2 font-medium title-font mt-4 text-gray-900">Nuestra Trayectoria</h2>
                    <div className="w-12 h-1 bg-[#00d4d4] rounded mt-2 mb-4 sm:pb-4"></div>
                    <p className="historia-text-base">Cada año hemos crecido en participantes, actividades y alcance, consolidándonos como el evento de Ingeniería Industrial más importante de la región.</p>
                  </div>
                </div>
                <div className="sm:w-2/3 sm:pl-20 mt-8 pt-8 lg:pt-12 sm:pt-4 sm:border-l border-gray-200 sm:border-t-0 border-t sm:mt-4 sm:text-left">
                  <p className="historia-text-base leading-relaxed mb-4">
                    Desde nuestra primera edición en 2023, la Jornada de Ingeniería Industrial ha sido un espacio de encuentro para estudiantes, académicos y profesionales del sector. Un evento donde el conocimiento, la innovación y las oportunidades de networking se combinan para crear experiencias enriquecedoras.
                  </p>
                  <p className="historia-text-base leading-relaxed mb-4">
                    Cada año hemos superado expectativas, aumentando el número de participantes, actividades y aliados estratégicos que se suman a esta iniciativa.
                  </p>
                  <p className="historia-text-base leading-relaxed mb-4">
                    Con el paso del tiempo, el evento ha evolucionado significativamente en su organización y alcance, incorporando nuevas metodologías, tecnologías emergentes y formatos innovadores que responden a las demandas actuales del mercado laboral.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        </ScrollSlideUp>

        {/* Consolidación e Impacto */}
        <ScrollSlideUp>
        <section className="text-gray-700 body-font py-16 bg-gray-50">
          <div className="container px-5 py-12 mx-auto">
            <div className="text-center mb-12">
              <h2 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Consolidación e Impacto</h2>
              <div className="w-20 h-1 bg-[#00d4d4] rounded mx-auto mb-6"></div>
            </div>
            <div className="lg:w-4/5 mx-auto">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <p className="text-lg leading-relaxed mb-6 text-center">
                  La JII se ha consolidado como una de las actividades más esperadas dentro del calendario académico del Programa Educativo de Ingeniería 
                  Industrial, estableciendo un estándar de excelencia en la formación integral de futuros ingenieros e ingenieras industriales.
                </p>
                <div className="grid md:grid-cols-2 gap-8 mt-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">Formación Integral</h3>
                    <p className="text-base leading-relaxed mb-4">
                      Nuestras actividades académicas y recreativas están diseñadas para fortalecer no solo las competencias técnicas, 
                      sino también las habilidades blandas esenciales para el éxito profesional.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">Reconocimiento Regional</h3>
                    <p className="text-base leading-relaxed mb-4">
                      El crecimiento constante en participación y la calidad de nuestras actividades nos han posicionado como un 
                      referente académico en el sureste mexicano y la región del Caribe.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        </ScrollSlideUp>

        {/* Jornadas Section */}
      <ScrollSlideUp>
        <section className="text-gray-700 body-font overflow-hidden bg-white pb-5">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="historia-h2 font-bold title-font text-gray-900 mb-4 pt-5">Ediciones Anteriores</h2>
              <div className="flex mt-2 justify-center">
                <div className="w-16 h-1 rounded-full bg-[#00d4d4] inline-flex"></div>
              </div>
            </div>
            
            <div className="flex flex-wrap -m-4">
              {jornadas.map((jornada, index) => (
                <div key={index} className="p-4 md:w-1/2 w-full">
                  <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 historia-card">
                    <div className="relative h-48 overflow-hidden">
                      {/* Skeleton mientras carga */}
                      {!imagesLoaded[`jornada-${index}`] && (
                        <div className="absolute inset-0 historia-skeleton"></div>
                      )}
                      <img 
                        className="object-cover object-center w-full h-full" 
                        src={jornada.imagen} 
                        alt={jornada.titulo}
                        onLoad={() => handleImageLoad(`jornada-${index}`)}
                        style={{ opacity: imagesLoaded[`jornada-${index}`] ? 1 : 0, transition: 'opacity 0.3s ease' }}
                      />
                      <div className="absolute top-4 right-4 bg-[#00d4d4] text-white px-3 py-1 rounded-full font-medium">
                        {jornada.año}
                      </div>
                    </div>
                    <div className="p-6">
                      <h2 className="historia-h3 font-bold title-font text-gray-900 mb-3">{jornada.titulo}</h2>
                      <div className="mb-3 py-1 px-3 bg-gray-100 rounded-full inline-block">
                        <span className="historia-text-sm font-medium text-[#1b1c39]">{jornada.destacado}</span>
                      </div>
                      <p className="historia-text-base leading-relaxed mb-4">{jornada.descripcion}</p>
                      
                      <h3 className="historia-text-base font-medium text-gray-900 mb-2 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-[#00d4d4]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Logros destacados:
                      </h3>
                      <ul className="mb-5 pl-5 text-left">
                        {jornada.logros.map((logro, i) => (
                          <li key={i} className="historia-text-base text-gray-600 list-disc mb-1">{logro}</li>
                        ))}
                      </ul>
                      
                      <div className="flex items-center flex-wrap">
                        {/* <a className="text-[#00d4d4] inline-flex items-center md:mb-2 lg:mb-0 hover:text-[#1b1c39] transition-colors delay-150 duration-300 ease-in-out cursor-pointer">
                          Ver galería
                          <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14"></path>
                            <path d="M12 5l7 7-7 7"></path>
                          </svg>
                        </a> */}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollSlideUp>
        {/* Testimonials Section*/}
        {/* <section className="text-gray-700 body-font py-16 bg-gray-50">
          <div className="container px-5 py-12 mx-auto">
            <div className="text-center mb-12">
              <h2 className="historia-h2 font-bold title-font text-gray-900 mb-4">Testimonios</h2>
              <div className="flex mt-2 justify-center">
                <div className="w-16 h-1 rounded-full bg-[#00d4d4] inline-flex"></div>
              </div>
              <p className="max-w-2xl mx-auto mt-6 historia-text-lg">Lo que dicen quienes han participado en nuestras jornadas</p>
            </div>
            
            <div className="flex flex-wrap -m-4">
              {testimonios.map((testimonio, index) => (
                <div key={index} className="p-4 md:w-1/3 w-full">
                  <div className="h-full bg-white p-6 rounded-lg shadow-md border border-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="block w-5 h-5 text-[#00d4d4] mb-4" viewBox="0 0 975.036 975.036">
                      <path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"></path>
                    </svg>
                    <p className="historia-text-base leading-relaxed mb-6">{testimonio.texto}</p>
                    <div className="inline-flex items-center">
                      
                      {!imagesLoaded[`testimonio-${index}`] && (
                        <div className="w-12 h-12 historia-testimonial-skeleton rounded-full flex-shrink-0"></div>
                      )}
                      <img 
                        alt="testimonial" 
                        src={testimonio.imagen} 
                        className="w-12 h-12 rounded-full flex-shrink-0 object-cover object-center"
                        onLoad={() => handleImageLoad(`testimonio-${index}`)}
                        style={{ 
                          display: imagesLoaded[`testimonio-${index}`] ? 'block' : 'none'
                        }}
                      />
                      <span className="flex-grow flex flex-col pl-4">
                        <span className="historia-text-base title-font font-medium text-gray-900 text-left">{testimonio.nombre}</span>
                        <span className="historia-text-sm text-gray-500 text-left">{testimonio.cargo}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>  */}

        {/* Gallery Section usando el componente GalleryMosaic */}
        <GalleryMosaic variant="A" mobileMode="stack" />

        {/* Evolution Section */}
        <section className="text-gray-700 body-font py-16 bg-gradient-to-r from-[#1b1c39] to-[#2a2b4a]">
          <div className="container px-5 py-12 mx-auto">
            <div className="text-center mb-12">
              <h2 className="historia-h2 font-bold title-font mb-4 text-white">Evolución de las Jornadas</h2>
              <div className="flex mt-2 justify-center">
                <div className="w-16 h-1 rounded-full bg-[#00d4d4] inline-flex"></div>
              </div>
            </div>
            
            <div className="flex flex-wrap -m-4">
              <div className="p-4 md:w-1/3 w-full">
                <div className="h-full bg-white bg-opacity-10 p-6 rounded-lg backdrop-filter backdrop-blur-sm">
                  <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-[#00d4d4] text-white mb-4">
                    <span className="font-bold">1</span>
                  </div>
                  <h3 className="historia-text-base font-medium text-white mb-2">2023 - Primera Edición</h3>
                  <p className="historia-text-base leading-relaxed text-gray-300">Establecimos las bases con conferencias magistrales y el primer concurso de innovación, sentando las bases para el crecimiento futuro.</p>
                </div>
              </div>
              <div className="p-4 md:w-1/3 w-full">
                <div className="h-full bg-white bg-opacity-10 p-6 rounded-lg backdrop-filter backdrop-blur-sm">
                  <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-[#00d4d4] text-white mb-4">
                    <span className="font-bold">2</span>
                  </div>
                  <h3 className="historia-text-base font-medium text-white mb-2">2024 - Consolidación</h3>
                  <p className="historia-text-base leading-relaxed text-gray-300">Aumentamos en un 40% la participación e introdujimos nuevos talleres especializados y actividades prácticas para los asistentes.</p>
                </div>
              </div>
              <div className="p-4 md:w-1/3 w-full">
                <div className="h-full bg-white bg-opacity-10 p-6 rounded-lg backdrop-filter backdrop-blur-sm">
                  <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-[#00d4d4] text-white mb-4">
                    <span className="font-bold">3</span>
                  </div>
                  <h3 className="historia-text-base font-medium text-white mb-2">2025 - Expansión</h3>
                  <p className="historia-text-base leading-relaxed text-gray-300">Próxima jornada con expectativas de superar todos los récords anteriores y enfoque en la industria 4.0 y sostenibilidad.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ScrollSlideUp>
        {/* Call to Action */}
        <section className="text-gray-700 body-font bg-gray-100 py-16">
          <div className="container px-5 py-12 mx-auto text-center">
            <div className="lg:w-2/3 mx-auto">
              <h2 className="historia-h2 font-bold title-font text-gray-900 mb-4">¿Te gustaría ser parte de la próxima jornada?</h2>
              <p className="historia-text-base leading-relaxed mb-8">No te pierdas la oportunidad de participar en la próxima edición de nuestra Jornada de Ingeniería Industrial. Mantente atento a nuestras redes sociales para más información.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/registro" id="btn_CallToAction" className="inline-flex text-white bg-[#1b1c39] border-0 py-3 px-8 focus:outline-none hover:bg-[#2a2b4a] rounded-lg text-lg font-medium transition-colors shadow-md hover:shadow-lg">
                  Regístrate ahora
                </a>
                <a href="/actividades" id="btn_CallToAction" className="inline-flex text-[#1b1c39] bg-gray-200 border-0 py-3 px-8 focus:outline-none hover:bg-gray-300 rounded-lg text-lg font-medium transition-colors">
                  Ver actividades
                </a>
              </div>
            </div>
          </div>
        </section>
        </ScrollSlideUp>
      </main>
    </div>
  );
}