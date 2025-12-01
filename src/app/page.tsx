import { getServerSession } from 'next-auth';
import { authOptions } from 'lib/auth';
import Link from 'next/link';
import { LinkButton } from '@/components/ui/LinkButton';
import { Typography } from '@/components/ui';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const role = user?.role ?? 'USER';

  if (!user) {
    // Logged-out view
    return (
      <main className="flex flex-col gap-10 md:flex-row md:items-center">
        {/* Left: hero text */}
        <section className="flex-1 space-y-4">
          <p className="inline-flex items-center gap-2 rounded-full border border-gray/50 bg-primary/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-sky-200">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Seat booking made simple
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Reserve the best seats for concerts, shows and events.
          </h1>

          <Typography variant="body">
            Pick your exact seat on an interactive map and manage every reservation from a
            single dashboard. No chaos, no guesswork.
          </Typography>
          {/* <p className="text-sm text-slate-300">
            Pick your exact seat on an interactive map and manage every reservation from a
            single dashboard. No chaos, no guesswork.
          </p> */}

          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <LinkButton href="/auth/register" variant="primary" size="sm">
              Get started
            </LinkButton>
            <LinkButton href="/events" variant="basic">
              Browse demo events
            </LinkButton>
          </div>

          <Typography variant="caption">
            Log in to actually reserve seats and manage your bookings.
          </Typography>

          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-400">
            <span className="rounded-full border border-slate-500/50 bg-slate-900/70 px-3 py-1">
              Next.js · TypeScript · Tailwind
            </span>
            <span className="rounded-full border border-slate-500/50 bg-slate-900/70 px-3 py-1">
              Drizzle ORM · Neon · NextAuth
            </span>
          </div>
        </section>

        {/* Right: preview card */}
        <section className="flex-1">
          <div className="rounded-3xl border border-slate-600/40 dark:bg-slate-900/80 bg-white  p-5 shadow-[0_20px_60px_rgba(15,23,42,0.9)] backdrop-blur-xl">
            {/* <p className="text-xs font-medium text-slate-300">Preview</p> */}
            <Typography variant="caption">Preview</Typography>
            {/* <p className="mt-1 text-sm font-semibold text-slate-50">
              Manage all your bookings in one place.
            </p> */}
            <Typography variant="body">Manage all your bookings in one place.</Typography>
            <div className="mt-4 rounded-2xl border border-slate-700/70 dark:bg-slate-950/85  bg-[var(--color-gradient-primary)] p-4 text-xs text-slate-200">
              <p>Beethoven • Tirana Opera House</p>
              <p className="mt-1 text-slate-400">Row B · Seats 7, 8, 9</p>
              <p className="mt-3 text-[11px] text-slate-400">
                Sign up to see your own events and reservations here.
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Logged-in view
  return (
    <main className="space-y-8">
      <section
        className="
    rounded-3xl border px-6 py-6
    border-slate-200/70 bg-white/75
    shadow-[0_22px_55px_rgba(15,23,42,0.18)]
    backdrop-blur-md
    dark:border-slate-700/60 dark:bg-slate-900/85
    dark:shadow-[0_22px_65px_rgba(0,0,0,0.75)]
  "
      >
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          Welcome back
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight dark:text-slate-50 text-black/90">
          Ready to book your next seat?
        </h1>
        <p className="mt-2 text-sm text-gray/70">
          Jump into upcoming events or review your current reservations.
        </p>

        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <LinkButton href="/events" variant="primary" size="md">
            Browse events
          </LinkButton>

          <LinkButton href="/bookings" size="md">
            View my bookings
          </LinkButton>
          {role === 'ADMIN' && (
            <LinkButton href="/admin/events" size="md">
              Manage events
            </LinkButton>
          )}
        </div>
      </section>
    </main>
  );
}
