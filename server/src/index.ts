import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { z } from "zod";
import mysql from "mysql2";
import path from "path";
import fs from "fs";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

dotenv.config();

// Crear una conexión a la base de datos MySQL
const db = mysql.createConnection({
 host: process.env.DB_HOST,
 user: process.env.DB_USER,
 password: process.env.DB_PASSWORD,
 database: process.env.DB_NAME,
});

// Conectar a la base de datos
db.connect((err) => {
 if (err) {
  console.error("Error de conexión a la base de datos:", err);
 } else {
  console.log("Conectado a la base de datos MySQL");
 }
});

// Configuración de Express
const app = express();

// Middlewares
app.use(express.json());
app.use(
 cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
 })
);

// Servir archivos estáticos (para las constancias generadas)
app.use('/constancias', express.static(path.join(process.cwd(), 'src/uploads')));

// Esquemas de validación (Zod)
const RegistroSchema = z.object({
 apellidoPaterno: z.string().min(1, "Obligatorio"),
 apellidoMaterno: z.string().min(1, "Obligatorio"),
 primerNombre: z.string().min(1, "Obligatorio"),
 segundoNombre: z.string().optional(),
 email: z.string().email("Correo inválido"),
 telefono: z.string().regex(/^\d{10}$/, "Debe tener 10 dígitos"),
 categoria: z.enum(["Estudiante", "Ponente", "Asistente externo"]),
 programa: z
  .enum(["Ingeniería Industrial", "Ingeniería Ambiental", "Ingeniería en Datos e Inteligencia Organizacional",
  "Ingeniería en Logística y Cadena de Suministro", "Ingeniería en Inteligencia Artificial Nuevo", "Ingeniería en Industrias Alimentarias"])
  .optional(),
});

const AsistenciaSchema = z.object({
 email: z.string().email("Correo inválido"),
 conferenciaId: z.number().int().positive("ID de conferencia inválido"),
});

// Funciones helper
const checkEmailExists = (email: string): Promise<boolean> => {
 return new Promise((resolve, reject) => {
  const query = "SELECT COUNT(*) as count FROM participantes WHERE email = ?";
  db.query(query, [email], (err, results: any[]) => {
   if (err) {
    reject(err);
   } else {
    resolve(results[0].count > 0);
   }
  });
 });
};

const getParticipantByEmail = (email: string): Promise<any | null> => {
 return new Promise((resolve, reject) => {
  const query = `
   SELECT id, apellido_paterno as apellidoPaterno, apellido_materno as apellidoMaterno, 
     primer_nombre as primerNombre, segundo_nombre as segundoNombre, 
     email, telefono, categoria, programa
   FROM participantes 
   WHERE email = ?`;
  
  db.query(query, [email], (err, results: any[]) => {
   if (err) {
    reject(err);
   } else {
    resolve(results.length > 0 ? results[0] : null);
   }
  });
 });
};

// MODIFICADO: Se usa fecha_inicio y fecha_fin, y se filtra por activa = true
const getAllConferencias = (): Promise<any[]> => {
 return new Promise((resolve, reject) => {
  const query = `
   SELECT 
    id, titulo, ponente, 
    fecha_inicio as fechaInicio, 
    fecha_fin as fechaFin, 
    lugar
   FROM conferencias 
   WHERE activa = TRUE
   ORDER BY fecha_inicio ASC`;
  
  db.query(query, [], (err, results: any[]) => {
   if (err) {
    reject(err);
   } else {
    resolve(results);
   }
  });
 });
};

const getAsistenciasByEmail = (email: string): Promise<any[]> => {
 return new Promise((resolve, reject) => {
  const query = `
   SELECT a.conferencia_id as conferenciaId, a.creado, a.modo
   FROM asistencias a
   INNER JOIN participantes p ON a.participante_id = p.id
   WHERE p.email = ?`;
  
  db.query(query, [email], (err, results: any[]) => {
   if (err) {
    reject(err);
   } else {
    resolve(results);
   }
  });
 });
};

// MODIFICADO: Se usa fecha_inicio en la consulta
const getAsistenciasWithConferencias = (email: string): Promise<any[]> => {
 return new Promise((resolve, reject) => {
  const query = `
   SELECT c.titulo, c.ponente, c.fecha_inicio as fechaInicio, c.lugar, a.creado as fechaAsistencia
   FROM asistencias a
   INNER JOIN participantes p ON a.participante_id = p.id
   INNER JOIN conferencias c ON a.conferencia_id = c.id
   WHERE p.email = ?
   ORDER BY c.fecha_inicio ASC`;
  
  db.query(query, [email], (err, results: any[]) => {
   if (err) {
    reject(err);
   } else {
    resolve(results);
   }
  });
 });
};

