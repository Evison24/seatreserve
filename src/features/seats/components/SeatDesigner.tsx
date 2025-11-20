'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type ExistingSeat = {
  id: string;
  row: string;
  number: number;
  priceCents: number;
  isAvailable: boolean;
};

type SeatDesignerProps = {
  eventId: string;
  existingSeats: ExistingSeat[];
};

function generateRowLabels(count: number): string[] {
  const labels: string[] = [];
  for (let i = 0; i < count; i++) {
    labels.push(String.fromCharCode('A'.charCodeAt(0) + i));
  }
  return labels;
}

export default function SeatDesigner({ eventId, existingSeats }: SeatDesignerProps) {
  const router = useRouter();

  const distinctRows = Array.from(new Set(existingSeats.map((s) => s.row))).sort();
  const maxNumber = existingSeats.reduce(
    (max, s) => (s.number > max ? s.number : max),
    0
  );

  const defaultRows = distinctRows.length || 5;
  const defaultSeatsPerRow = maxNumber || 10;
  const defaultPrice = existingSeats[0]?.priceCents ?? 1000;

  const [rowsCount, setRowsCount] = useState<number>(defaultRows);
  const [seatsPerRow, setSeatsPerRow] = useState<number>(defaultSeatsPerRow);
  const [basePriceCents, setBasePriceCents] = useState<number>(defaultPrice);

  const [disabledSeatKeys, setDisabledSeatKeys] = useState<Set<string>>(() => {
    if (!existingSeats.length) return new Set();

    const allKeys: string[] = [];
    const rowLabels = generateRowLabels(defaultRows);
    for (const row of rowLabels) {
      for (let n = 1; n <= defaultSeatsPerRow; n++) {
        allKeys.push(`${row}-${n}`);
      }
    }

    const existingKeys = new Set(existingSeats.map((s) => `${s.row}-${s.number}`));

    const disabled = new Set<string>();
    for (const key of allKeys) {
      if (!existingKeys.has(key)) disabled.add(key);
    }

    return disabled;
  });

  const rowLabels = useMemo(() => generateRowLabels(rowsCount), [rowsCount]);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSeat = (row: string, seatNumber: number) => {
    const key = `${row}-${seatNumber}`;
    setDisabledSeatKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handlePreview = () => {
    const seatsPayload: Array<{
      row: string;
      number: number;
      priceCents: number;
      isAvailable: boolean;
    }> = [];

    for (const row of rowLabels) {
      for (let n = 1; n <= seatsPerRow; n++) {
        const key = `${row}-${n}`;
        if (disabledSeatKeys.has(key)) continue;

        seatsPayload.push({
          row,
          number: n,
          priceCents: basePriceCents,
          isAvailable: true,
        });
      }
    }

    console.log('Would save seats for event', eventId, seatsPayload);
    alert(`Preview in console: ${seatsPayload.length} seat(s) generated.`);
  };

  const handleSave = async () => {
    setError(null);
    setIsSaving(true);

    const rowLabelsNow = generateRowLabels(rowsCount);
    const seatsPayload: Array<{
      row: string;
      number: number;
      priceCents: number;
      isAvailable: boolean;
    }> = [];

    for (const row of rowLabelsNow) {
      for (let n = 1; n <= seatsPerRow; n++) {
        const key = `${row}-${n}`;
        if (disabledSeatKeys.has(key)) continue;

        seatsPayload.push({
          row,
          number: n,
          priceCents: basePriceCents,
          isAvailable: true,
        });
      }
    }

    try {
      const res = await fetch(`/api/events/${eventId}/seats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(seatsPayload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const msg = data?.error ?? `Failed to save seats (status ${res.status})`;
        setError(msg);
      } else {
        router.refresh();
      }
    } catch (err) {
      setError('Network error while saving seats.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-xs font-medium mb-1">Number of rows</label>
          <input
            type="number"
            min={1}
            max={26}
            value={rowsCount}
            onChange={(e) => setRowsCount(Number(e.target.value) || 1)}
            className="w-full rounded border px-2 py-1 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Seats per row</label>
          <input
            type="number"
            min={1}
            max={50}
            value={seatsPerRow}
            onChange={(e) => setSeatsPerRow(Number(e.target.value) || 1)}
            className="w-full rounded border px-2 py-1 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Base price (in cents)</label>
          <input
            type="number"
            min={0}
            value={basePriceCents}
            onChange={(e) => setBasePriceCents(Number(e.target.value) || 0)}
            className="w-full rounded border px-2 py-1 text-sm"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={handlePreview}
            className="px-3 py-2 rounded-lg border text-xs font-medium hover:bg-gray-50"
          >
            Preview payload
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-3 py-2 rounded-lg bg-black text-white text-xs font-medium disabled:opacity-60"
          >
            {isSaving ? 'Saving…' : 'Save layout'}
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="px-8 py-2 rounded-full bg-gray-800 text-white text-xs uppercase tracking-[0.2em]">
          Stage
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {rowLabels.map((row) => (
          <div key={row} className="flex items-center gap-2">
            <div className="w-6 text-xs font-semibold text-right">{row}</div>
            <div
              className="grid gap-1 flex-1"
              style={{
                gridTemplateColumns: `repeat(${seatsPerRow}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: seatsPerRow }).map((_, index) => {
                const seatNumber = index + 1;
                const key = `${row}-${seatNumber}`;
                const disabled = disabledSeatKeys.has(key);

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleSeat(row, seatNumber)}
                    className={[
                      'h-9 rounded border text-[11px] flex items-center justify-center cursor-pointer transition',
                      disabled
                        ? 'bg-gray-100 border-dashed border-gray-300 text-gray-400'
                        : 'bg-emerald-50 border-emerald-400 hover:bg-emerald-100',
                    ].join(' ')}
                  >
                    {row}
                    {seatNumber}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-gray-600 items-center">
        <div className="flex items-center gap-2">
          <div className="h-4 w-6 rounded border border-emerald-400 bg-emerald-50" />
          <span>Active seat</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-6 rounded border border-dashed border-gray-300 bg-gray-100" />
          <span>Disabled / aisle</span>
        </div>

        {error && <span className="text-red-600">• {error}</span>}
      </div>
    </div>
  );
}
