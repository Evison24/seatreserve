import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/db/drizzle';
import { seats } from '@/db/schema';
import { createSeatSchema } from 'lib/validators';
import { eq } from 'drizzle-orm';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  // Ensure event exists (cheap existence check via count)
  const event = await db.query.events.findFirst({
    where: (t, { eq }) => eq(t.id, params.id),
  });
  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

  const data = await db.select().from(seats).where(eq(seats.eventId, params.id));
  return NextResponse.json({ data });
}

// Accepts single seat object or an array for bulk create
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

  const results = items.map((p) => createSeatSchema.safeParse(p));
  const hasError = results.some((r) => !r.success);
  if (hasError) {
    return NextResponse.json(
      { error: results.map((r) => (r.success ? null : r.error.flatten())) },
      { status: 400 }
    );
  }

  const values = results
    .map((r) => (r as any).data)
    .map((p: any) => ({
      eventId: params.id,
      row: p.row,
      number: p.number,
      priceCents: p.priceCents,
      isAvailable: p.isAvailable ?? true,
    }));

  const inserted = await db.insert(seats).values(values).returning();
  return NextResponse.json({ data: inserted }, { status: 201 });
}
