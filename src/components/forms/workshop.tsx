import React, { useEffect, useMemo, useState } from "react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const API_BASE = "/api";

// Helper para normalizar los datos (snake_case a camelCase)
const normalizeParticipante = (data: any) => ({
  id: data.id,
  apellidoPaterno: data.apellido_paterno || "",
  apellidoMaterno: data.apellido_materno || "",
  primerNombre: data.primer_nombre || "",
  segundoNombre: data.segundo_nombre || null,
  email: data.email || "",
  telefono: data.telefono || undefined,
  brazalete: data.brazalete || null,
  categoria: data.categoria,
  programa: data.programa || null,
});

type Participante = {
  id: number;
  apellidoPaterno: string;
  apellidoMaterno: string;
  primerNombre: string;
  segundoNombre?: string | null;
  email: string;
  telefono?: string;
  brazalete?: number | null;
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
  tipo: "Workshop";
  fechaInicio: string;
  fechaFin: string;
  lugar?: string | null;
  cupoMaximo?: number;
  ocupados?: number;
  disponibles?: number;
  estadoCupo?: "DISPONIBLE" | "CASI_LLENO" | "LLENO" | "INACTIVA";
};

type Inscripcion = {
  actividadId: number;
  estado: "inscrito" | "lista_espera";
  creado: string;
};

type LookupStatus =
  | "idle"
  | "typing"
  | "checking"
  | "invalid"
  | "notfound"
  | "found"
  | "error";

interface WorkshopComponentProps {
  className?: string;
  showHeader?: boolean;
}

