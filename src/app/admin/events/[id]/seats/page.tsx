import { getEventWithSeats } from '@/features/events/server';
import SeatDesigner from '@/features/seats/components/SeatDesigner';

export default async function AdminEventSeatsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const result = await getEventWithSeats(id);
  if (!result) {
    return <div className="p-6">Event not found.</div>;
  }

  const { event, seats } = result;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold">Seat layout for {event.title}</h1>
        <p className="text-sm opacity-70">
          {event.venue} • {new Date(event.startsAt).toLocaleString()}
        </p>
      </div>

      <SeatDesigner eventId={event.id} existingSeats={seats} />
    </div>
  );
}
