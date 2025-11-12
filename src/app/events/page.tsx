import { unstable_noStore as noStore } from 'next/cache';
import { getEventsServer } from '@/features/events/server';
import { Card, Button, Typography, Container } from '@/components/ui';
import Link from 'next/link';

export default async function EventsPage() {
  // Ensure this page is rendered dynamically on each request (SSR showcase).
  noStore();

  const events = await getEventsServer();

  return (
    <Container className="py-10 flex flex-col gap-6">
      <Typography variant="h1">Available Events</Typography>
      {events.length === 0 ? (
        <Typography variant="body" className="text-gray-500">
          No events yet. Create one in Admin or seed dev data.
        </Typography>
      ) : (
        events.map((event) => (
          <Card key={event.id} className="flex items-center justify-between">
            <div>
              <Typography variant="h2">{event.title}</Typography>
              <Typography variant="body">
                {event.date} • {event.location}
              </Typography>
            </div>
            <Link href={`/events/${event.id}`}>
              <Button>View Seats</Button>
            </Link>
          </Card>
        ))
      )}
    </Container>
  );
}
