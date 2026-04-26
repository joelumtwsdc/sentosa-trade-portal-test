import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { AttractionShare } from '../../types';
import { Card } from '../ui/Card';

const COLORS = ['#00B4D8', '#FF6B6B', '#34d399', '#f59e0b', '#a78bfa', '#64748b'];

interface Props {
  data: AttractionShare[];
}

export function TopAttractionsChart({ data }: Props) {
  return (
    <Card className="h-full">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-700">Revenue by Attraction</h3>
        <p className="text-xs text-slate-400">YTD 2025, top attractions</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="revenue"
            nameKey="shortName"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={48}
            paddingAngle={2}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(v: any) => [`SGD ${Number(v).toLocaleString()}`, 'Revenue']}
            contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: 12 }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(v: string) => v}
            wrapperStyle={{ fontSize: 11 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
