import { useState } from 'react';
import { CopyOption } from '../types';

interface Props {
  copyOrder: CopyOption[];
  onUpdateOrder: (index: number, value: CopyOption) => void;
  onCopyAll: () => void;
  onResetAll: () => void;
}

const copyOptions = [
  { val: 's1', text: '🚢 Sea (Per Item)' },
  { val: 's2', text: '🚢 Sea (Total)' },
  { val: 't1', text: '🚚 Truck (Per Item)' },
  { val: 't2', text: '🚚 Truck (Total)' },
  { val: 'a1', text: '✈️ Air (Per Item)' },
  { val: 'a2', text: '✈️ Air (Total)' },
  { val: 'skip', text: '⛔ Skip/Empty' }
];

export function MasterSection({ copyOrder, onUpdateOrder, onCopyAll, onResetAll }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopyAll();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-6 pt-5 border-t-2 border-dashed border-gray-300 text-center">
      <details className="text-left bg-gray-50 p-2.5 md:p-4 rounded-lg border border-gray-300 mb-4">
        <summary className="cursor-pointer font-bold text-blue-600 outline-none">
          ⚙️ Excel Column Settings (Click to Edit Copy Order)
        </summary>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mt-2.5">
          {copyOrder.map((val, i) => (
            <div key={i}>
              <label className="text-[11px] text-gray-500 mb-0.5 block">Column {i + 1}</label>
              <select
                value={val}
                onChange={(e) => onUpdateOrder(i, e.target.value as CopyOption)}
                className="w-full p-1 border border-gray-300 rounded text-[12px] focus:outline-none focus:border-blue-500"
              >
                {copyOptions.map(opt => (
                  <option key={opt.val} value={opt.val}>{opt.text}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </details>

      <div className="flex gap-4">
        <button onClick={handleCopy} className="text-base p-4 w-full shadow-sm rounded-lg border-none cursor-pointer font-bold text-white transition-transform hover:scale-[1.02] bg-indigo-500 flex-[2]">
          🚀 Copy ALL Active (to Excel)
        </button>
        <button onClick={onResetAll} className="text-base p-4 w-full shadow-sm rounded-lg border-none cursor-pointer font-bold text-white transition-transform hover:scale-[1.02] bg-red-500 flex-1">
          🗑️ Reset ALL
        </button>
      </div>
      {copied && <div className="text-center text-green-500 text-[14px] mt-2 font-bold">Copied! Ready to paste in Excel ✅</div>}
    </div>
  );
}
