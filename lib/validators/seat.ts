import { z } from 'zod';

export const createSeatSchema = z.object({
  row: z.string().min(1).max(10),
  number: z.number().int().positive(),
  priceCents: z.number().int().nonnegative(),
  isAvailable: z.boolean().optional(),
});

export const updateSeatSchema = createSeatSchema.partial();

export type CreateSeatInput = z.infer<typeof createSeatSchema>;
export type UpdateSeatInput = z.infer<typeof updateSeatSchema>;
