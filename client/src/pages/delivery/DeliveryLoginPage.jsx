import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function DeliveryLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await api.login({ phone, password });
      if (data.user.role !== 'delivery') {
        setError('This is not a delivery partner account');
        return;
      }
      await login({ phone, password });
      navigate('/delivery', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <Link to="/" className="mb-4 inline-block text-sm text-brand-600">
        ← Back to home
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold">Delivery Partner Login</h1>
        <p className="mb-6 text-sm text-slate-500">Access your delivery dashboard</p>

        {location.state?.message && (
          <div className="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-600">
            {location.state.message}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Phone Number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand-600 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 hover:bg-brand-700"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          New delivery partner?{' '}
          <Link to="/delivery/register" className="text-brand-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
