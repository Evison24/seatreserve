'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Container } from '@/components/ui';

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/events', label: 'Events' },
    { href: '/booking/confirm', label: 'My Bookings' },
  ];

  return (
    <header className="border-b bg-white shadow-sm">
      <Container className="flex items-center justify-between h-16">
        <Link href="/" className="font-semibold text-lg text-blue-600">
          SeatReserve
        </Link>

        <nav className="flex gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                'hover:text-blue-600 transition-colors',
                pathname.startsWith(link.href) && 'text-blue-600 font-semibold'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
