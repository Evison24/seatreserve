import { db } from '@/db/drizzle';
import { events, seats } from '@/db/schema';
import type { Event, Seat } from './types';
import { desc, eq, asc } from 'drizzle-orm';

export async function getEventsServer(): Promise<Event[]> {
  const rows = await db.select().from(events).orderBy(desc(events.startsAt)).limit(100);

  return rows.map((e) => ({
    id: e.id,
    title: e.title,
    date: e.startsAt.toISOString().slice(0, 10), // yyyy-mm-dd for your UI
    location: e.venue,
  }));
}

export async function getSeatsServer(eventId: string): Promise<Seat[]> {
  const rows = await db.select().from(seats).where(eq(seats.eventId, eventId));
  return rows.map((s) => ({
    id: s.id,
    row: s.row,
    number: s.number,
    isAvailable: !!s.isAvailable,
  }));
}

type EventRow = typeof events.$inferSelect;
type SeatRow = typeof seats.$inferSelect;

export async function getEventWithSeats(
  eventId: string
): Promise<{ event: EventRow; seats: SeatRow[] } | null> {
  const event = await db.query.events.findFirst({
    where: (t, { eq }) => eq(t.id, eventId),
  });
  if (!event) return null;

  const allSeats = await db
    .select()
    .from(seats)
    .where(eq(seats.eventId, eventId))
    .orderBy(asc(seats.row), asc(seats.number));

  return { event, seats: allSeats };
}
