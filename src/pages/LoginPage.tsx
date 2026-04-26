import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AuthLayout } from '../components/layout/AuthLayout';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('sarah.tan@horizontravel.sg');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { document.title = 'Sign In — Sentosa Trade Portal'; }, []);

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await login(email.trim(), password);
    setLoading(false);
    if (ok) {
      navigate('/dashboard', { replace: true });
    } else {
      setError('Invalid email or password. Please check your credentials.');
    }
  };

  return (
    <AuthLayout>
      <Card>
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-800">Welcome back</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to your agent account to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="email"
            label="Agent Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="agent@travelcompany.sg"
            required
            autoComplete="email"
          />
          <Input
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            autoComplete="current-password"
          />

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2.5">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button type="submit" fullWidth disabled={loading} size="lg">
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <div className="mt-5 pt-5 border-t border-slate-100">
          <p className="text-xs text-slate-400 text-center">
            Demo credentials: <span className="font-mono text-slate-500">sarah.tan@horizontravel.sg</span> / <span className="font-mono text-slate-500">password123</span>
          </p>
        </div>
      </Card>

      <div className="mt-4 flex justify-center gap-4">
        <a href="#" className="text-xs text-slate-400 hover:text-teal-600 transition-colors">Terms of Use</a>
        <span className="text-slate-200">·</span>
        <a href="#" className="text-xs text-slate-400 hover:text-teal-600 transition-colors">Privacy Policy</a>
        <span className="text-slate-200">·</span>
        <a href="#" className="text-xs text-slate-400 hover:text-teal-600 transition-colors">Support</a>
      </div>
    </AuthLayout>
  );
}
