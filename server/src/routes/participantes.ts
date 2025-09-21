import { Router, Request, Response } from 'express';
import { ParticipanteService } from '../services/participantes.service.js';
import { asyncHandler } from '../middleware/errors.js';
import { createApiResponse, createErrorResponse } from '../utils/helpers.js';
import type { ParticipanteCreateDTO, ParticipanteUpdateDTO } from '../types/database.js';

const router = Router();
const participanteService = new ParticipanteService();

// GET /api/participantes - Obtener todos los participantes
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const participantes = await participanteService.getAllParticipantes();
  res.json(createApiResponse(participantes));
}));

// GET /api/participantes/stats - Obtener estadísticas de participantes
router.get('/stats', asyncHandler(async (req: Request, res: Response) => {
  const stats = await participanteService.getParticipantesStats();
  res.json(createApiResponse(stats));
}));

// GET /api/participantes/check-email - Verificar si email está disponible
router.get('/check-email', asyncHandler(async (req: Request, res: Response) => {
  const email = req.query.email as string;
  
  if (!email) {
    return res.status(400).json(createErrorResponse('Email es requerido'));
  }

  const existingParticipante = await participanteService.getParticipanteByEmail(email);
  const unique = !existingParticipante;
  
  res.json(createApiResponse({ unique, email }));
}));

// GET /api/participantes/email/:email - Obtener participante por email
router.get('/email/:email', asyncHandler(async (req: Request, res: Response) => {
  const email = req.params.email;
  const participante = await participanteService.getParticipanteByEmail(email);
  
  if (!participante) {
    return res.status(404).json(createErrorResponse('Participante no encontrado'));
  }

  res.json(createApiResponse(participante));
}));

// GET /api/participantes/:id - Obtener participante por ID
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json(createErrorResponse('ID inválido'));
  }

  const participante = await participanteService.getParticipanteById(id);
  if (!participante) {
    return res.status(404).json(createErrorResponse('Participante no encontrado'));
  }

  res.json(createApiResponse(participante));
}));

// POST /api/participantes - Crear nuevo participante
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const data: ParticipanteCreateDTO = req.body;
  
  const participante = await participanteService.createParticipante(data);
  res.status(201).json(createApiResponse(participante, 'Participante creado exitosamente'));
}));

// PUT /api/participantes/:id - Actualizar participante
router.put('/:id', asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json(createErrorResponse('ID inválido'));
  }

  const data: ParticipanteUpdateDTO = req.body;
  const participante = await participanteService.updateParticipante(id, data);
  
  res.json(createApiResponse(participante, 'Participante actualizado exitosamente'));
}));

// POST /api/participantes/brazalete - Asignar brazalete a participante
router.post('/brazalete', asyncHandler(async (req: Request, res: Response) => {
  const { email, brazalete } = req.body;
  
  if (!email || !brazalete) {
    return res.status(400).json(createErrorResponse('email y brazalete son requeridos'));
  }

  const participante = await participanteService.asignarBrazalete(email, brazalete);
  res.json(createApiResponse(participante, 'Brazalete asignado exitosamente'));
}));

// DELETE /api/participantes/:id - Eliminar participante
router.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json(createErrorResponse('ID inválido'));
  }

  const success = await participanteService.deleteParticipante(id);
  if (!success) {
    return res.status(404).json(createErrorResponse('Participante no encontrado'));
  }

  res.json(createApiResponse(null, 'Participante eliminado exitosamente'));
}));

export { router as participantesRoutes };