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
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    email: "jvirgen@ucaribe.edu.mx",
    bio: "Doctora en Educación con más de 15 años de experiencia en gestión académica y desarrollo curricular.",
    specialties: ["Gestión Académica", "Desarrollo Curricular", "Liderazgo Educativo"]
  },
  {
    id: 2,
    name: "Doc. Alejandro Charbel Cardenas Leon",
    position: "Staff",
    department: "Comité",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    email: "accardenas@ucaribe.edu.mx",
    bio: "Doctor en Educación con más de 15 años de experiencia en gestión académica y desarrollo curricular.",
    specialties: ["Gestión Académica", "Desarrollo Curricular", "Liderazgo Educativo"]
  },
  {
    id: 3,
    name: "Doc. Mijail Armenta Aracenta",
    position: "Staff",
    department: "Comité",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    email: "marmenta@ucaribe.edu.mx",
    bio: "Doctora en Educación con más de 15 años de experiencia en gestión académica y desarrollo curricular.",
    specialties: ["Gestión Académica", "Desarrollo Curricular", "Liderazgo Educativo"]
  },
  {
    id: 4,
    name: "Mtra. Gaby Betsaida Batun Chay",
    position: "Staff",
    department: "Comité",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    email: "gbatun@ucaribe.edu.mx",
    bio: "Doctora en Educación con más de 15 años de experiencia en gestión académica y desarrollo curricular.",
    specialties: ["Gestión Académica", "Desarrollo Curricular", "Liderazgo Educativo"]
  },
  {
    id: 5,
    name: "Guadalupe Azucena Rodriguez Cauich",
    position: "Coordinadora de Traslado de Ponentes",
    department: "Comité",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    email: "210300603@ucaribe.edu.mx",
    bio: "Doctora en Educación con más de 15 años de experiencia en gestión académica y desarrollo curricular.",
    specialties: ["Gestión Académica", "Desarrollo Curricular", "Liderazgo Educativo"]
  },
  {
    id: 6,
    name: "Mauricio Antonio Montero Martin",
    position: "Coordinador de Mundialito",
    department: "Comité",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    email: "220300886@ucaribe.edu.mx",
    bio: "Doctora en Educación con más de 15 años de experiencia en gestión académica y desarrollo curricular.",
    specialties: ["Gestión Académica", "Desarrollo Curricular", "Liderazgo Educativo"]
  },
  {
    id: 7,
    name: "Juan Diego Estañol Noh",
    position: "Coordinador de Comida/Infraestrutura",
    department: "Comité",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    email: "220300868@ucaribe.edu.mx",
    bio: "Doctora en Educación con más de 15 años de experiencia en gestión académica y desarrollo curricular.",
    specialties: ["Gestión Académica", "Desarrollo Curricular", "Liderazgo Educativo"]
  },
  {
    id: 8,
    name: "José Antonio Arevalo Barrientos",
    position: "Staff",
    department: "Comité",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    email: "220300860@ucaribe.edu.mx",
    bio: "Doctora en Educación con más de 15 años de experiencia en gestión académica y desarrollo curricular.",
    specialties: ["Gestión Académica", "Desarrollo Curricular", "Liderazgo Educativo"]
  },
  {
    id: 9,
    name: "Estrella Marian Castro Meneses",
    position: "Coordinadora de Coffee Break",
    department: "Comité",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    email: "250300929@ucaribe.edu.mx",
    bio: "Doctora en Educación con más de 15 años de experiencia en gestión académica y desarrollo curricular.",
    specialties: ["Gestión Académica", "Desarrollo Curricular", "Liderazgo Educativo"]
  },
  {
    id: 10,
    name: "Angel David Victoriano Can",
    position: "Coordinador de Redes Sociales",
    department: "Comité",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    email: "230300927@ucaribe.edu.mx",
    bio: "Doctora en Educación con más de 15 años de experiencia en gestión académica y desarrollo curricular.",
    specialties: ["Gestión Académica", "Desarrollo Curricular", "Liderazgo Educativo"]
  },
  {
    id: 11,
    name: "Vanessa Regina Álvarez Hernández",
    position: "Registro",
    department: "Staff",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    email: "230300892@ucaribe.edu.mx",
    bio: "Doctora en Educación con más de 15 años de experiencia en gestión académica y desarrollo curricular.",
    specialties: ["Gestión Académica", "Desarrollo Curricular", "Liderazgo Educativo"]
  },
  {
    id: 12,
    name: "Zuri Sarahi Alvarez Hernandez",
    position: "Mundialito",
    department: "Staff",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    email: "230300932@ucaribe.edu.mx",
    bio: "Ingeniero en Sistemas con especialización en infraestructura tecnológica educativa.",
    specialties: ["Infraestructura TI", "Sistemas Educativos", "Innovación Tecnológica"]
  },
  {
    id: 13,
    name: "America Sarahi Lavadores May",
    position: "Coffee Break",
    department: "Staff",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    email: "250300916@ucaribe.edu.mx",
    bio: "Licenciada en Psicología especializada en orientación estudiantil y bienestar universitario.",
    specialties: ["Orientación Estudiantil", "Bienestar Universitario", "Psicología Educativa"]
  },
  {
    id: 14,
    name: "José Gilberto Cano Greene",
    position: "Mundialito",
    department: "Staff",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    email: "240300873@ucaribe.edu.mx",
    bio: "Doctor en Ciencias con amplia experiencia en investigación aplicada y gestión de proyectos.",
    specialties: ["Investigación Aplicada", "Gestión de Proyectos", "Metodología Científica"]
  },
  {
    id: 15,
    name: "Celeste Jazmin Chulin Arredondo",
    position: "Registro",
    department: "Staff",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
    email: "230300890@ucaribe.edu.mx",
    bio: "Especialista en comunicación institucional y marketing educativo con enfoque digital.",
    specialties: ["Comunicación Institucional", "Marketing Digital", "Relaciones Públicas"]
  },
  {
    id: 16,
    name: "Yolanda Elizabeth Coronado Chim",
    position: "Mundialito",
    department: "Staff",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
    email: "250300931@ucaribe.edu.mx",
    bio: "Ingeniero especializado en equipamiento y gestión de laboratorios técnicos.",
    specialties: ["Gestión de Laboratorios", "Equipamiento Técnico", "Seguridad Industrial"]
  },
  {
    id: 17,
    name: "José Armando Domenzain Gonzalez",
    position: "Coffee Break",
    department: "Staff",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
    email: "210300644@ucaribe.edu.mx",
    bio: "Licenciada en Administración con experiencia en gestión académica y atención estudiantil.",
    specialties: ["Gestión Administrativa", "Atención al Cliente", "Procesos Académicos"]
  },
  {
    id: 18,
    name: "Samantha De Jesus García Morales",
    position: "Coffee Break",
    department: "Staff",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    email: "230300923@ucaribe.edu.mx",
    bio: "Doctor en Educación especializado en aseguramiento de la calidad y acreditación universitaria.",
    specialties: ["Aseguramiento de Calidad", "Acreditación", "Evaluación Institucional"]
  },
  {
    id: 19,
    name: "Ariana Guelmes Sanchez",
    position: "Coffee Break",
    department: "Staff",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face",
    email: "240300882@ucaribe.edu.mx",
    bio: "Bibliotecóloga con especialización en recursos digitales y servicios de información académica.",
    specialties: ["Gestión Bibliotecaria", "Recursos Digitales", "Servicios de Información"]
  },
  {
    id: 20,
    name: "Ambar Atzimba Gutierrez Anell",
    position: "Registro",
    department: "Staff",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face",
    email: "240301030@ucaribe.edu.mx",
    bio: "Bibliotecóloga con especialización en recursos digitales y servicios de información académica.",
    specialties: ["Gestión Bibliotecaria", "Recursos Digitales", "Servicios de Información"]
  },
  {
    id: 21,
    name: "Jesús Adrián Hernández Clila",
    position: "Coffee Break",
    department: "Staff",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face",
    email: "250300945@ucaribe.edu.mx",
    bio: "Bibliotecóloga con especialización en recursos digitales y servicios de información académica.",
    specialties: ["Gestión Bibliotecaria", "Recursos Digitales", "Servicios de Información"]
  },
  {
    id: 22,
    name: "Rigoberto Jimenez Jimenez",
    position: "Coffee Break",
    department: "Staff",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face",
    email: "240300910@ucaribe.edu.mx",
    bio: "Bibliotecóloga con especialización en recursos digitales y servicios de información académica.",
    specialties: ["Gestión Bibliotecaria", "Recursos Digitales", "Servicios de Información"]
  },
  {
    id: 23,
    name: "Keren Jaquelin Álvarez Luis",
    position: "Registro",
    department: "Staff",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face",
    email: "240300903@ucaribe.edu.mx",
    bio: "Bibliotecóloga con especialización en recursos digitales y servicios de información académica.",
    specialties: ["Gestión Bibliotecaria", "Recursos Digitales", "Servicios de Información"]
  },
  {
    id: 24,
    name: "Francisco Javier López Hernández",
    position: "Redes Sociales",
    department: "Staff",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face",
    email: "240300896@ucaribe.edu.mx",
    bio: "Bibliotecóloga con especialización en recursos digitales y servicios de información académica.",
    specialties: ["Gestión Bibliotecaria", "Recursos Digitales", "Servicios de Información"]
  },
  {
    id: 25,
    name: "Xochitl Andrea Marin Estrella",
    position: "Comida/Infraestrutura",
    department: "Staff",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face",
    email: "250300948@ucaribe.edu.mx",
    bio: "Bibliotecóloga con especialización en recursos digitales y servicios de información académica.",
    specialties: ["Gestión Bibliotecaria", "Recursos Digitales", "Servicios de Información"]
  },
  {
    id: 26,
    name: "Victoriano May May",
    position: "Registro",
    department: "Staff",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face",
    email: "240300889@ucaribe.edu.mx",
    bio: "Bibliotecóloga con especialización en recursos digitales y servicios de información académica.",
    specialties: ["Gestión Bibliotecaria", "Recursos Digitales", "Servicios de Información"]
  },
  {
    id: 27,
    name: "Edgar Mauricio May Perez",
    position: "Comida/Infraestrutura",
    department: "Staff",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face",
    email: "sofia.mendoza@universidad.edu",
    bio: "Bibliotecóloga con especialización en recursos digitales y servicios de información académica.",
    specialties: ["Gestión Bibliotecaria", "Recursos Digitales", "Servicios de Información"]
  },
  {
    id: 28,
    name: "Clío Aranzazú Mercado Infante",
    position: "Redes Sociales",
    department: "Staff",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face",
    email: "230300970@ucaribe.edu.mx",
    bio: "Bibliotecóloga con especialización en recursos digitales y servicios de información académica.",
    specialties: ["Gestión Bibliotecaria", "Recursos Digitales", "Servicios de Información"]
  },
  {
    id: 29,
    name: "Saul Nahuat Alvarado",
    position: "Traslado de Ponentes",
    department: "Staff",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face",
    email: "230300880@ucaribe.edu.mx",
    bio: "Bibliotecóloga con especialización en recursos digitales y servicios de información académica.",
    specialties: ["Gestión Bibliotecaria", "Recursos Digitales", "Servicios de Información"]
  },
  {
    id: 30,
    name: "David Olmedo Jiménez",
    position: "Coffee Break",
    department: "Staff",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face",
    email: "240300881@ucaribe.edu.mx",
    bio: "Bibliotecóloga con especialización en recursos digitales y servicios de información académica.",
    specialties: ["Gestión Bibliotecaria", "Recursos Digitales", "Servicios de Información"]
  },
  {
    id: 31,
    name: "Gustavo Alberto Perez Cen",
    position: "Mundialito",
    department: "Staff",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face",
    email: "250300910@ucaribe.edu.mx",
    bio: "Bibliotecóloga con especialización en recursos digitales y servicios de información académica.",
    specialties: ["Gestión Bibliotecaria", "Recursos Digitales", "Servicios de Información"]
  },
  {
    id: 32,
    name: "Yoltzin Diego Piña Rangel",
    position: "Comida/Infraestrutura",
    department: "Staff",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face",
    email: "250301082@ucaribe.edu.mx",
    bio: "Bibliotecóloga con especialización en recursos digitales y servicios de información académica.",
    specialties: ["Gestión Bibliotecaria", "Recursos Digitales", "Servicios de Información"]
  },
  {
    id: 33,
    name: "José Francisco Poot Hernández",
    position: "Comida/Infraestrutura",
    department: "Staff",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face",
    email: "250300901@ucaribe.edu.mx",
    bio: "Bibliotecóloga con especialización en recursos digitales y servicios de información académica.",
    specialties: ["Gestión Bibliotecaria", "Recursos Digitales", "Servicios de Información"]
  },
  {
    id: 34,
    name: "Pamela Yzquierdo Guillen",
    position: "Redes Sociales",
    department: "Staff",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face",
    email: "240300875@ucaribe.edu.mx",
    bio: "Bibliotecóloga con especialización en recursos digitales y servicios de información académica.",
    specialties: ["Gestión Bibliotecaria", "Recursos Digitales", "Servicios de Información"]
  },
  {
    id: 35,
    name: "Aldo Alejandro Melquiades Mendez",
    position: "Redes Sociales",
    department: "Staff",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face",
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