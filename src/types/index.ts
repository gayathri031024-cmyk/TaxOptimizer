export interface GainBucket {
  balance: number;
  gain: number;
}

export interface Holding {
  coin: string;
  coinName: string;
  logo: string;
  currentPrice: number;
  totalHolding: number;
  averageBuyPrice: number;
  stcg: GainBucket;
  ltcg: GainBucket;
}

export interface ProfitLoss {
  profits: number;
  losses: number;
}

export interface CapitalGains {
  stcg: ProfitLoss;
  ltcg: ProfitLoss;
}

export interface CapitalGainsResponse {
  capitalGains: CapitalGains;
}

export interface DerivedGains {
  stcgNet: number;
  ltcgNet: number;
  realised: number;
}
