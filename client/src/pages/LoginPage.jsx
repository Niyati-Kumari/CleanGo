import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from || '/';

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        const loggedIn = await login({ phone: form.phone, password: form.password });
        if (loggedIn.role === 'cleaner') {
          navigate('/partner');
          return;
        }
        if (loggedIn.role === 'delivery') {
          navigate('/delivery');
          return;
        }
        if (loggedIn.role === 'admin') {
          navigate('/admin');
          return;
        }
      } else {
        await register(form);
      }
      navigate(redirectTo);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md animate-fade-in">
      <div className="mb-8 text-center">
        <Link to="/" className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 mb-6">
          <span>←</span>
          <span>Back to home</span>
        </Link>
        <h1 className="mb-2 text-4xl font-bold gradient-text">
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h1>
        <p className="text-slate-600">
          {mode === 'login' ? 'Book pickup, track orders, and pay online.' : 'Join thousands of happy customers'}
        </p>
      </div>

      <div className="mb-6 flex rounded-2xl bg-slate-100/50 p-1.5 backdrop-blur-sm">
        {['login', 'register'].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError('');
            }}
            className={`flex-1 rounded-xl py-3 text-sm font-medium capitalize transition-all ${
              mode === m
                ? 'bg-white shadow-lg text-brand-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 glass-card rounded-3xl p-8">
        {mode === 'register' && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Full name</label>
            <input
              type="text"
              placeholder="Enter your name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 focus:outline-none transition-all"
            />
          </div>
        )}
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Phone number</label>
          <input
            type="tel"
            placeholder="Enter phone number"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 focus:outline-none transition-all"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            placeholder="Min 6 characters"
            required
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 focus:outline-none transition-all"
          />
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 py-3.5 font-semibold text-white shadow-lg hover:shadow-xl hover:from-brand-700 hover:to-brand-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Please wait…
            </span>
          ) : (
            mode === 'login' ? 'Login' : 'Create account'
          )}
        </button>
      </form>

      {mode === 'login' && (
        <div className="mt-6 space-y-3">
          <div className="rounded-2xl bg-gradient-to-r from-brand-50 to-accent-50 p-6 text-center border border-brand-100">
            <p className="mb-2 text-sm font-medium text-slate-700">Customer Demo</p>
            <p className="text-sm text-slate-600">
              Phone: <strong className="text-brand-600">9999999999</strong> · Password: <strong className="text-brand-600">demo123</strong>
            </p>
          </div>
          <div className="rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100 p-6 text-center border border-slate-200">
            <p className="mb-2 text-sm font-medium text-slate-700">Admin Demo</p>
            <p className="text-sm text-slate-600">
              Phone: <strong className="text-slate-800">0000000000</strong> · Password: <strong className="text-slate-800">admin123</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
