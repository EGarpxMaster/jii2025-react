import React, { useState } from 'react';
import './staff.css';
import { AnimateSharedLayout, motion } from 'framer-motion';
import { AnimatedH1, AnimatedH2,AnimatedParagraph, AnimatedButtonSecondary, AnimatedH4, AnimatedArrowIcon, ScaleContainer } from '../../components/animations';
import { 
  SlideUpContainer, 
  StaggerContainer, 
  StaggerItem ,
  SlideLeftContainer,
  SlideRightContainer
} from '../../components/animations';
import {
  ScrollSlideUp,
  ScrollStaggerContainer,
  ScrollStaggerItem
} from '../../components/animations';


// Tipos TypeScript
interface StaffMember {
  id: number;
  name: string;
  position: string;
  department: string;
  image: string;
  email?: string;
  bio?: string;
  specialties?: string[];
}

interface StaffPageProps {
  className?: string;
}

const StaffPage: React.FC<StaffPageProps> = ({ className = '' }) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null);

 // Datos de ejemplo del staff con posiciones actualizadas
const staffMembers: StaffMember[] = [
  {
    id: 1,
    name: "Mtro. Jarmen Said Virgen Suarez",
    position: "Staff",
    department: "Comité",
    image: "/assets/images/staff/comite/JarmenVirgen.jpeg",
    email: "jvirgen@ucaribe.edu.mx",
    bio: "Profesor-Investigador de Tiempo Completo en la Universidad del Caribe, adscrito al Programa de Ingeniería Industrial. Su labor académica se ha consolidado en las áreas de eficiencia energética y energías renovables. Ha sido responsable de la organización de la Jornada de Ingeniería Industrial en 2023, 2024 y 2025, contribuyendo al fortalecimiento académico y a la vinculación de la comunidad universitaria con el sector productivo.",
    specialties: ["Electricidad", "Mecánica", "Energía", "Ingeniería Aplicada", "Docencia Innovadora", "Organización Académica", "Proyectos con Impacto Social"]
  },
  {
    id: 2,
    name: "Doc. Alejandro Charbel Cardenas Leon",
    position: "Staff",
    department: "Comité",
    image: "/assets/images/staff/comite/AlejandroCardenas.png",
    email: "accardenas@ucaribe.edu.mx",
    bio: "El Dr. Cárdenas es profesor-investigador de tiempo completo en la Universidad del Caribe, adscrito al Departamento de Ciencias Básicas e Ingenierías. Es Ingeniero Industrial por el Tecnológico Nacional de México, Maestro en Administración por la Universidad de Guanajuato y Doctor en Ciencias por la Universidad Michoacana de San Nicolás de Hidalgo. \n\nA lo largo de su trayectoria ha impartido asignaturas como matemáticas, estadística, economía, investigación de operaciones y modelado cuantitativo, orientadas a la formación integral del ingeniero industrial. Su línea de investigación se enfoca en el desarrollo de modelos económicos alternativos, destacando la propuesta de producción consciente, un enfoque que integra sostenibilidad, ética y eficiencia en los procesos productivos.",
    specialties: ["Modelos Económicos Alternativos", "Análisis Cuantitativo y Estadístico", "Física Clásica y Cuántica","Docencia en Ciencias Básicas","Análisis y Visualización de Datos"]
  },
  {
    id: 3,
    name: "Doc. Mijail Armenta Aracenta",
    position: "Staff",
    department: "Comité",
    image: "/assets/images/staff/comite/MijailArmenta.jpg",
    email: "marmenta@ucaribe.edu.mx",
    bio: "Ingeniero Industrial con Maestría en Ciencias de la ingeniería industrial con especialidad en calidad y Doctorado en Educación. Actualmente profesor investigador de tiempo completo del Departamento de Ciencias Básicas e Ingenierías de la Universidad del Caribe y Coordinador del Programa Educativo de Ingeniería Industrial.",
    specialties: ["Metrologia", "Calidad", "Ergonomía","Análisis de Procesos","Seguridad e Higiene"]
  },
  {
    id: 4,
    name: "Mtra. Gaby Betsaida Batun Chay",
    position: "Staff",
    department: "Comité",
    image: "/assets/images/staff",
    email: "gbatun@ucaribe.edu.mx",
    bio: "Doctora en Educación con más de 15 años de experiencia en gestión académica y desarrollo curricular.",
    specialties: ["Gestión Académica", "Desarrollo Curricular", "Liderazgo Educativo"]
  },
  {
    id: 5,
    name: "Guadalupe Azucena Rodriguez Cauich",
    position: "Coordinadora General",
    department: "Comité",
    image: "/assets/images/staff/comite/Guadalupe.jpeg",
    email: "210300603@ucaribe.edu.mx",
    bio: "Estudiante de Ingeniería Industrial en la Universidad del Caribe. Participante activa en proyectos académicos y en la organización de la Jornada de Ingeniería Industrial 2025.",
    specialties: ["Manufactura", "Gestión de Proyectos"]
  },
  {
    id: 6,
    name: "Mauricio Antonio Montero Martin",
    position: "Coordinador de Mundialito",
    department: "Comité",
    image: "/assets/images/staff/comite/MauricioMontero.jpg",
    email: "220300886@ucaribe.edu.mx",
    bio: "Estudiante de Ingeniería Industrial. Participante de la JII-2023 y staff en la JII-2024.",
    specialties: ["Creatividad", "Empatía", "Compromiso"]
  },
  {
    id: 7,
    name: "Juan Diego Estañol Noh",
    position: "Coordinador de Comida/Infraestrutura",
    department: "Comité",
    image: "/assets/images/staff/comite/Diego.png",
    email: "220300868@ucaribe.edu.mx",
    bio: "Ingeniero Industrial con aspiraciones Mecanico-Eléctricas.",
    specialties: ["Resolución de problemas", "Actividades Técnicas", "Liderazgo"]
  },
  {
    id: 8,
    name: "José Antonio Arevalo Barrientos",
    position: "Staff",
    department: "Comité",
    image: "/assets/images/staff/comite/JoseArevalo.png",
    email: "220300860@ucaribe.edu.mx",
    bio: "Estudiante de Ingeniería Industrial especializado es el diseño 3D.",
    specialties: ["Diseño 3D", "Soldadura", "Mantenimiento Industrial", "Gestión", "Manejo de Maquinaria"]
  },
  {
    id: 9,
    name: "Estrella Marian Castro Meneses",
    position: "Coordinadora de Coffee Break",
    department: "Comité",
    image: "/assets/images/staff/comite/EstrellaCastro.jpg",
    email: "250300929@ucaribe.edu.mx",
    bio: "Estudiante de Ingeniería Industrial de primer semestre en la Universidad del Caribe, con iniciativa para aportar, crecer y aprender dentro de la comunidad universitaria.",
    specialties: ["Trabajo en Equipo", "Organización", "Responsabilidad","Comunicación","Adaptabilidad","Creatividad"]
  },
  {
    id: 10,
    name: "Ángel David Victoriano Can",
    position: "Coordinador de Redes Sociales",
    department: "Comité",
    image: "/assets/images/staff/AngelVictoriano.jpg",
    email: "230300927@ucaribe.edu.mx",
    bio: "Estudiante de quinto semestre de Ingeniería Industrial, con interés en el diseño de planos, el armado de equipos y la mejora de procesos.",
    specialties: ["Diseño y Elaboración de Planos", "Armado y Mantenimiento de Equipo", "Optimización de Procesos"]
  },
  {
    id: 11,
    name: "Vanessa Regina Álvarez Hernández",
    position: "Registro",
    department: "Staff",
    image: "/assets/images/staff/VanessaAlvarez.jpg",
    email: "230300892@ucaribe.edu.mx",
    bio: "Estudiante de Ingeniería Industrial.",
    specialties: ["Cocinar", "Realización de proyectos", "Tocar el violín",]
  },
  {
    id: 12,
    name: "Zuri Sarahi Alvarez Hernandez",
    position: "Mundialito",
    department: "Staff",
    image: "/assets/images/staff/ZuriAlvarez.png",
    email: "230300932@ucaribe.edu.mx",
    bio: "Estudiante de Ingeniería Industrial, actualmente cursando la preespecialidad en Producción, Manufactura y Mantenimiento.",
    specialties: ["Liderazgo", "Trabajo en Equipo", "Resolución de Problemas", "Gestión y Mejora de Procesos"]
  },
  {
    id: 13,
    name: "America Sarahi Lavadores May",
    position: "Coffee Break",
    department: "Staff",
    image: "/assets/images/staff/AmericaLavadores.jpg",
    email: "250300916@ucaribe.edu.mx",
    bio: "Estudiante de Ingeniería Industrial, con educación previa en área de sociales, especialmente en derecho y arte.",
    specialties: ["Matemáticas", "Gestión de personal", "Trabajo en Equipo", "Oratoria"]
  },
  {
    id: 14,
    name: "José Gilberto Cano Greene",
    position: "Mundialito",
    department: "Staff",
    image: "/assets/images/staff/JoseCano.png",
    email: "240300873@ucaribe.edu.mx",
    bio: "Estudiante de Ingeniería Industrial con formación en Mecatrónica e interés en la automatización, la tecnología y el diseño en SolidWorks.",
    specialties: ["Diseño", "Adaptabilidad", "Automatización", "Trabajo en Equipo"]
  },
  {
    id: 15,
    name: "Celeste Jazmin Chulin Arredondo",
    position: "Registro",
    department: "Staff",
    image: "/assets/images/staff/CelesteChulin.jpg",
    email: "230300890@ucaribe.edu.mx",
    bio: "Estudiante de Ingeniería Industrial en 5to semestre, con un gran interés en el desarrollo de proyectos y el trabajo en equipo.",
    specialties: ["Organización de eventos", "Networking","Adquisición de conocimientos"]
  },
  {
    id: 16,
    name: "Yolanda Elizabeth Coronado Chim",
    position: "Mundialito",
    department: "Staff",
    image: "/assets/images/staff/YolandaCoronado.png",
    email: "250300931@ucaribe.edu.mx",
    bio: "Estudiante de primer semestre de Ingeniería Industrial.",
    specialties: ["Liderazgo", "Comunicación", "Capacitación"]
  },
  {
    id: 17,
    name: "José Armando Domenzain Gonzalez",
    position: "Coffee Break",
    department: "Staff",
    image: "/assets/images/staff/JoseDomenzain.jpg",
    email: "210300644@ucaribe.edu.mx",
    bio: "Estudiante de 9° semestre de la carrera de Ingeniería Industrial.",
    specialties: ["Planeación", "Creatividad","Diseño"]
  },
  {
    id: 18,
    name: "Samantha De Jesus García Morales",
    position: "Coffee Break",
    department: "Staff",
    image: "/assets/images/staff/SamanthaGarcia.png",
    email: "230300923@ucaribe.edu.mx",
    bio: "Estudiante de Ingeniería Industrial desde 2023, actualmente cursando la preespecialidad en Producción, Manufactura y Mantenimiento.",
    specialties: ["Resolución de Problemas","Adaptabilidad","Creatividad","Innovación"]
  },
  {
    id: 19,
    name: "Ariana Guelmes Sanchez",
    position: "Coffee Break",
    department: "Staff",
    image: "/assets/images/staff/ArianaGuelmes.jpg",
    email: "240300882@ucaribe.edu.mx",
    bio: "Estudiante de 3er Semestre de la Carrera de Ingeniería Industrial.",
    specialties: ["Cálculo", "Álgebra"]
  },
  {
    id: 20,
    name: "Ambar Atzimba Gutierrez Anell",
    position: "Registro",
    department: "Staff",
    image: "/assets/images/staff/AmbarGutierrez.jpeg",
    email: "240301030@ucaribe.edu.mx",
    bio: "Estudiante de ingeniería industrial que a largo de la trayectoria académica ha desarrollado sus habilidades para la resolución de problemas y la comunicación. En el ámbito profesional ha desarrollado organización y trabajo en equipo.",
    specialties: ["Creatividad", "Trabajo en Equipo"]
  },
  {
    id: 21,
    name: "Jesús Adrián Hernández Clila",
    position: "Coffee Break",
    department: "Staff",
    image: "/assets/images/staff/JesusHernandez.jpeg",
    email: "250300945@ucaribe.edu.mx",
    bio: "Soy estudiante de Ingeniería Industrial, con una formación técnica en Mantenimiento Industrial que desarrollé durante la preparatoria. Realicé mis prácticas profesionales en el taller de carritos de golf del Moon Palace, donde adquirí experiencia práctica en mantenimiento y reparación de equipos. Actualmente, me enfoco en seguir fortaleciendo mis conocimientos en procesos industriales para aportar soluciones eficientes en el ámbito laboral.",
    specialties: ["Mantenimiento y Reparación de Equipos Industriales", "Uso de Herramientas y Maquinaria"]
  },
  {
    id: 22,
    name: "Rigoberto Jimenez Jimenez",
    position: "Coffee Break",
    department: "Staff",
    image: "/assets/images/staff/RigobertoJimenez.png",
    email: "240300910@ucaribe.edu.mx",
    bio: "Estudiante de ingieneria industrial cursando tercer semestre.",
    specialties: ["Pensamiento critico", "Creatividad", "Innovación","Resolución de problemas", "Adaptabilidad"]
  },
  {
    id: 23,
    name: "Keren Jaquelin Álvarez Luis",
    position: "Registro",
    department: "Staff",
    image: "/assets/images/staff/KerenAlvarez.jpg",
    email: "240300903@ucaribe.edu.mx",
    bio: "Soy estudiante de la carrera de Ingeniería Industrial en la Universidad del Caribe, dónde me estoy formando en áreas relacionadas con la optimización de procesos, gestión de recursos y mejora continua.",
    specialties: ["Gestión Académica"]
  },
  {
    id: 24,
    name: "Francisco Javier López Hernández",
    position: "Redes Sociales",
    department: "Staff",
    image: "/assets/images/staff/FranciscoLopez.jpg",
    email: "240300896@ucaribe.edu.mx",
    bio: "Técnico en Mantenimiento Industrial y Estudiante de Ingeniería Industrial de la Universidad del Caribe",
    specialties: ["Resolución de Problemas Matemáticos y Físicos","Análisis Lógico","Pensamiento Crítico"]
  },
  {
    id: 25,
    name: "Xochitl Andrea Marin Estrella",
    position: "Comida/Infraestrutura",
    department: "Staff",
    image: "/assets/images/staff/XochitlMarin.jpg",
    email: "250300948@ucaribe.edu.mx",
    bio: "Estudiante de primer semestre en la carrera de Ingeniería Industrial. Actualmente en proceso de formación en distintas áreas desarrollando pensamiento analítico y capacidad de resolución de problemas. Profesionalmente, interesada en adquirir experiencia que complemente mi preparación académica, participando en proyectos, actividades estudiantiles y oportunidades que me permitan fortalecer habilidades como el trabajo en equipo, la comunicación efectiva y la organización, con el objetivo de crecer como futura Ingeniera Industrial.",
    specialties: ["Trabajo en Equipo", "Tolerancia y Empatía", "Habilidades Manuales y Creativas", "Compromiso y Responsabilidad"]
  },
  {
    id: 26,
    name: "Victoriano May May",
    position: "Registro",
    department: "Staff",
    image: "/assets/images/staff/VictorianoMay.jpg",
    email: "240300889@ucaribe.edu.mx",
    bio: "Estudiante de Ingeniería Industrial en la Universidad del Caribe. con formación técnica en la industria hotelera con experiencia en control de calidad, atención al cliente y manejo de información.",
    specialties: ["Control de Calidad", "Atención al Cliente", "Trabajo en Equipo", "Liderazgo"]
  },
  {
    id: 27,
    name: "Edgar Mauricio May Perez",
    position: "Comida/Infraestrutura",
    department: "Staff",
    image: "/assets/images/staff/EdgarMay.jpg",
    email: "sofia.mendoza@universidad.edu",
    bio: "Estudiante universitario que se ha esforzado al máximo en cada etapa de su formación. Durante el último año ha trabajado con dedicación y constancia, lo que le ha permitido obtener muy altas calificaciones y aprovechar al máximo cada aprendizaje. Cada materia y cada reto académico han sido una oportunidad para crecer, no solo en conocimientos, sino también en disciplina y compromiso.",
    specialties: ["Matemáticas", "Responsable", "Organización", "Disciplina"]
  },
  {
    id: 28,
    name: "Clío Aranzazú Mercado Infante",
    position: "Redes Sociales",
    department: "Staff",
    image: "/assets/images/staff/ClioMercado.jpeg",
    email: "230300970@ucaribe.edu.mx",
    bio: "Estudiante de Ingeniería Industrial con interés  por los procesos de manufactura. Actualmente cursando la materia de Laboratorio de Manufactura, donde esta desarrollando habilidades en esmerilado y soldadura. Próxima a iniciar prácticas profesionales para fortalecer conocimientos y experiencia en la industria.",
    specialties: ["Esmerilado y Soldadura", "Trabajo en Equipo","Mejora de Procesos de Manufactura "]
  },
  {
    id: 29,
    name: "Saul Nahuat Alvarado",
    position: "Traslado de Ponentes",
    department: "Staff",
    image: "/assets/images/staff/SaulAlvarado.png",
    email: "230300880@ucaribe.edu.mx",
    bio: "Estudiante de Ing. Industrial.",
    specialties: ["Trabajo en equipo", "Proactivo", "Aprendizaje constante"]
  },
  {
    id: 30,
    name: "David Olmedo Jiménez",
    position: "Coffee Break",
    department: "Staff",
    image: "/assets/images/staff/DavidOlmedo.jpg",
    email: "240300881@ucaribe.edu.mx",
    bio: "Estudiante de Ingeniería Industrial y actualmente trabajando en lo que me apasiona.",
    specialties: ["Matemáticas", "Cálculo", "Facilidad de Aprendizaje"]
  },
  {
    id: 31,
    name: "Gustavo Alberto Perez Cen",
    position: "Mundialito",
    department: "Staff",
    image: "/assets/images/staff/GustavoPerez.jpg",
    email: "250300910@ucaribe.edu.mx",
    bio: "Estudiante de Ingeniería Industrial comprometido con el aprendizaje.",
    specialties: ["Trabajo en Equipo", "Resolución de problemas", "Creatividad","Comunicación"]
  },
  {
    id: 32,
    name: "Yoltzin Diego Piña Rangel",
    position: "Comida/Infraestrutura",
    department: "Staff",
    image: "/assets/images/staff/YoltzinPina.jpeg",
    email: "250301082@ucaribe.edu.mx",
    bio: "Egresado de CONALEP en la carrera de Técnico en Construcción, actualmente estudiando Ingeniería Industrial en la Universidad del Caribe para ampliar mis conocimientos y desarrollar habilidades que me permitan un enfoque más integral en el ámbito profesional.",
    specialties: ["Liderazgo", "Trabajos Pesados"]
  },
  {
    id: 33,
    name: "José Francisco Poot Hernández",
    position: "Comida/Infraestrutura",
    department: "Staff",
    image: "/assets/images/staff/JosePoot.jpg",
    email: "250300901@ucaribe.edu.mx",
    bio: "Técnico en ventas con experiencia en áreas de servicio operativas y administrativas.",
    specialties: ["Negociación", "Trabajo en Equipo", "Liderazgo"]
  },
  {
    id: 34,
    name: "Pamela Yzquierdo Guillen",
    position: "Redes Sociales",
    department: "Staff",
    image: "/assets/images/staff/PamelaYzquierdo.jpg",
    email: "240300875@ucaribe.edu.mx",
    bio: "Estudiante de Ingeniería Industrial de tercer semestre",
    specialties: ["Amabilidad", "Adaptabilidad", "Empatía"]
  },
  {
    id: 35,
    name: "Aldo Alejandro Melquiades Mendez",
    position: "Redes Sociales",
    department: "Staff",
    image: "/assets/images/staff/AldoMelquiades.jpeg",
    email: "230300917@ucaribe.edu.mx",
    bio: "Egresado de Colegio de Bachilleres 2, actualmente cursando la carrera de Ingeniería Industrial.",
    specialties: ["Creación y Edición de Multimedia"]
  },
];

  // Obtener departamentos únicos
  const departments = ['all', ...Array.from(new Set(staffMembers.map(member => member.department)))];

  // Filtrar miembros por departamento
  const filteredMembers = selectedDepartment === 'all' 
    ? staffMembers 
    : staffMembers.filter(member => member.department === selectedDepartment);

  const openModal = (member: StaffMember) => {
    setSelectedMember(member);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedMember(null);
    document.body.style.overflow = 'unset';
  };

  return (
      <main className="w-full mt-[-80px] md:mt-[-80px]">
      <div className={`staff-container ${className}`}>
        {/* Hero Section */}
        <div className="staff-hero">
          <div className="container">
            <AnimatedH1>
            <h1>Nuestro Equipo</h1>
            </AnimatedH1>
            <div className="flex mb-6 justify-center">
              <div className="w-16 h-1 rounded-full bg-[#00d4d4] inline-flex"></div>
            </div>
            <AnimatedH4>
            <p className="max-w-2xl mx-auto mt-6 historia-text-lg text-white">
              Conoce a los profesores y estudiantes que hacen posible nuestra misión educativa. 
              Un equipo comprometido con la excelencia y la innovación.
            </p></AnimatedH4>
          </div>
        </div>

        {/* Staff Section */}
        <div className="staff-section">
          <div className="container">
            {/* Filtros por departamento */}
            <div className="staff-filters">
              {departments.map(dept => (
                <AnimatedButtonSecondary>
                <button
                  key={dept}
                  className={`filter-btn ${selectedDepartment === dept ? 'active' : ''}`}
                  onClick={() => setSelectedDepartment(dept)}
                >
                  {dept === 'all' ? 'Todos' : dept}
                </button></AnimatedButtonSecondary>
              ))}
            </div>

            {/* Grid de staff */}
            <ScaleContainer>
            <div className="staff-grid">
              {filteredMembers.map(member => (
                <div 
                  key={member.id}
                  className="staff-card"
                  onClick={() => openModal(member)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openModal(member);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Ver perfil de ${member.name}`}
                >
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="staff-image"
                  />
                  <div className="staff-info">
                    <h3 className="staff-name">{member.name}</h3>
                    <p className="staff-position">{member.position}</p>
                    <p className="staff-department">{member.department}</p>
                  </div>
                </div>
              ))}
            </div>
            </ScaleContainer>
          </div>
        </div>

        {/* Modal */}
        {selectedMember && (
          <div className="staff-modal" onClick={closeModal}>
            <div className="staff-modal-backdrop" />
            <div 
              className="staff-modal-content"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-labelledby="modal-title"
              aria-modal="true"
            >
              <div className="staff-modal-header">
                <h2 id="modal-title" className="staff-modal-title">
                  Perfil del Staff
                </h2>
                <button 
                  className="staff-modal-close"
                  onClick={closeModal}
                  aria-label="Cerrar modal"
                >
                  ×
                </button>
              </div>
              
              <div className="staff-modal-body">
                <div className="staff-modal-profile">
                  <img 
                    src={selectedMember.image} 
                    alt={selectedMember.name}
                    className="staff-modal-image"
                  />
                  <div>
                    <h3 className="staff-modal-name">{selectedMember.name}</h3>
                    <p className="staff-modal-position">{selectedMember.position}</p>
                    <p className="staff-modal-department">{selectedMember.department}</p>
                    {selectedMember.email && (
                      <p className="staff-modal-email">
                        <strong>Email:</strong> {selectedMember.email}
                      </p>
                    )}
                  </div>
                </div>

                {selectedMember.bio && (
                  <div className="staff-modal-section">
                    <h3>Biografía</h3>
                    <p>{selectedMember.bio}</p>
                  </div>
                )}

                {selectedMember.specialties && selectedMember.specialties.length > 0 && (
                  <div className="staff-modal-section">
                    <h3>Especialidades</h3>
                    <div className="staff-specialties">
                      {selectedMember.specialties.map((specialty, index) => (
                        <span key={index} className="specialty-tag">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default StaffPage;