const WorkshopComponent: React.FC<WorkshopComponentProps> = ({
  className = "",
}) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<LookupStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string>(""); // para status=error
  const [participante, setParticipante] = useState<Participante | null>(null);
  const [workshops, setWorkshops] = useState<Actividad[]>([]);
  const [inscripciones, setInscripciones] = useState<Record<number, Inscripcion>>({});
  const [loadingBtn, setLoadingBtn] = useState<Record<number, boolean>>({});

  const placeholder = useMemo(() => "Correo electrónico", []);

  useEffect(() => {
    const cargarWorkshops = async () => {
      try {
        const res = await fetch(`${API_BASE}/actividades?ventana=workshops`, { credentials: "include" });
        
        if (res.ok) {
          const ws: Actividad[] = await res.json();
          
          setWorkshops(ws);
        } else {
          const error = await res.text();
          console.error("Error del servidor:", error);
        }
      } catch (e) {
        console.error("Error cargando workshops:", e);
      }
    };
    cargarWorkshops();
  }, []);

  useEffect(() => {
    const value = email.trim();

    if (!value) {
      setStatus("idle");
      setErrorMsg("");
      setParticipante(null);
      setInscripciones({});
      return;
    }

    if (!emailRegex.test(value)) {
      setStatus("invalid");
      setErrorMsg("");
      setParticipante(null);
      setInscripciones({});
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
          setInscripciones({});
          setStatus("notfound");
          return;
        }
        if (!resP.ok) {
          const msg = await resP.text().catch(() => "");
          setStatus("error");
          setErrorMsg(msg || "Error del servidor. Intenta nuevamente.");
          setParticipante(null);
          setInscripciones({});
          return;
        }

        const p: Participante = normalizeParticipante(await resP.json());
        setParticipante(p);
        setStatus("found");

        const resI = await fetch(`${API_BASE}/workshops/inscripciones?email=${encodeURIComponent(value)}`, { credentials: "include" });
        if (!resI.ok) {
          const msg = await resI.text().catch(() => "");
          setStatus("error");
          setErrorMsg(msg || "No se pudieron consultar tus inscripciones.");
          setInscripciones({});
          return;
        }

        const arr: Inscripcion[] = await resI.json();
        const map: Record<number, Inscripcion> = {};
        arr.forEach((i) => { map[i.actividadId] = i; });
        setInscripciones(map);
      } catch (e) {
        console.error("Error en búsqueda:", e);
        setStatus("error");
        setErrorMsg("Error de red. Verifica tu conexión.");
        setParticipante(null);
        setInscripciones({});
      }
    }, 600);

    return () => clearTimeout(t);
  }, [email]);

  const sortedWorkshops = useMemo(() => {
    return [...workshops].sort(
      (a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime()
    );
  }, [workshops]);

  function isLleno(ws: Actividad) {
    if (ws.estadoCupo) return ws.estadoCupo === "LLENO";
    if (typeof ws.disponibles === "number") return ws.disponibles <= 0;
    return false;
  }

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

  async function inscribirme(actividadId: number) {
    if (!participante) return;
    setLoadingBtn((s) => ({ ...s, [actividadId]: true }));
    try {
      const res = await fetch(`${API_BASE}/workshops/inscripciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: participante.email.trim(), actividadId }),
      });

      const j = await res.json().catch(() => ({} as any));

      if (res.status === 409 || res.status === 422 || !res.ok) {
        if (j?.code === 'WS_FUERA_HORARIO') {
          alert("Fuera de horario de inscripción");
        } else {
          alert(j?.error || "No fue posible inscribirte.");
        }
        return;
      }

      const { data } = j.ok ? j : { data: j }; // soporta ambos formateos
      const nuevo: Inscripcion = (data ?? j) as Inscripcion;
      setInscripciones((m) => ({ ...m, [actividadId]: nuevo }));
    } catch (e) {
      console.error(e);
      alert("Error de red. Inténtalo de nuevo.");
    } finally {
      setLoadingBtn((s) => ({ ...s, [actividadId]: false }));
    }
  }

  async function cancelar(actividadId: number) {
    if (!participante) return;
    if (!confirm("¿Seguro que deseas cancelar tu inscripción?")) return;

    setLoadingBtn((s) => ({ ...s, [actividadId]: true }));
    try {
      const res = await fetch(`${API_BASE}/workshops/inscripciones`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: participante.email.trim(), actividadId }),
      });

      const j = await res.json().catch(() => ({} as any));
      if (!res.ok) {
        alert(j?.error || "No fue posible cancelar.");
        return;
      }

      setInscripciones((m) => {
        const { [actividadId]: _omit, ...rest } = m;
        return rest;
      });
    } catch (e) {
      console.error(e);
      alert("Error de red. Inténtalo de nuevo.");
    } finally {
      setLoadingBtn((s) => ({ ...s, [actividadId]: false }));
    }
  }

  return (
    <section className={`registro-section ${className}`}>
      <div className="registro-container">
        <div className="registro-header">
          <h2>Inscripción a Workshops</h2>
          <p className="registro-description">
            Ingresa tu correo para ver tus datos e <b>inscribirte</b>. Si el cupo está lleno, puedes entrar a <b>lista de espera</b>. Una persona solo puede tener <b>1 workshop</b> activo.
          </p>
        </div>

        <div className="registro-form">
          {/* Email */}
          <div className="form-group" style={{ marginBottom: "2rem" }}>
            <label htmlFor="emailLookup" className="form-label">Correo electrónico</label>
            <input
              id="emailLookup"
              type="email"
              placeholder={placeholder}
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
                <div><strong>Nombre:</strong> {`${participante.primerNombre} ${participante.segundoNombre || ""} ${participante.apellidoPaterno} ${participante.apellidoMaterno}`}</div>
                <div><strong>Correo:</strong> {participante.email}</div>
                {participante.telefono && <div><strong>Teléfono:</strong> {participante.telefono}</div>}
                <div>
                  <strong>Categoría:</strong> {participante.categoria}
                  {participante.categoria === "Estudiante" && participante.programa && <span> — {participante.programa}</span>}
                </div>
              </div>
            </div>
          )}

          {/* Lista de workshops */}
          {participante && workshops.length > 0 && (
            <div className="conference-list">
              {sortedWorkshops.map((ws) => {
                const insc = inscripciones[ws.id];
                const cargando = !!loadingBtn[ws.id];
                const lleno = isLleno(ws);

                const cardClasses = ["conference-card", insc ? "is-registered" : ""].join(" ");

                return (
                  <div key={ws.id} className={cardClasses}>
                    {insc && (
                      <div className="badge-success">
                        {insc.estado === "inscrito" ? "✓ Inscrito" : "🕒 Lista de espera"}
                      </div>
                    )}
                    <h4>{ws.titulo}</h4>
                    <div className="fecha-lugar">
                      📅 {fmtFecha(ws.fechaInicio)}
                      {ws.lugar && <span> • 📍 {ws.lugar}</span>}
                    </div>

                    {!insc ? (
                      <>
                        <button
                          type="button"
                          onClick={() => inscribirme(ws.id)}
                          disabled={cargando}
                          className="submit-button"
                        >
                          {cargando ? "⏳ Procesando..." : (lleno ? "📝 Entrar a lista de espera" : "✅ Inscribirme")}
                        </button>
                        {typeof ws.disponibles === "number" && (
                          <small className="email-status">
                            {ws.disponibles} lugares disponibles
                          </small>
                        )}
                        {ws.estadoCupo === "LLENO" && (
                          <small className="email-status error">Cupo lleno</small>
                        )}
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => cancelar(ws.id)}
                        disabled={cargando}
                        className="submit-button"
                      >
                        {cargando ? "⏳ Cancelando..." : "❌ Cancelar inscripción"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Estado inicial */}
          {((participante && workshops.length === 0) || (!participante && status === "idle")) && (
            <div className="initial-state-message">
              {participante ? (
                <>
                  <h3>📅 No hay workshops disponibles</h3>
                  <p>Actualmente no hay workshops programados. Vuelve más tarde.</p>
                </>
              ) : (
                <>
                  <div className="icon">🎯</div>
                  <h3>¿Listo para inscribirte a un workshop?</h3>
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

export default WorkshopComponent;
