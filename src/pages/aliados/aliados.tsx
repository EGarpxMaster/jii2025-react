import React, { useEffect, useState } from "react";
import "./aliados.css";

// Tipo simplificado para Aliado
type Ally = {
  id: string;
  name: string;
  logo: string;
  description: string;
  website?: string;
};

// Datos de ejemplo - Todos los aliados al mismo nivel
const alliesData: Ally[] = [
  {
    id: "P1",
    name: "Aguakan",
    logo: "/assets/images/aliados/logo-aguakan.png",
    description: "A través de su infraestructura provee el servicio público de agua potable. Esencial tanto para residentes como para la industria turística de la región.",
    website: "https://www2.aguakan.com/",
  },
  {
    id: "P2",
    name: "Ancona Autopartes",
    logo: "/assets/images/aliados/Autopartes-ANCONA.png",
    description: "Empresa líder en la península de Yucatán, dedicada a la comercialización de refacciones y autopartes para todo tipo de vehículos.",
    website: "https://www.anconaautopartes.com",
  },
  {
    id: "P3",
    name: "CrocoCunZoo",
    logo: "/assets/images/aliados/CrocoCunZoo.png",
    description: "Zoológico interactivo de conservación que ofrece una experiencia educativa, permitiendo un acercamiento directo con la fauna de la región.",
    website: "https://www.crococunzoo.com/",
  },
  {
    id: "P4",
    name: "GOmart",
    logo: "/assets/images/aliados/GOmart.png",
    description: "Cadena de tiendas de conveniencia que ofrece una amplia variedad de productos y servicios rápidos para clientes en movimiento.",
    website: "https://gomart.com.mx/",
  },
  {
    id: "P5",
    name: "Pink",
    logo: "/assets/images/aliados/Pink.png",
    description: "Empresa local que plasma tus diseños e ideas en una gran variedad de artículos, creando regalos únicos y personalizados para cualquier evento.",
    website: "https://www.facebook.com/profile.php?id=61567258522023",
  },
    {
    id: "P6",
    name: "RECREATIVO",
    logo: "/assets/images/aliados/RECREATIVO.png",
    description: "Fabricante de soluciones de identificación y seguridad para eventos, especializado en brazaletes, etiquetas y uniformes para el control de acceso.",
    website: "https://www.recreativo.cloudsoftmx.com/",
  }
];

// Hook para controlar el scroll progress
function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

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

  return scrollProgress;
}

// Componente para cada tarjeta de aliado (sin badge de categoría)
function AllyCard({ ally }: { ally: Ally }) {
  return (
    <div className="ally-card">
      <div className="ally-header">
        <img
          src={ally.logo}
          alt={`Logo de ${ally.name}`}
          className="ally-logo"
          loading="lazy"
        />
      </div>
      <div className="ally-content">
        <h3 className="ally-name">{ally.name}</h3>
        <p className="ally-description">{ally.description}</p>
        {ally.website && (
          <a
            href={ally.website}
            target="_blank"
            rel="noopener noreferrer"
            className="ally-website-link"
          >
            Visitar sitio web
          </a>
        )}
      </div>
    </div>
  );
}

// Componente Skeleton para loading
function SkeletonCard() {
  return (
    <div className="ally-card">
      <div className="ally-header">
        <div className="ally-logo skeleton"></div>
      </div>
      <div className="ally-content">
        <div className="skeleton-text" style={{ height: "24px", marginBottom: "0.5rem" }}></div>
        <div className="skeleton-text" style={{ height: "16px", marginBottom: "0.5rem" }}></div>
        <div className="skeleton-text" style={{ height: "16px", width: "80%" }}></div>
      </div>
    </div>
  );
}

export default function Aliados() {
  const scrollProgress = useScrollProgress();
  const [isLoading, setIsLoading] = useState(true);

  // Simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="aliados-container">
      {/* Barra de progreso de scroll */}
      <div
        className="scroll-progress-bar"
        style={{ "--scroll-progress": `${scrollProgress}%` } as React.CSSProperties}
      />
      
      <main className="w-full mt-[-80px] md:mt-[-80px]">
        {/* Hero Section */}
        <section className="aliados-hero">
          <div className="container">
            <h1>Nuestros Aliados</h1>
            <p className="text-balance">
              Conoce a las organizaciones y patrocinadores que hacen posible la realización de la Jornada de Ingeniería Industrial 2025.
            </p>
          </div>
        </section>

        {/* Sección de Aliados */}
        <section className="aliados-section">
          <div className="container">
            <div className="aliados-section-header">
              <h2 className="aliados-section-title">
                Impulsando la Excelencia
              </h2>
              <p className="aliados-section-description">
                Agradecemos profundamente el apoyo y la confianza de cada uno de nuestros aliados estratégicos.
              </p>
            </div>

            <div className="allies-grid-container">
              {isLoading
                ? Array.from({ length: alliesData.length }).map((_, index) => (
                    <SkeletonCard key={index} />
                  ))
                : alliesData.map((ally) => (
                    <AllyCard key={ally.id} ally={ally} />
                  ))}
            </div>
          </div>
        </section>

        {/* Sección de Agradecimiento */}
        <section className="aliados-thanks">
          <div className="container">
            <div className="thanks-content">
              <h2>Agradecimiento Especial</h2>
              <p className="thanks-message">
                Queremos expresar nuestro más sincero agradecimiento a todos nuestros aliados. 
                Su apoyo y confianza hacen posible que la Jornada de Ingeniería Industrial 2025 sea un evento 
                de excelencia que contribuye al desarrollo profesional y académico de nuestra comunidad.
              </p>
              <p className="thanks-signature">
                Gracias por creer en el futuro de la Ingeniería Industrial.
              </p>
              <div className="thanks-decoration">
                <span>✦</span>
                <span>Universidad del Caribe</span>
                <span>✦</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}