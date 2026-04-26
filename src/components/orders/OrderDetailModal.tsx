import type { Order } from '../../types';
import { Modal } from '../ui/Modal';
import { StatusBadge } from '../ui/StatusBadge';
import { Badge } from '../ui/Badge';

interface Props {
  order: Order | null;
  onClose: () => void;
}

export function OrderDetailModal({ order, onClose }: Props) {
  if (!order) return null;
  const date = new Date(order.createdAt);

  return (
    <Modal isOpen={!!order} onClose={onClose} title={`Order ${order.bookingRef}`} size="lg">
      <div className="space-y-5">
        {/* Header info */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-xs text-slate-400 uppercase tracking-wider">Booking Reference</p>
            <p className="text-lg font-bold text-slate-800 font-mono">{order.bookingRef}</p>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Order Date</p>
            <p className="text-slate-700 font-medium">{date.toLocaleDateString('en-SG', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">Order Time</p>
            <p className="text-slate-700 font-medium">{date.toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' })} SGT</p>
          </div>
        </div>

        {/* Line items */}
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Items</p>
          <div className="divide-y divide-slate-50 rounded-lg border border-slate-100 overflow-hidden">
            {order.items.map((item, i) => (
              <div key={i} className="px-4 py-3 bg-white">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800">{item.attractionName}</p>
                    <p className="text-sm text-slate-500">{item.ticketTypeName}</p>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      <Badge color={item.kind === 'dated' ? 'teal' : 'purple'} size="sm">
                        {item.kind === 'dated' ? 'Dated' : 'Open'}
                      </Badge>
                      {item.date && (
                        <Badge color="slate" size="sm">
                          {new Date(item.date).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </Badge>
                      )}
                      {item.timeSlot && (
                        <Badge color="slate" size="sm">{item.timeSlot}</Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-slate-800">SGD {item.subtotal.toFixed(2)}</p>
                    <p className="text-xs text-slate-400">{item.quantity} × SGD {item.unitPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-3 border-t border-slate-100">
          <span className="text-sm font-semibold text-slate-700">Total (incl. GST)</span>
          <span className="text-lg font-bold text-teal-600">SGD {order.totalAmount.toFixed(2)}</span>
        </div>

        {order.status === 'confirmed' && (
          <div className="bg-green-50 border border-green-100 rounded-lg px-4 py-3 flex items-start gap-3">
            <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-green-700">Booking Confirmed</p>
              <p className="text-xs text-green-600 mt-0.5">E-tickets will be delivered to sarah.tan@horizontravel.sg within 15 minutes.</p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
