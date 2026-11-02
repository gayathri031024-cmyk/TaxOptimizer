import { useState } from "react";

export default function HowItWorksLink() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="text-sm font-medium text-blue-400 underline decoration-blue-400/50 underline-offset-2 hover:text-blue-300"
      >
        How it works?
      </button>

      {open && (
        <div className="absolute left-0 top-7 z-20 w-72 rounded-xl bg-white p-4 text-sm text-slate-700 shadow-xl ring-1 ring-slate-200">
          <ul className="list-disc space-y-2 pl-4">
            <li>See your capital gains for FY 2024-25 in the left card</li>
            <li>Check boxes for assets you plan on selling to reduce your tax liability</li>
            <li>Instantly see your updated tax liability in the right card</li>
          </ul>
          <p className="mt-3 text-slate-600">
            <span className="font-semibold text-slate-800">Pro tip:</span> Experiment with different
            combinations of your holdings to optimize your tax liability
          </p>
        </div>
      )}
    </div>
  );
}
