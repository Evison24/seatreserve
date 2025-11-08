import Link from 'next/link';
import { Button } from '@/components/ui';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-4xl font-bold">SeatReserve</h1>

      <Link href="/events">
        <Button variant="primary">Go to Events</Button>
      </Link>
    </main>
  );
}
