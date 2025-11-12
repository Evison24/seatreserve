/**
 * Dev-only seed script: inserts one event + 20 seats (A1–A10, B1–B10).
 * Run: pnpm seed
 */
import { db } from '@/db/drizzle';
import { events, seats } from '@/db/schema';

async function main() {
  // Create an event happening tomorrow
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
      // use a dummy user id for dev seeding; replace with your real user later if needed
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

  console.log('Seeded event id:', event.id);
}

main()
  .then(() => {
    console.log('✅ Seed complete');
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
