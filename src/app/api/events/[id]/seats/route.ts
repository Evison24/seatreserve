import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from 'lib/auth';
import { db } from '@/db/drizzle';
import { seats } from '@/db/schema';
import { createSeatSchema } from 'lib/validators';
import { eq } from 'drizzle-orm';
import type { z } from 'zod';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const event = await db.query.events.findFirst({
    where: (t, { eq }) => eq(t.id, params.id),
  });
  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

  const data = await db.select().from(seats).where(eq(seats.eventId, params.id));
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const event = await db.query.events.findFirst({
    where: (t, { eq }) => eq(t.id, params.id),
  });
  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

  const json = await req.json();
  const items = Array.isArray(json) ? json : [json];

  type SeatPayload = z.infer<typeof createSeatSchema>;
  const parsed = items.map((item) => createSeatSchema.safeParse(item));

  const errors = parsed
    .filter((r) => !r.success)
    .map((r) => (r.success ? null : r.error.flatten()));

  if (errors.some((e) => e !== null)) {
    return NextResponse.json({ error: errors }, { status: 400 });
  }

  const values = parsed
    .filter((r): r is z.ZodSafeParseSuccess<SeatPayload> => r.success)
    .map((r) => ({
      eventId: params.id,
      row: r.data.row,
      number: r.data.number,
      priceCents: r.data.priceCents,
      isAvailable: r.data.isAvailable ?? true,
    }));

  const inserted = await db.insert(seats).values(values).returning();
  return NextResponse.json({ data: inserted }, { status: 201 });
}
