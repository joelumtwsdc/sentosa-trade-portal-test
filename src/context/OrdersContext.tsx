import { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import type { Order, OrderFilters, MonthlySpend, AttractionShare } from '../types';
import { orders2025, orders2024 } from '../data';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface OrdersContextValue {
  orders: Order[];
  appendOrder: (order: Order) => void;
  filteredOrders: (filters: OrderFilters) => Order[];
  monthlySpend: MonthlySpend[];
  topAttractions: AttractionShare[];
  totalSpendYTD: number;
  totalOrdersYTD: number;
  avgOrderValue: number;
  activeBookingsCount: number;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [sessionOrders, setSessionOrders] = useState<Order[]>([]);
  const allOrders = useMemo(() => [...sessionOrders, ...orders2025, ...orders2024], [sessionOrders]);

  const ytdOrders = useMemo(() =>
    [...sessionOrders, ...orders2025].filter(o => o.status !== 'cancelled' && o.status !== 'refunded'),
    [sessionOrders]
  );

  const totalSpendYTD = useMemo(() => ytdOrders.reduce((s, o) => s + o.totalAmount, 0), [ytdOrders]);
  const totalOrdersYTD = ytdOrders.length;
  const avgOrderValue = totalOrdersYTD > 0 ? Math.round(totalSpendYTD / totalOrdersYTD) : 0;
  const activeBookingsCount = useMemo(() =>
    [...sessionOrders, ...orders2025].filter(o => o.status === 'confirmed' || o.status === 'pending').length,
    [sessionOrders]
  );

  const monthlySpend = useMemo((): MonthlySpend[] => {
    return MONTHS.map((month, idx) => {
      const m = idx + 1;
      const monthStr = String(m).padStart(2, '0');
      const amount = [...sessionOrders, ...orders2025]
        .filter(o => o.createdAt.startsWith(`2025-${monthStr}`) && o.status !== 'cancelled' && o.status !== 'refunded')
        .reduce((s, o) => s + o.totalAmount, 0);
      const amount2024 = orders2024
        .filter(o => o.createdAt.startsWith(`2024-${monthStr}`) && o.status !== 'cancelled' && o.status !== 'refunded')
        .reduce((s, o) => s + o.totalAmount, 0);
      return { month, amount, amount2024 };
    });
  }, [sessionOrders]);

  const topAttractions = useMemo((): AttractionShare[] => {
    const map: Record<string, { name: string; shortName: string; revenue: number; count: number }> = {};
    for (const order of ytdOrders) {
      for (const item of order.items) {
        if (!map[item.attractionId]) {
          map[item.attractionId] = { name: item.attractionName, shortName: item.attractionName.split(' ')[0], revenue: 0, count: 0 };
        }
        map[item.attractionId].revenue += item.subtotal;
        map[item.attractionId].count += item.quantity;
      }
    }
    const totalRev = Object.values(map).reduce((s, a) => s + a.revenue, 0);
    return Object.entries(map)
      .map(([, v]) => ({ ...v, percentage: totalRev > 0 ? Math.round((v.revenue / totalRev) * 100) : 0 }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6);
  }, [ytdOrders]);

  const filteredOrders = (filters: OrderFilters): Order[] => {
    return allOrders.filter(o => {
      if (filters.dateFrom && o.createdAt < filters.dateFrom) return false;
      if (filters.dateTo && o.createdAt.slice(0, 10) > filters.dateTo) return false;
      if (filters.status && o.status !== filters.status) return false;
      if (filters.attractionId && !o.items.some(i => i.attractionId === filters.attractionId)) return false;
      if (filters.searchRef && !o.bookingRef.toLowerCase().includes(filters.searchRef.toLowerCase())) return false;
      return true;
    });
  };

  const appendOrder = (order: Order) => {
    setSessionOrders(prev => [order, ...prev]);
  };

  return (
    <OrdersContext.Provider value={{
      orders: allOrders,
      appendOrder,
      filteredOrders,
      monthlySpend,
      topAttractions,
      totalSpendYTD,
      totalOrdersYTD,
      avgOrderValue,
      activeBookingsCount,
    }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error('useOrders must be used within OrdersProvider');
  return ctx;
}
