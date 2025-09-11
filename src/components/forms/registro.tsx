import React, { useMemo, useState } from "react";

const API_URL = "/api/registro";

type Categoria = "Estudiante" | "Ponente" | "Asistente externo";
type Programa =
  | "Ingeniería Industrial"
  | "Ingeniería Ambiental"
  | "Ingeniería en Datos e Inteligencia Organizacional"
  | "Ingeniería en Logística y Cadena de Suministro"
  | "Ingeniería en Inteligencia Artificial"
  | "Ingeniería en Industrias Alimentarias";

type FormData = {
  apellidoPaterno: string;
  apellidoMaterno: string;
  primerNombre: string;
  segundoNombre?: string;
  email: string;
  telefono: string;
  categoria: Categoria | "";
  programa?: Programa | "";
  brazalete: string; // NEW: Brazalete field
};

type Errors = Partial<Record<keyof FormData, string>>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

const programas: Programa[] = [
  "Ingeniería Industrial",
  "Ingeniería Ambiental",
  "Ingeniería en Datos e Inteligencia Organizacional",
  "Ingeniería en Logística y Cadena de Suministro",
  "Ingeniería en Inteligencia Artificial",
  "Ingeniería en Industrias Alimentarias"
];

interface RegistroComponentProps {
  onSuccess?: () => void;
  className?: string;
}

