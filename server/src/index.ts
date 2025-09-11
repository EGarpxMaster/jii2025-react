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
  "Ingeniería en Logística y Cadena de Suministro", "Ingeniería en Inteligencia Artificial", "Ingeniería en Industrias Alimentarias"])
  .optional(),
});

const AsistenciaSchema = z.object({
 email: z.string().email("Correo inválido"),
 conferenciaId: z.number().int().positive("ID de conferencia inválido"),
});

const EquipoSchema = z.object({
 nombreEquipo: z.string().min(1, "Nombre del equipo obligatorio").max(255, "Nombre muy largo"),
 emailCapitan: z.string().email("Correo del capitán inválido"),
 emailsMiembros: z.array(z.string().email("Correo de miembro inválido"))
   .min(5, "Debe tener exactamente 5 miembros adicionales")
   .max(5, "Debe tener exactamente 5 miembros adicionales")
   .refine(emails => new Set(emails).size === emails.length, "No pueden haber emails duplicados entre miembros")
});

// Funciones helper existentes
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

// === FUNCIONES HELPER PARA EQUIPOS ===

const checkEquipoNameExists = (nombreEquipo: string): Promise<boolean> => {
 return new Promise((resolve, reject) => {
  const query = "SELECT COUNT(*) as count FROM equipos WHERE nombre_equipo = ? AND activo = TRUE";
  db.query(query, [nombreEquipo], (err, results: any[]) => {
   if (err) {
    reject(err);
   } else {
    resolve(results[0].count > 0);
   }
  });
 });
};

const checkParticipantInAnyTeam = (participanteId: number): Promise<boolean> => {
 return new Promise((resolve, reject) => {
  const query = `
   SELECT COUNT(*) as count 
   FROM miembros_equipo me 
   INNER JOIN equipos e ON me.equipo_id = e.id 
   WHERE me.participante_id = ? AND e.activo = TRUE`;
  db.query(query, [participanteId], (err, results: any[]) => {
   if (err) {
    reject(err);
   } else {
    resolve(results[0].count > 0);
   }
  });
 });
};

const validateParticipantsForTeam = async (emails: string[]): Promise<{valid: boolean, errors: string[], participantes: any[]}> => {
 const errors: string[] = [];
 const participantes: any[] = [];

 // Verificar que todos los emails existan
 for (let i = 0; i < emails.length; i++) {
  const email = emails[i];
  const participante = await getParticipantByEmail(email);
  
  if (!participante) {
   errors.push(`El participante con email ${email} no está registrado`);
   continue;
  }

  // Verificar que sea estudiante
  if (participante.categoria !== "Estudiante") {
   errors.push(`${email}: Solo estudiantes pueden participar en equipos`);
   continue;
  }

  // Verificar que no esté ya en un equipo
  const yaEnEquipo = await checkParticipantInAnyTeam(participante.id);
  if (yaEnEquipo) {
   errors.push(`${email}: Ya está registrado en un equipo`);
   continue;
  }

  participantes.push(participante);
 }

 return { valid: errors.length === 0, errors, participantes };
};

const getEquipoById = (equipoId: number): Promise<any | null> => {
 return new Promise((resolve, reject) => {
  const query = `
   SELECT * FROM vista_equipos_completa WHERE id = ?`;
  
  db.query(query, [equipoId], (err, results: any[]) => {
   if (err) {
    reject(err);
   } else {
    resolve(results.length > 0 ? results[0] : null);
   }
  });
 });
};

const getMiembrosEquipo = (equipoId: number): Promise<any[]> => {
 return new Promise((resolve, reject) => {
  const query = `
   SELECT * FROM vista_miembros_equipo WHERE equipo_id = ? ORDER BY es_capitan DESC, nombre_completo ASC`;
  
  db.query(query, [equipoId], (err, results: any[]) => {
   if (err) {
    reject(err);
   } else {
    resolve(results);
   }
  });
 });
};

const getAllEquipos = (): Promise<any[]> => {
 return new Promise((resolve, reject) => {
  const query = `
   SELECT * FROM vista_equipos_completa ORDER BY creado DESC`;
  
  db.query(query, [], (err, results: any[]) => {
   if (err) {
    reject(err);
   } else {
    resolve(results);
   }
  });
 });
};

const getEquipoByParticipantEmail = (email: string): Promise<any | null> => {
 return new Promise((resolve, reject) => {
  const query = `
   SELECT e.*, vec.nombre_capitan, vec.email_capitan, vec.programa_capitan, vec.total_miembros
   FROM equipos e
   INNER JOIN miembros_equipo me ON e.id = me.equipo_id
   INNER JOIN participantes p ON me.participante_id = p.id
   INNER JOIN vista_equipos_completa vec ON e.id = vec.id
   WHERE p.email = ? AND e.activo = TRUE`;
  
  db.query(query, [email], (err, results: any[]) => {
   if (err) {
    reject(err);
   } else {
    resolve(results.length > 0 ? results[0] : null);
   }
  });
 });
};

