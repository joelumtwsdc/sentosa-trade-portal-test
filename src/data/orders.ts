import type { Order, OrderItem, OrderStatus } from '../types';

interface AttractionConfig {
  id: string;
  name: string;
  ticketTypes: Array<{ id: string; name: string; price: number; kind: 'dated' | 'open' }>;
  weight: number;
}

const ATTRACTION_CONFIGS: AttractionConfig[] = [
  {
    id: 'uss', name: 'Universal Studios Singapore', weight: 0.30,
    ticketTypes: [
      { id: 'uss-adult-day', name: 'Adult 1-Day Ticket', price: 88, kind: 'dated' },
      { id: 'uss-child-day', name: 'Child 1-Day Ticket', price: 68, kind: 'dated' },
      { id: 'uss-express', name: 'Express Pass', price: 58, kind: 'dated' },
    ],
  },
  {
    id: 'wot', name: 'Wings of Time', weight: 0.18,
    ticketTypes: [
      { id: 'wot-standard', name: 'Standard Seat', price: 23, kind: 'dated' },
      { id: 'wot-premium', name: 'Premium Seat', price: 38, kind: 'dated' },
    ],
  },
  {
    id: 'sea', name: 'S.E.A. Aquarium / Ocean Dreams', weight: 0.15,
    ticketTypes: [
      { id: 'sea-adult-dated', name: 'Adult Day Ticket', price: 44, kind: 'dated' },
      { id: 'sea-child-dated', name: 'Child Day Ticket', price: 33, kind: 'dated' },
    ],
  },
  {
    id: 'acw', name: 'Adventure Cove Waterpark', weight: 0.12,
    ticketTypes: [
      { id: 'acw-adult-dated', name: 'Adult Day Ticket', price: 38, kind: 'dated' },
      { id: 'acw-child-dated', name: 'Child Day Ticket', price: 30, kind: 'dated' },
    ],
  },
  {
    id: 'ifly', name: 'iFly Singapore', weight: 0.08,
    ticketTypes: [
      { id: 'ifly-2flight', name: '2-Flight Package', price: 109, kind: 'dated' },
    ],
  },
  {
    id: 'ajh', name: 'AJ Hackett Sentosa', weight: 0.06,
    ticketTypes: [
      { id: 'ajh-bungy', name: 'Bungy Jump', price: 139, kind: 'dated' },
      { id: 'ajh-swing', name: 'Giant Swing', price: 59, kind: 'dated' },
    ],
  },
  {
    id: 'mts', name: 'Madame Tussauds Singapore', weight: 0.04,
    ticketTypes: [
      { id: 'mts-adult', name: 'Adult Admission', price: 35, kind: 'open' },
      { id: 'mts-child', name: 'Child Admission', price: 25, kind: 'open' },
    ],
  },
  {
    id: 'luge', name: 'Luge & Skyride', weight: 0.03,
    ticketTypes: [
      { id: 'luge-2ride', name: '2-Ride Luge + Skyride', price: 22, kind: 'open' },
      { id: 'luge-3ride', name: '3-Ride Luge + Skyride', price: 30, kind: 'open' },
    ],
  },
  {
    id: 'mzip', name: 'Megazip & Skypark', weight: 0.02,
    ticketTypes: [
      { id: 'mzip-single', name: 'Megazip Single Ride', price: 49, kind: 'open' },
      { id: 'mzip-bundle', name: 'Skypark Bundle', price: 79, kind: 'open' },
    ],
  },
  {
    id: 'palawan', name: 'Palawan Beach Experience', weight: 0.02,
    ticketTypes: [
      { id: 'palawan-daypass', name: 'Palawan Day Pass', price: 15, kind: 'open' },
    ],
  },
];

// Monthly order count targets (index 0 = Jan)
const MONTHLY_COUNTS_2025 = [9, 8, 8, 10, 11, 15, 16, 14, 10, 9, 8, 13];
const MONTHLY_COUNTS_2024 = [8, 7, 7, 8, 9, 12, 13, 11, 8, 7, 7, 10];

const STATUS_WEIGHTS: Array<[OrderStatus, number]> = [
  ['confirmed', 0.85],
  ['pending', 0.08],
  ['cancelled', 0.05],
  ['refunded', 0.02],
];

// Deterministic seeded pseudo-random (LCG)
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function pickWeighted<T>(items: Array<[T, number]>, rand: () => number): T {
  const r = rand();
  let cumulative = 0;
  for (const [item, weight] of items) {
    cumulative += weight;
    if (r < cumulative) return item;
  }
  return items[items.length - 1][0];
}

function pickAttractionWeighted(rand: () => number): AttractionConfig {
  const weighted: Array<[AttractionConfig, number]> = ATTRACTION_CONFIGS.map(a => [a, a.weight]);
  return pickWeighted(weighted, rand);
}

function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function generateOrdersForYear(year: number, monthlyCounts: number[], seed: number): Order[] {
  const rand = seededRandom(seed);
  const orders: Order[] = [];
  let refCounter = year === 2025 ? 1 : 501;

  for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
    const month = monthIdx + 1;
    const count = monthlyCounts[monthIdx];
    const days = daysInMonth(year, month);

    for (let i = 0; i < count; i++) {
      const attraction = pickAttractionWeighted(rand);
      const status = pickWeighted(STATUS_WEIGHTS, rand);
      const day = Math.floor(rand() * days) + 1;
      const hour = Math.floor(rand() * 10) + 8;
      const minute = Math.floor(rand() * 60);
      const createdAt = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00+08:00`;

      // Pick 1-2 ticket types from the attraction
      const numTicketTypes = rand() < 0.6 ? 1 : 2;
      const ticketTypeIndices: number[] = [];
      for (let t = 0; t < numTicketTypes; t++) {
        const idx = Math.floor(rand() * attraction.ticketTypes.length);
        if (!ticketTypeIndices.includes(idx)) ticketTypeIndices.push(idx);
      }

      const items: OrderItem[] = ticketTypeIndices.map(idx => {
        const tt = attraction.ticketTypes[idx];
        // USS gets larger groups, others smaller
        let qty: number;
        if (attraction.id === 'uss') {
          qty = Math.floor(rand() * 6) + 2; // 2-7
        } else if (attraction.id === 'wot' || attraction.id === 'sea' || attraction.id === 'acw') {
          qty = Math.floor(rand() * 5) + 2; // 2-6
        } else {
          qty = Math.floor(rand() * 3) + 1; // 1-3
        }
        const visitDay = Math.floor(rand() * 14) + 1;
        const visitDate = formatDate(year, month, Math.min(visitDay, days));
        return {
          attractionId: attraction.id,
          attractionName: attraction.name,
          ticketTypeId: tt.id,
          ticketTypeName: tt.name,
          kind: tt.kind,
          date: tt.kind === 'dated' ? visitDate : undefined,
          quantity: qty,
          unitPrice: tt.price,
          subtotal: qty * tt.price,
        };
      });

      const totalAmount = items.reduce((s, item) => s + item.subtotal, 0);
      const ref = `STP-${year}-${String(refCounter).padStart(5, '0')}`;
      refCounter++;

      orders.push({
        id: `order-${year}-${refCounter}`,
        bookingRef: ref,
        agentId: 'agent-001',
        items,
        totalAmount,
        status,
        createdAt,
      });
    }
  }

  return orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export const orders2025: Order[] = generateOrdersForYear(2025, MONTHLY_COUNTS_2025, 42);
export const orders2024: Order[] = generateOrdersForYear(2024, MONTHLY_COUNTS_2024, 137);
export const allOrders: Order[] = [...orders2025, ...orders2024];
