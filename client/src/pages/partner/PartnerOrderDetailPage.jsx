import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../api/client';
import ApprovalBanner from '../../components/ApprovalBanner';
import { useAuth } from '../../context/AuthContext';

const STATUS_LABELS = {
  pickup_scheduled: 'Pickup scheduled',
  picked_up: 'Clothes picked',
  cleaning_started: 'Cleaning started',
  quality_check: 'Quality check',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const NEXT_STATUS = {
  pickup_scheduled: 'picked_up',
  picked_up: 'cleaning_started',
  cleaning_started: 'quality_check',
  quality_check: 'out_for_delivery',
  out_for_delivery: 'delivered',
};

export default function PartnerOrderDetailPage() {
  const { id } = useParams();
  const { cleaner } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadOrder() {
    const { order: data } = await api.partnerOrder(id);
    setOrder(data);
  }

  useEffect(() => {
    loadOrder()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleAccept() {
    setActionLoading(true);
    setError('');
    try {
      const { order: updated } = await api.partnerAcceptOrder(id);
      setOrder(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReject() {
    setActionLoading(true);
    setError('');
    try {
      const { order: updated } = await api.partnerRejectOrder(id, {
        reason: 'Unable to fulfill this order',
      });
      setOrder(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleAdvanceStatus() {
    const next = NEXT_STATUS[order.status];
    if (!next) return;

    setActionLoading(true);
    setError('');
    try {
      const { order: updated } = await api.partnerUpdateOrderStatus(id, { status: next });
      setOrder(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return <p className="text-slate-500">Loading order…</p>;
  if (!order) return <p className="text-red-600">{error || 'Order not found'}</p>;

  const nextStatus = NEXT_STATUS[order.status];
  const canAccept = order.cleanerDecision === 'pending';
  const canUpdate =
    order.cleanerDecision === 'accepted' && order.status !== 'delivered' && order.status !== 'cancelled';

  return (
    <div>
      <Link to="/partner/orders" className="mb-4 inline-block text-sm text-brand-600">
        ← Back to orders
      </Link>

      <ApprovalBanner status={cleaner?.status} />

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{order.orderNumber}</p>
          <h1 className="text-2xl font-bold">Order from {order.customer?.name}</h1>
          <p className="text-slate-500">{order.customer?.phone}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-brand-700">₹{order.subtotal}</p>
          <p className="text-sm text-slate-500">Your earning after commission</p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-3 font-semibold">Items</h2>
          <ul className="space-y-2 text-sm">
            {order.items.map((item) => (
              <li key={item.itemId} className="flex justify-between">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>₹{item.lineTotal}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 border-t border-slate-100 pt-3 text-sm">
            <div className="flex justify-between">
              <span>Delivery fee (customer)</span>
              <span>₹{order.deliveryFee}</span>
            </div>
            <div className="mt-1 flex justify-between font-semibold">
              <span>Order total</span>
              <span>₹{order.total}</span>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-3 font-semibold">Pickup & delivery</h2>
          <p className="text-sm">
            <strong>Pickup:</strong> {order.pickupSlot.date} · {order.pickupSlot.timeWindow}
          </p>
          <p className="mt-2 text-sm">
            <strong>Deliver to:</strong> {order.deliveryAddress?.line1}, {order.deliveryAddress?.city}{' '}
            {order.deliveryAddress?.pincode}
          </p>
          <p className="mt-3 text-sm">
            <strong>Status:</strong> {STATUS_LABELS[order.status]}
          </p>
          <p className="mt-1 text-sm">
            <strong>Decision:</strong>{' '}
            {order.cleanerDecision === 'pending'
              ? 'Awaiting your response'
              : order.cleanerDecision}
          </p>
        </section>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {canAccept && (
        <div className="flex flex-wrap gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="w-full text-sm font-medium text-amber-900">Accept this order?</p>
          <button
            type="button"
            disabled={actionLoading || cleaner?.status !== 'approved'}
            onClick={handleAccept}
            className="rounded-xl bg-green-600 px-6 py-2.5 font-semibold text-white disabled:opacity-50"
          >
            Yes, accept
          </button>
          <button
            type="button"
            disabled={actionLoading}
            onClick={handleReject}
            className="rounded-xl border border-red-300 bg-white px-6 py-2.5 font-semibold text-red-600"
          >
            No, reject
          </button>
        </div>
      )}

      {canUpdate && nextStatus && (
        <button
          type="button"
          disabled={actionLoading}
          onClick={handleAdvanceStatus}
          className="mt-4 rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white disabled:opacity-60"
        >
          Mark as: {STATUS_LABELS[nextStatus]}
        </button>
      )}

      {order.status === 'delivered' && (
        <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">
          Order completed. Earnings will reflect in your dashboard.
        </p>
      )}

      {order.cleanerDecision === 'rejected' && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
          You rejected this order.
        </p>
      )}
    </div>
  );
}
