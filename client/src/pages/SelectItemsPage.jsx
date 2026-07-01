import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { useBooking } from '../context/BookingContext';

export default function SelectItemsPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { cart, setCartItem, cartCount } = useBooking();
  const [catalog, setCatalog] = useState([]);

  useEffect(() => {
    api.getCatalog().then(({ catalog: data }) => setCatalog(data));
  }, []);

  const category = useMemo(
    () => catalog.find((c) => c.id === categoryId),
    [catalog, categoryId]
  );

  const estimatedTotal = useMemo(() => {
    if (!category) return 0;
    return category.items.reduce((sum, item) => {
      const qty = cart[item.id] || 0;
      return sum + qty * item.basePrice;
    }, 0);
  }, [category, cart]);

  if (!category && catalog.length > 0) {
    return (
      <div>
        <p className="text-slate-500">Category not found.</p>
        <Link to="/" className="text-brand-600 hover:underline">
          Go home
        </Link>
      </div>
    );
  }

  return (
    <div>
      <button type="button" onClick={() => navigate(-1)} className="mb-4 text-sm text-brand-600">
        ← Back
      </button>

      <div className="mb-6 flex items-center gap-3">
        <span className="text-4xl">{category?.icon}</span>
        <div>
          <h1 className="text-2xl font-bold">{category?.name}</h1>
          <p className="text-slate-500">Select items and quantities</p>
        </div>
      </div>

      <div className="space-y-3">
        {category?.items.map((item) => {
          const qty = cart[item.id] || 0;
          return (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-slate-500">From ₹{item.basePrice}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCartItem(item.id, Math.max(0, qty - 1))}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-lg"
                >
                  −
                </button>
                <span className="w-6 text-center font-semibold">{qty}</span>
                <button
                  type="button"
                  onClick={() => setCartItem(item.id, qty + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-lg text-white"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="sticky bottom-4 mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-slate-600">{cartCount} items selected</span>
          <span className="text-lg font-bold">Est. ₹{estimatedTotal}</span>
        </div>
        <button
          type="button"
          disabled={cartCount === 0}
          onClick={() => navigate('/cleaners')}
          className="w-full rounded-xl bg-brand-600 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 hover:bg-brand-700"
        >
          Compare cleaners
        </button>
      </div>
    </div>
  );
}
