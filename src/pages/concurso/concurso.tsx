import React, { useEffect, useMemo, useState } from "react";
import Xarrow from "react-xarrows";
import "./concurso.css"; // <-- coloca aquí el CSS que compartiste

type ModalSection = {
  type: "paragraph" | "bullet" | "numbered";
  content: string;
};

type Seccion = {
  id: number;
  title: string;
  banner: string;
  description: string;
  modal: {
    title: string;
    sections: ModalSection[]; // lista numerada
  };  
}

const rallySteps: Seccion[] = [
  {
    id: 1,
    banner: "/assets/images/concurso/juego1.jpg",
    title: "Juego 1: Pañuelo",
    description: "Materiales necesarios: \n•	4 conos (para delimitar el área de juego y las bases de los equipos). \n•	1 paliacate (pañuelo). \n•	Cartel con nombre del juego y un dibujo relacionado. \n\n Staff requerido: 1 persona por equipo. \n\n Duración: 15 minutos.",
    modal: {
      title: "Juego 1: Pañuelo",
      sections: [
        { type: "paragraph", content: "Objetivo: Fomentar la agilidad física, la rapidez de reacción y el razonamiento matemático mediante la resolución de operaciones que determinan qué jugador participará en cada turno." },
        { type: "paragraph", content: "Reglas específicas: "},
        { type: "bullet", content: "Está prohibido correr de espaldas "},
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
    description: "Materiales necesarios: \n• 2 cubetas con agua (una por equipo). \n• 1 jabón Zote (pelota de juego). \n• 4 conos para delimitar la zona. \n• Cartel con nombre del juego y un dibujo relacionado. \n\n Staff requerido: 1 persona por equipo. \n\n Duración: 15 minutos.",
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
    description: "Materiales necesarios: \n• Pistas impresas o escritas (una por cada punto del recorrido). \n• 2 cofres simulados (pueden ser cajas decoradas o cualquier objeto que represente el 'tesoro'). \n• Espacios previamente definidos para esconder las pistas y los cofres. \n• Cartel con nombre del juego y un dibujo relacionado. \n\n Staff requerido: 1 persona por equipo y personal adicional según el número de pistas. \n\n Duración: 15 minutos.",
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
    description: "Materiales necesarios: \n• 1 balón de fútbol. \n• Cintas o cuerdas para atar de un pie a los integrantes de cada pareja. \n• 8 conos para marcar el área de juego y las porterías. \n• Cartel con nombre del juego y un dibujo relacionado. \n\n Staff requerido: 1 persona por equipo. \n\n Duración: 15 minutos",
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
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-full max-w-5xl">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="p-6 text-left">
            <h3 className="text-2xl font-semibold mb-3">{title}</h3>
            {children}
            <button
              onClick={onClose}
              className="mt-5 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Concurso() {
  const [openId, setOpenId] = useState<number | null>(null);
  const current = useMemo(() => rallySteps.find((a) => a.id === openId) || null, [openId]);

  return (
    <div>
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      {/* Header */}
      <section className="headercard mt-10 w-full flex items-center justify-center pb-0 py-12 bg-gradient-to-b from-blue-100 to-gray-50">
        <img
          src="/assets/images/concurso/logorally.jpg"
          alt="Logo Rally"
          className="w-28 h-28 mr-6"
        />
        <div className="text-left">
          <h1 className="relative text-4xl md:text-5xl font-bold text-gray-800 inline-block pb-1 after:content-[''] after:block after:h-1 after:bg-[var(--secondary-color)] after:mt-1 after:w-1/2 after:mx-auto">
            
            Mundialito Industrial
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl">
            
          </p>
        </div>
      </section>

      <div className="relative w-full max-w-6xl mx-auto py-12">
        <div className="flex flex-col gap-16">
        {rallySteps.map((step, index) => (
          <div
            key={step.id}
            className={`flex w-full relative ${index % 2 === 0 ? "justify-start" : "justify-end"}`}
          >     

        <div className="relative w-2/3">
          {/* Punto lateral ficticio para que la flecha avance un poco */}
          <div
            id={`card-side-${step.id}`}
            className={`absolute w-4 h-4
              ${index % 2 === 0 ? "right-0" : "left-0"} top-1/2 transform -translate-y-1/2 z-20`}
          />

          {/* Tarjeta */}
          <div
            id={`card-${step.id}`}
            onClick={() => setOpenId(step.id)}
            className={`relative bg-white shadow-xl rounded-3xl p-8 border border-gray-200 z-10
              cursor-pointer transition transform hover:scale-105 hover:shadow-2xl
              ${openId === step.id ? "ring-4 ring-blue-400" : ""}`}
          >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="flex flex-col items-center justify-center text-center h-full">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">{step.title}</h2>
              <img
                src={step.banner}
                alt={step.title}
                className="w-full h-48 object-cover rounded-xl shadow-sm"
                loading="lazy"
              />
            </div>
            <div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{step.description}</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    ))}
  </div>

  {/* Conexiones entre tarjetas */}
  {rallySteps.map((step, index) => {
    if (index === rallySteps.length - 1) return null;

    return (
      <Xarrow
        start={`card-side-${step.id}`}                   // punto lateral de salida
        end={`card-${rallySteps[index + 1].id}`}        // punto superior de la siguiente tarjeta
        startAnchor={index % 2 === 0 ? "right" : "left"} // lado de salida
        endAnchor={{
          position: "top",
          offset: { x: index % 2 === 0 ? 200 : -200, y: 0 }, // ajusta derecha/izquierda
        }}                             // entrada arriba
        color="gray"
        strokeWidth={3}
        path="grid"                                      // estilo cuadrado/zigzag
        curveness={0.2}
        dashness={false}
        zIndex={0}                                       // detrás de las tarjetas
        showHead={true}                                  // flecha
      />
    );
  })}
</div>

        
      </div>

      <Modal open={!!current} title={current?.modal.title || ""} onClose={() => setOpenId(null)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna izquierda */}
      <div className="space-y-4">
            {current?.modal.sections
              .slice(0, Math.ceil((current.modal.sections?.length ?? 0) / 2))
              .map((s, i) => {
                if (s.type === "numbered") return null;
                return renderSection(s, i);
              })}
      
            {/* Bloque de numbered en izquierda */}
            <ol className="list-decimal pl-6 text-gray-800 list-inside space-y-1">
              {current?.modal.sections
                .slice(0, Math.ceil((current.modal.sections?.length ?? 0) / 2))
                .filter(s => s.type === "numbered")
                .map((s, i) => (
                  <li key={i}>{s.content}</li>
                ))}
            </ol>
          </div>
      
          {/* Columna derecha */}
          <div className="space-y-4">
            {current?.modal.sections
              .slice(Math.ceil((current.modal.sections?.length ?? 0) / 2))
              .map((s, i) => {
                if (s.type === "numbered") return null;
                return renderSection(s, i + Math.ceil((current.modal.sections?.length ?? 0) / 2));
              })}
      
            {/* Bloque de numbered en derecha, continúa la numeración */}
            <ol
              className="list-decimal pl-6 text-gray-800 list-inside space-y-1"
              start={
                (current?.modal.sections
                  ?.slice(0, Math.ceil((current.modal.sections?.length ?? 0) / 2))
                  ?.filter(s => s.type === "numbered").length ?? 0) + 1
              }
            >
              {current?.modal.sections
                .slice(Math.ceil((current.modal.sections?.length ?? 0) / 2))
                .filter(s => s.type === "numbered")
                .map((s, i) => (
                  <li key={i}>{s.content}</li>
                ))}
            </ol>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function renderSection(s: ModalSection, i: number) {
  switch (s.type) {
    case "paragraph":
      return <p key={i} className="text-gray-800 leading-relaxed">{s.content}</p>;
    case "bullet":
      return (
        <ul key={i} className="list-disc pl-6 text-gray-800">
          <li>{s.content}</li>
        </ul>
      );
    case "numbered":
      return (
        <ol key={i} className="list-decimal pl-6 text-gray-800 list-inside">
          <li>{s.content}</li>
        </ol>
      );
  }
}


