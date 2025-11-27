import { getServerSession } from 'next-auth';
import { authOptions } from 'lib/auth';
import Link from 'next/link';

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const role = user?.role ?? 'USER';

  if (!user) {
    return (
      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 md:flex-row">
        <section className="flex-1 space-y-4">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-600">
            Seat booking made simple
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            Reserve the best seats for concerts, shows and events.
          </h1>
          <p className="text-sm text-grey-600">
            Pick your exact seat on an interactive map and manage every reservation from a
            single dashboard.
          </p>

          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link
              href="/auth/register"
              className="rounded-full bg-black px-5 py-2.5 font-medium text-white hover:bg-black/90"
            >
              Get started
            </Link>
            <Link
              href="/events"
              className="rounded-full border border-grey-300 px-5 py-2.5 font-medium text-grey-800 hover:bg-grey-50"
            >
              Browse demo events
            </Link>
          </div>

          <p className="mt-3 text-xs text-grey-500">
            Log in to actually reserve seats and manage your bookings.
          </p>
        </section>

        <section className="flex-1">
          <div className="rounded-3xl border border-grey-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium text-grey-500">Preview</p>
            <p className="mt-1 text-sm font-semibold text-grey-900">
              Manage all your bookings in one place.
            </p>
            <div className="mt-4 rounded-2xl border border-grey-100 bg-grey-50 p-4 text-xs text-grey-600">
              <p>Beethoven • Tirana Opera House</p>
              <p className="mt-1">3 seats reserved · 2 active</p>
              <p className="mt-3 text-[11px] text-grey-500">
                Sign up to see your own events and reservations here.
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 space-y-8">
      <section className="rounded-3xl border border-grey-200 bg-white px-6 py-6 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-600">
          Welcome back
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Ready to book your next seat?
        </h1>
        <p className="mt-2 text-sm text-grey-600">
          Jump into upcoming events or review your current reservations.
        </p>

        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <Link
            href="/events"
            className="rounded-full bg-black px-5 py-2.5 font-medium text-white hover:bg-black/90"
          >
            Browse events
          </Link>
          <Link
            href="/bookings"
            className="rounded-full border border-grey-300 px-5 py-2.5 font-medium text-grey-800 hover:bg-grey-50"
          >
            View my bookings
          </Link>
          {role === 'ADMIN' && (
            <Link
              href="/admin/events"
              className="rounded-full border border-emerald-500 px-5 py-2.5 font-medium text-emerald-700 hover:bg-emerald-50"
            >
              Manage events
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
