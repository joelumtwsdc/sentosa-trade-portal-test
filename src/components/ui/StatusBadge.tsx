import type { OrderStatus } from '../../types';
import { Badge } from './Badge';

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: 'green' | 'amber' | 'red' | 'slate' }> = {
  confirmed: { label: 'Confirmed', color: 'green' },
  pending:   { label: 'Pending',   color: 'amber' },
  cancelled: { label: 'Cancelled', color: 'red' },
  refunded:  { label: 'Refunded',  color: 'slate' },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const { label, color } = STATUS_CONFIG[status];
  return <Badge color={color}>{label}</Badge>;
}
