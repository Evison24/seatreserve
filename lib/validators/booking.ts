import { z } from 'zod';

export const createBookingSchema = z.object({
  eventId: z.string().min(1),
  seatId: z.string().min(1),
});

export const cancelBookingSchema = z.object({
  bookingId: z.string().min(1),
});
