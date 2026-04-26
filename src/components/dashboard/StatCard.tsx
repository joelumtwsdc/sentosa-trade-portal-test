import { Card } from '../ui/Card';
import type { ReactNode } from 'react';

interface Props {
  label: string;
  value: string;
  subtext?: string;
  icon: ReactNode;
  trend?: { value: string; positive: boolean };
}

export function StatCard({ label, value, subtext, icon, trend }: Props) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-bold text-slate-800 leading-tight">{value}</p>
          {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
          {trend && (
            <p className={['text-xs font-medium mt-1.5', trend.positive ? 'text-green-600' : 'text-coral-500'].join(' ')}>
              {trend.positive ? '↑' : '↓'} {trend.value} vs 2024
            </p>
          )}
        </div>
        <div className="p-2.5 rounded-xl bg-teal-50 text-teal-500 flex-shrink-0 ml-3">
          {icon}
        </div>
      </div>
    </Card>
  );
}
