import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import StepBar from '../components/StepBar';
import StarRating from '../components/StarRating';

export default function OrderTrackingPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadOrder() {
    const [{ order: data }, { statuses: statusList }] = await Promise.all([
      api.getOrder(id),
      api.getOrderStatuses(),
    ]);
    setOrder(data);
    setStatuses(statusList);
  }

  useEffect(() => {
    loadOrder()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function demoProgress() {
    try {
      const { order: updated } = await api.progressOrder(id);
      setOrder(updated);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p className="text-slate-500">Loading order…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!order) return null;

  const awaitingCleaner = order.cleanerDecision === 'pending';
  const rejected = order.cleanerDecision === 'rejected';

  return (
    <div>
      <Link to="/orders" className="mb-4 inline-block text-sm text-brand-600">
        ← All orders
      </Link>

      {awaitingCleaner && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Waiting for {order.cleaner?.shopName} to accept your order. You'll be notified once confirmed.
        </div>
      )}

      {rejected && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          This order was declined by the cleaner. Please try another shop.
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Order {order.orderNumber}</p>
          <h1 className="text-2xl font-bold">{order.cleaner?.shopName}</h1>
          <StarRating rating={order.cleaner?.rating || 0} />
        </div>
        <div className="rounded-xl bg-brand-50 px-4 py-2 text-right">
          <p className="text-sm text-brand-700">Total paid</p>
          <p className="text-xl font-bold text-brand-900">₹{order.total}</p>
        </div>
      </div>

      <StepBar steps={statuses} current={awaitingCleaner || rejected ? '' : order.status} />

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="mb-4 font-semibold">Tracking timeline</h2>
        <ol className="space-y-4">
          {statuses.map((step) => {
            const historyEntry = order.statusHistory?.find((h) => h.status === step.key);
            const activeIdx = statuses.findIndex((s) => s.key === order.status);
            const stepIdx = statuses.findIndex((s) => s.key === step.key);
            const done = stepIdx <= activeIdx;

            return (
              <li key={step.key} className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    done ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {done ? '✓' : stepIdx + 1}
                </span>
                <div>
                  <p className={`font-medium ${done ? 'text-slate-900' : 'text-slate-400'}`}>
                    {step.label}
                  </p>
                  {historyEntry && (
                    <p className="text-xs text-slate-400">
                      {new Date(historyEntry.at).toLocaleString('en-IN')}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 text-sm">
        <h2 className="mb-2 font-semibold">Pickup</h2>
        <p>
          {order.pickupSlot.date} · {order.pickupSlot.timeWindow}
        </p>
        <p className="mt-2 text-slate-500">
          {order.deliveryAddress?.line1}, {order.deliveryAddress?.city}
        </p>
        {order.status !== 'delivered' && (
          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-amber-800">
            Delivery OTP: <strong>{order.deliveryOtp}</strong> — share when clothes arrive
          </p>
        )}
      </section>

      {order.status !== 'delivered' && !awaitingCleaner && !rejected && order.cleanerDecision === 'accepted' && (
        <button
          type="button"
          onClick={demoProgress}
          className="rounded-xl border border-dashed border-brand-300 px-4 py-2 text-sm text-brand-700 hover:bg-brand-50"
        >
          Demo: advance to next status
        </button>
      )}
    </div>
  );
}
