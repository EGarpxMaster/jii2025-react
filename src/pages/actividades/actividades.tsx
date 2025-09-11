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
  id: string; // C1, C2, W1, F1 etc.
  kind: "conference" | "workshop" | "forum"; // kind "forum" was added
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
  // Conferences
  {
    id: "C1",
    kind: "conference",
    banner: "/assets/images/actividades/banners/C1.jpg",
    title: "Del dato a la decisión: cómo pensar como un ingeniero y actuar como un financiero.", // [cite: 48]
    description:
      "Se aborda la gestión de operaciones desde una perspectiva financiera, resaltando la importancia de integrar el pensamiento de negocios en la práctica profesional.", // [cite: 49]
    speakers: [
      {
        name: "Lic. Aaron Zavala Serrano", // [cite: 41]
        image: "/assets/images/actividades/ponentes/Mtro.DavidCorrea.jpeg",
        bio: "Profesional en gestión de negocios y optimización de procesos, con más de 11 años de experiencia integrando áreas operativas y de análisis para impulsar el control financiero.", // [cite: 43]
        institution: "Playa Hotels & Resorts", // [cite: 46]
      },
    ],
    modal: {
      title: "Del dato a la decisión: cómo pensar como un ingeniero y actuar como un financiero.", // [cite: 48]
      paragraphs: [
        "Se aborda la gestión de operaciones desde una perspectiva financiera, resaltando la importancia de integrar el pensamiento de negocios en la práctica profesional.", // [cite: 49]
        "A lo largo de la charla, los asistentes comprenderán nociones clave sobre el retorno de inversión en la gestión de operaciones, el concepto de flujo financiero y la manera en que las decisiones cotidianas pueden traducirse en impactos directos en la rentabilidad y sostenibilidad de un negocio.", // [cite: 50]
        "El objetivo es que los futuros profesionales adquieran una visión integral, donde la ingeniería y las finanzas se complementen para fortalecer la toma de decisiones estratégicas.", // [cite: 51]
      ],
    },
  },
  {
    id: "C2",
    kind: "conference",
    banner: "/assets/images/actividades/banners/C2.jpeg",
    title: "Optimización en una línea de producción: un caso real.", // [cite: 11]
    description:
      "Un experto en modelación y optimización de sistemas complejos presenta un caso de estudio sobre los beneficios de la vinculación universidad-industria.", // [cite: 4, 5]
    speakers: [
      {
        name: "Dr. Miguel Mata Pérez", // [cite: 1]
        image: "/assets/images/actividades/ponentes/Dra.RuthReyes.jpeg",
        bio: "Experto en modelación y optimización de sistemas complejos y de gran escala. Ha sido asesor en más de 20 proyectos de vinculación universidad-industria.", // [cite: 4, 5]
        institution: "Universidad Autónoma de Nuevo León", // [cite: 9]
      },
    ],
    modal: {
      title: "Optimización en una línea de producción: un caso real.", // [cite: 11]
      paragraphs: [
        "El Dr. Miguel Mata, experto en modelación y optimización de sistemas complejos y de gran escala, compartirá su experiencia asesorando en más de 20 proyectos de vinculación universidad-industria.", // [cite: 4, 5]
        "A través de un caso real, se mostrarán los importantes beneficios generados para el sector productivo regional, colaborando con empresas como Whirlpool, Volvo, Schneider Electric y Oxxo. Los intereses del Dr. Mata incluyen la optimización matemática aplicada y la creación de herramientas cuantitativas para la toma de decisiones en la cadena de suministro.", // [cite: 5, 7]
      ],
    },
  },
  {
    id: "C3",
    kind: "conference",
    banner: "/assets/images/actividades/banners/C3.jpg",
    title: "Ingeniería en capas: como la manufactura aditiva construye el futuro.", // [cite: 30]
    description:
      "Descubre cómo la impresión 3D está revolucionando los procesos industriales mediante el diseño funcional, materiales sostenibles y prototipado inteligente.", // [cite: 31]
    speakers: [
      {
        name: "Dra. Cynthia Graciela Flores Hernández", // [cite: 20]
        image: "/assets/images/actividades/ponentes/Lic.ArturoGuzman.jpeg",
        bio: "Investigadora SNI nivel 1 con 15 años de experiencia. Sus intereses incluyen la síntesis de materiales compuestos y la fabricación de polímeros mediante impresión 3D.", // [cite: 24, 28]
        institution: "ITESM / TecNM campus Querétaro", // [cite: 27]
      },
    ],
    modal: {
      title: "Ingeniería en capas: como la manufactura aditiva construye el futuro.", // [cite: 30]
      paragraphs: [
        "Descubre cómo la impresión 3D está revolucionando los procesos industriales mediante el diseño funcional, materiales sostenibles y prototipado inteligente.", // [cite: 31]
        "Una mirada práctica a la manufactura aditiva como aliada de la innovación en ingeniería industrial.", // [cite: 32]
      ],
    },
  },
  {
    id: "C4",
    kind: "conference",
    banner: "/assets/images/actividades/banners/C4.jpg",
    title: "3 Herramientas para un proyecto de vida.", // [cite: 67]
    description:
      "Una charla sobre liderazgo, propósito en el trabajo y desarrollo personal para impactar positivamente en tu vida y tu carrera profesional.", // [cite: 62, 65]
    speakers: [
      {
        name: "Lic. Arturo Guzmán Contreras", // [cite: 55]
        image: "/assets/images/actividades/ponentes/Dra.LidiliaCruz.jpg",
        bio: "Conferencista nacional, fundador de Giro 180 A.C., organización enfocada en el desarrollo integral y emocional de las personas.", // [cite: 61, 62]
        institution: "Giro 180 A.C.", // [cite: 61]
      },
    ],
    modal: {
      title: "3 Herramientas para un proyecto de vida.", // [cite: 67]
      paragraphs: [
        "El Lic. Arturo Guzmán Contreras es un profesional comprometido con el desarrollo humano, combinando su creatividad, conocimiento teológico y experiencia en el área social para impactar positivamente en la vida de los demás.", // [cite: 65]
        "Como conferencista, ha impartido charlas a nivel nacional, abordando temas de liderazgo, propósito en el trabajo y propósitos de vida en empresas, dependencias gubernamentales e instituciones educativas.", // [cite: 62]
      ],
    },
  },
  // Workshops
  {
    id: "W1",
    kind: "workshop",
    banner: "/assets/images/actividades/banners/W1.jpg",
    title: "Teoría de inventarios: de la teoría básica a la complejidad de la aplicación.", // [cite: 15]
    description:
      "Taller práctico sobre la creación de herramientas cuantitativas para la toma de decisiones en la cadena de suministro y la gestión de inventarios.", // [cite: 7]
    speakers: [
      {
        name: "Dr. Miguel Mata Pérez", // [cite: 1]
        image: "/assets/images/actividades/ponentes/Mtro.DavidCorrea.jpeg",
        bio: "Experto en modelación y optimización de sistemas complejos y de gran escala. Ha sido asesor en más de 20 proyectos de vinculación universidad-industria.", // [cite: 4, 5]
        institution: "Universidad Autónoma de Nuevo León", // [cite: 9]
      },
    ],
    modal: {
      title: "Introducción a la teoría de inventarios: de la teoría básica a la complejidad de la aplicación.", // [cite: 15]
      paragraphs: [
        "Este workshop, dirigido por el Dr. Miguel Mata, se enfoca en sus principales intereses: la optimización matemática aplicada y la creación de herramientas cuantitativas para la toma de decisiones en la cadena de suministro.", // [cite: 7]
        "Los participantes obtendrán una base sólida para modelar y optimizar sistemas logísticos complejos, basados en la amplia experiencia del Dr. Mata como asesor de la industria y miembro fundador de la Sociedad Mexicana de Investigación de Operaciones.", // [cite: 5, 8]
      ],
    },
  },
  {
    id: "W2",
    kind: "workshop",
    banner: "/assets/images/actividades/banners/W2.jpg",
    title: "Ingeniería de empaque y embalaje.", // [cite: 83]
    description:
      "Taller intensivo que ofrece una mirada práctica y conceptual al mundo del empaque y embalaje desde una perspectiva de ingeniería.", // [cite: 84]
    speakers: [
      {
        name: "Dr. Juan Hurtado", // [cite: 80]
        image: "/assets/images/actividades/ponentes/Dra.LidiliaCruz.jpg",
        bio: "Especialista nacional en el diseño, materiales y logística que influyen en la protección, presentación y sostenibilidad de los productos.",
        institution: "Nacional", // [cite: 80]
      },
    ],
    modal: {
      title: "Ingeniería de empaque y embalaje", // [cite: 83]
      paragraphs: [
        "Este taller intensivo ofrece una mirada práctica y conceptual al mundo del empaque y embalaje desde una perspectiva ingenieril.", // [cite: 84]
        "A lo largo de tres horas, los participantes conocerán los fundamentos técnicos, materiales utilizados, criterios de diseño y consideraciones logísticas que influyen en la protección, presentación y sostenibilidad de los productos.", // [cite: 85]
        "Ideal para quienes buscan ampliar su perfil profesional, explorar nuevas oportunidades laborales o fortalecer sus conocimientos en esta área clave de la cadena de suministro.", // [cite: 86]
      ],
    },
  },
  {
    id: "W3",
    kind: "workshop",
    banner: "/assets/images/actividades/banners/W3.jpg",
    title: "Diseña, imprime, impacta - La manufactura aditiva transforma la ingeniería.", // [cite: 35]
    description:
      "En este taller práctico descubrirás cómo preparar y fabricar tus propias piezas, conociendo el funcionamiento de una impresora 3D FDM desde cero.", // [cite: 36, 37]
    speakers: [
      {
        name: "Dra. Cynthia Graciela Flores Hernández", // [cite: 20]
        image: "/assets/images/actividades/ponentes/Mtra.LeslyeRamirez.jpg",
        bio: "Investigadora SNI nivel 1 con 15 años de experiencia. Sus intereses incluyen la síntesis de materiales compuestos y la fabricación de polímeros mediante impresión 3D.", // [cite: 24, 28]
        institution: "ITESM / TecNM campus Querétaro", // [cite: 27]
      },
    ],
    modal: {
      title: "Diseña, imprime, impacta - La manufactura aditiva transforma la ingeniería", // [cite: 35]
      paragraphs: [
        "En este taller práctico descubrirás cómo preparar y fabricar tus propias piezas.", // [cite: 36]
        "Conocerás el funcionamiento de una impresora 3D FDM, el uso de filamentos, el proceso de laminado y los aspectos clave para lograr impresiones exitosas desde cero.", // [cite: 37]
      ],
    },
  },

  // NEW FORUMS DATA
  {
    id: "F1",
    kind: "forum",
    banner: "/assets/images/actividades/banners/W1.jpg",
    title: "Panel de egresados: “de Industrial a Industrial”",
    description:
      "Egresados exitosos comparten sus trayectorias profesionales y ofrecen valiosos consejos a las nuevas generaciones.",
    speakers: [
      {
        name: "Ing. Sofía Reyes",
        image: "/assets/images/actividades/ponentes/ponente_placeholder_1.png",
        bio: "Gerente de Proyectos en Tech Solutions, egresada de la generación 2015.",
      },
      {
        name: "Ing. Carlos Vega",
        image: "/assets/images/actividades/ponentes/ponente_placeholder_2.png",
        bio: "Especialista en Cadena de Suministro en Global Logistics, egresado de la generación 2017.",
      },
    ],
    modal: {
      title: "Panel de egresados: “de Industrial a Industrial”",
      paragraphs: [
        "Un encuentro inspirador donde egresados destacados de nuestra carrera de Ingeniería Industrial dialogan sobre los desafíos y oportunidades que encontraron en el mundo laboral. Compartirán cómo aplicaron los conocimientos adquiridos y qué habilidades fueron clave para su desarrollo profesional.",
      ],
    },
  },
  {
    id: "F2",
    kind: "forum",
    banner: "/assets/images/actividades/banners/W2.jpg",
    title: "Conversatorio: “Movilidad Nacional e Internacional: Casos de éxito”",
    description:
      "Descubre las oportunidades de intercambio y desarrollo profesional más allá de las fronteras locales.",
    speakers: [
      {
        name: "M.C. Laura Méndez",
        image: "/assets/images/actividades/ponentes/ponente_placeholder_3.png",
        bio: "Coordinadora de Programas Internacionales con experiencia en convenios universitarios en Europa y América del Norte.",
        institution: "Universidad del Caribe",
      },
    ],
    modal: {
      title:
        "Conversatorio sobre Movilidad Nacional e Internacional: Casos de éxito",
      paragraphs: [
        "Este conversatorio está diseñado para explorar las vías y beneficios de la movilidad estudiantil y profesional. Se presentarán casos de éxito de estudiantes que han participado en programas de intercambio y profesionales que han expandido su carrera a nivel nacional e internacional, ofreciendo una guía práctica para quienes deseen seguir sus pasos.",
      ],
    },
  },
  {
    id: "F3",
    kind: "forum",
    banner: "/assets/images/actividades/banners/W3.jpg",
    title: "Espacio académico: Movilidad de posgrado",
    description:
      "Explora las opciones de maestrías y doctorados para especializarte y potenciar tu carrera profesional.",
    speakers: [
      {
        name: "Dr. Ricardo Morales",
        image: "/assets/images/actividades/ponentes/ponente_placeholder_4.png",
        bio: "Director del Departamento de Posgrados en Ingeniería, enfocado en la investigación y desarrollo tecnológico.",
        institution: "Universidad del Caribe",
      },
    ],
    modal: {
      title: "Espacio académico: Movilidad de posgrado",
      paragraphs: [
        "Una sesión informativa dedicada a resolver todas tus dudas sobre los programas de posgrado. Se discutirán las líneas de investigación, los requisitos de admisión, las oportunidades de becas y el impacto de un título de posgrado en el campo de la Ingeniería Industrial. Ideal para estudiantes que planean su futuro académico y profesional.",
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
// Tipa las props del modal
type ModalProps = {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  speakers?: Speaker[]; // opcional
};

// Componente Modal mejorado (reemplaza tu Modal por este)
function Modal({
  open,
  title,
  children,
  onClose,
  speakers = [],
}: ModalProps) {
  useModalControls(open, onClose);

  const contentRef = React.useRef<HTMLDivElement>(null);

  // Enfocar el contenedor del modal al abrir
  useEffect(() => {
    if (open && contentRef.current) {
      contentRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="actividades-modal">
      <div
        className="actividades-modal-backdrop"
        onClick={onClose}
      />

      <div
        className="actividades-modal-content"
        ref={contentRef}
        tabIndex={-1} // necesario para poder recibir foco
        role="dialog"
        aria-modal="true"
        aria-labelledby="actividades-modal-title"
      >
        <div className="actividades-modal-header">
          <h3 id="actividades-modal-title" className="actividades-modal-title">
            {title}
          </h3>

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
            <div className="actividades-modal-main">{children}</div>

            {speakers.length > 0 && (
              <div className="actividades-modal-sidebar">
                <h4>Ponente(s)</h4>
                <div className="actividades-modal-speakers">
                  {speakers.map((speaker) => (
                    <div key={speaker.name} className="actividades-modal-speaker">
                      {speaker.image && (
                        <img
                          src={speaker.image}
                          alt={`Imagen de ${speaker.name}`}
                          className="actividades-modal-speaker-image"
                          loading="lazy"
                        />
                      )}
                      <h5 className="actividades-modal-speaker-name">{speaker.name}</h5>
                      {speaker.institution && (
                        <p className="actividades-modal-speaker-institution">
                          {speaker.institution}
                        </p>
                      )}
                      {speaker.bio && (
                        <p className="actividades-modal-speaker-bio">{speaker.bio}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
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

// Card reutilizable mejorada - CORREGIDA Y ACTUALIZADA
function ActivityCard({
  activity,
  onOpen,
}: {
  activity: Activity;
  onOpen: () => void;
}) {
  const getBadgeInfo = () => {
    switch (activity.kind) {
      case "conference":
        return {
          label: "Conferencia",
          className: "activity-badge-conference",
        };
      case "workshop":
        return { label: "Workshop", className: "activity-badge-workshop" };
      case "forum":
        return { label: "Foro", className: "activity-badge-forum" };
      default:
        return { label: "", className: "" };
    }
  };

  const badge = getBadgeInfo();

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
        <span className={`activity-badge ${badge.className}`}>
          {badge.label}
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

// Componente principal - CORREGIDO Y ACTUALIZADO
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

  const forums = useMemo(
    () => activitiesData.filter((a) => a.kind === "forum"),
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
      const winHeightPx =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (scrollPx / winHeightPx) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener("scroll", updateScrollProgress);
    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);

  // Componente Skeleton
  const SkeletonCard = () => (
    <div className="activity-card">
      <div className="activity-header">
        <div className="activity-logo skeleton"></div>
        <span className={`activity-badge skeleton`}></span>
      </div>
      <div
        className="skeleton-text"
        style={{ height: "24px", margin: "1rem" }}
      ></div>
      <div className="activity-description">
        <div
          className="skeleton-text"
          style={{ height: "16px", marginBottom: "0.5rem" }}
        ></div>
        <div
          className="skeleton-text"
          style={{ height: "16px", width: "80%" }}
        ></div>
      </div>
      <div className="speaker-info">
        <div className="speaker-single">
          <div className="speaker-image skeleton"></div>
          <span
            className="speaker-name skeleton-text"
            style={{ width: "120px", height: "16px" }}
          ></span>
        </div>
      </div>
    </div>
  );

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    const elementPosition =
      element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - 80; // Ajustar para el header fijo

    const startPosition = window.pageYOffset;
    const distance = offsetPosition - startPosition;
    const duration = 300;  //
    let startTime: number | null = null;

    function animation(currentTime: number) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    // Función de easing para animación suave
    function easeInOutQuad(
      t: number,
      b: number,
      c: number,
      d: number
    ): number {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
  };

  return (
    <div className="actividades-container">
      {/* Barra de progreso de scroll */}
      <div
        className="scroll-progress-bar"
        style={{ "--scroll-progress": `${scrollProgress}%` } as React.CSSProperties}
      />
      <main className="w-full mt-[-80px] md:mt-[-80px]">
        {/* Hero Section */}
        <section className="actividades-hero">
          <div className="container">
            <h1>Actividades Académicas</h1>
            <p className="text-balance">
              Descubre todas las conferencias magistrales, workshops y foros
              especializados que tenemos preparados para ti.
            </p>
            <div className="actividades-hero-buttons">
              <button
                onClick={() => scrollToSection("conferencias")}
                className="actividades-hero-btn-primary"
              >
                Ver Conferencias
              </button>
              <button
                onClick={() => scrollToSection("workshops")}
                className="actividades-hero-btn-secondary"
              >
                Ver Workshops
              </button>
              {/* NEW BUTTON FOR FORUMS */}
              <button
                onClick={() => scrollToSection("forums")}
                className="actividades-hero-btn-secondary"
              >
                Ver Foros
              </button>
            </div>
          </div>
        </section>

        {/* Sección de Conferencias */}
        <section id="conferencias" className="actividades-section">
          <div className="container">
            <div className="actividades-section-header">
              <h2 className="actividades-section-title">
                Conferencias Magistrales
              </h2>
              <p className="actividades-section-description">
                Sesiones magistrales con expertos en diferentes áreas de la
                ingeniería industrial
              </p>
            </div>

            <div className="activities-container">
              {isLoading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <SkeletonCard key={index} />
                  ))
                : conferences.map((activity) => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      onOpen={() => setOpenId(activity.id)}
                    />
                  ))}
            </div>
          </div>
        </section>

        {/* Sección de Workshops */}
        <section id="workshops" className="actividades-section">
          <div className="container">
            <div className="actividades-section-header">
              <h2 className="actividades-section-title">
                Workshops Especializados
              </h2>
              <p className="actividades-section-description">
                Talleres prácticos para desarrollar habilidades específicas en
                el ámbito industrial
              </p>
            </div>

            <div className="activities-container">
              {isLoading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <SkeletonCard key={index} />
                  ))
                : workshops.map((activity) => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      onOpen={() => setOpenId(activity.id)}
                    />
                  ))}
            </div>
          </div>
        </section>

        {/* NEW FORUMS SECTION */}
        <section id="forums" className="actividades-section">
          <div className="container">
            <div className="actividades-section-header">
              <h2 className="actividades-section-title">Foros y Paneles</h2>
              <p className="actividades-section-description">
                Espacios de diálogo y debate sobre tendencias, desarrollo
                profesional y futuro académico.
              </p>
            </div>

            <div className="activities-container">
              {isLoading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <SkeletonCard key={index} />
                  ))
                : forums.map((activity) => (
                    <ActivityCard
                      key={activity.id}
                      activity={activity}
                      onOpen={() => setOpenId(activity.id)}
                    />
                  ))}
            </div>
          </div>
        </section>
      </main>

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