import { z } from 'zod';

export const wsInscripcionSchema = z.object({
  email: z.string().email(),
  actividadId: z.number().int().positive()
});

export const wsCancelSchema = wsInscripcionSchema;
