import { useMemo, useRef, useState, useEffect } from "react";
import type { Holding } from "../types";
import { formatCurrency, formatPrice, formatQuantity } from "../utils/format";
import { holdingKey } from "../utils/gains";

interface Props {
  holdings: Holding[];
  isSelected: (holding: Holding) => boolean;
  onToggle: (holding: Holding) => void;
  onToggleAll: () => void;
  allSelected: boolean;
  selectedCount: number;
}

const COLLAPSED_ROW_COUNT = 8;

type SortDir = "asc" | "desc" | null;

function GainCell({ gain, balance }: { gain: number; balance: number }) {
  const positive = gain > 0;
  const negative = gain < 0;
  return (
    <div className="flex flex-col" title={formatCurrency(gain, { signed: true })}>
      <span
        className={`font-medium tabular-nums ${
          positive ? "text-emerald-600" : negative ? "text-rose-600" : "text-slate-500"
        }`}
      >
        {formatCurrency(gain, { signed: true })}
      </span>
      <span className="text-xs text-slate-400">{formatQuantity(balance)}</span>
    </div>
  );
}

export default function HoldingsTable({
  holdings,
  isSelected,
  onToggle,
  onToggleAll,
  allSelected,
  selectedCount,
}: Props) {
  const [showAll, setShowAll] = useState(false);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const headerCheckboxRef = useRef<HTMLInputElement>(null);

  const indeterminate = selectedCount > 0 && !allSelected;

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const sortedHoldings = useMemo(() => {
    if (!sortDir) return holdings;
    const copy = [...holdings];
    copy.sort((a, b) => (sortDir === "asc" ? a.stcg.gain - b.stcg.gain : b.stcg.gain - a.stcg.gain));
    return copy;
  }, [holdings, sortDir]);

  const visibleHoldings = useMemo(
    () => (showAll ? sortedHoldings : sortedHoldings.slice(0, COLLAPSED_ROW_COUNT)),
    [sortedHoldings, showAll],
  );

  const toggleSort = () => {
    setSortDir((prev) => (prev === null ? "desc" : prev === "desc" ? "asc" : null));
  };

  return (
    <div className="rounded-2xl bg-[#0b0e14] p-4 text-white sm:p-6">
      <h3 className="mb-4 text-xl font-semibold">Holdings</h3>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-[13px] text-slate-400">
              <th className="w-10 py-3 pr-2">
                <input
                  ref={headerCheckboxRef}
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleAll}
                  aria-label="Select all holdings"
                  className="h-4 w-4 cursor-pointer rounded border-slate-500 bg-transparent text-blue-500 focus:ring-blue-500"
                />
              </th>
              <th className="py-3 pr-4 font-medium">Asset</th>
              <th className="py-3 pr-4 font-medium">
                Holdings
                <br />
                <span className="text-slate-500">Avg Buy Price</span>
              </th>
              <th className="py-3 pr-4 font-medium">Current Price</th>
              <th className="py-3 pr-4 font-medium">
                <button
                  onClick={toggleSort}
                  className="inline-flex items-center gap-1 font-medium text-slate-400 hover:text-white"
                >
                  {sortDir && <span className="text-[10px]">{sortDir === "asc" ? "▲" : "▼"}</span>}
                  Short-Term
                </button>
              </th>
              <th className="py-3 pr-4 font-medium">Long-Term</th>
              <th className="py-3 pr-2 font-medium">Amount to Sell</th>
            </tr>
          </thead>
          <tbody>
            {visibleHoldings.map((holding) => {
              const selected = isSelected(holding);
              return (
                <tr
                  key={holdingKey(holding)}
                  onClick={() => onToggle(holding)}
                  className={`cursor-pointer border-b border-white/5 transition-colors last:border-0 ${
                    selected ? "bg-blue-500/10" : "hover:bg-white/[0.03]"
                  }`}
                >
                  <td className="py-3.5 pr-2">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => onToggle(holding)}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Select ${holding.coin}`}
                      className="h-4 w-4 cursor-pointer rounded border-slate-500 bg-transparent text-blue-500 focus:ring-blue-500"
                    />
                  </td>
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={holding.logo}
                        alt={holding.coin}
                        className="h-7 w-7 rounded-full bg-white/5 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.visibility = "hidden";
                        }}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium text-white">{holding.coin}</span>
                        <span className="max-w-[170px] truncate text-xs text-slate-400">{holding.coinName}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4">
                    <div className="flex flex-col">
                      <span className="text-slate-200">
                        {formatQuantity(holding.totalHolding)} {holding.coin}
                      </span>
                      <span className="text-xs text-slate-500">
                        {formatPrice(holding.averageBuyPrice)}/{holding.coin}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4 text-slate-200">{formatPrice(holding.currentPrice)}</td>
                  <td className="py-3.5 pr-4">
                    <GainCell gain={holding.stcg.gain} balance={holding.stcg.balance} />
                  </td>
                  <td className="py-3.5 pr-4">
                    <GainCell gain={holding.ltcg.gain} balance={holding.ltcg.balance} />
                  </td>
                  <td className="py-3.5 pr-2 text-slate-200">
                    {selected ? (
                      `${formatQuantity(holding.totalHolding)} ${holding.coin}`
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {holdings.length > COLLAPSED_ROW_COUNT && (
        <button
          onClick={() => setShowAll((v) => !v)}
          className="mt-4 text-sm font-medium text-blue-400 hover:text-blue-300"
        >
          {showAll ? "Show less" : "View All"}
        </button>
      )}
    </div>
  );
}
