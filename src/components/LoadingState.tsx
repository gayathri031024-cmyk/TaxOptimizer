export default function LoadingState() {
  return (
    <div className="min-h-screen bg-[#050810]">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8 sm:px-6">
        <div className="h-8 w-56 animate-pulse rounded bg-white/5" />
        <div className="h-12 animate-pulse rounded-xl bg-white/5" />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
        <div className="h-96 animate-pulse rounded-2xl bg-white/5" />
        <p className="text-center text-sm text-slate-500">Fetching your holdings and capital gains…</p>
      </div>
    </div>
  );
}
