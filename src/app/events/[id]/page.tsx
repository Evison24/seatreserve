import EventSeatBooking from '@/features/events/components/EventSeatBooking';
import { getEventWithSeats } from '@/features/events/server';

export default async function EventSeatsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const eventId = id;

  const result = await getEventWithSeats(eventId);
  if (!result) return <div className="p-6">Event not found.</div>;

  const { event, seats } = result;

  const eventView = {
    id: event.id,
    title: event.title,
    description: event.description,
    venue: event.venue,
    startsAt: event.startsAt.toISOString(),
    endsAt: event.endsAt.toISOString(),
  };

  const seatsView = seats.map((s) => ({
    id: s.id,
    row: s.row,
    number: s.number,
    isAvailable: s.isAvailable,
    priceCents: s.priceCents,
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <EventSeatBooking event={eventView} seats={seatsView} />
    </div>
  );
}
