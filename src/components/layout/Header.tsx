import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export function Header() {
  const { agent } = useAuth();
  const { cart } = useCart();

  return (
    <header className="h-16 bg-white border-b border-slate-100 sticky top-0 z-30 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Agent Portal</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification bell (static) */}
        <button className="relative p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-coral-500 rounded-full" />
        </button>

        {/* Cart */}
        <Link
          to="/cart"
          className="relative p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {cart.itemCount > 0 && (
            <span className="absolute top-0.5 right-0.5 bg-coral-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {cart.itemCount > 9 ? '9+' : cart.itemCount}
            </span>
          )}
        </Link>

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200" />

        {/* Agent info */}
        <Link to="/account" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
            <span className="text-teal-700 text-sm font-semibold">
              {agent?.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? 'ST'}
            </span>
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-slate-800 leading-tight">{agent?.name}</p>
            <p className="text-xs text-slate-400">{agent?.company}</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
