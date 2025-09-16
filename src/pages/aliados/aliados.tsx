import React, { useEffect, useState } from "react";
import { motion } from 'framer-motion';
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

// Componente para cada tarjeta de aliado con animaciones
function AllyCard({ ally, index }: { ally: Ally; index: number }) {
  return (
    <motion.div
      className="ally-card"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10, transition: { duration: 0.2 } }}
    >
      <div className="ally-header">
        <motion.img
          src={ally.logo}
          alt={`Logo de ${ally.name}`}
          className="ally-logo"
          loading="lazy"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        />
      </div>
      <div className="ally-content">
        <h3 className="ally-name">{ally.name}</h3>
        <p className="ally-description">{ally.description}</p>
        {ally.website && (
          <motion.a
            href={ally.website}
            target="_blank"
            rel="noopener noreferrer"
            className="ally-website-link"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Visitar sitio web
          </motion.a>
        )}
      </div>
    </motion.div>
  );
}

// Componente Skeleton con animación
function SkeletonCard({ index }: { index: number }) {
  return (
    <motion.div
      className="ally-card"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="ally-header">
        <div className="ally-logo skeleton"></div>
      </div>
      <div className="ally-content">
        <div className="skeleton-text" style={{ height: "24px", marginBottom: "0.5rem" }}></div>
        <div className="skeleton-text" style={{ height: "16px", marginBottom: "0.5rem" }}></div>
        <div className="skeleton-text" style={{ height: "16px", width: "80%" }}></div>
      </div>
    </motion.div>
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
      
      <motion.main 
        className="w-full mt-[-80px] md:mt-[-80px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Hero Section con animación */}
        <motion.section 
          className="aliados-hero"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="container">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Nuestros Aliados
            </motion.h1>
            <div className="flex mb-6 justify-center">
              <div className="w-16 h-1 rounded-full bg-[#00d4d4] inline-flex"></div>
            </div>
            <motion.p 
              className="text-balance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Conoce a las organizaciones y patrocinadores que hacen posible la realización de la Jornada de Ingeniería Industrial 2025.
            </motion.p>
          </div>
        </motion.section>

        {/* Sección de Aliados */}
        <motion.section 
          className="aliados-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="container">
            <div className="aliados-section-header">
              <motion.h2 
                className="aliados-section-title"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                Impulsando la Excelencia
              </motion.h2>
              <motion.p 
                className="aliados-section-description"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Agradecemos profundamente el apoyo y la confianza de cada uno de nuestros aliados estratégicos.
              </motion.p>
            </div>

            <div className="allies-grid-container">
              {isLoading
                ? Array.from({ length: alliesData.length }).map((_, index) => (
                    <SkeletonCard key={index} index={index} />
                  ))
                : alliesData.map((ally, index) => (
                    <AllyCard key={ally.id} ally={ally} index={index} />
                  ))}
            </div>
          </div>
        </motion.section>

        {/* Sección de Agradecimiento con animación */}
        <motion.section 
          className="aliados-thanks"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="container">
            <motion.div 
              className="thanks-content"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
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
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >✦</motion.span>
                <span>Universidad del Caribe</span>
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >✦</motion.span>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </motion.main>
    </div>
  );
}