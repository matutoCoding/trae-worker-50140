import { getStatusColor, getStatusText } from '@/utils/format';

interface StatusBadgeProps {
  status: string;
  type?: 'collection' | 'trade' | 'auction' | 'customer';
}

export default function StatusBadge({ status, type = 'collection' }: StatusBadgeProps) {
  const colorClass = getStatusColor(status);
  const text = getStatusText(status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border ${colorClass}`}
    >
      {text}
    </span>
  );
}
