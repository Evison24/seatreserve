import { Navbar } from '@/components/layout/Navbar';
import './globals.css';
import { ReactNode } from 'react';
import ClientProviders from '@/components/providers/ClientProviders';

export const metadata = {
  title: 'SeatReserve',
  description: 'Book seats for your favorite events easily',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <ClientProviders>
          <Navbar />
          <main>{children}</main>
        </ClientProviders>
      </body>
    </html>
  );
}
