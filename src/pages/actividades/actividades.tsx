import React, { useEffect, useMemo, useState } from "react";
import "./actividades.css"; 

// Tipos
type Speaker = {
  name: string;
  image: string;
  bio?: string;
  institution?: string;
};

type Activity = {
  id: string; // C1, C2, W1, etc.
  kind: "conference" | "workshop";
  banner: string;
  title: string;
  description: string;
  speakers: Speaker[];
  modal: {
    title: string;
    paragraphs?: string[]; // párrafos sueltos
    bullets?: string[]; // lista con viñetas
    numbered?: string[]; // lista numerada
  };
};

// Datos (conserva las rutas y textos que enviaste)
const activitiesData: Activity[] = [
  {
    id: "C1",
    kind: "conference",
    banner: "/assets/images/actividades/banners/C1.jpg",
    title:
      "El Sistema General de Unidades de Medida y sus equivalencias NOM-008-SE-2021",
    description:
      "Se dará a conocer el marco legal y normativo sobre el uso del SGUM en las Universidades y Escuelas a nivel Nacional.",
    speakers: [
      {
        name: "Mtro. David Francisco Correa Jara",
        image: "/assets/images/actividades/ponentes/Mtro.DavidCorrea.jpeg",
        bio: "Especialista en metrología y sistemas de medición con amplia experiencia en el sector industrial.",
        institution: "Universidad del Caribe",
      },
    ],
    modal: {
      title:
        "El Sistema General de Unidades de Medida y sus equivalencias NOM-008-SE-2021",
      paragraphs: [
        "Se dará a conocer el marco legal y normativo sobre el uso del SGUM en las Universidades y Escuelas a nivel Nacional, así como equivalencias (conversiones) con otros sistemas.",
      ],
    },
  },
  {
    id: "C2",
    kind: "conference",
    banner: "/assets/images/actividades/banners/C2.jpeg",
    title:
      "Desempeño innovador de los sistemas productivos de empresas manufactureras",
    description:
      "Innovación en los procesos productivos del sector calzado en Colombia y su impacto en la competitividad.",
    speakers: [
      {
        name: "Dra. Ruth Leonor Reyes Villalba",
        image: "/assets/images/actividades/ponentes/Dra.RuthReyes.jpeg",
        bio: "Investigador especializado en innovación de sistemas productivos para el sector manufacturero.",
        institution: "Universidad del Caribe",
      },
    ],
    modal: {
      title: "Desempeño innovador de los sistemas productivos",
      paragraphs: [
        "En un mundo cada vez más competitivo, la innovación se ha convertido en un pilar fundamental para la sostenibilidad y el crecimiento de las empresas. En Colombia, el sector calzado enfrenta desafíos significativos, desde la competencia internacional hasta las fluctuaciones del mercado.",
        "Muchas empresas han comenzado a adoptar prácticas innovadoras en sus procesos productivos, integrando tecnologías avanzadas y estrategias de sostenibilidad que no solo mejoran la eficiencia, sino que también contribuyen a la calidad del producto final.",
        "El sector calzado en Colombia, ahora se encuentra ante la necesidad de evolucionar. La innovación no solo se trata de incorporar nuevas tecnologías, sino también de transformar la cultura empresarial y los procesos internos para mejorar la eficiencia, reducir costos y aumentar la calidad del producto.",
      ],
    },
  },
  {
    id: "C3",
    kind: "conference",
    banner: "/assets/images/actividades/banners/C3.jpg",
    title: "Liderazgo sostenible y ética profesional",
    description:
      "Enfoque en el liderazgo consciente y la toma de decisiones éticas en el entorno profesional.",
    speakers: [
      {
        name: "Lic. Arturo Guzmán Contreras",
        image: "/assets/images/actividades/ponentes/Lic.ArturoGuzman.jpeg",
        bio: "Especialista en ética empresarial y sostenibilidad organizacional.",
        institution: "Universidad del Caribe",
      },
    ],
    modal: {
      title: "Liderazgo sostenible y ética profesional",
      paragraphs: [
        "La conferencia examina cómo los líderes pueden adoptar un enfoque que combine la sostenibilidad y la ética en su ejercicio profesional. Durante este evento, se abordarán los principios del liderazgo consciente, promoviendo la toma de decisiones responsables que generen un impacto positivo a largo plazo en las organizaciones, las personas y el entorno.",
        "Se destacará la relevancia de la ética profesional como fundamento en la toma de decisiones en un entorno laboral dinámico. Además, subrayará la importancia de alinear los objetivos empresariales con la sostenibilidad ambiental y el desarrollo humano.",
      ],
    },
  },
  {
    id: "C4",
    kind: "conference",
    banner: "/assets/images/actividades/banners/C4.jpg",
    title:
      "De la idea al patentamiento para la solución de problemas en el sector artesanal",
    description:
      "Importancia de la ingeniería y la optimización en el desarrollo de prototipos para el sector artesanal.",
    speakers: [
      {
        name: "Dra. Lidilia Cruz Rivero",
        image: "/assets/images/actividades/ponentes/Dra.LidiliaCruz.jpg",
        bio: "Experto en propiedad industrial y desarrollo de prototipos para sectores artesanales.",
        institution: "Universidad del Caribe",
      },
    ],
    modal: {
      title: "De la idea al patentamiento",
      paragraphs: [
        "El objetivo de esta conferencia es mostrar la importancia de la ingeniería y la optimización de procesos, la innovación, manufactura y propiedad industrial, en el desarrollo de prototipos que mejoren las actividades tipo artesanal logrando modelos de utilidad y registros de software ante e IMPI e INDAUTOR.",
      ],
    },
  },
  // Workshops
  {
    id: "W1",
    kind: "workshop",
    banner: "/assets/images/actividades/banners/W1.jpg",
    title: "Aplicación de la metrología en procesos industriales",
    description:
      "Importancia de la metrología en los procesos industriales y posibilidades de especialización.",
    speakers: [
      {
        name: "Mtro. David Francisco Correa Jara",
        image: "/assets/images/actividades/ponentes/Mtro.DavidCorrea.jpeg",
        bio: "Especialista en metrología industrial con experiencia en implementación de sistemas de medición.",
        institution: "Universidad del Caribe",
      },
    ],
    modal: {
      title: "Aplicación de la metrología en procesos industriales",
      paragraphs: [
        "Dar a conocer la importancia de la metrología en los procesos industriales y mostrar un tipo de especialidad que puede tener un ingeniero industrial en materia de metrología.",
      ],
    },
  },
  {
    id: "W2",
    kind: "workshop",
    banner: "/assets/images/actividades/banners/W2.jpg",
    title: "Herramientas de innovación y desarrollo para productos y procesos",
    description:
      "Bases de herramientas de innovación y diseño conceptual para desarrollo y mejora de productos.",
    speakers: [
      {
        name: "Dra. Lidilia Cruz Rivero",
        image: "/assets/images/actividades/ponentes/Dra.LidiliaCruz.jpg",
        bio: "Consultor en innovación y desarrollo de productos con enfoque en metodologías de diseño creativo.",
        institution: "Universidad del Caribe",
      },
    ],
    modal: {
      title: "Herramientas de innovación",
      paragraphs: [
        "Aprender las bases de Herramientas de innovación y diseño conceptual para el desarrollo y mejora de productos y procesos.",
        "Objetivos específicos:",
      ],
      bullets: [
        "Desarrollar habilidades para enfrentar problemas de inventiva e innovación de alto reto.",
        "Incrementar su eficacia para solucionar problemas de innovación.",
      ],
    },
  },
  {
    id: "W3",
    kind: "workshop",
    banner: "/assets/images/actividades/banners/W3.jpg",
    title: "Ética y valores en la toma de decisiones",
    description:
      "Exploración de principios éticos aplicados a la toma de decisiones en ingeniería.",
    speakers: [
      {
        name: "Mtra. Leslye Johanna Ramírez",
        image: "/assets/images/actividades/ponentes/Mtra.LeslyeRamirez.jpg",
        bio: "Especialista en ética profesional y responsabilidad corporativa con experiencia en consultoría para empresas de ingeniería.",
        institution: "Universidad del Caribe",
      },
    ],
    modal: {
      title: "Ética y valores en la toma de decisiones",
      paragraphs: [
        "Taller enfocado en la aplicación de principios éticos en la toma de decisiones ingenieriles y corporativas.",
      ],
    },
  },
  {
    id: "W4",
    kind: "workshop",
    banner: "/assets/images/actividades/banners/W4.png",
    title: "Introducción a Rmarkdown",
    description:
      "Generación de reportes científicos reproducibles utilizando R và Markdown.",
    speakers: [
      {
        name: "Dr. Julio César Ramírez Pacheco",
        image: "/assets/images/actividades/ponentes/Dr.JulioRamirez.jpg",
        bio: "Especialista en ciencia de datos y documentación reproducible con amplia experiencia en R y RMarkdown.",
        institution: "Universidad del Caribe",
      },
    ],
    modal: {
      title: "Introducción a Rmarkdown",
      paragraphs: [
        "El presente taller versa sobre el paquete de R llamado RMarkdown, el cual permite, entre muchas otras cosas más, generar reportes científicos reproducibles que posteriormente pueden alojarse en páginas web, como documentos PDF, EPUB, Word, etc.",
        "Es bastante intuitivo y se pueden generar tesis, presentaciones, reportes, CVs, etc. En la charla se muestra cómo generar un reporte científico que contiene texto, código y fórmulas matemáticas, elementos típicos en un reporte de ingeniería.",
        "La charla está organizada de la siguiente manera:",
      ],
      bullets: [
        "Introducción a R.",
        "El paquete RMarkdown.",
        "Fórmulas con LATEX.",
        "Gráficos con highcharter.",
        "Generación de documentos en HTML.",
        "Alojamiento en GitHub.",
      ],
    },
  },
  {
    id: "W5",
    kind: "workshop",
    banner: "/assets/images/actividades/banners/W5.avif",
    title:
      "Uso de la RPA para la transformación de procesos manuales en aplicaciones automáticas",
    description:
      "Introducción a la automatización robótica de procesos utilizando Robocorp de Python.",
    speakers: [
      {
        name: "Dr. Héctor Fernando Gómez García",
        image: "/assets/images/actividades/ponentes/Dr.HectorGomez.jpg",
        bio: "Especialista en automatización de procesos y desarrollo RPA con enfoque en aplicaciones industriales.",
        institution: "Universidad del Caribe",
      },
    ],
    modal: {
      title:
        "Uso de la RPA para la transformación de procesos manuales en aplicaciones automáticas",
      paragraphs: [
        "El taller tiene como objetivo introducir a las y los estudiantes de Ingeniería Industrial a la automatización robótica de procesos (RPA) utilizando la librería Robocorp de Python.",
        "Durante el taller, los participantes aprenderán cómo implementar soluciones de RPA que transformen procesos manuales y repetitivos en flujos automatizados, con énfasis en mejorar la eficiencia operativa y reducir errores.",
        "A lo largo de las sesiones, se explorarán aplicaciones concretas de RPA en diversas áreas clave de la Ingeniería Industrial. Las y los asistentes desarrollarán sus propios bots de software utilizando Robocorp, abordando casos de uso prácticos y simulando soluciones en tiempo real.",
      ],
    },
  },
  {
    id: "W6",
    kind: "workshop",
    banner: "/assets/images/actividades/banners/W6.jpg",
    title:
      "Creación de modelos 3D para realidad aumentada usando tu smartphone",
    description:
      "Modelado 3D utilizando tecnología LiDAR para crear experiencias de realidad aumentada.",
    speakers: [
      {
        name: "Dr. Alejandro Charbel Cárdenas León",
        image: "/assets/images/actividades/ponentes/Dr.AlejandroCardenas.jpeg",
        bio: "Especialista en modelado 3D y tecnologías de realidad aumentada con experiencia en desarrollo de aplicaciones para ingeniería.",
        institution: "Universidad del Caribe",
      },
    ],
    modal: {
      title:
        "Creación de modelos 3D para realidad aumentada usando tu smartphone",
      paragraphs: [
        "Este taller está diseñado para introducir a los participantes en el mundo del modelado 3D utilizando la tecnología LiDAR disponible en los iPhones Pro.",
        "A lo largo de este taller, se guiará a los asistentes en la captura de un objeto real utilizando un iPhone, la creación de un modelo 3D en Reality Composer, y la edición avanzada de vectores y texturas en Blender.",
        "Finalmente, los modelos serán exportados para ser utilizados en JigSpace, donde se creará un video interactivo en Realidad Aumentada (AR).",
      ],
      numbered: [
        "Introducción a la Realidad Aumentada (RA): usos y tecnologías avanzadas.",
        "Modelado de un objeto utilizando Reality Composer.",
        "Edición en Blender: optimización de vectores y texturas.",
        "Exportación para JigSpace y creación de video interactivo.",
      ],
    },
  },
  {
    id: "W7",
    kind: "workshop",
    banner: "/assets/images/actividades/banners/W7.jpg",
    title: "Industria 4.0",
    description:
      "Principios de la Industria 4.0 y transformación tecnológica del sector industrial.",
    speakers: [
      {
        name: "Ing. Neftali Abisai Tamayo Estrella",
        image: "/assets/images/actividades/ponentes/Ing.NeftaliTamayo.png",
      },
      {
        name: "Ing. Jose Luis Chan Verde",
        image: "/assets/images/actividades/ponentes/Ing.JoseChan.png",
      },
    ],
    modal: {
      title: "Industria 4.0",
      paragraphs: [
        "Comprender los principios de la Industria 4.0 y analizar cómo los avances tecnológicos están transformando el sector industrial y los modelos de negocio.",
      ],
    },
  },
  {
    id: "W8",
    kind: "workshop",
    banner: "/assets/images/actividades/banners/W8.jpg",
    title: "PractiK: Explora, diviértete, aprende",
    description:
      "Soluciones para confort, energía y automatización mediante demos prácticas.",
    speakers: [
      {
        name: "Ing. Alberto Barbosa Vázquez",
        image: "/assets/images/actividades/ponentes/Ing.AlbertoBarbosa.jpeg",
      },
      {
        name: "Ing. Ely Jovany Franco Martínez",
        image: "/assets/images/actividades/ponentes/Ing.ElyFranco.jpeg",
      },
    ],
    modal: {
      title: "PractiK: Explora, diviértete, aprende",
      paragraphs: [
        "Uso de demos para conocer, conectar y programar componentes que permitan el control de líquidos por electroniveles, la alternancia de bombas y control de alumbrado residencial.",
      ],
    },
  },
];

