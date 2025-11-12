import { NextResponse } from 'next/server';
import { db } from '@/db/drizzle';
import { events, seats } from '@/db/schema';

export async function POST() {
  try {
    // guard: only allow in development
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const starts = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const ends = new Date(starts.getTime() + 2 * 60 * 60 * 1000);

    const [event] = await db
      .insert(events)
      .values({
        title: 'Demo Jazz Night',
        description: 'Live quartet — seeded event',
        venue: 'City Hall',
        startsAt: starts,
        endsAt: ends,
        // dev-only: fake user id
        createdByUserId: crypto.randomUUID(),
      })
      .returning();

    const rows = ['A', 'B'];
    const values = rows.flatMap((row) =>
      Array.from({ length: 10 }, (_, i) => ({
        eventId: event.id,
        row,
        number: i + 1,
        priceCents: 2500,
        isAvailable: true,
      }))
    );

    await db.insert(seats).values(values);

    return NextResponse.json(
      { seededEventId: event.id, seats: values.length },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('POST /api/dev/seed error:', err);
    return NextResponse.json(
      { error: err?.message ?? 'Internal Server Error' },
      { status: 500 }
    );
  }
}
