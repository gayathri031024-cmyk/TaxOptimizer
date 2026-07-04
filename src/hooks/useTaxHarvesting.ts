import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchCapitalGains, fetchHoldings } from "../api/mockApi";
import type { CapitalGains, Holding } from "../types";
import { applySelections, deriveGains, holdingKey } from "../utils/gains";

interface State {
  holdings: Holding[];
  baseCapitalGains: CapitalGains | null;
  loading: boolean;
  error: string | null;
}

export function useTaxHarvesting() {
  const [state, setState] = useState<State>({
    holdings: [],
    baseCapitalGains: null,
    loading: true,
    error: null,
  });
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const load = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: null }));
    Promise.all([fetchHoldings(), fetchCapitalGains()])
      .then(([holdings, cgRes]) => {
        setState({
          holdings,
          baseCapitalGains: cgRes.capitalGains,
          loading: false,
          error: null,
        });
      })
      .catch((err: Error) => {
        setState((s) => ({ ...s, loading: false, error: err.message || "Something went wrong" }));
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleHolding = useCallback((holding: Holding) => {
    const key = holdingKey(holding);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelected((prev) => {
      if (prev.size === state.holdings.length) return new Set();
      return new Set(state.holdings.map(holdingKey));
    });
  }, [state.holdings]);

  const isSelected = useCallback((holding: Holding) => selected.has(holdingKey(holding)), [selected]);

  const preHarvesting = useMemo(() => {
    if (!state.baseCapitalGains) return null;
    return deriveGains(state.baseCapitalGains);
  }, [state.baseCapitalGains]);

  const postCapitalGains = useMemo(() => {
    if (!state.baseCapitalGains) return null;
    return applySelections(state.baseCapitalGains, state.holdings, selected);
  }, [state.baseCapitalGains, state.holdings, selected]);

  const postHarvesting = useMemo(() => {
    if (!postCapitalGains) return null;
    return deriveGains(postCapitalGains);
  }, [postCapitalGains]);

  const savings = useMemo(() => {
    if (!preHarvesting || !postHarvesting) return 0;
    return preHarvesting.realised - postHarvesting.realised;
  }, [preHarvesting, postHarvesting]);

  return {
    holdings: state.holdings,
    loading: state.loading,
    error: state.error,
    reload: load,
    selected,
    toggleHolding,
    toggleAll,
    isSelected,
    allSelected: state.holdings.length > 0 && selected.size === state.holdings.length,
    baseCapitalGains: state.baseCapitalGains,
    postCapitalGains,
    preHarvesting,
    postHarvesting,
    savings,
  };
}
