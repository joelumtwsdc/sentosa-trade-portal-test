import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrdersContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const TIER_COLORS: Record<string, 'teal' | 'amber' | 'slate' | 'purple'> = {
  standard: 'slate',
  silver: 'slate',
  gold: 'amber',
  platinum: 'purple',
};

const TIER_BENEFITS: Record<string, string[]> = {
  gold: [
    'Priority booking confirmation within 2 hours',
    'Dedicated account manager: Marcus Lim (+65 8123 9900)',
    'Net-30 payment terms for orders over SGD 500',
    'Early access to seasonal promotions and new listings',
    'Monthly consolidated invoicing available',
  ],
};

export function AccountPage() {
  const { agent, logout } = useAuth();
  const { totalSpendYTD } = useOrders();

  useEffect(() => { document.title = 'Account — Sentosa Trade Portal'; }, []);

  if (!agent) return null;

  const creditUsed = (agent.ytdSpend / agent.creditLimit) * 100;
  const tierLabel = agent.accountTier.charAt(0).toUpperCase() + agent.accountTier.slice(1);
  const benefits = TIER_BENEFITS[agent.accountTier] ?? [];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Account</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage your agent profile and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <Card className="lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center mb-4">
              <span className="text-teal-700 text-2xl font-bold">
                {agent.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-slate-800">{agent.name}</h2>
            <p className="text-sm text-slate-500">{agent.company}</p>
            <div className="mt-3">
              <Badge color={TIER_COLORS[agent.accountTier]} size="md">
                {tierLabel} Agent
              </Badge>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-slate-100 space-y-3">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {agent.email}
            </div>
            {agent.phone && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {agent.phone}
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Member since {new Date(agent.joinedAt).toLocaleDateString('en-SG', { year: 'numeric', month: 'long' })}
            </div>
          </div>

          <div className="mt-5">
            <Button variant="ghost" fullWidth onClick={logout} size="sm" className="text-slate-500">
              Sign out
            </Button>
          </div>
        </Card>

        {/* Stats & benefits */}
        <div className="lg:col-span-2 space-y-5">
          {/* Credit utilisation */}
          <Card>
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Credit & Spend</h3>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">YTD Spend</p>
                <p className="text-2xl font-bold text-slate-800">
                  SGD {totalSpendYTD.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Credit Limit</p>
                <p className="text-2xl font-bold text-slate-800">
                  SGD {agent.creditLimit.toLocaleString()}
                </p>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                <span>Credit utilisation</span>
                <span>{Math.round(creditUsed)}% used</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={['h-full rounded-full transition-all', creditUsed > 80 ? 'bg-coral-500' : 'bg-teal-500'].join(' ')}
                  style={{ width: `${Math.min(creditUsed, 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1.5">
                SGD {(agent.creditLimit - agent.ytdSpend).toLocaleString()} available
              </p>
            </div>
          </Card>

          {/* Tier benefits */}
          {benefits.length > 0 && (
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-sm font-semibold text-slate-700">{tierLabel} Tier Benefits</h3>
                <Badge color={TIER_COLORS[agent.accountTier]}>{tierLabel}</Badge>
              </div>
              <ul className="space-y-2.5">
                {benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <svg className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>

      {/* Placeholder settings sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'Notification Preferences', desc: 'Manage email and SMS alerts for order confirmations, reminders, and promotions.' },
          { title: 'Password & Security', desc: 'Update your password and enable two-factor authentication for enhanced security.' },
          { title: 'API Access', desc: 'Generate API keys for integration with your own booking or CRM systems.' },
        ].map(item => (
          <Card key={item.title} className="relative overflow-hidden">
            <span className="absolute top-3 right-3">
              <Badge color="slate">Coming Soon</Badge>
            </span>
            <h3 className="text-sm font-semibold text-slate-700 mb-1 pr-24">{item.title}</h3>
            <p className="text-xs text-slate-400">{item.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