// Función para generar PDF de constancia (mantenida igual)
async function generarConstanciaPDF(participante: any, asistencias: any[]): Promise<Buffer> {
 try {
  const templatePath = path.join(process.cwd(), 'src/templates/constancia-template.pdf');
  const templateBytes = fs.readFileSync(templatePath);
  
  const pdfDoc = await PDFDocument.load(templateBytes);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  
  const { width, height } = firstPage.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const nombreCompleto = `${participante.primerNombre} ${participante.segundoNombre || ""} ${participante.apellidoPaterno} ${participante.apellidoMaterno}`.trim().toUpperCase();
  
  firstPage.drawText(nombreCompleto, {
   x: width / 2 - (nombreCompleto.length * 8.5),
   y: height * 0.515,
   size: 30,
   font: font,
   color: rgb(27/255, 28/255, 57/255),
  });
  
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
  
 } catch (error) {
  console.error("Error generando PDF:", error);
  throw new Error("Error al generar la constancia PDF");
 }
}

// === RUTAS EXISTENTES (MANTENIDAS) ===

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

app.get("/api/conferencias", async (req, res) => {
 try {
  const conferencias = await getAllConferencias();
  return res.json(conferencias);
 } catch (error) {
  console.error("Error obteniendo conferencias:", error);
  return res.status(500).json({ error: "Error interno del servidor" });
 }
});

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

  const ahora = new Date();
  const fechaInicio = new Date(conferencia.fechaInicio);
  const fechaFin = new Date(conferencia.fechaFin);

  if (ahora < fechaInicio || ahora > fechaFin) {
    return res.status(403).json({ error: "La inscripción para esta conferencia no está disponible en este momento." });
  }

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

  const pdfBuffer = await generarConstanciaPDF(participante, asistencias);
  
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

// === NUEVAS RUTAS PARA EQUIPOS ===

// Verificar disponibilidad de nombre de equipo
app.get("/api/equipos/check-name", async (req, res) => {
 const { nombre } = req.query;

 if (!nombre || typeof nombre !== "string") {
  return res.status(400).json({ error: "Nombre requerido" });
 }

 try {
  const exists = await checkEquipoNameExists(nombre);
  return res.json({ available: !exists });
 } catch (error) {
  console.error("Error verificando nombre de equipo:", error);
  return res.status(500).json({ error: "Error verificando nombre" });
 }
});

// Verificar si un participante puede unirse a equipos
app.get("/api/equipos/check-participant", async (req, res) => {
 const { email } = req.query;

 if (!email || typeof email !== "string") {
  return res.status(400).json({ error: "Email requerido" });
 }

 try {
  const participante = await getParticipantByEmail(email);
  
  if (!participante) {
   return res.json({ 
    valid: false, 
    error: "Participante no encontrado",
    participante: null 
   });
  }

  if (participante.categoria !== "Estudiante") {
   return res.json({ 
    valid: false, 
    error: "Solo estudiantes pueden participar en equipos",
    participante 
   });
  }

  const yaEnEquipo = await checkParticipantInAnyTeam(participante.id);
  if (yaEnEquipo) {
   return res.json({ 
    valid: false, 
    error: "Ya está registrado en un equipo",
    participante 
   });
  }

  return res.json({ 
   valid: true, 
   error: null,
   participante 
  });

 } catch (error) {
  console.error("Error verificando participante:", error);
  return res.status(500).json({ error: "Error interno del servidor" });
 }
});

