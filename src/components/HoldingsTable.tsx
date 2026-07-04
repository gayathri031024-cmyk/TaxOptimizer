import { useMemo, useState } from "react";
import type { Holding } from "../types";
import { formatCurrency, formatPrice, formatQuantity } from "../utils/format";
import { holdingKey } from "../utils/gains";

interface Props {
  holdings: Holding[];
  isSelected: (holding: Holding) => boolean;
  onToggle: (holding: Holding) => void;
  onToggleAll: () => void;
  allSelected: boolean;
}

const COLLAPSED_ROW_COUNT = 8;

function GainCell({ gain, balance }: { gain: number; balance: number }) {
  const positive = gain > 0;
  const negative = gain < 0;
  return (
    <div className="flex flex-col">
      <span
        className={`font-medium tabular-nums ${
          positive ? "text-emerald-600" : negative ? "text-rose-600" : "text-slate-500"
        }`}
      >
        {formatCurrency(gain, { signed: true })}
      </span>
      <span className="text-xs text-slate-400">bal: {formatQuantity(balance)}</span>
    </div>
  );
}

export default function HoldingsTable({ holdings, isSelected, onToggle, onToggleAll, allSelected }: Props) {
  const [showAll, setShowAll] = useState(false);

  const visibleHoldings = useMemo(
    () => (showAll ? holdings : holdings.slice(0, COLLAPSED_ROW_COUNT)),
    [holdings, showAll],
  );

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-800">Holdings</h3>
        <span className="text-xs text-slate-400">{holdings.length} assets</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
              <th className="w-10 py-2 pr-2">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleAll}
                  aria-label="Select all holdings"
                  className="h-4 w-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="py-2 pr-4">Asset</th>
              <th className="py-2 pr-4">Holdings / Avg Buy Price</th>
              <th className="py-2 pr-4">Current Price</th>
              <th className="py-2 pr-4">Short-Term Gain</th>
              <th className="py-2 pr-4">Long-Term Gain</th>
              <th className="py-2 pr-2">Amount to Sell</th>
            </tr>
          </thead>
          <tbody>
            {visibleHoldings.map((holding) => {
              const selected = isSelected(holding);
              return (
                <tr
                  key={holdingKey(holding)}
                  onClick={() => onToggle(holding)}
                  className={`cursor-pointer border-b border-slate-50 transition-colors last:border-0 ${
                    selected ? "bg-blue-50/70" : "hover:bg-slate-50"
                  }`}
                >
                  <td className="py-3 pr-2">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => onToggle(holding)}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Select ${holding.coin}`}
                      className="h-4 w-4 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={holding.logo}
                        alt={holding.coin}
                        className="h-6 w-6 rounded-full bg-slate-100 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.visibility = "hidden";
                        }}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800">{holding.coin}</span>
                        <span className="max-w-[160px] truncate text-xs text-slate-400">{holding.coinName}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-col">
                      <span className="text-slate-700">{formatQuantity(holding.totalHolding)}</span>
                      <span className="text-xs text-slate-400">avg {formatPrice(holding.averageBuyPrice)}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-slate-700">{formatPrice(holding.currentPrice)}</td>
                  <td className="py-3 pr-4">
                    <GainCell gain={holding.stcg.gain} balance={holding.stcg.balance} />
                  </td>
                  <td className="py-3 pr-4">
                    <GainCell gain={holding.ltcg.gain} balance={holding.ltcg.balance} />
                  </td>
                  <td className="py-3 pr-2 text-slate-700">
                    {selected ? formatQuantity(holding.totalHolding) : <span className="text-slate-300">—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {holdings.length > COLLAPSED_ROW_COUNT && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setShowAll((v) => !v)}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            {showAll ? "Show less" : `View all ${holdings.length} holdings`}
          </button>
        </div>
      )}
    </div>
  );
}