const checkAsistenciaExists = (participanteId: number, conferenciaId: number): Promise<boolean> => {
 return new Promise((resolve, reject) => {
  const query = "SELECT COUNT(*) as count FROM asistencias WHERE participante_id = ? AND conferencia_id = ?";
  db.query(query, [participanteId, conferenciaId], (err, results: any[]) => {
   if (err) {
    reject(err);
   } else {
    resolve(results[0].count > 0);
   }
  });
 });
};

// Función para generar PDF de constancia
async function generarConstanciaPDF(participante: any, asistencias: any[]): Promise<Buffer> {
 try {
  // Cargar la plantilla PDF
  const templatePath = path.join(process.cwd(), 'src/templates/constancia-template.pdf');
  const templateBytes = fs.readFileSync(templatePath);
  
  // Cargar el documento PDF
  const pdfDoc = await PDFDocument.load(templateBytes);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  
  // Obtener dimensiones de la página
  const { width, height } = firstPage.getSize();
  
  // Configurar fuente
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Nombre completo del participante
  const nombreCompleto = `${participante.primerNombre} ${participante.segundoNombre || ""} ${participante.apellidoPaterno} ${participante.apellidoMaterno}`.trim().toUpperCase();
  
  // Escribir SOLO el nombre en el PDF (ajusta las coordenadas según tu plantilla)
  firstPage.drawText(nombreCompleto, {
   x: width / 2 - (nombreCompleto.length * 8.5), // Centrado aproximado
   y: height * 0.515, // Ajusta según tu plantilla - COORDENADA Y PRINCIPAL
   size: 30,
   font: font,
   color: rgb(27/255, 28/255, 57/255),
  });
  
  // Serializar el PDF
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
  
 } catch (error) {
  console.error("Error generando PDF:", error);
  throw new Error("Error al generar la constancia PDF");
 }
}

// === RUTAS EXISTENTES ===

// Ruta para verificar disponibilidad de email (GET)
app.get("/api/registro", async (req, res) => {
 const { action, email } = req.query;

 if (action === "check-email" && email) {
  try {
   const emailExists = await checkEmailExists(email as string);
   return res.json({ unique: !emailExists });
  } catch (error) {
   console.error("Error checking email:", error);
   return res.status(500).json({ error: "Error verificando email" });
  }
 }

 return res.status(400).json({ error: "Acción o parámetros inválidos" });
});

