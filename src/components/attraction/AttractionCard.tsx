import { Link } from 'react-router-dom';
import type { Attraction } from '../../types';
import { CATEGORY_LABELS } from '../../types';

interface Props {
  attraction: Attraction;
}

export function AttractionCard({ attraction }: Props) {
  const minPrice = Math.min(...attraction.ticketTypes.map(t => t.price));
  const hasDated = attraction.ticketTypes.some(t => t.kind === 'dated');
  const hasOpen = attraction.ticketTypes.some(t => t.kind === 'open');

  return (
    <Link to={`/catalogue/${attraction.id}`} className="block group">
      <div className="bg-white rounded-xl border border-slate-100 shadow-card transition-all duration-200 group-hover:shadow-card-hover group-hover:-translate-y-0.5 overflow-hidden">
        {/* Image */}
        <div className="relative aspect-video overflow-hidden bg-slate-100">
          <img
            src={attraction.images[0]}
            alt={attraction.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-medium px-2 py-0.5 rounded-full">
              {CATEGORY_LABELS[attraction.category]}
            </span>
          </div>
          <div className="absolute top-3 right-3 flex gap-1">
            {hasDated && <span className="bg-teal-500/90 backdrop-blur-sm text-white text-xs font-medium px-2 py-0.5 rounded-full">Dated</span>}
            {hasOpen && <span className="bg-purple-500/90 backdrop-blur-sm text-white text-xs font-medium px-2 py-0.5 rounded-full">Open</span>}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-slate-800 text-sm leading-snug mb-1 group-hover:text-teal-600 transition-colors">
            {attraction.name}
          </h3>
          <p className="text-xs text-slate-400 mb-3 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Sentosa Island
          </p>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400">From </span>
              <span className="text-base font-bold text-teal-600">SGD {minPrice}</span>
              <span className="text-xs text-slate-400"> / pax</span>
            </div>
            <span className="text-xs font-medium text-teal-600 group-hover:underline">
              View details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
