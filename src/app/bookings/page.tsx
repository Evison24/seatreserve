import { getServerSession } from 'next-auth';
import { authOptions } from 'lib/auth';
import { redirect } from 'next/navigation';
import { getMyBookings } from '@/features/bookings/server';
import type { BookingRow } from '@/features/bookings/types';
import Link from 'next/link';

export default async function BookingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/auth/signin');
  }

  const rows: BookingRow[] = await getMyBookings(session.user.id);

  rows.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const hasBookings = rows.length > 0;
  const activeCount = rows.filter((r) => r.status === 'active').length;

  const groupedByEvent = rows.reduce<Record<string, BookingRow[]>>((acc, row) => {
    const key = row.eventTitle ?? 'Untitled event';
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
    return acc;
  }, {});

  return (
    <div className="min-h-[calc(100vh-64px)] bg-grey-50">
      <div className="mx-auto max-w-6xl px-6 py-10 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">My bookings</h1>
            <p className="mt-1 text-sm text-grey-500">
              View and manage all your reserved seats across events.
            </p>
          </div>

          {hasBookings && (
            <div className="flex items-center gap-3 text-sm">
              <div className="rounded-full border border-grey-200 bg-white px-4 py-2 shadow-sm">
                <span className="font-medium">{activeCount}</span>{' '}
                <span className="text-grey-500">active</span>
              </div>
              <div className="rounded-full border border-grey-200 bg-white px-4 py-2 shadow-sm">
                <span className="font-medium">{rows.length}</span>{' '}
                <span className="text-grey-500">total</span>
              </div>
            </div>
          )}
        </div>

        {!hasBookings && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-grey-300 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-grey-100 text-grey-400">
              <span className="text-xl">🎟️</span>
            </div>
            <h2 className="text-lg font-medium">No bookings yet</h2>
            <p className="mt-1 max-w-md text-sm text-grey-500">
              You haven&apos;t reserved any seats yet. Browse events and book your first
              one.
            </p>
            <Link
              href="/events"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-black/90"
            >
              Browse events
            </Link>
          </div>
        )}

        {hasBookings && (
          <div className="space-y-8">
            {Object.entries(groupedByEvent).map(([eventTitle, bookings]) => {
              const activeForEvent = bookings.filter((b) => b.status === 'active');
              const latest = bookings.reduce(
                (acc, b) =>
                  !acc ||
                  new Date(b.createdAt).getTime() > new Date(acc.createdAt).getTime()
                    ? b
                    : acc,
                bookings[0]
              );

              return (
                <section
                  key={eventTitle}
                  className="rounded-3xl border border-grey-200 bg-white px-6 py-5 shadow-sm"
                >
                  <header className="flex flex-wrap items-start justify-between gap-4 border-b border-grey-100 pb-4">
                    <div>
                      <h2 className="text-xl font-semibold">{eventTitle}</h2>
                      <p className="mt-0.5 text-xs text-grey-500">
                        {bookings.length} seat
                        {bookings.length > 1 ? 's' : ''} reserved ·{' '}
                        {activeForEvent.length} active
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <div className="inline-flex items-center rounded-full bg-grey-100 px-3 py-1 text-grey-600">
                        <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500" />
                        Seats tied to your account
                      </div>
                    </div>
                  </header>

                  {activeForEvent.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {activeForEvent.map((b) => (
                        <span
                          key={b.id}
                          className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                        >
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Row {b.seatRow} · Seat {b.seatNumber}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 grid gap-5 md:grid-cols-[minmax(0,2.2fr)_minmax(260px,1fr)]">
                    <div className="rounded-2xl border border-grey-100 bg-grey-50/60">
                      <ul className="divide-y divide-grey-100 text-sm">
                        <li className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 text-xs font-medium text-grey-500">
                          <span>Seat</span>
                          <span>Status / Booked at</span>
                          <span className="text-right">Actions</span>
                        </li>

                        {bookings.map((r) => {
                          const isCancelled = r.status === 'cancelled';
                          return (
                            <li
                              key={r.id}
                              className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 text-xs sm:text-sm"
                            >
                              <div className="font-medium">
                                Row {r.seatRow} · Seat {r.seatNumber}
                              </div>

                              <div className="space-y-0.5 text-xs">
                                <span
                                  className={
                                    isCancelled
                                      ? 'inline-flex items-center rounded-full bg-grey-100 px-2.5 py-1 font-medium text-grey-600'
                                      : 'inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 font-medium text-emerald-700'
                                  }
                                >
                                  <span
                                    className={
                                      isCancelled
                                        ? 'mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-grey-400'
                                        : 'mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500'
                                    }
                                  />
                                  {r.status === 'active' ? 'Active' : 'Cancelled'}
                                </span>
                                <p className="text-[11px] text-grey-500">
                                  Booked at {new Date(r.createdAt).toLocaleString()}
                                </p>
                              </div>

                              {/* Action */}
                              <div className="text-right">
                                <form
                                  action={`/api/bookings/${r.id}/cancel`}
                                  method="post"
                                >
                                  <button
                                    formMethod="post"
                                    disabled={isCancelled}
                                    className="inline-flex items-center rounded-full border border-grey-300 px-3 py-1 text-xs font-medium text-grey-700 hover:bg-grey-50 disabled:cursor-not-allowed disabled:border-grey-200 disabled:text-grey-400"
                                  >
                                    {isCancelled ? 'Cancelled' : 'Cancel seat'}
                                  </button>
                                </form>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    <aside className="rounded-2xl border border-grey-200 bg-grey-50 px-5 py-4 text-sm">
                      <h3 className="text-sm font-semibold text-grey-900">
                        Booking summary
                      </h3>
                      <p className="mt-1 text-xs text-grey-500">
                        All seats for this event are connected to your account. You can
                        cancel individual seats anytime from here.
                      </p>

                      <dl className="mt-4 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <dt className="text-grey-500">Total seats</dt>
                          <dd className="font-medium text-grey-900">{bookings.length}</dd>
                        </div>
                        <div className="flex items-center justify-between">
                          <dt className="text-grey-500">Active seats</dt>
                          <dd className="font-medium text-emerald-700">
                            {activeForEvent.length}
                          </dd>
                        </div>
                        <div className="flex items-center justify-between">
                          <dt className="text-grey-500">Last booked</dt>
                          <dd className="font-medium text-grey-900">
                            {latest ? new Date(latest.createdAt).toLocaleString() : '--'}
                          </dd>
                        </div>
                      </dl>

                      <p className="mt-4 text-[11px] leading-relaxed text-grey-500">
                        Need to adjust your plans? Cancel the seats you don&apos;t need
                        anymore and they&apos;ll become available for other guests.
                      </p>
                    </aside>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
