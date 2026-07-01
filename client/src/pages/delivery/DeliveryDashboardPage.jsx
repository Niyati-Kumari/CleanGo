import { useEffect, useState } from 'react';
import { api } from '../../api/client';

export default function DeliveryDashboardPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDeliveryProfile()
      .then(setProfile)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-slate-500">Loading...</p>;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Welcome, {profile?.name}</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Status</p>
          <p className="mt-2 text-2xl font-bold">
            {profile?.status === 'approved' ? (
              <span className="text-green-600">Approved</span>
            ) : (
              <span className="text-amber-600">{profile?.status}</span>
            )}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Online Status</p>
          <p className="mt-2 text-2xl font-bold">
            {profile?.isOnline ? (
              <span className="text-green-600">Online</span>
            ) : (
              <span className="text-slate-400">Offline</span>
            )}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total Deliveries</p>
          <p className="mt-2 text-2xl font-bold">{profile?.deliveryCount || 0}</p>
        </div>
      </div>

      {profile?.status === 'approved' && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="mb-3 font-semibold">Go Online to Receive Orders</h2>
          <p className="mb-4 text-sm text-slate-500">
            Toggle your status to start receiving delivery requests in your area.
          </p>
          <button
            type="button"
            onClick={() => api.toggleDeliveryOnline().then(() => window.location.reload())}
            className={`rounded-xl px-6 py-3 font-semibold text-white ${
              profile?.isOnline ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {profile?.isOnline ? 'Go Offline' : 'Go Online'}
          </button>
        </div>
      )}

      {profile?.status === 'pending' && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="mb-2 font-semibold text-amber-800">Account Pending Approval</h2>
          <p className="text-sm text-amber-700">
            Your application is under review. We'll notify you once it's approved.
          </p>
        </div>
      )}
    </div>
  );
}
