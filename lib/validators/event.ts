import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(3).max(160),
  description: z.string().optional(),
  venue: z.string().min(2).max(160),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
});

export const updateEventSchema = createEventSchema.partial();

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
