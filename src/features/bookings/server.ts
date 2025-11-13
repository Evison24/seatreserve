import { db } from '@/db/drizzle';
import { bookings, events, seats } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { BookingRow } from './types';

export async function getMyBookings(userId: string): Promise<BookingRow[]> {
  const rows = await db
    .select({
      id: bookings.id,
      status: bookings.status,
      createdAt: bookings.createdAt,
      eventTitle: events.title,
      seatRow: seats.row,
      seatNumber: seats.number,
    })
    .from(bookings)
    .innerJoin(events, eq(events.id, bookings.eventId))
    .innerJoin(seats, eq(seats.id, bookings.seatId))
    .where(eq(bookings.userId, userId))
    .orderBy(desc(bookings.createdAt));

  return rows;
}
