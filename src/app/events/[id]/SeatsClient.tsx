'use client';

import { useState } from 'react';
import { Seat } from '@/features/events/types';
import { Container, Typography, Button } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { useBooking } from '@/context/BookingContext';

interface Props {
  id: string;
  initialSeats: Seat[];
}

export default function SeatsClient({ id, initialSeats }: Props) {
  const [seats, setSeats] = useState<Seat[]>(initialSeats);
  const [selected, setSelected] = useState<Seat[]>([]);
  const router = useRouter();
  const { setSelectedSeats } = useBooking();

  function toggleSeat(seat: Seat) {
    if (!seat.isAvailable) return;
    setSelected((prev) =>
      prev.some((s) => s.id === seat.id)
        ? prev.filter((s) => s.id !== seat.id)
        : [...prev, seat]
    );
  }
  return (
    <Container className="py-10">
      <Typography variant="h1">Select Your Seats</Typography>

      <div className="grid grid-cols-10 gap-2 mt-6">
        {seats.map((seat) => (
          <button
            key={seat.id}
            onClick={() => toggleSeat(seat)}
            disabled={!seat.isAvailable}
            className={`p-2 rounded-md ${
              !seat.isAvailable
                ? 'bg-gray-300 cursor-not-allowed'
                : selected.some((s) => s.id === seat.id)
                ? 'bg-green-500 text-white'
                : 'bg-blue-100 hover:bg-blue-200'
            }`}
          >
            {seat.row}-{seat.number}
          </button>
        ))}
      </div>

      <div className="mt-8">
        <Button
          disabled={!selected.length}
          onClick={() => {
            setSelectedSeats(selected);
            router.push('/booking/confirm');
          }}
        >
          Continue ({selected.length})
        </Button>
      </div>
    </Container>
  );
}