// Ruta para registrar participante (POST)
app.post("/api/registro", async (req, res) => {
 try {
  const parsed = RegistroSchema.safeParse(req.body);
  if (!parsed.success) {
   const fieldErrors: Record<string, string> = {};
   
   parsed.error.errors.forEach((err) => {
    const field = err.path[0] as string;
    fieldErrors[field] = err.message;
   });

   return res.status(422).json({
    error: "Datos de validación incorrectos",
    errors: fieldErrors,
   });
  }

  const { 
   apellidoPaterno, 
   apellidoMaterno, 
   primerNombre, 
   segundoNombre, 
   email, 
   telefono, 
   categoria, 
   programa 
  } = parsed.data;

  const emailExists = await checkEmailExists(email);
  if (emailExists) {
   return res.status(409).json({ error: "El correo ya fue registrado" });
  }

  const insertQuery = `
   INSERT INTO participantes (apellido_paterno, apellido_materno, primer_nombre, segundo_nombre, email, telefono, categoria, programa)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(insertQuery, [
   apellidoPaterno,
   apellidoMaterno,
   primerNombre,
   segundoNombre || null,
   email,
   telefono,
   categoria,
   programa || null,
  ], (insertErr, insertResults) => {
   if (insertErr) {
    console.error("Error al insertar:", insertErr);
    return res.status(500).json({
     error: "Ocurrió un error al registrar al participante",
    });
   }

   return res.status(201).json({
    message: "Registro exitoso",
    data: insertResults,
   });
  });

 } catch (error) {
  console.error("Error en POST /api/registro:", error);
  return res.status(500).json({
   error: "Error interno del servidor",
  });
 }
});

// === RUTAS PARA ASISTENCIA ===

// Obtener participante por email
app.get("/api/participante", async (req, res) => {
 const { email } = req.query;

 if (!email || typeof email !== "string") {
  return res.status(400).json({ error: "Email requerido" });
 }

 try {
  const participante = await getParticipantByEmail(email);
  
  if (!participante) {
   return res.status(404).json({ error: "Participante no encontrado" });
  }

  return res.json(participante);
 } catch (error) {
  console.error("Error obteniendo participante:", error);
  return res.status(500).json({ error: "Error interno del servidor" });
 }
});

// Obtener todas las conferencias
app.get("/api/conferencias", async (req, res) => {
 try {
  const conferencias = await getAllConferencias();
  return res.json(conferencias);
 } catch (error) {
  console.error("Error obteniendo conferencias:", error);
  return res.status(500).json({ error: "Error interno del servidor" });
 }
});

// Obtener asistencias de un participante por email
app.get("/api/asistencias", async (req, res) => {
 const { email } = req.query;

 if (!email || typeof email !== "string") {
  return res.status(400).json({ error: "Email requerido" });
 }

 try {
  const asistencias = await getAsistenciasByEmail(email);
  return res.json(asistencias);
 } catch (error) {
  console.error("Error obteniendo asistencias:", error);
  return res.status(500).json({ error: "Error interno del servidor" });
 }
});

// Registrar asistencia
app.post("/api/asistencias", async (req, res) => {
 try {
  const parsed = AsistenciaSchema.safeParse(req.body);
  if (!parsed.success) {
   const fieldErrors: Record<string, string> = {};
   
   parsed.error.errors.forEach((err) => {
    const field = err.path[0] as string;
    fieldErrors[field] = err.message;
   });

   return res.status(422).json({
    error: "Datos de validación incorrectos",
    errors: fieldErrors,
   });
  }

  const { email, conferenciaId } = parsed.data;

  const participante = await getParticipantByEmail(email);
  if (!participante) {
   return res.status(404).json({ error: "Participante no encontrado" });
  }

  const conferencias = await getAllConferencias();
  const conferencia = conferencias.find(c => c.id === conferenciaId);
  if (!conferencia) {
   return res.status(404).json({ error: "Conferencia no encontrada" });
  }

  // --- INICIO DE LA MODIFICACIÓN ---
  // Verificar si la conferencia está activa para registro
  const ahora = new Date();
  const fechaInicio = new Date(conferencia.fechaInicio);
  const fechaFin = new Date(conferencia.fechaFin);

  if (ahora < fechaInicio || ahora > fechaFin) {
    return res.status(403).json({ error: "La inscripción para esta conferencia no está disponible en este momento." });
  }
  // --- FIN DE LA MODIFICACIÓN ---

  const yaExiste = await checkAsistenciaExists(participante.id, conferenciaId);
  if (yaExiste) {
   return res.status(409).json({ error: "Ya se registró asistencia para esta conferencia" });
  }

  const insertQuery = `
   INSERT INTO asistencias (participante_id, conferencia_id, creado, modo)
   VALUES (?, ?, NOW(), 'self')`;

  db.query(insertQuery, [participante.id, conferenciaId], (insertErr, insertResults) => {
   if (insertErr) {
    console.error("Error al insertar asistencia:", insertErr);
    return res.status(500).json({
     error: "Ocurrió un error al registrar la asistencia",
    });
   }

   return res.status(201).json({
    message: "Asistencia registrada exitosamente",
    data: {
     conferenciaId,
     participanteId: participante.id,
     creado: new Date().toISOString(),
     modo: 'self'
    },
   });
  });

 } catch (error) {
  console.error("Error en POST /api/asistencias:", error);
  return res.status(500).json({
   error: "Error interno del servidor",
  });
 }
});

// === RUTAS PARA CONSTANCIAS ===

// Verificar si un participante puede obtener constancia
app.get("/api/constancia/verificar", async (req, res) => {
 const { email } = req.query;

 if (!email || typeof email !== "string") {
  return res.status(400).json({ error: "Email requerido" });
 }

 try {
  const participante = await getParticipantByEmail(email);
  if (!participante) {
   return res.status(404).json({ error: "Participante no encontrado" });
  }

  const asistencias = await getAsistenciasWithConferencias(email);
  
  return res.json({
   participante,
   asistencias,
   puedeObtenerConstancia: asistencias.length > 0
  });

 } catch (error) {
  console.error("Error verificando constancia:", error);
  return res.status(500).json({ error: "Error interno del servidor" });
 }
});

// Generar y descargar constancia
app.get("/api/constancia/generar", async (req, res) => {
 const { email } = req.query;

 if (!email || typeof email !== "string") {
  return res.status(400).json({ error: "Email requerido" });
 }

 try {
  const participante = await getParticipantByEmail(email);
  if (!participante) {
   return res.status(404).json({ error: "Participante no encontrado" });
  }

  const asistencias = await getAsistenciasWithConferencias(email);
  if (asistencias.length === 0) {
   return res.status(400).json({ error: "No tienes asistencias registradas" });
  }

  // Generar PDF
  const pdfBuffer = await generarConstanciaPDF(participante, asistencias);
  
  // Configurar headers para descarga
  const nombreArchivo = `constancia-${participante.primerNombre}-${participante.apellidoPaterno}.pdf`;
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
  res.setHeader('Content-Length', pdfBuffer.length);
  
  return res.send(pdfBuffer);

 } catch (error) {
  console.error("Error generando constancia:", error);
  return res.status(500).json({ error: "Error generando constancia" });
 }
});

// === RUTAS GENERALES ===

// Ruta de prueba
app.get("/", (req, res) => {
 res.json({ message: "API de registro, asistencia y constancias funcionando correctamente" });
});

// Manejo de rutas no encontradas
app.use("*", (req, res) => {
 res.status(404).json({ error: "Ruta no encontrada" });
});

// Iniciar el servidor
const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, () => {
 console.log(`🚀 API lista en http://localhost:${PORT}`);
});