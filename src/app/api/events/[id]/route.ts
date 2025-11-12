import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/db/drizzle';
import { events } from '@/db/schema';
import { updateEventSchema } from 'lib/validators';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const row = await db.query.events.findFirst({
    where: (t, { eq }) => eq(t.id, params.id),
    with: { seats: true },
  });
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: row });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const json = await req.json();
  const parsed = updateEventSchema.safeParse(json);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const patch = parsed.data;
  if (patch.startsAt && patch.endsAt) {
    if (new Date(patch.endsAt) <= new Date(patch.startsAt)) {
      return NextResponse.json(
        { error: 'endsAt must be after startsAt' },
        { status: 400 }
      );
    }
  }

  const [updated] = await db
    .update(events)
    .set({
      ...(patch.title && { title: patch.title }),
      ...(patch.description !== undefined && { description: patch.description }),
      ...(patch.venue && { venue: patch.venue }),
      ...(patch.startsAt && { startsAt: new Date(patch.startsAt) }),
      ...(patch.endsAt && { endsAt: new Date(patch.endsAt) }),
      updatedAt: new Date(),
    })
    .where(eq(events.id, params.id))
    .returning();

  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [deleted] = await db.delete(events).where(eq(events.id, params.id)).returning();
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
