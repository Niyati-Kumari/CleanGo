import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SERVICE_OPTIONS = [
  { id: 'clothes', label: 'Clothes' },
  { id: 'shoes', label: 'Shoes' },
  { id: 'bags', label: 'Bags' },
  { id: 'sofa', label: 'Sofa' },
  { id: 'curtains', label: 'Curtains' },
];

export default function PartnerRegisterPage() {
  const navigate = useNavigate();
  const { partnerRegister } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    shopName: '',
    ownerName: '',
    shopPhone: '',
    line1: '',
    city: 'Delhi',
    pincode: '',
    deliveryHours: 48,
    deliveryFee: 50,
    services: ['clothes'],
    accountName: '',
    accountNumber: '',
    ifsc: '',
  });

  function toggleService(id) {
    setForm((f) => ({
      ...f,
      services: f.services.includes(id)
        ? f.services.filter((s) => s !== id)
        : [...f.services, id],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await partnerRegister({
        name: form.name,
        phone: form.phone,
        email: form.email,
        password: form.password,
        shopName: form.shopName,
        ownerName: form.ownerName || form.name,
        shopPhone: form.shopPhone || form.phone,
        address: { line1: form.line1, city: form.city, pincode: form.pincode },
        services: form.services,
        deliveryHours: Number(form.deliveryHours),
        deliveryFee: Number(form.deliveryFee),
        bankDetails: {
          accountName: form.accountName,
          accountNumber: form.accountNumber,
          ifsc: form.ifsc,
        },
      });
      navigate('/partner');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/" className="mb-4 inline-block text-sm text-brand-600">
        ← Back to CleanGo
      </Link>

      <h1 className="mb-2 text-3xl font-bold">Become a Partner</h1>
      <p className="mb-8 text-slate-500">
        Register your dry cleaning shop and start receiving online orders.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 font-semibold">Account</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              required
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
            />
            <input
              required
              type="tel"
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
            />
            <input
              type="email"
              placeholder="Email (optional)"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
            />
            <input
              required
              type="password"
              minLength={6}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
            />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 font-semibold">Shop details</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              required
              placeholder="Shop name"
              value={form.shopName}
              onChange={(e) => setForm({ ...form, shopName: e.target.value })}
              className="rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
            />
            <input
              placeholder="Owner name"
              value={form.ownerName}
              onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
              className="rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
            />
            <input
              required
              placeholder="Shop address"
              value={form.line1}
              onChange={(e) => setForm({ ...form, line1: e.target.value })}
              className="sm:col-span-2 rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
            />
            <input
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
            />
            <input
              placeholder="Pincode"
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              className="rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
            />
            <input
              type="number"
              min={12}
              placeholder="Delivery hours"
              value={form.deliveryHours}
              onChange={(e) => setForm({ ...form, deliveryHours: e.target.value })}
              className="rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
            />
            <input
              type="number"
              min={0}
              placeholder="Delivery fee (₹)"
              value={form.deliveryFee}
              onChange={(e) => setForm({ ...form, deliveryFee: e.target.value })}
              className="rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
            />
          </div>

          <p className="mb-2 mt-4 text-sm font-medium text-slate-700">Services offered</p>
          <div className="flex flex-wrap gap-2">
            {SERVICE_OPTIONS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => toggleService(id)}
                className={`rounded-full px-3 py-1.5 text-sm ${
                  form.services.includes(id)
                    ? 'bg-brand-600 text-white'
                    : 'border border-slate-200 bg-slate-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 font-semibold">Bank details</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              placeholder="Account holder name"
              value={form.accountName}
              onChange={(e) => setForm({ ...form, accountName: e.target.value })}
              className="rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
            />
            <input
              placeholder="Account number"
              value={form.accountNumber}
              onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
              className="rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
            />
            <input
              placeholder="IFSC code"
              value={form.ifsc}
              onChange={(e) => setForm({ ...form, ifsc: e.target.value })}
              className="rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
            />
          </div>
        </section>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading || form.services.length === 0}
          className="w-full rounded-xl bg-brand-600 py-3 font-semibold text-white disabled:opacity-60 hover:bg-brand-700"
        >
          {loading ? 'Submitting…' : 'Submit application'}
        </button>

        <p className="text-center text-sm text-slate-500">
          Already a partner?{' '}
          <Link to="/partner/login" className="text-brand-600 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}
