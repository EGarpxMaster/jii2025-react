import React, { useState, useEffect } from "react";
import "./historia.css";

// Definición de tipos
type Variant = "A" | "B";
type MobileMode = "same" | "stack";

// Componente GalleryMosaic separado
function GalleryMosaic({
  variant = "A",
  mobileMode = "stack",
}: { variant?: Variant; mobileMode?: MobileMode }) {
  const spansA = [
    "lg:col-span-4 lg:row-span-2",
    "lg:col-span-2 lg:row-span-1",
    "lg:col-span-2 lg:row-span-2",
    "lg:col-span-2 lg:row-span-1",
    "lg:col-span-3 lg:row-span-2",
    "lg:col-span-3 lg:row-span-1",
  ];

  const spansB = [
    "lg:col-span-3 lg:row-span-2",
    "lg:col-span-3 lg:row-span-2",
    "lg:col-span-2 lg:row-span-1",
    "lg:col-span-4 lg:row-span-1",
    "lg:col-span-2 lg:row-span-2",
    "lg:col-span-2 lg:row-span-1",
  ];

  const GALLERY_IMAGES = [
    {
      src: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=1600",
      alt: "Conferencia principal con expertos internacionales",
      title: "Conferencia Principal"
    },
    {
      src: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&q=80&w=1600",
      alt: "Taller práctico sobre innovación industrial",
      title: "Taller Práctico"
    },
    {
      src: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2000",
      alt: "Networking entre participantes y profesionales",
      title: "Sesión de Networking"
    },
    {
      src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=2000",
      alt: "Exposición de proyectos estudiantiles innovadores",
      title: "Exposición de Proyectos"
    },
    {
      src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2000",
      alt: "Panel de expertos discutiendo tendencias industriales",
      title: "Panel de Expertos"
    },
    {
      src: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=2000",
      alt: "Entrega de reconocimientos a los mejores proyectos",
      title: "Entrega de Reconocimientos"
    }
  ];

  const spans = variant === "A" ? spansA : spansB;

  // Grid base mejorada para móviles
  const gridBase = mobileMode === "same"
    ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4"
    : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4";

  // Alturas responsivas
  const getHeightClass = (index: number) => {
    if (mobileMode === "same") {
      return "h-40 sm:h-48 md:h-40 lg:h-48 xl:h-56";
    }
    
    // Para móviles: diseño más variado e interesante
    switch(index % 6) {
      case 0: return "h-56 sm:h-48 md:h-56 lg:h-64";
      case 1: return "h-48 sm:h-56 md:h-48 lg:h-52";
      case 2: return "h-52 sm:h-44 md:h-52 lg:h-60";
      case 3: return "h-44 sm:h-52 md:h-44 lg:h-56";
      case 4: return "h-60 sm:h-40 md:h-60 lg:h-52";
      case 5: return "h-40 sm:h-60 md:h-40 lg:h-64";
      default: return "h-48";
    }
  };

  // Span classes para móviles
  const getMobileSpan = (index: number) => {
    if (mobileMode === "same") return "";
    
    // Diseño más interesante para móviles
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
          <h2 className="historia-h2 font-bold title-font text-gray-900 mb-4 p-8">Galería de Momentos</h2>
          <div className="flex mt-2 justify-center">
            <div className="w-16 h-1 rounded-full bg-[#00d4d4] inline-flex"></div>
          </div>
          <p className="max-w-2xl mx-auto mt-6 historia-text-lg">
            Algunos de los mejores momentos de nuestras jornadas
          </p>
        </div>

        {/* GRID mejorado con diseño responsivo */}
        <div className={`${gridBase} [grid-auto-flow:dense]`}>
          {GALLERY_IMAGES.map((image, i) => (
            <div
              key={i}
              className={`relative group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 ${getHeightClass(i)} ${getMobileSpan(i)} ${spans[i]}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
              
              {/* Overlay con título */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-semibold text-sm sm:text-base">{image.title}</h3>
                  <p className="text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {image.alt}
                  </p>
                </div>
              </div>
              
              {/* Badge móvil */}
              <div className="absolute top-3 left-3 bg-[#00d4d4] text-white px-2 py-1 rounded-full text-xs font-medium sm:hidden">
                {image.title}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center pb-12 pt-12">
          <a href="/galeria" id="btn_galery" className="inline-flex items-center bg-[#00d4d4] text-white px-6 py-3 rounded-full font-medium">
            Ver galería completa
            <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

// Componente principal Historia
export default function Historia() {
  const [scrollProgress, setScrollProgress] = useState(0);
  
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

  const jornadas = [
    {
      año: "2024",
      titulo: "II Jornada de Ingeniería Industrial",
      imagen: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?auto=format&fit=crop&q=80&w=1200",
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
      imagen: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200",
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

  const testimonios = [
    {
      nombre: "Dra. María González",
      cargo: "Directora de Ingeniería Industrial",
      texto: "Las jornadas han permitido a nuestros estudiantes conectarse con la industria real y aplicar sus conocimientos en proyectos tangibles.",
      imagen: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
      nombre: "Ing. Carlos Mendoza",
      cargo: "Gerente de Producción, Industria ABC",
      texto: "Como empresa participante, hemos encontrado talento excepcional en estas jornadas. Los proyectos presentados muestran un gran potencial.",
      imagen: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
      nombre: "Ana Sánchez",
      cargo: "Estudiante participante",
      texto: "Participar en la jornada fue una experiencia transformadora. Pude aplicar lo aprendido en clase y hacer contactos profesionales valiosos.",
      imagen: "https://images.unsplash.com/photo-1551836026-d5c8c5ab235e?auto=format&fit=crop&q=80&w=200&h=200"
    }
  ];

  return (
    <div className="w-full historia-container">
      {/* Barra de progreso de scroll */}
      <div 
        className="scroll-progress-bar" 
        style={{ '--scroll-progress': `${scrollProgress}%` } as React.CSSProperties}
      ></div>
      
      <main className="w-full h-full lg:full">
        {/* Hero Section */}
        <section className="historia-container text-white body-font bg-gradient-to-r from-[#1b1c39] to-[#2a2b4a] py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full pattern-grid-lg text-[#00d4d4]/20"></div>
          </div>
          <div className="container mx-auto px-5 text-center relative z-10">
            <h1 className="historia-h1 mb-4">Historia de las Jornadas</h1>
            <div className="flex mt-6 justify-center">
              <div className="w-16 h-1 rounded-full bg-[#00d4d4] inline-flex"></div>
            </div>
            <p className="max-w-2xl mx-auto mt-6 historia-text-lg">Revive los momentos más destacados de nuestras jornadas anuales de Ingeniería Industrial</p>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="text-gray-700 body-font py-16 bg-gray-50">
          <div className="container px-5 py-12 mx-auto flex flex-col">
            <div className="lg:w-4/6 mx-auto">
              <div className="flex flex-col sm:flex-row mt-10">
                <div className="sm:w-1/3 text-center sm:pr-8">
                  <div className="w-28 h-28 rounded-full inline-flex items-center justify-center bg-sky-500 text-gray-400 mb-4"> 
                    <a href="/"  aria-label="Ir a inicio">
                      <img
                        src="/assets/images/LogoUnificado_Blanco.png"
                        alt="Logotipo de la Jornada de Ingeniería Industrial"
                      />
                    </a>
                  </div>
                  <div className="flex flex-col items-center text-center justify-center">
                    <h2 className="historia-h2 font-medium title-font mt-4 text-gray-900">Nuestra Trayectoria</h2>
                    <div className="w-12 h-1 bg-[#00d4d4] rounded mt-2 mb-4 sm:pb-4"></div>
                    <p className="historia-text-base">Cada año hemos crecido en participantes, actividades y alcance, consolidándonos como el evento de ingeniería industrial más importante de la región.</p>
                  </div>
                </div>
                <div className="sm:w-2/3 sm:pl-20 lg:pt-12  sm:pt-4 sm:border-l border-g0ray-200 sm:border-t-0 border-t sm:mt-4 sm:text-left">
                  <p className="historia-text-base leading-relaxed mb-4 mt-28">Desde nuestra primera edición en 2023, la Jornada de Ingeniería Industrial ha sido un espacio de encuentro para estudiantes, académicos y profesionales del sector. Un evento donde el conocimiento, la innovación y las oportunidades de networking se combinan para crear experiencias enriquecedoras.</p>
                  <p className="historia-text-base leading-relaxed mb-4">Cada año hemos superado expectativas, aumentando el número de participantes, actividades y aliados estratégicos que se suman a esta iniciativa.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Jornadas Section */}
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
                      <img className="object-cover object-center w-full h-full" src={jornada.imagen} alt={jornada.titulo} />
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
                          <li key={i} className="historia-text-base text-gray-600 list-disc mb-1 ">{logro}</li>
                        ))}
                      </ul>
                      
                      <div className="flex items-center flex-wrap">
                        <a className="text-[#00d4d4] inline-flex items-center md:mb-2 lg:mb-0 hover:text-[#1b1c39] transition-colors delay-150 duration-300 ease-in-out cursor-pointer ">
                          Ver galería
                          <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14"></path>
                            <path d="M12 5l7 7-7 7"></path>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="text-gray-700 body-font py-16 bg-gray-50">
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
                    <p className="historia-text-base leading-relaxed mb-6 ">{testimonio.texto}</p>
                    <div className="inline-flex items-center">
                      <img alt="testimonial" src={testimonio.imagen} className="w-12 h-12 rounded-full flex-shrink-0 object-cover object-center" />
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
        </section>

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
      </main>
    </div>
  );
}