import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from 'lib/auth';
import { db } from '@/db/drizzle';
import { seats } from '@/db/schema';
import { updateSeatSchema } from 'lib/validators';
import { eq } from 'drizzle-orm';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ seatId: string }> }
) {
  const { seatId } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const json = await req.json();
  const parsed = updateSeatSchema.safeParse(json);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const patch = parsed.data;
  const [updated] = await db
    .update(seats)
    .set({
      ...(patch.row && { row: patch.row }),
      ...(patch.number && { number: patch.number }),
      ...(patch.priceCents !== undefined && { priceCents: patch.priceCents }),
      ...(patch.isAvailable !== undefined && { isAvailable: patch.isAvailable }),
      updatedAt: new Date(),
    })
    .where(eq(seats.id, seatId))
    .returning();

  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: updated });
}
