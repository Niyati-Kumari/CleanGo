import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

const STATUS_LABELS = {
  pickup_scheduled: 'Pickup scheduled',
  picked_up: 'Picked up',
  cleaning_started: 'Cleaning',
  quality_check: 'Quality check',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

function orderBadge(order) {
  if (order.cleanerDecision === 'pending') return 'Awaiting cleaner';
  if (order.cleanerDecision === 'rejected') return 'Cancelled';
  return STATUS_LABELS[order.status] || order.status;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getOrders()
      .then(({ orders: data }) => setOrders(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate-500">Loading orders…</p>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">My orders</h1>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
          <p className="mb-4 text-slate-500">No orders yet.</p>
          <Link to="/" className="font-medium text-brand-600 hover:underline">
            Book your first cleaning
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">{order.orderNumber}</p>
                  <h2 className="font-semibold">{order.cleaner?.shopName}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {order.items.length} item types · ₹{order.total}
                  </p>
                </div>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
                  {orderBadge(order)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
