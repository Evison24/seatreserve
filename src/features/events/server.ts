import { db } from '@/db/drizzle';
import { events, seats } from '@/db/schema';
import type { Event, Seat } from './types';
import { desc, eq } from 'drizzle-orm';

/** Server-side: fetch events directly from DB (great for SSR demos). */
export async function getEventsServer(): Promise<Event[]> {
  const rows = await db.select().from(events).orderBy(desc(events.startsAt)).limit(100);

  return rows.map((e) => ({
    id: e.id,
    title: e.title,
    date: e.startsAt.toISOString().slice(0, 10), // yyyy-mm-dd for your UI
    location: e.venue,
  }));
}

/** Server-side: fetch seats for an event directly from DB. */
export async function getSeatsServer(eventId: string): Promise<Seat[]> {
  const rows = await db.select().from(seats).where(eq(seats.eventId, eventId));
  return rows.map((s) => ({
    id: s.id,
    row: s.row,
    number: s.number,
    isAvailable: !!s.isAvailable,
  }));
}
