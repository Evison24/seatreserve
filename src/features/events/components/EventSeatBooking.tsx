'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type EventView = {
  id: string;
  title: string;
  description: string | null;
  venue: string;
  startsAt: string;
  endsAt: string;
};

type SeatView = {
  id: string;
  row: string;
  number: number;
  isAvailable: boolean;
  priceCents: number;
};

type Props = {
  event: EventView;
  seats: SeatView[];
};

export default function EventSeatBooking({ event, seats }: Props) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sortedSeats = useMemo(() => {
    return [...seats].sort((a, b) => {
      if (a.row === b.row) return a.number - b.number;
      return a.row.localeCompare(b.row);
    });
  }, [seats]);

  const rows = useMemo(() => {
    const map = new Map<string, SeatView[]>();
    for (const seat of sortedSeats) {
      if (!map.has(seat.row)) map.set(seat.row, []);
      map.get(seat.row)!.push(seat);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [sortedSeats]);

  const selectedSeats = useMemo(
    () => seats.filter((s) => selectedIds.has(s.id)),
    [seats, selectedIds]
  );

  const totalPriceCents = selectedSeats.reduce((sum, s) => sum + s.priceCents, 0);

  const toggleSeat = (seat: SeatView) => {
    if (!seat.isAvailable) return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(seat.id)) {
        next.delete(seat.id);
      } else {
        next.add(seat.id);
      }
      return next;
    });
  };

  const handleConfirm = async () => {
    if (selectedSeats.length === 0) return;
    setError(null);
    setIsSubmitting(true);

    try {
      for (const seat of selectedSeats) {
        const res = await fetch('/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            eventId: event.id,
            seatId: seat.id,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          const msg =
            data?.error ?? `Failed to create booking for seat ${seat.row}${seat.number}`;
          setError(msg);
          setIsSubmitting(false);
          return;
        }
      }

      router.push('/bookings');
    } catch {
      setError('Network error while creating bookings.');
      setIsSubmitting(false);
    }
  };

  const startsAtDate = new Date(event.startsAt);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{event.title}</h1>
          <p className="text-sm text-gray-600">
            {event.venue} • {startsAtDate.toLocaleString()}
          </p>
          {event.description && (
            <p className="text-sm text-gray-500 max-w-xl">{event.description}</p>
          )}
        </div>

        <div className="flex flex-col items-start gap-2 md:items-end text-sm">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 bg-gray-50">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-gray-700">
              Select your seats below
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Click on available seats to select them. You can choose multiple seats and
            confirm in one step.
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="px-10 py-2 rounded-full bg-gray-900 text-white text-xs uppercase tracking-[0.25em]">
              Stage
            </div>
          </div>

          <div className="mt-2 rounded-2xl border bg-white p-4 shadow-sm space-y-3">
            {rows.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-6">
                No seats configured for this event yet.
              </p>
            )}

            {rows.map(([rowLabel, rowSeats]) => (
              <div key={rowLabel} className="flex items-center gap-2">
                <div className="w-6 text-xs font-semibold text-right text-gray-600">
                  {rowLabel}
                </div>
                <div
                  className="grid gap-1 flex-1"
                  style={{
                    gridTemplateColumns: `repeat(${rowSeats.length}, minmax(0, 1fr))`,
                  }}
                >
                  {rowSeats.map((seat) => {
                    const selected = selectedIds.has(seat.id);
                    const unavailable = !seat.isAvailable;

                    const baseClasses =
                      'h-9 rounded border text-[11px] flex items-center justify-center cursor-pointer transition';
                    let variantClasses = '';

                    if (unavailable) {
                      variantClasses =
                        'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed line-through';
                    } else if (selected) {
                      variantClasses =
                        'bg-emerald-500 border-emerald-600 text-white shadow-sm';
                    } else {
                      variantClasses =
                        'bg-emerald-50 border-emerald-400 text-emerald-900 hover:bg-emerald-100';
                    }

                    return (
                      <button
                        key={seat.id}
                        type="button"
                        disabled={unavailable}
                        onClick={() => toggleSeat(seat)}
                        className={`${baseClasses} ${variantClasses}`}
                      >
                        {seat.row}
                        {seat.number}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <div className="h-4 w-6 rounded border border-emerald-400 bg-emerald-50" />
              <span>Available seat</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-6 rounded border border-emerald-600 bg-emerald-500" />
              <span>Selected seat</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-6 rounded border border-gray-300 bg-gray-100 line-through" />
              <span>Already booked</span>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border bg-white p-4 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold">Your selection</h2>

            {selectedSeats.length === 0 ? (
              <p className="text-xs text-gray-500">
                No seats selected yet. Click on the green seats in the map to choose where
                you want to sit.
              </p>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map((s) => (
                    <span
                      key={s.id}
                      className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2 py-1 text-[11px] text-emerald-900"
                    >
                      {s.row}
                      {s.number}
                      <button
                        type="button"
                        onClick={() => toggleSeat(s)}
                        className="ml-1 text-[10px] text-emerald-700 hover:text-emerald-900"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {selectedSeats.length} seat
                    {selectedSeats.length > 1 ? 's' : ''}
                  </span>
                  <span className="font-semibold">
                    {(totalPriceCents / 100).toLocaleString(undefined, {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </span>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleConfirm}
              disabled={selectedSeats.length === 0 || isSubmitting}
              className="w-full mt-2 rounded-lg bg-black text-white text-sm font-medium px-4 py-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? 'Confirming...'
                : selectedSeats.length === 0
                ? 'Select seats to continue'
                : 'Confirm booking'}
            </button>

            {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
          </div>

          <div className="rounded-2xl border bg-gray-50 p-4 text-xs text-gray-600 space-y-1">
            <p>
              Bookings are tied to your account. You can review and cancel them anytime
              from the <strong>My Bookings</strong> page.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
