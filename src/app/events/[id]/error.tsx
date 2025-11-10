'use client';

import { useEffect } from 'react';
import { Button, Container, Typography } from '@/components/ui';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Seat page error:', error);
  }, [error]);

  return (
    <Container className="py-10 flex flex-col items-center text-center gap-6">
      <Typography variant="h1" className="text-red-600">
        Something went wrong 😞
      </Typography>

      <Typography variant="body">
        We couldn’t load the seat information. Please try again.
      </Typography>

      <Button onClick={reset} variant="primary">
        Try Again
      </Button>
    </Container>
  );
}
