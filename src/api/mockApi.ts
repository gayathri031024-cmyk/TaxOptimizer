import holdingsData from "./mockData/holdings.json";
import capitalGainsData from "./mockData/capitalGains.json";
import type { CapitalGainsResponse, Holding } from "../types";

const SIMULATED_LATENCY_MS = 700;

// Flip this to `true` locally to see the error state for either endpoint.
const SIMULATE_ERROR = false;

function delay<T>(value: T, ms = SIMULATED_LATENCY_MS): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (SIMULATE_ERROR) {
        reject(new Error("Network request failed"));
        return;
      }
      resolve(value);
    }, ms);
  });
}

/**
 * Mocks: GET /api/holdings
 * In a real backend this would fetch the user's on-chain / exchange
 * holdings along with pre-computed STCG / LTCG balances and gains.
 */
export function fetchHoldings(): Promise<Holding[]> {
  return delay(holdingsData as Holding[]);
}

/**
 * Mocks: GET /api/capital-gains
 * In a real backend this would be the user's realised capital gains
 * for the financial year, computed from their transaction history.
 */
export function fetchCapitalGains(): Promise<CapitalGainsResponse> {
  return delay(capitalGainsData as CapitalGainsResponse);
}
