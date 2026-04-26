import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';
import { recommendations } from '../data';
import { StatCard } from '../components/dashboard/StatCard';
import { MonthlyBarChart } from '../components/dashboard/MonthlyBarChart';
import { TopAttractionsChart } from '../components/dashboard/TopAttractionsChart';
import { RecommendationCard } from '../components/dashboard/RecommendationCard';

function OrdersIcon() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;
}
function SpendIcon() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}
function AvgIcon() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
}
function ActiveIcon() {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 13l4 4L19 7" /></svg>;
}

export function DashboardPage() {
  const { agent } = useAuth();
  const { totalSpendYTD, totalOrdersYTD, avgOrderValue, activeBookingsCount, monthlySpend, topAttractions } = useOrders();

  useEffect(() => { document.title = 'Dashboard — Sentosa Trade Portal'; }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {greeting()}, {agent?.name.split(' ')[0]}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {agent?.company} · {new Date().toLocaleDateString('en-SG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <Link
          to="/catalogue"
          className="inline-flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Book Tickets
        </Link>
      </div>

      {/* KPI stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Orders YTD"
          value={totalOrdersYTD.toString()}
          subtext="Jan – present, 2025"
          icon={<OrdersIcon />}
          trend={{ value: '14%', positive: true }}
        />
        <StatCard
          label="Total Spend YTD"
          value={`SGD ${totalSpendYTD.toLocaleString()}`}
          subtext="Confirmed orders only"
          icon={<SpendIcon />}
          trend={{ value: 'SGD 3,120', positive: true }}
        />
        <StatCard
          label="Avg Order Value"
          value={`SGD ${avgOrderValue.toLocaleString()}`}
          subtext="Per transaction"
          icon={<AvgIcon />}
        />
        <StatCard
          label="Active Bookings"
          value={activeBookingsCount.toString()}
          subtext="Confirmed + pending"
          icon={<ActiveIcon />}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <MonthlyBarChart data={monthlySpend} />
        </div>
        <div className="lg:col-span-1">
          <TopAttractionsChart data={topAttractions} />
        </div>
      </div>

      {/* AI Recommendations */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-base font-semibold text-slate-700">Recommended for You</h2>
          <span className="text-xs bg-teal-50 text-teal-600 border border-teal-100 px-2 py-0.5 rounded-full font-medium">
            AI-powered
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-4">Based on your booking history and patterns from similar Gold-tier agents</p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {recommendations.map(rec => (
            <RecommendationCard key={rec.id} rec={rec} />
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/orders" className="bg-white rounded-xl border border-slate-100 shadow-card p-4 flex items-center gap-3 hover:shadow-card-hover transition-shadow group">
          <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-teal-50 transition-colors">
            <svg className="w-5 h-5 text-slate-400 group-hover:text-teal-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">View All Orders</p>
            <p className="text-xs text-slate-400">Full purchase history</p>
          </div>
        </Link>
        <Link to="/catalogue" className="bg-white rounded-xl border border-slate-100 shadow-card p-4 flex items-center gap-3 hover:shadow-card-hover transition-shadow group">
          <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-teal-50 transition-colors">
            <svg className="w-5 h-5 text-slate-400 group-hover:text-teal-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">Browse Catalogue</p>
            <p className="text-xs text-slate-400">All 10 Sentosa attractions</p>
          </div>
        </Link>
        <Link to="/account" className="bg-white rounded-xl border border-slate-100 shadow-card p-4 flex items-center gap-3 hover:shadow-card-hover transition-shadow group">
          <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-teal-50 transition-colors">
            <svg className="w-5 h-5 text-slate-400 group-hover:text-teal-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">Account Settings</p>
            <p className="text-xs text-slate-400">Profile · Gold tier benefits</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
