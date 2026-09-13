import { useState } from 'react';
import { Part2State } from '../types';
import { ResultBox } from './ResultBox';

interface Props {
  state: Part2State;
  derived: { sea: number; truck: number; air: number };
  actions: {
    updatePart2: (field: keyof Part2State, value: string | boolean) => void;
    handlePaste: (text: string) => void;
    onClear: () => void;
  };
}

export function Part2({ state, derived, actions }: Props) {
  const [copied, setCopied] = useState(false);
  const [pasteText, setPasteText] = useState('');

  const handleCopy = () => {
    const s = state.activeSea && derived.sea > 0 ? `£${derived.sea.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '';
    const t = state.activeTruck && derived.truck > 0 ? `£${derived.truck.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '';
    const a = state.activeAir && derived.air > 0 ? `£${derived.air.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '';
    navigator.clipboard.writeText(`${s}\t${t}\t${a}`).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePasteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPasteText(e.target.value);
    actions.handlePaste(e.target.value);
  };

  return (
    <div className="flex-1 p-2.5 w-full">
      <div className="bg-gray-50 p-2.5 border-l-4 border-blue-500 font-bold text-gray-800 mb-4 rounded text-center">
        PART 2: Total Values
      </div>

      <div className="bg-blue-50 border-2 border-dashed border-blue-400 p-2.5 rounded-lg text-center mb-4">
        <span className="text-[12px] text-blue-900 block mb-0.5 font-bold">Paste Excel Row: (Qty | Sea Rate | Truck Rate | Air Rate)</span>
        <textarea
          value={pasteText}
          onChange={handlePasteChange}
          placeholder="Manual paste if needed"
          className="w-full h-10 border-none bg-transparent resize-none text-center text-[13px] text-gray-800 font-mono pt-1 outline-none focus:ring-0"
        />
      </div>

      <div className="mb-2.5">
        <label className="block text-[12px] font-bold text-gray-600 mb-1">Quantity (Synced):</label>
        <input
          type="number"
          value={state.qty}
          onChange={(e) => actions.updatePart2('qty', e.target.value)}
          className="w-full p-2 border border-yellow-300 rounded text-[15px] text-center focus:outline-none focus:ring-1 focus:ring-blue-500 bg-yellow-50 font-bold"
        />
      </div>

      <div className="flex gap-2.5 mt-2.5">
        {[
          { key: 'Sea', rate: state.rateSea, active: state.activeSea, fieldActive: 'activeSea', fieldRate: 'rateSea' },
          { key: 'Truck', rate: state.rateTruck, active: state.activeTruck, fieldActive: 'activeTruck', fieldRate: 'rateTruck' },
          { key: 'Air', rate: state.rateAir, active: state.activeAir, fieldActive: 'activeAir', fieldRate: 'rateAir' }
        ].map((item) => (
          <div key={item.key} className="flex-1 relative">
            <label className="flex items-center justify-center mb-1 text-[13px] font-bold text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={item.active}
                onChange={(e) => actions.updatePart2(item.fieldActive as any, e.target.checked)}
                className="mr-1.5 w-4 h-4 cursor-pointer"
              />
              {item.key}
            </label>
            <input
              type="number"
              value={item.rate}
              onChange={(e) => actions.updatePart2(item.fieldRate as any, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-[15px] text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>

      <div className="mt-4">
        <ResultBox type="sea" label="🚢 Sea Total" isActive={state.activeSea && derived.sea > 0} value={`£${derived.sea.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
        <ResultBox type="truck" label="🚚 Truck Total" isActive={state.activeTruck && derived.truck > 0} value={`£${derived.truck.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
        <ResultBox type="air" label="✈️ Air Total" isActive={state.activeAir && derived.air > 0} value={`£${derived.air.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
      </div>

      <div className="flex gap-2.5 mt-4">
        <button onClick={handleCopy} className="p-2.5 border-none rounded-md cursor-pointer font-bold flex-1 text-[13px] bg-green-500 text-white hover:bg-green-600 transition-colors">
          📋 Copy Totals
        </button>
        <button onClick={() => { setPasteText(''); actions.onClear(); }} className="p-2.5 border-none rounded-md cursor-pointer font-bold flex-1 text-[13px] bg-red-500 text-white hover:bg-red-600 transition-colors">
          Reset
        </button>
      </div>
      {copied && <div className="text-center text-green-500 text-[14px] mt-2 font-bold">Copied! ✅</div>}
    </div>
  );
}
