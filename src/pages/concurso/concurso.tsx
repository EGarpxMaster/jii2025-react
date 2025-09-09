import React, { useEffect, useMemo, useState } from "react";
import Xarrow from "react-xarrows";
import { ChevronRight, Trophy, Users, Clock, Target } from "lucide-react";

type ModalSection = {
  type: "paragraph" | "bullet" | "numbered";
  content: string;
};

type Seccion = {
  id: number;
  title: string;
  banner: string;
  modal: {
    title: string;
    sections: ModalSection[];
  };  
}

const rallySteps: Seccion[] = [
  {
    id: 1,
    banner: "/assets/images/concurso/juego1.jpg",
    title: "Juego 1: Pañuelo",
    modal: {
      title: "Juego 1: Pañuelo",
      sections: [
        { type: "paragraph", content: "Objetivo: Fomentar la agilidad física, la rapidez de reacción y el razonamiento matemático mediante la resolución de operaciones que determinan qué jugador participará en cada turno." },
        { type: "paragraph", content: "Reglas específicas: "},
        { type: "bullet", content: "Está prohibido correr de espaldas " },
        { type: "bullet", content: "No se permiten agresiones físicas; el toque debe ser limpio en la espalda"},
        { type: "paragraph", content: "Desarrollo del juego / Reglas: "},
        { type: "numbered", content: "Los jugadores se dividen en dos equipos con el mismo número de participantes"},
        { type: "numbered", content: "Cada jugador recibe un número (del 1 al 6, según el número de integrantes)"},
        { type: "numbered", content: "El staff se coloca en el centro con el paliacate en la mano"},
        { type: "numbered", content: "En lugar de decir el número directamente, el staff anunciará una operación matemática (ejemplo: 4 x 4 - 10 = 6)"},
        { type: "numbered", content: "Los jugadores que tengan ese número en ambos equipos deben correr hacia el centro para intentar agarrar el paliacate"},
        { type: "numbered", content: "El jugador que tome el paliacate debe regresar a su base lo más rápido posible"},
        { type: "numbered", content: "El jugador contrario puede robar el punto tocando la espalda del portador antes de que llegue a su base"},
        { type: "numbered", content: "Cada vez que un jugador logra llevar el paliacate a su base sin ser tocado, su equipo gana 1 punto"},
      ]
    }
  },
  {
    id: 2,
    banner: "/assets/images/concurso/juego2.jpg",
    title: "Juego 2: Zoteball",
    modal: {
      title: "Juego 2: Zoteball",
      sections: [
        { type: "paragraph", content: "Objetivo: Desarrollar la coordinación, el trabajo en equipo y la estrategia mediante un juego de lanzamiento y recepción con un jabón Zote como pelota." },
        { type: "paragraph", content: "Reglas específicas: " },
        { type: "bullet", content: "Los jugadores del mismo equipo no pueden permanecer cerca de su cubeta para defenderla." },
        { type: "bullet", content: "Está prohibido moverse mientras se tiene el jabón en las manos" },
        { type: "bullet", content: "No se permite retener el jabón demasiado tiempo (máx. 5 segundos) para mantener la fluidez del juego." },
        { type: "paragraph", content: "Desarrollo del juego / Reglas: "},
        { type: "numbered", content: "Los jugadores se dividen en dos equipos con el mismo número de participantes"},
        { type: "numbered", content: "Cada jugador recibe un número (del 1 al 6, según el número de integrantes)"},
        { type: "numbered", content: "El staff se coloca en el centro con el paliacate en la mano"},
        { type: "numbered", content: "En lugar de decir el número directamente, el staff anunciará una operación matemática (ejemplo: 4 x 4 - 10 = 6)"},
        { type: "numbered", content: "Los jugadores que tengan ese número en ambos equipos deben correr hacia el centro para intentar agarrar el paliacate"},
        { type: "numbered", content: "El jugador que tome el paliacate debe regresar a su base lo más rápido posible"},
        { type: "numbered", content: "El jugador contrario puede robar el punto tocando la espalda del portador antes de que llegue a su base"},
        { type: "numbered", content: "Cada vez que un jugador logra llevar el paliacate a su base sin ser tocado, su equipo gana 1 punto"},
      ]
    }
  },
  {
    id: 3,
    banner: "/assets/images/actividades/banners/C1.jpg",
    title: "Juego 3: Rally del tesoro",
    modal: {
      title: "Juego 3: Rally del tesoro",
      sections: [
        { type: "paragraph", content: "Objetivo: Estimular la lógica, el trabajo en equipo y los conocimientos sobre Ingeniería Industrial y la Universidad del Caribe, a través de un recorrido con pistas y retos de preguntas." },
        { type: "paragraph", content: "Reglas específicas: " },
        { type: "bullet", content: "No está  permitido cambiar el orden de las pistas; cada equipo debe seguir la secuencia asignada." },
        { type: "bullet", content: "Los equipos deben permanecer juntos durante todo el recorrido" },
        { type: "bullet", content: "Las respuestas deben ser dadas por consenso del equipo, no por un solo jugador aislado." },
        { type: "bullet", content: "No se permite interferir con el recorrido del otro equipo." },
        { type: "paragraph", content: " "},
        { type: "paragraph", content: "Desarrollo del juego / Reglas: "},
        { type: "numbered", content: "A cada equipo se le entrega la primera pista en mano"},
        { type: "numbered", content: "Una vez descifrada, los jugadores deberán correr a la ubicación indicada y buscar la siguiente pista."},
        { type: "numbered", content: "Al llegar a cada punto de pista, un integrante del staff les hará una pregunta relacionada con Ingenieria Industrial, materias o profesores de la Universidad del Caribe."},
        { type: "numbered", content: "Solo si responden correctamente podrán recibir la siguiente pista."},
        { type: "numbered", content: "El recorrido continuará hasta que logren encontrar uno de los cofres escondidos."},
        { type: "numbered", content: "Habrá 2 cofres ocultos, por lo que ganan los primeros 2 equipos en encontrarlos"},
      ]
    }
  },
  {
    id: 4,
    banner: "/assets/images/actividades/banners/C1.jpg",
    title: "Juego 4: Fútbol en parejas",
    modal: {
      title: "Juego 4: Fútbol en parejas",
      sections: [
        { type: "paragraph", content: "Objetivo: Fomentar la coordinación, el trabajo en equipo y la comunicación entre compañeros mediante un partido de fútbol en el que los jugadores deben moverse de manera sincronizada." },
        { type: "paragraph", content: "Reglas específicas: " },
        { type: "bullet", content: "Está prohibido desatarse durante el juego; las parejas deben permanecer unidas por un pie en todo momento." },
        { type: "bullet", content: "No se permite contacto físico agresivo; solo se permite disputar el balón de manera segura." },
        { type: "bullet", content: "Los jugadores deben respetar las áreas delimitadas y el tiempo de juego." },
        { type: "paragraph", content: "Desarrollo del juego / Reglas: "},
        { type: "numbered", content: "Los jugadores se agrupan en parejas, cada una atada a un pie para que ambos se muevan de manera conjunta."},
        { type: "numbered", content: "Se realiza un partido de fútbol normal, siguiendo las reglas básicas del deporte (excepto que no hay portero)."},
        { type: "numbered", content: "Cada equipo intenta marcar goles en la portería contraria mientras coordina sus movimientos para avanzar con el balón."},
        { type: "numbered", content: "Gana el equipo que consiga más goles al finalizar el tiempo."},
      ]
    }
  },
];

