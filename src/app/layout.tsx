import type { Metadata } from 'next';
import './globals.css';
import ClientProviders from '@/components/providers/ClientProviders';
import Navbar from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'SeatReserve',
  description: 'Smart seat booking platform built with Next.js & Drizzle.',
};

export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/bg-theater.jpg')] bg-cover bg-center scale-105" />

          <div className="absolute inset-0 " />

          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.5),transparent_70%)] 
                 dark:bg-[radial-gradient(circle_at_top,rgba(30,41,59,0.4),transparent_70%)]"
          />
        </div>

        <ClientProviders>
          <Navbar />
          <main className="mx-auto max-w-6xl px-6 pt-24 pb-12">{children}</main>
        </ClientProviders>
      </body>
    </html>
  );
}
