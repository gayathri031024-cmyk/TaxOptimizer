import type { CapitalGains, DerivedGains, Holding } from "../types";

/**
 * Derives net STCG, net LTCG and total realised capital gains
 * from a profits/losses breakdown.
 *
 *   Net Short Term Gains = stcg.profits - stcg.losses
 *   Net Long Term Gains  = ltcg.profits - ltcg.losses
 *   Realised Capital Gains = Net Short Term Gains + Net Long Term Gains
 */
export function deriveGains(cg: CapitalGains): DerivedGains {
  const stcgNet = cg.stcg.profits - cg.stcg.losses;
  const ltcgNet = cg.ltcg.profits - cg.ltcg.losses;
  return {
    stcgNet,
    ltcgNet,
    realised: stcgNet + ltcgNet,
  };
}

/**
 * Applies the effect of selecting a set of holdings (for harvesting) on
 * top of the base capital gains figures.
 *
 * For every selected holding, and for each of its stcg/ltcg buckets:
 *   - if gain > 0, it is added to the "profits" side of that bucket
 *   - if gain < 0, its magnitude is added to the "losses" side of that bucket
 *   - if gain === 0, it has no effect
 */
export function applySelections(
  base: CapitalGains,
  holdings: Holding[],
  selectedCoins: Set<string>,
): CapitalGains {
  const result: CapitalGains = {
    stcg: { ...base.stcg },
    ltcg: { ...base.ltcg },
  };

  for (const holding of holdings) {
    if (!selectedCoins.has(holdingKey(holding))) continue;

    const { stcg, ltcg } = holding;

    if (stcg.gain > 0) result.stcg.profits += stcg.gain;
    else if (stcg.gain < 0) result.stcg.losses += Math.abs(stcg.gain);

    if (ltcg.gain > 0) result.ltcg.profits += ltcg.gain;
    else if (ltcg.gain < 0) result.ltcg.losses += Math.abs(ltcg.gain);
  }

  return result;
}

/**
 * Holdings API can contain duplicate `coin` symbols (e.g. two USDC
 * entries bridged from different chains), so rows are keyed by symbol +
 * coinName to stay unique and stable across renders.
 */
export function holdingKey(holding: Holding): string {
  return `${holding.coin}__${holding.coinName}`;
}
