import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware global de logging
app.use((req, res, next) => {
    console.log('\n=== Nueva solicitud ===');
    console.log('Método:', req.method);
    console.log('URL:', req.url);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body (antes):', req.body);
    next();
});

// Configuración de CORS
const corsOptions = {
    origin: ['http://192.168.200.212', 'http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Archivos de datos
const dataDir = path.join(__dirname, 'data');
const participantesFile = path.join(dataDir, 'participantes.json');
const actividadesFile = path.join(dataDir, 'actividades.json');
const inscripcionesFile = path.join(dataDir, 'inscripciones.json');
const asistenciasFile = path.join(dataDir, 'asistencias.json');

// Crear directorio de datos si no existe
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Funciones de utilidad
function readJsonFile(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            return [];
        }
        const data = fs.readFileSync(filePath, 'utf8');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error(`Error leyendo ${filePath}:`, error);
        return [];
    }
}

function writeJsonFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error escribiendo ${filePath}:`, error);
        return false;
    }
}

// Ruta de test
app.post('/api/test', (req, res) => {
    console.log('\n=== Test endpoint ===');
    console.log('req.body:', req.body);
    console.log('typeof req.body:', typeof req.body);
    console.log('Object.keys(req.body):', Object.keys(req.body || {}));
    
    res.json({
        message: 'Test successful',
        received_body: req.body,
        body_type: typeof req.body,
        body_keys: Object.keys(req.body || {})
    });
});

// GET /api/participantes/check-email - Verificar si email está disponible
app.get('/api/participantes/check-email', (req, res) => {
    try {
        const { email } = req.query;
        console.log('Verificando email único:', email);
        
        if (!email) {
            return res.status(400).json({ error: 'Email requerido' });
        }

        const participantes = readJsonFile(participantesFile);
        const exists = participantes.some(p => p.email === email);
        
        res.json({ unique: !exists });
    } catch (error) {
        console.error('Error verificando email:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// GET /api/participantes - Buscar participante por email
app.get('/api/participantes', (req, res) => {
    try {
        const { email } = req.query;
        console.log('Buscando participante por email:', email);
        
        if (!email) {
            return res.status(400).json({ error: 'Email requerido' });
        }

        const participantes = readJsonFile(participantesFile);
        const participante = participantes.find(p => p.email === email);
        
        if (!participante) {
            return res.status(404).json({ error: 'Participante no encontrado' });
        }
        
        res.json({ participante });
    } catch (error) {
        console.error('Error buscando participante:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// POST /api/participantes - Registrar nuevo participante (formato del frontend)
app.post('/api/participantes', (req, res) => {
    try {
        console.log('\n=== POST /api/participantes ===');
        console.log('req.body:', JSON.stringify(req.body, null, 2));
        
        if (!req.body) {
            console.log('❌ req.body es undefined');
            return res.status(400).json({
                error: 'Datos de solicitud inválidos'
            });
        }

        const participantes = readJsonFile(participantesFile);
        const {
            apellidoPaterno,
            apellidoMaterno,
            primerNombre,
            segundoNombre,
            email,
            telefono,
            categoria,
            programa
        } = req.body;

        console.log('Datos extraídos:', {
            apellidoPaterno, apellidoMaterno, primerNombre, email, categoria
        });

        // Validaciones básicas
        if (!apellidoPaterno || !apellidoMaterno || !primerNombre || !email || !categoria || !telefono) {
            const errors = {
                apellidoPaterno: !apellidoPaterno ? 'Campo obligatorio' : undefined,
                apellidoMaterno: !apellidoMaterno ? 'Campo obligatorio' : undefined,
                primerNombre: !primerNombre ? 'Campo obligatorio' : undefined,
                email: !email ? 'Campo obligatorio' : undefined,
                categoria: !categoria ? 'Selecciona una categoría' : undefined,
                telefono: !telefono ? 'Campo obligatorio' : undefined
            };

            // Filtrar undefined values
            Object.keys(errors).forEach(key => {
                if (errors[key] === undefined) {
                    delete errors[key];
                }
            });

            console.log('❌ Validación fallida:', errors);
            return res.status(422).json({ errors });
        }

        // Validar formato de teléfono
        if (!/^\d{10}$/.test(telefono)) {
            console.log('❌ Formato de teléfono inválido');
            return res.status(422).json({ 
                errors: { telefono: 'Deben ser 10 dígitos' }
            });
        }

        // Verificar si el email ya existe
        const emailExists = participantes.find(p => p.email === email);
        if (emailExists) {
            console.log('❌ Email ya existe');
            return res.status(409).json({
                error: 'El email ya está registrado',
                field: 'email'
            });
        }

        // Crear participante
        const nombres = segundoNombre ? `${primerNombre} ${segundoNombre}` : primerNombre;
        const apellidos = `${apellidoPaterno} ${apellidoMaterno}`;

        const nuevoParticipante = {
            id: participantes.length + 1,
            nombres,
            apellidos,
            email,
            telefono: telefono || '',
            categoria,
            programa: programa || null,
            institucion: categoria === 'Estudiante' ? 'Universidad del Caribe' : 'Externa',
            nivel_educativo: categoria === 'Estudiante' ? 'universitario' : 'otro',
            fecha_registro: new Date().toISOString(),
            brazalete: null
        };

        participantes.push(nuevoParticipante);
        const saved = writeJsonFile(participantesFile, participantes);

        if (!saved) {
            console.log('❌ Error guardando participante');
            return res.status(500).json({ error: 'Error guardando datos' });
        }

        console.log('✅ Participante registrado:', nuevoParticipante.id);
        res.status(201).json({
            message: 'Participante registrado exitosamente',
            participante: nuevoParticipante
        });
    } catch (error) {
        console.error('Error en POST /api/participantes:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// GET /api/actividades - Obtener actividades con filtros opcionales
app.get('/api/actividades', (req, res) => {
    try {
        console.log('Solicitud GET /api/actividades recibida');
        const { ventana } = req.query;
        
        let actividades = readJsonFile(actividadesFile);
        
        // Si no hay datos, crear datos de ejemplo
        if (actividades.length === 0) {
            actividades = [
                {
                    id: 1,
                    titulo: "Workshop de Automatización Industrial",
                    descripcion: "Aprende sobre las últimas tecnologías en automatización",
                    tipo: "workshop",
                    fecha: "2025-01-15",
                    hora_inicio: "09:00",
                    hora_fin: "12:00",
                    cupo_maximo: 30,
                    inscritos: 0,
                    lugar: "Laboratorio A1"
                },
                {
                    id: 2,
                    titulo: "Conferencia: Industria 4.0",
                    descripcion: "El futuro de la manufactura inteligente",
                    tipo: "conferencia",
                    fecha: "2025-01-16",
                    hora_inicio: "10:00",
                    hora_fin: "11:30",
                    cupo_maximo: 100,
                    inscritos: 0,
                    lugar: "Auditorio Principal"
                },
                {
                    id: 3,
                    titulo: "Taller de Lean Manufacturing",
                    descripcion: "Metodologías para optimizar procesos productivos",
                    tipo: "workshop",
                    fecha: "2025-01-17",
                    hora_inicio: "14:00",
                    hora_fin: "17:00",
                    cupo_maximo: 25,
                    inscritos: 0,
                    lugar: "Aula 301"
                }
            ];
            writeJsonFile(actividadesFile, actividades);
        }
        
        // Filtrar por ventana si se especifica
        if (ventana === 'workshops') {
            actividades = actividades.filter(a => a.tipo === 'workshop');
        }
        
        res.json(actividades);
    } catch (error) {
        console.error('Error en GET /api/actividades:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// POST /api/inscripciones - Inscribir a workshop (solo uno permitido)
app.post('/api/inscripciones', (req, res) => {
    try {
        const { participante_email, actividad_id } = req.body;
        
        if (!participante_email || !actividad_id) {
            return res.status(400).json({
                error: 'Email del participante y ID de actividad son requeridos'
            });
        }

        const participantes = readJsonFile(participantesFile);
        const actividades = readJsonFile(actividadesFile);
        const inscripciones = readJsonFile(inscripcionesFile);

        // Verificar que el participante existe
        const participante = participantes.find(p => p.email === participante_email);
        if (!participante) {
            return res.status(404).json({ error: 'Participante no encontrado' });
        }

        // Verificar que la actividad existe
        const actividad = actividades.find(a => a.id === actividad_id);
        if (!actividad) {
            return res.status(404).json({ error: 'Actividad no encontrada' });
        }

        // Solo workshops pueden tener inscripciones
        if (actividad.tipo !== 'workshop') {
            return res.status(400).json({ error: 'Solo se puede inscribir a workshops' });
        }

        // Verificar si ya está inscrito a algún workshop
        const yaInscrito = inscripciones.find(i => i.participante_email === participante_email);
        if (yaInscrito) {
            return res.status(409).json({
                error: 'Ya estás inscrito a un workshop. Solo se permite uno por participante.'
            });
        }

        // Verificar cupo
        const inscritosEnActividad = inscripciones.filter(i => i.actividad_id === actividad_id).length;
        if (inscritosEnActividad >= actividad.cupo_maximo) {
            return res.status(409).json({ error: 'Workshop lleno' });
        }

        // Crear inscripción
        const nuevaInscripcion = {
            id: inscripciones.length + 1,
            participante_email,
            participante_nombre: `${participante.nombres} ${participante.apellidos}`,
            actividad_id,
            actividad_titulo: actividad.titulo,
            fecha_inscripcion: new Date().toISOString()
        };

        inscripciones.push(nuevaInscripcion);
        writeJsonFile(inscripcionesFile, inscripciones);

        res.status(201).json({
            message: 'Inscripción exitosa',
            inscripcion: nuevaInscripcion
        });
    } catch (error) {
        console.error('Error en POST /api/inscripciones:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// GET /api/participantes/:email/inscripciones - Obtener inscripciones del participante
app.get('/api/participantes/:email/inscripciones', (req, res) => {
    try {
        const { email } = req.params;
        const inscripciones = readJsonFile(inscripcionesFile);
        
        const inscripcionesParticipante = inscripciones.filter(i => i.participante_email === email);
        res.json(inscripcionesParticipante);
    } catch (error) {
        console.error('Error obteniendo inscripciones:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// POST /api/participantes/brazalete - Registrar brazalete
app.post('/api/participantes/brazalete', (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                error: 'Datos de solicitud inválidos'
            });
        }

        const { email, brazalete } = req.body;
        
        if (!email || !brazalete) {
            return res.status(400).json({
                error: 'Email y número de brazalete son requeridos'
            });
        }

        const participantes = readJsonFile(participantesFile);
        
        // Verificar que el participante existe
        const participanteIndex = participantes.findIndex(p => p.email === email);
        if (participanteIndex === -1) {
            return res.status(404).json({ error: 'Participante no encontrado' });
        }

        // Verificar que el brazalete no esté en uso
        const brazaleteEnUso = participantes.find(p => p.brazalete === brazalete);
        if (brazaleteEnUso) {
            return res.status(409).json({ error: 'Número de brazalete ya está en uso' });
        }

        // Asignar brazalete
        participantes[participanteIndex].brazalete = brazalete;
        writeJsonFile(participantesFile, participantes);

        res.json({
            message: 'Brazalete asignado exitosamente',
            participante: participantes[participanteIndex]
        });
    } catch (error) {
        console.error('Error en POST /api/participantes/brazalete:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// POST /api/asistencias - Registrar asistencia a actividad
app.post('/api/asistencias', (req, res) => {
    try {
        const { brazalete, actividad_id } = req.body;
        
        if (!brazalete || !actividad_id) {
            return res.status(400).json({
                error: 'Número de brazalete y ID de actividad son requeridos'
            });
        }

        const participantes = readJsonFile(participantesFile);
        const actividades = readJsonFile(actividadesFile);
        const asistencias = readJsonFile(asistenciasFile);

        // Verificar que el participante existe por brazalete
        const participante = participantes.find(p => p.brazalete === brazalete);
        if (!participante) {
            return res.status(404).json({ error: 'Brazalete no encontrado' });
        }

        // Verificar que la actividad existe
        const actividad = actividades.find(a => a.id === actividad_id);
        if (!actividad) {
            return res.status(404).json({ error: 'Actividad no encontrada' });
        }

        // Verificar si ya registró asistencia a esta actividad
        const yaAsistio = asistencias.find(a => 
            a.participante_email === participante.email && a.actividad_id === actividad_id
        );
        if (yaAsistio) {
            return res.status(409).json({ error: 'Ya se registró asistencia a esta actividad' });
        }

        const nuevaAsistencia = {
            id: asistencias.length + 1,
            participante_email: participante.email,
            participante_nombre: participante.nombres + ' ' + participante.apellidos,
            actividad_id: actividad_id,
            actividad_titulo: actividad.titulo,
            actividad_tipo: actividad.tipo,
            fecha_asistencia: new Date().toISOString(),
            brazalete: brazalete
        };

        asistencias.push(nuevaAsistencia);
        writeJsonFile(asistenciasFile, asistencias);

        res.status(201).json({
            message: 'Asistencia registrada exitosamente',
            asistencia: nuevaAsistencia,
            participante: {
                nombre: participante.nombres + ' ' + participante.apellidos,
                email: participante.email
            },
            actividad: {
                titulo: actividad.titulo,
                tipo: actividad.tipo
            }
        });
    } catch (error) {
        console.error('Error en POST /api/asistencias:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// GET /api/participantes/:email/asistencias - Obtener asistencias del participante
app.get('/api/participantes/:email/asistencias', (req, res) => {
    try {
        const { email } = req.params;
        const asistencias = readJsonFile(asistenciasFile);
        
        const asistenciasParticipante = asistencias.filter(a => a.participante_email === email);
        res.json(asistenciasParticipante);
    } catch (error) {
        console.error('Error obteniendo asistencias:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Middleware para rutas no encontradas
app.use((req, res) => {
    console.log(`404 - Route not found: ${req.method} ${req.url}`);
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error('Error no manejado:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📊 Archivos de datos en: ${dataDir}`);
});

export default app;