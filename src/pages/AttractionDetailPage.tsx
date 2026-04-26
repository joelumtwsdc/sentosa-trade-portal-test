import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  addDays, format, startOfMonth, getDay, getDaysInMonth,
  isBefore, startOfToday, isSameDay, isAfter,
} from 'date-fns';
import { attractionMap } from '../data';
import type { TicketType, TimeSlot } from '../types';
import { CATEGORY_LABELS } from '../types';
import { useCart } from '../context/CartContext';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function AttractionDetailPage() {
  const { attractionId } = useParams<{ attractionId: string }>();
  const navigate = useNavigate();
  const attraction = attractionId ? attractionMap[attractionId] : undefined;
  const { addItem } = useCart();

  const [heroImg, setHeroImg] = useState(0);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [calendarMonth, setCalendarMonth] = useState(startOfMonth(new Date()));
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    if (attraction) {
      document.title = `${attraction.name} — Sentosa Trade Portal`;
      setSelectedTicket(attraction.ticketTypes[0] ?? null);
    }
  }, [attraction]);

  useEffect(() => {
    setSelectedDate(null);
    setSelectedSlot(null);
    if (selectedTicket) {
      setQuantity(selectedTicket.minQty);
    }
  }, [selectedTicket]);

  useEffect(() => { setSelectedSlot(null); }, [selectedDate]);

  if (!attraction) {
    return (
      <div className="p-6 flex flex-col items-center justify-center py-20">
        <p className="text-slate-500 text-sm mb-4">Attraction not found.</p>
        <Link to="/catalogue" className="text-teal-600 hover:underline text-sm">← Back to Catalogue</Link>
      </div>
    );
  }

  const today = startOfToday();
  const maxDate = addDays(today, 90);

  // Calendar helpers
  const firstDay = getDay(calendarMonth); // 0=Sun
  const daysInCal = getDaysInMonth(calendarMonth);
  const calDays: (Date | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInCal }, (_, i) => addDays(calendarMonth, i)),
  ];

  const handleAddToCart = () => {
    if (!selectedTicket) return;
    if (selectedTicket.kind === 'dated' && !selectedDate) return;
    if (selectedTicket.timeSlots && selectedTicket.timeSlots.length > 0 && !selectedSlot) return;

    addItem({
      attractionId: attraction.id,
      attractionName: attraction.name,
      ticketTypeId: selectedTicket.id,
      ticketTypeName: selectedTicket.name,
      kind: selectedTicket.kind,
      date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined,
      timeSlot: selectedSlot ?? undefined,
      quantity,
      unitPrice: selectedTicket.price,
    });
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 3000);
  };

  const canAddToCart = () => {
    if (!selectedTicket) return false;
    if (selectedTicket.kind === 'dated') {
      if (!selectedDate) return false;
      if (selectedTicket.timeSlots && selectedTicket.timeSlots.length > 0 && !selectedSlot) return false;
    }
    return true;
  };

  const subtotal = (selectedTicket?.price ?? 0) * quantity;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-400 mb-5">
        <Link to="/catalogue" className="hover:text-teal-600 transition-colors">Catalogue</Link>
        <span>/</span>
        <span className="text-slate-600">{attraction.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-7">
        {/* Left: images + info */}
        <div className="flex-1 min-w-0 space-y-5">
          {/* Image gallery */}
          <div>
            <div className="rounded-xl overflow-hidden aspect-video bg-slate-100 mb-2">
              <img src={attraction.images[heroImg]} alt={attraction.name} className="w-full h-full object-cover" />
            </div>
            {attraction.images.length > 1 && (
              <div className="flex gap-2">
                {attraction.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setHeroImg(i)}
                    className={['rounded-lg overflow-hidden w-20 h-14 border-2 transition-colors', i === heroImg ? 'border-teal-500' : 'border-transparent'].join(' ')}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge color="teal">{CATEGORY_LABELS[attraction.category]}</Badge>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {attraction.operatingHours}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">{attraction.name}</h1>
            <p className="text-sm text-slate-500 flex items-center gap-1 mb-4">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {attraction.location}
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">{attraction.description}</p>
          </div>

          {/* Highlights */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Highlights</h3>
            <ul className="space-y-2">
              {attraction.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <svg className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: booking panel */}
        <div className="lg:w-96 flex-shrink-0">
          <div className="sticky top-24 space-y-4">
            <Card>
              <h2 className="text-base font-bold text-slate-800 mb-4">Book Tickets</h2>

              {/* Ticket type selector */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Ticket Type</p>
                <div className="space-y-2">
                  {attraction.ticketTypes.map(tt => (
                    <label
                      key={tt.id}
                      className={[
                        'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                        selectedTicket?.id === tt.id
                          ? 'border-teal-400 bg-teal-50'
                          : 'border-slate-200 hover:border-slate-300',
                      ].join(' ')}
                    >
                      <input
                        type="radio"
                        name="ticket"
                        checked={selectedTicket?.id === tt.id}
                        onChange={() => setSelectedTicket(tt)}
                        className="mt-0.5 accent-teal-500"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-slate-800">{tt.name}</span>
                          <span className="text-sm font-bold text-teal-600 flex-shrink-0">SGD {tt.price}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge color={tt.kind === 'dated' ? 'teal' : 'purple'} size="sm">
                            {tt.kind === 'dated' ? 'Dated' : 'Open'}
                          </Badge>
                          {tt.validityDays && (
                            <span className="text-xs text-slate-400">Valid {tt.validityDays}d</span>
                          )}
                          {tt.ageGroup && (
                            <Badge color="slate" size="sm">{tt.ageGroup}</Badge>
                          )}
                        </div>
                        {tt.description && (
                          <p className="text-xs text-slate-400 mt-1">{tt.description}</p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date picker (dated tickets only) */}
              {selectedTicket?.kind === 'dated' && (
                <div className="mb-5">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Select Date</p>
                  <div className="border border-slate-200 rounded-xl p-3">
                    {/* Month navigation */}
                    <div className="flex items-center justify-between mb-2">
                      <button
                        onClick={() => setCalendarMonth(m => startOfMonth(addDays(m, -1)))}
                        disabled={!isAfter(calendarMonth, startOfMonth(today))}
                        className="p-1 rounded text-slate-400 hover:text-slate-600 disabled:opacity-30"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                      </button>
                      <span className="text-sm font-semibold text-slate-700">
                        {format(calendarMonth, 'MMMM yyyy')}
                      </span>
                      <button
                        onClick={() => setCalendarMonth(m => startOfMonth(addDays(m, 32)))}
                        disabled={!isBefore(calendarMonth, startOfMonth(addDays(today, 90)))}
                        className="p-1 rounded text-slate-400 hover:text-slate-600 disabled:opacity-30"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </button>
                    </div>
                    {/* Weekday headers */}
                    <div className="grid grid-cols-7 mb-1">
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                        <div key={d} className="text-center text-xs text-slate-400 py-1">{d}</div>
                      ))}
                    </div>
                    {/* Calendar cells */}
                    <div className="grid grid-cols-7 gap-0.5">
                      {calDays.map((day, i) => {
                        if (!day) return <div key={i} />;
                        const isPast = isBefore(day, today);
                        const isTooFar = isAfter(day, maxDate);
                        const disabled = isPast || isTooFar;
                        const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
                        return (
                          <button
                            key={i}
                            onClick={() => !disabled && setSelectedDate(day)}
                            disabled={disabled}
                            className={[
                              'w-full aspect-square rounded-lg text-xs font-medium transition-colors',
                              isSelected ? 'bg-teal-500 text-white' : '',
                              !isSelected && !disabled ? 'hover:bg-teal-50 text-slate-700' : '',
                              disabled ? 'text-slate-300 cursor-not-allowed' : 'cursor-pointer',
                            ].join(' ')}
                          >
                            {format(day, 'd')}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {selectedDate && (
                    <p className="text-xs text-teal-600 mt-1.5 font-medium">
                      {format(selectedDate, 'EEEE, d MMMM yyyy')}
                    </p>
                  )}
                </div>
              )}

              {/* Time slot picker */}
              {selectedTicket?.kind === 'dated' && selectedTicket.timeSlots && selectedTicket.timeSlots.length > 0 && selectedDate && (
                <div className="mb-5">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Select Time</p>
                  <div className="grid grid-cols-3 gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {selectedTicket.timeSlots.map(slot => (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot)}
                        className={[
                          'px-2 py-1.5 rounded-lg text-xs font-medium border transition-colors',
                          selectedSlot?.id === slot.id
                            ? 'bg-teal-500 text-white border-teal-500'
                            : 'border-slate-200 text-slate-600 hover:border-teal-400 hover:text-teal-600',
                        ].join(' ')}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity stepper */}
              {selectedTicket && (
                <div className="mb-5">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Quantity</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(q => Math.max(selectedTicket.minQty, q - 1))}
                      disabled={quantity <= selectedTicket.minQty}
                      className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:border-teal-400 hover:text-teal-600 disabled:opacity-30 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                    </button>
                    <span className="text-lg font-bold text-slate-800 w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => Math.min(selectedTicket.maxQty, q + 1))}
                      disabled={quantity >= selectedTicket.maxQty}
                      className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:border-teal-400 hover:text-teal-600 disabled:opacity-30 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                    <span className="text-sm text-slate-400">pax</span>
                    <div className="ml-auto text-right">
                      <p className="text-xs text-slate-400">Subtotal</p>
                      <p className="text-lg font-bold text-teal-600">SGD {subtotal.toFixed(2)}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Max {selectedTicket.maxQty} per booking</p>
                </div>
              )}

              {/* Add to cart */}
              {addedSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-green-700">Added to cart</p>
                    <button onClick={() => navigate('/cart')} className="text-xs text-green-600 hover:underline">View cart →</button>
                  </div>
                </div>
              ) : (
                <Button
                  fullWidth
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!canAddToCart()}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add to Cart
                </Button>
              )}

              {selectedTicket?.kind === 'dated' && !selectedDate && (
                <p className="text-xs text-slate-400 text-center mt-2">Please select a date to continue</p>
              )}
            </Card>

            {/* Trust signals */}
            <Card className="!py-3 !px-4">
              <div className="space-y-2">
                {[
                  'Instant booking confirmation',
                  'E-tickets sent within 15 minutes',
                  'Free cancellation (24h notice)',
                  'Net-30 invoicing for Gold agents',
                ].map((t, i) => (
                  <p key={i} className="flex items-center gap-2 text-xs text-slate-500">
                    <svg className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t}
                  </p>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
