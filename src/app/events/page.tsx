import { getEvents } from '@/features/events/api';
import { Card, Button, Typography, Container } from '@/components/ui';
import Link from 'next/link';

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <Container className="py-10 flex flex-col gap-6">
      <Typography variant="h1">Available Events</Typography>
      {events.map((event) => (
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
      ))}
    </Container>
  );
}
