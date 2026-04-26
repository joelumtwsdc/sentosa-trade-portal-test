export type Category =
  | 'theme-park'
  | 'marine'
  | 'adventure'
  | 'aerial'
  | 'entertainment'
  | 'beach'
  | 'wax-museum'
  | 'skydiving';

export const CATEGORY_LABELS: Record<Category, string> = {
  'theme-park': 'Theme Park',
  marine: 'Marine & Aquatic',
  adventure: 'Adventure',
  aerial: 'Aerial & Luge',
  entertainment: 'Shows & Entertainment',
  beach: 'Beach',
  'wax-museum': 'Wax Museum',
  skydiving: 'Skydiving',
};

export type TicketKind = 'dated' | 'open';

export interface TimeSlot {
  id: string;
  label: string;
  startTime: string;
}

export interface TicketType {
  id: string;
  attractionId: string;
  name: string;
  kind: TicketKind;
  price: number;
  currency: 'SGD';
  validityDays?: number;
  timeSlots?: TimeSlot[];
  minQty: number;
  maxQty: number;
  description?: string;
  ageGroup?: 'adult' | 'child' | 'senior';
}

export interface Attraction {
  id: string;
  name: string;
  shortName: string;
  category: Category;
  description: string;
  highlights: string[];
  images: string[];
  ticketTypes: TicketType[];
  operatingHours: string;
  location: string;
  tags: string[];
}

export interface CartItem {
  id: string;
  attractionId: string;
  attractionName: string;
  ticketTypeId: string;
  ticketTypeName: string;
  kind: TicketKind;
  date?: string;
  timeSlot?: TimeSlot;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface CartState {
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
}

export type OrderStatus = 'confirmed' | 'pending' | 'cancelled' | 'refunded';

export interface OrderItem {
  attractionId: string;
  attractionName: string;
  ticketTypeId: string;
  ticketTypeName: string;
  kind: TicketKind;
  date?: string;
  timeSlot?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  bookingRef: string;
  agentId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

export type AccountTier = 'standard' | 'silver' | 'gold' | 'platinum';

export interface Agent {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  accountTier: AccountTier;
  creditLimit: number;
  ytdSpend: number;
  joinedAt: string;
}

export interface Recommendation {
  id: string;
  attractionId: string;
  attractionName: string;
  headline: string;
  body: string;
  estimatedRevenue: number;
  priority: 'high' | 'medium' | 'low';
  badgeLabel: 'Gap Analysis' | 'New Listing' | 'Seasonal';
}

export interface MonthlySpend {
  month: string;
  amount: number;
  amount2024: number;
}

export interface AttractionShare {
  name: string;
  shortName: string;
  revenue: number;
  percentage: number;
  count: number;
}

export interface OrderFilters {
  dateFrom?: string;
  dateTo?: string;
  status?: OrderStatus | '';
  attractionId?: string;
  searchRef?: string;
}
