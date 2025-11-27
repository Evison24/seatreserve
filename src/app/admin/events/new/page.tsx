import { redirect } from 'next/navigation';
import { db } from '@/db/drizzle';
import { events } from '@/db/schema';
import { createEventSchema } from 'lib/validators';
import type { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from 'lib/auth';

type CreateEventInput = z.infer<typeof createEventSchema>;

async function createEventAction(formData: FormData) {
  'use server';

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const title = formData.get('title')?.toString() ?? '';
  const description = formData.get('description')?.toString() ?? '';
  const venue = formData.get('venue')?.toString() ?? '';
  const startsAtRaw = formData.get('startsAt')?.toString() ?? '';
  const endsAtRaw = formData.get('endsAt')?.toString() ?? '';

  const startsAtIso = startsAtRaw ? new Date(startsAtRaw).toISOString() : '';
  const endsAtIso = endsAtRaw ? new Date(endsAtRaw).toISOString() : '';

  const raw: Partial<CreateEventInput> = {
    title,
    description: description || undefined,
    venue,
    startsAt: startsAtIso,
    endsAt: endsAtIso,
  };

  const parsed = createEventSchema.safeParse(raw);
  if (!parsed.success) {
    console.error(parsed.error.flatten());
    throw new Error('Invalid event data');
  }

  const { startsAt, endsAt } = parsed.data;

  const [inserted] = await db
    .insert(events)
    .values({
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      venue: parsed.data.venue,
      startsAt: new Date(startsAt),
      endsAt: new Date(endsAt),
      createdByUserId: session.user.id,
    })
    .returning();

  redirect(`/admin/events/${inserted.id}/seats`);
}

export default function AdminNewEventPage() {
  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Create new event</h1>
      <p className="text-sm opacity-70">
        Define the event details. After saving, you&apos;ll design the seat layout.
      </p>

      <form action={createEventAction} className="space-y-4">
        <div className="space-y-1">
          <label className="block text-xs font-medium">Title</label>
          <input
            name="title"
            type="text"
            required
            className="w-full rounded border px-2 py-1.5 text-sm"
            placeholder="e.g. Symphony Night"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium">Description</label>
          <textarea
            name="description"
            rows={3}
            className="w-full rounded border px-2 py-1.5 text-sm"
            placeholder="Optional details about the event"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium">Venue / Place</label>
          <input
            name="venue"
            type="text"
            required
            className="w-full rounded border px-2 py-1.5 text-sm"
            placeholder="e.g. Tirana Opera House"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-medium">Starts at</label>
            <input
              name="startsAt"
              type="datetime-local"
              required
              className="w-full rounded border px-2 py-1.5 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium">Ends at</label>
            <input
              name="endsAt"
              type="datetime-local"
              required
              className="w-full rounded border px-2 py-1.5 text-sm"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-3">
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-black text-white text-sm font-medium"
          >
            Create &amp; design seats
          </button>
        </div>
      </form>
    </div>
  );
}
