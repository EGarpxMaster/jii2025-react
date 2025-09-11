import React, { useState, useCallback, useEffect } from "react";

const API_URL = "/api/equipos";

type FormData = {
  nombreEquipo: string;
  emailCapitan: string;
  emailsMiembros: string[];
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
  className = ""
}) => {
  const [data, setData] = useState<FormData>({
    nombreEquipo: "",
    emailCapitan: "",
    emailsMiembros: ["", "", "", "", ""]
  });

  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Estados para validaciones en tiempo real
  const [equipoNameStatus, setEquipoNameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [participantStatuses, setParticipantStatuses] = useState<Record<string, ParticipantStatus>>({});
  const [participantInfos, setParticipantInfos] = useState<Record<string, ParticipanteInfo | null>>({});

  // Verificar disponibilidad del nombre del equipo
  const checkEquipoName = useCallback(async (nombre: string) => {
    if (!nombre.trim()) {
      setEquipoNameStatus("idle");
      return;
    }

    setEquipoNameStatus("checking");
    try {
      const response = await fetch(`${API_URL}/check-name?nombre=${encodeURIComponent(nombre)}`);
      const result = await response.json();
      
      if (response.ok) {
        setEquipoNameStatus(result.available ? "available" : "taken");
      } else {
        setEquipoNameStatus("idle");
      }
    } catch (error) {
      console.error("Error verificando nombre:", error);
      setEquipoNameStatus("idle");
    }
  }, []);

  // Verificar validez de un participante
  const checkParticipant = useCallback(async (email: string, field: string) => {
    if (!email.trim()) {
      setParticipantStatuses(prev => ({ ...prev, [field]: "idle" }));
      setParticipantInfos(prev => ({ ...prev, [field]: null }));
      return;
    }

    setParticipantStatuses(prev => ({ ...prev, [field]: "checking" }));
    
    try {
      const response = await fetch(`${API_URL}/check-participant?email=${encodeURIComponent(email)}`);
      const result = await response.json();
      
      if (response.ok) {
        if (result.valid) {
          setParticipantStatuses(prev => ({ ...prev, [field]: "valid" }));
          setParticipantInfos(prev => ({ ...prev, [field]: result.participante }));
        } else {
          setParticipantStatuses(prev => ({ ...prev, [field]: "invalid" }));
          setParticipantInfos(prev => ({ ...prev, [field]: result.participante }));
          setErrors(prev => ({ ...prev, [field]: result.error }));
        }
      } else {
        setParticipantStatuses(prev => ({ ...prev, [field]: "error" }));
        setParticipantInfos(prev => ({ ...prev, [field]: null }));
      }
    } catch (error) {
      console.error("Error verificando participante:", error);
      setParticipantStatuses(prev => ({ ...prev, [field]: "error" }));
      setParticipantInfos(prev => ({ ...prev, [field]: null }));
    }
  }, []);

  // Debounced check para nombre de equipo
  useEffect(() => {
    const timer = setTimeout(() => {
      if (data.nombreEquipo.trim()) {
        checkEquipoName(data.nombreEquipo.trim());
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [data.nombreEquipo, checkEquipoName]);

  const handleChange = (field: keyof FormData, value: string | string[]) => {
    setData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar errores del campo
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const handleEmailChange = (index: number, value: string, isCapitan: boolean = false) => {
    if (isCapitan) {
      setData(prev => ({ ...prev, emailCapitan: value }));
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.emailCapitan;
        return newErrors;
      });
    } else {
      const newEmails = [...data.emailsMiembros];
      newEmails[index] = value;
      setData(prev => ({ ...prev, emailsMiembros: newEmails }));
      
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`miembro${index}` as keyof Errors];
        return newErrors;
      });
    }
  };

  const handleBlur = (field: string, email: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Solo verificar si el email tiene formato válido básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && emailRegex.test(email)) {
      checkParticipant(email, field);
    }
  };

  const validate = (): boolean => {
    const newErrors: Errors = {};

    // Validar nombre del equipo
    if (!data.nombreEquipo.trim()) {
      newErrors.nombreEquipo = "Nombre del equipo obligatorio";
    } else if (equipoNameStatus === "taken") {
      newErrors.nombreEquipo = "Este nombre ya está en uso";
    }

    // Validar email del capitán
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.emailCapitan.trim()) {
      newErrors.emailCapitan = "Email del capitán obligatorio";
    } else if (!emailRegex.test(data.emailCapitan)) {
      newErrors.emailCapitan = "Formato de email inválido";
    } else if (participantStatuses.emailCapitan === "invalid") {
      // El error ya está establecido desde la verificación
    }

    // Validar emails de miembros
    const allEmails = [data.emailCapitan, ...data.emailsMiembros.filter(email => email.trim())];
    const uniqueEmails = new Set(allEmails);
    
    if (uniqueEmails.size !== allEmails.length) {
      newErrors.emailCapitan = "No pueden haber emails duplicados";
    }

    data.emailsMiembros.forEach((email, index) => {
      const fieldKey = `miembro${index}` as keyof Errors;
      
      if (!email.trim()) {
        newErrors[fieldKey] = "Email de miembro obligatorio";
      } else if (!emailRegex.test(email)) {
        newErrors[fieldKey] = "Formato de email inválido";
      } else if (participantStatuses[`miembro${index}`] === "invalid") {
        // El error ya está establecido desde la verificación
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();

    // Marcar todos los campos como touched
    const touchedFields: Record<string, boolean> = {
      nombreEquipo: true,
      emailCapitan: true,
    };
    
    data.emailsMiembros.forEach((_, index) => {
      touchedFields[`miembro${index}`] = true;
    });

    setTouched(touchedFields);

    if (!validate()) {
      return;
    }

    // Verificar que todas las validaciones estén completadas y sean válidas
    const allValid = 
      equipoNameStatus === "available" &&
      participantStatuses.emailCapitan === "valid" &&
      data.emailsMiembros.every((_, index) => 
        participantStatuses[`miembro${index}`] === "valid"
      );

    if (!allValid) {
      setErrors(prev => ({ 
        ...prev, 
        nombreEquipo: equipoNameStatus !== "available" ? "Verifica el nombre del equipo" : undefined,
        emailCapitan: participantStatuses.emailCapitan !== "valid" ? "Verifica el email del capitán" : undefined
      }));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          nombreEquipo: data.nombreEquipo.trim(),
          emailCapitan: data.emailCapitan.trim(),
          emailsMiembros: data.emailsMiembros.map(email => email.trim())
        })
      });

      const result = await response.json();

      if (response.status === 422) {
        setErrors(result.errors || {});
        return;
      }

      if (response.status === 400 || response.status === 409) {
        if (result.details && Array.isArray(result.details)) {
          // Mostrar errores específicos de validación de participantes
          const errorMessage = result.details.join("\n");
          alert(`Error en el registro:\n\n${errorMessage}`);
        } else {
          alert(result.error || "Error en el registro del equipo");
        }
        return;
      }

      if (!response.ok) {
        alert(result.error || "Error interno del servidor");
        return;
      }

      // Éxito
      setSubmitted(true);
      if (onSuccess) {
        onSuccess();
      } else {
        setTimeout(() => {
          window.location.href = "/";
        }, 3000);
      }

    } catch (error) {
      console.error("Error en el registro:", error);
      alert("Error de red. Verifica tu conexión.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderParticipantStatus = (field: string, participante: ParticipanteInfo | null) => {
    const status = participantStatuses[field];
    
    if (status === "checking") {
      return <small className="checking">Verificando participante...</small>;
    }
    
    if (status === "valid" && participante) {
      return (
        <div className="participant-info">
          <small className="success">
            ✓ {participante.primerNombre} {participante.apellidoPaterno}
          </small>
          {participante.programa && (
            <small className="program">{participante.programa}</small>
          )}
        </div>
      );
    }
    
    if (status === "invalid") {
      return <small className="error">{errors[field as keyof Errors] || "Participante no válido"}</small>;
    }

    if (status === "error") {
      return <small className="error">Error verificando participante</small>;
    }

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
                Registra tu equipo para el concurso. Los equipos deben tener exactamente <b>6 integrantes</b> 
                y todos deben estar previamente registrados como <b>estudiantes</b>. 
                Designa un <b>capitán</b> y asigna un nombre único a tu equipo.
              </p>
            </div>

            <form noValidate onSubmit={handleSubmit} className="registro-form">
              <fieldset className="registro-fieldset">
                <legend className="registro-legend">Información del Equipo</legend>

                <div className="registro-grid">
                  {/* Nombre del equipo */}
                  <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                    <label htmlFor="nombreEquipo" className="form-label">
                      Nombre del Equipo *
                    </label>
                    <input
                      id="nombreEquipo"
                      name="nombreEquipo"
                      type="text"
                      placeholder="Ingresa un nombre único para tu equipo"
                      value={data.nombreEquipo}
                      onChange={(e) => handleChange("nombreEquipo", e.target.value)}
                      onBlur={() => setTouched(prev => ({ ...prev, nombreEquipo: true }))}
                      className={`form-input ${errors.nombreEquipo ? "input-error" : ""}`}
                      required
                    />
                    <div className="equipo-name-status">
                      {equipoNameStatus === "checking" && (
                        <small className="checking">Verificando disponibilidad...</small>
                      )}
                      {equipoNameStatus === "available" && data.nombreEquipo && (
                        <small className="success">✓ Nombre disponible</small>
                      )}
                      {equipoNameStatus === "taken" && (
                        <small className="error">Este nombre ya está en uso</small>
                      )}
                    </div>
                    {touched.nombreEquipo && errors.nombreEquipo && (
                      <small role="alert" className="error-message">
                        {errors.nombreEquipo}
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
                      Email del Capitán *
                    </label>
                    <input
                      id="emailCapitan"
                      name="emailCapitan"
                      type="email"
                      placeholder="correo.capitan@ejemplo.com"
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
                        placeholder={`correo.miembro${index + 1}@ejemplo.com`}
                        value={email}
                        onChange={(e) => handleEmailChange(index, e.target.value)}
                        onBlur={(e) => handleBlur(`miembro${index}`, e.target.value)}
                        className={`form-input ${errors[`miembro${index}` as keyof Errors] ? "input-error" : ""}`}
                        required
                      />
                      <div className="participant-status">
                        {renderParticipantStatus(`miembro${index}`, participantInfos[`miembro${index}`])}
                      </div>
                      {touched[`miembro${index}`] && errors[`miembro${index}` as keyof Errors] && (
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Registrando Equipo...
                    </>
                  ) : (
                    "Registrar Equipo"
                  )}
                </button>
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