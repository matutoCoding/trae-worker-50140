import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  subtitle?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  subtitle,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-card p-6 card-hover border border-paper-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-warm-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-ink-800 font-serif">{value}</p>
          {trend && (
            <p
              className={`text-xs mt-2 ${
              trendUp ? 'text-emerald-600' : 'text-warm-gray-500'
            }`}
            >
              {trend}
            </p>
          )}
          {subtitle && (
            <p className="text-xs text-warm-gray-400 mt-2">{subtitle}</p>
          )}
        </div>
        <div className="w-12 h-12 rounded-xl bg-bronze-100 flex items-center justify-center">
          <Icon className="w-6 h-6 text-bronze-600" />
        </div>
      </div>
    </div>
  );
}
