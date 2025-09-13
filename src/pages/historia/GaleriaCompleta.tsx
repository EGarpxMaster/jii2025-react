import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./historia.css";

type GalleryImage = {
  src: string;
  alt: string;
  title: string;
};

const GaleriaCompleta = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("todas");
  
  // Todas las imágenes de la galería
  const ALL_IMAGES: GalleryImage[] = [
    {
      src: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=1600",
      alt: "Conferencia principal con expertos internacionales",
      title: "Conferencia Principal"
    },
    {
      src: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&q=80&w=1600",
      alt: "Taller práctico sobre innovación industrial",
      title: "Taller Práctico"
    },
    {
      src: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2000",
      alt: "Networking entre participantes y profesionales",
      title: "Sesión de Networking"
    },
    {
      src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=2000",
      alt: "Exposición de proyectos estudiantiles innovadores",
      title: "Exposición de Proyectos"
    },
    {
      src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2000",
      alt: "Panel de expertos discutiendo tendencias industriales",
      title: "Panel de Expertos"
    },
    {
      src: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=2000",
      alt: "Entrega de reconocimientos a los mejores proyectos",
      title: "Entrega de Reconocimientos"
    },
    // Agrega más imágenes aquí
    {
      src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1600",
      alt: "Estudiantes presentando sus proyectos innovadores",
      title: "Presentación de Proyectos"
    },
    {
      src: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&q=80&w=1600",
      alt: "Charla técnica sobre nuevas tecnologías industriales",
      title: "Charla Técnica"
    },
    {
      src: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=1600",
      alt: "Demostración de equipos industriales de última generación",
      title: "Demostración de Equipos"
    },
    {
      src: "https://images.unsplash.com/photo-1581092446325-71febe36d965?auto=format&fit=crop&q=80&w=1600",
      alt: "Mesas redondas con expertos de la industria",
      title: "Mesa Redonda"
    },
    {
      src: "https://images.unsplash.com/photo-1581092581096-329cdbda7c5d?auto=format&fit=crop&q=80&w=1600",
      alt: "Estudiantes recibiendo certificados de participación",
      title: "Entrega de Certificados"
    },
    {
      src: "https://images.unsplash.com/photo-1581092921461-7d9c8ae3d5a8?auto=format&fit=crop&q=80&w=1600",
      alt: "Momento de esparcimiento durante el coffee break",
      title: "Coffee Break"
    }
  ];

  // Categorías para filtrar (puedes adaptar según tus necesidades)
  const categories = [
    { id: "todas", name: "Todas las imágenes" },
    { id: "conferencias", name: "Conferencias" },
    { id: "talleres", name: "Talleres" },
    { id: "proyectos", name: "Proyectos" }
  ];

  return (
    <div className="w-full historia-container min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#1b1c39] to-[#2a2b4a] py-8 text-white">
        <div className="container mx-auto px-4">
          <button 
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center text-white hover:text-[#00d4d4] transition-colors"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Volver atrás
          </button>
          
          <h1 className="historia-h1 font-bold mb-4">Galería Completa</h1>
          <div className="w-16 h-1 rounded-full bg-[#00d4d4] mb-4"></div>
          <p className="historia-text-lg max-w-2xl">
            Todos los momentos especiales de nuestras jornadas de Ingeniería Industrial
          </p>
        </div>
      </header>

      {/* Filtros de categoría */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === category.id
                  ? "bg-[#00d4d4] text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Galería */}
      <main className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {ALL_IMAGES.map((image, index) => (
            <div
              key={index}
              className="gallery-item h-64 rounded-lg overflow-hidden shadow-md hover:shadow-xl cursor-pointer transition-all duration-300"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
              <div className="gallery-overlay">
                <div className="gallery-content">
                  <h3 className="gallery-title">{image.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal para imagen ampliada */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-full overflow-auto">
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="w-full h-auto rounded-lg"
            />
            <div className="text-white mt-4 text-center">
              <h3 className="text-xl font-bold">{selectedImage.title}</h3>
              <p className="mt-2">{selectedImage.alt}</p>
            </div>
            <button
              className="absolute top-4 right-4 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GaleriaCompleta;