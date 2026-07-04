import type { DerivedGains } from "../types";
import { formatCurrency } from "../utils/format";

interface Props {
  variant: "pre" | "post";
  title: string;
  subtitle: string;
  gains: DerivedGains | null;
  profits: { stcg: number; ltcg: number };
  losses: { stcg: number; ltcg: number };
  savings?: number;
}

function Row({
  label,
  value,
  dim,
}: {
  label: string;
  value: string;
  dim?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between py-2">
      <span className={`text-sm ${dim ? "opacity-60" : "opacity-80"}`}>{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}

function Section({
  label,
  profit,
  loss,
  net,
}: {
  label: string;
  profit: number;
  loss: number;
  net: number;
}) {
  return (
    <div className="rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide opacity-60">{label}</p>
      <Row label="Profits" value={formatCurrency(profit)} />
      <Row label="Losses" value={formatCurrency(loss)} />
      <div className="mt-1 flex items-baseline justify-between border-t border-white/10 pt-2">
        <span className="text-sm font-semibold opacity-90">Net Gain</span>
        <span className={`font-semibold tabular-nums ${net < 0 ? "text-rose-300" : "text-emerald-300"}`}>
          {formatCurrency(net)}
        </span>
      </div>
    </div>
  );
}

export default function CapitalGainsCard({
  variant,
  title,
  subtitle,
  gains,
  profits,
  losses,
  savings,
}: Props) {
  const isPre = variant === "pre";
  const showSavings = !isPre && savings !== undefined && savings > 0;

  return (
    <div
      className={`relative flex flex-col gap-4 overflow-hidden rounded-2xl p-6 text-white shadow-lg ${
        isPre
          ? "bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800"
          : "bg-gradient-to-br from-blue-700 via-blue-700 to-blue-600"
      }`}
    >
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl ${
          isPre ? "bg-slate-500/20" : "bg-blue-300/30"
        }`}
      />

      <div className="relative">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm opacity-70">{subtitle}</p>
      </div>

      <div className="relative grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Section label="Short-term" profit={profits.stcg} loss={losses.stcg} net={gains?.stcgNet ?? 0} />
        <Section label="Long-term" profit={profits.ltcg} loss={losses.ltcg} net={gains?.ltcgNet ?? 0} />
      </div>

      <div className="relative flex items-baseline justify-between rounded-xl bg-white/10 px-4 py-3">
        <span className="text-sm font-medium opacity-90">Realised Capital Gains</span>
        <span
          className={`text-xl font-bold tabular-nums ${
            (gains?.realised ?? 0) < 0 ? "text-rose-300" : "text-white"
          }`}
        >
          {formatCurrency(gains?.realised ?? 0)}
        </span>
      </div>

      {showSavings && (
        <div className="relative flex items-center gap-2 rounded-xl bg-emerald-400/15 px-4 py-3 ring-1 ring-emerald-300/40">
          <span className="text-lg">🎉</span>
          <p className="text-sm font-medium text-emerald-100">
            You're going to save <span className="font-bold text-white">{formatCurrency(savings ?? 0)}</span> in
            taxes
          </p>
        </div>
      )}
    </div>
  );
}
