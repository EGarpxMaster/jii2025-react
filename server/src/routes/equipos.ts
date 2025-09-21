import { Router, Request, Response } from 'express';
import { EquipoService } from '../services/equipos.service.js';
import { asyncHandler } from '../middleware/errors.js';
import { createApiResponse, createErrorResponse } from '../utils/helpers.js';
import type { EquipoConcursoCreateDTO } from '../types/database.js';

const router = Router();
const equipoService = new EquipoService();

// GET /api/equipos/estados-disponibles - Redirect temporal a la ruta correcta
router.get('/estados-disponibles', asyncHandler(async (req: Request, res: Response) => {
  console.log('⚠️  Llamada a ruta obsoleta /api/equipos/estados-disponibles - redirigiendo');
  const estados = await equipoService.getEstadosDisponibles();
  res.json(createApiResponse(estados));
}));

// GET /api/equipos/check-participant?email=xxx - Verificar si un participante existe
router.get('/check-participant', asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.query;
  console.log('🔍 Check participant llamada con email:', email);
  
  if (!email || typeof email !== 'string') {
    console.log('❌ Email inválido:', email);
    return res.status(400).json(createErrorResponse('Email requerido'));
  }

  try {
    const participante = await equipoService.checkParticipanteExists(email);
    console.log('📊 Resultado búsqueda participante:', participante);
    
    if (participante) {
      // Participante válido encontrado
      console.log('✅ Participante válido encontrado');
      res.json(createApiResponse({
        valid: true,
        exists: true,
        participante: participante
      }));
    } else {
      // Participante no encontrado
      console.log('❌ Participante no encontrado');
      res.json(createApiResponse({
        valid: false,
        exists: false,
        participante: null,
        error: 'Participante no encontrado'
      }));
    }
  } catch (error: any) {
    console.error('❌ Error verificando participante:', error);
    res.status(500).json(createErrorResponse('Error interno del servidor'));
  }
}));

// GET /api/equipos - Obtener todos los equipos
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const equipos = await equipoService.getAllEquipos();
  res.json(createApiResponse(equipos));
}));

// GET /api/equipos/stats - Obtener estadísticas de equipos
router.get('/stats', asyncHandler(async (req: Request, res: Response) => {
  const stats = await equipoService.getEquiposStats();
  res.json(createApiResponse(stats));
}));

// POST /api/equipos - Crear nuevo equipo
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const data: EquipoConcursoCreateDTO = req.body;
  
  const equipo = await equipoService.crearEquipo(data);
  res.status(201).json(createApiResponse(equipo, 'Equipo registrado exitosamente'));
}));

// GET /api/equipos/:id - Obtener equipo por ID
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json(createErrorResponse('ID inválido'));
  }

  const equipo = await equipoService.getEquipoById(id);
  if (!equipo) {
    return res.status(404).json(createErrorResponse('Equipo no encontrado'));
  }

  res.json(createApiResponse(equipo));
}));

// PUT /api/equipos/:id/confirmar - Confirmar equipo
router.put('/:id/confirmar', asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json(createErrorResponse('ID inválido'));
  }

  const equipo = await equipoService.confirmarEquipo(id);
  res.json(createApiResponse(equipo, 'Equipo confirmado exitosamente'));
}));

// PUT /api/equipos/:id/cancelar - Cancelar equipo
router.put('/:id/cancelar', asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json(createErrorResponse('ID inválido'));
  }

  const equipo = await equipoService.cancelarEquipo(id);
  res.json(createApiResponse(equipo, 'Equipo cancelado exitosamente'));
}));

// GET /api/equipos/estado/:estadoId - Obtener equipos por estado
router.get('/estado/:estadoId', asyncHandler(async (req: Request, res: Response) => {
  const estadoId = parseInt(req.params.estadoId);
  if (isNaN(estadoId)) {
    return res.status(400).json(createErrorResponse('ID de estado inválido'));
  }

  const equipos = await equipoService.getEquiposByEstado(estadoId);
  res.json(createApiResponse(equipos));
}));

// GET /api/equipos/nombre/:nombre - Obtener equipo por nombre
router.get('/nombre/:nombre', asyncHandler(async (req: Request, res: Response) => {
  const nombre = req.params.nombre;
  const equipo = await equipoService.getEquipoByNombre(nombre);
  
  if (!equipo) {
    return res.status(404).json(createErrorResponse('Equipo no encontrado'));
  }

  res.json(createApiResponse(equipo));
}));

export { router as equiposRoutes };