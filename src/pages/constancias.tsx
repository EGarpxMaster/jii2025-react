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

const ConstanciaPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle"|"typing"|"checking"|"notfound"|"found"|"invalid">("idle");
  const [verificacion, setVerificacion] = useState<VerificacionData | null>(null);
  const [descargando, setDescargando] = useState(false);

  // Debounce para verificación
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
    const timer = setTimeout(async () => {
      setStatus("checking");
      try {
        const res = await fetch(`${API_BASE}/constancia/verificar?email=${encodeURIComponent(email)}`, { 
          credentials: "include" 
        });
        
        if (res.status === 404) {
          setVerificacion(null);
          setStatus("notfound");
          return;
        }
        
        if (!res.ok) {
          throw new Error("Error verificando participante");
        }
        
        const data: VerificacionData = await res.json();
        setVerificacion(data);
        setStatus("found");
        
      } catch (error) {
        console.error("Error en verificación:", error);
        setStatus("invalid");
        setVerificacion(null);
      }
    }, 800);
    
    return () => clearTimeout(timer);
  }, [email]);

  const descargarConstancia = async () => {
    if (!verificacion) return;
    
    setDescargando(true);
    try {
      const res = await fetch(`${API_BASE}/constancia/generar?email=${encodeURIComponent(email)}`, {
        credentials: "include"
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const errorMsg = errorData?.error || "Error generando constancia";
        alert(errorMsg);
        return;
      }
      
      // Crear blob y descargar archivo
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `constancia-${verificacion.participante.primerNombre}-${verificacion.participante.apellidoPaterno}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (error) {
      console.error("Error descargando:", error);
      alert("Error de red al descargar constancia");
    } finally {
      setDescargando(false);
    }
  };

  return (
    <main className="w-full mt-[100px] md:mt-[100px]">
    <div style={{ 
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "2rem 1rem"
    }}>
      <div style={{
        maxWidth: 800,
        margin: "0 auto",
        background: "white",
        borderRadius: 16,
        padding: "2rem",
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
      }}>
        <h1 style={{ 
          textAlign: "center", 
          color: "#333",
          marginBottom: "0.5rem",
          fontSize: "2.5rem"
        }}>
          🏆 Obtener Constancia
        </h1>
        <p style={{ 
          textAlign: "center", 
          color: "#666",
          marginBottom: "2rem",
          fontSize: "1.1rem"
        }}>
          Ingresa tu correo registrado para verificar tu elegibilidad y descargar tu constancia de participación.
        </p>

        {/* Input de Email */}
        <div style={{ marginBottom: "2rem" }}>
          <label 
            htmlFor="emailLookup" 
            style={{ 
              display: "block",
              marginBottom: "0.5rem",
              fontWeight: "600",
              color: "#333"
            }}
          >
            Correo electrónico
          </label>
          <input
            id="emailLookup"
            type="email"
            placeholder="tu.correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            style={{
              width: "100%",
              padding: "0.75rem",
              fontSize: "1rem",
              border: `2px solid ${status === "invalid" ? "#ff6b6b" : "#ddd"}`,
              borderRadius: 8,
              outline: "none",
              transition: "border-color 0.3s ease"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#667eea";
            }}
            onBlur={(e) => {
              if (status !== "invalid") {
                e.target.style.borderColor = "#ddd";
              }
            }}
          />
          <div style={{ marginTop: 8, minHeight: 20 }}>
            {status === "checking" && (
              <small style={{ color: "#667eea" }}>🔍 Verificando elegibilidad...</small>
            )}
            {status === "invalid" && email && (
              <small style={{ color: "#ff6b6b" }}>❌ Formato de correo inválido.</small>
            )}
            {status === "notfound" && (
              <small style={{ color: "#ff6b6b" }}>❌ No encontramos este correo registrado.</small>
            )}
            {status === "found" && verificacion && (
              <small style={{ color: "#51cf66" }}>
                {verificacion.puedeObtenerConstancia 
                  ? "✅ ¡Elegible para constancia!" 
                  : "⚠️ Sin asistencias registradas"}
              </small>
            )}
          </div>
        </div>

        {/* Datos del participante y asistencias */}
        {verificacion && (
          <div style={{
            border: "2px solid #e9ecef",
            borderRadius: 12,
            overflow: "hidden",
            marginBottom: "2rem"
          }}>
            {/* Header con datos del participante */}
            <div style={{
              background: verificacion.puedeObtenerConstancia ? "#f8fff9" : "#fff8f0",
              padding: "1.5rem",
              borderBottom: "1px solid #e9ecef"
            }}>
              <h3 style={{ 
                margin: "0 0 1rem 0",
                color: "#333",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem"
              }}>
                👤 Participante encontrado
                {verificacion.puedeObtenerConstancia && (
                  <span style={{
                    background: "#51cf66",
                    color: "white",
                    padding: "0.25rem 0.75rem",
                    borderRadius: 20,
                    fontSize: "0.8rem",
                    fontWeight: "600"
                  }}>
                    ELEGIBLE
                  </span>
                )}
              </h3>
              <div style={{ display: "grid", gap: "0.5rem", fontSize: "0.95rem" }}>
                <div>
                  <strong>Nombre:</strong> {verificacion.participante.primerNombre} {verificacion.participante.segundoNombre || ""} {verificacion.participante.apellidoPaterno} {verificacion.participante.apellidoMaterno}
                </div>
                <div>
                  <strong>Categoría:</strong> {verificacion.participante.categoria}
                  {verificacion.participante.categoria === "Estudiante" && verificacion.participante.programa && (
                    <span> — {verificacion.participante.programa}</span>
                  )}
                </div>
                <div>
                  <strong>Email:</strong> {verificacion.participante.email}
                </div>
              </div>
            </div>

            {/* Asistencias */}
            {verificacion.asistencias.length > 0 ? (
              <div style={{ padding: "1.5rem" }}>
                <h4 style={{ 
                  margin: "0 0 1rem 0", 
                  color: "#333",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem"
                }}>
                  📋 Conferencias asistidas ({verificacion.asistencias.length})
                </h4>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  {verificacion.asistencias.map((asist, index) => (
                    <div
                      key={index}
                      style={{
                        background: "#f8f9fc",
                        padding: "0.75rem",
                        borderRadius: 8,
                        border: "1px solid #e9ecef"
                      }}
                    >
                      <div style={{ fontWeight: "600", color: "#333", marginBottom: "0.25rem" }}>
                        {asist.titulo}
                      </div>
                      <div style={{ fontSize: "0.9rem", color: "#666" }}>
                        {asist.ponente && (
                          <span>👨‍🏫 {asist.ponente} • </span>
                        )}
                        📅 {new Date(asist.fecha).toLocaleDateString("es-MX", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })}
                        {asist.lugar && (
                          <span> • 📍 {asist.lugar}</span>
                        )}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#51cf66", marginTop: "0.25rem" }}>
                        ✅ Asistencia registrada el {new Date(asist.fechaAsistencia).toLocaleDateString("es-MX")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ 
                padding: "2rem", 
                textAlign: "center",
                color: "#666"
              }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📋</div>
                <h4 style={{ color: "#333", marginBottom: "0.5rem" }}>Sin asistencias registradas</h4>
                <p style={{ margin: 0 }}>
                  Para obtener tu constancia, primero debes registrar tu asistencia a al menos una conferencia.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Botón de descarga */}
        {verificacion?.puedeObtenerConstancia && (
          <div style={{ textAlign: "center" }}>
            <button
              onClick={descargarConstancia}
              disabled={descargando}
              style={{
                padding: "1rem 2rem",
                fontSize: "1.1rem",
                fontWeight: "600",
                color: "white",
                background: descargando ? "#ccc" : "linear-gradient(135deg, #51cf66 0%, #40c057 100%)",
                border: "none",
                borderRadius: 12,
                cursor: descargando ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                transform: descargando ? "none" : "translateY(0)",
                boxShadow: descargando ? "none" : "0 8px 20px rgba(81, 207, 102, 0.3)",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                margin: "0 auto"
              }}
              onMouseEnter={(e) => {
                if (!descargando) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 12px 28px rgba(81, 207, 102, 0.4)";
                }
              }}
              onMouseLeave={(e) => {
                if (!descargando) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(81, 207, 102, 0.3)";
                }
              }}
            >
              {descargando ? (
                <>
                  <span>⏳</span>
                  <span>Generando constancia...</span>
                </>
              ) : (
                <>
                  <span>📄</span>
                  <span>Descargar Constancia PDF</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Instrucciones cuando no hay datos */}
        {!verificacion && status === "idle" && (
          <div style={{
            textAlign: "center",
            padding: "3rem 2rem",
            color: "#666"
          }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🏆</div>
            <h3 style={{ color: "#333", marginBottom: "1rem" }}>¿Listo para obtener tu constancia?</h3>
            <p style={{ marginBottom: "1.5rem" }}>
              Ingresa tu correo electrónico registrado para verificar tu elegibilidad y descargar tu constancia de participación.
            </p>
            <div style={{
              background: "#f8f9fc",
              padding: "1rem",
              borderRadius: 8,
              border: "1px solid #e9ecef",
              fontSize: "0.9rem"
            }}>
              <strong>Requisitos para obtener constancia:</strong>
              <ul style={{ textAlign: "left", marginTop: "0.5rem", paddingLeft: "1.5rem" }}>
                <li>Estar registrado como participante</li>
                <li>Tener al menos una asistencia confirmada a conferencias</li>
                <li>Los datos deben estar completos en el sistema</li>
              </ul>
            </div>
          </div>
        )}

        {/* Mensaje de ayuda cuando no es elegible */}
        {verificacion && !verificacion.puedeObtenerConstancia && (
          <div style={{
            textAlign: "center",
            padding: "2rem",
            background: "#fff8f0",
            borderRadius: 12,
            border: "2px solid #ffd43b"
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
            <h3 style={{ color: "#333", marginBottom: "1rem" }}>Constancia no disponible</h3>
            <p style={{ marginBottom: "1rem", color: "#666" }}>
              Para obtener tu constancia de participación, necesitas registrar tu asistencia a al menos una conferencia.
            </p>
            <a 
              href="/asistencia" 
              style={{
                display: "inline-block",
                padding: "0.75rem 1.5rem",
                background: "#667eea",
                color: "white",
                textDecoration: "none",
                borderRadius: 8,
                fontWeight: "600",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#5a6fd8";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#667eea";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              📋 Registrar asistencia
            </a>
          </div>
        )}
      </div>
    </div>
    </main>
  );
};

export default ConstanciaPage;