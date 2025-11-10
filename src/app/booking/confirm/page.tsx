'use client';

import { useBooking } from '@/context/BookingContext';
import { Container, Typography, Button } from '@/components/ui';

export default function ConfirmPage() {
  const { selectedSeats, clearBooking } = useBooking();

  return (
    <Container className="py-10 flex flex-col gap-4">
      <Typography variant="h1">Booking Confirmation</Typography>
      <Typography variant="body">
        Seats selected:{' '}
        {selectedSeats.length
          ? selectedSeats.map((s) => `${s.row}-${s.number}`).join(', ')
          : 'None'}
      </Typography>

      <Button
        onClick={() => {
          alert('Booking confirmed!');
          clearBooking();
        }}
      >
        Confirm Booking
      </Button>
    </Container>
  );
}
