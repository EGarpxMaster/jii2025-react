import React, { useEffect, useMemo, useState } from "react";
import CupoBadge from "../common/CupoBadge";

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

// Normalizador para workshops provenientes de v_workshop_stats (snake_case)
const normalizeWorkshop = (ws: any): Actividad => {
  // Manejar fechas que pueden venir como strings MySQL ('YYYY-MM-DD HH:mm:ss') u objetos
  const fechaInicio = ws.fechaInicio ?? ws.fecha_inicio;
  const fechaFin = ws.fechaFin ?? ws.fecha_fin;
  
  // Función helper para convertir fecha MySQL a ISO
  const convertToISO = (fecha: any): string => {
    if (!fecha) return new Date().toISOString();
    
    if (typeof fecha === 'string') {
      // Si es string MySQL format: '2025-09-25 16:00:00' -> ISO
      return new Date(fecha.replace(' ', 'T') + 'Z').toISOString();
    }
    
    // Si es objeto Date o cualquier otra cosa, intentar convertir
    return new Date(fecha).toISOString();
  };
  
  return {
    id: ws.id,
    titulo: ws.titulo,
    ponente: ws.ponente ?? null,
    tipo: 'Workshop',
    fechaInicio: convertToISO(fechaInicio),
    fechaFin: convertToISO(fechaFin),
    lugar: ws.lugar ?? null,
    cupoMaximo: ws.cupoMaximo ?? ws.cupo_maximo,
    inscritos: ws.inscritos ?? ws.ocupados ?? 0,
    disponibles: ws.disponibles ?? ws.cupo_disponible,
    porcentajeOcupado: ws.porcentajeOcupado ?? ws.porcentaje_ocupado,
    colorCupo: ws.colorCupo ?? ws.color_cupo,
    estadoCupo: ws.estadoCupo ?? ws.estado_cupo,
  };
};

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
  inscritos?: number;
  ocupados?: number;
  disponibles?: number;
  porcentajeOcupado?: number;
  colorCupo?: 'green' | 'yellow' | 'red';
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
  const [loadingWorkshops, setLoadingWorkshops] = useState(true);

  const placeholder = useMemo(() => "Correo electrónico", []);

  // Función mejorada para formatear fechas desde la BD
  function formatearFechaDesdeDB(fechaString: any): string {
    console.log('🔍 formatearFechaDesdeDB llamada con:', fechaString, 'tipo:', typeof fechaString);
    
    // Primero, manejar casos nulos/undefined
    if (!fechaString) {
      console.log('❌ Fecha vacía, retornando fallback');
      return "Fecha no disponible";
    }

    // Si es un objeto vacío, retornar mensaje específico (esto ya no debería pasar)
    if (typeof fechaString === 'object' && fechaString !== null && Object.keys(fechaString).length === 0) {
      console.error('❌ Objeto vacío recibido como fecha - problema en el servidor');
      return "Fecha por confirmar";
    }

    try {
      let fecha: Date;
      
      // Ahora que el servidor está arreglado, debería ser principalmente strings
      if (typeof fechaString === 'string') {
        console.log('✅ Es un string (esperado), convirtiendo a Date');
        fecha = new Date(fechaString);
      }
      // Si ya es un objeto Date, usarlo directamente
      else if (fechaString instanceof Date) {
        console.log('✅ Es un objeto Date');
        fecha = fechaString;
      } 
      // Si es un número (timestamp), convertir a Date
      else if (typeof fechaString === 'number') {
        console.log('✅ Es un número, convirtiendo a Date');
        fecha = new Date(fechaString);
      }
      // Si es un objeto, intentar extraer la fecha (fallback para compatibilidad)
      else if (typeof fechaString === 'object' && fechaString !== null) {
        console.warn('⚠️ Objeto recibido, esto no debería pasar con el servidor arreglado');
        console.log('🔍 Propiedades:', Object.keys(fechaString));
        
        // Intentar diferentes propiedades comunes para fechas
        let possibleDate = fechaString.fechaInicio || 
                          fechaString.fecha_inicio ||
                          fechaString.fecha || 
                          fechaString.date || 
                          fechaString.value ||
                          fechaString._value ||
                          fechaString.iso ||
                          fechaString.$date ||
                          fechaString.datetime;
        
        if (!possibleDate) {
          console.error('❌ No se pudo extraer fecha del objeto:', fechaString);
          return "Fecha no disponible";
        }
        
        fecha = new Date(possibleDate);
      }
      // Fallback: intentar convertir directamente
      else {
        console.log('🔍 Tipo desconocido, intentando conversión directa');
        fecha = new Date(fechaString);
      }
      
      // Verificar que la fecha sea válida
      if (isNaN(fecha.getTime())) {
        console.warn(`❌ Fecha inválida después de conversión:`, fechaString);
        return "Fecha inválida";
      }

      // Formatear la fecha para mostrar en la interfaz
      const formatted = fecha.toLocaleString("es-MX", {
        weekday: "long",
        year: "numeric",
        month: "long", 
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true // Mostrar AM/PM
      });
      
      console.log('✅ Fecha formateada exitosamente:', formatted);
      return formatted;
      
    } catch (error) {
      console.error(`❌ Error formateando fecha:`, fechaString, error);
      return "Error en fecha";
    }
  }

  // Cargar workshops desde la BD
  useEffect(() => {
    const cargarWorkshops = async () => {
      setLoadingWorkshops(true);
      try {
        const res = await fetch(`${API_BASE}/actividades?ventana=workshops`, { 
          credentials: "include" 
        });
        
        if (res.ok) {
          const response = await res.json();
          console.log('🔍 API Response completa:', response);
          // La API devuelve {message, data, total}, necesitamos el array data
          const workshopsRaw = response.data || response;
          const workshopsData: Actividad[] = Array.isArray(workshopsRaw)
            ? workshopsRaw.map(normalizeWorkshop)
            : [];
          console.log('🔍 Workshops data extraída:', workshopsData);
          
          if (workshopsData.length > 0) {
            console.log('🔍 Primer workshop completo:', JSON.stringify(workshopsData[0], null, 2));
            console.log('🔍 fechaInicio del primer workshop:', workshopsData[0]?.fechaInicio);
            console.log('🔍 Tipo de fechaInicio:', typeof workshopsData[0]?.fechaInicio);
          }
          
          // Los workshops ya vienen normalizados con fechas correctas
          setWorkshops(workshopsData);
        } else {
          const error = await res.text();
          console.error("Error del servidor al cargar workshops:", error);
          setWorkshops([]); // Asegurar que tenemos un array vacío en caso de error
        }
      } catch (error) {
        console.error("Error cargando workshops:", error);
        setWorkshops([]); // Asegurar que tenemos un array vacío en caso de error
      } finally {
        setLoadingWorkshops(false);
      }
    };

    cargarWorkshops();
  }, []);

  // Búsqueda de participante por email
  useEffect(() => {
    const value = email.trim().toLowerCase();

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
    
    const timer = setTimeout(async () => {
      setStatus("checking");
      try {
        // Buscar participante
        const resParticipante = await fetch(
          `${API_BASE}/participantes/email/${encodeURIComponent(value)}`,
          { credentials: "include" }
        );

        if (resParticipante.status === 404) {
          setParticipante(null);
          setInscripciones({});
          setStatus("notfound");
          return;
        }
        
        if (!resParticipante.ok) {
          const msg = await resParticipante.text().catch(() => "");
          setStatus("error");
          setErrorMsg(msg || "Error del servidor. Intenta nuevamente.");
          setParticipante(null);
          setInscripciones({});
          return;
        }
        const participantePayload = await resParticipante.json();
        const participanteData: Participante = normalizeParticipante(
          participantePayload?.data ?? participantePayload
        );
        setParticipante(participanteData);
        setStatus("found");

        // Buscar inscripciones del participante usando su ID (usar variable local para evitar estado stale)
        const resInscripciones = await fetch(
          `${API_BASE}/workshops/inscripciones/participante/${participanteData.id}`,
          { credentials: "include" }
        );

        if (!resInscripciones.ok) {
          const msg = await resInscripciones.text().catch(() => "");
          setStatus("error");
          setErrorMsg(msg || "No se pudieron consultar tus inscripciones.");
          setInscripciones({});
          return;
        }

        const inscripcionesResponse = await resInscripciones.json();
        const inscripcionesArray: any[] = inscripcionesResponse.data || inscripcionesResponse;
        const inscripcionesMap: Record<number, Inscripcion> = {};
        inscripcionesArray.forEach((ins) => {
          const actividadId = ins.actividadId ?? ins.actividad_id;
          if (typeof actividadId === 'number') {
            inscripcionesMap[actividadId] = {
              actividadId,
              estado: ins.estado,
              creado: ins.creado,
            } as Inscripcion;
          }
        });
        setInscripciones(inscripcionesMap);

      } catch (error) {
        console.error("Error en búsqueda de participante:", error);
        setStatus("error");
        setErrorMsg("Error de red. Verifica tu conexión.");
        setParticipante(null);
        setInscripciones({});
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [email]);

  // Ordenar workshops por fecha (los más próximos primero)
  // Función auxiliar para obtener timestamp de fecha de manera segura
  function obtenerTimestamp(fecha: any): number {
    try {
      if (fecha instanceof Date) {
        return fecha.getTime();
      } else if (typeof fecha === 'string') {
        return new Date(fecha).getTime();
      } else if (typeof fecha === 'object' && fecha !== null) {
        const possibleDate = fecha.fechaInicio || fecha.fecha || fecha.date || fecha.toString();
        return new Date(possibleDate).getTime();
      } else {
        return new Date(fecha).getTime();
      }
    } catch (error) {
      console.error('Error obteniendo timestamp:', fecha, error);
      return 0; // Fallback para ordenamiento
    }
  }

  const sortedWorkshops = useMemo(() => {
    return [...workshops].sort((a, b) => {
      const fechaA = obtenerTimestamp(a.fechaInicio);
      const fechaB = obtenerTimestamp(b.fechaInicio);
      return fechaA - fechaB;
    });
  }, [workshops]);

  function isLleno(ws: Actividad) {
    if (ws.estadoCupo) return ws.estadoCupo === "LLENO";
    if (typeof ws.disponibles === "number") return ws.disponibles <= 0;
    return false;
  }

  // Función para recargar inscripciones del participante
  const recargarInscripciones = async () => {
    if (!participante) return;
    
    try {
      const resInscripciones = await fetch(
        `${API_BASE}/workshops/inscripciones/participante/${participante.id}`, 
        { credentials: "include" }
      );

      if (resInscripciones.ok) {
        const inscripcionesResponse = await resInscripciones.json();
        const inscripcionesArray: any[] = inscripcionesResponse.data || inscripcionesResponse;
        const inscripcionesMap: Record<number, Inscripcion> = {};
        inscripcionesArray.forEach((ins) => {
          const actividadId = ins.actividadId ?? ins.actividad_id;
          if (typeof actividadId === 'number') {
            inscripcionesMap[actividadId] = {
              actividadId,
              estado: ins.estado,
              creado: ins.creado,
            } as Inscripcion;
          }
        });
        setInscripciones(inscripcionesMap);
      }
    } catch (error) {
      console.error("Error recargando inscripciones:", error);
    }
  };

  async function inscribirme(actividadId: number) {
    if (!participante) return;
    
    setLoadingBtn((estado) => ({ ...estado, [actividadId]: true }));
    try {
      const res = await fetch(`${API_BASE}/workshops/inscripciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          participante_id: participante.id,
          actividad_id: actividadId
        }),
      });

      const respuesta = await res.json().catch(() => ({} as any));

      if (res.status === 409 || res.status === 422 || !res.ok) {
        // Extraer mensaje de error de diferentes formatos
        const err = respuesta?.error;
        const msg = typeof err === 'string' 
          ? err 
          : (err?.message || respuesta?.message || 'No fue posible inscribirte.');
        alert(msg);
        return;
      }

      // Recargar workshops para actualizar cupos
      const resWorkshops = await fetch(`${API_BASE}/actividades?ventana=workshops`, { 
        credentials: "include" 
      });
      if (resWorkshops.ok) {
        const response = await resWorkshops.json();
        const workshopsRaw = response.data || response;
        const workshopsActualizados: Actividad[] = Array.isArray(workshopsRaw)
          ? workshopsRaw.map(normalizeWorkshop)
          : [];
        setWorkshops(workshopsActualizados);
      }

      // Recargar inscripciones del participante
      await recargarInscripciones();

      alert("¡Inscripción exitosa!");

    } catch (error) {
      console.error("Error inscribiendo a workshop:", error);
      alert("Error de red. Inténtalo de nuevo.");
    } finally {
      setLoadingBtn((estado) => ({ ...estado, [actividadId]: false }));
    }
  }

  async function cancelar(actividadId: number) {
    if (!participante) return;
    if (!confirm("¿Seguro que deseas cancelar tu inscripción?")) return;

    setLoadingBtn((estado) => ({ ...estado, [actividadId]: true }));
    try {
      const res = await fetch(
        `${API_BASE}/workshops/inscripciones/${participante.id}/${actividadId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const respuesta = await res.json().catch(() => ({} as any));
      if (!res.ok) {
        const err = respuesta?.error;
        const msg = typeof err === 'string' ? err : (err?.message || respuesta?.message || 'No fue posible cancelar.');
        alert(msg);
        return;
      }

      setInscripciones((mapa) => {
        const { [actividadId]: _omitir, ...resto } = mapa;
        return resto;
      });

      // Recargar workshops para actualizar cupos
      const resWorkshops = await fetch(`${API_BASE}/actividades?ventana=workshops`, { 
        credentials: "include" 
      });
      if (resWorkshops.ok) {
        const response = await resWorkshops.json();
        const workshopsRaw = response.data || response;
        const workshopsActualizados: Actividad[] = Array.isArray(workshopsRaw)
          ? workshopsRaw.map(normalizeWorkshop)
          : [];
        setWorkshops(workshopsActualizados);
      }

      // Recargar inscripciones para reflejar estado
      await recargarInscripciones();

    } catch (error) {
      console.error("Error cancelando inscripción:", error);
      alert("Error de red. Inténtalo de nuevo.");
    } finally {
      setLoadingBtn((estado) => ({ ...estado, [actividadId]: false }));
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
          {/* Campo de email */}
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
          {participante && !loadingWorkshops && workshops.length > 0 && (
            <div className="conference-list">
              {sortedWorkshops.map((workshop) => {
                const inscripcion = inscripciones[workshop.id];
                const cargando = !!loadingBtn[workshop.id];
                const lleno = isLleno(workshop);

                const cardClasses = ["conference-card", inscripcion ? "is-registered" : ""].join(" ");

                return (
                  <div key={workshop.id} className={cardClasses}>
                    {inscripcion && (
                      <div className="badge-success">
                        {inscripcion.estado === "inscrito" ? "✓ Inscrito" : "🕒 Lista de espera"}
                      </div>
                    )}
                    
                    {/* Badge de cupo en tiempo real */}
                    {workshop.cupoMaximo && workshop.cupoMaximo > 0 && (
                      <CupoBadge 
                        inscritos={workshop.inscritos || workshop.ocupados || 0}
                        cupoMaximo={workshop.cupoMaximo}
                        className="cupo-badge--compact"
                      />
                    )}
                    
                    <h4>{workshop.titulo}</h4>
                    {workshop.ponente && <p className="ponente">👨‍🏫 {workshop.ponente}</p>}
                    <div className="fecha-lugar">
                      📅 {formatearFechaDesdeDB(workshop.fechaInicio)}
                      {workshop.lugar && <span> • 📍 {workshop.lugar}</span>}
                    </div>

                    {!inscripcion ? (
                      <>
                        <button
                          type="button"
                          onClick={() => inscribirme(workshop.id)}
                          disabled={cargando}
                          className="submit-button"
                        >
                          {cargando ? "⏳ Procesando..." : (lleno ? "📝 Entrar a lista de espera" : "✅ Inscribirme")}
                        </button>
                        {typeof workshop.disponibles === "number" && (
                          <small className="email-status">
                            {workshop.disponibles} lugares disponibles
                          </small>
                        )}
                        {workshop.estadoCupo === "LLENO" && (
                          <small className="email-status error">Cupo lleno</small>
                        )}
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => cancelar(workshop.id)}
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

          {/* Estado de carga de workshops */}
          {loadingWorkshops && (
            <div className="initial-state-message">
              <div className="icon">⏳</div>
              <h3>Cargando workshops...</h3>
              <p>Obteniendo información desde la base de datos.</p>
            </div>
          )}

          {/* Estado inicial y cuando no hay workshops */}
          {!loadingWorkshops && ((participante && workshops.length === 0) || (!participante && status === "idle")) && (
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