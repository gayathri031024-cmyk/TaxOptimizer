import { useState } from "react";

export default function ImportantNotes() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-blue-900/50 bg-[#0f1730]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="flex items-center gap-2 font-medium text-white">
          <span className="flex h-5 w-5 items-center justify-center rounded-full border border-blue-400 text-xs text-blue-400">
            i
          </span>
          Important Notes And Disclaimers
        </span>
        <span className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}>⌄</span>
      </button>

      {open && (
        <div className="border-t border-blue-900/50 px-5 py-4 text-sm text-slate-300">
          <ul className="list-disc space-y-1.5 pl-4">
            <li>
              Figures shown here are computed from mocked API data for demonstration purposes and do not
              reflect real tax advice.
            </li>
            <li>
              Selling an asset may also incur transaction fees, TDS, or slippage that aren't reflected in
              these numbers.
            </li>
            <li>Please consult a tax professional before making any harvesting decisions.</li>
          </ul>
        </div>
      )}
    </div>
  );
}
