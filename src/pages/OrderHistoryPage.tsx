import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useOrders } from '../context/OrdersContext';
import { attractions } from '../data';
import type { Order, OrderFilters, OrderStatus } from '../types';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { OrderDetailModal } from '../components/orders/OrderDetailModal';

const PAGE_SIZE = 20;

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'pending', label: 'Pending' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
];

const ATTRACTION_OPTIONS = [
  { value: '', label: 'All attractions' },
  ...attractions.map(a => ({ value: a.id, label: a.shortName })),
];

export function OrderHistoryPage() {
  const { filteredOrders } = useOrders();
  const [searchParams] = useSearchParams();
  const newRef = searchParams.get('new');

  const [filters, setFilters] = useState<OrderFilters>({ dateFrom: '', dateTo: '', status: '', attractionId: '', searchRef: '' });
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showBanner, setShowBanner] = useState(!!newRef);

  useEffect(() => { document.title = 'Order History — Sentosa Trade Portal'; }, []);

  useEffect(() => {
    if (newRef) {
      setShowBanner(true);
      const t = setTimeout(() => setShowBanner(false), 5000);
      return () => clearTimeout(t);
    }
  }, [newRef]);

  const results = useMemo(() => filteredOrders(filters), [filters, filteredOrders]);
  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const pageResults = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const update = (patch: Partial<OrderFilters>) => {
    setFilters(f => ({ ...f, ...patch }));
    setPage(1);
  };

  const totalPax = (order: Order) => order.items.reduce((s, i) => s + i.quantity, 0);
  const attractionNames = (order: Order) => {
    const seen = new Set<string>();
    return order.items
      .map(i => i.attractionName)
      .filter(n => { if (seen.has(n)) return false; seen.add(n); return true; })
      .join(', ');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-5">
      {showBanner && newRef && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3.5 flex items-center gap-3">
          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-medium text-green-700">
            Booking <span className="font-mono">{newRef}</span> confirmed! E-tickets will be sent to your registered email shortly.
          </p>
          <button onClick={() => setShowBanner(false)} className="ml-auto text-green-400 hover:text-green-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Order History</h1>
          <p className="text-sm text-slate-500 mt-0.5">{results.length} orders found</p>
        </div>
        <Button variant="outline" size="sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Input
            label="From"
            type="date"
            value={filters.dateFrom}
            onChange={e => update({ dateFrom: e.target.value })}
          />
          <Input
            label="To"
            type="date"
            value={filters.dateTo}
            onChange={e => update({ dateTo: e.target.value })}
          />
          <Select
            label="Status"
            options={STATUS_OPTIONS}
            value={filters.status}
            onChange={e => update({ status: e.target.value as OrderStatus | '' })}
          />
          <Select
            label="Attraction"
            options={ATTRACTION_OPTIONS}
            value={filters.attractionId}
            onChange={e => update({ attractionId: e.target.value })}
          />
          <Input
            label="Booking Ref"
            placeholder="STP-2025-…"
            value={filters.searchRef}
            onChange={e => update({ searchRef: e.target.value })}
          />
        </div>
        {(filters.dateFrom || filters.dateTo || filters.status || filters.attractionId || filters.searchRef) && (
          <div className="mt-3 pt-3 border-t border-slate-50">
            <button
              onClick={() => update({ dateFrom: '', dateTo: '', status: '', attractionId: '', searchRef: '' })}
              className="text-xs text-teal-600 hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </Card>

      {/* Table */}
      <Card padding={false}>
        {pageResults.length === 0 ? (
          <EmptyState
            title="No orders found"
            description="Try adjusting your filters or date range."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  {['Booking Ref', 'Date', 'Attractions', 'Pax', 'Total', 'Status', ''].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {pageResults.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                        {order.bookingRef}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-3.5 text-slate-700 max-w-[200px] truncate">
                      {attractionNames(order)}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {totalPax(order)} pax
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-800 whitespace-nowrap">
                      SGD {order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-xs font-medium text-teal-600 hover:text-teal-700 hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Page {page} of {totalPages} · {results.length} orders
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                ← Previous
              </Button>
              <Button variant="ghost" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
                Next →
              </Button>
            </div>
          </div>
        )}
      </Card>

      <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
}
