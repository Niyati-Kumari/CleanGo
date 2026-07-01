import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PartnerLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await login(form);
      if (user.role !== 'cleaner') {
        setError('This account is not a partner account');
        return;
      }
      navigate('/partner');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <Link to="/partner/register" className="mb-4 inline-block text-sm text-brand-600">
        ← Become a partner
      </Link>

      <h1 className="mb-2 text-2xl font-bold">Partner login</h1>
      <p className="mb-6 text-slate-500">Manage orders, prices, and earnings.</p>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
        <input
          required
          type="tel"
          placeholder="Phone number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-brand-600 py-3 font-semibold text-white disabled:opacity-60"
        >
          {loading ? 'Logging in…' : 'Login'}
        </button>
      </form>

      <p className="mt-4 rounded-xl bg-slate-100 p-3 text-center text-sm text-slate-600">
        Demo partner: phone <strong>8888888888</strong> · password <strong>demo123</strong>
      </p>
    </div>
  );
}
