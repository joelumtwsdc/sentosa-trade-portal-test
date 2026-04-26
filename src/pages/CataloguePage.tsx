import { useState, useMemo, useEffect } from 'react';
import { attractions } from '../data';
import type { Category, TicketKind } from '../types';
import { CATEGORY_LABELS } from '../types';
import { AttractionCard } from '../components/attraction/AttractionCard';
import { Input } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];

export function CataloguePage() {
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [ticketKind, setTicketKind] = useState<TicketKind | 'all'>('all');
  const [maxPrice, setMaxPrice] = useState(300);

  useEffect(() => { document.title = 'Attraction Catalogue — Sentosa Trade Portal'; }, []);

  const filtered = useMemo(() => {
    return attractions.filter(a => {
      if (search) {
        const q = search.toLowerCase();
        const match = a.name.toLowerCase().includes(q) || a.tags.some(t => t.includes(q)) || a.description.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (selectedCategories.length > 0 && !selectedCategories.includes(a.category)) return false;
      if (ticketKind !== 'all' && !a.ticketTypes.some(t => t.kind === ticketKind)) return false;
      const minPrice = Math.min(...a.ticketTypes.map(t => t.price));
      if (minPrice > maxPrice) return false;
      return true;
    });
  }, [search, selectedCategories, ticketKind, maxPrice]);

  const toggleCategory = (cat: Category) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Attraction Catalogue</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {filtered.length} of {attractions.length} attractions
        </p>
      </div>

      <div className="flex gap-6">
        {/* Filter sidebar */}
        <aside className="w-56 flex-shrink-0 space-y-6">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Search</label>
            <Input
              placeholder="USS, aquarium, family…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Ticket Type</p>
            {(['all', 'dated', 'open'] as const).map(k => (
              <label key={k} className="flex items-center gap-2.5 py-1 cursor-pointer">
                <input
                  type="radio"
                  name="ticketKind"
                  value={k}
                  checked={ticketKind === k}
                  onChange={() => setTicketKind(k)}
                  className="accent-teal-500"
                />
                <span className="text-sm text-slate-600 capitalize">{k === 'all' ? 'All types' : `${k.charAt(0).toUpperCase() + k.slice(1)} ticket`}</span>
              </label>
            ))}
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Category</p>
            <div className="space-y-1">
              {ALL_CATEGORIES.map(cat => (
                <label key={cat} className="flex items-center gap-2.5 py-0.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="accent-teal-500 rounded"
                  />
                  <span className="text-sm text-slate-600">{CATEGORY_LABELS[cat]}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Max Price: <span className="text-teal-600 font-bold">SGD {maxPrice}</span>
            </p>
            <input
              type="range"
              min={10}
              max={300}
              step={5}
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-full accent-teal-500"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>SGD 10</span>
              <span>SGD 300</span>
            </div>
          </div>

          {(search || selectedCategories.length > 0 || ticketKind !== 'all' || maxPrice < 300) && (
            <button
              onClick={() => { setSearch(''); setSelectedCategories([]); setTicketKind('all'); setMaxPrice(300); }}
              className="text-xs text-teal-600 hover:underline"
            >
              Clear filters
            </button>
          )}
        </aside>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <EmptyState
              title="No attractions match your filters"
              description="Try broadening your search or adjusting the category and price filters."
              action={{ label: 'Clear filters', onClick: () => { setSearch(''); setSelectedCategories([]); setTicketKind('all'); setMaxPrice(300); } }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map(a => <AttractionCard key={a.id} attraction={a} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
