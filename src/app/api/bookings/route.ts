import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from 'lib/auth';
import { db } from '@/db/drizzle';
import { bookings, seats } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createBookingSchema } from 'lib/validators';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let eventId: string | null = null;
  let seatId: string | null = null;
  const contentType = req.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const body = await req.json();
    ({ eventId, seatId } = body ?? {});
  } else {
    const fd = await req.formData();
    eventId = (fd.get('eventId') as string) || null;
    seatId = (fd.get('seatId') as string) || null;
  }

  const parsed = createBookingSchema.safeParse({ eventId, seatId });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    await db.transaction(async (tx) => {
      const [seat] = await tx
        .select()
        .from(seats)
        .where(eq(seats.id, parsed.data.seatId));
      if (!seat || seat.eventId !== parsed.data.eventId)
        throw new Error('Seat not found for event');
      if (!seat.isAvailable) throw new Error('Seat already booked');

      await tx.insert(bookings).values({
        eventId: parsed.data.eventId,
        seatId: parsed.data.seatId,
        userId: session.user.id,
        status: 'active',
      });

      await tx
        .update(seats)
        .set({ isAvailable: false })
        .where(eq(seats.id, parsed.data.seatId));
    });

    return NextResponse.redirect(new URL('/bookings', req.url), 303);
  } catch (err: unknown) {
    console.error('POST /api/bookings error:', err);
    const msg = err instanceof Error ? err.message : 'Internal Server Error';
    const status = /unique|duplicate|conflict/i.test(msg)
      ? 409
      : msg === 'Seat not found for event'
      ? 404
      : msg === 'Seat already booked'
      ? 409
      : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
