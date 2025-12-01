'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { LinkButton } from '../ui/LinkButton';

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;
  const role = (user?.role as 'USER' | 'ADMIN' | undefined) ?? 'USER';
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex justify-center px-3 pt-3">
      <div
        className="
    mx-auto flex w-full max-w-6xl items-center justify-between
    rounded-full border px-4 py-2 text-sm backdrop-blur-2xl
    border-black/5 bg-white/80 text-slate-900 shadow-[0_18px_40px_rgba(15,23,42,0.20)]
    dark:border-white/10 dark:bg-slate-900/75 dark:text-slate-50 dark:shadow-[0_18px_60px_rgba(0,0,0,0.65)]
  "
      >
        {/* LEFT SIDE */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div
              className="
              flex h-9 w-9 items-center justify-center rounded-2xl 
              bg-[linear-gradient(135deg,#b2202a,#3a0005)]
              text-xs font-bold text-slate-50
              shadow-[0_0_15px_rgba(178,32,42,0.7)]
            "
            >
              SR
            </div>
            <span className="hidden text-xs font-semibold tracking-tight text-primary dark:text-slate-100 sm:inline">
              SeatReserve
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 text-xs text-slate-200 md:flex">
            <NavPill href="/events">Events</NavPill>

            {user && <NavPill href="/bookings">My bookings</NavPill>}

            {role === 'ADMIN' && (
              <NavPill href="/admin/events" variant="accent">
                Admin
              </NavPill>
            )}
          </nav>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2">
          {/* --- Not Logged In --- */}
          {!user && (
            <div className="hidden items-center gap-2 sm:flex">
              <LinkButton href="/auth/signin" variant="secondary" size="sm">
                Sign in
              </LinkButton>

              <LinkButton href="/auth/register" variant="primary" size="sm">
                Get started
              </LinkButton>
            </div>
          )}
          {/* Theme */}
          <ThemeToggle />
          {/* --- Logged In --- */}
          {user && (
            <div className="flex items-center gap-2">
              {/* Avatar */}
              <div
                className="
                flex h-8 w-8 items-center justify-center rounded-full 
                bg-slate-800 text-[11px] font-medium text-slate-100
              "
              >
                {user.name
                  ? user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()
                  : (user.email ?? '?')[0].toUpperCase()}
              </div>

              {/* Sign out */}
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="
                  hidden sm:inline rounded-full border border-primary/50 
                  px-3 py-1 text-[11px] dark:text-slate-300 
                  transition dark:hover:border-white/30
                   dark:hover:bg-white/5
                  hover:bg-primary/15
                "
              >
                Sign out
              </button>
            </div>
          )}

          {/* --- Mobile --- */}
          <div className="flex items-center gap-1 sm:hidden">
            {!user && (
              <Link
                href="/auth/signin"
                className="rounded-full border border-white/20 px-3 py-1 text-[11px] text-slate-100 hover:bg-white/5"
              >
                Sign in
              </Link>
            )}

            {user && (
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="rounded-full border border-primary px-3 py-1 text-[11px] text-slate-100 hover:bg-white/5"
              >
                Sign out
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex cursor-pointer items-center justify-center rounded-full border border-white/20 px-2.5 py-1 text-[11px] text-slate-100 transition hover:bg-white/5"
            >
              Menu
            </button>

            {/* Mobile Menu */}
            {menuOpen && (
              <div
                className="
                absolute right-3 top-12 w-40 rounded-2xl 
                border border-white/10 bg-slate-900/95 
                p-2 text-[11px] shadow-[0_16px_40px_rgba(0,0,0,0.8)] 
                backdrop-blur-xl
              "
              >
                <MobileLink href="/events">Events</MobileLink>
                {user && <MobileLink href="/bookings">My bookings</MobileLink>}
                {role === 'ADMIN' && <MobileLink href="/admin/events">Admin</MobileLink>}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

type NavPillProps = {
  href: string;
  children: React.ReactNode;
  variant?: 'default' | 'accent';
};

function NavPill({ href, children, variant = 'default' }: NavPillProps) {
  const base = 'rounded-full px-3 py-1 transition border text-xs';

  const styles =
    variant === 'accent'
      ? `
        border-[var(--color-primary)]/40 
        bg-[var(--color-primary)]/15 
        text-[var(--color-primary)]
        hover:bg-[var(--color-primary)]/25
      `
      : `
        border-transparent 
        text-primary
        dark:text-white
        hover:border-slate-500/50 
        hover:bg-white/5
      `;

  return (
    <Link href={href} className={`${base} ${styles}`}>
      {children}
    </Link>
  );
}

function MobileLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block rounded-xl px-3 py-1.5 text-slate-200 hover:bg-[var(--color-primary)]/20"
    >
      {children}
    </Link>
  );
}
