import { useEffect, useMemo, useState } from 'react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function PartnerPricesPage() {
  const { cleaner, refreshProfile } = useAuth();
  const [catalog, setCatalog] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    Promise.all([api.getCatalog(), api.partnerGetProfile()])
      .then(([{ catalog: cat }, { cleaner: profile }]) => {
        setCatalog(cat);
        const map = {};
        for (const p of profile.prices) map[p.itemId] = p.price;
        setPrices(map);
      })
      .finally(() => setLoading(false));
  }, []);

  const visibleCategories = useMemo(
    () => catalog.filter((c) => !cleaner?.services?.length || cleaner.services.includes(c.id)),
    [catalog, cleaner]
  );

  async function handleSave() {
    setSaving(true);
    setMessage('');
    try {
      const payload = Object.entries(prices).map(([itemId, price]) => ({
        itemId,
        price: Number(price),
      }));
      await api.partnerUpdatePrices({ prices: payload });
      await refreshProfile();
      setMessage('Prices updated successfully');
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-slate-500">Loading prices…</p>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Price management</h1>
          <p className="text-slate-500">Set your rates for each service item.</p>
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="rounded-xl bg-brand-600 px-5 py-2.5 font-semibold text-white disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save prices'}
        </button>
      </div>

      {message && (
        <p className={`mb-4 text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}

      <div className="space-y-6">
        {visibleCategories.map((category) => (
          <section key={category.id} className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="mb-4 font-semibold">
              {category.icon} {category.name}
            </h2>
            <div className="space-y-3">
              {category.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-slate-400">Market base: ₹{item.basePrice}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">₹</span>
                    <input
                      type="number"
                      min={0}
                      value={prices[item.id] ?? item.basePrice}
                      onChange={(e) =>
                        setPrices((prev) => ({ ...prev, [item.id]: e.target.value }))
                      }
                      className="w-24 rounded-lg border border-slate-200 px-3 py-2 text-right focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