// Hook para cerrar con ESC y bloquear scroll cuando el modal está abierto
function useModalControls(isOpen: boolean, onClose: () => void) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      window.addEventListener("keydown", onKey);
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen, onClose]);
}

// Componente Modal mejorado
function Modal({ open, title, children, onClose, speakers }) {
  useModalControls(open, onClose);
  
  // Efecto para manejar el foco dentro del modal
  useEffect(() => {
    if (open) {
      // Enfocar el modal cuando se abre
      const modalElement = document.querySelector('.actividades-modal-content');
      if (modalElement) {
        (modalElement as HTMLElement).focus();
      }
    }
  }, [open]);

  if (!open) return null;
  
  return (
    <div className="actividades-modal">
      <div 
        className="actividades-modal-backdrop" 
        onClick={onClose}
      />
      
      <div className="actividades-modal-content">
        <div className="actividades-modal-header">
          <h3 className="actividades-modal-title">{title}</h3>
          {/* Botón de cerrar restaurado en la posición correcta */}
          <button
            onClick={onClose}
            className="actividades-modal-close"
            aria-label="Cerrar modal"
          >
            &times;
          </button>
        </div>
        
        <div className="actividades-modal-body">
          <div className="actividades-modal-grid">
            <div className="actividades-modal-main">
              {children}
            </div>
            
            <div className="actividades-modal-sidebar">
              <h4>Ponente(s)</h4>
              <div className="actividades-modal-speakers">
                {speakers.map((speaker) => (
                  <div key={speaker.name} className="actividades-modal-speaker">
                    <img
                      src={speaker.image}
                      alt={`Imagen de ${speaker.name}`}
                      className="actividades-modal-speaker-image"
                      loading="lazy"
                    />
                    <h5 className="actividades-modal-speaker-name">{speaker.name}</h5>
                    {speaker.institution && (
                      <p className="actividades-modal-speaker-institution">{speaker.institution}</p>
                    )}
                    {speaker.bio && (
                      <p className="actividades-modal-speaker-bio">{speaker.bio}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="actividades-modal-footer">
          <button onClick={onClose} className="actividades-modal-close">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

// Presentación compacta de speakers dentro de la card - CORREGIDO
function SpeakersRow({ speakers }: { speakers: Speaker[] }) {
  return (
    <div className="speaker-info">
      {speakers.length === 1 ? (
        <div className="speaker-single">
          <img
            src={speakers[0].image}
            alt={`Imagen del ponente ${speakers[0].name}`}
            className="speaker-image"
            loading="lazy"
          />
          <span className="speaker-name">{speakers[0].name}</span>
        </div>
      ) : (
        <div className="speaker-multiple">
          <p className="speaker-multiple-title">Ponentes:</p>
          <div className="speaker-multiple-list">
            {speakers.map((speaker) => (
              <div key={speaker.name} className="speaker-multiple-item">
                <img
                  src={speaker.image}
                  alt={`Imagen del ponente ${speaker.name}`}
                  className="speaker-multiple-image"
                  loading="lazy"
                />
                <span className="speaker-multiple-name">{speaker.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Card reutilizable mejorada - CORREGIDA
function ActivityCard({ activity, onOpen }: { activity: Activity; onOpen: () => void }) {
  return (
    <div
      className="activity-card"
      onClick={onOpen}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen()}
      tabIndex={0}
      role="button"
      aria-label={`Ver detalles de ${activity.title}`}
    >
      <div className="activity-header">
        <img
          src={activity.banner}
          alt={`Banner de ${activity.title}`}
          className="activity-logo"
          loading="lazy"
        />
        <span className={`activity-badge ${
          activity.kind === "conference" 
            ? "activity-badge-conference" 
            : "activity-badge-workshop"
        }`}>
          {activity.kind === "conference" ? "Conferencia" : "Workshop"}
        </span>
      </div>
      
      <h3>{activity.title}</h3>
      
      <div className="activity-description">
        <p>{activity.description}</p>
      </div>
      
      <SpeakersRow speakers={activity.speakers} />
    </div>
  );
}

// Sección genérica (conferencias o workshops) - CORREGIDA
function ActivitiesSection({
  title,
  id,
  items,
  onOpen,
}: {
  title: string;
  id: string;
  items: Activity[];
  onOpen: (id: string) => void;
}) {
  return (
    <section id={id} className="actividades-section">
      <div className="container">
        <div className="actividades-section-header">
          <h2 className="actividades-section-title">{title}</h2>
          <p className="actividades-section-description">
            {title.includes("Conferencias") 
              ? "Sesiones magistrales con expertos en diferentes áreas de la ingeniería industrial"
              : "Talleres prácticos para desarrollar habilidades específicas en el ámbito industrial"}
          </p>
        </div>
        
        <div className="activities-container">
          {items.map((activity) => (
            <ActivityCard 
              key={activity.id} 
              activity={activity} 
              onOpen={() => onOpen(activity.id)} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Componente principal - CORREGIDO
// actividades.tsx - Componente principal actualizado
export default function Activities() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const conferences = useMemo(
    () => activitiesData.filter((a) => a.kind === "conference"),
    []
  );
  
  const workshops = useMemo(
    () => activitiesData.filter((a) => a.kind === "workshop"),
    []
  );

  const current = useMemo(
    () => activitiesData.find((a) => a.id === openId) || null,
    [openId]
  );

  // Simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

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

  // Componente Skeleton
  const SkeletonCard = () => (
    <div className="activity-card">
      <div className="activity-header">
        <div className="activity-logo skeleton"></div>
        <span className={`activity-badge skeleton`}></span>
      </div>
      <div className="skeleton-text" style={{height: '24px', margin: '1rem'}}></div>
      <div className="activity-description">
        <div className="skeleton-text" style={{height: '16px', marginBottom: '0.5rem'}}></div>
        <div className="skeleton-text" style={{height: '16px', width: '80%'}}></div>
      </div>
      <div className="speaker-info">
        <div className="speaker-single">
          <div className="speaker-image skeleton"></div>
          <span className="speaker-name skeleton-text" style={{width: '120px', height: '16px'}}></span>
        </div>
      </div>
    </div>
  );

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;
    
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - 80; // Ajustar para el header fijo
    
    const startPosition = window.pageYOffset;
    const distance = offsetPosition - startPosition;
    const duration = 800;
    let startTime: number | null = null;
    
    function animation(currentTime: number) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    // Función de easing para animación suave
    function easeInOutQuad(t: number, b: number, c: number, d: number): number {
      t /= d/2;
      if (t < 1) return c/2*t*t + b;
      t--;
      return -c/2 * (t*(t-2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
  };

  return (
    <div className="actividades-container">
      {/* Barra de progreso de scroll */}
      <div 
        className="scroll-progress-bar" 
        style={{ '--scroll-progress': `${scrollProgress}%` } as React.CSSProperties}
      />
      
      {/* Hero Section */}
      <section className="actividades-hero">
        <div className="container">
          <h1>Actividades Académicas</h1>
          <p className="text-balance">
            Descubre todas las conferencias magistrales y workshops especializados 
            que tenemos preparados para ti en esta jornada de ingeniería industrial.
          </p>
          <div className="actividades-hero-buttons">
            <button 
              onClick={() => scrollToSection('conferencias')} 
              className="actividades-hero-btn-primary"
            >
              Ver Conferencias
            </button>
            <button 
              onClick={() => scrollToSection('workshops')} 
              className="actividades-hero-btn-secondary"
            >
              Ver Workshops
            </button>
          </div>
        </div>
      </section>

      {/* Sección de Conferencias */}
      <section id="conferencias" className="actividades-section">
        <div className="container">
          <div className="actividades-section-header">
            <h2 className="actividades-section-title">Conferencias Magistrales</h2>
            <p className="actividades-section-description">
              Sesiones magistrales con expertos en diferentes áreas de la ingeniería industrial
            </p>
          </div>
          
          <div className="activities-container">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            ) : (
              conferences.map((activity) => (
                <ActivityCard 
                  key={activity.id} 
                  activity={activity} 
                  onOpen={() => setOpenId(activity.id)} 
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Sección de Workshops */}
      <section id="workshops" className="actividades-section">
        <div className="container">
          <div className="actividades-section-header">
            <h2 className="actividades-section-title">Workshops Especializados</h2>
            <p className="actividades-section-description">
              Talleres prácticos para desarrollar habilidades específicas en el ámbito industrial
            </p>
          </div>
          
          <div className="activities-container">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            ) : (
              workshops.map((activity) => (
                <ActivityCard 
                  key={activity.id} 
                  activity={activity} 
                  onOpen={() => setOpenId(activity.id)} 
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Modal */}
      {current && (
        <Modal 
          open={!!current} 
          title={current.modal.title} 
          onClose={() => setOpenId(null)}
          speakers={current.speakers}
        >
          {current.modal.paragraphs?.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
          
          {current.modal.bullets && current.modal.bullets.length > 0 && (
            <>
              <h5>Puntos clave:</h5>
              <ul>
                {current.modal.bullets.map((bullet, index) => (
                  <li key={index}>{bullet}</li>
                ))}
              </ul>
            </>
          )}
          
          {current.modal.numbered && current.modal.numbered.length > 0 && (
            <>
              <h5>Contenido del taller:</h5>
              <ol>
                {current.modal.numbered.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ol>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}