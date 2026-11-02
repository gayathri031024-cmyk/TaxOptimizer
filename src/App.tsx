import CapitalGainsCard from "./components/CapitalGainsCard";
import ErrorState from "./components/ErrorState";
import HoldingsTable from "./components/HoldingsTable";
import HowItWorksLink from "./components/HowItWorksLink";
import ImportantNotes from "./components/ImportantNotes";
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
    selected,
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
    <div className="min-h-screen bg-[#050810]">
      <main className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold text-white">Tax Optimisation</h1>
          <HowItWorksLink />
        </div>

        <ImportantNotes />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <CapitalGainsCard
            variant="pre"
            title="Pre Harvesting"
            gains={preHarvesting}
            profits={{ stcg: baseCapitalGains.stcg.profits, ltcg: baseCapitalGains.ltcg.profits }}
            losses={{ stcg: baseCapitalGains.stcg.losses, ltcg: baseCapitalGains.ltcg.losses }}
          />
          <CapitalGainsCard
            variant="post"
            title="After Harvesting"
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
          selectedCount={selected.size}
        />
      </main>

      <footer className="py-8 text-center text-xs text-slate-500">
        Built for the KoinX Frontend Intern Assignment · Data shown is mocked
      </footer>
    </div>
  );
}

export default App;
