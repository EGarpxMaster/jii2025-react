import { Router, Request, Response } from 'express';
import { WorkshopService } from '../services/workshops.service.js';
import { asyncHandler } from '../middleware/errors.js';
import { createApiResponse, createErrorResponse } from '../utils/helpers.js';
import type { InscripcionWorkshopCreateDTO } from '../types/database.js';

const router = Router();
const workshopService = new WorkshopService();

// GET /api/workshops/disponibles - Obtener workshops disponibles (no llenos)
router.get('/disponibles', asyncHandler(async (req: Request, res: Response) => {
  const workshops = await workshopService.getWorkshopsDisponibles();
  res.json(createApiResponse(workshops));
}));

// GET /api/workshops/stats - Obtener estadísticas de workshops
router.get('/stats', asyncHandler(async (req: Request, res: Response) => {
  const stats = await workshopService.getWorkshopStats();
  res.json(createApiResponse(stats));
}));

// POST /api/workshops/inscripciones - Crear nueva inscripción a workshop
router.post('/inscripciones', asyncHandler(async (req: Request, res: Response) => {
  const data: InscripcionWorkshopCreateDTO = req.body;
  
  if (!data.participante_id || !data.actividad_id) {
    return res.status(400).json(createErrorResponse('participante_id y actividad_id son requeridos'));
  }

  const inscripcion = await workshopService.inscribirParticipante(data);
  
  const message = inscripcion.estado === 'inscrito' 
    ? 'Inscripción exitosa al workshop'
    : 'Agregado a lista de espera del workshop';
    
  res.status(201).json(createApiResponse(inscripcion, message));
}));

// GET /api/workshops/inscripciones/participante/:id - Obtener inscripciones de un participante
router.get('/inscripciones/participante/:id', asyncHandler(async (req: Request, res: Response) => {
  const participanteId = parseInt(req.params.id);
  if (isNaN(participanteId)) {
    return res.status(400).json(createErrorResponse('ID de participante inválido'));
  }

  const inscripciones = await workshopService.getInscripcionesByParticipante(participanteId);
  res.json(createApiResponse(inscripciones));
}));

// GET /api/workshops/inscripciones/actividad/:id - Obtener inscripciones de una actividad
router.get('/inscripciones/actividad/:id', asyncHandler(async (req: Request, res: Response) => {
  const actividadId = parseInt(req.params.id);
  if (isNaN(actividadId)) {
    return res.status(400).json(createErrorResponse('ID de actividad inválido'));
  }

  const inscripciones = await workshopService.getInscripcionesByActividad(actividadId);
  res.json(createApiResponse(inscripciones));
}));

// GET /api/workshops/:actividadId/lista-espera - Obtener lista de espera de un workshop
router.get('/:actividadId/lista-espera', asyncHandler(async (req: Request, res: Response) => {
  const actividadId = parseInt(req.params.actividadId);
  if (isNaN(actividadId)) {
    return res.status(400).json(createErrorResponse('ID de actividad inválido'));
  }

  const listaEspera = await workshopService.getListaEspera(actividadId);
  res.json(createApiResponse(listaEspera));
}));

// GET /api/workshops/estado/:participanteId/:actividadId - Obtener estado de inscripción específica
router.get('/estado/:participanteId/:actividadId', asyncHandler(async (req: Request, res: Response) => {
  const participanteId = parseInt(req.params.participanteId);
  const actividadId = parseInt(req.params.actividadId);
  
  if (isNaN(participanteId) || isNaN(actividadId)) {
    return res.status(400).json(createErrorResponse('IDs inválidos'));
  }

  const estado = await workshopService.getEstadoInscripcion(participanteId, actividadId);
  if (!estado) {
    return res.status(404).json(createErrorResponse('Inscripción no encontrada'));
  }

  res.json(createApiResponse(estado));
}));

// DELETE /api/workshops/inscripciones/:participanteId/:actividadId - Cancelar inscripción
router.delete('/inscripciones/:participanteId/:actividadId', asyncHandler(async (req: Request, res: Response) => {
  const participanteId = parseInt(req.params.participanteId);
  const actividadId = parseInt(req.params.actividadId);
  
  if (isNaN(participanteId) || isNaN(actividadId)) {
    return res.status(400).json(createErrorResponse('IDs inválidos'));
  }

  const success = await workshopService.cancelarInscripcion(participanteId, actividadId);
  if (!success) {
    return res.status(404).json(createErrorResponse('Inscripción no encontrada'));
  }

  res.json(createApiResponse(null, 'Inscripción cancelada exitosamente'));
}));

export { router as workshopsRoutes };