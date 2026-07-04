import CapitalGainsCard from "./components/CapitalGainsCard";
import ErrorState from "./components/ErrorState";
import HoldingsTable from "./components/HoldingsTable";
import LoadingState from "./components/LoadingState";
import { useTaxHarvesting } from "./hooks/useTaxHarvesting";

function App() {
  const {
    holdings,
    loading,
    error,
    reload,
    isSelected,
    toggleHolding,
    toggleAll,
    allSelected,
    baseCapitalGains,
    postCapitalGains,
    preHarvesting,
    postHarvesting,
    savings,
  } = useTaxHarvesting();

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!baseCapitalGains || !postCapitalGains) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
              K
            </div>
            <span className="font-semibold text-slate-800">Tax Loss Harvesting</span>
          </div>
          <span className="hidden text-sm text-slate-400 sm:block">FY 2024-25</span>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
        <div>
          <h1 className="text-xl font-semibold text-slate-800 sm:text-2xl">Harvest your losses, reduce your tax</h1>
          <p className="mt-1 text-sm text-slate-500">
            Select holdings below to see how selling them today changes your capital gains for the year.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <CapitalGainsCard
            variant="pre"
            title="Pre-Harvesting"
            subtitle="Your current realised capital gains"
            gains={preHarvesting}
            profits={{ stcg: baseCapitalGains.stcg.profits, ltcg: baseCapitalGains.ltcg.profits }}
            losses={{ stcg: baseCapitalGains.stcg.losses, ltcg: baseCapitalGains.ltcg.losses }}
          />
          <CapitalGainsCard
            variant="post"
            title="After Harvesting"
            subtitle="Based on the holdings you've selected"
            gains={postHarvesting}
            profits={{ stcg: postCapitalGains.stcg.profits, ltcg: postCapitalGains.ltcg.profits }}
            losses={{ stcg: postCapitalGains.stcg.losses, ltcg: postCapitalGains.ltcg.losses }}
            savings={savings}
          />
        </div>

        <HoldingsTable
          holdings={holdings}
          isSelected={isSelected}
          onToggle={toggleHolding}
          onToggleAll={toggleAll}
          allSelected={allSelected}
        />
      </main>

      <footer className="py-8 text-center text-xs text-slate-400">
        Built for the KoinX Frontend Intern Assignment · Data shown is mocked
      </footer>
    </div>
  );
}

export default App;
