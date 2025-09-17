import { z } from 'zod';

export const equipoCreateSchema = z.object({
  nombreEquipo: z.string().min(3).max(255),
  emailCapitan: z.string().email(),
  emailsMiembros: z.array(z.string().email()).length(5)
});