const RegistroComponent: React.FC<RegistroComponentProps> = ({ 
  onSuccess,
  className = ""
}) => {
  const [data, setData] = useState<FormData>({
    apellidoPaterno: "",
    apellidoMaterno: "",
    primerNombre: "",
    segundoNombre: "",
    email: "",
    telefono: "",
    categoria: "",
    programa: "",
    brazalete: "", // NEW: Initialize brazalete field
  });

  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "checking" | "ok" | "taken" | "invalid"
  >("idle");
  const [brazaleteStatus, setBrazaleteStatus] = useState<
    "idle" | "checking" | "ok" | "taken" | "invalid"
  >("idle"); // NEW: Brazalete status
  const [submitted, setSubmitted] = useState(false);

  const isEstudiante = data.categoria === "Estudiante";

  const placeholders = useMemo(
    () => ({
      apellidoPaterno: "Ingresa tu apellido paterno",
      apellidoMaterno: "Ingresa tu apellido materno",
      primerNombre: "Ingresa tu primer nombre",
      segundoNombre: "Ingresa tu segundo nombre",
      email: "Correo electrónico",
      telefono: "Teléfono (10 dígitos)",
      brazalete: "Ingresa tu número de brazalete",
    }),
    []
  );

  function handleChange<
    K extends keyof FormData,
    V extends FormData[K] | string
  >(field: K, value: V) {
    setData((prev) => {
      const next = { ...prev, [field]: value } as FormData;

      // Si cambia la categoría, limpiar programa cuando no sea Estudiante
      if (field === "categoria" && value !== "Estudiante") {
        next.programa = "";
      }
      // Sanitizar teléfono: solo dígitos y máx. 10
      if (field === "telefono") {
        const digits = String(value).replace(/\D/g, "").slice(0, 10);
        (next.telefono as string) = digits;
      }
      // NEW: Sanitizar brazalete: solo números y letras, máx. 20 caracteres
      if (field === "brazalete") {
        const clean = String(value).replace(/[^a-zA-Z0-9]/g, "").slice(0, 20).toUpperCase();
        (next.brazalete as string) = clean;
      }
      return next;
    });
  }

  function handleBlur(field: keyof FormData) {
    setTouched((t) => ({ ...t, [field]: true }));
    // Validación inmediata del campo
    const newErrors = validate({ ...data });
    setErrors(newErrors);

    // Checar email único al salir del campo
    if (field === "email") {
      void verifyEmailUnique();
    }
    
    // NEW: Checar brazalete único al salir del campo
    if (field === "brazalete") {
      void verifyBrazaleteUnique();
    }
  }

  async function checkEmailUnique(email: string): Promise<boolean> {
    try {
      const url = `${API_URL}?action=check-email&email=${encodeURIComponent(
        email
      )}`;
      
      const res = await fetch(url, { credentials: "include" });
      
      if (!res.ok) {
        return true; // No bloquear si backend no responde correctamente
      }
      
      const json = await res.json();
      return !!json.unique;
    } catch (error) {
      return true; // Evitar bloquear por fallas de red
    }
  }

  // NEW: Function to check brazalete uniqueness
  async function checkBrazaleteUnique(brazalete: string): Promise<boolean> {
    try {
      const url = `${API_URL}?action=check-brazalete&brazalete=${encodeURIComponent(
        brazalete
      )}`;
      
      const res = await fetch(url, { credentials: "include" });
      
      if (!res.ok) {
        return true; // No bloquear si backend no responde correctamente
      }
      
      const json = await res.json();
      return !!json.unique;
    } catch (error) {
      return true; // Evitar bloquear por fallas de red
    }
  }

  async function verifyEmailUnique() {
    const email = data.email.trim();
    if (!emailRegex.test(email)) {
      setEmailStatus("invalid");
      return;
    }
    setEmailStatus("checking");
    const unique = await checkEmailUnique(email);
    setEmailStatus(unique ? "ok" : "taken");
  }

  // NEW: Function to verify brazalete uniqueness
  async function verifyBrazaleteUnique() {
    const brazalete = data.brazalete.trim();
    if (!brazalete || brazalete.length < 3) {
      setBrazaleteStatus("invalid");
      return;
    }
    setBrazaleteStatus("checking");
    const unique = await checkBrazaleteUnique(brazalete);
    setBrazaleteStatus(unique ? "ok" : "taken");
  }

  function validate(values: FormData): Errors {
    const e: Errors = {};
    if (!values.apellidoPaterno.trim()) e.apellidoPaterno = "Campo obligatorio";
    if (!values.apellidoMaterno.trim()) e.apellidoMaterno = "Campo obligatorio";
    if (!values.primerNombre.trim()) e.primerNombre = "Campo obligatorio";

    const email = values.email.trim();
    if (!email) e.email = "Campo obligatorio";
    else if (!emailRegex.test(email)) e.email = "Formato de correo inválido";

    const tel = values.telefono.trim();
    if (!tel) e.telefono = "Campo obligatorio";
    else if (!/^\d{10}$/.test(tel))
      e.telefono = "Deben ser exactamente 10 dígitos";

    // NEW: Brazalete validation
    const brazalete = values.brazalete.trim();
    if (!brazalete) e.brazalete = "Campo obligatorio";
    else if (brazalete.length < 3) e.brazalete = "Mínimo 3 caracteres";
    else if (brazalete.length > 20) e.brazalete = "Máximo 20 caracteres";
    else if (!/^[A-Z0-9]+$/.test(brazalete)) e.brazalete = "Solo números y letras";

    if (!values.categoria) e.categoria = "Selecciona una categoría";

    if (values.categoria === "Estudiante") {
      if (!values.programa) e.programa = "Selecciona un programa";
    }
    return e;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    
    // Solo marcar como touched los campos que son relevantes según la categoría
    const touchedFields: Record<string, boolean> = {
      apellidoPaterno: true,
      apellidoMaterno: true,
      primerNombre: true,
      segundoNombre: true,
      email: true,
      telefono: true,
      categoria: true,
      brazalete: true, // NEW: Always mark brazalete as touched
    };

    // Solo incluir programa si es estudiante
    if (data.categoria === "Estudiante") {
      touchedFields.programa = true;
    }

    setTouched(touchedFields);

    const newErrors = validate(data);
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Verificar unicidad de email en backend
    const emailUnique = await checkEmailUnique(data.email);
    if (!emailUnique) {
      setEmailStatus("taken");
      setErrors((e) => ({
        ...e,
        email: "Este correo ya fue registrado",
      }));
      return;
    }

    // NEW: Verificar unicidad de brazalete en backend
    const brazaleteUnique = await checkBrazaleteUnique(data.brazalete);
    if (!brazaleteUnique) {
      setBrazaleteStatus("taken");
      setErrors((e) => ({
        ...e,
        brazalete: "Este número de brazalete ya fue registrado",
      }));
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Crear payload limpio - excluir programa si no es estudiante
      const payload = data.categoria === "Estudiante" 
        ? data 
        : { ...data, programa: undefined };
        
      const payloadJson = JSON.stringify(payload);
      
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: payloadJson,
      });

      if (res.status === 409) {
        const errorData = await res.json();
        // Handle different types of conflicts
        if (errorData.field === 'email') {
          setEmailStatus("taken");
          setErrors((e) => ({ ...e, email: "Este correo ya fue registrado" }));
        } else if (errorData.field === 'brazalete') {
          setBrazaleteStatus("taken");
          setErrors((e) => ({ ...e, brazalete: "Este número de brazalete ya fue registrado" }));
        } else {
          // Generic conflict error
          alert(errorData.error || "Ya existe un registro con estos datos");
        }
        return;
      }

      if (res.status === 422) {
        const errorData = await res.json();
        setErrors(errorData.errors || {});
        return;
      }

      if (!res.ok) {
        const errorText = await res.text();
        try {
          const errorData = JSON.parse(errorText);
          alert(errorData?.error || "Ocurrió un error al enviar. Intenta de nuevo.");
        } catch {
          alert("Ocurrió un error al enviar. Intenta de nuevo.");
        }
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
      
    } catch (err) {
      alert("Error de red. Verifica tu conexión.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className={`registro-section ${className}`}>
      <div className="registro-container">
        {!submitted ? (
          <>
            <div className="registro-header">
              <h2>Registro de Participante</h2>
              <p className="registro-description">
                Completa los campos obligatorios. Si eliges <b>Estudiante</b>, se
                te pedirá seleccionar tu <b>Programa educativo</b>.
              </p>
            </div>

            <form noValidate onSubmit={handleSubmit} className="registro-form">
              <fieldset className="registro-fieldset">
                <legend className="registro-legend">Datos Personales</legend>

                <div className="registro-grid">
                  {/* Apellido paterno */}
                  <div className="form-group">
                    <label htmlFor="apellidoPaterno" className="form-label">
                      Apellido Paterno *
                    </label>
                    <input
                      id="apellidoPaterno"
                      name="apellidoPaterno"
                      type="text"
                      placeholder={placeholders.apellidoPaterno}
                      value={data.apellidoPaterno}
                      onChange={(e) =>
                        handleChange("apellidoPaterno", e.target.value)
                      }
                      onBlur={() => handleBlur("apellidoPaterno")}
                      aria-invalid={!!errors.apellidoPaterno}
                      className={`form-input ${errors.apellidoPaterno ? "input-error" : ""}`}
                      required
                    />
                    {touched.apellidoPaterno && errors.apellidoPaterno && (
                      <small role="alert" className="error-message">
                        {errors.apellidoPaterno}
                      </small>
                    )}
                  </div>

                  {/* Apellido materno */}
                  <div className="form-group">
                    <label htmlFor="apellidoMaterno" className="form-label">
                      Apellido Materno *
                    </label>
                    <input
                      id="apellidoMaterno"
                      name="apellidoMaterno"
                      type="text"
                      placeholder={placeholders.apellidoMaterno}
                      value={data.apellidoMaterno}
                      onChange={(e) =>
                        handleChange("apellidoMaterno", e.target.value)
                      }
                      onBlur={() => handleBlur("apellidoMaterno")}
                      aria-invalid={!!errors.apellidoMaterno}
                      className={`form-input ${errors.apellidoMaterno ? "input-error" : ""}`}
                      required
                    />
                    {touched.apellidoMaterno && errors.apellidoMaterno && (
                      <small role="alert" className="error-message">
                        {errors.apellidoMaterno}
                      </small>
                    )}
                  </div>

                  {/* Primer nombre */}
                  <div className="form-group">
                    <label htmlFor="primerNombre" className="form-label">
                      Primer Nombre *
                    </label>
                    <input
                      id="primerNombre"
                      name="primerNombre"
                      type="text"
                      placeholder={placeholders.primerNombre}
                      value={data.primerNombre}
                      onChange={(e) =>
                        handleChange("primerNombre", e.target.value)
                      }
                      onBlur={() => handleBlur("primerNombre")}
                      aria-invalid={!!errors.primerNombre}
                      className={`form-input ${errors.primerNombre ? "input-error" : ""}`}
                      required
                    />
                    {touched.primerNombre && errors.primerNombre && (
                      <small role="alert" className="error-message">
                        {errors.primerNombre}
                      </small>
                    )}
                  </div>

                  {/* Segundo nombre */}
                  <div className="form-group">
                    <label htmlFor="segundoNombre" className="form-label">
                      Segundo Nombre
                    </label>
                    <input
                      id="segundoNombre"
                      name="segundoNombre"
                      type="text"
                      placeholder={placeholders.segundoNombre}
                      value={data.segundoNombre}
                      onChange={(e) =>
                        handleChange("segundoNombre", e.target.value)
                      }
                      onBlur={() => handleBlur("segundoNombre")}
                      className="form-input"
                    />
                  </div>

                  {/* NEW: Brazalete field */}
                  <div className="form-group">
                    <label htmlFor="brazalete" className="form-label">
                      Número de Brazalete *
                    </label>
                    <input
                      id="brazalete"
                      name="brazalete"
                      type="text"
                      placeholder={placeholders.brazalete}
                      value={data.brazalete}
                      onChange={(e) => handleChange("brazalete", e.target.value)}
                      onBlur={() => handleBlur("brazalete")}
                      aria-invalid={!!errors.brazalete || brazaleteStatus === "taken"}
                      className={`form-input ${errors.brazalete || brazaleteStatus === "taken" ? "input-error" : ""}`}
                      required
                    />
                    <div className="brazalete-status">
                      {brazaleteStatus === "checking" && (
                        <small className="checking">Verificando disponibilidad…</small>
                      )}
                      {brazaleteStatus === "ok" && data.brazalete && (
                        <small className="success">✓ Número disponible</small>
                      )}
                      {brazaleteStatus === "invalid" && (
                        <small role="alert" className="error">
                          Formato de brazalete inválido
                        </small>
                      )}
                      {brazaleteStatus === "taken" && (
                        <small role="alert" className="error">
                          Este número ya fue registrado
                        </small>
                      )}
                    </div>
                    {touched.brazalete && errors.brazalete && (
                      <small role="alert" className="error-message">
                        {errors.brazalete}
                      </small>
                    )}
                  </div>
                </div>
              </fieldset>

              <fieldset className="registro-fieldset">
                <legend className="registro-legend">Información de Contacto</legend>

                <div className="registro-grid">
                  {/* Email */}
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Correo Electrónico *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder={placeholders.email}
                      value={data.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
                      aria-invalid={!!errors.email || emailStatus === "taken"}
                      className={`form-input ${errors.email || emailStatus === "taken" ? "input-error" : ""}`}
                      required
                    />
                    <div className="email-status">
                      {emailStatus === "checking" && (
                        <small className="checking">Verificando disponibilidad…</small>
                      )}
                      {emailStatus === "ok" && data.email && (
                        <small className="success">✓ Correo disponible</small>
                      )}
                      {emailStatus === "invalid" && (
                        <small role="alert" className="error">
                          Formato de correo inválido
                        </small>
                      )}
                      {emailStatus === "taken" && (
                        <small role="alert" className="error">
                          Este correo ya fue registrado
                        </small>
                      )}
                    </div>
                    {touched.email && errors.email && (
                      <small role="alert" className="error-message">
                        {errors.email}
                      </small>
                    )}
                  </div>

                  {/* Teléfono */}
                  <div className="form-group">
                    <label htmlFor="telefono" className="form-label">
                      Teléfono *
                    </label>
                    <input
                      id="telefono"
                      name="telefono"
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]{10}"
                      placeholder={placeholders.telefono}
                      value={data.telefono}
                      onChange={(e) => handleChange("telefono", e.target.value)}
                      onBlur={() => handleBlur("telefono")}
                      aria-invalid={!!errors.telefono}
                      className={`form-input ${errors.telefono ? "input-error" : ""}`}
                      required
                    />
                    {touched.telefono && errors.telefono && (
                      <small role="alert" className="error-message">
                        {errors.telefono}
                      </small>
                    )}
                  </div>
                </div>
              </fieldset>

              <fieldset className="registro-fieldset">
                <legend className="registro-legend">Información Académica</legend>

                <div className="registro-grid">
                  {/* Categoría */}
                  <div className="form-group">
                    <label htmlFor="categoria" className="form-label">
                      Categoría del Participante *
                    </label>
                    <select
                      id="categoria"
                      name="categoria"
                      value={data.categoria}
                      onChange={(e) =>
                        handleChange("categoria", e.target.value as Categoria | "")
                      }
                      onBlur={() => handleBlur("categoria")}
                      aria-invalid={!!errors.categoria}
                      className={`form-select ${errors.categoria ? "input-error" : ""}`}
                      required
                    >
                      <option value="">Selecciona una categoría</option>
                      <option value="Estudiante">Estudiante</option>
                      <option value="Ponente">Ponente</option>
                      <option value="Asistente externo">Asistente externo</option>
                    </select>
                    {touched.categoria && errors.categoria && (
                      <small role="alert" className="error-message">
                        {errors.categoria}
                      </small>
                    )}
                  </div>

                  {/* Programa educativo (solo Estudiante) */}
                  {isEstudiante && (
                    <div className="form-group">
                      <label htmlFor="programa" className="form-label">
                        Programa Educativo *
                      </label>
                      <select
                        id="programa"
                        name="programa"
                        value={data.programa}
                        onChange={(e) =>
                          handleChange("programa", e.target.value as Programa | "")
                        }
                        onBlur={() => handleBlur("programa")}
                        aria-invalid={!!errors.programa}
                        className={`form-select ${errors.programa ? "input-error" : ""}`}
                        required={isEstudiante}
                      >
                        <option value="">Selecciona un programa</option>
                        {programas.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                      {touched.programa && errors.programa && (
                        <small role="alert" className="error-message">
                          {errors.programa}
                        </small>
                      )}
                    </div>
                  )}
                </div>
              </fieldset>

              <div className="form-submit">
                <button
                  type="submit"
                  className={`submit-button ${isSubmitting ? "submitting" : ""}`}
                  disabled={isSubmitting || emailStatus === "checking" || brazaleteStatus === "checking"}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Enviando...
                    </>
                  ) : (
                    "Enviar Registro"
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h2>¡Registro Exitoso!</h2>
            <p>
              Gracias por registrarte. Serás redirigido a la página de inicio en
              unos segundos...
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RegistroComponent;