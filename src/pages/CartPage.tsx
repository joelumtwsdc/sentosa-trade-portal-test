import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';
import type { Order, OrderItem } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';

function CartItemRow({ item, onRemove, onQtyChange }: {
  item: ReturnType<typeof useCart>['cart']['items'][0];
  onRemove: () => void;
  onQtyChange: (q: number) => void;
}) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-slate-50 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800">{item.attractionName}</p>
        <p className="text-sm text-slate-500">{item.ticketTypeName}</p>
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          <Badge color={item.kind === 'dated' ? 'teal' : 'purple'} size="sm">
            {item.kind === 'dated' ? 'Dated' : 'Open'}
          </Badge>
          {item.date && (
            <Badge color="slate" size="sm">
              {new Date(item.date).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}
            </Badge>
          )}
          {item.timeSlot && (
            <Badge color="slate" size="sm">{item.timeSlot.label}</Badge>
          )}
        </div>
      </div>

      {/* Qty stepper */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => onQtyChange(item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-500 hover:border-teal-400 disabled:opacity-30 text-sm"
        >−</button>
        <span className="w-6 text-center text-sm font-medium text-slate-800">{item.quantity}</span>
        <button
          onClick={() => onQtyChange(item.quantity + 1)}
          className="w-7 h-7 rounded border border-slate-200 flex items-center justify-center text-slate-500 hover:border-teal-400 text-sm"
        >+</button>
      </div>

      {/* Price */}
      <div className="text-right flex-shrink-0 w-24">
        <p className="text-sm font-bold text-slate-800">SGD {item.subtotal.toFixed(2)}</p>
        <p className="text-xs text-slate-400">{item.quantity} × {item.unitPrice.toFixed(2)}</p>
      </div>

      {/* Remove */}
      <button
        onClick={onRemove}
        className="text-slate-300 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5"
        aria-label="Remove item"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

function formatCard(v: string) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

export function CartPage() {
  const { cart, removeItem, updateQuantity, clearCart } = useCart();
  const { agent } = useAuth();
  const { appendOrder } = useOrders();
  const navigate = useNavigate();

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { document.title = 'Cart — Sentosa Trade Portal'; }, []);

  const canCheckout = cardNumber.replace(/\s/g, '').length === 16 && cardName.trim() && expiry.length === 5 && cvv.length === 3;

  const handleConfirmOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (!canCheckout || !agent) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 900));

    const refNum = Math.floor(10000 + Math.random() * 90000);
    const bookingRef = `STP-2025-${refNum}`;

    const order: Order = {
      id: crypto.randomUUID(),
      bookingRef,
      agentId: agent.id,
      items: cart.items.map((i): OrderItem => ({
        attractionId: i.attractionId,
        attractionName: i.attractionName,
        ticketTypeId: i.ticketTypeId,
        ticketTypeName: i.ticketTypeName,
        kind: i.kind,
        date: i.date,
        timeSlot: i.timeSlot?.label,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        subtotal: i.subtotal,
      })),
      totalAmount: cart.totalAmount,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    appendOrder(order);
    clearCart();
    setCheckoutOpen(false);
    setSubmitting(false);
    navigate(`/orders?new=${bookingRef}`);
  };

  if (cart.items.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Cart</h1>
        <EmptyState
          icon={
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          title="Your cart is empty"
          description="Browse the Sentosa attraction catalogue to add tickets for your clients."
          action={{ label: 'Browse Catalogue', onClick: () => navigate('/catalogue') }}
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Cart</h1>
          <p className="text-sm text-slate-500 mt-0.5">{cart.itemCount} item{cart.itemCount !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/catalogue" className="text-sm text-teal-600 hover:underline">+ Add more tickets</Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Cart items */}
        <div className="flex-1 min-w-0">
          <Card>
            {cart.items.map(item => (
              <CartItemRow
                key={item.id}
                item={item}
                onRemove={() => removeItem(item.id)}
                onQtyChange={q => updateQuantity(item.id, q)}
              />
            ))}
          </Card>
        </div>

        {/* Order summary */}
        <div className="lg:w-80 flex-shrink-0">
          <Card className="sticky top-24">
            <h2 className="text-base font-bold text-slate-800 mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              {cart.items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-slate-500 truncate mr-2">{item.ticketTypeName} ×{item.quantity}</span>
                  <span className="text-slate-700 flex-shrink-0">SGD {item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 pt-3 mt-3 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="text-slate-700">SGD {cart.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">GST (9%)</span>
                <span className="text-slate-400 text-xs self-center">Included</span>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-3 mt-3 flex justify-between">
              <span className="font-bold text-slate-800">Total</span>
              <span className="text-lg font-bold text-teal-600">SGD {cart.totalAmount.toFixed(2)}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 mb-4">All prices are GST-inclusive</p>
            <Button fullWidth size="lg" onClick={() => setCheckoutOpen(true)}>
              Proceed to Checkout
            </Button>
            <p className="text-xs text-slate-400 text-center mt-2">Net-30 invoicing available for Gold accounts</p>
          </Card>
        </div>
      </div>

      {/* Checkout modal */}
      <Modal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} title="Complete Your Order" size="md">
        <form onSubmit={handleConfirmOrder} className="space-y-4">
          {/* Agent details (read-only) */}
          <div className="bg-slate-50 rounded-xl p-3 space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Billing Account</p>
            <p className="text-sm font-semibold text-slate-800">{agent?.name}</p>
            <p className="text-sm text-slate-500">{agent?.company}</p>
            <p className="text-sm text-slate-500">{agent?.email}</p>
          </div>

          {/* Mock payment */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Payment Details</p>
            <div className="space-y-3">
              <Input
                label="Card Number"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={e => setCardNumber(formatCard(e.target.value))}
                maxLength={19}
                required
              />
              <Input
                label="Cardholder Name"
                placeholder="Name as on card"
                value={cardName}
                onChange={e => setCardName(e.target.value)}
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Expiry (MM/YY)"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={e => {
                    let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                    if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
                    setExpiry(v);
                  }}
                  maxLength={5}
                  required
                />
                <Input
                  label="CVV"
                  placeholder="•••"
                  type="password"
                  value={cvv}
                  onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  maxLength={3}
                  required
                />
              </div>
            </div>
          </div>

          {/* Order total */}
          <div className="bg-teal-50 rounded-xl p-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-teal-700">Total to be charged</span>
            <span className="text-lg font-bold text-teal-700">SGD {cart.totalAmount.toFixed(2)}</span>
          </div>

          <Button type="submit" fullWidth size="lg" disabled={!canCheckout || submitting}>
            {submitting ? 'Processing…' : 'Confirm Order'}
          </Button>
          <p className="text-xs text-slate-400 text-center">
            This is a demo environment. No real payment is processed.
          </p>
        </form>
      </Modal>
    </div>
  );
}
