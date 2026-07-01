import { useEffect, useState } from 'react';
import { api } from '../../api/client';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.adminDashboard()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-slate-500">Loading...</p>;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total Users</p>
          <p className="mt-2 text-3xl font-bold">{stats?.users || 0}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Active Cleaners</p>
          <p className="mt-2 text-3xl font-bold">{stats?.cleaners || 0}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Delivery Partners</p>
          <p className="mt-2 text-3xl font-bold">{stats?.deliveryPartners || 0}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total Orders</p>
          <p className="mt-2 text-3xl font-bold">{stats?.orders || 0}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total Revenue</p>
          <p className="mt-2 text-3xl font-bold text-green-600">₹{stats?.revenue?.toFixed(0) || 0}</p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm text-amber-600">Pending Approvals</p>
          <p className="mt-2 text-3xl font-bold text-amber-700">
            {stats?.pendingCleaners + stats?.pendingDelivery || 0}
          </p>
          <p className="mt-1 text-xs text-amber-600">
            {stats?.pendingCleaners} cleaners, {stats?.pendingDelivery} delivery
          </p>
        </div>
      </div>

      {(stats?.pendingCleaners > 0 || stats?.pendingDelivery > 0) && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="mb-3 font-semibold text-amber-800">Action Required</h2>
          <p className="text-sm text-amber-700">
            You have pending partner applications that need approval.
          </p>
          <div className="mt-3 flex gap-3">
            {stats?.pendingCleaners > 0 && (
              <button
                type="button"
                onClick={() => window.location.href = '/admin/cleaners'}
                className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
              >
                Review Cleaners ({stats.pendingCleaners})
              </button>
            )}
            {stats?.pendingDelivery > 0 && (
              <button
                type="button"
                onClick={() => window.location.href = '/admin/delivery-partners'}
                className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
              >
                Review Delivery Partners ({stats.pendingDelivery})
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
