interface Props {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: Props) {
  return (
    <div className="min-h-screen bg-[#050810]">
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-6 py-24 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-2xl text-rose-400">
          !
        </div>
        <h2 className="text-lg font-semibold text-white">Couldn't load your data</h2>
        <p className="text-sm text-slate-400">{message}</p>
        <button
          onClick={onRetry}
          className="mt-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
