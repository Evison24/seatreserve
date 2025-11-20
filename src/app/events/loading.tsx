export default function EventsLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <div className="h-8 w-44 rounded-md bg-gray-200 animate-pulse" />

      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl border px-4 py-3 animate-pulse"
          >
            <div className="space-y-2">
              <div className="h-4 w-64 rounded bg-gray-200" />
              <div className="h-3 w-40 rounded bg-gray-200" />
            </div>
            <div className="h-9 w-24 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
