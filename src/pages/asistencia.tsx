import React, { useEffect, useMemo, useState } from "react";

const API_BASE = "/api"; // Ajusta si tu proxy cambia
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
  programa?: "Ingeniería Industrial" | "Ingeniería en Datos" | "Ingeniería Ambiental" | "" | null;
};

type Conferencia = {
  id: number;
  titulo: string;
  ponente?: string | null;
  fecha: string; // ISO
  lugar?: string | null;
};

type Asistencia = {
  conferenciaId: number;
  creado: string;
  modo: "self" | "staff" | "qr";
};

const AsistenciaPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle"|"typing"|"checking"|"notfound"|"found"|"invalid">("idle");
  const [participante, setParticipante] = useState<Participante | null>(null);
  const [conferencias, setConferencias] = useState<Conferencia[]>([]);
  const [asistencias, setAsistencias] = useState<Record<number, Asistencia>>({});
  const [loadingBtn, setLoadingBtn] = useState<Record<number, boolean>>({});

  const placeholder = useMemo(() => "tu.correo@ejemplo.com", []);

  // Cargar conferencias al montar el componente
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

  // Debounce: buscar participante + asistencias cuando email es válido
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
        // 1) Participante
        const resP = await fetch(`${API_BASE}/participante?email=${encodeURIComponent(email)}`, { credentials: "include" });
        if (resP.status === 404) {
          setParticipante(null);
          setAsistencias({});
          setStatus("notfound");
          return;
        }
        if (!resP.ok) {
          throw new Error("Error buscando participante");
        }
        
        const p: Participante = await resP.json();
        setParticipante(p);
        setStatus("found");

        // 2) Asistencias del participante
        const resA = await fetch(`${API_BASE}/asistencias?email=${encodeURIComponent(email)}`, { credentials: "include" });
        if (!resA.ok) {
          throw new Error("Error consultando asistencias");
        }
        
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

  async function confirmarAsistencia(conferenciaId: number) {
    if (!participante) return;
    
    setLoadingBtn((s) => ({ ...s, [conferenciaId]: true }));
    
    try {
      const res = await fetch(`${API_BASE}/asistencias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          email: participante.email, 
          conferenciaId: conferenciaId 
        }),
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
      
      // Éxito: marcar localmente como atendida
      const now = new Date().toISOString();
      setAsistencias((m) => ({ 
        ...m, 
        [conferenciaId]: { 
          conferenciaId, 
          creado: now, 
          modo: "self" 
        } 
      }));
      
    } catch (e) {
      console.error("Error de red:", e);
      alert("Error de red al confirmar asistencia. Verifica tu conexión.");
    } finally {
      setLoadingBtn((s) => ({ ...s, [conferenciaId]: false }));
    }
  }

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
          📋 Asistencia a Conferencias
        </h1>
        <p style={{ 
          textAlign: "center", 
          color: "#666",
          marginBottom: "2rem",
          fontSize: "1.1rem"
        }}>
          Ingresa tu correo registrado para ver tus datos y confirmar asistencia a las conferencias.
        </p>

        {/* Email Input */}
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
            placeholder={placeholder}
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
              <small style={{ color: "#667eea" }}>🔍 Buscando...</small>
            )}
            {status === "invalid" && email && (
              <small style={{ color: "#ff6b6b" }}>❌ Formato de correo inválido.</small>
            )}
            {status === "notfound" && (
              <small style={{ color: "#ff6b6b" }}>❌ No encontramos este correo registrado.</small>
            )}
            {status === "found" && (
              <small style={{ color: "#51cf66" }}>✅ ¡Participante encontrado!</small>
            )}
          </div>
        </div>

        {/* Datos del participante */}
        {participante && (
          <div style={{ 
            background: "#f8f9fc",
            border: "2px solid #e9ecef",
            padding: "1.5rem", 
            borderRadius: 12, 
            marginBottom: "2rem"
          }}>
            <h3 style={{ 
              marginTop: 0, 
              marginBottom: "1rem",
              color: "#333"
            }}>
              👤 Tus datos registrados
            </h3>
            <div style={{ display: "grid", gap: "0.5rem", fontSize: "0.95rem" }}>
              <div>
                <strong>Nombre completo:</strong> {participante.primerNombre} {participante.segundoNombre || ""} {participante.apellidoPaterno} {participante.apellidoMaterno}
              </div>
              <div>
                <strong>Correo:</strong> {participante.email}
              </div>
              <div>
                <strong>Teléfono:</strong> {participante.telefono}
              </div>
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
          <div>
            <h3 style={{ marginBottom: "1rem", color: "#333" }}>
              🎯 Conferencias disponibles
            </h3>
            <div style={{ display: "grid", gap: "1rem" }}>
              {conferencias.map((conf) => {
                const yaRegistrado = !!asistencias[conf.id];
                const cargando = !!loadingBtn[conf.id];
                
                return (
                  <div
                    key={conf.id}
                    style={{
                      border: yaRegistrado ? "2px solid #51cf66" : "2px solid #e9ecef",
                      borderRadius: 12,
                      padding: "1.5rem",
                      background: yaRegistrado ? "#f8fff9" : "white",
                      position: "relative",
                      transition: "all 0.3s ease"
                    }}
                  >
                    {yaRegistrado && (
                      <div style={{
                        position: "absolute",
                        top: "1rem",
                        right: "1rem",
                        background: "#51cf66",
                        color: "white",
                        padding: "0.25rem 0.75rem",
                        borderRadius: 20,
                        fontSize: "0.8rem",
                        fontWeight: "600"
                      }}>
                        ✓ REGISTRADO
                      </div>
                    )}
                    
                    <h4 style={{ 
                      margin: "0 0 0.5rem 0", 
                      color: "#333",
                      fontSize: "1.2rem"
                    }}>
                      {conf.titulo}
                    </h4>
                    
                    {conf.ponente && (
                      <p style={{ 
                        margin: "0 0 0.5rem 0", 
                        color: "#666",
                        fontWeight: "500"
                      }}>
                        👨‍🏫 {conf.ponente}
                      </p>
                    )}
                    
                    <div style={{ 
                      fontSize: "0.9rem", 
                      color: "#666",
                      marginBottom: yaRegistrado ? "0.5rem" : "1rem"
                    }}>
                      📅 {new Date(conf.fecha).toLocaleString("es-MX", {
                        weekday: "long",
                        year: "numeric",
                        month: "long", 
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                      {conf.lugar && (
                        <span> • 📍 {conf.lugar}</span>
                      )}
                    </div>

                    {yaRegistrado ? (
                      <div style={{ 
                        color: "#51cf66", 
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem"
                      }}>
                        <span>✅ Asistencia confirmada</span>
                        <small style={{ 
                          color: "#666",
                          fontWeight: "normal"
                        }}>
                          ({new Date(asistencias[conf.id].creado).toLocaleString("es-MX", {
                            day: "2-digit",
                            month: "2-digit", 
                            hour: "2-digit",
                            minute: "2-digit"
                          })})
                        </small>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => confirmarAsistencia(conf.id)}
                        disabled={cargando}
                        style={{
                          width: "100%",
                          padding: "0.75rem 1rem",
                          fontSize: "1rem",
                          fontWeight: "600",
                          color: "white",
                          background: cargando ? "#ccc" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          border: "none",
                          borderRadius: 8,
                          cursor: cargando ? "not-allowed" : "pointer",
                          transition: "all 0.3s ease",
                          transform: cargando ? "none" : "translateY(0)",
                        }}
                        onMouseEnter={(e) => {
                          if (!cargando) {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 8px 20px rgba(102, 126, 234, 0.4)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!cargando) {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                          }
                        }}
                      >
                        {cargando ? "⏳ Registrando..." : "✅ Confirmar asistencia"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Mensaje cuando no hay conferencias */}
        {participante && conferencias.length === 0 && (
          <div style={{
            textAlign: "center",
            padding: "2rem",
            color: "#666"
          }}>
            <h3>📅 No hay conferencias disponibles</h3>
            <p>Actualmente no hay conferencias programadas. Vuelve más tarde.</p>
          </div>
        )}

        {/* Mensaje de ayuda */}
        {!participante && status === "idle" && (
          <div style={{
            textAlign: "center",
            padding: "3rem 2rem",
            color: "#666"
          }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎯</div>
            <h3 style={{ color: "#333", marginBottom: "1rem" }}>¿Listo para registrar tu asistencia?</h3>
            <p>Ingresa tu correo electrónico registrado en el campo de arriba para comenzar.</p>
          </div>
        )}
      </div>
    </div>
    </main>
  );
};

export default AsistenciaPage;