// Hook para cerrar con ESC y bloquear scroll cuando el modal está abierto
function useModalControls(isOpen: boolean, onClose: () => void) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen, onClose]);
}

// Hook para animaciones de scroll
function useScrollAnimations() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = document.querySelectorAll('.game-card');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);
}

function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  useModalControls(open, onClose);
  if (!open) return null;

  return (
    <div
      aria-modal
      role="dialog"
      aria-label={title}
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 backdrop-blur-md"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/60" onClick={onClose} />
      <div className="relative z-10 w-full max-w-6xl max-h-[85vh] overflow-auto">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden modal-content">
          <div className="p-6 md:p-8 text-left">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Cerrar modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Concurso() {
  const [openId, setOpenId] = useState<number | null>(null);
  const current = useMemo(() => rallySteps.find((a) => a.id === openId) || null, [openId]);

  useScrollAnimations();

  return (
    <div className="concurso-container min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Barra de progreso de scroll */}
      <div className="scroll-progress-bar" />
      
      {/* Header mejorado */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[#1b1c39]"></div>
        <div className="absolute inset-0 bg-pattern-dots opacity-20"></div>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] px-4 text-center text-white">
          <div className="mb-8 transform hover:scale-110 transition-transform duration-500">
            <img
              src="/assets/images/concurso/logorally.jpg"
              alt="Logo Rally"
              className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full shadow-2xl border-4 border-white/30"
            />
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-shadow-lg">
            Mundialito Industrial
          </h1>
          <p className="text-lg md:text-xl max-w-2xl text-white/90 leading-relaxed">
            Participa en emocionantes juegos que pondrán a prueba tu agilidad, estrategia y conocimientos
          </p>
          
          {/* Stats cards */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/20">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
              <div className="text-2xl font-bold">4</div>
              <div className="text-sm opacity-90">Juegos</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/20">
              <Users className="w-8 h-8 mx-auto mb-2 text-green-300" />
              <div className="text-2xl font-bold">6</div>
              <div className="text-sm opacity-90">Jugadores</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/20">
              <Clock className="w-8 h-8 mx-auto mb-2 text-blue-300" />
              <div className="text-2xl font-bold">120</div>
              <div className="text-sm opacity-90">Minutos</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 text-center border border-white/20">
              <Target className="w-8 h-8 mx-auto mb-2 text-red-300" />
              <div className="text-2xl font-bold">∞</div>
              <div className="text-sm opacity-90">Diversión</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}