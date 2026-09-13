interface Props {
  type: 'sea' | 'truck' | 'air';
  label: string;
  value: string;
  isActive: boolean;
}

export function ResultBox({ type, label, value, isActive }: Props) {
  const styles = {
    sea: 'bg-blue-50 border-l-blue-500',
    truck: 'bg-green-50 border-l-green-500',
    air: 'bg-red-50 border-l-red-500',
  };

  return (
    <div className={`flex justify-between items-center p-2 px-3 rounded-md mb-2 border border-gray-100 transition-opacity duration-300 border-l-4 ${styles[type]} ${!isActive ? 'opacity-40 bg-gray-200 border-gray-400 border-l-gray-400' : ''}`}>
      <span className="font-bold text-[13px] text-gray-600">{label}</span>
      <span className="font-bold text-[16px] text-black">{isActive && value !== '-' ? value : '-'}</span>
    </div>
  );
}
