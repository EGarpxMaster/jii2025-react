import { Router, Request, Response } from 'express';
import { AsistenciaService } from '../services/asistencias.service.js';
import { asyncHandler } from '../middleware/errors.js';
import { createApiResponse, createErrorResponse } from '../utils/helpers.js';
import type { AsistenciaCreateDTO } from '../types/database.js';

const router = Router();
const asistenciaService = new AsistenciaService();

// POST /api/asistencias - Registrar asistencia (endpoint simplificado para frontend)
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const { email, actividadId } = req.body;
  
  if (!email || !actividadId) {
    return res.status(400).json(createErrorResponse('email y actividadId son requeridos'));
  }

  const asistencia = await asistenciaService.registrarAsistenciaPorEmail(email, actividadId);
  res.status(201).json(createApiResponse(asistencia, 'Asistencia registrada exitosamente'));
}));

// POST /api/asistencias/marcar - Marcar asistencia (requiere brazalete y ventana de tiempo)
router.post('/marcar', asyncHandler(async (req: Request, res: Response) => {
  const data: AsistenciaCreateDTO = req.body;
  
  if (!data.participante_id || !data.actividad_id) {
    return res.status(400).json(createErrorResponse('participante_id y actividad_id son requeridos'));
  }

  const asistencia = await asistenciaService.marcarAsistencia(data);
  res.status(201).json(createApiResponse(asistencia, 'Asistencia marcada exitosamente'));
}));

// POST /api/asistencias/registrar - Registrar asistencia (sin restricciones de tiempo)
router.post('/registrar', asyncHandler(async (req: Request, res: Response) => {
  const data: AsistenciaCreateDTO = req.body;
  
  if (!data.participante_id || !data.actividad_id) {
    return res.status(400).json(createErrorResponse('participante_id y actividad_id son requeridos'));
  }

  const asistencia = await asistenciaService.registrarAsistencia(data);
  res.status(201).json(createApiResponse(asistencia, 'Asistencia registrada exitosamente'));
}));

// GET /api/asistencias/participante/:id - Obtener asistencias de un participante
router.get('/participante/:id', asyncHandler(async (req: Request, res: Response) => {
  const participanteId = parseInt(req.params.id);
  if (isNaN(participanteId)) {
    return res.status(400).json(createErrorResponse('ID de participante inválido'));
  }

  const asistencias = await asistenciaService.getAsistenciasByParticipante(participanteId);
  res.json(createApiResponse(asistencias));
}));

// GET /api/asistencias/actividad/:id - Obtener asistencias de una actividad
router.get('/actividad/:id', asyncHandler(async (req: Request, res: Response) => {
  const actividadId = parseInt(req.params.id);
  if (isNaN(actividadId)) {
    return res.status(400).json(createErrorResponse('ID de actividad inválido'));
  }

  const asistencias = await asistenciaService.getAsistenciasByActividad(actividadId);
  res.json(createApiResponse(asistencias));
}));

// GET /api/asistencias/estado/:participanteId/:actividadId - Obtener estado de asistencia específica
router.get('/estado/:participanteId/:actividadId', asyncHandler(async (req: Request, res: Response) => {
  const participanteId = parseInt(req.params.participanteId);
  const actividadId = parseInt(req.params.actividadId);
  
  if (isNaN(participanteId) || isNaN(actividadId)) {
    return res.status(400).json(createErrorResponse('IDs inválidos'));
  }

  const estado = await asistenciaService.getEstadoAsistencia(participanteId, actividadId);
  if (!estado) {
    return res.status(404).json(createErrorResponse('Asistencia no encontrada'));
  }

  res.json(createApiResponse(estado));
}));

// GET /api/asistencias/constancia/:participanteId - Obtener asistencias para constancia
router.get('/constancia/:participanteId', asyncHandler(async (req: Request, res: Response) => {
  const participanteId = parseInt(req.params.participanteId);
  if (isNaN(participanteId)) {
    return res.status(400).json(createErrorResponse('ID de participante inválido'));
  }

  const asistencias = await asistenciaService.getAsistenciasParaConstancia(participanteId);
  res.json(createApiResponse(asistencias));
}));

// GET /api/asistencias/elegibilidad/:participanteId - Verificar elegibilidad para constancia
router.get('/elegibilidad/:participanteId', asyncHandler(async (req: Request, res: Response) => {
  const participanteId = parseInt(req.params.participanteId);
  if (isNaN(participanteId)) {
    return res.status(400).json(createErrorResponse('ID de participante inválido'));
  }

  const elegibilidad = await asistenciaService.verificarElegibilidadConstancia(participanteId);
  res.json(createApiResponse(elegibilidad));
}));

// GET /api/asistencias/stats - Obtener estadísticas de asistencias
router.get('/stats', asyncHandler(async (req: Request, res: Response) => {
  const stats = await asistenciaService.getAsistenciasStats();
  res.json(createApiResponse(stats));
}));

// GET /api/asistencias/:id - Obtener asistencia por ID
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json(createErrorResponse('ID inválido'));
  }

  const asistencia = await asistenciaService.getAsistenciaById(id);
  if (!asistencia) {
    return res.status(404).json(createErrorResponse('Asistencia no encontrada'));
  }

  res.json(createApiResponse(asistencia));
}));

export { router as asistenciasRoutes };