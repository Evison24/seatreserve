export default function BookingsLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <div className="h-7 w-52 rounded-md bg-gray-200 animate-pulse" />

      <div className="overflow-hidden rounded-2xl border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Event', 'Seat', 'Status', 'Booked At', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 4 }).map((_, i) => (
              <tr key={i} className="border-t animate-pulse">
                <td className="px-4 py-3">
                  <div className="h-4 w-40 rounded bg-gray-200" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-20 rounded bg-gray-200" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-16 rounded bg-gray-200" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-32 rounded bg-gray-200" />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="h-8 w-20 rounded bg-gray-200" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
