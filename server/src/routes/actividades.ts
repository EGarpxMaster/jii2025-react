import { Router, Request, Response } from 'express';
import { ActividadService } from '../services/actividades.service.js';
import { asyncHandler } from '../middleware/errors.js';
import { createApiResponse, createErrorResponse } from '../utils/helpers.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { InscripcionesService } from '../services/inscripciones.service.js';

const router = Router();
const actividadService = new ActividadService();

// GET /api/actividades - Obtener todas las actividades
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { tipo, ventana } = req.query;

  // Si se solicitan workshops en ventana de inscripción
  if (ventana === 'workshops') {
    // Temporalmente obtener TODOS los workshops para debugging
    const workshops = await actividadService.getWorkshopsWithStats();
    console.log('🔍 Workshops encontrados:', workshops.length);
    if (workshops.length > 0) {
      console.log('🔍 Primer workshop:', JSON.stringify(workshops[0], null, 2));
    }
    return res.json(createApiResponse(workshops));
  }

  // Si se especifica un tipo
  if (tipo && typeof tipo === 'string') {
    const actividades = await actividadService.getActividadesByTipo(tipo as any);
    return res.json(createApiResponse(actividades));
  }

  // Obtener todas las actividades
  const actividades = await actividadService.getAllActividades();
  res.json(createApiResponse(actividades));
}));


// GET /api/actividades/workshops - Obtener workshops con estadísticas y estado de inscripción
router.get('/workshops', authMiddleware, asyncHandler(async (req: AuthRequest, res: Response) => {
  const workshops = await actividadService.getWorkshopsWithStats();
  const inscripcionesService = new InscripcionesService();
  const participanteId = req.participanteId;

  // Si hay participante autenticado, agregar estado de inscripción a cada workshop
  if (participanteId) {
    const workshopsWithStatus = await Promise.all(
      workshops.map(async (ws) => {
        const estado = await inscripcionesService.getEstadoInscripcion(participanteId, ws.id);
        return {
          ...ws,
          inscrito: estado.inscrito,
          enCola: estado.enCola
        };
      })
    );
    return res.json(createApiResponse(workshopsWithStatus));
  }
  // Si no hay participante autenticado, devolver workshops normales
  res.json(createApiResponse(workshops));
}));

// GET /api/actividades/conferencias-foros - Obtener conferencias y foros con estadísticas
router.get('/conferencias-foros', asyncHandler(async (req: Request, res: Response) => {
  const actividades = await actividadService.getConferenciasForosWithStats();
  res.json(createApiResponse(actividades));
}));

// GET /api/actividades/asistencia - Obtener actividades para marcaje de asistencia
router.get('/asistencia', asyncHandler(async (req: Request, res: Response) => {
  const { participante_id } = req.query;
  const participanteId = participante_id ? parseInt(participante_id as string) : undefined;
  
  const actividades = await actividadService.getActividadesParaAsistencia(participanteId);
  res.json(createApiResponse(actividades));
}));

// GET /api/actividades/stats - Obtener estadísticas de actividades
router.get('/stats', asyncHandler(async (req: Request, res: Response) => {
  const stats = await actividadService.getActividadesStats();
  res.json(createApiResponse(stats));
}));

// GET /api/actividades/:id - Obtener actividad por ID
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json(createErrorResponse('ID inválido'));
  }

  const actividad = await actividadService.getActividadById(id);
  if (!actividad) {
    return res.status(404).json(createErrorResponse('Actividad no encontrada'));
  }

  res.json(createApiResponse(actividad));
}));

// GET /api/actividades/codigo/:codigo - Obtener actividad por código
router.get('/codigo/:codigo', asyncHandler(async (req: Request, res: Response) => {
  const codigo = req.params.codigo;
  const actividad = await actividadService.getActividadByCodigo(codigo);
  
  if (!actividad) {
    return res.status(404).json(createErrorResponse('Actividad no encontrada'));
  }

  res.json(createApiResponse(actividad));
}));

// GET /api/actividades/:id/workshop-stats - Obtener estadísticas de workshop por ID
router.get('/:id/workshop-stats', asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json(createErrorResponse('ID inválido'));
  }

  const stats = await actividadService.getWorkshopStatsById(id);
  if (!stats) {
    return res.status(404).json(createErrorResponse('Workshop no encontrado'));
  }

  res.json(createApiResponse(stats));
}));

// GET /api/actividades/:id/asistencias-stats - Obtener estadísticas de asistencias por ID
router.get('/:id/asistencias-stats', asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json(createErrorResponse('ID inválido'));
  }

  const stats = await actividadService.getAsistenciasStatsById(id);
  if (!stats) {
    return res.status(404).json(createErrorResponse('Actividad no encontrada'));
  }

  res.json(createApiResponse(stats));
}));

// GET /api/actividades/dashboard-stats - Obtener estadísticas completas para el dashboard
router.get('/dashboard-stats', asyncHandler(async (req: Request, res: Response) => {
  const dashboardStats = await actividadService.getDashboardStats();
  res.json(createApiResponse(dashboardStats));
}));

export { router as actividadesRoutes };