import { useEffect, useState } from 'react';
import { api } from '../../api/client';

export default function AdminDeliveryPartnersPage() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadPartners();
  }, [filter]);

  const loadPartners = () => {
    setLoading(true);
    api.adminDeliveryPartners(filter ? { status: filter } : {})
      .then((data) => setPartners(data.partners || []))
      .finally(() => setLoading(false));
  };

  const handleApprove = async (id) => {
    try {
      await api.adminApproveDeliveryPartner(id);
      loadPartners();
    } catch (err) {
      alert(err.message || 'Failed to approve');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.adminRejectDeliveryPartner(id);
      loadPartners();
    } catch (err) {
      alert(err.message || 'Failed to reject');
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Delivery Partners</h1>

      <div className="mb-4 flex gap-2">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-slate-200 px-4 py-2 focus:border-brand-500 focus:outline-none"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : (
        <div className="space-y-4">
          {partners.map((partner) => (
            <div
              key={partner._id}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{partner.name}</h3>
                  <p className="text-sm text-slate-500">{partner.phone}</p>
                  <p className="text-sm text-slate-500 capitalize">{partner.vehicleType} • {partner.vehicleNumber}</p>
                  <p className="text-sm text-slate-500">Area: {partner.area}</p>
                  <p className="text-sm text-slate-500">{partner.address?.line1}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    partner.status === 'approved' || partner.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : partner.status === 'pending'
                        ? 'bg-amber-100 text-amber-700'
                        : partner.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {partner.status}
                </span>
              </div>

              <div className="mb-4 flex gap-4 text-sm text-slate-600">
                <span>⭐ {partner.rating}</span>
                <span>{partner.deliveryCount} deliveries</span>
                <span>₹{partner.totalEarnings?.toFixed(0)} earned</span>
                <span className={partner.isOnline ? 'text-green-600' : 'text-slate-400'}>
                  {partner.isOnline ? '● Online' : '○ Offline'}
                </span>
              </div>

              {partner.status === 'pending' && (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleApprove(partner._id)}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReject(partner._id)}
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
          {partners.length === 0 && (
            <p className="text-center text-slate-500">No delivery partners found</p>
          )}
        </div>
      )}
    </div>
  );
}
