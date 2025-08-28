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
        entre los asistentes.`
    },
    {
      id: "objetivo",
      title: "Objetivo General",
      content: `Generar un espacio de encuentro entre estudiantes, académicos, egresados, empleadores,
        investigadores e interesados en el ejercicio de la Ingeniería Industrial para la difusión
        de su alcance, impacto y tendencias a nivel nacional e internacional.`
    },
    {
      id: "publico",
      title: "Público Objetivo",
      content: `Estudiantes, académicos, egresados, empleadores, investigadores e interesados
        en el ejercicio de la Ingeniería Industrial que busquen conocer el alcance,
        impacto y tendencias de esta disciplina a nivel nacional e internacional.`
    },
    {
      id: "mision",
      title: "Misión",
      content: `Formar integralmente profesionales con conocimientos, habilidades,
        competencias y valores socialmente significativos, que los posicionen competitivamente
        en su entorno; capaces de aplicar el conocimiento y la cultura para el desarrollo
        humano. Realizar investigación y extensión universitaria relevantes, para contribuir al
        progreso social, económico y cultural del Estado y del País.`
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
        gobierno, sector productivo y sociedad en general.`
    }
  ];

  return (
    <section className="event-info-section text-light py-5">
      <div className="container">
        {sections.map((section, index) => (
          <div key={section.id}>
            {index > 0 && <hr className="my-5" />}
            <div className="row align-items-center">
              <div className="col-lg-7 mb-4 mb-lg-0">
                <div className="info-content">
                  <h2 id={section.id} className="display-4 fw-bold">{section.title}</h2>
                  <p className="lead mt-3">{section.content}</p>
                </div>
              </div>
              <div className="col-lg-5">
                <img 
                  src={`/assets/images/carousel/comite.jpg`}
                  alt={section.title}
                  className="img-fluid rounded shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/assets/images/placeholder.jpg';
                  }}
                />
              </div>
            </div>
          </div>
        ))}

        <hr className="my-5" />
        
        {/* Map section */}
        <div className="row">
          <div className="col-12">
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.79233394753!2d-86.82603072473866!3d21.200406980492243!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f4c2c298cab405b%3A0xc7ce34485e9b3b8!2sUniversidad%20del%20Caribe!5e0!3m2!1ses!2smx!4v1751600476163!5m2!1ses!2smx"
                width="100%"
                height="450"
                style={{
                  border: 0,
                  borderRadius: '20px',
                  marginTop: '1rem'
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Universidad del Caribe Location"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventInfo;