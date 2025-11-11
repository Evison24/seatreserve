'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import clsx from 'clsx';
import { Container, Button } from '@/components/ui';

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

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

        <div className="flex items-center gap-3">
          {status === 'loading' ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : session ? (
            <>
              <p className="text-sm text-gray-800">
                {session.user?.name || session.user?.email}
              </p>
              <Button variant="ghost" onClick={() => signOut({ callbackUrl: '/' })}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button variant="secondary">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Register</Button>
              </Link>
            </>
          )}
        </div>
      </Container>
    </header>
  );
}
