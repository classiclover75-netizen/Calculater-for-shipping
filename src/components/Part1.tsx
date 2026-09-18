import { useState } from 'react';
import { Part1State, CurrencyState } from '../types';
import { CurrencyConverter } from './CurrencyConverter';
import { ResultBox } from './ResultBox';

interface Props {
  currency: CurrencyState;
  state: Part1State;
  derived: { sea: number; truck: number; air: number };
  actions: {
    updateCurrency: (field: keyof CurrencyState, value: string) => void;
    updatePart1: (field: keyof Part1State, value: string | boolean) => void;
    handlePaste: (text: string) => void;
    onClear: () => void;
  };
}

export function Part1({ currency, state, derived, actions }: Props) {
  const [copied, setCopied] = useState(false);
  const [pasteText, setPasteText] = useState('');

  const handleCopy = () => {
    const s = state.activeSea ? `£${derived.sea.toFixed(2)}` : '';
    const t = state.activeTruck ? `£${derived.truck.toFixed(2)}` : '';
    const a = state.activeAir ? `£${derived.air.toFixed(2)}` : '';
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
      <CurrencyConverter currency={currency} onChange={actions.updateCurrency} />

      <div className="bg-orange-50 border-2 border-dashed border-orange-400 p-2.5 rounded-lg text-center mb-4">
        <span className="text-[12px] text-orange-900 block mb-0.5 font-bold">Paste Excel Row: (Qty | Weight | Price)</span>
        <textarea
          value={pasteText}
          onChange={handlePasteChange}
          placeholder="Paste here (Order: Qty, Weight, Price)"
          className="w-full h-10 border-none bg-transparent resize-none text-center text-[13px] text-gray-800 font-mono pt-1 outline-none focus:ring-0"
        />
        <div className="flex justify-center gap-4 mt-1">
          <label className="flex items-center gap-1 text-[12px] font-bold text-orange-900 cursor-pointer">
            <input
              type="radio"
              name="priceCurrency"
              checked={state.priceCurrency === 'GBP'}
              onChange={() => actions.updatePart1('priceCurrency', 'GBP')}
              className="w-3.5 h-3.5 cursor-pointer"
            />
            Price is GBP
          </label>
          <label className="flex items-center gap-1 text-[12px] font-bold text-orange-900 cursor-pointer">
            <input
              type="radio"
              name="priceCurrency"
              checked={state.priceCurrency === 'RMB'}
              onChange={() => actions.updatePart1('priceCurrency', 'RMB')}
              className="w-3.5 h-3.5 cursor-pointer"
            />
            Price is RMB
          </label>
        </div>
      </div>

      <div className="bg-gray-50 p-2.5 border-l-4 border-orange-500 font-bold text-gray-800 mb-4 rounded text-center">
        PART 1: Shipping Cost
      </div>

      <div className="flex gap-2.5 mb-2.5">
        <div className="flex-1 relative">
          <label className="block text-[12px] font-bold text-gray-600 mb-1">Total Items</label>
          <input
            type="number"
            value={state.items}
            onChange={(e) => actions.updatePart1('items', e.target.value)}
            placeholder="72"
            className="w-full p-2 border border-yellow-300 rounded text-[15px] text-center focus:outline-none focus:ring-1 focus:ring-blue-500 bg-yellow-50 font-bold"
          />
        </div>
        <div className="flex-1 relative">
          <label className="block text-[12px] font-bold text-gray-600 mb-1">Total Weight (Kg)</label>
          <input
            type="number"
            value={state.weight}
            onChange={(e) => actions.updatePart1('weight', e.target.value)}
            placeholder="27"
            className="w-full p-2 border border-yellow-300 rounded text-[15px] text-center focus:outline-none focus:ring-1 focus:ring-blue-500 bg-yellow-50 font-bold"
          />
        </div>
      </div>

      <div className="mb-2.5">
        <label className="block text-[12px] font-bold text-gray-600 mb-1">🇬🇧 Product Price (£)</label>
        <input
          type="number"
          value={state.price}
          onChange={(e) => actions.updatePart1('price', e.target.value)}
          placeholder="0.00"
          className="w-full p-2 rounded text-[15px] text-center focus:outline-none focus:ring-1 bg-green-50 border-2 border-green-500 text-green-800 font-bold"
        />
      </div>

      <div className="flex gap-2.5 mt-4">
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
                onChange={(e) => actions.updatePart1(item.fieldActive as any, e.target.checked)}
                className="mr-1.5 w-4 h-4 cursor-pointer"
              />
              {item.key}
            </label>
            <input
              type="number"
              value={item.rate}
              onChange={(e) => actions.updatePart1(item.fieldRate as any, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-[15px] text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>

      <div className="mt-4">
        <ResultBox type="sea" label="🚢 SEA Cost (Per Item)" isActive={state.activeSea} value={`£${derived.sea.toFixed(2)}`} />
        <ResultBox type="truck" label="🚚 TRUCK Cost (Per Item)" isActive={state.activeTruck} value={`£${derived.truck.toFixed(2)}`} />
        <ResultBox type="air" label="✈️ AIR Cost (Per Item)" isActive={state.activeAir} value={`£${derived.air.toFixed(2)}`} />
      </div>

      <div className="flex gap-2.5 mt-4">
        <button onClick={handleCopy} className="p-2.5 border-none rounded-md cursor-pointer font-bold flex-1 text-[13px] bg-green-500 text-white hover:bg-green-600 transition-colors">
          📋 Copy Costs
        </button>
        <button onClick={() => { setPasteText(''); actions.onClear(); }} className="p-2.5 border-none rounded-md cursor-pointer font-bold flex-1 text-[13px] bg-red-500 text-white hover:bg-red-600 transition-colors">
          Reset
        </button>
      </div>
      {copied && <div className="text-center text-green-500 text-[14px] mt-2 font-bold">Copied! ✅</div>}
    </div>
  );
}
