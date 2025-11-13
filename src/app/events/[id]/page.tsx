import { getEventWithSeats } from '@/features/events/server';

export default async function EventSeatsPage(props: PageProps<'/events/[id]'>) {
  const { id } = await props.params;
  const eventId = id;
  const result = await getEventWithSeats(eventId);
  if (!result) return <div className="p-6">Event not found.</div>;

  const { event, seats } = result;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">{event.title}</h1>
      <p className="opacity-70">
        {event.venue} • {new Date(event.startsAt).toLocaleString()}
      </p>

      <div className="grid grid-cols-5 gap-2">
        {seats.map((s) => (
          <form key={s.id} action="/api/bookings" method="POST" className="inline">
            <input type="hidden" name="seatId" value={s.id} />
            <input type="hidden" name="eventId" value={event.id} />
            <button
              formMethod="POST"
              disabled={!s.isAvailable}
              className={`px-3 py-2 rounded border ${
                s.isAvailable ? '' : 'opacity-50 cursor-not-allowed'
              }`}
            >
              {s.row}
              {s.number}
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
