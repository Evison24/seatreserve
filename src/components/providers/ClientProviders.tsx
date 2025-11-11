'use client';

import { SessionProvider } from 'next-auth/react';
import { BookingProvider } from '@/context/BookingContext';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <BookingProvider>{children}</BookingProvider>
    </SessionProvider>
  );
}
