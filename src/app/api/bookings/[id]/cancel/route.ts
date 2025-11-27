import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from 'lib/auth';
import { db } from '@/db/drizzle';
import { bookings, seats } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const bookingId = id;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }

  try {
    const updated = await db.transaction(async (tx) => {
      const [bk] = await tx.select().from(bookings).where(eq(bookings.id, bookingId));

      if (!bk) throw new Error('Booking not found');
      if (bk.userId !== session.user.id) throw new Error('Forbidden');
      if (bk.status === 'cancelled') return bk;

      const [res] = await tx
        .update(bookings)
        .set({ status: 'cancelled' })
        .where(eq(bookings.id, bookingId))
        .returning();

      await tx.update(seats).set({ isAvailable: true }).where(eq(seats.id, bk.seatId));

      return res;
    });

    return NextResponse.redirect(new URL('/bookings', req.url));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error';
    const status = msg === 'Forbidden' ? 403 : msg === 'Booking not found' ? 404 : 500;

    return NextResponse.json({ error: msg }, { status });
  }
}
