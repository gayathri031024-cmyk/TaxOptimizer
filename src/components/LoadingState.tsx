export default function LoadingState() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className="h-64 animate-pulse rounded-2xl bg-slate-200/70" />
        ))}
      </div>
      <div className="h-96 animate-pulse rounded-2xl bg-slate-200/70" />
      <p className="text-center text-sm text-slate-400">Fetching your holdings and capital gains…</p>
    </div>
  );
}
