import {
  Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Line, ComposedChart, Legend,
} from 'recharts';
import type { MonthlySpend } from '../../types';
import { Card } from '../ui/Card';

interface Props {
  data: MonthlySpend[];
}

function formatSGD(v: number) {
  if (v >= 1000) return `$${(v / 1000).toFixed(1)}k`;
  return `$${v}`;
}

export function MonthlyBarChart({ data }: Props) {
  return (
    <Card className="h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-700">Monthly Spend</h3>
          <p className="text-xs text-slate-400">2025 vs 2024 (SGD)</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatSGD}
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={(v: any, name: any) => [
              `SGD ${Number(v).toLocaleString()}`,
              name === 'amount' ? '2025' : '2024',
            ]}
            contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: 12 }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={v => v === 'amount' ? '2025' : '2024'}
            wrapperStyle={{ fontSize: 12 }}
          />
          <Bar dataKey="amount" fill="#00B4D8" radius={[4, 4, 0, 0]} maxBarSize={36} name="amount" />
          <Line
            type="monotone"
            dataKey="amount2024"
            stroke="#FF6B6B"
            strokeWidth={2}
            dot={false}
            name="amount2024"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  );
}
