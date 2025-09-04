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

// Esquema de validación (Zod)
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

// Función helper para verificar email único
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
      
      // Convertir errores de Zod a formato esperado por el frontend
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

    // Verificar si el email ya existe
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      return res.status(409).json({ error: "El correo ya fue registrado" });
    }

    // Insertar nuevo registro
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

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "API de registro funcionando correctamente" });
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