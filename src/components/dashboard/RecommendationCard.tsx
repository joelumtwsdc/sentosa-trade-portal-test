import { Link } from 'react-router-dom';
import type { Recommendation } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

const BADGE_COLORS: Record<string, 'teal' | 'coral' | 'amber'> = {
  'Gap Analysis': 'coral',
  'New Listing': 'teal',
  'Seasonal': 'amber',
};

const PRIORITY_BORDER: Record<string, string> = {
  high: 'border-l-coral-500',
  medium: 'border-l-teal-400',
  low: 'border-l-slate-200',
};

interface Props {
  rec: Recommendation;
}

export function RecommendationCard({ rec }: Props) {
  return (
    <div className={['bg-white rounded-xl border border-slate-100 shadow-card border-l-4 p-4', PRIORITY_BORDER[rec.priority]].join(' ')}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 leading-snug">{rec.headline}</p>
        </div>
        <Badge color={BADGE_COLORS[rec.badgeLabel] ?? 'slate'} size="sm">
          {rec.badgeLabel}
        </Badge>
      </div>
      <p className="text-xs text-slate-500 mb-3 leading-relaxed">{rec.body}</p>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-slate-400">
          Est. revenue: <span className="font-semibold text-slate-600">SGD {rec.estimatedRevenue.toLocaleString()}</span>
        </span>
        <Link to={`/catalogue/${rec.attractionId}`}>
          <Button size="sm" variant="outline">Book Now →</Button>
        </Link>
      </div>
    </div>
  );
}