// Crear equipo
app.post("/api/equipos", async (req, res) => {
 try {
  const parsed = EquipoSchema.safeParse(req.body);
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

  const { nombreEquipo, emailCapitan, emailsMiembros } = parsed.data;

  // Verificar que el nombre no exista
  const nombreExists = await checkEquipoNameExists(nombreEquipo);
  if (nombreExists) {
   return res.status(409).json({ error: "El nombre del equipo ya existe" });
  }

  // Validar todos los participantes (capitán + miembros)
  const todosEmails = [emailCapitan, ...emailsMiembros];
  
  // Verificar emails únicos
  if (new Set(todosEmails).size !== todosEmails.length) {
   return res.status(400).json({ error: "No pueden haber emails duplicados en el equipo" });
  }

  const validacion = await validateParticipantsForTeam(todosEmails);
  if (!validacion.valid) {
   return res.status(400).json({ 
    error: "Error en la validación de participantes",
    details: validacion.errors 
   });
  }

  // Encontrar el capitán
  const capitan = validacion.participantes.find(p => p.email === emailCapitan);
  if (!capitan) {
   return res.status(400).json({ error: "Error interno: capitán no encontrado" });
  }

  // Iniciar transacción
  db.beginTransaction(async (transactionErr) => {
   if (transactionErr) {
    return res.status(500).json({ error: "Error iniciando transacción" });
   }

   try {
    // Insertar equipo
    const insertEquipoQuery = `
     INSERT INTO equipos (nombre_equipo, capitan_id) VALUES (?, ?)`;
    
    db.query(insertEquipoQuery, [nombreEquipo, capitan.id], (equipoErr, equipoResults: any) => {
     if (equipoErr) {
      return db.rollback(() => {
       console.error("Error insertando equipo:", equipoErr);
       res.status(500).json({ error: "Error creando equipo" });
      });
     }

     const equipoId = (equipoResults as any).insertId;

     // Insertar miembros adicionales (el capitán ya se inserta automáticamente por trigger)
     const miembrosAdicionales = validacion.participantes.filter(p => p.email !== emailCapitan);
     const insertMiembrosQuery = `
      INSERT INTO miembros_equipo (equipo_id, participante_id, es_capitan) VALUES ?`;
     
     const miembrosValues = miembrosAdicionales.map(m => [equipoId, m.id, false]);

     db.query(insertMiembrosQuery, [miembrosValues], (miembrosErr) => {
      if (miembrosErr) {
       return db.rollback(() => {
        console.error("Error insertando miembros:", miembrosErr);
        res.status(500).json({ error: "Error agregando miembros al equipo" });
       });
      }

      // Commit transacción
      db.commit((commitErr) => {
       if (commitErr) {
        return db.rollback(() => {
         console.error("Error en commit:", commitErr);
         res.status(500).json({ error: "Error finalizando registro" });
        });
       }

       // Éxito
       res.status(201).json({
        message: "Equipo registrado exitosamente",
        data: {
         id: equipoId,
         nombreEquipo,
         capitanEmail: emailCapitan,
         totalMiembros: todosEmails.length,
         creado: new Date().toISOString()
        }
       });
      });
     });
    });

   } catch (error) {
    db.rollback(() => {
     console.error("Error en transacción de equipo:", error);
     res.status(500).json({ error: "Error interno del servidor" });
    });
   }
  });

 } catch (error) {
  console.error("Error en POST /api/equipos:", error);
  return res.status(500).json({
   error: "Error interno del servidor",
  });
 }
});

// Obtener todos los equipos
app.get("/api/equipos", async (req, res) => {
 try {
  const equipos = await getAllEquipos();
  
  // Para cada equipo, obtener sus miembros
  const equiposConMiembros = await Promise.all(
   equipos.map(async (equipo) => {
    const miembros = await getMiembrosEquipo(equipo.id);
    return { ...equipo, miembros };
   })
  );

  return res.json(equiposConMiembros);
 } catch (error) {
  console.error("Error obteniendo equipos:", error);
  return res.status(500).json({ error: "Error interno del servidor" });
 }
});

// Obtener equipo por ID
app.get("/api/equipos/:id", async (req, res) => {
 const { id } = req.params;
 const equipoId = parseInt(id, 10);

 if (isNaN(equipoId)) {
  return res.status(400).json({ error: "ID de equipo inválido" });
 }

 try {
  const equipo = await getEquipoById(equipoId);
  
  if (!equipo) {
   return res.status(404).json({ error: "Equipo no encontrado" });
  }

  const miembros = await getMiembrosEquipo(equipoId);

  return res.json({ ...equipo, miembros });
 } catch (error) {
  console.error("Error obteniendo equipo:", error);
  return res.status(500).json({ error: "Error interno del servidor" });
 }
});

// Obtener equipo de un participante por email
app.get("/api/equipos/by-participant", async (req, res) => {
 const { email } = req.query;

 if (!email || typeof email !== "string") {
  return res.status(400).json({ error: "Email requerido" });
 }

 try {
  const equipo = await getEquipoByParticipantEmail(email);
  
  if (!equipo) {
   return res.json({ equipo: null, message: "No está registrado en ningún equipo" });
  }

  const miembros = await getMiembrosEquipo(equipo.id);

  return res.json({ equipo: { ...equipo, miembros } });
 } catch (error) {
  console.error("Error obteniendo equipo del participante:", error);
  return res.status(500).json({ error: "Error interno del servidor" });
 }
});

// === RUTAS GENERALES ===

app.get("/", (req, res) => {
 res.json({ 
  message: "API de registro, asistencia, constancias y equipos funcionando correctamente",
  endpoints: {
   registro: "/api/registro",
   participantes: "/api/participante",
   conferencias: "/api/conferencias",
   asistencias: "/api/asistencias",
   equipos: "/api/equipos",
   constancias: "/api/constancia"
  }
 });
});

app.use("*", (req, res) => {
 res.status(404).json({ error: "Ruta no encontrada" });
});

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, () => {
 console.log(`🚀 API lista en http://localhost:${PORT}`);
});