import React, { useEffect, useMemo, useState } from "react";
import CupoBadge from "../common/CupoBadge";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";
const API_URL = `${API_BASE}/api`;

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
  inscritos?: number;
  ocupados?: number;
  disponibles?: number;
  porcentajeOcupado?: number;
  colorCupo?: 'green' | 'yellow' | 'red';
  estadoCupo?: 'DISPONIBLE' | 'CASI_LLENO' | 'LLENO';
};

type Asistencia = {
  actividadId: number;
  creado?: string;
  fechaAsistencia?: string;
};

type LookupStatus = "idle" | "typing" | "checking" | "invalid" | "notfound" | "found" | "error";

interface AsistenciaComponentProps {
  className?: string;
  showHeader?: boolean;
}

const AsistenciaComponent: React.FC<AsistenciaComponentProps> = ({ className = "" }) => {
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
        const res = await fetch(
          `${API_URL}/actividades?ventana=disponibles&email=${encodeURIComponent(participante.email)}`,
          { credentials: "include" }
        );
        if (res.ok) {
          const response = await res.json();
          let cs: Actividad[] = response.data || response;

          if (cs && cs.length > 0) {
            if (typeof (cs[0] as any)?.fechaInicio === "object" &&
                Object.keys((cs[0] as any)?.fechaInicio || {}).length === 0) {
              cs = cs.map((actividad, index) => ({
                ...actividad,
                fechaInicio: `2025-09-${25 + index}T16:00:00.000Z`,
                fechaFin: `2025-09-${25 + index}T18:19:00.000Z`,
              }));
            }
          }

          cs = cs.map((a: any) => ({
            ...a,
            fechaInicio: a.fecha_inicio || a.fechaInicio,
            fechaFin: a.fecha_fin || a.fechaFin,
            cupoMaximo: a.cupo_maximo || a.cupoMaximo,
          }));
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
      setStatus("idle"); setErrorMsg(""); setParticipante(null); setAsistencias({});
      return;
    }
    if (!emailRegex.test(value)) {
      setStatus("invalid"); setErrorMsg(""); setParticipante(null); setAsistencias({});
      return;
    }
    setStatus("typing"); setErrorMsg("");
    const t = setTimeout(async () => {
      setStatus("checking");
      try {
        const resP = await fetch(`${API_URL}/participantes/email/${encodeURIComponent(value)}`, { credentials: "include" });
        if (resP.status === 404) { setParticipante(null); setAsistencias({}); setStatus("notfound"); return; }
        if (!resP.ok) { const msg = await resP.text().catch(()=>""); setStatus("error"); setErrorMsg(msg || "Error del servidor. Intenta nuevamente."); setParticipante(null); setAsistencias({}); return; }
        const participantePayload = await resP.json();
        const participanteData: Participante = participantePayload?.data ?? participantePayload;
        setParticipante(participanteData); setStatus("found");

        const resA = await fetch(`${API_URL}/asistencias/participante/${participanteData.id}`, { credentials: "include" });
        if (!resA.ok) { const msg = await resA.text().catch(()=>""); setStatus("error"); setErrorMsg(msg || "No se pudieron consultar tus asistencias."); setAsistencias({}); return; }
        const asistenciasResponse = await resA.json();
        const asistenciasArray: any[] = asistenciasResponse.data || asistenciasResponse;
        const map: Record<number, Asistencia> = {};
        asistenciasArray.forEach((a) => {
          const actividadId = a.actividadId ?? a.actividad_id;
          if (typeof actividadId === "number") {
            map[actividadId] = { actividadId, estado: a.estado, creado: a.creado } as Asistencia;
          }
        });
        setAsistencias(map);
      } catch (e) {
        console.error("Error en búsqueda:", e);
        setStatus("error"); setErrorMsg("Error de red. Verifica tu conexión."); setParticipante(null); setAsistencias({});
      }
    }, 600);
    return () => clearTimeout(t);
  }, [email]);

  function obtenerTimestamp(fecha: any): number {
    try {
      if (fecha instanceof Date) return fecha.getTime();
      if (typeof fecha === "string") return new Date(fecha).getTime();
      if (typeof fecha === "object" && fecha !== null) {
        const possibleDate = (fecha as any).fechaInicio || (fecha as any).fecha || (fecha as any).date || fecha.toString();
        return new Date(possibleDate).getTime();
      }
      return new Date(fecha).getTime();
    } catch { return 0; }
  }

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
      return obtenerTimestamp(a.fechaInicio) - obtenerTimestamp(b.fechaInicio);
    });
  }, [actividades]);

  function formatearFechaAsistencia(fechaString: any): string {
    if (!fechaString) return "";
    try {
      let fecha: Date;
      if (fechaString instanceof Date) fecha = fechaString;
      else if (typeof fechaString === "string") fecha = new Date(fechaString);
      else if (typeof fechaString === "object" && fechaString !== null) {
        const possibleDate = (fechaString as any).fechaAsistencia || (fechaString as any).fecha || (fechaString as any).date || fechaString.toString();
        fecha = new Date(possibleDate);
      } else fecha = new Date(fechaString);
      if (isNaN(fecha.getTime())) return "";
      return fecha.toLocaleString("es-MX", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
    } catch { return ""; }
  }

  function fmtFecha(iso: any): string {
    if (!iso) return "Fecha no disponible";
    try {
      let fecha: Date;
      if (iso instanceof Date) fecha = iso;
      else if (typeof iso === "string" || typeof iso === "number") fecha = new Date(iso);
      else if (typeof iso === "object") {
        const possibleDate =
          (iso as any).fechaInicio ||
          (iso as any).fecha_inicio ||
          (iso as any).fecha ||
          (iso as any).date ||
          (iso as any).value ||
          (iso as any)._value ||
          (iso as any).iso ||
          (iso as any).$date ||
          (iso as any).datetime ||
          (typeof (iso as any).valueOf === "function" ? (iso as any).valueOf() : undefined) ||
          (typeof (iso as any).toString === "function" ? (iso as any).toString() : undefined);
        if (!possibleDate) return "Fecha no disponible";
        fecha = new Date(possibleDate);
      } else fecha = new Date(iso);
      if (isNaN(fecha.getTime())) return "Fecha inválida";
      try {
        return fecha.toLocaleString("es-MX", {
          weekday: "long", year: "numeric", month: "long", day: "numeric",
          hour: "2-digit", minute: "2-digit", timeZone: "America/Cancun",
        });
      } catch {
        return fecha.toLocaleString("es-MX", {
          weekday: "long", year: "numeric", month: "long", day: "numeric",
          hour: "2-digit", minute: "2-digit",
        });
      }
    } catch { return "Error en fecha"; }
  }

  async function confirmarAsistencia(actividadId: number) {
    if (!participante) return;
    setLoadingBtn((s) => ({ ...s, [actividadId]: true }));
    try {
      const res = await fetch(`${API_URL}/asistencias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: participante.email.trim(), actividadId }),
      });
      const j = await res.json().catch(() => ({} as any));
      if (res.status === 409) { alert("Ya tienes registrada la asistencia para esta actividad."); return; }
      if (res.status === 422 || !res.ok) {
        const err = (j as any)?.error;
        const msg = typeof err === "string" ? err : (err?.message || (j as any)?.message || `Error ${res.status}: No se pudo registrar asistencia`);
        alert(msg); return;
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
      const num = Number(brazalete.trim());
      const res = await fetch(`${API_URL}/participantes/brazalete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: participante.email.trim(), brazalete: num }),
      });
      const j = await res.json().catch(() => ({} as any));
      if (!res.ok) { alert((j as any)?.error || `Error ${res.status}: No se pudo guardar el brazalete`); return; }
      setParticipante({ ...participante, brazalete: num });
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
          <p className="registro-description">Ingresa tu correo para ver tus datos y confirmar tu asistencia.</p>
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

          {participante && (
            <div className="info-box">
              <h3>👤 Tus datos registrados</h3>
              <div className="info-box-content">
                <div><strong>Nombre:</strong> {`${participante.primer_nombre} ${participante.segundo_nombre || ""} ${participante.apellido_paterno} ${participante.apellido_materno}`}</div>
                <div><strong>Correo:</strong> {participante.email}</div>
                <div><strong>Teléfono:</strong> {participante.telefono}</div>
                <div><strong>Brazalete:</strong> {participante.brazalete ?? "—"}</div>
                <div>
                  <strong>Categoría:</strong> {participante.categoria}
                  {participante.categoria === "Estudiante" && participante.programa && <span> — {participante.programa}</span>}
                </div>
              </div>

              {!participante.brazalete && (
                <div className="brazalete-section brazalete-section--mobile">
                  <div className="warning-header">
                    <h4>⚠️ Brazalete requerido</h4>
                    <p>Necesitas registrar tu número de brazalete para poder marcar asistencia a las actividades.</p>
                  </div>
                  <div className="form-group">
                    <label htmlFor="brazalete" className="form-label">Número de brazalete</label>
                    <div className="input-button-group">
                      <input
                        id="brazalete"
                        type="text"
                        inputMode="numeric"
                        pattern="\d*"
                        maxLength={3}
                        placeholder="Número de brazalete (1-500)"
                        value={brazalete}
                        onChange={(e) => setBrazalete(e.target.value.replace(/\D/g, ""))}
                        className="form-input w-100"
                        aria-label="Número de brazalete"
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

          {participante && actividades.length > 0 && (
            <div className="conference-list">
              {sortedActividades.map((conf) => {
                const ya = !!asistencias[conf.id];
                const cargando = !!loadingBtn[conf.id];
                const cardClasses = ["conference-card", ya ? "is-registered" : ""].join(" ");
                return (
                  <div key={conf.id} className={cardClasses}>
                    {ya && <div className="badge-success">✓ Registrado</div>}
                    {conf.cupoMaximo && conf.cupoMaximo > 0 && (
                      <CupoBadge
                        inscritos={conf.inscritos || conf.ocupados || 0}
                        cupoMaximo={conf.cupoMaximo}
                        className="cupo-badge--compact"
                      />
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
                          {asistencias[conf.id]?.fechaAsistencia ? formatearFechaAsistencia(asistencias[conf.id].fechaAsistencia) : ""}
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
