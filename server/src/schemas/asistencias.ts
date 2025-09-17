import { z } from 'zod';

export const asistenciaCreateSchema = z.object({
  email: z.string().email(),
  actividadId: z.number().int().positive()
});
