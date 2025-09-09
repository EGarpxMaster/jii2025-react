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

  // Datos de ejemplo del staff
  const staffMembers: StaffMember[] = [
    {
      id: 1,
      name: "Dr. María González",
      position: "Directora Académica",
      department: "Dirección",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
      email: "maria.gonzalez@universidad.edu",
      bio: "Doctora en Educación con más de 15 años de experiencia en gestión académica y desarrollo curricular.",
      specialties: ["Gestión Académica", "Desarrollo Curricular", "Liderazgo Educativo"]
    },
    {
      id: 2,
      name: "Ing. Carlos Ramírez",
      position: "Coordinador de Tecnología",
      department: "Tecnología",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      email: "carlos.ramirez@universidad.edu",
      bio: "Ingeniero en Sistemas con especialización en infraestructura tecnológica educativa.",
      specialties: ["Infraestructura TI", "Sistemas Educativos", "Innovación Tecnológica"]
    },
    {
      id: 3,
      name: "Lic. Ana Martínez",
      position: "Coordinadora de Estudiantes",
      department: "Servicios Estudiantiles",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      email: "ana.martinez@universidad.edu",
      bio: "Licenciada en Psicología especializada en orientación estudiantil y bienestar universitario.",
      specialties: ["Orientación Estudiantil", "Bienestar Universitario", "Psicología Educativa"]
    },
    {
      id: 4,
      name: "Dr. Roberto Silva",
      position: "Investigador Principal",
      department: "Investigación",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      email: "roberto.silva@universidad.edu",
      bio: "Doctor en Ciencias con amplia experiencia en investigación aplicada y gestión de proyectos.",
      specialties: ["Investigación Aplicada", "Gestión de Proyectos", "Metodología Científica"]
    },
    {
      id: 5,
      name: "Lic. Patricia López",
      position: "Coordinadora de Comunicación",
      department: "Comunicaciones",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
      email: "patricia.lopez@universidad.edu",
      bio: "Especialista en comunicación institucional y marketing educativo con enfoque digital.",
      specialties: ["Comunicación Institucional", "Marketing Digital", "Relaciones Públicas"]
    },
    {
      id: 6,
      name: "Ing. Fernando Torres",
      position: "Coordinador de Laboratorios",
      department: "Tecnología",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face",
      email: "fernando.torres@universidad.edu",
      bio: "Ingeniero especializado en equipamiento y gestión de laboratorios técnicos.",
      specialties: ["Gestión de Laboratorios", "Equipamiento Técnico", "Seguridad Industrial"]
    },
    {
      id: 7,
      name: "Lic. Carmen Vega",
      position: "Asistente Administrativa",
      department: "Administración",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop&crop=face",
      email: "carmen.vega@universidad.edu",
      bio: "Licenciada en Administración con experiencia en gestión académica y atención estudiantil.",
      specialties: ["Gestión Administrativa", "Atención al Cliente", "Procesos Académicos"]
    },
    {
      id: 8,
      name: "Dr. Miguel Herrera",
      position: "Coordinador de Calidad",
      department: "Dirección",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
      email: "miguel.herrera@universidad.edu",
      bio: "Doctor en Educación especializado en aseguramiento de la calidad y acreditación universitaria.",
      specialties: ["Aseguramiento de Calidad", "Acreditación", "Evaluación Institucional"]
    },
    {
      id: 9,
      name: "Lic. Sofia Mendoza",
      position: "Coordinadora de Biblioteca",
      department: "Servicios Estudiantiles",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face",
      email: "sofia.mendoza@universidad.edu",
      bio: "Bibliotecóloga con especialización en recursos digitales y servicios de información académica.",
      specialties: ["Gestión Bibliotecaria", "Recursos Digitales", "Servicios de Información"]
    }
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
              Conoce a los profesionales dedicados que hacen posible nuestra misión educativa. 
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