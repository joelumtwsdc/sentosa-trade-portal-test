import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { CartItem, CartState, TimeSlot } from '../types';

interface AddItemPayload {
  attractionId: string;
  attractionName: string;
  ticketTypeId: string;
  ticketTypeName: string;
  kind: CartItem['kind'];
  date?: string;
  timeSlot?: TimeSlot;
  quantity: number;
  unitPrice: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: AddItemPayload }
  | { type: 'REMOVE_ITEM'; itemId: string }
  | { type: 'UPDATE_QTY'; itemId: string; quantity: number }
  | { type: 'CLEAR' }
  | { type: 'LOAD'; items: CartItem[] };

interface CartContextValue {
  cart: CartState;
  addItem: (payload: AddItemPayload) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const CART_KEY = 'stp_cart';

function computeState(items: CartItem[]): CartState {
  const totalAmount = items.reduce((s, i) => s + i.subtotal, 0);
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);
  return { items, totalAmount, itemCount };
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'LOAD':
      return computeState(action.items);
    case 'ADD_ITEM': {
      const id = crypto.randomUUID();
      const { quantity, unitPrice, ...rest } = action.payload;
      const newItem: CartItem = { ...rest, id, quantity, unitPrice, subtotal: quantity * unitPrice };
      return computeState([...state.items, newItem]);
    }
    case 'REMOVE_ITEM':
      return computeState(state.items.filter(i => i.id !== action.itemId));
    case 'UPDATE_QTY':
      return computeState(
        state.items.map(i =>
          i.id === action.itemId
            ? { ...i, quantity: action.quantity, subtotal: action.quantity * i.unitPrice }
            : i
        )
      );
    case 'CLEAR':
      return computeState([]);
    default:
      return state;
  }
}

const initialState: CartState = { items: [], totalAmount: 0, itemCount: 0 };

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState, () => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) return computeState(JSON.parse(stored));
    } catch { /* ignore */ }
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart.items));
  }, [cart.items]);

  return (
    <CartContext.Provider value={{
      cart,
      addItem: payload => dispatch({ type: 'ADD_ITEM', payload }),
      removeItem: itemId => dispatch({ type: 'REMOVE_ITEM', itemId }),
      updateQuantity: (itemId, quantity) => dispatch({ type: 'UPDATE_QTY', itemId, quantity }),
      clearCart: () => dispatch({ type: 'CLEAR' }),
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
