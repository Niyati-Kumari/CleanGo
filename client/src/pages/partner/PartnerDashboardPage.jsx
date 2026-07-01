import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import ApprovalBanner from '../../components/ApprovalBanner';
import { useAuth } from '../../context/AuthContext';

export default function PartnerDashboardPage() {
  const { cleaner } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.partnerDashboard(), api.partnerOrders('new')])
      .then(([dash, orders]) => {
        setStats(dash.stats);
        setRecentOrders(orders.orders.slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate-500">Loading dashboard…</p>;

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">{cleaner?.shopName || 'Partner dashboard'}</h1>
      <p className="mb-6 text-slate-500">Welcome back, {cleaner?.ownerName}</p>

      <ApprovalBanner status={stats?.approvalStatus} />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'New orders', value: stats?.pendingOrders, href: '/partner/orders?filter=new' },
          { label: 'Active orders', value: stats?.activeOrders, href: '/partner/orders?filter=active' },
          { label: 'Completed', value: stats?.completedOrders, href: '/partner/orders?filter=completed' },
          { label: 'Total earnings', value: `₹${stats?.totalEarnings || 0}`, href: '/partner/earnings' },
        ].map(({ label, value, href }) => (
          <Link
            key={label}
            to={href}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand-300"
          >
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-bold text-brand-700">{value ?? 0}</p>
          </Link>
        ))}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">New orders</h2>
          <Link to="/partner/orders?filter=new" className="text-sm text-brand-600 hover:underline">
            View all
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-sm text-slate-500">No pending orders right now.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recentOrders.map((order) => (
              <li key={order._id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-slate-500">
                    {order.customer?.name} · ₹{order.subtotal}
                  </p>
                </div>
                <Link
                  to={`/partner/orders/${order._id}`}
                  className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white"
                >
                  Review
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
