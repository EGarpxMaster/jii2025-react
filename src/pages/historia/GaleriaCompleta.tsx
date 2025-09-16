    import React, { useState } from "react";
    import { useNavigate } from "react-router-dom";
    import { AnimatedH1, AnimatedH2, AnimatedParagraph, AnimatedButtonPrimary, AnimatedButtonSecondary } from '../../components/animations';

    import "./historia.css";
    type GalleryImage = {
    src: string;
    alt: string;
    title: string;
    category: string;
    };
    
    import { motion } from 'framer-motion';

    const Galeria = () => {
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>("todas");
    const [loading, setLoading] = useState(true);
    
    // Todas las imágenes de la galería con categorías
    const ALL_IMAGES: GalleryImage[] = [
        {
        src: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=1600",
        alt: "Conferencia principal con expertos internacionales",
        title: "Conferencia Principal",
        category: "conferencias"
        },
        {
        src: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&q=80&w=1600",
        alt: "Taller práctico sobre innovación industrial",
        title: "Taller Práctico",
        category: "talleres"
        },
        {
        src: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2000",
        alt: "Networking entre participantes y profesionales",
        title: "Sesión de Networking",
        category: "networking"
        },
        {
        src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=2000",
        alt: "Exposición de proyectos estudiantiles innovadores",
        title: "Exposición de Proyectos",
        category: "proyectos"
        },
        {
        src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2000",
        alt: "Panel de expertos discutiendo tendencias industriales",
        title: "Panel de Expertos",
        category: "conferencias"
        },
        {
        src: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=2000",
        alt: "Entrega de reconocimientos a los mejores proyectos",
        title: "Entrega de Reconocimientos",
        category: "premiaciones"
        },
        {
        src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1600",
        alt: "Estudiantes presentando sus proyectos innovadores",
        title: "Presentación de Proyectos",
        category: "proyectos"
        },
        {
        src: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&q=80&w=1600",
        alt: "Charla técnica sobre nuevas tecnologías industriales",
        title: "Charla Técnica",
        category: "conferencias"
        },
        {
        src: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=1600",
        alt: "Demostración de equipos industriales de última generación",
        title: "Demostración de Equipos",
        category: "talleres"
        },
        {
        src: "https://images.unsplash.com/photo-1581092446325-71febe36d965?auto=format&fit=crop&q=80&w=1600",
        alt: "Mesas redondas con expertos de la industria",
        title: "Mesa Redonda",
        category: "conferencias"
        },
        {
        src: "https://images.unsplash.com/photo-1581092581096-329cdbda7c5d?auto=format&fit=crop&q=80&w=1600",
        alt: "Estudiantes recibiendo certificados de participación",
        title: "Entrega de Certificados",
        category: "premiaciones"
        },
        {
        src: "https://images.unsplash.com/photo-1581092921461-7d9c8ae3d5a8?auto=format&fit=crop&q=80&w=1600",
        alt: "Momento de esparcimiento durante el coffee break",
        title: "Coffee Break",
        category: "networking"
        }
    ];

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
    const filteredImages = selectedCategory === "todas" 
        ? ALL_IMAGES 
        : ALL_IMAGES.filter(img => img.category === selectedCategory);

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

        {/* Filtros de categoría */}
        <div className="bg-white py-8 mb-8 border-b border-slate-100">
            <div className="container mx-auto px-4">
                <AnimatedH2>
            <h2 className="text-2xl font-bold text-[#1b1c39] text-center mb-6">Filtrar por categoría</h2></AnimatedH2>
            <div className="flex justify-center flex-wrap gap-3">
                {categories.map(category => (
                <AnimatedButtonSecondary>
                <button id="btn_gallery"
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`py-3 px-6 rounded-full border border-slate-200 font-medium cursor-pointer transition-all duration-300 shadow-sm hover:bg-slate-50 hover:-translate-y-0.5 hover:shadow-md ${
                    selectedCategory === category.id 
                        ? 'bg-gradient-to-br from-cyan-400 to-cyan-500 text-white border-transparent shadow-cyan-200 hover:shadow-cyan-300' 
                        : 'bg-white text-slate-500'
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
        <div className="container mx-auto px-4 py-4">
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
        <motion.section 
          id="conferencias" 
          className="actividades-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        ></motion.section>
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
                className="w-full h-auto block"
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