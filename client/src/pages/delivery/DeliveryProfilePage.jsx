import { useEffect, useState } from 'react';
import { api } from '../../api/client';

export default function DeliveryProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    address: { line1: '', city: '', pincode: '' },
    vehicleNumber: '',
  });

  useEffect(() => {
    api.getDeliveryProfile()
      .then((data) => {
        setProfile(data);
        setFormData({
          address: data.address || { line1: '', city: '', pincode: '' },
          vehicleNumber: data.vehicleNumber || '',
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      await api.updateDeliveryProfile(formData);
      setEditing(false);
      window.location.reload();
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return <p className="text-slate-500">Loading...</p>;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Profile</h1>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Personal Information</h2>
          {!editing && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50"
            >
              Edit
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-500">Name</p>
            <p className="font-medium">{profile?.name}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Phone</p>
            <p className="font-medium">{profile?.phone}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Vehicle Type</p>
            <p className="font-medium capitalize">{profile?.vehicleType}</p>
          </div>

          {editing ? (
            <div>
              <label className="mb-1 block text-sm font-medium">Vehicle Number</label>
              <input
                type="text"
                value={formData.vehicleNumber}
                onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
              />
            </div>
          ) : (
            <div>
              <p className="text-sm text-slate-500">Vehicle Number</p>
              <p className="font-medium">{profile?.vehicleNumber}</p>
            </div>
          )}

          <div>
            <p className="mb-2 text-sm font-medium">Address</p>
            {editing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={formData.address.line1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, line1: e.target.value },
                    })
                  }
                  placeholder="House / flat / street"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
                />
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, city: e.target.value },
                    })
                  }
                  placeholder="City"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
                />
                <input
                  type="text"
                  value={formData.address.pincode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, pincode: e.target.value },
                    })
                  }
                  placeholder="Pincode"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none"
                />
              </div>
            ) : (
              <div>
                <p className="font-medium">{profile?.address?.line1}</p>
                <p className="text-sm text-slate-600">
                  {profile?.address?.city}, {profile?.address?.pincode}
                </p>
              </div>
            )}
          </div>

          <div>
            <p className="text-sm text-slate-500">Service Area</p>
            <p className="font-medium">{profile?.area}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Account Status</p>
            <p className="font-medium capitalize">{profile?.status}</p>
          </div>
        </div>

        {editing && (
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-brand-600 px-6 py-2.5 font-semibold text-white hover:bg-brand-700"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-xl border border-slate-200 px-6 py-2.5 font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
