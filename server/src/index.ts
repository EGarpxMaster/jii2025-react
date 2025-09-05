import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { z } from "zod";
import mysql from "mysql2";

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
    .enum(["Ingeniería Industrial", "Ingeniería en Datos", "Ingeniería Ambiental"])
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

const getAllConferencias = (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT id, titulo, ponente, fecha, lugar
      FROM conferencias 
      ORDER BY fecha ASC`;
    
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

// === NUEVAS RUTAS PARA ASISTENCIA ===

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

    // Verificar que el participante existe
    const participante = await getParticipantByEmail(email);
    if (!participante) {
      return res.status(404).json({ error: "Participante no encontrado" });
    }

    // Verificar que la conferencia existe
    const conferencias = await getAllConferencias();
    const conferencia = conferencias.find(c => c.id === conferenciaId);
    if (!conferencia) {
      return res.status(404).json({ error: "Conferencia no encontrada" });
    }

    // Verificar si ya existe la asistencia
    const yaExiste = await checkAsistenciaExists(participante.id, conferenciaId);
    if (yaExiste) {
      return res.status(409).json({ error: "Ya se registró asistencia para esta conferencia" });
    }

    // Insertar nueva asistencia
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

// === RUTAS GENERALES ===

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "API de registro y asistencia funcionando correctamente" });
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