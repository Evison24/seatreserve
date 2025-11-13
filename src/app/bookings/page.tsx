import { getServerSession } from 'next-auth';
import { authOptions } from 'lib/auth';
import { redirect } from 'next/navigation';
import { getMyBookings } from '@/features/bookings/server';
import type { BookingRow } from '@/features/bookings/types';

export default async function BookingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect('/auth/login');
  }

  const rows: BookingRow[] = await getMyBookings(session.user.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">My Bookings</h1>

      <div className="overflow-hidden rounded-2xl border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3">Event</th>
              <th className="text-left px-4 py-3">Seat</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-left px-4 py-3">Booked At</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-3">{r.eventTitle}</td>
                <td className="px-4 py-3">
                  {r.seatRow}
                  {r.seatNumber}
                </td>
                <td className="px-4 py-3 capitalize">{r.status}</td>
                <td className="px-4 py-3">{new Date(r.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3 text-right">
                  {/* TO DO: correctly implement cancel button here */}
                  {/* <form action={`/api/bookings`} method="post">
                    <input type="hidden" name="bookingId" value={r.id} />
                    <input type="hidden" name="_action" value="cancel" />
                    <button className="underline">Cancel</button>
                  </form> */}
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-center text-gray-500" colSpan={5}>
                  No bookings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
