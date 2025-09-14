import React, { useState } from 'react';
import './staff.css';

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
    image: "/assets/images/staff",
    email: "accardenas@ucaribe.edu.mx",
    bio: "Doctor en Educación con más de 15 años de experiencia en gestión académica y desarrollo curricular.",
    specialties: ["Gestión Académica", "Desarrollo Curricular", "Liderazgo Educativo"]
  },
  {
    id: 3,
    name: "Doc. Mijail Armenta Aracenta",
    position: "Staff",
    department: "Comité",
    image: "/assets/images/staff",
    email: "marmenta@ucaribe.edu.mx",
    bio: "Doctora en Educación con más de 15 años de experiencia en gestión académica y desarrollo curricular.",
    specialties: ["Gestión Académica", "Desarrollo Curricular", "Liderazgo Educativo"]
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
    image: "/assets/images/staff",
    email: "220300886@ucaribe.edu.mx",
    bio: "Doctora en Educación con más de 15 años de experiencia en gestión académica y desarrollo curricular.",
    specialties: ["Gestión Académica", "Desarrollo Curricular", "Liderazgo Educativo"]
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
    image: "/assets/images/staff",
    email: "220300860@ucaribe.edu.mx",
    bio: "Doctora en Educación con más de 15 años de experiencia en gestión académica y desarrollo curricular.",
    specialties: ["Gestión Académica", "Desarrollo Curricular", "Liderazgo Educativo"]
  },
  {
    id: 9,
    name: "Estrella Marian Castro Meneses",
    position: "Coordinadora de Coffee Break",
    department: "Comité",
    image: "/assets/images/staff",
    email: "250300929@ucaribe.edu.mx",
    bio: "Doctora en Educación con más de 15 años de experiencia en gestión académica y desarrollo curricular.",
    specialties: ["Gestión Académica", "Desarrollo Curricular", "Liderazgo Educativo"]
  },
  {
    id: 10,
    name: "Angel David Victoriano Can",
    position: "Coordinador de Redes Sociales",
    department: "Comité",
    image: "/assets/images/staff",
    email: "230300927@ucaribe.edu.mx",
    bio: "Doctora en Educación con más de 15 años de experiencia en gestión académica y desarrollo curricular.",
    specialties: ["Gestión Académica", "Desarrollo Curricular", "Liderazgo Educativo"]
  },
  {
    id: 11,
    name: "Vanessa Regina Álvarez Hernández",
    position: "Registro",
    department: "Staff",
    image: "/assets/images/staff",
    email: "230300892@ucaribe.edu.mx",
    bio: "Doctora en Educación con más de 15 años de experiencia en gestión académica y desarrollo curricular.",
    specialties: ["Gestión Académica", "Desarrollo Curricular", "Liderazgo Educativo"]
  },
  {
    id: 12,
    name: "Zuri Sarahi Alvarez Hernandez",
    position: "Mundialito",
    department: "Staff",
    image: "/assets/images/staff",
    email: "230300932@ucaribe.edu.mx",
    bio: "Ingeniero en Sistemas con especialización en infraestructura tecnológica educativa.",
    specialties: ["Infraestructura TI", "Sistemas Educativos", "Innovación Tecnológica"]
  },
  {
    id: 13,
    name: "America Sarahi Lavadores May",
    position: "Coffee Break",
    department: "Staff",
    image: "/assets/images/staff",
    email: "250300916@ucaribe.edu.mx",
    bio: "Licenciada en Psicología especializada en orientación estudiantil y bienestar universitario.",
    specialties: ["Orientación Estudiantil", "Bienestar Universitario", "Psicología Educativa"]
  },
  {
    id: 14,
    name: "José Gilberto Cano Greene",
    position: "Mundialito",
    department: "Staff",
    image: "/assets/images/staff",
    email: "240300873@ucaribe.edu.mx",
    bio: "Doctor en Ciencias con amplia experiencia en investigación aplicada y gestión de proyectos.",
    specialties: ["Investigación Aplicada", "Gestión de Proyectos", "Metodología Científica"]
  },
  {
    id: 15,
    name: "Celeste Jazmin Chulin Arredondo",
    position: "Registro",
    department: "Staff",
    image: "/assets/images/staff",
    email: "230300890@ucaribe.edu.mx",
    bio: "Especialista en comunicación institucional y marketing educativo con enfoque digital.",
    specialties: ["Comunicación Institucional", "Marketing Digital", "Relaciones Públicas"]
  },
  {
    id: 16,
    name: "Yolanda Elizabeth Coronado Chim",
    position: "Mundialito",
    department: "Staff",
    image: "/assets/images/staff",
    email: "250300931@ucaribe.edu.mx",
    bio: "Ingeniero especializado en equipamiento y gestión de laboratorios técnicos.",
    specialties: ["Gestión de Laboratorios", "Equipamiento Técnico", "Seguridad Industrial"]
  },
  {
    id: 17,
    name: "José Armando Domenzain Gonzalez",
    position: "Coffee Break",
    department: "Staff",
    image: "/assets/images/staff",
    email: "210300644@ucaribe.edu.mx",
    bio: "Licenciada en Administración con experiencia en gestión académica y atención estudiantil.",
    specialties: ["Gestión Administrativa", "Atención al Cliente", "Procesos Académicos"]
  },
  {
    id: 18,
    name: "Samantha De Jesus García Morales",
    position: "Coffee Break",
    department: "Staff",
    image: "/assets/images/staff",
    email: "230300923@ucaribe.edu.mx",
    bio: "Doctor en Educación especializado en aseguramiento de la calidad y acreditación universitaria.",
    specialties: ["Aseguramiento de Calidad", "Acreditación", "Evaluación Institucional"]
  },
  {
    id: 19,
    name: "Ariana Guelmes Sanchez",
    position: "Coffee Break",
    department: "Staff",
    image: "/assets/images/staff",
    email: "240300882@ucaribe.edu.mx",
    bio: "Bibliotecóloga con especialización en recursos digitales y servicios de información académica.",
    specialties: ["Gestión Bibliotecaria", "Recursos Digitales", "Servicios de Información"]
  },
  {
    id: 20,
    name: "Ambar Atzimba Gutierrez Anell",
    position: "Registro",
    department: "Staff",
    image: "/assets/images/staff",
    email: "240301030@ucaribe.edu.mx",
    bio: "Bibliotecóloga con especialización en recursos digitales y servicios de información académica.",
    specialties: ["Gestión Bibliotecaria", "Recursos Digitales", "Servicios de Información"]
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
    image: "/assets/images/staff",
    email: "240300896@ucaribe.edu.mx",
    bio: "Bibliotecóloga con especialización en recursos digitales y servicios de información académica.",
    specialties: ["Gestión Bibliotecaria", "Recursos Digitales", "Servicios de Información"]
  },
  {
    id: 25,
    name: "Xochitl Andrea Marin Estrella",
    position: "Comida/Infraestrutura",
    department: "Staff",
    image: "/assets/images/staff",
    email: "250300948@ucaribe.edu.mx",
    bio: "Bibliotecóloga con especialización en recursos digitales y servicios de información académica.",
    specialties: ["Gestión Bibliotecaria", "Recursos Digitales", "Servicios de Información"]
  },
  {
    id: 26,
    name: "Victoriano May May",
    position: "Registro",
    department: "Staff",
    image: "/assets/images/staff",
    email: "240300889@ucaribe.edu.mx",
    bio: "Bibliotecóloga con especialización en recursos digitales y servicios de información académica.",
    specialties: ["Gestión Bibliotecaria", "Recursos Digitales", "Servicios de Información"]
  },
  {
    id: 27,
    name: "Edgar Mauricio May Perez",
    position: "Comida/Infraestrutura",
    department: "Staff",
    image: "/assets/images/staff",
    email: "sofia.mendoza@universidad.edu",
    bio: "Bibliotecóloga con especialización en recursos digitales y servicios de información académica.",
    specialties: ["Gestión Bibliotecaria", "Recursos Digitales", "Servicios de Información"]
  },
  {
    id: 28,
    name: "Clío Aranzazú Mercado Infante",
    position: "Redes Sociales",
    department: "Staff",
    image: "/assets/images/staff",
    email: "230300970@ucaribe.edu.mx",
    bio: "Bibliotecóloga con especialización en recursos digitales y servicios de información académica.",
    specialties: ["Gestión Bibliotecaria", "Recursos Digitales", "Servicios de Información"]
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
    image: "/assets/images/staff",
    email: "250300910@ucaribe.edu.mx",
    bio: "Bibliotecóloga con especialización en recursos digitales y servicios de información académica.",
    specialties: ["Gestión Bibliotecaria", "Recursos Digitales", "Servicios de Información"]
  },
  {
    id: 32,
    name: "Yoltzin Diego Piña Rangel",
    position: "Comida/Infraestrutura",
    department: "Staff",
    image: "/assets/images/staff",
    email: "250301082@ucaribe.edu.mx",
    bio: "Bibliotecóloga con especialización en recursos digitales y servicios de información académica.",
    specialties: ["Gestión Bibliotecaria", "Recursos Digitales", "Servicios de Información"]
  },
  {
    id: 33,
    name: "José Francisco Poot Hernández",
    position: "Comida/Infraestrutura",
    department: "Staff",
    image: "/assets/images/staff",
    email: "250300901@ucaribe.edu.mx",
    bio: "Bibliotecóloga con especialización en recursos digitales y servicios de información académica.",
    specialties: ["Gestión Bibliotecaria", "Recursos Digitales", "Servicios de Información"]
  },
  {
    id: 34,
    name: "Pamela Yzquierdo Guillen",
    position: "Redes Sociales",
    department: "Staff",
    image: "/assets/images/staff",
    email: "240300875@ucaribe.edu.mx",
    bio: "Bibliotecóloga con especialización en recursos digitales y servicios de información académica.",
    specialties: ["Gestión Bibliotecaria", "Recursos Digitales", "Servicios de Información"]
  },
  {
    id: 35,
    name: "Aldo Alejandro Melquiades Mendez",
    position: "Redes Sociales",
    department: "Staff",
    image: "/assets/images/staff",
    email: "230300917@ucaribe.edu.mx",
    bio: "Bibliotecóloga con especialización en recursos digitales y servicios de información académica.",
    specialties: ["Gestión Bibliotecaria", "Recursos Digitales", "Servicios de Información"]
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
            <h1>Nuestro Equipo</h1>
            <p>
              Conoce a los profesores y estudiantes que hacen posible nuestra misión educativa. 
              Un equipo comprometido con la excelencia y la innovación.
            </p>
          </div>
        </div>

        {/* Staff Section */}
        <div className="staff-section">
          <div className="container">
            {/* Filtros por departamento */}
            <div className="staff-filters">
              {departments.map(dept => (
                <button
                  key={dept}
                  className={`filter-btn ${selectedDepartment === dept ? 'active' : ''}`}
                  onClick={() => setSelectedDepartment(dept)}
                >
                  {dept === 'all' ? 'Todos' : dept}
                </button>
              ))}
            </div>

            {/* Grid de staff */}
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