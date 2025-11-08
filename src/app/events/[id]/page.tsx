import EventSeatsPage from './seats-page';

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EventSeatsPage id={id} />;
}
