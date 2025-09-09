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

const chip = (text: string, color: "ok" | "warn" | "err" | "info" = "info") => {
  const base = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold";
  const map = {
    ok: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    warn: "bg-amber-100 text-amber-700 border border-amber-200",
    err: "bg-rose-100 text-rose-700 border border-rose-200",
    info: "bg-cyan-100 text-cyan-700 border border-cyan-200",
  } as const;
  return <span className={`${base} ${map[color]}`}>{text}</span>;
};

const Skeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-10 bg-slate-200 rounded-lg"></div>
    <div className="h-24 bg-slate-200 rounded-lg"></div>
    <div className="h-16 bg-slate-200 rounded-lg"></div>
  </div>
);

const ConstanciaPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle"|"typing"|"checking"|"notfound"|"found"|"invalid">("idle");
  const [verificacion, setVerificacion] = useState<VerificacionData | null>(null);
  const [descargando, setDescargando] = useState(false);

  // Debounce + verificación
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
    const t = setTimeout(async () => {
      setStatus("checking");
      try {
        const res = await fetch(
          `${API_BASE}/constancia/verificar?email=${encodeURIComponent(email)}`,
          { credentials: "include" }
        );

        if (res.status === 404) {
          setVerificacion(null);
          setStatus("notfound");
          return;
        }
        if (!res.ok) throw new Error("Error verificando participante");

        const data: VerificacionData = await res.json();
        setVerificacion(data);
        setStatus("found");
      } catch (e) {
        console.error(e);
        setStatus("invalid");
        setVerificacion(null);
      }
    }, 700);

    return () => clearTimeout(t);
  }, [email]);

  const descargarConstancia = async () => {
    if (!verificacion) return;
    setDescargando(true);
    try {
      const res = await fetch(
        `${API_BASE}/constancia/generar?email=${encodeURIComponent(email)}`,
        { credentials: "include" }
      );
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        alert(errorData?.error || "Error generando constancia");
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `constancia-${verificacion.participante.primerNombre}-${verificacion.participante.apellidoPaterno}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (e) {
      console.error(e);
      alert("Error de red al descargar constancia");
    } finally {
      setDescargando(false);
    }
  };

  return (
    <main className="w-full">
      {/* Fondo degradado con patrón sutil (misma vibra que el sitio) */}
      <section className="registro-section">
        <div className="registro-container">
          <div className="registro-header">
            <h2>Constancias</h2>
            <p className="registro-description">
              Ingresa tu correo registrado para verificar tu elegibilidad y descargar tu constancia.
            </p>
          </div>

            {/* Formulario */}
            <div className="mt-8">
              <label
                htmlFor="emailLookup"
                className="mb-2 block font-semibold text-gray-800 historia-text-base"
              >
                Correo electrónico
              </label>

              <div className={`relative`}>
                <input
                  id="emailLookup"
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  className={[
                    "w-full rounded-xl border-2 px-4 py-3 text-base outline-none transition",
                    status === "invalid"
                      ? "border-rose-400 focus:border-rose-500"
                      : "border-slate-200 focus:border-[#00d4d4]"
                  ].join(" ")}
                  aria-invalid={status === "invalid"}
                  aria-describedby="email-help"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {status === "checking" && chip("Verificando…", "info")}
                  {status === "invalid" && email && chip("Formato inválido", "err")}
                  {status === "notfound" && chip("No encontrado", "err")}
                  {status === "found" && verificacion && (verificacion.puedeObtenerConstancia
                    ? chip("Elegible", "ok")
                    : chip("Sin asistencias", "warn"))}
                </div>
              </div>
              <small id="email-help" className="mt-2 block text-gray-500">
                Usa el correo con el que te registraste en el evento.
              </small>
            </div>

            {/* Resultado de verificación */}
            <div className="mt-8">
              {status === "checking" && <Skeleton />}

              {verificacion && status === "found" && (
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  {/* Datos del participante */}
                  <div
                    className={[
                      "border-b px-5 py-4",
                      verificacion.puedeObtenerConstancia ? "bg-emerald-50" : "bg-amber-50"
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="historia-h3 m-0 text-[#1b1c39]">👤 Participante</h3>
                      {verificacion.puedeObtenerConstancia
                        ? chip("ELEGIBLE", "ok")
                        : chip("FALTA ASISTENCIA", "warn")}
                    </div>
                    <div className="mt-2 grid gap-1 text-sm sm:text-base text-gray-700">
                      <div>
                        <strong>Nombre:</strong>{" "}
                        {verificacion.participante.primerNombre}{" "}
                        {verificacion.participante.segundoNombre || ""}{" "}
                        {verificacion.participante.apellidoPaterno}{" "}
                        {verificacion.participante.apellidoMaterno}
                      </div>
                      <div>
                        <strong>Categoría:</strong> {verificacion.participante.categoria}
                        {verificacion.participante.categoria === "Estudiante" &&
                          verificacion.participante.programa && (
                            <span> — {verificacion.participante.programa}</span>
                          )}
                      </div>
                      <div>
                        <strong>Email:</strong> {verificacion.participante.email}
                      </div>
                    </div>
                  </div>

                  {/* Lista de asistencias */}
                  {verificacion.asistencias.length > 0 ? (
                    <div className="px-5 py-5">
                      <h4 className="mb-3 flex items-center gap-2 text-[#1b1c39] historia-h3">
                        📋 Conferencias asistidas ({verificacion.asistencias.length})
                      </h4>
                      <ol className="relative border-s border-slate-200 ps-5 space-y-4">
                        {verificacion.asistencias.map((a, i) => (
                          <li key={i} className="ms-4">
                            <div className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full bg-[#00d4d4] ring-4 ring-white" />
                            <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
                              <div className="font-semibold text-[#1b1c39]">{a.titulo}</div>
                              <div className="text-sm text-gray-600">
                                {a.ponente && <>👨‍🏫 {a.ponente} • </>}
                                📅{" "}
                                {new Date(a.fecha).toLocaleDateString("es-MX", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                                {a.lugar && <> • 📍 {a.lugar}</>}
                              </div>
                              <div className="mt-1 text-xs text-emerald-600">
                                ✅ Registrada el {new Date(a.fechaAsistencia).toLocaleDateString("es-MX")}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ) : (
                    <div className="px-5 py-10 text-center">
                      <div className="text-5xl mb-2">📋</div>
                      <h4 className="text-[#1b1c39] historia-h3 mb-1">Sin asistencias registradas</h4>
                      <p className="text-gray-600">
                        Para obtener tu constancia, registra al menos una asistencia.
                      </p>
                      <a
                        href="/asistencia"
                        className="mt-4 inline-flex items-center rounded-xl bg-[#00d4d4] px-4 py-2 font-semibold text-white transition hover:translate-y-[-2px]"
                      >
                        Registrar asistencia
                        <svg className="ml-2 h-4 w-4" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14" />
                          <path d="M12 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              )}

              {!verificacion && status === "idle" && (
                <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">
                  <div className="text-6xl">🏆</div>
                  <h3 className="historia-h3 mt-2 text-[#1b1c39]">
                    ¿Listo para obtener tu constancia?
                  </h3>
                  <p className="mt-1 text-gray-600">
                    Verifica tu correo y descarga tu PDF si cumples los requisitos.
                  </p>
                  <div className="mx-auto mt-5 max-w-md rounded-lg border border-slate-200 bg-white p-4 text-left">
                    <strong>Requisitos:</strong>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
                      <li>Estar registrado como participante</li>
                      <li>Al menos una asistencia confirmada</li>
                      <li>Datos completos en el sistema</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* CTA Descarga */}
            {verificacion?.puedeObtenerConstancia && (
              <div className="mt-8 text-center">
                <button
                  onClick={descargarConstancia}
                  disabled={descargando}
                  className="submit-button mb-4"
                >
                  {descargando ? "⏳ Generando constancia…" : "📄 Descargar Constancia PDF"}
                </button>
                
              </div>
            )}

            {/* No elegible CTA */}
            {verificacion && !verificacion.puedeObtenerConstancia && (
              <div className="mt-6 rounded-xl border-2 border-amber-300 bg-amber-50 p-6 text-center">
                <div className="text-4xl mb-2">⚠️</div>
                <h3 className="historia-h3 text-[#1b1c39] mb-1">Constancia no disponible</h3>
                <p className="text-gray-700 mb-3">
                  Registra tu asistencia para habilitar la descarga.
                </p>
                <a
                  href="/asistencia"
                  className="inline-flex items-center rounded-xl bg-[#1b1c39] px-4 py-2 font-semibold text-white transition hover:translate-y-[-2px]"
                >
                  📋 Registrar asistencia
                </a>
              </div>
            )}
          </div>
      </section>
    </main>
  );
};

export default ConstanciaPage;
