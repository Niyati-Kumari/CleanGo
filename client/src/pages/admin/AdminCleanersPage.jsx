import { useEffect, useState } from 'react';
import { api } from '../../api/client';

export default function AdminCleanersPage() {
  const [cleaners, setCleaners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    loadCleaners();
  }, [filter]);

  const loadCleaners = () => {
    setLoading(true);
    api.adminCleaners(filter ? { status: filter } : {})
      .then((data) => setCleaners(data.cleaners || []))
      .finally(() => setLoading(false));
  };

  const handleApprove = async (id) => {
    try {
      await api.adminApproveCleaner(id);
      loadCleaners();
    } catch (err) {
      alert(err.message || 'Failed to approve');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.adminRejectCleaner(id);
      loadCleaners();
    } catch (err) {
      alert(err.message || 'Failed to reject');
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Cleaner Partners</h1>

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
          {cleaners.map((cleaner) => (
            <div
              key={cleaner._id}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{cleaner.shopName}</h3>
                  <p className="text-sm text-slate-500">{cleaner.ownerName}</p>
                  <p className="text-sm text-slate-500">{cleaner.phone}</p>
                  <p className="text-sm text-slate-500">{cleaner.address?.line1}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    cleaner.status === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : cleaner.status === 'pending'
                        ? 'bg-amber-100 text-amber-700'
                        : cleaner.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {cleaner.status}
                </span>
              </div>

              <div className="mb-4 flex gap-4 text-sm text-slate-600">
                <span>⭐ {cleaner.rating}</span>
                <span>{cleaner.reviewCount} reviews</span>
                <span>{cleaner.deliveryHours}h delivery</span>
              </div>

              {cleaner.status === 'pending' && (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleApprove(cleaner._id)}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReject(cleaner._id)}
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
          {cleaners.length === 0 && (
            <p className="text-center text-slate-500">No cleaners found</p>
          )}
        </div>
      )}
    </div>
  );
}
