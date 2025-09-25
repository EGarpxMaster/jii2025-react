    import React, { useState } from "react";
    import { useNavigate } from "react-router-dom";
    import { AnimatedH1, AnimatedH2, AnimatedParagraph, AnimatedButtonPrimary, AnimatedButtonSecondary } from '../../components/animations';

    import "./historia.css";
    type GalleryImage = {
    src: string;
    alt: string;
    title: string;
    category: string;
    year: number;
    };
    
    import { motion } from 'framer-motion';

    const Galeria = () => {
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("todas");
    const [loading, setLoading] = useState(true);
    
    // Todas las imágenes de la galería con categorías
    const ALL_IMAGES: GalleryImage[] = [
    
    //2023
        //Conferencias 2023
        {
        src: "/assets/images/galeria/2023/G1_2023.jpeg",
        alt: "Conferencia principal con expertos internacionales",
        title: "Conferencia Principal",
        category: "conferencias",
        year: 2023
        },
        {
        src: "/assets/images/galeria/2023/G3_2023.jpeg",
        alt: "Conferencia principal con expertos internacionales",
        title: "Conferencia Principal",
        category: "conferencias",
        year: 2023
        },
        {
        src: "/assets/images/galeria/2023/G13_2023.jpg",
        alt: "Conferencia, charla entre expertos internacionales",
        title: "Panel de Expertos",
        category: "conferencias",
        year: 2023
        },
        {
        src: "/assets/images/galeria/2023/G16_2023.jpg",
        alt: "Conferencia presentada por un exponente invitado",
        title: "Conferencia",
        category: "conferencias",
        year: 2023
        }, 
        {
        src: "/assets/images/galeria/2023/G25_2023.jpg",
        alt: "Panel de expertos discutiendo tendencias industriales",
        title: "Panel de Expertos",
        category: "conferencias",
        year: 2023
        },
        {
        src: "/assets/images/galeria/2023/G20_2023.jpg",
        alt: "Conferencia presentada por una exponente invitada",
        title: "Conferencia",
        category: "conferencias",
        year: 2023
        },
        {
        src: "/assets/images/galeria/2023/G23_2023.jpg",
        alt: "Conferencia presentada por exponentes invitados",
        title: "Conferencia",
        category: "conferencias",
        year: 2023
        },

        //Talleres 2023
        {
        src: "/assets/images/galeria/2023/G4_2023.JPG",
        alt: "Taller práctico sobre innovación industrial",
        title: "Taller Práctico",
        category: "talleres",
        year: 2023
        },
        {
        src: "/assets/images/galeria/2023/G22_2023.jpg",
        alt: "Taller práctico sobre innovación industrial",
        title: "Taller Práctico",
        category: "talleres",
        year: 2023
        },
        {
        src: "/assets/images/galeria/2023/G24_2023.jpg",
        alt: "Taller práctico sobre innovación industrial",
        title: "Taller Práctico",
        category: "talleres",
        year: 2023
        },

        //Proyectos 2023
        {
        src: "/assets/images/galeria/2023/G15_2023.jpg",
        alt: "Presentación de proyectos de estudiantes en el auditorio",
        title: "Presentación de proyecto",
        category: "proyectos",
        year: 2023
        },

        //Networking 2023
        {
        src: "/assets/images/galeria/2023/G12_2023.JPG",
        alt: "Momento de esparcimiento después de las actividades",
        title: "Actividades en la explanada",
        category: "networking",
        year: 2023
        },
        {
        src: "/assets/images/galeria/2023/G17_2023.jpg",
        alt: "Momento de esparcimiento después de las actividades",
        title: "Momento de esparcimiento",
        category: "networking",
        year: 2023
        },
        {
        src: "/assets/images/galeria/2023/G18_2023.jpg",
        alt: "Momento de esparcimiento en evento social",
        title: "Evento social",
        category: "networking",
        year: 2023
        },

        //Premiaciones 2023
        {
        src: "/assets/images/galeria/2023/G2_2023.jpeg",
        alt: "Entrega de reconocimientos a los mejores proyectos",
        title: "Entrega de Reconocimientos",
        category: "premiaciones",
        year: 2023
        },
        {
        src: "/assets/images/galeria/2023/G5_2023.JPG",
        alt: "Entrega de Reconocimiento por impartición de taller",
        title: "Entrega de Reconocimiento",
        category: "premiaciones",
        year: 2023
        },
        {
        src: "/assets/images/galeria/2023/G6_2023.JPG",
        alt: "Entrega de Reconocimiento por impartición de taller",
        title: "Entrega de Reconocimiento",
        category: "premiaciones",
        year: 2023
        },
        {
        src: "/assets/images/galeria/2023/G7_2023.JPG",
        alt: "Entrega de Reconocimiento por impartición de taller",
        title: "Entrega de Reconocimiento",
        category: "premiaciones",
        year: 2023
        },
        {
        src: "/assets/images/galeria/2023/G8_2023.JPG",
        alt: "Entrega de reconocimientos al exponente invitado",
        title: "Entrega de Constancia",
        category: "premiaciones",
        year: 2023
        },
        {
        src: "/assets/images/galeria/2023/G9_2023.JPG",
        alt: "Entrega de reconocimientos al exponente invitado",
        title: "Entrega de Constancia",
        category: "premiaciones",
        year: 2023
        },
        {
        src: "/assets/images/galeria/2023/G10_2023.JPG",
        alt: "Entrega de reconocimientos al exponente invitado",
        title: "Entrega de Constancia",
        category: "premiaciones",
        year: 2023
        },
        {
        src: "/assets/images/galeria/2023/G11_2023.JPG",
        alt: "Entrega de reconocimientos a los exponentes invitados",
        title: "Entrega de Constancia",
        category: "premiaciones",
        year: 2023
        },
        {
        src: "/assets/images/galeria/2023/G14_2023.jpg",
        alt: "Entrega de un obsequio al estudiante exponente",
        title: "Entrega de Premio",
        category: "premiaciones",
        year: 2023
        },
        {
        src: "/assets/images/galeria/2023/G19_2023.jpg",
        alt: "Entrega de reconocimientos al exponente invitado",
        title: "Entrega de Constancia",
        category: "premiaciones",
        year: 2023
        },
        {
        src: "/assets/images/galeria/2023/G21_2023.jpg",
        alt: "Entrega de playeras a los estudiantes",
        title: "Entrega de Playeras",
        category: "premiaciones",
        year: 2023
        },
        
    //2024
        //Conferencias 2024
        {
        src: "/assets/images/galeria/2024/PanelEgresados.JPG",
        alt: "Conferencia con un Panel de Egresados",
        title: "Panel de Egresados",
        category: "conferencias",
        year: 2024
        },
        {
        src: "/assets/images/galeria/2024/G30_2024.jpg",
        alt: "Conferencia principal con expertos internacionales",
        title: "Conferencia de expertos",
        category: "conferencias",
        year: 2024
        },
        {
        src: "/assets/images/galeria/2024/G32_2024.jpg",
        alt: "Conferencia principal con expertos internacionales",
        title: "Conferencia",
        category: "conferencias",
        year: 2024
        },
        {
        src: "/assets/images/galeria/2024/G33_2024.jpg",
        alt: "Conferencia principal con expertos internacionales",
        title: "Conferencia",
        category: "conferencias",
        year: 2024
        },
        
        //Talleres 2024 
        {
        src: "/assets/images/galeria/2024/G2_2024.jpg",
        alt: "Taller práctico sobre innovación industrial",
        title: "Taller Práctico",
        category: "talleres",
        year: 2024
        },
        {
        src: "/assets/images/galeria/2024/G4_2024.jpg",
        alt: "Taller práctico sobre innovación industrial",
        title: "Taller Práctico",
        category: "talleres",
        year: 2024
        },
        {
        src: "/assets/images/galeria/2024/G5_2024.jpg",
        alt: "Taller práctico sobre innovación industrial",
        title: "Taller Práctico",
        category: "talleres",
        year: 2024
        },
        {
        src: "/assets/images/galeria/2024/G6_2024.jpg",
        alt: "Taller práctico sobre innovación industrial",
        title: "Taller Práctico",
        category: "talleres",
        year: 2024
        },
        
        {
        src: "/assets/images/galeria/2024/G34_2024.jpg",
        alt: "Taller práctico sobre innovación industrial",
        title: "Taller Práctico",
        category: "talleres",
        year: 2024
        },
        

        //Proyectos 2024
        {
        src: "assets/images/galeria/2024/G3_2024.jpg",
        alt: "Presentación de proyectos en el laboratorio de mecánica",
        title: "Presentación de proyectos",
        category: "proyectos",
        year: 2024
        },

        //Networking 2024
        {
        src: "/assets/images/galeria/2024/G1_2024.jpg",
        alt: "Partidos recreativos de fútbol",
        title: "Torneo de fútbol",
        category: "networking",
        year: 2024
        },
        {
        src: "/assets/images/galeria/2024/G13_2024.jpg",
        alt: "Actividades de esparcimiento en la explanada de la Universidad",
        title: "Actividades de esparcimiento",
        category: "networking",
        year: 2024
        },
        {
        src: "/assets/images/galeria/2024/G14_2024.jpg",
        alt: "Actividades de esparcimiento en la explanada de la Universidad",
        title: "Actividades de esparcimiento",
        category: "networking",
        year: 2024
        },
        {
        src: "/assets/images/galeria/2024/G15_2024.jpg",
        alt: "Actividades de esparcimiento en la explanada de la Universidad",
        title: "Actividades de esparcimiento",
        category: "networking",
        year: 2024
        },
        {
        src: "/assets/images/galeria/2024/G16_2024.jpg",
        alt: "Actividades de esparcimiento en la explanada de la Universidad",
        title: "Actividades de esparcimiento",
        category: "networking",
        year: 2024
        },
        {
        src: "/assets/images/galeria/2024/G17_2024.jpg",
        alt: "Actividades de esparcimiento en las canchas de la Universidad",
        title: "Actividades de esparcimiento",
        category: "networking",
        year: 2024
        },
        {
        src: "/assets/images/galeria/2024/G18_2024.jpg",
        alt: "Actividades de esparcimiento en las canchas de la Universidad",
        title: "Actividades de esparcimiento",
        category: "networking",
        year: 2024
        },
        {
        src: "/assets/images/galeria/2024/G19_2024.jpg",
        alt: "Actividades de esparcimiento en las canchas de la Universidad",
        title: "Actividades de esparcimiento",
        category: "networking",
        year: 2024
        },
        {
        src: "/assets/images/galeria/2024/G20_2024.jpg",
        alt: "Actividades de esparcimiento en las canchas de la Universidad",
        title: "Actividades de esparcimiento",
        category: "networking",
        year: 2024
        },
        {
        src: "/assets/images/galeria/2024/G21_2024.jpg",
        alt: "Actividades de esparcimiento en la explanada de la Universidad",
        title: "Actividades de esparcimiento",
        category: "networking",
        year: 2024
        },
        {
        src: "/assets/images/galeria/2024/G22_2024.jpg",
        alt: "Actividades de esparcimiento en la explanada de la Universidad",
        title: "Actividades de esparcimiento",
        category: "networking",
        year: 2024
        },
        {
        src: "/assets/images/galeria/2024/G23_2024.jpg",
        alt: "Actividades de esparcimiento en la explanada de la Universidad",
        title: "Actividades de esparcimiento",
        category: "networking",
        year: 2024
        },
        {
        src: "/assets/images/galeria/2024/G24_2024.jpg",
        alt: "Actividades de esparcimiento en la explanada de la Universidad",
        title: "Actividades de esparcimiento",
        category: "networking",
        year: 2024
        },
        {
        src: "/assets/images/galeria/2024/G25_2024.jpg",
        alt: "Actividades de esparcimiento en la explanada de la Universidad",
        title: "Actividades de esparcimiento",
        category: "networking",
        year: 2024
        },
        {
        src: "/assets/images/galeria/2024/G26_2024.jpg",
        alt: "Actividades de esparcimiento en la explanada de la Universidad",
        title: "Actividades de esparcimiento",
        category: "networking",
        year: 2024
        },
        {
        src: "/assets/images/galeria/2024/G27_2024.jpg",
        alt: "Actividades de esparcimiento en la explanada de la Universidad",
        title: "Actividades de esparcimiento",
        category: "networking",
        year: 2024
        },
        {
        src: "/assets/images/galeria/2024/G28_2024.jpg",
        alt: "Actividades de esparcimiento en la explanada de la Universidad",
        title: "Actividades de esparcimiento",
        category: "networking",
        year: 2024
        },
        {
        src: "/assets/images/galeria/2024/G29_2024.jpg",
        alt: "Actividades de esparcimiento en la explanada de la Universidad",
        title: "Actividades de esparcimiento",
        category: "networking",
        year: 2024
        },
        {
        src: "/assets/images/galeria/2024/G31_2024.jpg",
        alt: "Presentación de violín",
        title: "Presentación de violín",
        category: "networking",
        year: 2024
        },

        //Premiaciones 2024
        {
        src: "/assets/images/galeria/2023/G2_2023.jpeg",
        alt: "Entrega de reconocimientos a los mejores proyectos",
        title: "Entrega de Reconocimientos",
        category: "premiaciones",
        year: 2024
        },
        {
        src: "/assets/images/galeria/2024/G8_2024.jpg",
        alt: "Entrega de constancia al profesor invitado",
        title: "Entrega de Constancia",
        category: "premiaciones",
        year: 2024
        },
        {
        src: "/assets/images/galeria/2024/G9_2024.jpg",
        alt: "Entrega de constancia al profesor invitado",
        title: "Entrega de Constancia",
        category: "premiaciones",
        year: 2024
        },
        {
        src: "/assets/images/galeria/2024/G10_2024.jpg",
        alt: "Entrega de constancia a los profesor invitado",
        title: "Entrega de Constancia",
        category: "premiaciones",
        year: 2024
        },
        {
        src: "/assets/images/galeria/2024/G11_2024.jpg",
        alt: "Entrega de constancia al exponente invitado",
        title: "Entrega de Constancia",
        category: "premiaciones",
        year: 2024
        },
        {
        src: "/assets/images/galeria/2024/G12_2024.jpg",
        alt: "Entrega de constancia al exponente invitado",
        title: "Entrega de Constancia",
        category: "premiaciones",
        year: 2024
        },
        {
        src: "/assets/images/galeria/2024/G7_2024.jpg",
        alt: "Entrega de constancia al exponente invitado",
        title: "Entrega de Constancia",
        category: "premiaciones",
        year: 2024
        },
    ];

    const [selectedYear, setSelectedYear] = useState<number | "todas">("todas");

    // Categorías para filtrar
    const categories = [
        { id: "todas", name: "Todas las imágenes" },
        { id: "conferencias", name: "Conferencias" },
        { id: "talleres", name: "Talleres" },
        { id: "proyectos", name: "Proyectos" },
        { id: "networking", name: "Networking" },
        { id: "premiaciones", name: "Premiaciones" }
    ];

    // Filtrar imágenes por categoría
    const filteredImages = ALL_IMAGES.filter(
      img =>
        (selectedYear === "todas" || img.year === selectedYear) &&
        (selectedCategory === "todas" || img.category === selectedCategory)
    );

    // Simular carga de imágenes
    React.useEffect(() => {
        const timer = setTimeout(() => {
        setLoading(false);
        }, 1000);
        
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 font-['Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif]">
        {/* Header */}
        <header className="bg-[#282948] py-16 text-center relative overflow-hidden border-b border-slate-200">
            <div className="before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_20%_80%,rgba(0,212,212,0.05)_0%,transparent_40%),radial-gradient(circle_at_80%_20%,rgba(0,212,212,0.05)_0%,transparent_40%)] before:pointer-events-none">
            <div className="container mx-auto px-4">     
                <AnimatedH1>
                <h1 className="text-4xl font-extrabold text-slate-50 mb-4">Galería Completa</h1></AnimatedH1>       
                <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-cyan-500 mx-auto mb-6 rounded"></div>
                <AnimatedParagraph><p className="text-xl text-slate-50 max-w-2xl mx-auto leading-relaxed">
                Todos los momentos especiales de nuestras jornadas de Ingeniería Industrial
                </p></AnimatedParagraph>
            </div>
            </div>
        </header>
        
        {/* Botón de volver */}
        <div className="container mx-auto px-4 py-6 mt-8">
            <div className="flex justify-center">
            <AnimatedButtonPrimary>
            <button id="btn_gallery"
                onClick={() => navigate(-1)}
                className="inline-flex items-center bg-white text-slate-700 py-3 px-6 pt-6 mt-8 rounded-full border border-slate-200 transition-all duration-300 font-medium shadow-sm hover:bg-slate-50 hover:-translate-x-1 hover:shadow-md"
            >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Volver atrás
            </button></AnimatedButtonPrimary>
            </div>
        </div>

        {/* Filtro principal: Años */}
        <div className="bg-white py-4 mb-4 border-b border-slate-100">
          <div className="container mx-auto px-4">
            <AnimatedH2>
              <h2 className="text-2xl font-bold text-[#1b1c39] text-center mb-6">Filtrar por año</h2>
            </AnimatedH2>
            <div className="flex justify-center flex-wrap gap-3">
              {(["todas", 2023, 2024] as Array<number | "todas">).map((year) => (
                <AnimatedButtonSecondary key={year}>
                  <button
                    onClick={() => setSelectedYear(year)}
                    className={`py-3 px-6 rounded-full border border-slate-200 font-medium cursor-pointer transition-all duration-300 shadow-sm hover:bg-slate-50 hover:-translate-y-0.5 hover:shadow-md ${
                      selectedYear === year
                        ? "bg-gradient-to-br from-cyan-400 to-cyan-500 text-white border-transparent shadow-cyan-200 hover:shadow-cyan-300"
                        : "bg-white text-slate-500"
                    }`}
                  >
                    {year === "todas" ? "Todos los años" : year}
                  </button>
                </AnimatedButtonSecondary>
              ))}
            </div>
          </div>
        </div>

        {/* Filtros secundarios: Categorías según el año seleccionado */}
        <div className="bg-white py-4 border-b border-slate-100">
          <div className="container mx-auto px-4">
            <AnimatedH2>
              <h2 className="text-2xl font-bold text-[#1b1c39] text-center mb-6">Filtrar por categoría</h2>
            </AnimatedH2>
            <div className="flex justify-center flex-wrap gap-3">
              {categories.map((category) => (
                <AnimatedButtonSecondary key={category.id}>
                  <button
                    onClick={() => setSelectedCategory(category.id)}
                    className={`py-3 px-6 rounded-full border border-slate-200 font-medium cursor-pointer transition-all duration-300 shadow-sm hover:bg-slate-50 hover:-translate-y-0.5 hover:shadow-md ${
                      selectedCategory === category.id
                        ? "bg-gradient-to-br from-cyan-400 to-cyan-500 text-white border-transparent shadow-cyan-200 hover:shadow-cyan-300"
                        : "bg-white text-slate-500"
                    }`}
                  >
                    {category.name}
                  </button>
                </AnimatedButtonSecondary>
              ))}
            </div>
          </div>
        </div>

        {/* Contador de imágenes */}
        <div className="container mx-auto px-4 pt-4">
            <div className="text-center">
            <AnimatedParagraph>
            <p className="text-slate-500 text-lg">
                {filteredImages.length} {filteredImages.length === 1 ? 'imagen' : 'imágenes'} en la categoría 
                <span className="font-semibold"> {selectedCategory === "todas" ? "Todas" : categories.find(c => c.id === selectedCategory)?.name}</span>
            </p>
            </AnimatedParagraph>
            </div>
        </div>

        {/* Galería */}
        <main className="container mx-auto px-4 pb-16">
            {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4">
                {[...Array(12)].map((_, index) => (
                <div 
                    key={index} 
                    className="h-64 rounded-2xl bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50 bg-[length:200%_100%] animate-[loading_1.5s_infinite] border border-slate-100"
                ></div>
                ))}
            </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4">
                {filteredImages.map((image, index) => (
                <div
                    key={index}
                    className="relative rounded-2xl overflow-hidden shadow-md cursor-pointer transition-all duration-400 bg-white border border-slate-100 hover:-translate-y-1.5 hover:shadow-xl"
                    onClick={() => setSelectedImage(image)}
                >
                    <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-64 object-cover transition-transform duration-700 hover:scale-108"
                    loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent via-60% to-transparent opacity-0 transition-opacity duration-400 flex flex-col justify-end p-6 hover:opacity-100">
                    <div className="translate-y-5 opacity-0 transition-transform duration-400 group-hover:translate-y-0 group-hover:opacity-100">
                        <h3 className="text-xl font-bold text-white mb-2 drop-shadow-md">{image.title}</h3>
                        <p className="text-white/90 text-sm leading-relaxed mb-3 drop-shadow-sm">{image.alt}</p>
                        <span className="inline-block bg-white/90 text-[#1b1c39] py-1 px-3 rounded-full text-xs font-semibold">
                        {image.category}
                        </span>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            )}
        </main>

        {/* Modal para imagen ampliada */}
        {selectedImage && (
            <div 
            className="fixed inset-0 bg-white/95 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn"
            onClick={() => setSelectedImage(null)}
            >
            <div 
                className="max-w-[90vw] max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-xl border border-slate-100 animate-scaleIn"
                onClick={(e) => e.stopPropagation()}
            >
                <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full max-h-[80vh] object-contain mx-auto"
                />
                <div className="p-6 bg-white">
                <h3 className="text-2xl font-bold text-[#1b1c39] mb-2">{selectedImage.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-4">{selectedImage.alt}</p>
                <span className="inline-block bg-cyan-400 text-white py-1 px-3 rounded-full text-xs font-semibold">
                    {selectedImage.category}
                </span>
                </div>
                <button
                className="absolute top-4 right-4 bg-white/90 text-slate-700 border border-slate-200 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer transition-all duration-300 shadow-sm hover:bg-white hover:rotate-90 hover:shadow-md"
                onClick={() => setSelectedImage(null)}
                >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                </button>
            </div>
            </div>
        )}

        {/* Estilos de animación en el head o mediante CSS-in-JS */}
        <style>
            {`
            @keyframes loading {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes scaleIn {
                from { transform: scale(0.9); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            .hover\\:scale-108:hover {
                transform: scale(1.08);
            }
            `}
        </style>
        </div>
    );
    };

    export default Galeria;