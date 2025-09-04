import React, { useState, useEffect } from "react";

export default function Historia() {
  // Estado para la barra de progreso
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
      
      <main className="w-full mt-[100px] md:mt-[90px]">
        {/* Hero Section */}
        <section className="text-white body-font bg-gradient-to-r from-[#1b1c39] to-[#2a2b4a] py-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full pattern-grid-lg text-[#00d4d4]/20"></div>
          </div>
          <div className="container mx-auto px-5 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Historia de las Jornadas</h1>
            <div className="flex mt-6 justify-center">
              <div className="w-16 h-1 rounded-full bg-[#00d4d4] inline-flex"></div>
            </div>
            <p className="max-w-2xl mx-auto mt-6 text-lg">Revive los momentos más destacados de nuestras jornadas anuales de Ingeniería Industrial</p>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="text-gray-700 body-font py-16 bg-gray-50">
          <div className="container px-5 py-12 mx-auto flex flex-col">
            <div className="lg:w-4/6 mx-auto">
              <div className="flex flex-col sm:flex-row mt-10">
                <div className="sm:w-1/3 text-center sm:pr-8 sm:py-8">
                  <div className="w-20 h-20 rounded-full inline-flex items-center justify-center bg-gray-200 text-gray-400 mb-4">
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-10 h-10" viewBox="0 0 24 24">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div className="flex flex-col items-center text-center justify-center">
                    <h2 className="font-medium title-font mt-4 text-gray-900 text-lg">Nuestra Trayectoria</h2>
                    <div className="w-12 h-1 bg-[#00d4d4] rounded mt-2 mb-4"></div>
                    <p className="text-base">Cada año hemos crecido en participantes, actividades y alcance, consolidándonos como el evento de ingeniería industrial más importante de la región.</p>
                  </div>
                </div>
                <div className="sm:w-2/3 sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-4 pt-4 sm:mt-0 text-center sm:text-left">
                  <p className="leading-relaxed text-lg mb-4">Desde nuestra primera edición en 2023, la Jornada de Ingeniería Industrial ha sido un espacio de encuentro para estudiantes, académicos y profesionales del sector. Un evento donde el conocimiento, la innovación y las oportunidades de networking se combinan para crear experiencias enriquecedoras.</p>
                  <p className="leading-relaxed text-lg mb-4">Cada año hemos superado expectativas, aumentando el número de participantes, actividades y aliados estratégicos que se suman a esta iniciativa.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Jornadas Section */}
        <section className="text-gray-700 body-font overflow-hidden bg-white pb-5">
          <div className="container px-5 py-12 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold title-font text-gray-900 mb-4 pt-5">Ediciones Anteriores</h2>
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
                      <h2 className="text-2xl font-bold title-font text-gray-900 mb-3">{jornada.titulo}</h2>
                      <div className="mb-3 py-1 px-3 bg-gray-100 rounded-full inline-block">
                        <span className="text-sm font-medium text-[#1b1c39]">{jornada.destacado}</span>
                      </div>
                      <p className="leading-relaxed mb-4">{jornada.descripcion}</p>
                      
                      <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-[#00d4d4]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        Logros destacados:
                      </h3>
                      <ul className="mb-5 pl-5">
                        {jornada.logros.map((logro, i) => (
                          <li key={i} className="text-gray-600 list-disc mb-1">{logro}</li>
                        ))}
                      </ul>
                      
                      <div className="flex items-center flex-wrap">
                        <a className="text-[#00d4d4] inline-flex items-center md:mb-2 lg:mb-0 hover:text-[#1b1c39] transition-colors cursor-pointer">
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
              <h2 className="text-3xl font-bold title-font text-gray-900 mb-4">Testimonios</h2>
              <div className="flex mt-2 justify-center">
                <div className="w-16 h-1 rounded-full bg-[#00d4d4] inline-flex"></div>
              </div>
              <p className="max-w-2xl mx-auto mt-6 text-lg">Lo que dicen quienes han participado en nuestras jornadas</p>
            </div>
            
            <div className="flex flex-wrap -m-4">
              {testimonios.map((testimonio, index) => (
                <div key={index} className="p-4 md:w-1/3 w-full">
                  <div className="h-full bg-white p-6 rounded-lg shadow-md border border-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="block w-5 h-5 text-[#00d4d4] mb-4" viewBox="0 0 975.036 975.036">
                      <path d="M925.036 57.197h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.399 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l36 76c11.6 24.399 40.3 35.1 65.1 24.399 66.2-28.6 122.101-64.8 167.7-108.8 55.601-53.7 93.7-114.3 114.3-181.9 20.601-67.6 30.9-159.8 30.9-276.8v-239c0-27.599-22.401-50-50-50zM106.036 913.497c65.4-28.5 121-64.699 166.9-108.6 56.1-53.7 94.4-114.1 115-181.2 20.6-67.1 30.899-159.6 30.899-277.5v-239c0-27.6-22.399-50-50-50h-304c-27.6 0-50 22.4-50 50v304c0 27.601 22.4 50 50 50h145.5c-1.9 79.601-20.4 143.3-55.4 191.2-27.6 37.8-69.4 69.1-125.3 93.8-25.7 11.3-36.8 41.7-24.8 67.101l35.9 75.8c11.601 24.399 40.501 35.2 65.301 24.399z"></path>
                    </svg>
                    <p className="leading-relaxed mb-6">{testimonio.texto}</p>
                    <div className="inline-flex items-center">
                      <img alt="testimonial" src={testimonio.imagen} className="w-12 h-12 rounded-full flex-shrink-0 object-cover object-center" />
                      <span className="flex-grow flex flex-col pl-4">
                        <span className="title-font font-medium text-gray-900">{testimonio.nombre}</span>
                        <span className="text-gray-500 text-sm">{testimonio.cargo}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Preview Section */}
        <section className="text-gray-700 body-font py-16 bg-white">
          <div className="container px-5 py-12 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold title-font text-gray-900 mb-4">Galería de Momentos</h2>
              <div className="flex mt-2 justify-center">
                <div className="w-16 h-1 rounded-full bg-[#00d4d4] inline-flex"></div>
              </div>
              <p className="max-w-2xl mx-auto mt-6 text-lg">Algunos de los mejores momentos de nuestras jornadas</p>
            </div>
            
            <div className="flex flex-wrap -m-1 md:-m-2">
              <div className="flex flex-wrap w-1/2">
                <div className="w-1/2 p-1 md:p-2">
                  <img alt="gallery" className="block object-cover object-center w-full h-full rounded-lg" src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=500" />
                </div>
                <div className="w-1/2 p-1 md:p-2">
                  <img alt="gallery" className="block object-cover object-center w-full h-full rounded-lg" src="https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&q=80&w=500" />
                </div>
                <div className="w-full p-1 md:p-2">
                  <img alt="gallery" className="block object-cover object-center w-full h-full rounded-lg" src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=500" />
                </div>
              </div>
              <div className="flex flex-wrap w-1/2">
                <div className="w-full p-1 md:p-2">
                  <img alt="gallery" className="block object-cover object-center w-full h-full rounded-lg" src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=500" />
                </div>
                <div className="w-1/2 p-1 md:p-2">
                  <img alt="gallery" className="block object-cover object-center w-full h-full rounded-lg" src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=500" />
                </div>
                <div className="w-1/2 p-1 md:p-2">
                  <img alt="gallery" className="block object-cover object-center w-full h-full rounded-lg" src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=500" />
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-8">
              <a className="inline-flex items-center text-[#00d4d4] font-medium hover:text-[#1b1c39] transition-colors">
                Ver galería completa
                <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Evolution Section */}
        <section className="text-gray-700 body-font py-16 bg-gradient-to-r from-[#1b1c39] to-[#2a2b4a]">
          <div className="container px-5 py-12 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold title-font mb-4 text-white">Evolución de las Jornadas</h2>
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
                  <h3 className="text-lg font-medium text-white mb-2">2023 - Primera Edición</h3>
                  <p className="leading-relaxed text-gray-300">Establecimos las bases con conferencias magistrales y el primer concurso de innovación, sentando las bases para el crecimiento futuro.</p>
                </div>
              </div>
              <div className="p-4 md:w-1/3 w-full">
                <div className="h-full bg-white bg-opacity-10 p-6 rounded-lg backdrop-filter backdrop-blur-sm">
                  <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-[#00d4d4] text-white mb-4">
                    <span className="font-bold">2</span>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">2024 - Consolidación</h3>
                  <p className="leading-relaxed text-gray-300">Aumentamos en un 40% la participación e introdujimos nuevos talleres especializados y actividades prácticas para los asistentes.</p>
                </div>
              </div>
              <div className="p-4 md:w-1/3 w-full">
                <div className="h-full bg-white bg-opacity-10 p-6 rounded-lg backdrop-filter backdrop-blur-sm">
                  <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-[#00d4d4] text-white mb-4">
                    <span className="font-bold">3</span>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">2025 - Expansión</h3>
                  <p className="leading-relaxed text-gray-300">Próxima jornada con expectativas de superar todos los récords anteriores y enfoque en la industria 4.0 y sostenibilidad.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-gray-700 body-font bg-gray-100 py-16">
          <div className="container px-5 py-12 mx-auto text-center">
            <div className="lg:w-2/3 mx-auto">
              <h2 className="text-3xl font-bold title-font text-gray-900 mb-4">¿Te gustaría ser parte de la próxima jornada?</h2>
              <p className="text-lg leading-relaxed mb-8">No te pierdas la oportunidad de participar en la próxima edición de nuestra Jornada de Ingeniería Industrial. Mantente atento a nuestras redes sociales para más información.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/registro" className="inline-flex text-white bg-[#1b1c39] border-0 py-3 px-8 focus:outline-none hover:bg-[#2a2b4a] rounded-lg text-lg font-medium transition-colors shadow-md hover:shadow-lg">
                  Regístrate ahora
                </a>
                <a href="/actividades" className="inline-flex text-[#1b1c39] bg-gray-200 border-0 py-3 px-8 focus:outline-none hover:bg-gray-300 rounded-lg text-lg font-medium transition-colors">
                  Ver actividades
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}