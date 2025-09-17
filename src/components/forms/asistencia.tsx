import React, { useEffect, useMemo, useState } from "react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const API_BASE = "/api";

type Participante = {
  id: number;
  apellido_paterno: string;
  apellido_materno: string;
  primer_nombre: string;
  segundo_nombre?: string | null;
  email: string;
  telefono: string;
  brazalete: number | null;
  categoria: "Estudiante" | "Ponente" | "Asistente externo";
  programa?:
    | "Ingeniería Industrial"
    | "Ingeniería Ambiental"
    | "Ingeniería en Datos e Inteligencia Organizacional"
    | "Ingeniería en Logística y Cadena de Suministro"
    | "Ingeniería en Inteligencia Artificial"
    | "Ingeniería en Industrias Alimentarias"
    | ""
    | null;
};

type Actividad = {
  id: number;
  titulo: string;
  ponente?: string | null;
  tipo?: string;
  fechaInicio: string;
  fechaFin: string;
  lugar?: string | null;
  cupoMaximo?: number;
  ocupados?: number;
  disponibles?: number;
  estadoCupo?: 'DISPONIBLE' | 'CASI_LLENO' | 'LLENO';
};

type Asistencia = {
  actividadId: number;
  creado: string;
};

type LookupStatus =
  | "idle"
  | "typing"
  | "checking"
  | "invalid"   // SOLO regex inválido
  | "notfound"
  | "found"
  | "error";    // errores de red/servidor

interface AsistenciaComponentProps {
  className?: string;
  showHeader?: boolean;
}

