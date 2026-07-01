import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../api/client';

const FILTERS = [
  { key: 'new', label: 'New' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
  { key: 'all', label: 'All' },
];

const DECISION_LABELS = {
  pending: 'Awaiting response',
  accepted: 'Accepted',
  rejected: 'Rejected',
};

export default function PartnerOrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get('filter') || 'new';
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .partnerOrders(filter)
      .then(({ orders: data }) => setOrders(data))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Orders</h1>

      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setSearchParams({ filter: key })}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              filter === key ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-slate-500">Loading orders…</p>
      ) : orders.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          No orders in this category.
        </p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/partner/orders/${order._id}`}
              className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">{order.orderNumber}</p>
                  <h2 className="font-semibold">{order.customer?.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {order.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Pickup: {order.pickupSlot.date} · {order.pickupSlot.timeWindow}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-brand-700">₹{order.subtotal}</p>
                  <span className="mt-1 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                    {DECISION_LABELS[order.cleanerDecision] || order.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
