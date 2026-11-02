import type { DerivedGains } from "../types";
import { formatCurrency } from "../utils/format";

interface Props {
  variant: "pre" | "post";
  title: string;
  gains: DerivedGains | null;
  profits: { stcg: number; ltcg: number };
  losses: { stcg: number; ltcg: number };
  savings?: number;
}

function GainRow({
  label,
  stcg,
  ltcg,
  bold,
}: {
  label: string;
  stcg: number;
  ltcg: number;
  bold?: boolean;
}) {
  return (
    <div className="grid grid-cols-3 items-baseline py-2.5">
      <span className={`text-[15px] ${bold ? "font-semibold" : "opacity-90"}`}>{label}</span>
      <span className={`text-right text-[15px] tabular-nums ${bold ? "font-semibold" : "font-medium"}`}>
        {formatCurrency(stcg)}
      </span>
      <span className={`text-right text-[15px] tabular-nums ${bold ? "font-semibold" : "font-medium"}`}>
        {formatCurrency(ltcg)}
      </span>
    </div>
  );
}

export default function CapitalGainsCard({ variant, title, gains, profits, losses, savings }: Props) {
  const isPre = variant === "pre";
  const showSavings = !isPre && savings !== undefined && savings > 0;
  const realisedLabel = isPre ? "Realised Capital Gains:" : "Effective Capital Gains:";

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-2xl p-6 text-white ${
        isPre ? "bg-[#0b0e14]" : "bg-gradient-to-br from-[#2563eb] to-[#1d4ed8]"
      }`}
    >
      <h3 className="text-xl font-semibold">{title}</h3>

      <div className="mt-5 grid grid-cols-3 text-sm">
        <span />
        <span className="text-right font-medium opacity-70">Short-term</span>
        <span className="text-right font-medium opacity-70">Long-term</span>
      </div>

      <div className={`divide-y ${isPre ? "divide-white/10" : "divide-white/15"}`}>
        <GainRow label="Profits" stcg={profits.stcg} ltcg={profits.ltcg} />
        <GainRow label="Losses" stcg={losses.stcg} ltcg={losses.ltcg} />
      </div>

      <div className="grid grid-cols-3 items-baseline pt-3 pb-1">
        <span className="text-[15px] font-semibold">Net Capital Gains</span>
        <span className="text-right text-[15px] font-semibold tabular-nums">
          {formatCurrency(gains?.stcgNet ?? 0)}
        </span>
        <span className="text-right text-[15px] font-semibold tabular-nums">
          {formatCurrency(gains?.ltcgNet ?? 0)}
        </span>
      </div>

      <div className="mt-5 flex items-baseline justify-between border-t border-white/10 pt-4">
        <span className="text-base font-semibold">{realisedLabel}</span>
        <span className="text-2xl font-bold tabular-nums">{formatCurrency(gains?.realised ?? 0)}</span>
      </div>

      {showSavings && (
        <p className="mt-3 text-sm font-medium text-white">
          🎉 Your taxable capital gains are reduced by:{" "}
          <span className="font-bold">{formatCurrency(savings ?? 0)}</span>
        </p>
      )}
    </div>
  );
}
