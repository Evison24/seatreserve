import { NextRequest, NextResponse } from 'next/server';
import { desc, ilike } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from 'lib/auth';
import { db } from '@/db/drizzle';
import { events } from '@/db/schema';
import { createEventSchema } from 'lib/validators';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') ?? '';
    const limit = Math.min(Number(searchParams.get('limit') ?? 20), 100);
    const cursor = searchParams.get('cursor');

    const where = q ? ilike(events.title, `%${q}%`) : undefined;

    const rows = await db
      .select()
      .from(events)
      .where(where)
      .orderBy(desc(events.startsAt))
      .limit(limit + 1)
      .offset(cursor ? Number(cursor) : 0);

    const hasMore = rows.length > limit;
    const data = hasMore ? rows.slice(0, limit) : rows;
    const nextCursor = hasMore ? String(Number(cursor ?? 0) + limit) : null;

    return NextResponse.json({ data, nextCursor });
  } catch (err: unknown) {
    console.error('GET /api/events error:', err);
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await req.json();
    const parsed = createEventSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const payload = parsed.data;
    if (new Date(payload.endsAt) <= new Date(payload.startsAt)) {
      return NextResponse.json(
        { error: 'endsAt must be after startsAt' },
        { status: 400 }
      );
    }

    const [created] = await db
      .insert(events)
      .values({
        title: payload.title,
        description: payload.description,
        venue: payload.venue,
        startsAt: new Date(payload.startsAt),
        endsAt: new Date(payload.endsAt),
        createdByUserId: session.user.id,
      })
      .returning();

    return NextResponse.json({ data: created }, { status: 201 });
  } catch (err: unknown) {
    console.error('POST /api/events error:', err);
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// catch (err: any) {
//   console.error('POST /api/events error:', err);
//   return NextResponse.json(
//     { error: err?.message ?? 'Internal Server Error' },
//     { status: 500 }
//   );
// }
