import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import StarRating from '../components/StarRating';
import { useBooking } from '../context/BookingContext';

export default function CleanersPage() {
  const navigate = useNavigate();
  const { city, cart, selectCleaner } = useBooking();
  const [cleaners, setCleaners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const itemIds = Object.keys(cart).filter((id) => cart[id] > 0);

  useEffect(() => {
    if (itemIds.length === 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    api
      .getCleaners({ city, items: itemIds.join(',') })
      .then(({ cleaners: data }) => setCleaners(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [city, cart]);

  if (itemIds.length === 0) {
    return (
      <div className="text-center">
        <p className="mb-4 text-slate-500">Add items before comparing cleaners.</p>
        <Link to="/" className="text-brand-600 hover:underline">
          Browse services
        </Link>
      </div>
    );
  }

  return (
    <div>
      <button type="button" onClick={() => navigate(-1)} className="mb-4 text-sm text-brand-600">
        ← Back
      </button>

      <h1 className="mb-1 text-2xl font-bold">Choose a cleaner</h1>
      <p className="mb-6 text-slate-500">Compare prices and delivery times in {city}</p>

      {loading && <p className="text-slate-500">Finding cleaners…</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="space-y-4">
        {cleaners.map((cleaner) => (
          <button
            key={cleaner._id}
            type="button"
            onClick={() => {
              selectCleaner(cleaner);
              navigate('/schedule');
            }}
            className="w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-brand-400 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">{cleaner.shopName}</h2>
                  {cleaner.isFeatured && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500">{cleaner.address?.line1}</p>
                <StarRating rating={cleaner.rating} count={cleaner.reviewCount} />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-brand-700">₹{cleaner.quote.total}</p>
                <p className="text-xs text-slate-500">
                  incl. ₹{cleaner.deliveryFee} delivery
                </p>
              </div>
            </div>
            <div className="mt-3 flex gap-4 text-sm text-slate-600">
              <span>🚚 {cleaner.deliveryHours}h delivery</span>
              <span>Subtotal ₹{cleaner.quote.subtotal}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
