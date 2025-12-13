export function SidebarSkeleton() {
  return (
    <div className="h-full w-full animate-pulse space-y-6 bg-gray-50 p-6">
      <div className="flex gap-2">
        <div className="h-8 w-24 rounded bg-gray-200" />
        <div className="h-8 w-16 rounded bg-gray-200" />
      </div>
      <div className="space-y-2">
        <div className="h-5 w-16 rounded bg-gray-200" />
        <div className="flex gap-2">
          <div className="h-8 w-12 rounded bg-gray-200" />
          <div className="h-8 w-16 rounded bg-gray-200" />
          <div className="h-8 w-16 rounded bg-gray-200" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-5 w-24 rounded bg-gray-200" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 w-full rounded bg-gray-200" />
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-5 w-32 rounded bg-gray-200" />
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-10 w-full rounded bg-gray-200" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ContentSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex animate-pulse items-center gap-3">
          <div className="h-10 w-10 rounded bg-gray-200" />
          <div className="space-y-2">
            <div className="h-5 w-32 rounded bg-gray-200" />
            <div className="h-4 w-48 rounded bg-gray-200" />
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="grid animate-pulse grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="space-y-3 rounded-lg border border-gray-200 p-4"
            >
              <div className="h-32 w-full rounded bg-gray-200" />
              <div className="h-5 w-3/4 rounded bg-gray-200" />
              <div className="h-4 w-full rounded bg-gray-200" />
              <div className="h-4 w-2/3 rounded bg-gray-200" />
              <div className="flex gap-2">
                <div className="h-4 w-16 rounded bg-gray-200" />
                <div className="h-4 w-20 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
