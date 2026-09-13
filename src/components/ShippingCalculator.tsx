import { useCalculator } from '../hooks/useCalculator';
import { Part1 } from './Part1';
import { Part2 } from './Part2';
import { MasterSection } from './MasterSection';

export function ShippingCalculator() {
  const { state, derived, actions } = useCalculator();

  const handleCopyAll = () => {
    const formatS1 = state.part1.activeSea ? `£${derived.perItemSea.toFixed(2)}` : '';
    const formatT1 = state.part1.activeTruck ? `£${derived.perItemTruck.toFixed(2)}` : '';
    const formatA1 = state.part1.activeAir ? `£${derived.perItemAir.toFixed(2)}` : '';

    const formatS2 = state.part2.activeSea && derived.totalSea > 0 ? `£${derived.totalSea.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '';
    const formatT2 = state.part2.activeTruck && derived.totalTruck > 0 ? `£${derived.totalTruck.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '';
    const formatA2 = state.part2.activeAir && derived.totalAir > 0 ? `£${derived.totalAir.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '';

    const vals = {
      's1': formatS1,
      't1': formatT1,
      'a1': formatA1,
      's2': formatS2,
      't2': formatT2,
      'a2': formatA2,
      'skip': ''
    };

    const finalArr = state.copyOrder.map(key => vals[key as keyof typeof vals]);
    const finalString = finalArr.join('\t');
    navigator.clipboard.writeText(finalString);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-start p-5 font-sans">
      <div className="bg-white p-5 rounded-xl shadow-lg w-full max-w-5xl relative">
        <h1 className="text-center text-gray-800 mt-0 text-2xl mb-5 font-bold">Smart Auto-Sync Calculator</h1>

        <div className="flex flex-col md:flex-row gap-5 items-start">
          <Part1
            currency={state.currency}
            state={state.part1}
            derived={{ sea: derived.perItemSea, truck: derived.perItemTruck, air: derived.perItemAir }}
            actions={{
              updateCurrency: actions.updateCurrency,
              updatePart1: actions.updatePart1,
              handlePaste: actions.handlePastePart1,
              onClear: actions.clearPart1,
            }}
          />

          <div className="hidden md:block w-px bg-gray-200 self-stretch relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-1 border border-gray-200 rounded-full text-green-500 text-lg">
              ➡️
            </div>
          </div>

          <Part2
            state={state.part2}
            derived={{ sea: derived.totalSea, truck: derived.totalTruck, air: derived.totalAir }}
            actions={{
              updatePart2: actions.updatePart2,
              handlePaste: actions.handlePastePart2,
              onClear: actions.clearPart2,
            }}
          />
        </div>

        <MasterSection
          copyOrder={state.copyOrder}
          onUpdateOrder={actions.updateCopyOrder}
          onCopyAll={handleCopyAll}
          onResetAll={actions.resetAll}
        />
      </div>
    </div>
  );
}
