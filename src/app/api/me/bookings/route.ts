import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from 'lib/auth';
import { db } from '@/db/drizzle';
import { bookings, events, seats } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const rows = await db
    .select({
      id: bookings.id,
      status: bookings.status,
      createdAt: bookings.createdAt,
      eventId: events.id,
      eventTitle: events.title,
      seatRow: seats.row,
      seatNumber: seats.number,
    })
    .from(bookings)
    .leftJoin(events, eq(bookings.eventId, events.id))
    .leftJoin(seats, eq(bookings.seatId, seats.id))
    .where(eq(bookings.userId, session.user.id))
    .orderBy(desc(bookings.createdAt));

  return NextResponse.json({ data: rows });
}