const AsistenciaComponent: React.FC<AsistenciaComponentProps> = ({
  className = "",
}) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<LookupStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [participante, setParticipante] = useState<Participante | null>(null);
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [asistencias, setAsistencias] = useState<Record<number, Asistencia>>({});
  const [loadingBtn, setLoadingBtn] = useState<Record<number, boolean>>({});
  const [brazalete, setBrazalete] = useState("");
  const [savingBrazalete, setSavingBrazalete] = useState(false);

  useEffect(() => {
    if (!participante) {
      setActividades([]);
      return;
    }
    
    const cargarActividades = async () => {
      try {
        const res = await fetch(`${API_BASE}/actividades?ventana=disponibles&email=${encodeURIComponent(participante.email)}`, { credentials: "include" });
        if (res.ok) {
          const cs: Actividad[] = await res.json();
          setActividades(cs);
        }
      } catch (e) {
        console.error("Error cargando actividades:", e);
      }
    };
    cargarActividades();
  }, [participante]);

  useEffect(() => {
    const value = email.trim();

    if (!value) {
      setStatus("idle");
      setErrorMsg("");
      setParticipante(null);
      setAsistencias({});
      return;
    }

    if (!emailRegex.test(value)) {
      setStatus("invalid");
      setErrorMsg("");
      setParticipante(null);
      setAsistencias({});
      return;
    }

    setStatus("typing");
    setErrorMsg("");
    const t = setTimeout(async () => {
      setStatus("checking");
      try {
        const resP = await fetch(`${API_BASE}/participantes?email=${encodeURIComponent(value)}`, { credentials: "include" });

        if (resP.status === 404) {
          setParticipante(null);
          setAsistencias({});
          setStatus("notfound");
          return;
        }
        if (!resP.ok) {
          const msg = await resP.text().catch(() => "");
          setStatus("error");
          setErrorMsg(msg || "Error del servidor. Intenta nuevamente.");
          setParticipante(null);
          setAsistencias({});
          return;
        }

        const p: Participante = await resP.json();
        setParticipante(p);
        setStatus("found");

        const resA = await fetch(`${API_BASE}/asistencias?email=${encodeURIComponent(value)}`, { credentials: "include" });
        if (!resA.ok) {
          const msg = await resA.text().catch(() => "");
          setStatus("error");
          setErrorMsg(msg || "No se pudieron consultar tus asistencias.");
          setAsistencias({});
          return;
        }

        const arr: Asistencia[] = await resA.json();
        const map: Record<number, Asistencia> = {};
        arr.forEach((a) => { map[a.actividadId] = a; });
        setAsistencias(map);
      } catch (e) {
        console.error("Error en búsqueda:", e);
        setStatus("error");
        setErrorMsg("Error de red. Verifica tu conexión.");
        setParticipante(null);
        setAsistencias({});
      }
    }, 600);

    return () => clearTimeout(t);
  }, [email]);

  const sortedActividades = useMemo(() => {
    const now = new Date();
    const getStatus = (conf: Actividad) => {
      const inicio = new Date(conf.fechaInicio);
      const fin = new Date(conf.fechaFin);
      if (now >= inicio && now <= fin) return 1;
      if (now < inicio) return 2;
      return 3;
    };
    return [...actividades].sort((a, b) => {
      const statusA = getStatus(a);
      const statusB = getStatus(b);
      if (statusA !== statusB) return statusA - statusB;
      return new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime();
    });
  }, [actividades]);

  function fmtFecha(iso: string) {
    try {
      return new Date(iso).toLocaleString("es-MX", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
        hour: "2-digit", minute: "2-digit", timeZone: "America/Cancun",
      });
    } catch {
      return new Date(iso).toLocaleString("es-MX", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
        hour: "2-digit", minute: "2-digit",
      });
    }
  }

  async function confirmarAsistencia(actividadId: number) {
    if (!participante) return;
    setLoadingBtn((s) => ({ ...s, [actividadId]: true }));
    try {
      const res = await fetch(`${API_BASE}/asistencias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: participante.email.trim(), actividadId }),
      });

      const j = await res.json().catch(() => ({} as any));
      if (res.status === 409) {
        alert("Ya tienes registrada la asistencia para esta actividad.");
        return;
      }
      if (!res.ok) {
        alert(j?.error || `Error ${res.status}: No se pudo registrar asistencia`);
        return;
      }

      const now = new Date().toISOString();
      setAsistencias((m) => ({ ...m, [actividadId]: { actividadId, creado: now } }));
    } catch (e) {
      console.error("Error de red:", e);
      alert("Error de red al confirmar asistencia. Verifica tu conexión.");
    } finally {
      setLoadingBtn((s) => ({ ...s, [actividadId]: false }));
    }
  }

  async function guardarBrazalete() {
    if (!participante || !brazalete.trim()) return;
    setSavingBrazalete(true);
    try {
      const res = await fetch(`${API_BASE}/participantes/brazalete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: participante.email.trim(), brazalete: Number(brazalete.trim()) }),
      });

      const j = await res.json().catch(() => ({} as any));
      if (!res.ok) {
        alert(j?.error || `Error ${res.status}: No se pudo guardar el brazalete`);
        return;
      }

      // Actualizar el participante con el brazalete
      setParticipante({ ...participante, brazalete: Number(brazalete.trim()) });
      setBrazalete("");
      alert("¡Brazalete registrado exitosamente!");
    } catch (e) {
      console.error("Error de red:", e);
      alert("Error de red al guardar brazalete. Verifica tu conexión.");
    } finally {
      setSavingBrazalete(false);
    }
  }

  return (
    <section className={`registro-section ${className}`}>
      <div className="registro-container">
        <div className="registro-header">
          <h2>Asistencia a Actividades</h2>
          <p className="registro-description">
            Ingresa tu correo para ver tus datos y confirmar tu asistencia.
          </p>
        </div>

        <div className="registro-form">
          <div className="form-group" style={{ marginBottom: "2rem" }}>
            <label htmlFor="emailLookup" className="form-label">Correo electrónico</label>
            <input
              id="emailLookup"
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`form-input ${status === "invalid" || status === "notfound" || status === "error" ? "input-error" : ""}`}
            />
            <div className="email-status">
              {status === "checking" && <small className="checking">🔍 Buscando...</small>}
              {status === "invalid" && email && <small className="error">❌ Formato de correo inválido.</small>}
              {status === "notfound" && <small className="error">❌ No encontramos este correo registrado.</small>}
              {status === "error" && <small className="error">⚠️ {errorMsg}</small>}
              {status === "found" && <small className="success">✅ ¡Participante encontrado!</small>}
            </div>
          </div>

          {/* Datos del participante */}
          {participante && (
            <div className="info-box">
              <h3>👤 Tus datos registrados</h3>
              <div className="info-box-content">
                <div><strong>Nombre:</strong> {`${participante.primer_nombre} ${participante.segundo_nombre || ""} ${participante.apellido_paterno} ${participante.apellido_materno}`}</div>
                <div><strong>Correo:</strong> {participante.email}</div>
                <div><strong>Teléfono:</strong> {participante.telefono}</div>
                <div>
                  <strong>Brazalete:</strong> {participante.brazalete ?? "—"}
                </div>
                <div>
                  <strong>Categoría:</strong> {participante.categoria}
                  {participante.categoria === "Estudiante" && participante.programa && <span> — {participante.programa}</span>}
                </div>
              </div>

              {/* Campo para registrar brazalete si no tiene uno */}
              {!participante.brazalete && (
                <div className="brazalete-section">
                  <div className="warning-header">
                    <h4>⚠️ Brazalete requerido</h4>
                    <p>
                      Necesitas registrar tu número de brazalete para poder marcar asistencia a las actividades.
                    </p>
                  </div>
                  <div className="form-group">
                    <label htmlFor="brazalete" className="form-label">Número de brazalete</label>
                    <div className="input-button-group">
                      <input
                        id="brazalete"
                        type="number"
                        placeholder="Ej: 123"
                        value={brazalete}
                        onChange={(e) => setBrazalete(e.target.value)}
                        className="form-input"
                        min="1"
                        max="9999"
                      />
                      <button
                        type="button"
                        onClick={guardarBrazalete}
                        disabled={savingBrazalete || !brazalete.trim()}
                        className={`submit-button ${(savingBrazalete || !brazalete.trim()) ? 'disabled' : ''}`}
                      >
                        {savingBrazalete ? "💾 Guardando..." : "💾 Guardar"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Lista de actividades en ventana */}
          {participante && actividades.length > 0 && (
            <div className="conference-list">
              {sortedActividades.map((conf) => {
                const ya = !!asistencias[conf.id];
                const cargando = !!loadingBtn[conf.id];

                const cardClasses = [
                  "conference-card",
                  ya ? "is-registered" : "",
                ].join(" ");

                return (
                  <div key={conf.id} className={cardClasses}>
                    {ya && <div className="badge-success">✓ Registrado</div>}
                    
                    {/* Indicador de cupo */}
                    {conf.estadoCupo && (
                      <div className={`cupo-badge ${conf.estadoCupo.toLowerCase()}`}>
                        {conf.estadoCupo === 'DISPONIBLE' && '🟢'}
                        {conf.estadoCupo === 'CASI_LLENO' && '🟡'}
                        {conf.estadoCupo === 'LLENO' && '🔴'}
                        {conf.disponibles !== undefined ? 
                          ` ${conf.disponibles}/${conf.cupoMaximo} disponibles` : 
                          ` ${conf.estadoCupo}`
                        }
                      </div>
                    )}
                    
                    <h4>{conf.titulo}</h4>
                    {conf.ponente && <p className="ponente">👨‍🏫 {conf.ponente}</p>}
                    <div className="fecha-lugar">
                      📅 {fmtFecha(conf.fechaInicio)}
                      {conf.lugar && <span> • 📍 {conf.lugar}</span>}
                    </div>
                    {ya ? (
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
                        disabled={cargando || conf.estadoCupo === 'LLENO'}
                        className={`submit-button ${conf.estadoCupo === 'LLENO' ? 'disabled' : ''}`}
                      >
                        {cargando ? "⏳ Registrando..." : 
                         conf.estadoCupo === 'LLENO' ? "🚫 Cupo lleno" :
                         "✅ Confirmar asistencia"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Mensajes de estado inicial / vacío */}
          {((participante && actividades.length === 0) || (!participante && status === "idle")) && (
            <div className="initial-state-message">
              {participante ? (
                <>
                  <h3>📅 No hay actividades disponibles en este momento</h3>
                  <p>Vuelve a intentar dentro de la ventana de marcaje.</p>
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
