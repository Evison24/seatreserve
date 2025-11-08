'use client';
import { Container, Typography, Button } from '@/components/ui';

export default function ConfirmPage() {
  const seats =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('seats')?.split(',')
      : [];

  return (
    <Container className="py-10 flex flex-col gap-4">
      <Typography variant="h1">Booking Confirmation</Typography>
      <Typography variant="body">
        Seats selected: {seats?.length ? seats.join(', ') : 'None'}
      </Typography>
      <Button onClick={() => alert('Booking confirmed!')}>Confirm Booking</Button>
    </Container>
  );
}
