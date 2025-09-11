import React, { useEffect, useMemo, useState } from "react";

// No se necesita el emailRegex aquí si el componente de registro ya lo maneja, 
// pero se mantiene por su uso en el debounce
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

const API_BASE = "/api"; 

type Participante = {
 id: number;
 apellidoPaterno: string;
 apellidoMaterno: string;
 primerNombre: string;
 segundoNombre?: string | null;
 email: string;
 telefono: string;
 brazalete: number;
 categoria: "Estudiante" | "Ponente" | "Asistente externo";
 programa?: "Ingeniería Industrial" | "Ingeniería Ambiental" | "Ingeniería en Datos e Inteligencia Organizacional"
 | "Ingeniería en Logística y Cadena de Suministro"
 | "Ingeniería en Inteligencia Artificial Nuevo"
 | "Ingeniería en Industrias Alimentarias" | "" | null;
};

type Conferencia = {
 id: number;
 titulo: string;
 ponente?: string | null;
 fechaInicio: string; 
 fechaFin: string; 
 lugar?: string | null;
};

type Asistencia = {
 conferenciaId: number;
 creado: string;
 modo: "self" | "staff" | "qr";
};

interface AsistenciaComponentProps {
  className?: string;
  showHeader?: boolean;
}

const AsistenciaComponent: React.FC<AsistenciaComponentProps> = ({ 
  className = "",
  showHeader = true 
}) => {
 const [email, setEmail] = useState("");
 const [status, setStatus] = useState<"idle"|"typing"|"checking"|"notfound"|"found"|"invalid">("idle");
 const [participante, setParticipante] = useState<Participante | null>(null);
 const [conferencias, setConferencias] = useState<Conferencia[]>([]);
 const [asistencias, setAsistencias] = useState<Record<number, Asistencia>>({});
 const [loadingBtn, setLoadingBtn] = useState<Record<number, boolean>>({});

 const placeholder = useMemo(() => "Correo electrónico", []);

 useEffect(() => {
  const cargarConferencias = async () => {
   try {
    const res = await fetch(`${API_BASE}/conferencias`, { credentials: "include" });
    if (res.ok) {
     const cs: Conferencia[] = await res.json();
     setConferencias(cs);
    }
   } catch (e) {
    console.error("Error cargando conferencias:", e);
   }
  };
  cargarConferencias();
 }, []);

 useEffect(() => {
  if (!email) { 
   setStatus("idle");
   setParticipante(null);
   setAsistencias({});
   return;
  }
  if (!emailRegex.test(email)) {
   setStatus("invalid");
   setParticipante(null);
   setAsistencias({});
   return;
  }
  
  setStatus("typing");
  const t = setTimeout(async () => {
   setStatus("checking");
   try {
    const resP = await fetch(`${API_BASE}/participante?email=${encodeURIComponent(email)}`, { credentials: "include" });
    if (resP.status === 404) {
     setParticipante(null);
     setAsistencias({});
     setStatus("notfound");
     return;
    }
    if (!resP.ok) throw new Error("Error buscando participante");
    
    const p: Participante = await resP.json();
    setParticipante(p);
    setStatus("found");

    const resA = await fetch(`${API_BASE}/asistencias?email=${encodeURIComponent(email)}`, { credentials: "include" });
    if (!resA.ok) throw new Error("Error consultando asistencias");
    
    const arr: Asistencia[] = await resA.json();
    const map: Record<number, Asistencia> = {};
    arr.forEach(a => { map[a.conferenciaId] = a; });
    setAsistencias(map);

   } catch (e) {
    console.error("Error en búsqueda:", e);
    setStatus("invalid");
    setParticipante(null);
    setAsistencias({});
   }
  }, 800);
  
  return () => clearTimeout(t);
 }, [email]);

 const sortedConferencias = useMemo(() => {
    const now = new Date();
    const getStatus = (conf: Conferencia) => {
        const inicio = new Date(conf.fechaInicio);
        const fin = new Date(conf.fechaFin);
        if (now >= inicio && now <= fin) return 1;
        if (now < inicio) return 2; 
        return 3; 
    };
    return [...conferencias].sort((a, b) => {
        const statusA = getStatus(a);
        const statusB = getStatus(b);
        if (statusA !== statusB) return statusA - statusB;
        return new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime();
    });
 }, [conferencias]);

 async function confirmarAsistencia(conferenciaId: number) {
  if (!participante) return;
  
  setLoadingBtn((s) => ({ ...s, [conferenciaId]: true }));
  
  try {
   const res = await fetch(`${API_BASE}/asistencias`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email: participante.email, conferenciaId }),
   });
   
   if (res.status === 409) {
    alert("Ya tienes registrada la asistencia para esta conferencia.");
    return;
   }
   
   if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    const errorMsg = errorData?.error || `Error ${res.status}: No se pudo registrar asistencia`;
    alert(errorMsg);
    return;
   }
   
   const now = new Date().toISOString();
   setAsistencias((m) => ({ 
    ...m, 
    [conferenciaId]: { conferenciaId, creado: now, modo: "self" } 
   }));
   
  } catch (e) {
   console.error("Error de red:", e);
   alert("Error de red al confirmar asistencia. Verifica tu conexión.");
  } finally {
   setLoadingBtn((s) => ({ ...s, [conferenciaId]: false }));
  }
 }

 return (
    <section className={`registro-section ${className}`}>
      <div className="registro-container">
        
          <div className="registro-header">
            <h2>Asistencia a Conferencias</h2>
            <p className="registro-description">
              Ingresa tu correo para ver tus datos y confirmar tu asistencia.
            </p>
          </div>
        <div className="registro-form">
          {/* Email Input: ahora usa clases del CSS */}
          <div className="form-group" style={{ marginBottom: "2rem" }}>
            <label htmlFor="emailLookup" className="form-label">
              Correo electrónico
            </label>
            <input
              id="emailLookup"
              type="email"
              placeholder={placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              // MODIFICADO: Clases dinámicas para el input
              className={`form-input ${status === "invalid" || status === "notfound" ? "input-error" : ""}`}
            />
            {/* MODIFICADO: Mensajes de estado con clases consistentes */}
            <div className="email-status">
              {status === "checking" && <small className="checking">🔍 Buscando...</small>}
              {status === "invalid" && email && <small className="error">❌ Formato de correo inválido.</small>}
              {status === "notfound" && <small className="error">❌ No encontramos este correo registrado.</small>}
              {status === "found" && <small className="success">✅ ¡Participante encontrado!</small>}
            </div>
          </div>

          {/* Datos del participante: usa nueva clase .info-box */}
          {participante && (
            <div className="info-box">
              <h3>👤 Tus datos registrados</h3>
              <div className="info-box-content">
                <div><strong>Nombre:</strong> {`${participante.primerNombre} ${participante.segundoNombre || ""} ${participante.apellidoPaterno} ${participante.apellidoMaterno}`}</div>
                <div><strong>Correo:</strong> {participante.email}</div>
                <div><strong>Teléfono:</strong> {participante.telefono}</div>
                <div><strong>Brazalete:</strong> {participante.brazalete}</div>
                <div>
                  <strong>Categoría:</strong> {participante.categoria}
                  {participante.categoria === "Estudiante" && participante.programa && (
                    <span> — {participante.programa}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Lista de conferencias */}
          {participante && conferencias.length > 0 && (
            <div className="conference-list">
              {sortedConferencias.map((conf) => {
                const yaRegistrado = !!asistencias[conf.id];
                const cargando = !!loadingBtn[conf.id];
                const ahora = new Date();
                const inicio = new Date(conf.fechaInicio);
                const fin = new Date(conf.fechaFin);
                const isAvailable = ahora >= inicio && ahora <= fin;
                
                // MODIFICADO: Clases dinámicas para la tarjeta de conferencia
                const cardClasses = [
                  "conference-card",
                  yaRegistrado ? "is-registered" : "",
                  !isAvailable && !yaRegistrado ? "is-unavailable" : ""
                ].join(" ");

                return (
                  <div key={conf.id} className={cardClasses}>
                    {yaRegistrado && (
                      <div className="badge-success">✓ Registrado</div>
                    )}
                    <h4>{conf.titulo}</h4>
                    {conf.ponente && <p className="ponente">👨‍🏫 {conf.ponente}</p>}
                    <div className="fecha-lugar">
                      📅 {new Date(conf.fechaInicio).toLocaleString("es-MX", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      {conf.lugar && <span> • 📍 {conf.lugar}</span>}
                    </div>
                    {yaRegistrado ? (
                      <div className="confirmation-message">
                        <span>✅ Asistencia confirmada</span>
                        <small>
                          ({new Date(asistencias[conf.id].creado).toLocaleString("es-MX", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })})
                        </small>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => confirmarAsistencia(conf.id)}
                        disabled={cargando || !isAvailable}
                        className="submit-button" // MODIFICADO: Se usa la clase del botón principal
                      >
                        {cargando ? "⏳ Registrando..." : (isAvailable ? "✅ Confirmar asistencia" : "🗓️ Fuera de horario")}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Mensajes de estado inicial o sin conferencias */}
          {((participante && conferencias.length === 0) || (!participante && status === "idle")) && (
            <div className="initial-state-message">
              {participante ? (
                <>
                  <h3>📅 No hay conferencias disponibles</h3>
                  <p>Actualmente no hay conferencias programadas. Vuelve más tarde.</p>
                </>
              ) : (
                <>
                  <div className="icon">🎯</div>
                  <h3>¿Listo para registrar tu asistencia?</h3>
                  <p>Ingresa tu correo electrónico registrado para comenzar.</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
 );
};

export default AsistenciaComponent;