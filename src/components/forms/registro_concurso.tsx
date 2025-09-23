import React, { useState, useCallback, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";
const API_URL = `${API_BASE}/api/equipos`;

type FormData = {
  nombreEquipo: string;
  estadoId: string;
  emailCapitan: string;
  emailsMiembros: string[];
};

type EstadoMexico = {
  id: number;
  nombre: string;
  codigo: string;
  region: string;
  disponible: boolean;
};

type ParticipanteInfo = {
  id: number;
  primerNombre: string;
  segundoNombre?: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  categoria: string;
  programa?: string;
};

type Errors = Partial<Record<keyof FormData | `miembro${number}`, string>>;
type ParticipantStatus = "idle" | "checking" | "valid" | "invalid" | "error";

interface RegistroConcursoProps {
  onSuccess?: () => void;
  className?: string;
}

const RegistroConcursoComponent: React.FC<RegistroConcursoProps> = ({
  onSuccess,
  className = "",
}) => {
  const [data, setData] = useState<FormData>({
    nombreEquipo: "",
    estadoId: "",
    emailCapitan: "",
    emailsMiembros: ["", "", "", "", ""],
  });

  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [equipoNameStatus, setEquipoNameStatus] =
    useState<"idle" | "checking" | "available" | "taken">("idle");
  const [estadosDisponibles, setEstadosDisponibles] = useState<EstadoMexico[]>([]);
  const [loadingEstados, setLoadingEstados] = useState(false);
  const [participantStatuses, setParticipantStatuses] = useState<
    Record<string, ParticipantStatus>
  >({});
  const [participantInfos, setParticipantInfos] = useState<
    Record<string, ParticipanteInfo | null>
  >({});

  // Banner de ventana
  const ventanaTexto =
    "Registro abierto del 22/09 09:00 al 23/09 23:59 (hora Cancún). ¡Elige tu estado de México!";

  // Cargar estados disponibles
  const loadEstadosDisponibles = useCallback(async () => {
    setLoadingEstados(true);
    try {
      const response = await fetch(`${API_BASE}/api/estados-disponibles`);
      if (response.ok) {
        const result = await response.json();
        // Si viene con wrapper de API, extraer los datos
        const estados = result.data || result;
        setEstadosDisponibles(estados);
        
        // Si el estado seleccionado ya no está disponible, limpiarlo
        if (data.estadoId) {
          const estadoSeleccionado = estados.find((e: EstadoMexico) => e.id.toString() === data.estadoId);
          if (!estadoSeleccionado || !estadoSeleccionado.disponible) {
            setData(prev => ({
              ...prev,
              estadoId: "",
              nombreEquipo: ""
            }));
            setEquipoNameStatus("idle");
            setErrors(prev => ({
              ...prev,
              estadoId: "El estado seleccionado ya no está disponible"
            }));
          }
        }
      }
    } catch (error) {
      console.error('Error cargando estados:', error);
      setErrors(prev => ({
        ...prev,
        estadoId: "Error cargando estados disponibles"
      }));
    } finally {
      setLoadingEstados(false);
    }
  }, [data.estadoId]);

  useEffect(() => {
    loadEstadosDisponibles();
  }, []);

  // Recargar estados cada 30 segundos para mantener actualizada la lista
  useEffect(() => {
    const interval = setInterval(loadEstadosDisponibles, 30000);
    return () => clearInterval(interval);
  }, [loadEstadosDisponibles]);

  const checkParticipant = useCallback(async (email: string, field: string) => {
    if (!email.trim()) {
      setParticipantStatuses((prev) => ({ ...prev, [field]: "idle" }));
      setParticipantInfos((prev) => ({ ...prev, [field]: null }));
      return;
    }
    setParticipantStatuses((prev) => ({ ...prev, [field]: "checking" }));
    try {
      const response = await fetch(
        `${API_URL}/check-participant?email=${encodeURIComponent(email)}`
      );
      const apiResult = await response.json();
      
      if (response.ok) {
        // Extraer datos del wrapper de API
        const result = apiResult.data || apiResult;
        
        if (result.valid) {
          setParticipantStatuses((prev) => ({ ...prev, [field]: "valid" }));
          setParticipantInfos((prev) => ({ ...prev, [field]: result.participante }));
          setErrors((prev) => ({ ...prev, [field]: undefined }));
        } else {
          setParticipantStatuses((prev) => ({ ...prev, [field]: "invalid" }));
          setParticipantInfos((prev) => ({ ...prev, [field]: null }));
          setErrors((prev) => ({ ...prev, [field]: result.error || "Participante no válido" }));
        }
      } else {
        setParticipantStatuses((prev) => ({ ...prev, [field]: "error" }));
        setParticipantInfos((prev) => ({ ...prev, [field]: null }));
        setErrors((prev) => ({ ...prev, [field]: apiResult.error || "Error verificando participante" }));
      }
    } catch (error) {
      console.error('Error verificando participante:', error);
      setParticipantStatuses((prev) => ({ ...prev, [field]: "error" }));
      setParticipantInfos((prev) => ({ ...prev, [field]: null }));
      setErrors((prev) => ({ ...prev, [field]: "Error de conexión" }));
    }
  }, []);

  // Auto-generar nombre del equipo cuando se selecciona un estado
  useEffect(() => {
    if (data.estadoId) {
      const estadoSeleccionado = estadosDisponibles.find(
        estado => estado.id === parseInt(data.estadoId)
      );
      if (estadoSeleccionado) {
        setData(prev => ({
          ...prev,
          nombreEquipo: `Equipo ${estadoSeleccionado.nombre}`
        }));
        setEquipoNameStatus("available");
        // Limpiar error de estado si existía
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.estadoId;
          return newErrors;
        });
      }
    } else {
      setData(prev => ({ ...prev, nombreEquipo: "" }));
      setEquipoNameStatus("idle");
    }
  }, [data.estadoId, estadosDisponibles]);

  const handleChange = (field: keyof FormData, value: string | string[]) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const e = { ...prev };
      delete e[field];
      return e;
    });
  };

  const handleEmailChange = (index: number, value: string, isCapitan = false) => {
    if (isCapitan) {
      setData((prev) => ({ ...prev, emailCapitan: value }));
      setErrors((prev) => {
        const e = { ...prev };
        delete e.emailCapitan;
        return e;
      });
    } else {
      const newEmails = [...data.emailsMiembros];
      newEmails[index] = value;
      setData((prev) => ({ ...prev, emailsMiembros: newEmails }));
      setErrors((prev) => {
        const e = { ...prev };
        delete e[`miembro${index}` as keyof Errors];
        return e;
      });
    }
  };

  const handleBlur = (field: string, email: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const basic = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && basic.test(email)) {
      checkParticipant(email, field);
    }
  };

  const validate = (): boolean => {
    const newErrors: Errors = {};

    if (!data.estadoId) {
      newErrors.estadoId = "Debes seleccionar un estado de México";
    } else {
      // Verificar que el estado seleccionado aún está disponible
      const estadoSeleccionado = estadosDisponibles.find(
        estado => estado.id.toString() === data.estadoId
      );
      if (!estadoSeleccionado) {
        newErrors.estadoId = "Estado no encontrado";
      } else if (!estadoSeleccionado.disponible) {
        newErrors.estadoId = "El estado seleccionado ya no está disponible";
      }
    }

    const basic = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.emailCapitan.trim()) {
      newErrors.emailCapitan = "Correo del capitán obligatorio";
    } else if (!basic.test(data.emailCapitan)) {
      newErrors.emailCapitan = "Formato de correo inválido";
    }

    const allEmails = [data.emailCapitan, ...data.emailsMiembros.filter((e) => e.trim())];
    const unique = new Set(allEmails);
    if (unique.size !== allEmails.length) {
      newErrors.emailCapitan = "No pueden haber correos duplicados";
    }

    data.emailsMiembros.forEach((email, index) => {
      const key = `miembro${index}` as keyof Errors;
      if (!email.trim()) newErrors[key] = "Correo de miembro obligatorio";
      else if (!basic.test(email)) newErrors[key] = "Formato de correo inválido";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();

    const touchedFields: Record<string, boolean> = {
      estadoId: true,
      emailCapitan: true,
    };
    data.emailsMiembros.forEach((_, i) => {
      touchedFields[`miembro${i}`] = true;
    });
    setTouched(touchedFields);

    if (!validate()) return;

    // Verificar una vez más que el estado esté disponible antes del envío
    await loadEstadosDisponibles();
    const estadoSeleccionado = estadosDisponibles.find(
      estado => estado.id.toString() === data.estadoId
    );
    if (!estadoSeleccionado || !estadoSeleccionado.disponible) {
      setErrors(prev => ({
        ...prev,
        estadoId: "El estado seleccionado ya no está disponible. Por favor, selecciona otro estado."
      }));
      return;
    }

    const allValid =
      participantStatuses.emailCapitan === "valid" &&
      data.emailsMiembros.every((_, i) => participantStatuses[`miembro${i}`] === "valid");

    if (!allValid) {
      setErrors((prev) => ({
        ...prev,
        emailCapitan:
          participantStatuses.emailCapitan !== "valid" ? "Verifica el email del capitán" : prev.emailCapitan,
      }));
      return;
    }

    setIsSubmitting(true);
    try {
      // Transformar datos al formato esperado por el backend (snake_case)
      const requestBody = {
        nombre_equipo: data.nombreEquipo.trim(),
        estado_id: parseInt(data.estadoId),
        email_capitan: data.emailCapitan.trim(),
        email_miembro_1: data.emailsMiembros[0]?.trim() || '',
        email_miembro_2: data.emailsMiembros[1]?.trim() || '',
        email_miembro_3: data.emailsMiembros[2]?.trim() || '',
        email_miembro_4: data.emailsMiembros[3]?.trim() || '',
        email_miembro_5: data.emailsMiembros[4]?.trim() || '',
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      const result = await response.json().catch(() => ({}));
      if (response.status === 422) {
        setErrors(result.errors || {});
        return;
      }
      if (response.status === 400 || response.status === 409) {
        if (Array.isArray(result.details)) {
          alert(`Error en el registro:\n\n${result.details.join("\n")}`);
        } else {
          const errorMessage = result.error || "Error en el registro del equipo";
          alert(errorMessage);
          // Si el error es por estado no disponible, recargar la lista
          if (errorMessage.includes("disponible") || errorMessage.includes("estado")) {
            await loadEstadosDisponibles();
          }
        }
        return;
      }
      if (!response.ok) {
        alert(result.error || "Error interno del servidor");
        return;
      }

      setSubmitted(true);
      onSuccess
        ? onSuccess()
        : setTimeout(() => {
            window.location.href = "/";
          }, 3000);
    } catch (error) {
      console.error("Error en el registro:", error);
      alert("Error de red. Verifica tu conexión.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderParticipantStatus = (field: string, participante: ParticipanteInfo | null) => {
    const status = participantStatuses[field];
    if (status === "checking") return <small className="checking">Verificando participante...</small>;
    if (status === "valid" && participante) {
      return (
        <div className="participant-info">
          <small className="success">
            ✓ {participante.primerNombre} {participante.apellidoPaterno}
          </small>
          {participante.programa && <small className="program">{participante.programa}</small>}
        </div>
      );
    }
    if (status === "invalid")
      return <small className="error">{errors[field as keyof Errors] || "Participante no válido"}</small>;
    if (status === "error") return <small className="error">Error verificando participante</small>;
    return null;
  };

  return (
    <section className={`registro-section ${className}`}>
      <div className="registro-container">
        {!submitted ? (
          <>
            <div className="registro-header">
              <h2>Registro de Equipo - Concurso</h2>
              <p className="registro-description">
                Registra tu equipo para el concurso. Los equipos deben tener exactamente <b>6 integrantes</b>. 
                Abierto <b>para todas las personas</b> previamente registradas. Solo se permite <b>un equipo por persona</b>.
              </p>
              <p className="registro-description" style={{ marginTop: "0.5rem", fontWeight: 600 }}>
                🗓️ {ventanaTexto}
              </p>
            </div>

            <form noValidate onSubmit={handleSubmit} className="registro-form">
              <fieldset className="registro-fieldset">
                <legend className="registro-legend">Información del Equipo</legend>

                <div className="registro-grid">
                  {/* Nombre del equipo - Auto-generado */}
                  <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                    <label htmlFor="nombreEquipo" className="form-label">
                      Nombre del Equipo *
                    </label>
                    <input
                      id="nombreEquipo"
                      name="nombreEquipo"
                      type="text"
                      placeholder="Selecciona un estado para generar el nombre automáticamente"
                      value={data.nombreEquipo}
                      readOnly
                      className={`form-input readonly-input ${errors.nombreEquipo ? "input-error" : ""}`}
                      style={{ 
                        backgroundColor: '#f8f9fa', 
                        cursor: 'not-allowed',
                        color: '#6c757d'
                      }}
                    />
                    <div className="equipo-name-status">
                      {data.nombreEquipo && (
                        <small className="success">✓ Nombre generado automáticamente</small>
                      )}
                      {!data.nombreEquipo && (
                        <small className="info">Selecciona un estado para generar el nombre</small>
                      )}
                    </div>
                    {touched.nombreEquipo && errors.nombreEquipo && (
                      <small role="alert" className="error-message">
                        {errors.nombreEquipo}
                      </small>
                    )}
                  </div>

                  {/* Selección de Estado */}
                  <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                    <label htmlFor="estadoId" className="form-label">
                      Estado de México que representarás *
                      {estadosDisponibles.length > 0 && (
                        <small style={{ marginLeft: '0.5rem', fontWeight: 'normal', color: '#666' }}>
                          ({estadosDisponibles.length} estados disponibles)
                        </small>
                      )}
                    </label>
                    <select
                      id="estadoId"
                      name="estadoId"
                      value={data.estadoId}
                      onChange={(e) => handleChange("estadoId", e.target.value)}
                      onBlur={() => setTouched((prev) => ({ ...prev, estadoId: true }))}
                      className={`form-input ${errors.estadoId ? "input-error" : ""}`}
                      required
                      disabled={loadingEstados}
                    >
                      <option value="">
                        {loadingEstados ? "Cargando estados..." : "Selecciona un estado"}
                      </option>
                      {estadosDisponibles.map((estado) => (
                        <option key={estado.id} value={estado.id.toString()}>
                          {estado.nombre} ({estado.region})
                        </option>
                      ))}
                    </select>
                    {data.estadoId && !errors.estadoId && (
                      <small className="success">
                        ✓ Representarás a {estadosDisponibles.find(e => e.id.toString() === data.estadoId)?.nombre}
                      </small>
                    )}
                    {estadosDisponibles.length === 0 && !loadingEstados && (
                      <small className="error">
                        ⚠️ No hay estados disponibles en este momento
                      </small>
                    )}
                    {touched.estadoId && errors.estadoId && (
                      <small role="alert" className="error-message">
                        {errors.estadoId}
                      </small>
                    )}
                  </div>
                </div>
              </fieldset>

              <fieldset className="registro-fieldset">
                <legend className="registro-legend">Capitán del Equipo</legend>

                <div className="registro-grid">
                  <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                    <label htmlFor="emailCapitan" className="form-label">
                      Correo electrónico del Capitán *
                    </label>
                    <input
                      id="emailCapitan"
                      name="emailCapitan"
                      type="email"
                      placeholder="Correo electrónico del capitán"
                      value={data.emailCapitan}
                      onChange={(e) => handleEmailChange(0, e.target.value, true)}
                      onBlur={(e) => handleBlur("emailCapitan", e.target.value)}
                      className={`form-input ${errors.emailCapitan ? "input-error" : ""}`}
                      required
                    />
                    <div className="participant-status">
                      {renderParticipantStatus("emailCapitan", participantInfos.emailCapitan)}
                    </div>
                    {touched.emailCapitan && errors.emailCapitan && (
                      <small role="alert" className="error-message">
                        {errors.emailCapitan}
                      </small>
                    )}
                  </div>
                </div>
              </fieldset>

              <fieldset className="registro-fieldset">
                <legend className="registro-legend">Miembros del Equipo (5 adicionales)</legend>

                <div className="registro-grid">
                  {data.emailsMiembros.map((email, index) => (
                    <div key={index} className="form-group">
                      <label htmlFor={`miembro${index}`} className="form-label">
                        Miembro {index + 1} *
                      </label>
                      <input
                        id={`miembro${index}`}
                        name={`miembro${index}`}
                        type="email"
                        placeholder="Correo electrónico del miembro"
                        value={email}
                        onChange={(e) => handleEmailChange(index, e.target.value)}
                        onBlur={(e) => handleBlur(`miembro${index}`, e.target.value)}
                        className={`form-input ${
                          errors[`miembro${index}` as keyof Errors] ? "input-error" : ""
                        }`}
                        required
                      />
                      <div className="participant-status">
                        {renderParticipantStatus(
                          `miembro${index}`,
                          participantInfos[`miembro${index}`]
                        )}
                      </div>
                      {touched[`miembro${index}`] &&
                        errors[`miembro${index}` as keyof Errors] && (
                          <small role="alert" className="error-message">
                            {errors[`miembro${index}` as keyof Errors]}
                          </small>
                        )}
                    </div>
                  ))}
                </div>
              </fieldset>

              <div className="form-submit">
                <button
                  type="submit"
                  className={`submit-button ${isSubmitting ? "submitting" : ""}`}
                  disabled={isSubmitting || estadosDisponibles.length === 0}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Registrando Equipo...
                    </>
                  ) : estadosDisponibles.length === 0 ? (
                    "No hay estados disponibles"
                  ) : (
                    "Registrar Equipo"
                  )}
                </button>
                {estadosDisponibles.length === 0 && (
                  <small className="error" style={{ marginTop: '0.5rem', display: 'block' }}>
                    Todos los estados han sido ocupados por otros equipos
                  </small>
                )}
              </div>
            </form>
          </>
        ) : (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h2>¡Equipo Registrado Exitosamente!</h2>
            <p>
              Tu equipo "<strong>{data.nombreEquipo}</strong>" ha sido registrado correctamente para el concurso.
              Serás redirigido a la página principal en unos segundos...
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RegistroConcursoComponent;