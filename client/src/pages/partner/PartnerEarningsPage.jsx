import { useEffect, useState } from 'react';
import { api } from '../../api/client';

export default function PartnerEarningsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .partnerEarnings()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate-500">Loading earnings…</p>;
  if (!data) return null;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Earnings</h1>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total earnings</p>
          <p className="text-3xl font-bold text-brand-700">₹{data.totalEarnings}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Platform commission</p>
          <p className="text-3xl font-bold text-slate-700">₹{data.totalCommission}</p>
          <p className="mt-1 text-xs text-slate-400">{Math.round(data.commissionRate * 100)}% per order</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Completed orders</p>
          <p className="text-3xl font-bold text-slate-700">{data.orderCount}</p>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white">
        <h2 className="border-b border-slate-100 px-5 py-4 font-semibold">Order history</h2>
        {data.orders.length === 0 ? (
          <p className="p-5 text-sm text-slate-500">No completed orders yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {data.orders.map((order) => (
              <li key={order.orderNumber} className="flex items-center justify-between px-5 py-4 text-sm">
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-slate-500">
                    {new Date(order.deliveredAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-brand-700">₹{order.earning}</p>
                  <p className="text-xs text-slate-400">
                    Subtotal ₹{order.subtotal} · Commission ₹{order.commission}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
