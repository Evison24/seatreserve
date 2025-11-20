import Link from 'next/link';
import { getEventsServer } from '@/features/events/server';

export default async function AdminEventsPage() {
  const events = await getEventsServer();

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin – Events</h1>
        <Link
          href="/admin/events/new"
          className="text-sm px-3 py-1.5 rounded-lg border hover:bg-gray-50"
        >
          + Create event
        </Link>
      </div>

      <div className="space-y-2">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex items-center justify-between rounded-xl border px-4 py-3"
          >
            <div>
              <div className="font-medium">{event.title}</div>
              <div className="text-xs opacity-70">
                {event.location} • {event.date}
              </div>
            </div>
            <div className="flex gap-3 text-sm">
              <Link href={`/events/${event.id}`} className="underline text-gray-600">
                View
              </Link>

              <Link
                href={`/admin/events/${event.id}/seats`}
                className="underline font-medium"
              >
                Design seats
              </Link>
            </div>
          </div>
        ))}

        {events.length === 0 && <p className="text-sm text-gray-500">No events yet.</p>}
      </div>
    </div>
  );
}
