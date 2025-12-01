'use client';

import { SessionProvider } from 'next-auth/react';
import { BookingProvider } from '@/context/BookingContext';
import { ThemeProvider } from 'next-themes';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>
        <BookingProvider>{children}</BookingProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
