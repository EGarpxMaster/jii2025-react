import { type FC } from 'react';
import './event-info.css';

const EventInfo: FC = () => {
  const sections = [
    {
      id: "acerca",
      title: "Acerca del Evento",
      content: `La Jornada de Ingeniería Industrial de la Universidad del Caribe, es un evento
        desarrollado por el Colegio de Profesores de Ingeniería Industrial de la misma
        Casa de Estudios, con la intención de promover la difusión de esta rama de la
        ingeniería entre sus estudiantes, académicos, egresados, investigadores, empleadores
        e interesados en el ejercicio de la Ingeniería Industrial, a través del desarrollo
        de actividades académicas y de integración diseñadas con base en el perfil de egreso
        de este Programa Educativo, para favorecer el intercambio de conocimientos y experiencias
        entre los asistentes.`,
      image: '/assets/images/carousel/comite.jpg'
    },
    {
      id: "objetivo",
      title: "Objetivo General",
      content: `Generar un espacio de encuentro entre estudiantes, académicos, egresados, empleadores,
        investigadores e interesados en el ejercicio de la Ingeniería Industrial para la difusión
        de su alcance, impacto y tendencias a nivel nacional e internacional.`,
      image: '/assets/images/carousel/img1.jpg'
    },
    {
      id: "publico",
      title: "Público Objetivo",
      content: `Estudiantes, académicos, egresados, empleadores, investigadores e interesados
        en el ejercicio de la Ingeniería Industrial que busquen conocer el alcance,
        impacto y tendencias de esta disciplina a nivel nacional e internacional.`,
      image: '/assets/images/carousel/img2.jpg'
    },
    {
      id: "mision",
      title: "Misión",
      content: `Formar integralmente profesionales con conocimientos, habilidades,
        competencias y valores socialmente significativos, que los posicionen competitivamente
        en su entorno; capaces de aplicar el conocimiento y la cultura para el desarrollo
        humano. Realizar investigación y extensión universitaria relevantes, para contribuir al
        progreso social, económico y cultural del Estado y del País.`,
      image: '/assets/images/carousel/img3.jpg'
    },
    {
      id: "vision",
      title: "Visión",
      content: `En 2022 la Universidad del Caribe es una institución de educación superior con programas
        y servicios que atienden con pertinencia las tendencias y necesidades del entorno local, con
        una integración e inserción nacional e internacional. Focaliza el desarrollo de sus funciones
        sustantivas en las áreas estratégicas prioritarias: Turismo; Sustentabilidad y Medio Ambiente;
        Tecnología y Sistemas, Innovación y Negocios; Desarrollo Humano y Gestión Pública-Social, como
        compromiso y responsabilidad para impulsar el desarrollo económico, social y humano de
        Quintana Roo y México. Su oferta educativa tiene reconocimientos de calidad avalados por organismos
        nacionales e internacionales, logrando niveles de competitividad y posicionamiento altos, basados
        en el logro de indicadores de eficiencia, impacto y satisfacción de empleadores, egresados,
        gobierno, sector productivo y sociedad en general.`,
      image: '/assets/images/carousel/img4.jpg'
    }
  ];

  return (
    <section className="event-info">
      <div className="container">
        <div className="event-header">
          <h2>Jornada de Ingeniería Industrial 2025</h2>
          <p className="event-subtitle">Universidad del Caribe</p>
          <div className="header-divider"></div>
        </div>
        
        <div className="info-sections">
          {sections.map((section, index) => (
            <div key={section.id} className="info-card">
              <div className="card-content">
                <div className="card-number">0{index + 1}</div>
                <h3 id={section.id}>{section.title}</h3>
                <p>{section.content}</p>
              </div>
              <div className="card-image">
                <img 
                  src={section.image}
                  alt={section.title}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/assets/images/placeholder.jpg';
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="map-section">
          <div className="map-header">
            <h3>Ubicación del Evento</h3>
            <p>Universidad del Caribe, Cancún, Q.R.</p>
          </div>
          <div className="map-card">
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.79233394753!2d-86.82603072473866!3d21.200406980492243!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f4c2c298cab405b%3A0xc7ce34485e9b3b8!2sUniversidad%20del%20Caribe!5e0!3m2!1ses!2smx!4v1751600476163!5m2!1ses!2smx"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Universidad del Caribe Location"
              />
            </div>
            <div className="map-details">
              <div className="map-info">
                <h4>Dirección</h4>
                <p>Sm. 78, Mz. 1, Lt. 1, Carmen Puerto, 77528 Cancún, Q.R.</p>
              </div>
              <div className="map-info">
                <h4>Fecha</h4>
                <p>25-26 de Septiembre, 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventInfo;