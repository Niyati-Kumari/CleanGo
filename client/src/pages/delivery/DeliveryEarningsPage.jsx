import { useEffect, useState } from 'react';
import { api } from '../../api/client';

export default function DeliveryEarningsPage() {
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDeliveryEarnings()
      .then(setEarnings)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-slate-500">Loading earnings...</p>;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Your Earnings</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total Earnings</p>
          <p className="mt-2 text-3xl font-bold text-green-600">₹{earnings?.totalEarnings?.toFixed(0) || 0}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total Deliveries</p>
          <p className="mt-2 text-3xl font-bold">{earnings?.deliveryCount || 0}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Rating</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">⭐ {earnings?.rating?.toFixed(1) || 4.5}</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-3 font-semibold">Payment Info</h2>
        <p className="text-sm text-slate-600">
          Earnings are calculated at 40% of the delivery fee per order.
          Payments are processed weekly to your registered bank account.
        </p>
      </div>
    </div>
  );
}
