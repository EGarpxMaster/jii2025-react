import React, { useMemo, useState } from "react";

const API_URL = "/api/registro";

type Categoria = "Estudiante" | "Ponente" | "Asistente externo";
type Programa =
  | "Ingeniería Industrial"
  | "Ingeniería en Datos"
  | "Ingeniería Ambiental";

type FormData = {
  apellidoPaterno: string;
  apellidoMaterno: string;
  primerNombre: string;
  segundoNombre?: string;
  email: string;
  telefono: string;
  categoria: Categoria | "";
  programa?: Programa | "";
};

type Errors = Partial<Record<keyof FormData, string>>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

const programas: Programa[] = [
  "Ingeniería Industrial",
  "Ingeniería en Datos",
  "Ingeniería Ambiental",
];

const RegistroParticipanteForm: React.FC = () => {
  const [data, setData] = useState<FormData>({
    apellidoPaterno: "",
    apellidoMaterno: "",
    primerNombre: "",
    segundoNombre: "",
    email: "",
    telefono: "",
    categoria: "",
    programa: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "checking" | "ok" | "taken" | "invalid"
  >("idle");
  const [submitted, setSubmitted] = useState(false);

  const isEstudiante = data.categoria === "Estudiante";

  const placeholders = useMemo(
    () => ({
      apellidoPaterno: "Apellido paterno",
      apellidoMaterno: "Apellido materno",
      primerNombre: "Primer nombre",
      segundoNombre: "Segundo nombre",
      email: "Correo electrónico",
      telefono: "Teléfono",
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
      return next;
    });
  }

  function handleBlur(field: keyof FormData) {
    console.log(`[DEBUG] Campo blur: ${field}`);
    setTouched((t) => ({ ...t, [field]: true }));
    // Validación inmediata del campo
    const newErrors = validate({ ...data });
    setErrors(newErrors);

    // Checar email único al salir del campo
    if (field === "email") {
      console.log(`[DEBUG] Verificando email: ${data.email}`);
      void verifyEmailUnique();
    }
  }

  async function checkEmailUnique(email: string): Promise<boolean> {
    try {
      console.log(`[DEBUG] Checking email unique: ${email}`);
      const url = `${API_URL}?action=check-email&email=${encodeURIComponent(
        email
      )}`;
      console.log(`[DEBUG] URL: ${url}`);
      
      const res = await fetch(url, { credentials: "include" });
      console.log(`[DEBUG] Response status: ${res.status}`);
      
      if (!res.ok) {
        console.log(`[DEBUG] Response not OK: ${res.status} ${res.statusText}`);
        return true; // No bloquear si backend no responde correctamente
      }
      
      const json = await res.json();
      console.log(`[DEBUG] Response JSON:`, json);
      return !!json.unique;
    } catch (error) {
      console.error(`[DEBUG] Error checking email:`, error);
      return true; // Evitar bloquear por fallas de red
    }
  }

  async function verifyEmailUnique() {
    const email = data.email.trim();
    if (!emailRegex.test(email)) {
      console.log(`[DEBUG] Email inválido: ${email}`);
      setEmailStatus("invalid");
      return;
    }
    setEmailStatus("checking");
    const unique = await checkEmailUnique(email);
    console.log(`[DEBUG] Email unique result: ${unique}`);
    setEmailStatus(unique ? "ok" : "taken");
  }

  function validate(values: FormData): Errors {
    const e: Errors = {};
    if (!values.apellidoPaterno.trim()) e.apellidoPaterno = "Obligatorio.";
    if (!values.apellidoMaterno.trim()) e.apellidoMaterno = "Obligatorio.";
    if (!values.primerNombre.trim()) e.primerNombre = "Obligatorio.";

    const email = values.email.trim();
    if (!email) e.email = "Obligatorio.";
    else if (!emailRegex.test(email)) e.email = "Formato de correo inválido.";

    const tel = values.telefono.trim();
    if (!tel) e.telefono = "Obligatorio.";
    else if (!/^\d{10}$/.test(tel))
      e.telefono = "Deben ser exactamente 10 dígitos.";

    if (!values.categoria) e.categoria = "Selecciona una categoría.";

    if (values.categoria === "Estudiante") {
      if (!values.programa) e.programa = "Selecciona un programa.";
    }
    return e;
  }

  async function handleSubmit(ev: React.FormEvent) {
  console.log(`[DEBUG] ========== INICIO DE SUBMIT ==========`);
  ev.preventDefault();
  
  console.log(`[DEBUG] Datos del formulario:`, data);
  
  // Solo marcar como touched los campos que son relevantes según la categoría
  const touchedFields: Record<string, boolean> = {
    apellidoPaterno: true,
    apellidoMaterno: true,
    primerNombre: true,
    segundoNombre: true,
    email: true,
    telefono: true,
    categoria: true,
  };

  // Solo incluir programa si es estudiante
  if (data.categoria === "Estudiante") {
    touchedFields.programa = true;
  }

  setTouched(touchedFields);

  const newErrors = validate(data);
  console.log(`[DEBUG] Errores de validación:`, newErrors);
  setErrors(newErrors);
  
  if (Object.keys(newErrors).length > 0) {
    console.log(`[DEBUG] Hay errores, no enviando formulario`);
    return;
  }

  // Verificar unicidad de email en backend
  console.log(`[DEBUG] Verificando email único antes de enviar...`);
  const unique = await checkEmailUnique(data.email);
  if (!unique) {
    console.log(`[DEBUG] Email ya existe, no enviando`);
    setEmailStatus("taken");
    setErrors((e) => ({
      ...e,
      email: "Este correo ya fue registrado.",
    }));
    return;
  }

  console.log(`[DEBUG] Iniciando envío al servidor...`);
  setIsSubmitting(true);
  
  try {
    // Crear payload limpio - excluir programa si no es estudiante
    const payload = data.categoria === "Estudiante" 
      ? data 
      : { ...data, programa: undefined };
      
    const payloadJson = JSON.stringify(payload);
    console.log(`[DEBUG] Payload:`, payloadJson);
    console.log(`[DEBUG] URL:`, API_URL);
    
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: payloadJson,
    });

    console.log(`[DEBUG] Response status:`, res.status);
    console.log(`[DEBUG] Response headers:`, res.headers);

    if (res.status === 409) {
      console.log(`[DEBUG] Email duplicado (409)`);
      setEmailStatus("taken");
      setErrors((e) => ({ ...e, email: "Este correo ya fue registrado." }));
      return;
    }

    if (res.status === 422) {
      const errorData = await res.json();
      console.log(`[DEBUG] Errores de validación del servidor (422):`, errorData);
      setErrors(errorData.errors || {});
      return;
    }

    if (!res.ok) {
      const errorText = await res.text();
      console.log(`[DEBUG] Error del servidor:`, errorText);
      try {
        const errorData = JSON.parse(errorText);
        alert(errorData?.error || "Ocurrió un error al enviar. Intenta de nuevo.");
      } catch {
        alert("Ocurrió un error al enviar. Intenta de nuevo.");
      }
      return;
    }

    // Éxito
    const responseData = await res.json();
    console.log(`[DEBUG] Éxito:`, responseData);
    setSubmitted(true);
    setTimeout(() => {
      window.location.href = "/";
    }, 3000);
    
  } catch (err) {
    console.error(`[DEBUG] Error de red:`, err);
    alert("Error de red. Verifica tu conexión.");
  } finally {
    setIsSubmitting(false);
    console.log(`[DEBUG] ========== FIN DE SUBMIT ==========`);
  }
}

  return (
    <section className="form-section">
      <div className="form-container">
        {!submitted ? (
          <>
            <h2>Registro de participante</h2>
            <p className="form-description">
              Completa los campos obligatorios. Si eliges <b>Estudiante</b>, se
              te pedirá seleccionar tu <b>Programa educativo</b>.
            </p>

            <form noValidate onSubmit={handleSubmit}>
              <fieldset>
                <legend>Datos personales</legend>

                {/* Apellido paterno */}
                <div className="form-group">
                  <label htmlFor="apellidoPaterno">Apellido paterno *</label>
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
                    className={errors.apellidoPaterno ? "input-error" : ""}
                    required
                  />
                  {touched.apellidoPaterno && errors.apellidoPaterno && (
                    <small role="alert" style={{ color: "#ff6b6b" }}>
                      {errors.apellidoPaterno}
                    </small>
                  )}
                </div>

                {/* Apellido materno */}
                <div className="form-group">
                  <label htmlFor="apellidoMaterno">Apellido materno *</label>
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
                    className={errors.apellidoMaterno ? "input-error" : ""}
                    required
                  />
                  {touched.apellidoMaterno && errors.apellidoMaterno && (
                    <small role="alert" style={{ color: "#ff6b6b" }}>
                      {errors.apellidoMaterno}
                    </small>
                  )}
                </div>

                {/* Primer nombre */}
                <div className="form-group">
                  <label htmlFor="primerNombre">Primer nombre *</label>
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
                    className={errors.primerNombre ? "input-error" : ""}
                    required
                  />
                  {touched.primerNombre && errors.primerNombre && (
                    <small role="alert" style={{ color: "#ff6b6b" }}>
                      {errors.primerNombre}
                    </small>
                  )}
                </div>

                {/* Segundo nombre */}
                <div className="form-group">
                  <label htmlFor="segundoNombre">Segundo nombre</label>
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
                  />
                </div>
              </fieldset>

              <fieldset>
                <legend>Contacto</legend>

                {/* Email */}
                <div className="form-group">
                  <label htmlFor="email">Correo electrónico *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={placeholders.email}
                    value={data.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    aria-invalid={!!errors.email || emailStatus === "taken"}
                    className={
                      errors.email || emailStatus === "taken"
                        ? "input-error"
                        : ""
                    }
                    required
                  />
                  <div style={{ marginTop: "0.35rem" }}>
                    {emailStatus === "checking" && (
                      <small>Verificando disponibilidad…</small>
                    )}
                    {emailStatus === "ok" && data.email && (
                      <small style={{ color: "green" }}>
                        Correo disponible.
                      </small>
                    )}
                    {emailStatus === "invalid" && (
                      <small role="alert" style={{ color: "#ff6b6b" }}>
                        Formato de correo inválido.
                      </small>
                    )}
                    {emailStatus === "taken" && (
                      <small role="alert" style={{ color: "#ff6b6b" }}>
                        Este correo ya fue registrado.
                      </small>
                    )}
                  </div>
                  {touched.email && errors.email && (
                    <small role="alert" style={{ color: "#ff6b6b" }}>
                      {errors.email}
                    </small>
                  )}
                </div>

                {/* Teléfono */}
                <div className="form-group">
                  <label htmlFor="telefono">Teléfono (10 dígitos) *</label>
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
                    className={errors.telefono ? "input-error" : ""}
                    required
                  />
                  {touched.telefono && errors.telefono && (
                    <small role="alert" style={{ color: "#ff6b6b" }}>
                      {errors.telefono}
                    </small>
                  )}
                </div>
              </fieldset>

              <fieldset>
                <legend>Categoría</legend>

                {/* Categoría */}
                <div className="form-group">
                  <label htmlFor="categoria">Categoría del participante *</label>
                  <select
                    id="categoria"
                    name="categoria"
                    value={data.categoria}
                    onChange={(e) =>
                      handleChange("categoria", e.target
                        .value as Categoria | "")
                    }
                    onBlur={() => handleBlur("categoria")}
                    aria-invalid={!!errors.categoria}
                    className={errors.categoria ? "input-error" : ""}
                    required
                  >
                    <option value="">Selecciona una opción…</option>
                    <option value="Estudiante">Estudiante</option>
                    <option value="Ponente">Ponente</option>
                    <option value="Asistente externo">Asistente externo</option>
                  </select>
                  {touched.categoria && errors.categoria && (
                    <small role="alert" style={{ color: "#ff6b6b" }}>
                      {errors.categoria}
                    </small>
                  )}
                </div>

                {/* Programa educativo (solo Estudiante) */}
                {isEstudiante && (
                  <div className="form-group">
                    <label htmlFor="programa">Programa educativo *</label>
                    <select
                      id="programa"
                      name="programa"
                      value={data.programa}
                      onChange={(e) =>
                        handleChange("programa", e.target.value as Programa | "")
                      }
                      onBlur={() => handleBlur("programa")}
                      aria-invalid={!!errors.programa}
                      className={errors.programa ? "input-error" : ""}
                      required={isEstudiante}
                    >
                      <option value="">Selecciona una opción…</option>
                      {programas.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    {touched.programa && errors.programa && (
                      <small role="alert" style={{ color: "#ff6b6b" }}>
                        {errors.programa}
                      </small>
                    )}
                  </div>
                )}
              </fieldset>

              <div className="form-group">
                <input
                  type="submit"
                  value={isSubmitting ? "Enviando…" : "Enviar registro"}
                  disabled={isSubmitting || emailStatus === "checking"}
                />
              </div>
            </form>
          </>
        ) : (
          <>
            <h2>¡Registro enviado!</h2>
            <p className="form-description" style={{ textAlign: "center" }}>
              Gracias por registrarte. Serás redirigido a la página de inicio en
              3 segundos…
            </p>
          </>
        )}
      </div>
    </section>
  );
};

export default RegistroParticipanteForm;