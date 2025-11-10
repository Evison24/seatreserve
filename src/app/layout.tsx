import { Navbar } from '@/components/layout/Navbar';
import './globals.css';
import { ReactNode } from 'react';
import { BookingProvider } from '@/context/BookingContext';

export const metadata = {
  title: 'SeatReserve',
  description: 'Book seats for your favorite events easily',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <BookingProvider>
          <Navbar />
          <main>{children}</main>
        </BookingProvider>
      </body>
    </html>
  );
}
