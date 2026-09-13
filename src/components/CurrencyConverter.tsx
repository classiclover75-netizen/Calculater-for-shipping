import { CurrencyState } from '../types';

interface Props {
  currency: CurrencyState;
  onChange: (field: keyof CurrencyState, value: string) => void;
}

export function CurrencyConverter({ currency, onChange }: Props) {
  return (
    <div className="bg-purple-100 border-2 border-purple-600 p-4 rounded-lg mb-5 text-center">
      <div className="font-bold text-purple-900 mb-2.5 text-[15px]">Step 1: Convert CNY 🇨🇳 to GBP 🇬🇧</div>
      <div className="flex gap-2.5">
        <div className="flex-1">
          <label className="block text-[12px] font-bold text-gray-600 mb-1">RMB Price (¥)</label>
          <input
            type="number"
            value={currency.cny}
            onChange={(e) => onChange('cny', e.target.value)}
            placeholder="e.g. 5.33"
            className="w-full p-2 border border-gray-300 rounded text-[15px] text-center focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1">
          <label className="block text-[12px] font-bold text-gray-600 mb-1">Exchange Rate</label>
          <input
            type="number"
            value={currency.rate}
            onChange={(e) => onChange('rate', e.target.value)}
            placeholder="e.g. 9.1"
            className="w-full p-2 border border-gray-300 rounded text-[15px] text-center focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
