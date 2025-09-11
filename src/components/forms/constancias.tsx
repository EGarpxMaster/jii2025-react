import React, { useEffect, useState } from "react";

const API_BASE = "/api";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

type Participante = {
  id: number;
  apellidoPaterno: string;
  apellidoMaterno: string;
  primerNombre: string;
  segundoNombre?: string | null;
  email: string;
  telefono: string;
  categoria: "Estudiante" | "Ponente" | "Asistente externo";
  programa?: string | null;
};

type AsistenciaDetalle = {
  titulo: string;
  ponente?: string | null;
  fecha: string;
  lugar?: string | null;
  fechaAsistencia: string;
};

type VerificacionData = {
  participante: Participante;
  asistencias: AsistenciaDetalle[];
  puedeObtenerConstancia: boolean;
};

interface ConstanciaComponentProps {
  className?: string;
  showHeader?: boolean;
}

const ConstanciaComponent: React.FC<ConstanciaComponentProps> = ({ 
  className = "",
  showHeader = true 
}) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle"|"typing"|"checking"|"notfound"|"found"|"invalid">("idle");
  const [verificacion, setVerificacion] = useState<VerificacionData | null>(null);
  const [descargando, setDescargando] = useState(false);

  // Debounce + verificación
  useEffect(() => {
    if (!email) {
      setStatus("idle");
      setVerificacion(null);
      return;
    }
    if (!emailRegex.test(email)) {
      setStatus("invalid");
      setVerificacion(null);
      return;
    }

    setStatus("typing");
    const t = setTimeout(async () => {
      setStatus("checking");
      try {
        const res = await fetch(
          `${API_BASE}/constancia/verificar?email=${encodeURIComponent(email)}`,
          { credentials: "include" }
        );

        if (res.status === 404) {
          setVerificacion(null);
          setStatus("notfound");
          return;
        }
        if (!res.ok) throw new Error("Error verificando participante");

        const data: VerificacionData = await res.json();
        setVerificacion(data);
        setStatus("found");
      } catch (e) {
        console.error(e);
        setStatus("invalid");
        setVerificacion(null);
      }
    }, 700);

    return () => clearTimeout(t);
  }, [email]);

  const descargarConstancia = async () => {
    if (!verificacion) return;
    setDescargando(true);
    try {
      const res = await fetch(
        `${API_BASE}/constancia/generar?email=${encodeURIComponent(email)}`,
        { credentials: "include" }
      );
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        alert(errorData?.error || "Error generando constancia");
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `constancia-${verificacion.participante.primerNombre}-${verificacion.participante.apellidoPaterno}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (e) {
      console.error(e);
      alert("Error de red al descargar constancia");
    } finally {
      setDescargando(false);
    }
  };

  return (
    <section className={`registro-section ${className}`}>
      <div className="registro-container">
        
          <div className="registro-header">
            <h2>Constancias</h2>
            <p className="registro-description">
              Ingresa tu correo registrado para verificar tu elegibilidad y descargar tu constancia.
            </p>
          </div>
        

        <div className="registro-form">
          {/* Campo de email */}
          <div className="form-group">
            <label htmlFor="emailLookup" className="form-label">
              Correo electrónico
            </label>
            <input
              id="emailLookup"
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              className={`form-input ${status === "invalid" ? "input-error" : ""}`}
              aria-invalid={status === "invalid"}
            />
            
            {/* Estado del email */}
            <div className="email-status">
              {status === "checking" && (
                <small className="checking">Verificando disponibilidad…</small>
              )}
              {status === "invalid" && email && (
                <small role="alert" className="error">
                  Formato de correo inválido
                </small>
              )}
              {status === "notfound" && (
                <small role="alert" className="error">
                  No encontramos este correo registrado
                </small>
              )}
              {status === "found" && verificacion && (
                verificacion.puedeObtenerConstancia ? (
                  <small className="success">✓ Elegible para constancia</small>
                ) : (
                  <small className="checking">Sin asistencias suficientes</small>
                )
              )}
            </div>
            
            <small className="form-help">
              Usa el correo con el que te registraste en el evento.
            </small>
          </div>

          {/* Loading skeleton */}
          {status === "checking" && (
            <div className="constancia-loading">
              <div className="loading-skeleton">
                <div className="skeleton-line"></div>
                <div className="skeleton-box"></div>
                <div className="skeleton-line short"></div>
              </div>
            </div>
          )}

          {/* Resultado de verificación */}
          {verificacion && status === "found" && (
            <div className="constancia-result">
              {/* Datos del participante */}
              <div className={`participant-info ${verificacion.puedeObtenerConstancia ? 'eligible' : 'not-eligible'}`}>
                <div className="participant-header">
                  <h3>👤 Participante</h3>
                  <span className={`status-badge ${verificacion.puedeObtenerConstancia ? 'success' : 'warning'}`}>
                    {verificacion.puedeObtenerConstancia ? "ELEGIBLE" : "FALTA ASISTENCIA"}
                  </span>
                </div>
                
                <div className="participant-details">
                  <div className="detail-row">
                    <strong>Nombre:</strong> {verificacion.participante.primerNombre}{" "}
                    {verificacion.participante.segundoNombre || ""}{" "}
                    {verificacion.participante.apellidoPaterno}{" "}
                    {verificacion.participante.apellidoMaterno}
                  </div>
                  <div className="detail-row">
                    <strong>Categoría:</strong> {verificacion.participante.categoria}
                    {verificacion.participante.categoria === "Estudiante" &&
                      verificacion.participante.programa && (
                        <span> — {verificacion.participante.programa}</span>
                      )}
                  </div>
                  <div className="detail-row">
                    <strong>Email:</strong> {verificacion.participante.email}
                  </div>
                </div>
              </div>

              {/* Lista de asistencias */}
              {verificacion.asistencias.length > 0 ? (
                <div className="asistencias-section">
                  <h4>📋 Conferencias asistidas ({verificacion.asistencias.length})</h4>
                  <div className="asistencias-list">
                    {verificacion.asistencias.map((asistencia, i) => (
                      <div key={i} className="asistencia-item">
                        <div className="asistencia-indicator"></div>
                        <div className="asistencia-content">
                          <div className="asistencia-title">{asistencia.titulo}</div>
                          <div className="asistencia-details">
                            {asistencia.ponente && <span>👨‍🏫 {asistencia.ponente} • </span>}
                            <span>📅 {new Date(asistencia.fecha).toLocaleDateString("es-MX", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}</span>
                            {asistencia.lugar && <span> • 📍 {asistencia.lugar}</span>}
                          </div>
                          <div className="asistencia-registered">
                            ✅ Registrada el {new Date(asistencia.fechaAsistencia).toLocaleDateString("es-MX")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="no-asistencias">
                  <div className="no-asistencias-icon">📋</div>
                  <h4>Sin asistencias registradas</h4>
                  <p>Para obtener tu constancia, registra al menos una asistencia.</p>
                  <a href="/asistencia" className="link-button">
                    Registrar asistencia →
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Estado inicial */}
          {!verificacion && status === "idle" && (
            <div className="constancia-welcome">
              <div className="welcome-icon">🏆</div>
              <h3>¿Listo para obtener tu constancia?</h3>
              <p>Verifica tu correo y descarga tu PDF si cumples los requisitos.</p>
              
              <div className="requirements-box">
                <strong>Requisitos:</strong>
                <ul>
                  <li>Estar registrado como participante</li>
                  <li>Al menos una asistencia confirmada</li>
                  <li>Datos completos en el sistema</li>
                </ul>
              </div>
            </div>
          )}

          {/* Botón de descarga */}
          {verificacion?.puedeObtenerConstancia && (
            <div className="form-submit">
              <button
                onClick={descargarConstancia}
                disabled={descargando}
                className={`submit-button ${descargando ? "submitting" : ""}`}
              >
                {descargando ? (
                  <>
                    <span className="spinner"></span>
                    Generando constancia...
                  </>
                ) : (
                  "📄 Descargar Constancia PDF"
                )}
              </button>
            </div>
          )}

          {/* No elegible */}
          {verificacion && !verificacion.puedeObtenerConstancia && (
            <div className="not-eligible-cta">
              <div className="not-eligible-icon">⚠️</div>
              <h3>Constancia no disponible</h3>
              <p>Registra tu asistencia para habilitar la descarga.</p>
              <a href="/asistencia" className="cta-button">
                📋 Registrar asistencia
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ConstanciaComponent;