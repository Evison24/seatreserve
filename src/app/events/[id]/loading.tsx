export default function EventDetailLoading() {
  return (
    <div className="p-6 space-y-4 max-w-4xl mx-auto">
      <div className="space-y-2 animate-pulse">
        <div className="h-7 w-60 rounded bg-gray-200" />
        <div className="h-4 w-48 rounded bg-gray-200" />
      </div>

      <div className="grid grid-cols-5 gap-2 mt-4">
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} className="h-9 rounded border bg-gray-100 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
